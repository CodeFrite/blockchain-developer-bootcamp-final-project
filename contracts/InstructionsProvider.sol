// SPDX-License-Identifier: GPL-3.0
pragma solidity 0.8.9;

/* EXTERNAL DEPENDENCIES */
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/escrow/Escrow.sol";

import "./CommonStructs.sol";
import "./Interpreter.sol";

contract InstructionsProvider is Ownable {
    
    /* STORAGE */
    Interpreter private interpreterInstance;
    Escrow private escrow;

    /* EVENTS */
    event SetInterpreterInstance(address _from, address _new);
    event _CALLBACK(address _from, address _to, uint _success);

    /* MODIFIERS */

    /// @dev Escrow: Modifier used to check whether the sender has a deposit to withdraw 
    modifier hasBalance() {
        require(depositsOf(msg.sender) > 0, "Not enough balance");
        _;
    }

    /// @dev Modifier used to assess that the caller is the interpreter contract instance 
    modifier onlyInterpreter() {
        require(msg.sender==address(interpreterInstance), "Caller is not the Interpreter");
        _;
    }

    /* PUBLIC INTERFACE */
    constructor(address _address) {
        escrow = new Escrow();
        setInterpreterInstance(_address);
    }
    
    function setInterpreterInstance(address _address) public onlyOwner {
        interpreterInstance = Interpreter(_address);
        emit SetInterpreterInstance(msg.sender, _address);
    }
    
    /* Instructions definitions/Articles */
    function _test(bool _value) public payable onlyInterpreter returns(bool)  {
        return _value;
    }

    function _ifAddress(address _address1, address _address2) public onlyInterpreter returns (bool) {
        emit _CALLBACK(_address1, _address2, 777);
        return (_address1 == _address2);
    }

    function _transferExternal(address _to) public payable onlyInterpreter {
        _deposit(_to, msg.value);
    }

    /* Escrow */
    
    /**
     * @dev Escrow: Deposit an _amount that can be withdrawn only by the _to address
     * @param _to The address to which we deposit ETH
     * @param _amount The amount to deposit
     */
    function _deposit(address _to, uint256 _amount) internal {
        escrow.deposit{value: _amount}(_to);
    }

    /**
     * @dev Escrow: Returns the total amount the address _to can withdrawn
     * @param _to The address for which we query the balance
     */
    function depositsOf(address _to) public view returns (uint256) {
        return escrow.depositsOf(_to);
    }

    /**
     * @dev Withdraw the total balance
     * Modifiers:
     * - hasBalance: msg.sender must have enough balance in the escrow
     */
    function withdraw() public hasBalance {
        escrow.withdraw(payable(msg.sender));
    }
    
}