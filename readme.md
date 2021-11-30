# blockchain-developer-bootcamp-final-project
Let's Make A Deal (MAD) : Point and click platform allowing everyone to create versatile routing rules for payments on the Ethereum blockchain
 
## Problematic

Let's say that you want to work with an associate on a commercial project. You know before hand that you are gonna receive all your incomes from a particular address. As associates, your desire is to simply split the incomes in 2 equal parts, 50% each.

The classical solution would be to open a bank account on both of your names, and hope that you partner is honest. Even when working with someone reliable, everytime a payment is received, you will still need to split it manually.

Another method would be to create a smart contract that will split any incoming payment. Apart from the fact that you'll need to code it yourserlf or hire someone to create it for you, what happens if the deal that you have with your colleague need to be changed ? For example, a new partner associate comes on board and need to share 15% of the generated incomes, a partner leaves the deal, ... You would probably need to develop & deploy a new contract on the Blockchain.

This is where MAD comes to the rescue.

## Idea

The idea of this project is to allow anyone with no prior experience in coding, to use the power of the blockchain to process incoming funds he receives from the outside according to very simple rules and be sure that the resulting behavior will never change in the future.

But what are these rules? A rule is a succession of atomic instructions that are interpreted one after the other by the DApp. This results in the incoming funds being automatically routed to different accounts depending on certain conditions. In other words, by selecting the correct rules, a user can "program" how an incoming payment will be processes.

## Use Cases

Now let's consider a few examples and how they could be solved on MAD.

### &#128256; Split incomes between associates

One of the simplest use case ever would be to split any incoming payment in half between 2 associates. On MAD you can do that in less than 30 seconds by adding the associates accounts ...

