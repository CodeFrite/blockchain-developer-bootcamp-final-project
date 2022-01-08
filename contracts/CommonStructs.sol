// SPDX-License-Identifier: GPL-3.0
pragma solidity 0.8.9;

/**
 * @title CommonStructs Library
 * @dev Struct and enum used accross the contracts
 */

library CommonStructs {

    /// @dev List of instruction types supported
    /// @notice Format: function param types (+ "_R_" + function return type)
    enum InstructionTypes { VOID, ADDRESS_ADDRESS_R_BOOL, ADDRESS_PAYABLE }

    /**
     * @dev Represent a single instruction with its parameters
     * @param instructionName: Name of the instruction to be executed
     * @param paramStr Instruction param of type string
     * @param paramUInt Instruction param of type uint
     * @param paramAddress Instruction param of type address
     */
    struct Article {
        string instructionName;
        string paramStr;
        uint paramUInt;
        address paramAddress;
    }
    
}