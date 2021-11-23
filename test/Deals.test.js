let BN = web3.utils.BN;
const {
  expectEvent,  // Assertions for emitted events
  expectRevert, // Assertions for transactions that should fail
} = require('@openzeppelin/test-helpers');
let Deals = artifacts.require("Deals");

contract("Deals", function (accounts) {
  const [CEO, CHAIRMAIN, ACCOUNTANT, PROXY] = accounts;

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

  let instanceDeals, instanceProxy;

  before(async () => {
    instanceDeals = await Deals.new();
  });

  describe("Set Proxy contract address:", () => {

    it("... should only be callable by owner, otherwise revert", async () => {
      await expectRevert.unspecified(instanceDeals.setProxyContractAddress(PROXY,{from: PROXY}));
    });

    it("... should return a SetProxyContractAddress event", async () => {
      // Set CEO as the Proxy contract address
      let tx = await instanceDeals.setProxyContractAddress(PROXY,{from: CEO});
      expectEvent(tx, "SetProxyContractAddress");
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

      it("... createDeal should then be callable by the Proxy", async () => {
        let tx = await instanceDeals.createDeal(dealAccounts, ruleList, {from:PROXY});
        expectEvent(tx,"CreateDeal");
      });

    });

  });

  describe("Use Cases", ()=> {

    describe("Create a deal", () => {
      let tx;

      before(async () => {
        await instanceDeals.setProxyContractAddress(PROXY, {from:CEO});
      });

      it("... only Proxy should be able to call createDeal, otherwise revert", async () => {
        await expectRevert.unspecified(instanceDeals.createDeal(dealAccounts, ruleList,{from:CHAIRMAIN}));
      });

      it("... should emit `CreateDeal` event", async () => {
        tx = await instanceDeals.createDeal(dealAccounts, ruleList, {from:PROXY});
        expectEvent(tx,'CreateDeal',{_from:PROXY,_dealId:new BN(1)});
      });

    });

    describe("Get the deal", () => {
      let dealId=1;
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

});