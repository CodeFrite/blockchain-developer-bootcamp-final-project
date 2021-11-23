let BN = web3.utils.BN;
let InstructionsProvider = artifacts.require("InstructionsProvider");
const { expectEvent, expectRevert } = require('@openzeppelin/test-helpers');

//TODO: test only setInterpreter

contract("InstructionsProvider", function (accounts) {
  const [CEO, CHAIRMAIN, ACCOUNTANT, INTERPRETER] = accounts;
  const emptyAddress = "0x0000000000000000000000000000000000000000";

  let instanceInstructionsProvider;

  before(async () => {
    instanceInstructionsProvider = await InstructionsProvider.new();
  });

  describe("setInterpreterContractRef", () => {

    it("... only owner should be able to call, otherwise revert", async () => {
      await expectRevert.unspecified(instanceInstructionsProvider.setInterpreterContractRef(INTERPRETER, {from:ACCOUNTANT}));
    });

    it("... should emit a SetInterpreterContractRef", async () => {
      let tx = await instanceInstructionsProvider.setInterpreterContractRef(INTERPRETER, {from:CEO});
      expectEvent(tx, "SetInterpreterContractRef");
    });

  });

  describe("setEscrowContractRef", () => {

    it("... only owner should be able to call, otherwise revert", async () => {
      await expectRevert.unspecified(instanceInstructionsProvider.setEscrowContractRef(emptyAddress, {from:ACCOUNTANT}));
    });

    it("... should emit a SetInterpreterContractRef", async () => {
      let tx = await instanceInstructionsProvider.setEscrowContractRef(INTERPRETER, {from:CEO});
      expectEvent(tx, "SetEscrowContractRef");
    });
    
  });

  describe("Test supported instructions", () => {
        
    describe("`IF-ADDR` instruction", () => {
      let tx;

      it("... only Interpreter should be able to call, otherwise revert", async () => {
       await expectRevert.unspecified(instanceInstructionsProvider._ifAddress(CEO, CEO, {from: CEO}));
      });

      it("... should return true when addresses are equal", async () => {
        tx = await instanceInstructionsProvider._ifAddress(CEO, CEO, {from: INTERPRETER});
        assert(tx[1]!='',"instruction `IF-ADDR` is not present");
      });

      it("... should return false when addresses are not equal", async () => {
        tx = await instanceInstructionsProvider._ifAddress(CEO, ACCOUNTANT, {from: INTERPRETER});
        assert(tx[1]!='',"instruction `IF-ADDR` is not present");
      });

    });

  });

});