let BN = web3.utils.BN;
let Instructions = artifacts.require("Instructions");
const { getMapping, isDefined, isPayable, isType } = require("./ast-helper");
const { expectEvent, expectRevert } = require('@openzeppelin/test-helpers');
contract("Instructions", function (accounts) {
  const [CEO, CHAIRMAIN, ACCOUNTANT] = accounts;
  const emptyAddress = "0x0000000000000000000000000000000000000000";

  let instance;

  before(async () => {
    instance = await Instructions.new();
  });

  describe("Variables", () => {
    
    describe("mapping instructionsSignature", () => {
      
      let instructionsTypeMapping;

      before(() => {
        instructionsSignatureMapping = getMapping(Instructions, "Instructions", "instructionsSignature");
        assert(
          instructionsSignatureMapping !== null, 
          "`instructionsSignature` mapping not defined"
        );
      });

      it("should have the signature `mapping(string => string)`", () => {
        assert(
          isType(instructionsSignatureMapping)("mapping(string => string)"), 
          "`instructionsSignature` should have the signature `mapping(string => string)`"
        );
      });
    });

    describe("mapping instructionsType", () => {
        
      let instructionsTypeMapping;
  
      before(() => {
        instructionsTypeMapping = getMapping(Instructions, "Instructions", "instructionsType");
        assert(
          instructionsTypeMapping !== null, 
          "`instructionsSignature` mapping not defined"
        );
      });
  
      it("should have the signature `mapping(string => string)`", () => {
        assert(
          isType(instructionsTypeMapping)("mapping(string => string)"), 
          "`instructionsSignature` should have the signature `mapping(string => string)`"
        );
      });
    });  
  });

  describe("Use cases", () => {
    let instructionName = "IF-ADDR";
    let instructionType = new BN(0);
    let instructionSignature = "_IfAddress(address)";
    let tx;

    it("Only owner should be able to call addInstruction", async () => {
      await expectRevert.unspecified(instance.addInstruction(instructionName, instructionType, instructionSignature, { from: CHAIRMAIN }));
    });

    it("Add instruction should emit AddInstruction with the correct values", async () => {
      tx = await instance.addInstruction(instructionName, instructionType, instructionSignature, { from: CEO });
      expectEvent(tx, "AddInstruction", {_instructionName:instructionName,_instructionType:instructionType,_instructionSignature:instructionSignature});
    });

    it("Get instruction should match input data", async () => {
      tx = await instance.getInstruction(instructionName, {from: CEO});
      assert.equal(instructionType, tx[0].toNumber(), "`instructionType` is not matching");
      assert.equal(instructionSignature, tx[1], "`instructionSignature` is not matching");
    });

  });

});