![image](https://user-images.githubusercontent.com/34804976/144054962-65a4b1bb-e67e-46a0-8dc4-6318f0c7dacc.png)

... and using the `TRANSFER-SOME` instruction:

![image](https://user-images.githubusercontent.com/34804976/144055222-7891afb1-cfc0-4fb1-af39-7613155b4245.png)

### &#128256; Pay salaries & bonuses

A second use case would be to redirect the payments depending on the msg.sender. Considering the following accounts ...

![image](https://user-images.githubusercontent.com/34804976/144056915-aafea5c3-c8c8-4341-8df1-962192cdb9fd.png)

... we could then create a first rule that will pay salaries when the accountant sends funds to the DApp:

![image](https://user-images.githubusercontent.com/34804976/144057214-35a2325c-b592-4e1e-bf71-3eabf1b91206.png)

... and bonuses when the CEO makes a payment, all of this by using the `IF-ADDR` instruction:

![image](https://user-images.githubusercontent.com/34804976/144057427-8468723e-cb95-4362-92c6-2f0f30a93484.png)

## WorkFlow

Once connected to [MAD](), the user

## Installation

In order to run the code locally, clone this repo. Open a terminal and navigate to the root folder, then run the following commands:

```
> npm install
> truffle compile
> truffle migrate
> truffle exec scripts/linkContracts.js
> truffle exec scripts/loadInstructions.js
```

In order to install & serve the front-end, navigate to the `client` folder and run the following command:

```
> npm install
> npm run start
```

## Testing

In order to run the contracts test, navigate to the project folder and run the command:

```
truffle test
```

It should produce the following output:

```
> truffle test --network develop
Using network 'develop'.


Compiling your contracts...
===========================
> Compiling ./contracts/CommonStructs.sol
> Compiling ./contracts/Deals.sol
> Compiling ./contracts/Instructions.sol
> Compiling ./contracts/InstructionsProvider.sol
> Compiling ./contracts/Interpreter.sol
> Compiling ./contracts/Proxy.sol
> Artifacts written to /tmp/test--9464-T3rUCZZeAa7q
> Compiled successfully using:
   - solc: 0.8.9+commit.e5eed63a.Emscripten.clang


  Contract: CommonStructs
    Variables
      enum InstructionTypes
        ✓ should define `VOID`
        ✓ should define `ADDRESS_ADDRESS_R_BOOL`
        ✓ should define `ADDRESS_PAYABLE`
      struct Article
        ✓ should have a `instructionName` of type `string`
        ✓ should have a `paramStr` of type `string`
        ✓ should have a `paramUInt` of type `uint`
        ✓ should have a `paramAddress` of type `address`

  Contract: Deals
    Set Proxy contract address:
      ✓ ... should only be callable by owner, otherwise revert (23180 gas)
      ✓ ... should return a SetProxyContractAddress event (46664 gas)
    Access Control: 
      OpenZeppelin Ownable
        ✓ ... should revert on renounceOwnership even from owner
    Use Cases
      Create a deal
        ✓ ... only Proxy should be able to call createDeal, otherwise revert (48093 gas)
        ✓ ... should emit `CreateDeal` event (556762 gas)
      Get the deal
        ✓ ... rules count should match
        ✓ ... articles counts should match
        ✓ ... accounts should match
        ✓ ... rules should match

  Contract: Instructions
    Variables
      mapping instructionsSignature
        ✓ should have the signature `mapping(string => string)`
      mapping instructionsType
        ✓ should have the signature `mapping(string => string)`
    Use cases
      ✓ Add instruction should emit AddInstruction with the correct values (52713 gas)
      ✓ Get instruction should match input data
      ✓ Only owner should be able to call addInstruction (25313 gas)
      ✓ Ownable: should revert on renounceOwnership even from owner

  Contract: InstructionsProvider
    setInterpreterContractRef
      ✓ ... only owner should be able to call, otherwise revert (23137 gas)
      ✓ ... should emit a SetInterpreterContractRef (46621 gas)
    setEscrowContractRef
      ✓ ... only owner should be able to call, otherwise revert (22875 gas)
      ✓ ... should emit a SetInterpreterContractRef (31599 gas)
    Test supported instructions
      `IF-ADDR` instruction
        ✓ ... only Interpreter should be able to call, otherwise revert
        ✓ ... should return true when addresses are equal
        ✓ ... should return false when addresses are not equal

  Contract: Interpreter
    Initialisation
      ✓ ... instantiate contracts (5895165 gas)
      ✓ ... link contracts (233125 gas)
      ✓ ... create deal (342918 gas)
    Access Control
      interpretRule
        ✓ ... only Proxy has access, otherwise revert (23682 gas)
    Use Cases
      A-Interpret a whole Rule
        Rule 0 - FROM CEO: IF-ADDR(CHAIRMAN)=false =/> TRANSFER(ACCOUNTANT)=false
          ✓ ... should return 1 event InterpretArticle with the correct event parameters (62767 gas)
        Rule 0 - FROM CHAIRMAN: IF-ADDR(CHAIRMAN)=true => TRANSFER(ACCOUNTANT)=true
          ✓ ... should return 2 events InterpretArticle with the correct event parameters (106427 gas)

  Contract: Proxy
    Access Control: 
      OpenZeppelin Ownable
        ✓ ... only owner can pause the contract (22549 gas)
        ✓ ... only owner can unpause the contract (22505 gas)
        ✓ ... should revert on renounceOwnership even from owner
      OpenZeppelin Pausable
        ✓ ... when the contract is paused, it should emit a `Paused` event (31357 gas)
        ✓ ... createDeal should not be callable by anyone (47858 gas)
        ✓ ... executeRule should not be callable by anyone (23180 gas)
        ✓ ... when the contract is unpaused, it should emit a `Unpaused` event (31307 gas)
    Setters & Getters
      instructionsContractRef :
        ✓ ... setInstructionsContractRef should return a ModifyInstructionsContractAddress (47626 gas)
        ✓ ... instructionsContractRef shoud return the correct address
      dealsContractRef :
        ✓ ... setDealsContractRef should return a ModifyDealsContractAddress (47581 gas)
        ✓ ... interpreterContractRef should return the correct address
      interpreterContractRef :
        ✓ ... setInterpreterContractRef should return a ModifyInterpreterContractAddress (47582 gas)
        ✓ ... interpreterContractRef should return the correct address
      accountCreationFees :
        ✓ ... setAccountCreationFees should return a ModifyAccountCreationFees (46318 gas)
        ✓ ... accountCreationFees should return the correct value
      ruleCreationFees :
        ✓ ... setRuleCreationFees should return a ModifyRuleCreationFees (46340 gas)
        ✓ ... ruleCreationFees should return the correct address
      allowAllAddressesFees :
        ✓ ... setAllowAllAddressesFees should return a ModifyAllowAllAccountsFees (46317 gas)
        ✓ ... interpreterContractRef should return the correct address
      transactionMinimalValue :
        ✓ ... setTransactionMinimalValue should return a ModifyTransactionMinimalValue (46362 gas)
        ✓ ... interpreterContractRef should return the correct address
      transactionFees :
        ✓ ... setTransactionFees should return a ModifyTransactionFees (46383 gas)
        ✓ ... interpreterContractRef should return the correct address
    Use cases
      Create a deal with msg.value < deal creation fees
        ✓ ... should revert with message `Insufficient value to cover the deal creation fees` (51190 gas)
      Create a deal with msg.value >= deal creation fees, let's say 1 ETH
        ✓ ... should emit a PayDealCreationFees event (730884 gas)
        ✓ ... the contract balance should receive 100$ worth of ETH
        ✓ ... the excess amount payed (1ETH-100$-gas already used) should be reimbursed to the caller
        ✓ ... a ReimburseExcessValue event should be emitted with the excess value and caller address mentionned
      Execute rule with msg.value < transaction minimal value
        ✓ ... should revert with message `Transaction minimal value not reached` (25046 gas)
      Execute rule with msg.value >= transaction minimal value
        ✓ ... should emit a PayTransactionFees event (206435 gas)
        ✓ ... the contract balance should receive 1% of value worth of ETH
        ✓ ... the ACCOUNTANT escrow account should receive a deposit of 1ETH - fees on his Escrow account (31925 gas)
        ✓ ... the CHAIRMAN account should pay 1 ETH + gas fees
      Withdraw deposits from escrow account
        ✓ ... balance shoud increase by 1ETH - fees (37526 gas)
      Execute Rule 1: Split payment OF 1ETH from CEO to CHAIRMAN 75% & ACCOUNTANT 25%
        ✓ ... the CHAIRMAN balance should increase by ~.75 ETH (268942 gas)
        ✓ ... the ACCOUNTANT balance should increase by ~.25 ETH (37526 gas)

  71 passing (42s)

```

## Technologies
 
- Solidity (Smart Contract)
- Truffle (testing / unbox react)
- React / Bootstrap (Front-End)
- web3.js (Blockchain connection)


## Disclaimer

- I changed the subject of my project. Please find [here](https://github.com/CodeFrite/consensys-bootcamp-initial-idea) the initial idea I was working on
