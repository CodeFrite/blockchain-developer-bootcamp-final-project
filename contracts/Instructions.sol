// SPDX-License-Identifier: GPL-3.0
pragma solidity 0.8.9;

/* EXTERNAL DEPENDENCIES */
import "@openzeppelin/contracts/access/Ownable.sol";

/* INTERNAL DEPENDENCIES */
import "./CommonStructs.sol";

/**
 * @title Instructions contract
 * @notice This contract is responsible for storing the dynamic instructions defined by the contract owner.
 */

/**
    An instruction has:
        - a type that determine which parameters it accepts
        - a signature that is used for the low level .call()
        - a name that is used as a key to select an instruction uniquely
*/

contract Instructions is Ownable {
    
    /* STORAGE VARIABLES */
    
    /// @dev Mapping between instruction name used in deals Articles and instruction signature used in low level .call()
    mapping (string => string) private instructionsSignature;

    /// @dev Mapping between instruction name and its type which determines how the Interpreter will run an Article
    mapping (string => CommonStructs.InstructionTypes) private instructionsType;

    /* EVENTS */
    
    /**
    * @dev Event emitted when an new instruction is added/supported
    * @param _instructionName Name of the instruction, for ex: "IF-ADDR"
    * @param _instructionType Type of the instruction, for ex: "ADDRESS_ADDRESS_R_BOOL"
    * @param _instructionSignature Signature of the instruction, for ex: "_ifAddress(address, address)"
    */
    event AddInstruction(string _instructionName, CommonStructs.InstructionTypes _instructionType, string _instructionSignature);
    
    /* PUBLIC INTERFACE */

    /**
    * @dev Returns an instruction type and signature based on its name
    * @param _instructionName Name of the instruction, for ex: "IF-ADDR"
    */
    function getInstruction(string memory _instructionName) public view returns(CommonStructs.InstructionTypes, string memory) {
        return (instructionsType[_instructionName], instructionsSignature[_instructionName]);
    }
    
    /**
    * @dev Add an instruction to the list of supported instructions (onlyOwner)
    * @param _instructionName Name of the instruction, for ex: "IF-ADDR"
    * @param _instructionType Type of the instruction, for ex: "ADDRESS_ADDRESS_R_BOOL"
    * @param _instructionSignature Signature of the instruction, for ex: "_ifAddress(address, address)"
    */
    function addInstruction(
        string memory _instructionName, 
        CommonStructs.InstructionTypes _instructionType, 
        string memory _instructionSignature
    )
    public onlyOwner {
        instructionsType[_instructionName] = CommonStructs.InstructionTypes(_instructionType);
        instructionsSignature[_instructionName] = _instructionSignature;
        emit AddInstruction(_instructionName, _instructionType, _instructionSignature);
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
