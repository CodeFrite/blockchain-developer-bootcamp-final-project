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
    /* EVENTS */
    
    // Modify Chainlink ETH/USD price feed aggregator address

    /**
    * @dev Event emitted when the Chainlink ETH/USD price feed aggregator address is changed
    * @param _from Caller address
    * @param _old Old address of the Chainlink ETH/USD price feed aggregator address
    * @param _new New address of the Chainlink ETH/USD price feed aggregator address
    */
    event ModifyPriceFeedRefAggregatorAddress(address _from, address _old, address _new);

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

I am inheriting from OpenZeppelin `Ownable` contract to manage the access control to most of my contracts functions:

```
  /**
    * @dev Set the address to the Chainlink ETH/USD price feed aggregator
    * @param _new New address to the Chainlink ETH/USD price feed aggregator
    */
    function setPriceFeedRefAggregatorAddress(address _new) public onlyOwner {
        address old = address(priceFeedRef);
        priceFeedRef = AggregatorV3Interface(_new);
        emit ModifyPriceFeedRefAggregatorAddress(msg.sender, old, _new);
    }
```

When necessary, I also use custom modifiers to restrict the access of certain functions to certain contracts. This is part of the upgrability : indeed, when a contract calls another through a low level call, the msg.sender becomes the contract that call the function. This is for example the case in the `Interpreter` contract that restricts the access to the `interpretRule` function to the `Proxy` contract:

```
...
contract Interpreter is Ownable {
    
    /* STORAGE VARIABLES */

    /// @dev Proxy contract address
    address public proxyContractAddress;
...
    /* MODIFIERS */ 
    
    /// @dev Modifier used to assess that the caller is the Proxy contract
    modifier onlyProxy() {
        require(msg.sender==proxyContractAddress, "Interpreter: Only Proxy may call");
        _;
    }

    /* PUBLIC INTERFACE */
...
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
...
}
```
