let BN = web3.utils.BN;
let Instructions = artifacts.require("Instructions");
let { catchRevert } = require("./exceptionsHelpers");
const { getMapping, isDefined, isPayable, isType } = require("./ast-helper");

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

    describe("Add an instruction and get it from the contract", () => {
      let _instructionName = "IF-ADDR";
      let _instructionType = 0;
      let _instructionSignature = "_IfAddress(address)";
      let tx, args;

      before(async ()=> {
        // Call addInstruction
        tx = await instance.addInstruction(_instructionName, _instructionType, _instructionSignature, { from: CEO });
        args = tx.logs[0].args;
      });

      describe("Add instruction", () => {
        it("... should emit AddInstruction",() => {
          assert.equal(tx.logs[0].event, "AddInstruction","adding an instruction should emit an AddInstruction event");
        });

        it("... arg instructionName should match input", () => {
          assert.equal(args[0], _instructionName, "`instructionName` is not matching");
        });

        it("... arg instructionType should match input", () => {
          assert.equal(args[1], _instructionType, "`instructionType` is not matching");
        });

        it("... arg instructionSignature should match input", () => {
          assert.equal(args[2], _instructionSignature, "`instructionSignature` is not matching");
        });
      });

      describe("Get instruction", async () => {
        it("... instructionName should match input", async () => {
          tx = await instance.getInstruction(_instructionName, {from: CEO});
          assert.equal(_instructionType, tx[0].toNumber(), "`instructionType` is not matching");
          assert.equal(_instructionSignature, tx[1], "`instructionSignature` is not matching");
        });
      });
      
    });

  });

});