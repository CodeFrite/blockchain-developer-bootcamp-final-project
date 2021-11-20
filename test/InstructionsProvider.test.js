let BN = web3.utils.BN;
let Instructions = artifacts.require("Instructions");
let InstructionsProvider = artifacts.require("InstructionsProvider");
let { catchRevert } = require("./exceptionsHelpers");
const { getMapping, isDefined, isPayable, isType } = require("./ast-helper");
const {
  expectEvent,  // Assertions for emitted events
  expectRevert, // Assertions for transactions that should fail
} = require('@openzeppelin/test-helpers');

//TODO: test only setInterpreter

contract("InstructionsProvider", function (accounts) {
  const [CEO, CHAIRMAIN, ACCOUNTANT] = accounts;
  const emptyAddress = "0x0000000000000000000000000000000000000000";

  let instanceInstructions, instanceInstructionsProvider;

  before(async () => {
    instanceInstructions = await Instructions.new();
    instanceInstructionsProvider = await InstructionsProvider.new(emptyAddress);
  });

  describe("Init instructions", () => {
    let tx;
    
    before(async () => {
      await instanceInstructions.addInstruction("IF-ADDR", "4", "_ifAddress(address,address)");
      await instanceInstructions.addInstruction("TRANSFER-E", "1", "_transferExternal(address)");
    });

    describe("`IF-ADDR` instruction", () => {
      it("... should be present in Instructions contract", async () => {
        tx = await instanceInstructions.getInstruction("IF-ADDR", {from: CEO});
        assert(tx[1]!='',"instruction `IF-ADDR` is not present");
      });
  
      it("... `instructionType` should match", () => {
        assert.equal(4, tx[0].toNumber(), "`instructionType` is not matching");
      });
  
      it("... `instructionSignature` should match", () => {
        assert.equal("_ifAddress(address,address)", tx[1], "`instructionSignature` is not matching");
      });

    });

    describe("`TRANSFER-E` instruction", () => {
      it("... should be present in Instructions contract", async () => {
        tx = await instanceInstructions.getInstruction("TRANSFER-E", {from: CEO});
        assert(tx[1]!='',"instruction `TRANSFER-E` is not present");
      });
  
      it("... `instructionType` should match", () => {
        assert.equal(1, tx[0].toNumber(), "`instructionType` is not matching");
      });
  
      it("... `instructionSignature` should match", () => {
        assert.equal("_transferExternal(address)", tx[1], "`instructionSignature` is not matching");
      });

    });

  });

});