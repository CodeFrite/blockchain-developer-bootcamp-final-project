let BN = web3.utils.BN;
let CommonStructs = artifacts.require("CommonStructs");
let Deals = artifacts.require("Deals");
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
        expectEvent(tx,'CreateDeal',{_from:CEO,_dealId:new BN(0)});
      });

    });

    describe("Get the deal 0", () => {
      let dealId=0;
      let tx;

      it("... rules count should match", async () => {
        const rulesCount = await instanceDeals.getRulesCount(dealId);
        assert.equal(rulesCount,ruleList.length,"Rules count does not match");
      });

      it("... articles counts should match", async () => {
        const rulesCount = await instanceDeals.getRulesCount(dealId);
        for (i=0;i<rulesCount;i++) {
          let articlesCount = await instanceDeals.getArticlesCount(dealId,i);
          assert.equal(articlesCount,ruleList[i].length,"Article count does not match for rule " + i);
        }
      });

      it("... accounts should match", async () => {
        // Compare external account one by one
        const dealAccountsCount = await instanceDeals.getAccountsCount(dealId);
        for (i=0;i<dealAccountsCount.toNumber();i++) {
          tx = await instanceDeals.getAccount(dealId, i);
          assert.equal(tx,dealAccounts[i],"address does not match");
        }
      });

      it("... rules should match", async () => {
        // Compare external account one by one
        const rulesCount = await instanceDeals.getRulesCount(dealId);
        for (i=0;i<rulesCount.toNumber();i++) {
          const articlesCount = await instanceDeals.getArticlesCount(dealId,i);
          for (j=0;j<articlesCount;j++){
            tx = await instanceDeals.getArticle(dealId, i, j);
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

  describe("Access Control: ", () => {

    describe("OpenZeppelin Ownable",() => {

      it("... only owner can pause the contract", async () => {
        await expectRevert.unspecified(instanceDeals.pause({from: ACCOUNTANT}));
      });
  
      it("... only owner can unpause the contract", async () => {
        await expectRevert.unspecified(instanceDeals.unpause({from: ACCOUNTANT}));
      });  

      it("... should revert on renounceOwnership even from owner", async () => {
        await expectRevert.unspecified(instanceDeals.renounceOwnership({from: CEO}));
      });

    });

    describe("OpenZeppelin Pausable",() => {

      it("... when the contract is paused, it should emit a `Paused` event", async () => {
        let tx = await instanceDeals.pause({from:CEO});
        expectEvent(tx, "Paused");
      });

      it("... createDeal should not be callable by anyone", async () => {
        await expectRevert.unspecified(instanceDeals.createDeal(dealAccounts, ruleList));
      });

      it("... when the contract is unpaused, it should emit a `Unpaused` event", async () => {
        let tx = await instanceDeals.unpause({from:CEO});
        expectEvent(tx, "Unpaused");
      });

      it("... createDeal should then be callable again", async () => {
        let tx = await instanceDeals.createDeal(dealAccounts, ruleList);
        expectEvent(tx,"CreateDeal");
      });

    });

  });

});