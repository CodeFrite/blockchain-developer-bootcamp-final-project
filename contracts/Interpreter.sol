// SPDX-License-Identifier: GPL-3.0
pragma solidity 0.8.9;

/* EXTERNAL DEPENDENCIES */
import "@openzeppelin/contracts/access/Ownable.sol";

/* INTERNAL DEPENDENCIES */
import "./CommonStructs.sol";
import "./Instructions.sol";
import "./Deals.sol";

/**
 * @title Interpreter contract
 * @notice This contract is responsible for interpreting a single rule
 */

contract Interpreter is Ownable {
    
    /* STORAGE VARIABLES */

    /// @dev Proxy contract address
    address public proxyContractAddress;

    /// @dev Instructions contract reference
    Instructions public instructionsInstance;

    /// @dev InstructionsProvider contract reference
    address public instructionsProviderInstance;

    /// @dev Deals contract reference
    Deals public dealsInstance;

    /// @dev Track the msg.value already used by the rule being currently executed
    uint private msgValueUsed;
    
    /* EVENTS */

    /**
    * @dev Event emitted when the Proxy contract address is changed
    * @param _from Caller address
    * @param _old Old address of the Proxy contract
    * @param _new New address of the Proxy contract
    */
    event SetProxyContractAddress(address _from, address _old, address _new);
    
    /**
    * @dev Event emitted when the Instructions contract reference is changed
    * @param _from Caller address
    * @param _old Old address of the Instructions contract
    * @param _new New address of the Instructions contract
    */
    event SetInstructionsInstance(address _from, address _old, address _new);

    /**
    * @dev Event emitted when the InstructionsProvider contract reference is changed
    * @param _from Caller address
    * @param _old Old address of the InstructionsProvider contract
    * @param _new New address of the InstructionsProvider contract
    */
    event SetInstructionsProviderInstance(address _from, address _old, address _new);

    /**
    * @dev Event emitted when the Deals contract reference is changed
    * @param _from Caller address
    * @param _old Old address of the Deals contract
    * @param _new New address of the Deals contract
    */
    event SetDealsInstance(address _from, address _old, address _new);

    /**
    * @dev Event emitted when the Deals contract reference is changed
    * @param _from Caller address
    * @param _dealId Id of the deal to be executed
    * @param _ruleId Id of the rule to be executed
    * @param _articleId Id of the article to be executed
    */
    event InterpretArticle(address _from, uint _dealId, uint _ruleId, uint _articleId);

    /* MODIFIERS */ 
    
    /// @dev Modifier used to assess that the caller is the Proxy contract
    modifier onlyProxy() {
        require(msg.sender==proxyContractAddress, "Interpreter: Only Proxy may call");
        _;
    }

    /* PUBLIC INTERFACE */

    /**
    * @dev Sets the Proxy contract reference. Emits a SetInterpreterInstance event
    * @param _new Address of the Proxy contract
    */
    function setProxyContractAddress(address _new) public onlyOwner {
        address old = proxyContractAddress;
        proxyContractAddress = _new;
        emit SetProxyContractAddress(msg.sender, old, _new);
    }

    /**
    * @dev Sets the Instructions contract reference. Emits a SetInstructionsInstance event
    * @param _new Address of the Instructions contract
    */
    function setInstructionsInstance(address _new) public onlyOwner {
        address old = address(instructionsInstance);
        instructionsInstance = Instructions(_new);
        emit SetInstructionsInstance(msg.sender, old, _new);
    }
    
    /**
    * @dev Sets the InstructionsProvider contract reference. Emits a SetInstructionsProviderInstance event
    * @param _new Address of the InstructionsProvider contract
    */
    function setInstructionsProviderInstance(address _new) public onlyOwner {
        address old = instructionsProviderInstance;
        instructionsProviderInstance = _new;
        emit SetInstructionsProviderInstance(msg.sender, old, _new);
    }

    /**
    * @dev Sets the Deals contract reference. Emits a SetDealsInstance event
    * @param _new Address of the Deals contract
    */
    function setDealsInstance(address _new) public onlyOwner {
        address old = address(dealsInstance);
        dealsInstance = Deals(_new);
        emit SetDealsInstance(msg.sender, old, _new);
    }

    /**
    * @dev Interprets a rule
    * @param _from Address of the user who initiated the call
    * @param _dealId Id of the deal to be executed
    * @param _ruleId Id of the rule to be executed
    */
    function interpretRule(address _from, uint _dealId, uint _ruleId) external payable onlyProxy() {
        // Init the msg value used to 0
        msgValueUsed = 0;
        
        // Get all articles in rule
        uint articlesCount = dealsInstance.getArticlesCount(_dealId, _ruleId);
        
        bool success = true;
        for (uint i=0;i<articlesCount;i++) {
            success = interpretArticle(_from, _dealId, _ruleId, i);
            if (!success) {
                revert();
            }
        }
    }

    /**
    * @dev Interprets a rule
    * @param _from Address of the user who initiated the call
    * @param _dealId Id of the deal to be executed
    * @param _ruleId Id of the rule to be executed
    * @param _articleId Id of the article to be executed
    */
    function interpretArticle(address _from, uint _dealId, uint _ruleId, uint _articleId) private returns (bool) {
        // Get Article
        CommonStructs.Article memory article = dealsInstance.getArticle(_dealId, _ruleId, _articleId);

        // Get instruction type and signature
        CommonStructs.InstructionTypes instructionType;
        string memory instructionSignature;
        (instructionType, instructionSignature) = instructionsInstance.getInstruction(article.instructionName);

        //> Params injection depends on the instruction type
        
        // CASE ADDRESS_ADDRESS_R_BOOL: pass the Article.paramAddress field
        bool success=false;
        if (instructionType == CommonStructs.InstructionTypes.ADDRESS_ADDRESS_R_BOOL) {
            // Upgrability: Low level call to InstructionsProvider
            bool _success;
            bytes memory _result;
            (_success, _result) = instructionsProviderInstance.call(
                abi.encodeWithSignature(
                    instructionSignature,
                    article.paramAddress,
                    _from
                )
            );
            success = _success && abi.decode(_result, (bool));

        // CASE ADDRESS_PAYABLE: pass the Article.paramAddress
        } else if (instructionType == CommonStructs.InstructionTypes.ADDRESS_PAYABLE) {
            // Upgrability: Low level call to InstructionsProvider
            bool _success;
            bytes memory _result;
            
            // Increment current msg.value % usage
            msgValueUsed += article.paramUInt;
            // Revert if used value > 100% of msg.value
            if (msgValueUsed>100)
                revert("Interpreter: Rule is spending more msg.value than received!");
            (_success, _result) = instructionsProviderInstance.call{value:(msg.value*article.paramUInt)/100}(
                abi.encodeWithSignature(
                    instructionSignature,
                    article.paramAddress
                )
            );
            success = _success;
        }
        
        // Emit an event to inform the front-end that a particular article in the rule successed or not
        emit InterpretArticle(_from, _dealId, _ruleId, _articleId);
        return success;
    }

    /* OVERRIDE & BLOCK UNUSED INHERITED FUNCTIONS */

    /**
    * @dev Block OpenZeppelin Ownable.renounceOwnership
    * @notice Will always revert
    */ 
    function renounceOwnership() public pure override {
        revert('Contract cannot be revoked');
    }
}