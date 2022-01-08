# ![image](https://user-images.githubusercontent.com/34804976/147816690-f141a47d-25d7-4125-8e4d-00f7ef8b9ace.png) MAD

Let's Make A Deal (MAD) : Point and click platform allowing everyone to create versatile routing rules for payments on the Ethereum blockchain

## &#128247; Quick Start

To get a general grasp on the project, I recommend watching the following videos:

1. [MAD: How to use it?](XXX)
2. [MAD: How does it work?](XXX)
3. [MAD: How to deploy, test and run?](XXX)
4. [MAD: How to upgrade?](XXX)

## &#9881; Problematic

Let's say that you want to work with an associate on a commercial project. You know before hand that you are gonna receive all your incomes from a particular address. As associates, your desire is to simply split the incomes in 2 equal parts, 50% each.

The classical solution would be to open a bank account on both of your names, and trust each other. Even when working with someone reliable, everytime a payment is received, you will still need to split it manually.

Another method would be to create a smart contract that will split any incoming payment. Apart from the fact that you'll need to code it yourserlf or hire someone to create it for you, what happens if the deal that you have with your colleague need to be changed ? For example, a new partner associate comes on board and need to share 15% of the generated incomes, a partner leaves the deal, ... You would probably need to develop & deploy a new contract on the Blockchain.

This is where MAD comes to the rescue.

## &#128161; Idea

The goal of this DApp is to allow anyone with no prior experience in coding, to use the power of the blockchain to process incoming funds according to very simple rules and be sure that the resulting behavior will never change in the future.

But what are these rules? A rule is a succession of atomic instructions that are interpreted one after the other by the DApp. This results in the incoming funds being automatically routed to different accounts depending on defined conditions. In other words, by chaining the correct instructions, a user can "program" how an incoming payment will be processes depending on the sender and its value.

## &#128256; Use Cases

Now let's consider a few examples and how they could be solved on MAD.

### &#128256; Split incomes between associates

One of the simplest use case ever would be to split any incoming payment in half between 2 associates. On MAD you can do that in less than 30 seconds by adding the associates accounts ...

