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
const { web3 } = require("@openzeppelin/test-helpers/src/setup");
let BN = web3.utils.BN;

contract("Proxy", async (accounts) => {
  const [CEO, CHAIRMAN, ACCOUNTANT] = accounts;
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

  const dealAccounts = [ACCOUNTANT,CEO,CHAIRMAN];
  const ruleList = 
    [
      [
        ["IF-ADDR", "CHAIRMAN", 0, CHAIRMAN],
        ["TRANSFER", "ACCOUNTANT", 0, ACCOUNTANT]
      ]
    ];

  let instanceInstructions, instanceInstructionsProvider, instanceDeals, instanceInterpreter, instanceProxy;
  
  let tx;
  let dealId=0, ruleId=0;

  const showTransactionCost = (tx) => console.log("gas used: " + tx.receipt.gasUsed);
  
  before(async () => {

    // Instantiate contracts
    instanceProxy = await Proxy.new(0,0,0,0,0,0);
    instanceInstructions = await Instructions.new();
    instanceDeals = await Deals.new();
    instanceInterpreter = await Interpreter.new();

    // Link contracts
    
    // Load instructions

    // pause the contract
  });

  describe("Access Control: ", () => {

    describe("OpenZeppelin Ownable",() => {

      it("... only owner can pause the contract", async () => {
        await expectRevert.unspecified(instanceProxy.pause({from: ACCOUNTANT}));
      });
  
      it("... only owner can unpause the contract", async () => {
        await expectRevert.unspecified(instanceProxy.unpause({from: ACCOUNTANT}));
      });  

      it("... should revert on renounceOwnership even from owner", async () => {
        await expectRevert.unspecified(instanceProxy.renounceOwnership({from: CEO}));
      });

    });

    describe("OpenZeppelin Pausable",() => {

      it("... when the contract is paused, it should emit a `Paused` event", async () => {
        let tx = await instanceProxy.pause({from:CEO});
        expectEvent(tx, "Paused");
      });

      it("... createDeal should not be callable by anyone", async () => {
        await expectRevert.unspecified(instanceProxy.createDeal(dealAccounts, ruleList));
      });

      it("... executeRule should not be callable by anyone", async () => {
        await expectRevert.unspecified(instanceProxy.executeRule(0, 1));
      });

      it("... when the contract is unpaused, it should emit a `Unpaused` event", async () => {
        let tx = await instanceProxy.unpause({from:CEO});
        expectEvent(tx, "Unpaused");
      });

      it.skip("... createDeal should then be callable by the Proxy", async () => {
        let tx = await instanceProxy.createDeal(dealAccounts, ruleList, {from:PROXY});
        expectEvent(tx,"CreateDeal");
      });

    });

  });

  describe("Setters & Getters", ()=> {
    
    before(async () => {
      // Pause the contract
      await instanceProxy.pause();
    });

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

  });

  describe("Use cases", () => {

    before(async () => {
       // Instantiate contracts
      instanceInstructions = await Instructions.new();      
      instanceInterpreter = await Interpreter.new();
      instanceInstructionsProvider = await InstructionsProvider.new("0x0000000000000000000000000000000000000000");
      instanceDeals = await Deals.new();
      instanceProxy = await Proxy.new(
        _accountCreationFees,
        _ruleCreationFees,
        _allowAllAddressesFees,
        _transactionMinimalValue,
        _transactionFees,
        _USD2WEIConversionRate
      );

      // Link contracts
      await instanceDeals.setProxyContractAddress(instanceProxy.address);
      await instanceInstructionsProvider.setInterpreterContractRef(instanceInterpreter.address);
      await instanceInstructionsProvider.setProxyInstanceRef(instanceProxy.address);
      await instanceInterpreter.setInstructionsInstance(instanceInstructions.address);
      await instanceInterpreter.setInstructionsProviderInstance(instanceInstructionsProvider.address);
      await instanceInterpreter.setDealsInstance(instanceDeals.address);
      await instanceInterpreter.setProxyContractAddress(instanceProxy.address);
      await instanceProxy.pause();
      await instanceProxy.setInstructionsContractRef(instanceInstructions.address);
      await instanceProxy.setInstructionsProviderContractRef(instanceInstructionsProvider.address);
      await instanceProxy.setDealsContractRef(instanceDeals.address);
      await instanceProxy.setInterpreterContractRef(instanceInterpreter.address);
      await instanceProxy.unpause();

      // Link Escrow

      
      // Load instructions
      await instanceInstructions.addInstruction("IF-ADDR", "1", "_ifAddress(address,address)");
      await instanceInstructions.addInstruction("TRANSFER", "2", "_transfer(address)");
    });

    describe("Create a deal with msg.value < deal creation fees", () => {
  
      it("... should revert with message `Insufficient value to cover the deal creation fees`", async () => {
        // Get the computes deal creation fees from contract
        let accountsCount = dealAccounts.length;
        let rulesCount = ruleList.length;
        let dealCreationFeesInWEI = await instanceProxy.computeDealCreationFeesInWEI(accountsCount, rulesCount);
        
        // Create the deal
        await expectRevert(
          instanceProxy.createDeal(dealAccounts,ruleList, {from: CEO, value: dealCreationFeesInWEI - 1000}),
          "Insufficient value to cover the deal creation fees"
        );
      });
    });
  
    describe("Create a deal with msg.value >= deal creation fees, let's say 1 ETH", () => {
      let tx;
      let oldContractBalance;
      let oldCallerBalance;
      let dealCreationFeesInWEI;     

      it("... should emit a PayDealCreationFees event", async () => {
        // Save the old balance
        oldContractBalance = await instanceProxy.getBalance();
        oldCallerBalance = await web3.eth.getBalance(CEO);

        // Get the computes deal creation fees from contract
        let accountsCount = dealAccounts.length;
        let rulesCount = ruleList.length;
        dealCreationFeesInWEI = await instanceProxy.computeDealCreationFeesInWEI(accountsCount, rulesCount);

        // Create the deal with 1ETH
        tx = await instanceProxy.createDeal(dealAccounts,ruleList, {from: CEO, value: 10**18});
        expectEvent(tx, "PayDealCreationFees");
      });

      it("... the contract balance should receive 100$ worth of ETH", async () => {
        let newContractBalance = await instanceProxy.getBalance();
        assert.equal(oldContractBalance.add(dealCreationFeesInWEI).toString(), newContractBalance.toString(), "newBalance != oldBalance + dealCreationFees");
      });

      it("... the excess amount payed (1ETH-100$-gas already used) should be reimbursed to the caller", async () => {
        // Compute the expected excessValue
        let newCallerBalance = await web3.eth.getBalance(CEO);
        let gasPrice = await web3.eth.getGasPrice();
        let sum = Number(newCallerBalance) + Number(dealCreationFeesInWEI) + Number(tx.receipt.cumulativeGasUsed) * gasPrice;
        // Get gas used in transaction        
        assert.equal(Math.round(Number(oldCallerBalance) / 10000000000), Math.round(Number(sum) / 10000000000), "newBalance = (oldBalance - 1 ETH - gas used)");
      });

      it("... a ReimburseExcessValue event should be emitted with the excess value and caller address mentionned", async () => {
        expectEvent(tx,"ReimburseExcessValue");
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
  
    describe("Execute rule with msg.value >= transaction minimal value", () => {
      let tx;
      let oldContractBalance;
      let oldCallerBalance;
      let oldAccountantEscrowBalance;
      let transactionFees;

      it("... should emit a PayTransactionFees event", async () => {
        oldContractBalance = await instanceProxy.getBalance();
        oldCallerBalance = await web3.eth.getBalance(CHAIRMAN);

        // Get escrow balance for CHAIRMAN
        tx = await instanceProxy.depositsOf({from:ACCOUNTANT});
        decodedLog = web3.eth.abi.decodeLog([{type: 'address',name: '_from'},{type: 'uint256',name: '_deposits'}], tx.receipt.rawLogs[0].data, tx.receipt.rawLogs[0].topics[0]);
        oldAccountantEscrowBalance = decodedLog["_deposits"];

        tx = await instanceProxy.executeRule(0, 0, {from:CHAIRMAN, value: 10**18});
        expectEvent(tx, "PayTransactionFees");
      });

      it("... the contract balance should receive 1% of value worth of ETH", async () => {
        newContractBalance = await instanceProxy.getBalance();
        transactionFees = await instanceProxy.transactionFees();
        let executionFees = Number(transactionFees) * 10**16;
        assert.equal(Number(newContractBalance), Number(oldContractBalance) + executionFees, "newBalance != oldBalance + msg.value * (transactionFees/100)");
      });

      it("... the ACCOUNTANT escrow account should receive a deposit of 1ETH - fees on his Escrow account", async () => {
        let tx = await instanceProxy.depositsOf({from:ACCOUNTANT});
        let decodedLog = web3.eth.abi.decodeLog([{type: 'address',name: '_from'},{type: 'uint256',name: '_deposits'}], tx.receipt.rawLogs[0].data, tx.receipt.rawLogs[0].topics[0]);
        let newAccountantEscrowBalance = decodedLog["_deposits"];
        
        assert.equal(Number(newAccountantEscrowBalance), Number(oldAccountantEscrowBalance + (100 - transactionFees) * 10**16),"newBalance != oldBalance + ((100 - transactionFees) / 100) * 10**18 ");
      });

      it("... the CHAIRMAN account should pay 1 ETH + gas fees", async () => {
        let newCallerBalance = await web3.eth.getBalance(CHAIRMAN);
        
        assert(newCallerBalance < (oldCallerBalance-1),"newBalance < oldBalance - 1  ETH");
      });
  
    });

    describe("Withdraw deposits from escrow account", () => {

      it("... balance shoud increase by 1ETH - fees", async () => {
        let oldAccountBalance = await web3.eth.getBalance(ACCOUNTANT);
        let tx = await debug(instanceProxy.withdraw({from:ACCOUNTANT}));
        console.log(tx);
        let newAccountBalance = await web3.eth.getBalance(ACCOUNTANT);
        console.log(newAccountBalance,oldAccountBalance);
        //assert((newAccountBalance-oldAccountBalance)>.8,"ERROR");
      });

    });
  });


});