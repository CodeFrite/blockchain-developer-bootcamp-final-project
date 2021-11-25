// SPDX-License-Identifier: GPL-3.0
pragma solidity 0.8.9;

/* EXTERNAL DEPENDENCIES */
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/Pausable.sol";


/* INTERNAL DEPENDENCIES */
import "./CommonStructs.sol";

/**
 * @title Deals contract
 * @notice Contains the client data: mapping of the rules and accounts defined by the client
 */

contract Deals is Ownable, Pausable {
    /* STORAGE VARIABLES */

    /// @dev Proxy contract address
    address public proxyContractAddress;

    /// @dev Incremental number that represents and gives access to a particular deal
    uint dealId = 0;

    /// @dev Number of rules for a particular deal (key = dealId)
    mapping (uint => uint) private rulesCount;

    /// @dev Number of articles for a particular rule (key = dealId, ruleId)
    mapping (uint => mapping(uint => uint)) private articlesCount;

    /// @dev Number of accounts for a particular deal (key = dealId)
    mapping (uint => uint) private accountsCount;

    /// @dev Mapping of accounts for a particular deal (key = dealId)
    mapping (uint => address[]) private accounts;

    /// @dev Mapping of Articles composing a particular deal (key = dealId, ruleId, ArticleId)
    mapping (uint => mapping (uint => mapping (uint => CommonStructs.Article))) private deals;
    
    /* STRUCT */
   
    /* EVENTS */

    /**
    * @dev Event emitted when the Proxy contract address is changed
    * @param _from Caller address
    * @param _old Old address of the Proxy contract
    * @param _new New address of the Proxy contract
    */
    event SetProxyContractAddress(address _from, address _old, address _new);

    /** 
    * @dev Event emitted when a deal is created
    * @param _from address that initiated the deal creation
    * @param _dealId Id of the deal created
    */
    event CreateDeal(address _from, uint _dealId);

    /* MODIFIERS */

    /// @dev Modifier used to assess that the caller is the interpreter contract instance 
    modifier onlyProxy() {
        require(msg.sender==proxyContractAddress, "Deals: Only Proxy may call");
        _;
    }

    /* PUBLIC INTERFACE */

    /**
    * @dev Sets the Proxy contract reference. Emits a SetInterpreterInstance event
    * @param _new Address of the Interpreter contract
    */
    function setProxyContractAddress(address _new) public onlyOwner {
        address old = proxyContractAddress;
        proxyContractAddress = _new;
        emit SetProxyContractAddress(msg.sender, old, _new);
    }

    /** 
    * @dev Returns the number of rules of a deal
    * @param _dealId Id of the deal
    * @return Number of rules in the deal
    */
    function getRulesCount(uint _dealId) public view returns(uint) {
        return rulesCount[_dealId];
    }

    /** 
    * @dev Returns the number of articles of a rule
    * @param _dealId Id of the deal
    * @param _ruleId Id of the rule
    * @return Number of articles in the rule
    */
    function getArticlesCount(uint _dealId, uint _ruleId) public view returns(uint) {
        return articlesCount[_dealId][_ruleId];
    }

    /** 
    * @dev Returns the number of accounts of a deal
    * @param _dealId Id of the deal
    * @return Number of accounts in the deal
    */
    function getAccountsCount(uint _dealId) public view returns(uint) {
        return accountsCount[_dealId];
    }
    
    /** 
    * @dev Returns the address of an account of a deal
    * @param _dealId Id of the deal
    * @param _accountId Id of the account
    * @return Account address
    */
    function getAccount(uint _dealId, uint _accountId) public view returns(address) {
        return accounts[_dealId][_accountId];
    }

    /** 
    * @dev Returns an article
    * @param _dealId Id of the deal
    * @param _ruleId Id of the rule
    * @param _articleId Id of the article
    * @return CommonStructs.Article
    */
    function getArticle(uint _dealId, uint _ruleId, uint _articleId) public view returns(CommonStructs.Article memory) {
        return deals[_dealId][_ruleId][_articleId];
    }
    
    /**
    * @dev Creates a deal and returns its id
    *      Only the Proxy contract can call it
    * @param _accounts List of the external accounts addresses linked to the deal
    * @param _rulesList List of the rules linked to the deal (rule = list of Articles)
    * @return Deal Id
    */
    function createDeal
    (
        address[] memory _accounts, 
        CommonStructs.Article[][] memory _rulesList
    ) 
    public 
    whenNotPaused()
    onlyProxy()
    returns (uint) {
        // Save accounts
        accountsCount[dealId] = _accounts.length;
        for(uint i=0;i<_accounts.length;i++)
            accounts[dealId].push(_accounts[i]);

        // Save the rule count
        rulesCount[dealId] = _rulesList.length;

        // Save the rule list
        for (uint i=0;i<_rulesList.length;i++){
            // Save the number of articles in the current rule
            articlesCount[dealId][i] = _rulesList[i].length;
            for (uint j=0;j<_rulesList[i].length;j++){
                deals[dealId][i][j] = _rulesList[i][j];
            }
        }
        
        // Log a CreateDeal event and increment the global dealId
        uint currentDealId = dealId;
        dealId++;
        emit CreateDeal(msg.sender, currentDealId);

        // Return the deal Id
        return currentDealId;
    }

    /**
    * @dev Access control inherited from OpenZeppelin Ownable contract
    *      Pausing the contract makes the createDeal function not callable
    *      Getters are still callable
    *      onlyOwner can call
    */
    function pause() public onlyOwner() whenNotPaused() {
        _pause();
    }

    /**
    * @dev Access control inherited from OpenZeppelin Ownable contract
    *      Unpausing the contract makes the createDeal function callable
    *      onlyOwner can call
    */
    function unpause() public onlyOwner() whenPaused() {
        _unpause();
    }

    /* OVERRIDE & BLOCK UNUSED INHERITED FUNCTIONS */

    /**
    * @dev Block OpenZeppelin Ownable.renounceOwnership
    * @notice Will always revert
    */ 
    function renounceOwnership() public pure override {
        revert('Contract cannot be revoked');
    }
}
