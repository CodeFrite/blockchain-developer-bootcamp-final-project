// SPDX-License-Identifier: GPL-3.0
pragma solidity 0.8.9;

/* INTERNAL DEPENDENCIES */
import "./CommonStructs.sol";
import "./Instructions.sol";
import "./InstructionsProvider.sol";
import "./Deals.sol";

/**
 * @title Interpreter contract
 * @notice This contract is responsible for interpreting a single rule
 */

contract Interpreter {
    
    /* STORAGE VARIABLES */

    /// @dev Instructions contract reference
    Instructions private instructionsInstance;

    /// @dev InstructionsProvider contract reference
    InstructionsProvider private instructionsProviderInstance;

    /// @dev Deals contract reference
    Deals private dealsInstance;
    
    /* EVENTS */
    
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

    // TODO: remove the events below and adapt TCs
    event InterpretArticle(address _from, uint _dealId, uint _ruleId, uint _articleId, bool _success);
    event Log(CommonStructs.InstructionTypes _type, string _signature);
    event LogArticle(string _instructionName, string _paramStr, uint _paramUInt, address _paramAddress);
    
    /* PUBLIC INTERFACE */
    function setInstructionsInstance(address _new) public {
        address old = address(instructionsInstance);
        instructionsInstance = Instructions(_new);
        emit SetInstructionsInstance(msg.sender, old, _new);
    }
    
    function setInstructionsProviderInstance(address _new) public {
        address old = address(instructionsProviderInstance);
        instructionsProviderInstance = InstructionsProvider(_new);
        emit SetInstructionsProviderInstance(msg.sender, old, _new);
    }

    function setDealsInstance(address _new) public {
        address old = address(dealsInstance);
        dealsInstance = Deals(_new);
        emit SetDealsInstance(msg.sender, old, _new);
    }

    function interpretRule(uint _dealId, uint _ruleId) public payable {
        // Get all articles in rule
        uint articlesCount = dealsInstance.getArticlesCount(_dealId, _ruleId);
        
        bool success = true;
        for (uint i=0;i<articlesCount;i++) {
            success = interpretArticle(_dealId, _ruleId, i);
            if (!success) {
                break;
            }
        }
    }

    //TODO: make it internal and adapt tests
    function interpretArticle(uint _dealId, uint _ruleId, uint _articleId) public payable returns (bool) {
        // Get Article
        CommonStructs.Article memory article = dealsInstance.getArticle(_dealId, _ruleId, _articleId);

        // Get instruction type and signature
        CommonStructs.InstructionTypes instructionType;
        string memory instructionSignature;
        (instructionType, instructionSignature) = instructionsInstance.getInstruction(article.instructionName);
        emit Log(instructionType, instructionSignature);

        //> Params injection depends on the instruction type
        
        // CASE ADDRESS_R_BOOL: pass the Article.paramAddress field
        bool success=true;
        
        if (instructionType == CommonStructs.InstructionTypes.ADDRESS_ADDRESS_R_BOOL) {
            // Deletagate Call to InstructionsProvider
            bool _success;
            bytes memory _result;
            (_success, _result) = address(instructionsProviderInstance).call(
                abi.encodeWithSignature(
                    instructionSignature,
                    article.paramAddress,
                    msg.sender
                )
            );
            success = _success && abi.decode(_result, (bool));
            emit InterpretArticle(msg.sender, _dealId, _ruleId, _articleId, success);
            emit LogArticle(article.instructionName, article.paramStr, article.paramUInt, article.paramAddress);

        // CASE ADDRESS_UINT_PAYABLE: pass the Article.paramAddress
        } else if (instructionType == CommonStructs.InstructionTypes.ADDRESS_UINT_PAYABLE) {
            // Deletagate Call to InstructionsProvider
            bool _success;
            bytes memory _result;
            
            (_success, _result) = address(instructionsProviderInstance).call{value:msg.value}(
                abi.encodeWithSignature(
                    instructionSignature,
                    article.paramAddress
                )
            );
            
            success = _success;
            emit InterpretArticle(msg.sender, _dealId, _ruleId, _articleId, success);
            emit LogArticle(article.instructionName, article.paramStr, article.paramUInt, article.paramAddress);

        // CASE BOOL_PAYABLE_R_BOOL: pass the Article.paramUint
        } else if (instructionType == CommonStructs.InstructionTypes.BOOL_PAYABLE_R_BOOL) {
            // Deletagate Call to InstructionsProvider
            bool _success;
            bytes memory _result;
            bool param = false;
            if (article.paramUInt==1)
                param = true;
            (_success, _result) = address(instructionsProviderInstance).call(
                abi.encodeWithSignature(
                    instructionSignature,
                    param
                )
            );
            success = _success && abi.decode(_result, (bool));
            emit InterpretArticle(msg.sender, _dealId, _ruleId, _articleId, success);
            emit LogArticle(article.instructionName, article.paramStr, article.paramUInt, article.paramAddress);
        }
        
        return success;
    }

}