![image](https://user-images.githubusercontent.com/34804976/144054962-65a4b1bb-e67e-46a0-8dc4-6318f0c7dacc.png)

... and define how the money should be routed using the `TRANSFER-SOME` instruction. Here, any incoming payment will be equally splitted between Charlotte and Malika:

![image](https://user-images.githubusercontent.com/34804976/144055222-7891afb1-cfc0-4fb1-af39-7613155b4245.png)

### &#128256; Pay salaries & bonuses

A second use case would be to redirect the payments depending on the msg.sender. Considering the following accounts ...

![image](https://user-images.githubusercontent.com/34804976/144056915-aafea5c3-c8c8-4341-8df1-962192cdb9fd.png)

... we could then create a first rule that will pay salaries when the accountant sends funds to the DApp:

![image](https://user-images.githubusercontent.com/34804976/144057214-35a2325c-b592-4e1e-bf71-3eabf1b91206.png)

... and bonuses when the CEO makes a payment, all of this by using the `IF-ADDR` instruction:

![image](https://user-images.githubusercontent.com/34804976/144057427-8468723e-cb95-4362-92c6-2f0f30a93484.png)

## &#128421; Screens

Once connected, the user has access to the following screens:

![image](https://user-images.githubusercontent.com/34804976/147746944-e9b43c1a-dbb2-4f79-a661-273cf0432a07.png)

### &#128421; Create a Deal

The layout of this screen mimics a paper contract. It is composed out of 6 clauses, each addressing a particular part of the deal.

`Clause 0` explains to the user that all the prices shown on screen are displayed in USD. To convert ETH amounts to USD, the ETH/USD conversion rate is fetched from Chainlink Oracles. The user can see the rate and know when it was last updated

![image](https://user-images.githubusercontent.com/34804976/147745718-780ba01c-8d58-4013-99c3-d135cdcbe607.png)

`Clause 1` lists the unit price per account and per rule composing the deal, the number of such items and the total price associated with the creation of the current deal.

![image](https://user-images.githubusercontent.com/34804976/147745682-a8f9e027-1b02-42ce-9d75-66567b9be1fe.png)

`Clause 2` mentions the execution fees that the user will pay when executing a rule. The execution fees are expressed in percentage of the total msg.value.

![image](https://user-images.githubusercontent.com/34804976/147746181-23871608-4579-4e32-8191-9931da5da614.png)

`Clause 3` mentions the minimal transaction value necessary for a rule to be executed in USD.

![image](https://user-images.githubusercontent.com/34804976/147746244-9665053a-de6c-4365-a00b-8c0075b68576.png)

`Clause 4` allows the user to define the accounts that will be part of the deal.

![image](https://user-images.githubusercontent.com/34804976/147746568-ec6b87b2-bc24-4b6b-a1ad-dfa194919c59.png)

`Clause 5` allows the user to define the rules that will compose the deal. Each deal can contain several rules, each rule being composed out of a series of instructions.

![image](https://user-images.githubusercontent.com/34804976/147746600-7d97b534-80ca-419a-95e7-aac4fb216f0b.png)

At the bottom of the screen, the user can find the `Let's Make a Deal` button that triggers the deal creation. The button is only enabled once the user has accepted all the clauses by clicking on the black arrows next to the clauses.

![image](https://user-images.githubusercontent.com/34804976/147746735-b3886f9e-a49c-4373-93b0-413ee543309e.png)
![image](https://user-images.githubusercontent.com/34804976/147748748-66af07b1-7d15-4fab-ad50-843e73c1e1ef.png)

Clicking on this button will open a Metamask transaction. The msg.value displayed in the window corresponds to the amount displayed in `Clause 1`:

![image](https://user-images.githubusercontent.com/34804976/147748652-fdba61c1-f45b-411e-8ffc-f9fe13f86993.png)

Once accepted by the user, a new frame will appear and summarize all the important informations concerning the newly created deal, the most important field being the deal id. By clicking on the block id, transaction id or the account, the user is redirected to etherscan.io where he can get more information about the transaction:

![image](https://user-images.githubusercontent.com/34804976/147748792-c974644c-8418-4193-bd69-3b4db05553b3.png)

### &#128421; Execute a Rule

On this screen, the user can load a deal, execute a single rule and withdraw any available ETH from the Escrow.

To load a deal, the user has enter its id (shown during the deal creation) and click on the search button:

![image](https://user-images.githubusercontent.com/34804976/147753721-ce9f6823-683e-46a3-bcaa-1c0f222c648a.png)

The rules contained in the deal are then displayed on screen:

![image](https://user-images.githubusercontent.com/34804976/147753788-147844b3-56bb-4f0e-8c8e-12df3be8c794.png)

The user can then execute a single rule by clicking on the corresponding `▶` button. A popup asks for the msg.value to be sent to the rule:

![image](https://user-images.githubusercontent.com/34804976/147754002-f23caf09-acf0-49c2-a4a5-c760fb80a1b9.png)

Once selected, the transaction is triggered.

If the user has a positive balance in the OpenZeppelin Escrow contract, he can withdraw it by clicking on the withdraw button. Please note that the user balance displayed on screen is updated after each rule execution:

![image](https://user-images.githubusercontent.com/34804976/147754170-fef870ef-40c5-4569-8f58-8c1d3f8e12ef.png)

### &#128421; Admin Dashboard

On this screen, the contract owner is able to modify the different DApp fees parameters, fetch the last ETH/USD conversion rate, pause the DApp. He has also access to a visual representation of the contracts composing the DApp, see their addresses and know where they all points to. This screen is only accessible by the contracts owner which is determined by comparing the Metamask selectedAccount against the Proxy.sol owner (main entry point of the DApp).

To pause or unpause the DApp, the user can use these toogle buttons:

![image](https://user-images.githubusercontent.com/34804976/147815348-0cacee4b-40eb-42bc-8bdd-1e4dd1571df5.png)

To query the last ETH/USD conversion rate from Chainlink Oracle and save it to the `Proxy.sol` contract, the contract owner can press the following button. _**Please note that this feature is not available on your local, but will work on Rinkeby. To make it work on any other testnet or on the mainnet, please change the address of the Oracle in the migration script**_:

![image](https://user-images.githubusercontent.com/34804976/147815469-b1d030ff-2437-41ff-8048-b0cdd85fdadd.png)

The contract owner can modify the fees associated with the creation of an account (Clause 4) or a rule (Clause 5):

![image](https://user-images.githubusercontent.com/34804976/147815829-748c7a46-7aec-4fde-b92d-81d68c3255b3.png)

He can also modify the rule execution fees as well as the minimal transaction value:

![image](https://user-images.githubusercontent.com/34804976/147815877-39fc90ea-1857-4ca2-b293-5885ac80f76b.png)

Finally, the user can see the links between the contracts. This diagram is dynamically rendered using an html `svg` element. On the loading of the page, the contracts address are fetched from the ABI. Cliking on any address, either in the diagram or the table, will copy it to the clipboard. Hovering on a line in the table will highlight the corresponding arrow in the diagram:

![image](https://user-images.githubusercontent.com/34804976/147816339-12f3636a-5d0e-480f-a525-f0f764b7a218.png)

## WorkFlow

A typical workflow would be:

1. **Connecting to MAD**:
  - The user install & unlocks his Metamask wallet
  - He navigates to the [MAD website](XXX)
  - He then connects his wallet to the DApp

2. **Creating a Deal**:
  - The user defines the list of accounts that are part of the deal
  - He defines the rules composing the deal
  - He reads and accepts all the clauses
  - He creates the deal and pays the creation fees by accepting the transaction submitted to him in his Metamask wallet

3. **Executing a Rule**:
  - He communicates the deal id to his collaborators/clients
  - The collaborators/clients execute one or more rules from the deal
  - Any account owner defined in the deal can withdraw ETH, if available

## Instructions set

In order to illustrate the DApp upgrability, I created two different versions of the contracts.

In the V1, the following instructions are available:

- `IF-ADDR`: Tests if the msg.sender is equal to the address defined in the rule
- `TRANSFER-ALL`: Transfers all the funds to the address defined in the rule
- `TRANSFER-SOME`: Transfers a percentage of the msg.value to an address, both the percentage and the address defined in the rule

In the V2, the following instruction was added:

- `IF-AMOUNT-BIGGER`: Test if the msg.value is bigger than the amount defined in the rule

## How does it work?

### Meta-Language interpreter based on an AST Tree

My initial idea was to create an interpreter that could run any instruction defined in a meta-language. I made a first version capable of interpreting elementary mathematical operations like `(2*7)+3`. It was based on a AST Tree where each the operation was stored as follow:

![image](https://user-images.githubusercontent.com/34804976/147769202-731bad0b-c52e-45c0-a0d9-febddf87a1d6.png)

In order to develop an interpreter capable of running more complex programs, I had to define 5 types of nodes:

- Operator nodes which accepts 2 operands
- Operand, which are terminal nodes and are basically values
- Branch instructions to be able to conditionally execute a part of the tree
- A jump instruction allowing me to emulate for/while loops

Moreover, I had to find a way to manage variables and scope. This means that I had to emulate a program stack used by the interpreter to keep track of intermediate computation steps.

![image](https://user-images.githubusercontent.com/34804976/147769593-2c66dd8f-bc95-4887-b244-aab4acddab43.png)

It turned out that this idea, even if partially working, was extremely expensive in term of contract storage and gas execution fees. You can test the code on Remix [AST Tree in Solidity](XXX) or watch this video: [AST Tree: demo](XXX)

I finally decided to go for a simpler version.

### Specialized interpreter for payments routing

Reducing the scope to payments routing drastically simplified the problem. In a payment, the only variables are:

- The message sender
- The message value
- The message recipient

The last piece of the puzzle was to make the decision to interpret the different instructions composing a rule one after the other and stop the execution as soon as a node does not meet the execution criteria. In that case, the transaction is reverted and the funds sent back to the caller.

#### Internal representation of a Rule

Given the choices above, a rule can be represented as a succession of nodes: the tree data structure is reduced to a one directional linked list. As an example, let's see how the following rule would be translated by the DApp:

![image](https://user-images.githubusercontent.com/34804976/147826333-1f33f699-2739-4b1a-9888-574e3f029251.png)

Each line of the table correspond to an instruction along with its input data. Let's call them `Article` (legal contract nomenclature):

![image](https://user-images.githubusercontent.com/34804976/147827094-395e15f7-ee20-4cdb-ab64-974ffef17ff6.png)

As we can see, each article is evaluated one after the other and if any fail, we stop the execution and revert the transaction.

Internally, the deals are saved in the Deals contract. Each deal is composed out of 1...n rules (the first mapping level) and each rule is composed out of 1...m articles (the second mapping level):

```
/// @dev Mapping of Articles composing a particular deal (key = dealId, ruleId, ArticleId)
mapping (uint => mapping (uint => mapping (uint => CommonStructs.Article))) private deals;
```

An Article saves in storage the instruction name and its input parameters:

```
/**
 * @dev Represent a single instruction with its parameters
 * @param instructionName: Name of the instruction to be executed
 * @param paramStr Instruction param of type string
 * @param paramUInt Instruction param of type uint
 * @param paramAddress Instruction param of type address
 */
struct Article {
    string instructionName;
    string paramStr;
    uint paramUInt;
    address paramAddress;
}
```

Depending on the instruction being incoded, one or more of these variables will be assigned a value. As an example, the instruction "If the sender is Alex" will be stored as follow:

```
storage article = Article(
  "IF-ADDR", // instructionName
  "Alex", // paramStr
  0, // paramUInt (unused)
  "0x001d3f1ef827552ae1114027bd3ecf1f086ba0f9" // paramAddress
);
```
#### Internal representation of an instruction

The `Instructions` contract contains the mapping between the instructions nickname used in the front-end and the actual function signature as well as the instructions type:

```
contract Instructions is Ownable {

  /* STORAGE VARIABLES */

  /// @dev Mapping between instruction name used in deals Articles and instruction signature used in low level .call()
  mapping (string => string) private instructionsSignature;

  /// @dev Mapping between instruction name and its type which determines how the Interpreter will run an Article
  mapping (string => CommonStructs.InstructionTypes) private instructionsType;
  
  ...
}
```

The instructions are populated into the `Instructions` contract during the deployment by the [migration script](https://github.com/CodeFrite/blockchain-developer-bootcamp-final-project/blob/main/migrations/2_deploy_contracts.js) or manually after an upgrade, by calling the function `addInstruction`:

```
...
// Step 2: Get an instance to the deployed contracts
const instructions = await Instructions.deployed();
...
// Load instructions
console.log("Adding instruction 'IF-ADDR'");
await instructions.addInstruction("IF-ADDR", "1", "_ifAddress(address,address)");
console.log("Adding instruction 'TRANSFER'");
await instructions.addInstruction("TRANSFER", "2", "_transfer(address)");
...
```
As we can see, the instruction `IF-ADDR` corresponds to a function with signature `_ifAddress(address,address)` and with a type `1`.


#### Interpreting a Rule

Here is a high level description of the calls happening when interpreting a rule:

![image](https://user-images.githubusercontent.com/34804976/147871307-45cb776d-cc14-49a7-bc29-67377a1dbb0d.png)

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

## &#11014; Upgrading the instructions set [VIDEO](XXX)

MAD architecture was designed with upgradability in mind. The main challenge in this situation is to make sure that an upgrade does not lead to a client data loss. In other words, after extending the instruction set or correcting a bug in the `Interpreter.sol` or `InstructionsProvider.sol` contracts, the deals as well as the Escrow balance should remain unchanged. This is done without having to migrate any data. More information on this subject can be found in the file [design_pattern_decisions.md](https://github.com/CodeFrite/blockchain-developer-bootcamp-final-project/blob/main/design_pattern_decisions.md)

In order to facilitate the upgrade process, along with the main Truffle deployment script, 2 additional scripts are available.

### &#11014; Minor Upgrade

### &#11014; Major Upgrade

## Metamask

When navigating to [MAD](XXX), the user is provided with some feedback about his MetaMask installation.

If Metamask is not detected, the following popup is displayed:

![image](https://user-images.githubusercontent.com/34804976/147744304-37cdb0d5-08a5-4804-a53e-1aec8ea66f45.png)

Moreover, the MetaMask button reflects the connection status.

If Metamask not installed, the button is disabled:

![image](https://user-images.githubusercontent.com/34804976/147744348-c4a2ecf2-1dc6-49bb-8606-7991edf90705.png)

If the wallet is locked, the button is disabled:

![image](https://user-images.githubusercontent.com/34804976/147744257-4197cda1-7ea2-4c6c-a40b-82649dfd6e62.png)

If the wallet is not connected to the DApp, clicking on the button will connect the Wallet to the DApp and redirect the user to the 'Let's Create a Deal' page:

![image](https://user-images.githubusercontent.com/34804976/147744380-3ced5dd2-4938-47be-9fc7-d85460a30f3f.png)

If the wallet is connected to the DApp, clicking on the button will disconnect the user from MAD and redirect him to the homepage:

![image](https://user-images.githubusercontent.com/34804976/147744405-cfc84476-ca88-4710-8373-a4ddd433c9a7.png)

## Icon 

As recommended in the [Metamask docs](https://docs.metamask.io/guide/defining-your-icon.html), I added an icon for my DApp. It is used by Metamask to show to which application the user account is currently linked:

![image](https://user-images.githubusercontent.com/34804976/145849775-5f81808b-fe0f-4be0-aebd-076cfd43bc00.png)

Credits: The icon comes from [here](https://www.flaticon.com/premium-icon/scientist_1039065?term=mad&related_id=1039065) and is free of use for personal and commercial purpose _with attribution_: *<div>Icons made by <a href="https://www.freepik.com" title="Freepik">Freepik</a> from <a href="https://www.flaticon.com/" title="Flaticon">www.flaticon.com</a></div>*

## Installation

In order to run the code locally, clone this repo. Open a terminal and navigate to the root folder, then run the following commands:

```
> npm install
> truffle compile
> truffle migrate --network develop
```

In order to install & serve the front-end, navigate to the `client` folder and run the following command:

```
> npm install
> npm run start
```

To deploy a minor upgrade (= redeploy the `InstructionsProvider.sol` and update the links between the contracts), you can run the following command:

```
> truffle migrate --network develop --upgrade minor
```

To deploy a major upgrade (= redeploy the `InstructionsProvider.sol`, the `Interpreter.sol` and update the links between the contracts), you can run the following command:

```
> truffle migrate --network develop --upgrade major
```

## Testing

In order to run the contracts test, navigate to the project folder and run the command:

```
> truffle test
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
 
- Solidity (Smart Contracts)
- Truffle (testing / debugging / unbox react)
- Mocha.js (testing) & Mocha.eth-gas-reporter (gas reporting)
- React / Bootstrap (Front-End)
- web3.js (Blockchain connection)
- Miro (prototyping). You can follow this link to see the process: [Miro Board](https://miro.com/app/board/o9J_lwU-JWc=/)

## Possible improvements

As for any projects, particularly in the context of a time framed bootcamp, there is always room for improvements. Please find below an non-exhaustive list of features that could be added/corrected:

- Naming of setter and getters accross smart contracts should be harmonized
- Add a "VOTE" instruction to create dynamic pools (typical use case: )
- Make sure (in the front-end and/or smart contracts) that the total percentage in a rule using TRANSFER-SOME instructions adds up to 100%. Currently ...
  - ... if the sum is > 100%, I just mitigated the risk by for the user by reverting the transaction
  - ... if the sum is < 100%, the unused part of the msg.value will be stuck in the contract. Adding a check in the Interpreter.sol could detect this situation and revert the transaction
- Deal ids are generated by an auto-incremental uint256 making possible to guess a deal id. To improve data privacy, we could replace it by a randomly generated string (for example keccack of deal data + timestamp or Chainlink VRF)
- Add a view on the instruction set contained in the Instructions.sol
- Currently, the ETH/USD conversion rate has to be updated manually by calling Proxy.saveLatestQuotation() either directly or via the Admin Dashboard. This manual procedure could be automated, for example, by adding a backend job that would periodically call this function or by using [Chailink Keepers](https://docs.chain.link/docs/chainlink-keepers/introduction/)

## Disclaimer

- I changed the subject of my project. Please find [here](https://github.com/CodeFrite/consensys-bootcamp-initial-idea) the initial idea I was working on.
