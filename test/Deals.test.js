let BN = web3.utils.BN;
let CommonStructs = artifacts.require("CommonStructs");
let Deals = artifacts.require("Deals");
let { catchRevert } = require("./exceptionsHelpers");
const { getMapping, isDefined, isPayable, isType } = require("./ast-helper");
const {
  expectEvent,  // Assertions for emitted events
  expectRevert, // Assertions for transactions that should fail
} = require('@openzeppelin/test-helpers');

contract("Deals", function (accounts) {
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
        ["IF-ADDR", "CEO", 0, CEO],
        ["TRANSFER-E", "ACCOUNTANT", 0, ACCOUNTANT]
      ],
      [
        ["TST","",0,emptyAddress]
      ]
    ];

  let instanceCommon, instanceDeals;

  before(async () => {
    instanceCommon = await CommonStructs.new();
    instanceDeals = await Deals.new();
  });

  describe("Use Cases", ()=> {
    
    describe("Create a deal", () => {
      let tx;

      it("... should emit `CreateDeal` event", async () => {
        tx = await instanceDeals.createDeal(externalAccounts, internalAccounts, ruleList);
        expectEvent(tx,'CreateDeal');
      });

      it("... arg `_from` should match input", () => {
        assert.equal(tx.logs[0].args[0],CEO,"does not match");
      });

      it("... arg `_dealId` should match input", () => {
        assert.equal(tx.logs[0].args[1].toNumber(),0,"does not match");
      });

    });

    describe("Get the deal 0", () => {
      let tx;

      it("... externalAccounts should match", async () => {
        // Compare external account one by one
        const externalAccountsCount = await instanceDeals.getExternalAccountsCount(0);
        for (i=0;i<externalAccountsCount.toNumber();i++) {
          tx = await instanceDeals.getExternalAccount(0, i);
          assert.equal(tx,externalAccounts[i],"address should match");
        }
      });

      it("... internalAccounts should match", async () => {
        // Compare internal account one by one
        const internalAccountsCount = await instanceDeals.getInternalAccountsCount(0);
        for (i=0;i<internalAccountsCount.toNumber();i++) {
          tx = await instanceDeals.getInternalAccount(0, i);
          assert.equal(tx,internalAccounts[i],"address should match");
        }
      });
    });
  });

});