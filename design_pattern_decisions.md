# Architecture

Before diving into the discussion behind the artchitectural choices made, let's first review the general architecture of the DApp

## Diagram

![image](https://user-images.githubusercontent.com/34804976/143939305-390dfd75-3cd0-4d4f-bc4b-3e17b7c9c00b.png)

### High level architecture

On the diagram, I used 4 colors to highlight contracts depending on their main concern:

1. In &#129001;`green`, we have the `Proxy` which is, as its name suggests, the main entry point to the DApp from the end user perspective.
2. In &#128997;`red`, we have the contracts that hold client data. In order for the DApp to continue working, those contracts should never be changed.
3. In &#128998;`blue`, we have the contracts that manipulate data. These can be upgraded
4. In &#129000;`yellow`, we have the OpenZeppelin dependencies

In the diagram, I have used 3 differents types of arrows to show the nature of the dependencies between contracts (more on than below in the text):
- `imports` are represented by solid arrow with a black head
- `references` to a contract are represented with a dashed arrow with a white head
- `inheritance` is represented by a solid arrow with a white head

All contracts import the `CommonStructs` library and inherit the `Ownable` contract.

### Proxy.sol

The `Proxy` contract is the main entry point to the DApp for the end user. It is responsible for :
- routing the different incoming calls from the user, dispatching them to the correct contract and retrieving the resulting data to the caller
- keeping track of the contracts addresses as they change after contract upgrades
- storaging the values of public pricing variables

### Deals.sol

The `Deals` contract is reponsible for storing the user's data. Apart from the Escrow contract that holds the current deposit balance of the users, all the other data written to the Dapp and specific to a particular client are stored in the `Deal` contract

### Instructions.sol

The ``

## Problematic

The main feature of this project is to allow users to define conditional routes for funds by selecting simple instructions like `IF-ADDR` or `TRANSFER`. The instructions set had to be upgradable to permit new behaviors and new use cases of the DApp.

In addition, I wanted the solution to observe the following constraints:

1. Upgrading the instructions set should never lead to the loss of the client data stored and should not require any client data migration
2. Adding new instructions to the contract should not automatically lead to the need for contract(s) redeployment
3. In emergency situations, we should be able to stop the deals creation and execution
4. Prices and fees should be displayed to the client in USD

This first restriction led to the use of the Proxy Design pattern and the use of low-level inter-contract calls

TODO: Explain minor & major upgrades

## Design pattern decisions

### Inter-Contract Execution

### Inheritance and Interfaces

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
