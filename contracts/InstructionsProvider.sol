// SPDX-License-Identifier: GPL-3.0
pragma solidity 0.8.9;

/* EXTERNAL DEPENDENCIES */
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/escrow/Escrow.sol";

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
    address private proxyInstanceRef;

    /// @dev Interpreter contract reference
    address private interpreterContractRef;

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

    /**
    * @dev Retrieves the escrow balance for the msg.sender
    * @param _from msg.sender passed by caller
    * @param _deposits Deposit value for msg.sender
    */
    event DepositsOf(address _from, uint _deposits);

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

    /**
    * @dev OpenZeppelin Escrow: Modifier used to check whether the sender has a balance to withdraw 
    * @param _from Address for which we check the balance
    */
    modifier hasBalance(address _from) {
        require(depositsOf(_from) > 0, "InstructionsProvider : Not enough balance");
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

    function transferEscrow(address _address) external onlyOwner {
        escrowInstance.transferOwnership(_address);
        //escrowInstance = Escrow(address(0));
    }

    /**
    * @dev Escrow: Returns the total amount that the msg.sender can withdraw
    */
    function depositsOf(address _from) public onlyProxy returns (uint) {
        uint deposits = escrowInstance.depositsOf(_from);
        emit DepositsOf(_from, deposits);
        return deposits;
    }

    /**
    * @dev msg.sender withdraws his total balance
    *      Modifier hasBalance: msg.sender must have enough balance in the escrow
    */
    function withdraw(address _from) external onlyProxy hasBalance(_from) {
        escrowInstance.withdraw(payable(_from));
    }

    /* Instructions definitions */

    /**
    * @dev Checks if the addresses in parameters are equal
    * @param _address1 First address used in the comparison
    * @param _address2 Second address used in the comparison
    */
    function _ifAddress(address _address1, address _address2) public view onlyInterpreter returns (bool) {
        return (_address1 == _address2);
    }

    event Oye(address, uint);
    /**
     * @dev Escrow: Deposit msg.value to the _to address
     * @param _to The address to which we deposit ETH
     */
    function _transfer(address _to) public payable onlyInterpreter {
        emit Oye(_to, msg.value);
        escrowInstance.deposit{value:msg.value}(_to);
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