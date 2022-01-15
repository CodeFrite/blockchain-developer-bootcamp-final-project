# Architecture

## Diagram

![image](https://user-images.githubusercontent.com/34804976/143939305-390dfd75-3cd0-4d4f-bc4b-3e17b7c9c00b.png)

### High level overview

On the diagram, I used 4 colors to highlight contracts depending on their main concern:

1. In &#129001;`green`, we have the `Proxy` which is, as its name suggests, the main entry point to the DApp from the end user perspective.
2. In &#128997;`red`, we have the contracts that hold client data. In order for the DApp to continue working, those contracts should never be changed.
3. In &#128998;`blue`, we have the contracts that manipulate data. These can be upgraded
4. In &#129000;`yellow`, we have the OpenZeppelin dependencies

In the diagram, I have used 3 differents types of arrows to show the nature of the dependencies between contracts (more on than below in the text):
- `imports` are represented by solid arrow with a black head
- `references` to a contract are represented with a dashed arrow with a white head
- `inheritance` is represented by a solid arrow with a white head

Please note that all contracts import the `CommonStructs` library and inherit from the `Ownable` contract (would have been to messy to add all these arrows in the diagram).

Let's now briefly describe what each contract is used for.

### &#129534; Proxy.sol

The `Proxy` contract is the main entry point to the DApp for the end user. It is responsible for:
- routing the different incoming calls from the user, dispatching them to the correct contract and retrieving the resulting data to the caller
- keeping track of the contracts addresses as they change after contract upgrades
- storaging the values of public pricing variables

### &#129534; Deals.sol

The `Deals` contract is reponsible for storing the user's data. Apart from the Escrow contract that holds the current deposit balance of the users, all the other data written to the Dapp and specific to a particular client are stored in the `Deal` contract.

### &#129534; Instructions.sol

The `Instructions` contract is reponsible for storing the supported instructions `signature` along with their instruction `type`. This is necessary to dynamically determine how to call an instruction/function implementation in the InstructionsProvider contract via a low level call.

### &#129534; InstructionsProvider.sol

The `InstructionsProvider` contract is reponsible for:
- storing the supported instructions implementation
- interacting with the OpenZeppelin `Escrow` contract and allowing deposits and withdrawal operations

### &#129534; Interpreter.sol

The `Interpreter` contract is responsible for interpreting the instructions present the deal designed by the end user through the DApp. This is where user data are injected into supported instruction to produce the dynamic behavior of the DApp.

### &#129534; CommonStructs.sol

The `CommonStructs` library is reponsible for making available to the contracts an enum and a struct used all over the DApp.

## Problematic

Now that we have a basic understanding of the architecture, let's dive deeper in the code and justify the architectural choices.

### &#127919; Constraints
The main feature of this project is to allow users to define conditional routes for funds by selecting simple instructions like `IF-ADDR` or `TRANSFER`. The instructions set had to be upgradable to permit new behaviors and new use cases of the DApp.

In addition, I wanted the solution to observe the following constraints:

1. Upgrading the instructions set should never lead to the loss of the client data stored and should not require any client data migration => Loosely coupled contracts
2. Adding new instructions to the contract should not automatically lead to the need for contract(s) redeployment => Low level calls
3. The end user shouldn't have a direct access to any of the functions which changes the contract state => Use of the Proxy pattern
4. In emergency situations, we should be able to stop the deals creation and execution => Pausable design pattern
5. Prices and fees should be displayed to the client in USD => 

Each constraint led me to an architectural choice mentioned below.

## Design pattern decisions

### Inter-Contract Execution

This DApp is composed out of 7 contracts which intensely call one another. They are divided into 2 groups, the data contracts and the logic contracts. Data contracts can be imported and call directly. The logic contracts can change over time. Therefore, their implementation shouldn't be directly imported by any contracts. All the calls should be made in low level by encoding their functions signature using the abiEncodeWithSignature function. More on that in the `readme.md` file.

### Inheritance and Interfaces

I am inheriting from the OpenZeppelin Ownable and Pausable contracts:

```
// SPDX-License-Identifier: GPL-3.0
pragma solidity 0.8.9;

/* EXTERNAL DEPENDENCIES */
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/Pausable.sol";

contract Proxy is Ownable, Pausable {
    
    /* EVENTS */

    // Modify Chainlink ETH/USD price feed aggregator address

    /**
    * @dev Event emitted when the Chainlink ETH/USD price feed aggregator address is changed
    * @param _from Caller address
    * @param _old Old address of the Chainlink ETH/USD price feed aggregator address
    * @param _new New address of the Chainlink ETH/USD price feed aggregator address
    */
    event ModifyPriceFeedRefAggregatorAddress(address _from, address _old, address _new);
...
    /* OpenZeppelin.Pausable */

    /**
    * @dev Access control inherited from OpenZeppelin Ownable contract
    * Pausing the contract makes the createDeal function not callable
    * Getters are still callable
    * Only owner can call
    */
    function pause() public onlyOwner() whenNotPaused() {
        _pause();
    }

    /**
    * @dev Access control inherited from OpenZeppelin Ownable contract
    * Unpausing the contract makes the createDeal function callable
    * Only Owner can call
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
```

I am implementing the Chainlink `AggregatorV3Interface` to fetch the last ETH to USD conversion rate in the Proxy contract:

```
...
import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";
...
contract Proxy is Ownable, Pausable {
    
    /* STORAGE VARIABLES */

    /// @dev Chainlink ETH/USD price feed aggregator link on Rinkeby
    AggregatorV3Interface public priceFeedRef;

    /// @dev Last quotation value in USD per ETH with 8 decimals precision fetched from Chainlink
    uint public lastQuotationValue;

    /// @dev Last quotation timestamp fetched from Chainlink
    uint public lastQuotationTimestamp;
...
    // Modify Chainlink ETH/USD price feed aggregator address

    /**
    * @dev Event emitted when the Chainlink ETH/USD price feed aggregator address is changed
    * @param _from Caller address
    * @param _old Old address of the Chainlink ETH/USD price feed aggregator address
    * @param _new New address of the Chainlink ETH/USD price feed aggregator address
    */
    event ModifyPriceFeedRefAggregatorAddress(address _from, address _old, address _new);
 ...
 
  /* EVENTS */

    /** 
    * @dev Event emitted when the WEI to USD conversion rate is updated from Chainlink
    * @param _from : msg.sender
    * @param _value : WEI/USD price at the time the Chainlink Oracle was called
    * @param _timestamp : timestamp at which the price was fetched from Chainlink
    */
    event QueryLastQuotationFromChainlink(address _from, uint _value, uint _timestamp);
...
    /* OWNER INTERFACE */

    // Address to Chainlink ETH/USD price feed aggregator
    
    /**
    * @dev Set the address to the Chainlink ETH/USD price feed aggregator
    * @param _new New address to the Chainlink ETH/USD price feed aggregator
    */
    function setPriceFeedRefAggregatorAddress(address _new) public onlyOwner {
        address old = address(priceFeedRef);
        priceFeedRef = AggregatorV3Interface(_new);
        emit ModifyPriceFeedRefAggregatorAddress(msg.sender, old, _new);
    }
...
    /* PUBLIC INTERFACE */
...
    /* CHAINLINK ETH/USD PRICE FEED AGGREGATOR */    
    
    /**
     * @dev Query & save the latest quotation from ChainLink price feed aggregator on Rinkeby
     */
    function saveLatestQuotation() public onlyOwner {
        // Query last ETH/USD price from ChainLink
        (, int price, , uint timestamp, ) = priceFeedRef.latestRoundData();
        
        // Save latest quotation (rounID, price & timestamp)
        lastQuotationValue = (10**18)*(10**8)/uint(price);
        lastQuotationTimestamp = timestamp;
        emit QueryLastQuotationFromChainlink(msg.sender, lastQuotationValue, timestamp);
    }

    /**
    * @dev Return the last quotation from Chainlink
    * @return Last quotation from Chainlink in WEI per USD
    * along with the query timestamp
    */
    function getLatestQuotation() public view returns(uint, uint) {
        return (lastQuotationValue, lastQuotationTimestamp);
    }
...
    }

}
```

### Chainlink Oracle [link](https://docs.chain.link/docs/get-the-latest-price/)

In order to display the prices to the user in USD, I am fetching the current ETH/USD conversion rate from a Chainlink Oracle using the following piece of code located in the `Proxy` contract. This process is manual and must be triggered by the owner as frequently as needed. It could have been easily automated by calling the aggregator periodically from a back-end but for simplicity sake (deployment of the front-end, ...) I made the choice to make it manual.

```
...
import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";

contract Proxy is Ownable, Pausable {
...
/// @dev Chainlink ETH/USD price feed aggregator link on Rinkeby
AggregatorV3Interface public priceFeedRef;
...
function saveLatestQuotation() public onlyOwner {
  // Query last ETH/USD price from ChainLink
  (, int price, , uint timestamp, ) = priceFeedRef.latestRoundData();

  // Save latest quotation (rounID, price & timestamp)
  lastQuotationValue = (10**18)*(10**8)/uint(price);
  lastQuotationTimestamp = timestamp;
  emit QueryLastQuotationFromChainlink(msg.sender, lastQuotationValue, timestamp);
}
```
For upgradibility sake, the address can be set dynamically if it happens to change:

```
function setPriceFeedRefAggregatorAddress(address _new) public onlyOwner {
  address old = address(priceFeedRef);
  priceFeedRef = AggregatorV3Interface(_new);
  emit ModifyPriceFeedRefAggregatorAddress(msg.sender, old, _new);
}
```

The conversion rate can be fetched from the contract using the following function:

```
...
/// @dev Last quotation value in USD per ETH with 8 decimals precision fetched from Chainlink
uint public lastQuotationValue;

/// @dev Last quotation timestamp fetched from Chainlink
uint public lastQuotationTimestamp;
...
function getLatestQuotation() public view returns(uint, uint) {
  return (lastQuotationValue, lastQuotationTimestamp);
}
```

It is then used in helper functions for converting amounts from ETH to USD or the other way around:

```
function convertWEI2USD(uint _amountInWEI) public view returns(uint) {
  return _amountInWEI / lastQuotationValue;
}

function convertUSD2WEI(uint _amountInUSD) public view returns(uint) {
  return _amountInUSD * lastQuotationValue;
}
```

### Access Control Design Patterns (Restricting access to certain functions using things like Ownable, Role-based Control) Access Control Design Patterns

### Upgradable Contracts


![Untitled (2)](https://user-images.githubusercontent.com/34804976/148281985-dbed2736-f063-45bc-bd0b-54c1838eed27.png)


#### Step 0: _Client calls Proxy.executeRule_

To interpret a Rule, we call the `executeRule` from the `Proxy` contract, main entry point of the DApp, by passing it the deal id along with the rule id that we want to execute, for example (0, 0). Here is the call present in the front-end inside the "ExecuteDeal.jsx" react component:

```
executeRule = async (ruleId, value) => {
  const contract = this.props.contracts.proxy;
  await contract.methods.executeRule(this.state.dealId, ruleId)
    .send({from:this.props.selectedAccount,value: value})
    .then(console.log)
    .catch((e) => alert(e.message));

  ...
}
```

After making sure that the minimal transaction value is reached, the `Proxy` contract pays the rule execution fees by simply substracting them from the msg.value and leaving them to be accumulated in the `Proxy` contract. Afterwards, it calls the `interpretRule` from the `Interpreter` contract:

```
/**
  * @dev Execute a deal's rule
  * @param _dealId : Id of the deal to execute
  * @param _ruleId : Id of the rule to execute
  */
function executeRule(uint _dealId, uint _ruleId) external payable whenNotPaused {
  // Amount sent by the user should be higher or equal to the minimal transaction value
  uint msgValueInUSD = convertWEI2USD(msg.value);
  require( msgValueInUSD >= transactionMinimalValue, "Transaction minimal value not reached");

  // Upgrability: Low level call to InstructionsProvider
  // Includes in the call (msg.value - execution fees)
  uint executionFees = (msg.value / 100) * transactionFees;
  (bool success, ) = interpreterContractRef.call{value: (msg.value - executionFees)}(
      abi.encodeWithSignature(
          "interpretRule(address,uint256,uint256)",
          msg.sender,
          _dealId, 
          _ruleId
      )
  );

  // Did the low level call succeed?
  require(success,"Proxy: Unable to execute rule");

  // Emit a PayTransactionFees
  emit PayTransactionFees(msg.sender, _dealId, _ruleId, executionFees);
}
```

#### Step 1: __Proxy calls Interpreter.interpretRule__

The `interpretRule` from the `Interpreter`contract interprets the Articles contained in the rule one by one and reverts if an Article interpretation fails. It does so by getting the number of articles (contained in storage for the particular dealId & ruleId we are trying to execute) from the `Deals.getArticlesCount()` function. Then each article is interpreter by the function `Interpreter.interpretArticle`:

```
/**
  * @dev Interprets a rule
  * @param _from Address of the user who initiated the call
  * @param _dealId Id of the deal to be executed
  * @param _ruleId Id of the rule to be executed
  */
function interpretRule(address _from, uint _dealId, uint _ruleId) external payable onlyProxy() {
    // Init the msg value used to 0
    msgValueUsed = 0;

    // Get all articles in rule
    uint articlesCount = dealsInstance.getArticlesCount(_dealId, _ruleId);

    bool success = true;
    for (uint i=0;i<articlesCount;i++) {
        success = interpretArticle(_from, _dealId, _ruleId, i);
        if (!success) {
            revert();
        }
    }
}
```

#### Step 2: __Interpreter calls Interpreter.interpretArticle__

In order to interpret a rule, the `Interpreter` contract fetches the current Article from the Deal contract. It then gets the function signature from the Instructions contract. Finally, depending on the instructionType (= function parameters & return type), it calls the InstructionsProvider contract which contains the actual implementation of the instruction defined in the DApp (like `IF-ADDR`, `TRANSFER`, ...):

```
/**
  * @dev Interprets a rule
  * @param _from Address of the user who initiated the call
  * @param _dealId Id of the deal to be executed
  * @param _ruleId Id of the rule to be executed
  * @param _articleId Id of the article to be executed
  */
function interpretArticle(address _from, uint _dealId, uint _ruleId, uint _articleId) private returns (bool) {
    // Get Article
    CommonStructs.Article memory article = dealsInstance.getArticle(_dealId, _ruleId, _articleId);

    // Get instruction type and signature
    CommonStructs.InstructionTypes instructionType;
    string memory instructionSignature;
    (instructionType, instructionSignature) = instructionsInstance.getInstruction(article.instructionName);

    //> Params injection depends on the instruction type

    // CASE ADDRESS_ADDRESS_R_BOOL: pass the Article.paramAddress field
    bool success=false;
    if (instructionType == CommonStructs.InstructionTypes.ADDRESS_ADDRESS_R_BOOL) {
        // Upgrability: Low level call to InstructionsProvider
        bool _success;
        bytes memory _result;
        (_success, _result) = instructionsProviderInstance.call(
            abi.encodeWithSignature(
                instructionSignature,
                article.paramAddress,
                _from
            )
        );
        success = _success && abi.decode(_result, (bool));

    // CASE ADDRESS_PAYABLE: pass the Article.paramAddress
    } else if (instructionType == CommonStructs.InstructionTypes.ADDRESS_PAYABLE) {
        // Upgrability: Low level call to InstructionsProvider
        bool _success;
        bytes memory _result;

        // Increment current msg.value % usage
        msgValueUsed += article.paramUInt;
        // Revert if used value > 100% of msg.value
        if (msgValueUsed>100)
            revert("Interpreter: Rule is spending more msg.value than received!");
        (_success, _result) = instructionsProviderInstance.call{value:(msg.value*article.paramUInt)/100}(
            abi.encodeWithSignature(
                instructionSignature,
                article.paramAddress
            )
        );
        success = _success;

    // MAJOR CONTRACT UPDATE : Add support for UINT_UINT_R_BOOL instructions return

    } else if (instructionType == CommonStructs.InstructionTypes.UINT_UINT_R_BOOL) {
        // Upgrability: Low level call to InstructionsProvider
        bool _success;
        bytes memory _result;
        (_success, _result) = instructionsProviderInstance.call(
            abi.encodeWithSignature(
                instructionSignature,
                msg.value,
                article.paramUInt
            )
        );
        success = _success && abi.decode(_result, (bool));

    // CASE ADDRESS_PAYABLE: pass the Article.paramAddress
    }

    // Emit an event to inform the front-end that a particular article in the rule successed or not
    emit InterpretArticle(_from, _dealId, _ruleId, _articleId);
    return success;
}
```
