let BN = web3.utils.BN;
let CommonStructs = artifacts.require("CommonStructs");
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
  const [CEO, CHAIRMAIN, ACCOUNTANT] = accounts;
  const emptyAddress = "0x0000000000000000000000000000000000000000";

  const externalAccounts = [ACCOUNTANT];
  const internalAccounts = [CEO,CHAIRMAIN];
  const ruleList = 
    [
      [
        ["IF-ADDR", "CEO", 0, CEO],
        ["IF-ADDR", "CHAIRMAN", 0, CHAIRMAIN]
      ],
      [
        ["IF-ADDR", "CHAIRMAN", 0, CHAIRMAIN],
        ["IF-ADDR", "CEO", 0, CEO]
      ],
      [
        ["IF-ADDR", "CHAIRMAN", 0, CHAIRMAIN],
        ["TRANSFER-E", "ACCOUNTANT", 0, ACCOUNTANT]
      ],
      [
        ["IF-ADDR", "CEO", 0, CEO],
        ["TRANSFER-E", "ACCOUNTANT", 0, ACCOUNTANT]
      ],
      [
        ["TST","",1,emptyAddress],
        ["TST","",0,emptyAddress]
      ]
    ];

  let instanceCommon, instanceInstructions, instanceInstructionsProvider, instanceDeals, instanceInterpreter;

  const showTransactionCost = (tx) => console.log("gas used: " + tx.receipt.gasUsed);

  before(async () => {
    
  });

  describe("Initialisation", () => {

    it("... instantiate contracts", async () => {
      instanceCommon = await CommonStructs.new();
      instanceInstructions = await Instructions.new();
      
      // TODO:
      
      instanceInterpreter = await Interpreter.new();
      instanceInstructionsProvider = await InstructionsProvider.new(instanceInterpreter.address);
      
      await instanceInstructions.addInstruction("TST", "3", "_test(bool)");
      await instanceInstructions.addInstruction("IF-ADDR", "4", "_ifAddress(address,address)");
      await instanceInstructions.addInstruction("TRANSFER-E", "1", "_transferExternal(address)");
      
      instanceDeals = await Deals.new();
    });

    it("... link contracts", async () => {
      await instanceInterpreter.setInstructionsInstance(instanceInstructions.address);
      await instanceInterpreter.setInstructionsProviderInstance(instanceInstructionsProvider.address);
      await instanceInterpreter.setDealsInstance(instanceDeals.address);
    });
  
  });

  describe ("Load data in contracts", () => {

    it("... create deal 1 : IF-ADDR('CEO')", async () => {
      tx = await instanceDeals.createDeal(externalAccounts, internalAccounts, ruleList, {from: CEO});
      expectEvent(tx, 'CreateDeal');
      
    });

  });

  describe("Use Cases", ()=> {
    let tx;
    let dealId, ruleId, articleId;

    //-----------------//
    // SINGLE ARTICLE  //
    //=================//

    describe("A-Interpret a single Article", () => {

      describe("0-Article TST", () => {
        dealId = 0;
        ruleId = 4;
  
        it("... should return event InterpretArticle with the _success=true", async () => {
          articleId = 0;
          tx = await instanceInterpreter.interpretArticle(dealId, ruleId, articleId, {from: CEO});
          expectEvent(tx,"InterpretArticle",{_from: CEO, _dealId: new BN(dealId), _ruleId: new BN(ruleId),_articleId: new BN(articleId),_success: true});
          
        });
  
        it("... should return event InterpretArticle with the _success=true", async () => {
          articleId = 1;
          tx = await instanceInterpreter.interpretArticle(dealId, ruleId, articleId, {from: CEO});
          expectEvent(tx,"InterpretArticle",{_from: CEO, _dealId: new BN(dealId), _ruleId: new BN(ruleId),_articleId: new BN(articleId),_success: false});
          
        });
  
      });
  
      describe("1-Interpret Article: IF-ADDR", () => {
  
        it("... IF-ADDR('CEO') should return event InterpretArticle with the _success=true", async () => {
          dealId = 0;
          ruleId = 0;
          articleId = 0;
          tx = await instanceInterpreter.interpretArticle(dealId,ruleId,articleId,{from: CEO});
          expectEvent(tx,"InterpretArticle",{_from: CEO, _dealId: new BN(dealId), _ruleId: new BN(ruleId),_articleId: new BN(articleId),_success: true});
          
        });
  
        it("... IF-ADDR('CHAIRMAN') should return event InterpretArticle with the _success=false", async () => {
          dealId = 0;
          ruleId = 0;
          articleId = 1;
          tx = await instanceInterpreter.interpretArticle(dealId,ruleId,articleId,{from: CEO});
          expectEvent(tx,"InterpretArticle",{_from: CEO, _dealId: new BN(dealId), _ruleId: new BN(ruleId),_articleId: new BN(articleId),_success: false});
        });

      });

      describe("2-Interpret Article: TRANSFER-E", () => {
  
        it("... should return event InterpretArticle with the _success=true", async () => {
          dealId = 0;
          ruleId = 2;
          articleId = 1;
          
          let balance = await instanceInstructionsProvider.depositsOf(ACCOUNTANT);
          console.log(">>> Balance before:", balance.toString());
          
          tx = await instanceInterpreter.interpretArticle(dealId,ruleId,articleId,{from: CEO, value:10000000000000000});
          expectEvent(tx,"InterpretArticle",{_from: CEO, _dealId: new BN(dealId), _ruleId: new BN(ruleId),_articleId: new BN(articleId),_success: true});
          
          balance = await instanceInstructionsProvider.depositsOf(ACCOUNTANT);
          console.log(">>> Balance after:", balance.toString());

          await instanceInstructionsProvider.withdraw({from: ACCOUNTANT});
        });

      });
  
    })

    //--------------//
    // SINGLE RULE  //
    //==============//

    describe("B-Interpret a single Rule", () => {
      
      describe("0-Rule 0: IF-ADDR(CEO)=true => IF-ADDR(CHAIRMAN)=false", () => {
        
        it("... should return 2 events InterpretArticle with the correct event parameters", async () => {
          dealId = 0;
          ruleId = 0;
          tx = await instanceInterpreter.interpretRule(dealId, ruleId,{from: CEO, value:10000000000000000});        
          expectEvent(tx,"InterpretArticle",{_from: CEO, _dealId: new BN(dealId), _ruleId: new BN(ruleId),_articleId: new BN(0),_success: true});
          expectEvent(tx,"InterpretArticle",{_from: CEO, _dealId: new BN(dealId), _ruleId: new BN(ruleId),_articleId: new BN(1),_success: false});
        });
      });

      describe("1-Rule 1: IF-ADDR(CHAIRMAN)=false =/> IF-ADDR(CEO)=true", () => {
        
        it("... should return 1 event InterpretArticle with the correct event parameters", async () => {
          dealId = 0;
          ruleId = 1;
          tx = await instanceInterpreter.interpretRule(dealId, ruleId,{from: CEO, value:10000000000000000});
          expectEvent(tx,"InterpretArticle",{_from: CEO, _dealId: new BN(dealId), _ruleId: new BN(ruleId),_articleId: new BN(0),_success: false});
        });
      });

      describe("2-Rule 2: IF-ADDR(CHAIRMAN)=false =/> TRANSFER-E(ACCOUNTANT)=true", () => {
        
        it("... should return 1 event InterpretArticle with the correct event parameters", async () => {
          dealId = 0;
          ruleId = 2;
          tx = await instanceInterpreter.interpretRule(dealId, ruleId, {from: CEO, value:10000000000000000});
          expectEvent(tx,"InterpretArticle",{_from: CEO, _dealId: new BN(dealId), _ruleId: new BN(ruleId),_articleId: new BN(0),_success: false});
        });

      });
      
      describe("3-Rule 3: IF-ADDR(CEO)=true => TRANSFER-E(ACCOUNTANT)=true", () => {
  
        it("... should return 1 event InterpretArticle with the correct event parameters", async () => {
          dealId = 0;
          ruleId = 3;
          tx = await instanceInterpreter.interpretRule(dealId, ruleId, {from: CEO, value:10000000000000000});
          expectEvent(tx,"InterpretArticle",{_from: CEO, _dealId: new BN(dealId), _ruleId: new BN(ruleId),_articleId: new BN(0),_success: true});
          expectEvent(tx,"InterpretArticle",{_from: CEO, _dealId: new BN(dealId), _ruleId: new BN(ruleId),_articleId: new BN(1),_success: true});
          
        });
  
      });

    });
  });
});