// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.0;

/* EXTERNAL DEPENDENCIES */
import "@openzeppelin/contracts/access/Ownable.sol";

/* INTERNAL DEPENDENCIES */
import "./CommonStructs.sol";
import "./Instructions.sol";
import "./Deals.sol";

// TODO: Ajouter un payable fallback a tous les contracts pour voir ce qu'on fait quand on reçoit de l'argent par erreur
//        ==> Hériter d'une classe qui redirige l'argent vers le proxy ou bien juste rembourser les sous

// TODO: Check how to integrate the allowAllAccounts in the interpreter. Should I add it as a param in the deal?

/// @title Proxy Contract
/// @dev Main DApp entry point. Exposes the public interface and decouple the data and the logic
/// @notice lets-make-a-deal.eth allows you to make an agreement between different parties and automatically route ETH to different addresses based on simple rules.
contract Proxy is Ownable {
    
    /* STORAGE VARIABLES */

    // References to external contracts

    /// @dev Reference to the Instructions contract
    Instructions public instructionsContractRef;

    /// @dev Reference to the InstructionsProvider contract
    address public instructionsProviderContractRef;

    /// @dev Reference to the Deals instance
    Deals public dealsContractRef;

    /// @dev Reference to the Interpreter contract
    address public interpreterContractRef;

    // Contract fees

    /// @dev Price per account added to the deal in USD
    uint public accountCreationFees;
    
    /// @dev Price per rule added to the deal in USD
    uint public ruleCreationFees;

    /// @dev Price to allow incoming payments from all addresses others than internal/external accounts in USD
    uint public allowAllAddressesFees;

    /// @dev Minimal transaction value able to trigger an execution in USDimport "@openzeppelin/contracts/security/Pausable.sol";
    uint public transactionMinimalValue;

    /// @dev Transaction fees in % of the msg.value perceived on a deal execution in USD
    uint public transactionFees;

    /// @dev USD/WEI rate
    uint public USD2WEIConversionRate;

    /* MAPPINGS */
    
    /* MODIFIERS */

    /* EVENTS */

    // Modify contract references

    /**
    * @dev Event emitted when the Instructions contract reference is changed
    * @param _from Caller address
    * @param _old Old address of the Instructions contract
    * @param _new New address of the Instructions contract
    */
    event ModifyInstructionsContractAddress(address _from, address _old, address _new);

    /**
    * @dev Event emitted when the InstructionsProvider contract reference is changed
    * @param _from Caller address
    * @param _old Old address of the InstructionsProvider contract
    * @param _new New address of the InstructionsProvider contract
    */
    event ModifyInstructionsProviderContractAddress(address _from, address _old, address _new);

    /**
    * @dev Event emitted when the Deals contract reference is changed
    * @param _from Caller address
    * @param _old Old address of the Deals contract
    * @param _new New address of the Deals contract
    */
    event ModifyDealsContractAddress(address _from, address _old, address _new);
    
    /**
    * @dev Event emitted when the Interpreter contract reference is changed
    * @param _from Caller address
    * @param _old Old address of the Interpreter contract
    * @param _new New address of the Interpreter contract
    */
    event ModifyInterpreterContractAddress(address _from, address _old, address _new);
    
    // Modify fees
 
    /** 
    * @dev Event emitted when the account creation fees is changed
    * @param _from : msg.sender
    * @param _old : old account creation fees in USD
    * @param _new : new account creation fees in USD
    */
    event ModifyAccountCreationFees(address _from, uint _old, uint _new);

    /** 
    * @dev Event emitted when the rule creation fees is changed
    * @param _from : msg.sender
    * @param _old : old rule creation fees in USD
    * @param _new : new rule creation fees in USD
    */
    event ModifyRuleCreationFees(address _from, uint _old, uint _new);

    /** 
    * @dev Event emitted when the allow all accounts fees is changed
    * @param _from : msg.sender
    * @param _old : old allow all accounts fees in USD
    * @param _new : new allow all accounts fees in USD
    */
    event ModifyAllowAllAccountsFees(address _from, uint _old, uint _new);

    /** 
    * @dev Event emitted when the transaction minimal value is changed
    * @param _from : msg.sender
    * @param _old : old transaction minimal value in USD
    * @param _new : new transaction minimal value in USD
    */
    event ModifyTransactionMinimalValue(address _from, uint _old, uint _new);

    /** 
    * @dev Event emitted when the ETH/USD rate is changed
    * @param _from : msg.sender
    * @param _old : old ETH/USD rate in ETH per USD
    * @param _new : new ETH/USD rate in ETH per USD
    */
    event ModifyTransactionFees(address _from, uint _old, uint _new);
    
    /** 
    * @dev Event emitted when the WEI to USD conversion rate is changed
    * @param _from : msg.sender
    * @param _old : old WEI to USD conversion rate in WEI
    * @param _new : new WEI to USD conversion rate in WEI
    */
    event ModifyUSD2WEIConversionRate(address _from, uint _old, uint _new);

    /** 
    * @dev Event emitted when the deal creation fees are paid
    * @param _from : msg.sender
    * @param _dealId : Id of the created deal
    * @param _fees : Fees paid by the user in ETH
    */
    event PayDealCreationFees(address _from, uint _dealId, uint _fees);

    /** 
    * @dev Event emitted when the transaction fees are paid
    * @param _from : msg.sender
    * @param _dealId : Id of the executed deal 
    * @param _ruleId : Id of the executed rule
    * @param _fees : Fees paid by the user in ETH
    */
    event PayTransactionFees(address _from, uint _dealId, uint _ruleId, uint _fees);

    /** 
    * @dev Event emitted when an excess value is reimbursed to the user
    * @param _to : address of the caller (msg.sender) where the excess value is reimbursed
    * @param _dealId : Id of the created deal 
    * @param _amount : Amount reimbursed to the user in ETH
    */
    event ReimburseExcessValue(address _to, uint _dealId, uint _amount);
    

    /* CONSTRUCTOR */

    /** 
    * @dev Constructor: Initialize storage variables
    * @param _accountCreationFees Creation fees per account in Wei 
    * @param _ruleCreationFees Creation fees per rule in Wei 
    * @param _allowAllAddressesFees Creation fees to allow incoming payments from all addresses
    * @param _transactionMinimalValue Minimal value to trigger a rule execution
    * @param _transactionFees Transaction fees paid to execute a rule in % of msg.value (1=1%)
    * @param _USD2WEIConversionRate Wei per USD conversion rate
    */
    constructor (
        uint _accountCreationFees, 
        uint _ruleCreationFees,
        uint _allowAllAddressesFees,
        uint _transactionMinimalValue,
        uint _transactionFees,
        uint _USD2WEIConversionRate
    ) {
        accountCreationFees = _accountCreationFees;
        ruleCreationFees = _ruleCreationFees;
        allowAllAddressesFees = _allowAllAddressesFees;
        transactionMinimalValue = _transactionMinimalValue;
        transactionFees = _transactionFees;
        USD2WEIConversionRate = _USD2WEIConversionRate;
    }
    
    /* SEND & FALLBACK */
    // TODO: https://docs.soliditylang.org/en/v0.8.9/contracts.html#receive-ether-function
    // If I do not include a payable send or fallback, the contract will return any ETH send to the contract with a call without call values (ok for me i think)
    
    /* OWNER INTERFACE */

    // References to external contracts
    
    /**
    * @dev Sets the Instructions contract reference to a new value
    * @param _new New address of the Instructions contract
    */
    function setInstructionsContractRef(address _new) public onlyOwner {
        address old = address(instructionsContractRef);
        instructionsContractRef = Instructions(_new);
        emit ModifyInstructionsContractAddress(msg.sender, old, _new);
    }

    /**
    * @dev Sets the InstructionsProvider contract reference to a new value
    * @param _new New address of the InstructionsProvider contract
    */
    function setInstructionsProviderContractRef(address _new) public onlyOwner {
        address old = instructionsProviderContractRef;
        instructionsProviderContractRef = _new;
        emit ModifyInstructionsProviderContractAddress(msg.sender, old, _new);
    }

    /**
    * @dev Sets the Deals contract reference to a new value
    * @param _new New address of the Deals contract
    */
    function setDealsContractRef(address _new) public onlyOwner {
        address old = address(dealsContractRef);
        dealsContractRef = Deals(_new);
        emit ModifyDealsContractAddress(msg.sender, old, _new);
    }
    
    /**
    * @dev Sets the Interpreter contract reference to a new value
    * @param _new New address of the Interpreter contract
    */
    function setInterpreterContractRef(address _new) public onlyOwner {
        address old = interpreterContractRef;
        interpreterContractRef = _new;
        emit ModifyInterpreterContractAddress(msg.sender, old, _new);
    }

    // Contract fees

    /**
    * @dev Sets the account creation fees to a new value
    * @param _new New value for the account creation fees in USD
    */
    function setAccountCreationFees(uint _new) public onlyOwner {
        uint old = accountCreationFees;
        accountCreationFees = _new;
        emit ModifyAccountCreationFees(msg.sender, old, _new);
    }
    
    /**
    * @dev Sets the rule creation fees to a new value
    * @param _new New value for the rule creation fees in USD
    */
    function setRuleCreationFees(uint _new) public onlyOwner {
        uint old = ruleCreationFees;
        ruleCreationFees = _new;
        emit ModifyRuleCreationFees(msg.sender, old, _new);
    }

    /**
    * @dev Sets the allow all addresses fees to a new value
    * @param _new New value for the allow all addresses fees in USD
    */
    function setAllowAllAddressesFees(uint _new) public onlyOwner {
        uint old = allowAllAddressesFees;
        allowAllAddressesFees = _new;
        emit ModifyAllowAllAccountsFees(msg.sender, old, _new);
    }

    /**
    * @dev Sets the transaction minimal value to a new value
    * @param _new New value for the transaction minimal value in USD
    */
    function setTransactionMinimalValue(uint _new) public onlyOwner {
        uint old = transactionMinimalValue;
        transactionMinimalValue = _new;
        emit ModifyTransactionMinimalValue(msg.sender, old, _new);
    }

    /**
    * @dev Sets the transaction fees to a new value
    * @param _new New value for the transaction fees in USD
    */
    function setTransactionFees(uint _new) public onlyOwner {
        uint old = transactionFees;
        transactionFees = _new;
        emit ModifyTransactionFees(msg.sender, old, _new);
    }

    /**
    * @dev Sets the WEI to USD conversion rate to a new value
    * @param _new New value for the USD to WEI conversion rate in USD
    */
    function setUSD2WEIConversionRate(uint _new) public onlyOwner {
        uint old = USD2WEIConversionRate;
        USD2WEIConversionRate = _new;
        emit ModifyUSD2WEIConversionRate(msg.sender, old, _new);
    }

    /* PUBLIC INTERFACE */

    event Log(uint);

    /**
    * @dev Creates a deal and returns its id
    * @param _accounts List of accounts addresses linked to the deal
    * @param _rulesList List of the rules linked to the deal (rule = list of Articles)
    * @return Id of the deal created
    */
    function createDeal
    (
        address[] memory _accounts, 
        CommonStructs.Article[][] memory _rulesList
    ) 
    external payable returns (uint) {
        // Compute creation fees in ETH
        uint creationFeesInETH = computeDealCreationFeesInETH(_accounts.length, _rulesList.length);

        // Check 1: Amount sent by the user should cover the deal creation fees
        require(msg.value >= creationFeesInETH, "Insufficient value to cover the deal creation fees");
        
        // Check 2: Make sure that the instructions are all supported
        for (uint i=0;i<_rulesList.length;i++) {
            for (uint j=0;j<_rulesList[i].length;j++) {
                // Get the instruction type & signature
                (, string memory instructionSignature) = instructionsContractRef.getInstruction(_rulesList[i][j].instructionName);
                
                // If the signature is empty, this means that the instruction is not present => revert
                require(!stringsEqual(instructionSignature,''),"Proxy.CreateDeal: Instruction is not supported");
            }
        }

        // Create the deal
        uint dealId = dealsContractRef.createDeal(_accounts, _rulesList);
        
        // Reimburse excess value to the caller if necessary
        uint excessValue = (msg.value - creationFeesInETH);
        if (excessValue > 0){
            (bool sent, ) = msg.sender.call{value: excessValue } ("");
            require(sent, "Proxy.createDeal: Failed to reimburse excess Ether");
            emit ReimburseExcessValue(msg.sender, dealId, excessValue);
        }

        // Emit a PayDealCreationFees
        emit PayDealCreationFees(msg.sender, dealId, creationFeesInETH);

        return dealId;
    }

    event Log(uint,uint);
    /**
    * @dev Execute a deal's rule
    * @param _dealId : Id of the deal to execute
    * @param _ruleId : Id of the rule to execute
    */
    function executeRule(uint _dealId, uint _ruleId) external payable {
        // Amount sent by the user should be higher or equal to the minimal transaction value
        uint msgValueInUSD = convertWEI2USD(msg.value);
        require( msgValueInUSD >= transactionMinimalValue, "Transaction minimal value not reached");

        // Call Interpreter.interpretRule() and include in the call the msg.value - execution fees
        uint executionFees = (msg.value / 100) * transactionFees;
        (bool success, ) = interpreterContractRef.call{value: (msg.value - executionFees)}(
            abi.encodeWithSignature(
                "interpretRule(address,uint256,uint256)",
                msg.sender,
                _dealId, 
                _ruleId
            )
        );

        require(success,"Proxy: Unable to execute rule");

        // Emit a PayTransactionFees
        emit PayTransactionFees(msg.sender, _dealId, _ruleId, executionFees);
    }

    /**
    * @dev Retrieves caller escrow balance.
    */
    function depositsOf() public returns (uint) {
        (bool success, bytes memory _result) = instructionsProviderContractRef.call(
            abi.encodeWithSignature(
                "depositsOf(address)",
                msg.sender
            )
        );
        require(success,"Proxy: Unable to get the deposit of caller!");

        uint result = abi.decode(_result, (uint256));
        return result;
    }

    /**
    * @dev Withdraw all deposit from escrow for msg.sender
    */
    function withdraw() external {
        (bool success,) = instructionsProviderContractRef.call(
            abi.encodeWithSignature(
                "withdraw(address)",
                msg.sender
            )
        );
        require(success,"Proxy: Unable to withdraw!");
    }

    function getBalance() external view onlyOwner returns(uint) {
        return address(this).balance;
    }
    

    /* HELPER FUNCTIONS */
    
    /**
    * @dev Computes the deal creation cost in ETH
    * @param _accountsCount Number of external accounts defined in the deal
    * @param _rulesCount Number of rules defined in the deal
    * @return Deal creation cost in ETH
    */
    function computeDealCreationFeesInETH
    (
        uint _accountsCount, 
        uint _rulesCount
    ) 
    public view returns (uint) {
        return (_accountsCount * accountCreationFees + _rulesCount * ruleCreationFees)*USD2WEIConversionRate;
    }

    /**
    * @dev Converts an amount in WEI to USD
    * @param _amountInWEI Amount in WEI
    * @return Converted amount in USD
    */
    function convertWEI2USD(uint _amountInWEI) public view returns(uint) {
        return _amountInWEI / USD2WEIConversionRate;
    }

    /**
    * @dev Converts an amount in USD to WEI
    * @param _amountInUSD Amount in USD
    * @return Converted amount in WEI
    */
    function convertUSD2WEI(uint _amountInUSD) public view returns(uint) {
        return _amountInUSD * USD2WEIConversionRate;
    }

    /** 
    * @dev Checks whether the strings are equal
    * @param _s1 First string to compare
    * @param _s2 Second string to compare
    * @return Boolean indicating if the 2 strings are equal
    */
    function stringsEqual(string memory _s1, string memory _s2) public pure returns(bool) {
        return keccak256(bytes(_s1)) == keccak256(bytes(_s2));
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
