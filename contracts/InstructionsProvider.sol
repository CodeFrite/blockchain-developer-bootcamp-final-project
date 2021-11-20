// SPDX-License-Identifier: GPL-3.0
pragma solidity 0.8.9;

/* EXTERNAL DEPENDENCIES */
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/escrow/Escrow.sol";

import "./CommonStructs.sol";
import "./Interpreter.sol";

contract InstructionsProvider is Ownable {
    
    /* STORAGE */

    /// @dev Interpreter contract reference
    Interpreter private interpreterInstance;

    /// @dev OpenZeppelin Escrow contract reference
    Escrow private escrow;

    /* EVENTS */
    
    /**
    * @dev Event emitted when the Interpreter contract reference is changed
    * @param _from Caller address
    * @param _old Old address of the Interpreter contract
    * @param _new New address of the Interpreter contract
    */
    event SetInterpreterInstance(address _from, address _old, address _new);

    // TODO: TESTING: remove this event
    event _CALLBACK(address _from, address _to, uint _success);

    /* MODIFIERS */

    /// @dev OpenZeppelin Escrow: Modifier used to check whether the sender has a deposit to withdraw 
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

    /**
    * @dev Constructor used to instantiate the Escrow contract and set the InterpreterInstance reference
    * @param _address Address of the Interpreter contract
    */
    constructor(address _address) {
        escrow = new Escrow();
        interpreterInstance = Interpreter(_address);
    }
    
    /**
    * @dev Sets the Interpreter reference. Emits a SetInterpreterInstance event
    * @param _new Address of the Interpreter contract
    */
    function setInterpreterInstance(address _new) public onlyOwner {
        address old = address(interpreterInstance);
        interpreterInstance = Interpreter(_new);
        emit SetInterpreterInstance(msg.sender, old, _new);
    }
    
    /* Instructions definitions */

    // TODO: TESTING - Remove this function and the corresponding TCs
    function _test(bool _value) public payable onlyInterpreter returns(bool)  {
        return _value;
    }

    /**
    * @dev Checks if the addresses in parameters are equal
    * @param _address1 First address used in the comparison
    * @param _address2 Second address used in the comparison
    */
    function _ifAddress(address _address1, address _address2) public onlyInterpreter returns (bool) {
        emit _CALLBACK(_address1, _address2, 777);
        return (_address1 == _address2);
    }

    /**
    * @dev Deposits all the msg.value in the corresponding Escrow address
    * @param _to Address where to deposit funds
    */
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