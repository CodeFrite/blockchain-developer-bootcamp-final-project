let BN = web3.utils.BN;
let CommonStructs = artifacts.require("CommonStructs");
let Instructions = artifacts.require("Instructions");
let InstructionsProvider = artifacts.require("InstructionsProvider");
let Deals = artifacts.require("Deals");
let Interpreter = artifacts.require("Interpreter");
let Proxy = artifacts.require("Proxy");
let { catchRevert } = require("./exceptionsHelpers");
const { getMapping, isDefined, isPayable, isType } = require("./ast-helper");
const {
  expectEvent,  // Assertions for emitted events
  expectRevert, // Assertions for transactions that should fail
} = require('@openzeppelin/test-helpers');
const { assertion } = require("@openzeppelin/test-helpers/src/expectRevert");
const ether = require("@openzeppelin/test-helpers/src/ether");

contract("Proxy", async (accounts) => {
  const [CEO, CHAIRMAIN, ACCOUNTANT] = accounts;
  const emptyAddress = "0x0000000000000000000000000000000000000000";
  let _accountCreationFees = 25;
  let _ruleCreationFees = 25;
  let _allowAllAddressesFees = 100;
  let _transactionMinimalValue = 50;
  let _transactionFees = 1;
  let _USD2WEIConversionRate = 230000000000000; // #Wei per $

  /*
    4400 USD = 1 ETH
    4400 USD = 10**18 WEI
       1 USD = (10**18)/4400 WEI
  */

  const dealAccounts = [ACCOUNTANT,CEO,CHAIRMAIN];
  const ruleList = 
    [
      [
        ["IF-ADDR", "CHAIRMAN", 0, CHAIRMAIN],
        ["TRANSFER-E", "ACCOUNTANT", 0, ACCOUNTANT]
      ]
    ];

  let instanceCommon, instanceInstructions, instanceInstructionsProvider, instanceDeals, instanceInterpreter, instanceProxy;
  
  let tx;
  let dealId=0, ruleId=0;

  const showTransactionCost = (tx) => console.log("gas used: " + tx.receipt.gasUsed);
  
  before(async () => {

    // Instantiate contracts
    instanceCommon = await CommonStructs.new();
    instanceInstructions = await Instructions.new();      
    instanceInterpreter = await Interpreter.new();
    instanceInstructionsProvider = await InstructionsProvider.new(instanceInterpreter.address);
    instanceDeals = await Deals.new();
    instanceProxy = await Proxy.new(0,0,0,0,0,0);

    // Link contracts
    await instanceInterpreter.setInstructionsInstance(instanceInstructions.address);
    await instanceInterpreter.setInstructionsProviderInstance(instanceInstructionsProvider.address);
    await instanceInterpreter.setDealsInstance(instanceDeals.address);
    
    // Load instructions
    await instanceInstructions.addInstruction("IF-ADDR", "4", "_ifAddress(address,address)");
    await instanceInstructions.addInstruction("TRANSFER-E", "1", "_transferExternal(address)");
  });

  describe.skip("Setters & Getters", ()=> {

    describe("instructionsContractRef :", () => {
      
      it("... setInstructionsContractRef should return a ModifyInstructionsContractAddress", async () => {
        tx = await instanceProxy.setInstructionsContractRef(instanceInstructions.address);
        expectEvent(tx,"ModifyInstructionsContractAddress",{_from:CEO, _old:emptyAddress, _new:instanceInstructions.address});
      });

      it("... instructionsContractRef shoud return the correct address", async () => {
        tx = await instanceProxy.instructionsContractRef();
        assert.equal(tx, instanceInstructions.address);
      });

    });

    describe("dealsContractRef :", () => {

      it("... setDealsContractRef should return a ModifyDealsContractAddress", async () => {
        tx = await instanceProxy.setDealsContractRef(instanceDeals.address);
        expectEvent(tx, "ModifyDealsContractAddress",{_from:CEO, _old:emptyAddress, _new:instanceDeals.address});
      });

      it("... interpreterContractRef should return the correct address", async () => {
        tx = await instanceProxy.dealsContractRef();
        assert.equal(tx, instanceDeals.address);
      });
      
    });

    describe("interpreterContractRef :", () => {

      it("... setInterpreterContractRef should return a ModifyInterpreterContractAddress", async () => {
        tx = await instanceProxy.setInterpreterContractRef(instanceInterpreter.address);
        expectEvent(tx, "ModifyInterpreterContractAddress",{_from:CEO, _old:emptyAddress, _new:instanceInterpreter.address});
      });

      it("... interpreterContractRef should return the correct address", async () => {
        tx = await instanceProxy.interpreterContractRef();
        assert.equal(tx, instanceInterpreter.address);
      });
      
    });

    describe("accountCreationFees :", () => {

      it("... setAccountCreationFees should return a ModifyAccountCreationFees", async () => {
        tx = await instanceProxy.setAccountCreationFees(_accountCreationFees);
        expectEvent(tx, "ModifyAccountCreationFees",{_from:CEO, _old:new BN(0), _new: new BN(_accountCreationFees)});
      });

      it("... accountCreationFees should return the correct value", async () => {
        tx = await instanceProxy.accountCreationFees();
        assert.equal(tx, _accountCreationFees);
      });
      
    });

    describe("ruleCreationFees :", () => {

      it("... setRuleCreationFees should return a ModifyRuleCreationFees", async () => {
        tx = await instanceProxy.setRuleCreationFees(_ruleCreationFees);
        expectEvent(tx, "ModifyRuleCreationFees",{_from:CEO, _old:new BN(0), _new: new BN(_ruleCreationFees)});
      });

      it("... ruleCreationFees should return the correct address", async () => {
        tx = await instanceProxy.ruleCreationFees();
        assert.equal(tx, _ruleCreationFees);
      });
      
    });

    describe("allowAllAddressesFees :", () => {

      it("... setAllowAllAddressesFees should return a ModifyAllowAllAccountsFees", async () => {
        tx = await instanceProxy.setAllowAllAddressesFees(_allowAllAddressesFees);
        expectEvent(tx, "ModifyAllowAllAccountsFees",{_from:CEO, _old:new BN(0), _new: new BN(_allowAllAddressesFees)});
      });

      it("... interpreterContractRef should return the correct address", async () => {
        tx = await instanceProxy.allowAllAddressesFees();
        assert.equal(tx, _allowAllAddressesFees);
      });
      
    });

    describe("transactionMinimalValue :", () => {

      it("... setTransactionMinimalValue should return a ModifyTransactionMinimalValue", async () => {
        tx = await instanceProxy.setTransactionMinimalValue(_transactionMinimalValue);
        expectEvent(tx, "ModifyTransactionMinimalValue",{_from:CEO, _old:new BN(0), _new: new BN(_transactionMinimalValue)});
      });

      it("... interpreterContractRef should return the correct address", async () => {
        tx = await instanceProxy.transactionMinimalValue();
        assert.equal(tx, _transactionMinimalValue);
      });
      
    });

    describe("transactionFees :", () => {

      it("... setTransactionFees should return a ModifyTransactionFees", async () => {
        tx = await instanceProxy.setTransactionFees(_transactionFees);
        expectEvent(tx, "ModifyTransactionFees",{_from:CEO, _old:new BN(0), _new: new BN(_transactionFees)});
      });

      it("... interpreterContractRef should return the correct address", async () => {
        tx = await instanceProxy.transactionFees();
        assert.equal(tx, _transactionFees);
      });
      
    });

    describe("USD2WEIConversionRate :", () => {

      it("... setUSD2WEIConversionRate should return a ModifyUSD2WEIConversionRate", async () => {
        tx = await instanceProxy.setUSD2WEIConversionRate(_USD2WEIConversionRate);
        expectEvent(tx, "ModifyUSD2WEIConversionRate",{_from:CEO, _old:new BN(0), _new: new BN(_USD2WEIConversionRate)});
      });

      it("... USD2WEIConversionRate should return the correct address", async () => {
        tx = await instanceProxy.USD2WEIConversionRate();
        assert.equal(tx, _USD2WEIConversionRate);
      });
      
    });

  });

  describe("Use cases", () => {

    before(async () => {
      instanceProxy = await Proxy.new(
        _accountCreationFees,
        _ruleCreationFees,
        _allowAllAddressesFees,
        _transactionMinimalValue,
        _transactionFees,
        _USD2WEIConversionRate
        );
      await instanceProxy.setInstructionsContractRef(instanceInstructions.address);
      await instanceProxy.setDealsContractRef(instanceDeals.address);
      await instanceProxy.setInterpreterContractRef(instanceInterpreter.address);
    });

    describe("Create a deal with msg.value < deal creation fees", () => {
  
      it("... should revert with message `Insufficient value to cover the deal creation fees`", async () => {
        // Get the computes deal creation fees from contract
        let accountsCount = dealAccounts.length;
        let rulesCount = ruleList.length;
        let dealCreationFeesInETH = await instanceProxy.computeDealCreationFeesInETH(accountsCount, rulesCount);
        
        // Create the deal with exactly the right amount
        await expectRevert(
          instanceProxy.createDeal(dealAccounts,ruleList, {from: CEO, value: dealCreationFeesInETH - 1000}),
          "Insufficient value to cover the deal creation fees"
        );
      });
    });
  
    describe("Create a deal with msg.value >= deal creation fees", () => {
      let tx;
      
      it("... should emit a PayDealCreationFees event", async () => {
        // Get the computes deal creation fees from contract
        let accountsCount = dealAccounts.length;
        let rulesCount = ruleList.length;
        let dealCreationFeesInETH = await instanceProxy.computeDealCreationFeesInETH(accountsCount, rulesCount);

        // Create the deal with exactly the right amount
        tx = await instanceProxy.createDeal(dealAccounts,ruleList, {from: CEO, value: dealCreationFeesInETH});
        expectEvent(tx, "PayDealCreationFees");
      });
  
    });
  
    describe("Execute rule with msg.value < transaction minimal value", () => {
  
      it("... should revert with message `Transaction minimal value not reached`", async () => {
        let transactionMinimalValueInUSD = await instanceProxy.transactionMinimalValue();
        let transactionMinimalValueInETH = await instanceProxy.convertUSD2WEI(transactionMinimalValueInUSD);
        await expectRevert(
          instanceProxy.executeRule(0, 0, {from:CEO, value: transactionMinimalValueInETH - 1000}),
          "Transaction minimal value not reached"
        );
      });
  
    });
  
    describe.skip("Execute rule with msg.value >= transaction minimal value", () => {
  
      it("... should emit a PayTransactionFees event", async () => {
        let transactionMinimalValueInUSD = await instanceProxy.transactionMinimalValue();
        let transactionMinimalValueInETH = await instanceProxy.convertUSD2WEI(transactionMinimalValueInUSD);
        console.log(">tx min val:", transactionMinimalValueInETH.toString());
        
        tx = await instanceProxy.executeRule(0, 0, {from:CEO, value: transactionMinimalValueInETH});
        expectEvent(tx, "PayTransactionFees");
      });
  
    });
  });


});