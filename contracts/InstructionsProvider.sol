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
    Interpreter private interpreterContractRef;

    /// @dev OpenZeppelin Escrow contract reference
    Escrow private escrowInstance;

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

    /// @dev Modifier used to assess that the caller is the interpreter contract instance 
    modifier onlyInterpreter() {
        require(msg.sender==address(interpreterContractRef), "Caller is not the Interpreter");
        _;
    }

    /* PUBLIC INTERFACE */
    
    /**
    * @dev Sets the Interpreter contract reference. Emits a SetInterpreterInstance event
    * @param _new Address of the Interpreter contract
    */
    function setInterpreterContractRef(address _new) public onlyOwner {
        address old = address(interpreterContractRef);
        interpreterContractRef = Interpreter(_new);
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

    /* Instructions definitions */

    /**
    * @dev Checks if the addresses in parameters are equal
    * @param _address1 First address used in the comparison
    * @param _address2 Second address used in the comparison
    */
    function _ifAddress(address _address1, address _address2) public view onlyInterpreter returns (bool) {
        return (_address1 == _address2);
    }

    /**
     * @dev Escrow: Deposit msg.value to the _to address
     * @param _to The address to which we deposit ETH
     */
    function _transfer(address _to) public payable onlyInterpreter {
        escrowInstance.deposit(_to);
    }
}