let BN = web3.utils.BN;
let Instructions = artifacts.require("Instructions");
let InstructionsProvider = artifacts.require("InstructionsProvider");
let Deals = artifacts.require("Deals");
let Interpreter = artifacts.require("Interpreter");
let { catchRevert } = require("./exceptionsHelpers");
const { getMapping, isDefined, isPayable, isType } = require("./ast-helper");
const {
  expectEvent,  // Assertions for emitted events
  expectRevert, // Assertions for transactions that should fail
} = require('@openzeppelin/test-helpers');
const { assertion } = require("@openzeppelin/test-helpers/src/expectRevert");

contract("Interpreter", async (accounts) => {
  const [CEO, CHAIRMAN, ACCOUNTANT, PROXY] = accounts;
  const emptyAddress = "0x0000000000000000000000000000000000000000";

  const dealAccounts = [ACCOUNTANT,CEO,CHAIRMAN];
  const ruleList = 
    [
      [
        ["IF-ADDR", "CHAIRMAN", 1, CHAIRMAN],
        ["TRANSFER", "ACCOUNTANT", 2, ACCOUNTANT]
      ]
    ];

  let instanceInstructions, instanceInstructionsProvider, instanceDeals, instanceInterpreter;

  const showTransactionCost = (tx) => console.log("gas used: " + tx.receipt.gasUsed);

  before(async () => {
    
  });

  describe("Initialisation", () => {

    it("... instantiate contracts", async () => {
      instanceInstructions = await Instructions.new();
      
      instanceInterpreter = await Interpreter.new();
      instanceInstructionsProvider = await InstructionsProvider.new(emptyAddress);
      
      await instanceInstructions.addInstruction("IF-ADDR", "1", "_ifAddress(address,address)");
      await instanceInstructions.addInstruction("TRANSFER", "2", "_transfer(address)");
      
      instanceDeals = await Deals.new();
    });
    
    it("... link contracts", async () => {
      await instanceDeals.setProxyContractAddress(PROXY, {from:CEO});
      await instanceInstructionsProvider.setInterpreterContractRef(instanceInterpreter.address);
      await instanceInterpreter.setInstructionsInstance(instanceInstructions.address);
      await instanceInterpreter.setInstructionsProviderInstance(instanceInstructionsProvider.address);
      await instanceInterpreter.setDealsInstance(instanceDeals.address);
    });
  
    it("... create deal", async () => {
      await instanceDeals.createDeal(dealAccounts, ruleList, {from: PROXY});
    });

  });

  describe("Access Control", () => {

    describe("interpretRule", () => {

      it("... only Proxy has access, otherwise revert", async () => {
        await expectRevert.unspecified(instanceInterpreter.interpretRule(CEO, 0,0, {from:CEO}));
      });

    });

  })

  describe("Use Cases", ()=> {
    let tx;
    let dealId, ruleId, articleId;

    describe("A-Interpret a whole Rule", () => {
      
      before(async () => {
        await instanceInterpreter.setProxyContractAddress(PROXY, {from:CEO});
      });

      describe("Rule 0 - FROM CEO: IF-ADDR(CHAIRMAN)=false =/> TRANSFER(ACCOUNTANT)=false", () => {
        
        it("... should revert", async () => {
          dealId = 0;
          ruleId = 0;
          await expectRevert.unspecified(instanceInterpreter.interpretRule(CEO, dealId, ruleId,{from: PROXY, value:10000000000000000}));
        });

      });

      describe("Rule 0 - FROM CHAIRMAN: IF-ADDR(CHAIRMAN)=true => TRANSFER(ACCOUNTANT)=true", () => {
        
        it("... should return 2 events InterpretArticle with the correct event parameters", async () => {
          dealId = 0;
          ruleId = 0;
          tx = await instanceInterpreter.interpretRule(CHAIRMAN, dealId, ruleId,{from: PROXY, value:10000000000000000});
          expectEvent(tx,"InterpretArticle",{_from: CHAIRMAN, _dealId: new BN(dealId), _ruleId: new BN(ruleId),_articleId: new BN(0)});
          expectEvent(tx,"InterpretArticle",{_from: CHAIRMAN, _dealId: new BN(dealId), _ruleId: new BN(ruleId),_articleId: new BN(1)});
        });
      });

    });
  });
});