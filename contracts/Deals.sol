// SPDX-License-Identifier: GPL-3.0
pragma solidity 0.8.9;

/* EXTERNAL DEPENDENCIES */

/* INTERNAL DEPENDENCIES */
import "./CommonStructs.sol";

/**
 * @title Deals contract
 * @notice Contains the client data: mapping of the rules and accounts defined by the client
 */

contract Deals {
    /* STORAGE VARIABLES */

    /// @dev Incremental number that represents and gives access to a particular deal
    uint dealId = 0;

    /// @dev Number of rules for a particular deal (key = dealId)
    mapping (uint => uint) private rulesCount;

    /// @dev Number of articles for a particular rule (key = dealId, ruleId)
    mapping (uint => mapping(uint => uint)) private articlesCount;

    /// @dev Number of internal accounts for a particular deal (key = dealId)
    mapping (uint => uint) private internalAccountsCount;

    /// @dev Number of external accounts for a particular deal (key = dealId)
    mapping (uint => uint) private externalAccountsCount;

    /// @dev Mapping of internal accounts for a particular deal (key = dealId)
    mapping (uint => address[]) private internalAccounts;

    /// @dev Mapping of external accounts for a particular deal (key = dealId)
    mapping (uint => address[]) private externalAccounts;

    /// @dev Mapping of Articles composing a particular deal (key = dealId, ruleId, ArticleId)
    mapping (uint => mapping (uint => mapping (uint => CommonStructs.Article))) private deals;
    
    /* STRUCT */
   
    /* EVENTS */

    /** 
    * @dev Event emitted when a deal is created
    * @param _from address that initiated the deal creation
    * @param _dealId Id of the deal created
    */
    event CreateDeal(address _from, uint _dealId);

    /* PUBLIC INTERFACE */

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
    * @dev Returns the number of internal accounts of a deal
    * @param _dealId Id of the deal
    * @return Number of internal accounts in the deal
    */
    function getInternalAccountsCount(uint _dealId) public view returns(uint) {
        return internalAccountsCount[_dealId];
    }

    /** 
    * @dev Returns the number of external accounts of a deal
    * @param _dealId Id of the deal
    * @return Number of external accounts in the deal
    */
    function getExternalAccountsCount(uint _dealId) public view returns(uint) {
        return externalAccountsCount[_dealId];
    }
    
    /** 
    * @dev Returns the address of an internal account of a deal
    * @param _dealId Id of the deal
    * @param _accountId Id of the account
    * @return Internal account address
    */
    function getInternalAccount(uint _dealId, uint _accountId) public view returns(address) {
        return internalAccounts[_dealId][_accountId];
    }

    /** 
    * @dev Returns the address of an external account of a deal
    * @param _dealId Id of the deal
    * @param _accountId Id of the account
    * @return External account address
    */
    function getExternalAccount(uint _dealId, uint _accountId) public view returns(address) {
        return externalAccounts[_dealId][_accountId];
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
    * @dev Returns the list of addresses of the internal accounts for a deal
    * @param _dealId Id of the deal
    * @return Address list of internal accounts
    */
    function getInternalAccounts(uint _dealId) public view returns(address[] memory) {
        return internalAccounts[_dealId];
    }
    
    /**
    * @dev Creates a deal and returns its id
    * @param _externalAccounts List of the external accounts addresses linked to the deal
    * @param _internalAccounts List of the internal accounts addresses linked to the deal
    * @param _rulesList List of the rules linked to the deal (rule = list of Articles)
    * @return Deal Id
    */
    function createDeal
    (
        address[] memory _externalAccounts, 
        address[] memory _internalAccounts, 
        CommonStructs.Article[][] memory _rulesList
    ) 
    public returns (uint) {
        // Save external accounts
        externalAccountsCount[dealId] = _externalAccounts.length;
        for(uint i=0;i<_externalAccounts.length;i++)
            externalAccounts[dealId].push(_externalAccounts[i]);

        // Save internal accounts
        internalAccountsCount[dealId] = _internalAccounts.length;
        for(uint i=0;i<_internalAccounts.length;i++)
            internalAccounts[dealId].push(_internalAccounts[i]);

        // Save the rule count
        rulesCount[dealId] = _rulesList.length;

        // Save the rule list
        for (uint i=0;i<_rulesList.length;i++){
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
   
}
