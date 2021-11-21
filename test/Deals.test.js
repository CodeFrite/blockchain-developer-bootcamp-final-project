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
  const dealAccounts = [ACCOUNTANT,CEO,CHAIRMAIN];

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
        tx = await instanceDeals.createDeal(dealAccounts, ruleList);
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

      it("... accounts should match", async () => {
        // Compare external account one by one
        const dealAccountsCount = await instanceDeals.getAccountsCount(0);
        for (i=0;i<dealAccountsCount.toNumber();i++) {
          tx = await instanceDeals.getAccount(0, i);
          assert.equal(tx,dealAccounts[i],"address should match");
        }
      });

      it("... rules should match", async () => {
        // Compare external account one by one
        const rulesCount = await instanceDeals.getRulesCount(0);
        for (i=0;i<rulesCount.toNumber();i++) {
          const articlesCount = await instanceDeals.getArticlesCount(0,i);
          for (j=0;j<articlesCount;j++){
            tx = await instanceDeals.getArticle(0, i, j);
            assert.equal(tx.instructionName,ruleList[i][j][0],"instructionName not matching for Article(i,j)=(" + i + "," + j + ")");
            assert.equal(tx.paramStr,ruleList[i][j][1],"PparamStr not matching for Article(i,j)=(" + i + "," + j + ")");
            assert.equal(tx.paramUInt,ruleList[i][j][2],"paramUInt not matching for Article(i,j)=(" + i + "," + j + ")");
            assert.equal(tx.paramAddress,ruleList[i][j][3],"paramAddress not matching for Article(i,j)=(" + i + "," + j + ")");
          }
          
          //
        }
      });

    });
  });

});