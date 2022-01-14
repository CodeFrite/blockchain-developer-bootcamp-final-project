// SPDX-License-Identifier: GPL-3.0
pragma solidity 0.8.9;

/* EXTERNAL DEPENDENCIES */
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/escrow/Escrow.sol";

/* INTERNAL DEPENDENCIES */
import "./CommonStructs.sol";

/**
 * @title Instructions Provider contract
 * @notice This contract is responsible for storing the 
 * implementations of the instructions supported used in 
 * the Interpreter.InterpretArticle low level calls
 */

contract InstructionsProvider is Ownable {
    
    /* STORAGE */

    /// @dev Proxy instance reference
    address public proxyInstanceRef;

    /// @dev Interpreter contract reference
    address public interpreterContractRef;

    /// @dev OpenZeppelin Escrow contract reference
    Escrow public escrowInstance;

    /* EVENTS */
    
    /**
    * @dev Event emitted when the Interpreter contract reference is changed
    * @param _from Caller address
    * @param _old Old address of the Interpreter contract
    * @param _new New address of the Interpreter contract
    */
    event SetInterpreterContractRef(address _from, address _old, address _new);

    /**
    * @dev Event emitted when the Escrow contract reference is changed
    * @param _from Caller address
    * @param _old Old address of the Escrow contract
    * @param _new New address of the Escrow contract
    */
    event SetEscrowContractRef(address _from, address _old, address _new);

    /* MODIFIERS */

    /// @dev Assess that the caller is the Interpreter contract instance 
    modifier onlyInterpreter() {
        require(msg.sender==interpreterContractRef, "InstructionsProvider: Caller is not the Interpreter");
        _;
    }

    /// @dev Assess that the caller is the Proxy contract instance 
    modifier onlyProxy() {
        require(msg.sender==proxyInstanceRef, "InstructionsProvider: Only Proxy may call");
        _;
    }

    /* PUBLIC INTERFACE */

    constructor(address _address) {
        if (_address==address(0))
            escrowInstance = new Escrow();
        else
            escrowInstance = Escrow(_address);
    }

    /**
    * @dev Sets the Interpreter contract reference. Emits a SetInterpreterInstance event
    * @param _address Address of the Interpreter contract
    */
    function setProxyInstanceRef(address _address) external onlyOwner {
        proxyInstanceRef = _address;
    }

    /**
    * @dev Sets the Interpreter contract reference. Emits a SetInterpreterInstance event
    * @param _new Address of the Interpreter contract
    */
    function setInterpreterContractRef(address _new) public onlyOwner {
        address old = interpreterContractRef;
        interpreterContractRef = _new;
        emit SetInterpreterContractRef(msg.sender, old, _new);
    }
    
    /**
    * @dev Sets the Escrow instance. Emits a SetEscrowInstance event
    * @param _new Address of the Escrow contract
    */
    function setEscrowContractRef(address _new) public onlyOwner {
        address old = address(escrowInstance);
        escrowInstance = Escrow(_new);
        emit SetEscrowContractRef(msg.sender, old, _new);
    }

    /**
    * @dev Upgrability: Allow the old InstructionsProvider instance
    * to transfer the Escrow ownership to the new instance
    * @param _address Address of the new InstructionsProvider instance
    */
    function transferEscrow(address _address) external onlyOwner {
        escrowInstance.transferOwnership(_address);
        //escrowInstance = Escrow(address(0));
    }

    /**
    * @dev Escrow: Returns msg.sender balance
    * @return uint Balance of msg.sender
    */
    function getBalance() public view returns (uint) {
        uint deposits = escrowInstance.depositsOf(msg.sender);
        return deposits;
    }

    /**
    * @dev msg.sender withdraws his total balance
    *      Modifier hasBalance: msg.sender must have enough balance in the escrow
    */
    function withdraw(address _from) external onlyProxy {
        require(escrowInstance.depositsOf(_from)>0, "InstructionsProvider : Not enough balance");
        escrowInstance.withdraw(payable(_from));
    }

    /* Upgrability: Instructions implementations */

    /**
    * @dev Checks if the addresses in parameters are equal
    * @param _address1 First address used in the comparison
    * @param _address2 Second address used in the comparison
    * @return Returns true if both addresses are equal
    */
    function _ifAddress(address _address1, address _address2) public view onlyInterpreter returns (bool) {
        return (_address1 == _address2);
    }

    /**
     * @dev Escrow: Deposit msg.value to the _to address
     * @param _to The address to which we deposit ETH
     */
    function _transfer(address _to) public payable onlyInterpreter {
        escrowInstance.deposit{value:msg.value}(_to);
    }

    /**
    * @dev Checks if the msg.value is bigger than the param
    * @param _msgValue Message value
    * @param _comparisonValue Value used for comparison
    * @return Returns true if the message value is bigger than the param
    */
    function _ifMsgValueBigger(uint _msgValue, uint _comparisonValue) public view onlyInterpreter returns (bool) {
        return (_msgValue > _comparisonValue);
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