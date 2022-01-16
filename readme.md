# ![image](https://user-images.githubusercontent.com/34804976/147816690-f141a47d-25d7-4125-8e4d-00f7ef8b9ace.png) MAD

Let's Make A Deal (MAD) : Point and click platform allowing everyone to create versatile routing rules for payments on the Ethereum blockchain

## &#128247; Quick Start

To get a general grasp on the project, I recommend watching the following videos:

1. [MAD: How to clone, test, deploy and run on your local?](https://www.youtube.com/watch?v=7ovgkmoqhyw)
2. [MAD: Connection button & Metamask](https://www.youtube.com/watch?v=v5CC_YePBZ0)
3. [MAD: How to create a Deal?](https://www.youtube.com/watch?v=4VE8muc4m50)
4. [MAD: How to execute a Rule?](https://www.youtube.com/watch?v=MqtuRp-JO-g)
5. [MAD: Manage the DApp](https://www.youtube.com/watch?v=7v6ILfD3bXI)
6. [MAD: How to upgrade the DApp?](https://www.youtube.com/watch?v=MPuyPhQfKDM)

## Accessing MAD on Rinkeby

The DApp is hosted on fleek at [https://mad.on.fleek.co/](https://mad.on.fleek.co/).

If you want to play around with the DApp parameters, you will need to connect as the contract owner. In order to do so, you can use the following passphrase in metamask. This is not my main wallet so use it freely:

```mnemonic=best present cable maid net minute culture unfold bid stable silent legend```

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

Clicking on this button will open a Metamask transaction. The msg.value displayed in the window corresponds to the amount displayed in `Clause 1` + gas fees:

![image](https://user-images.githubusercontent.com/34804976/147748652-fdba61c1-f45b-411e-8ffc-f9fe13f86993.png)

Once accepted by the user, a new frame will appear and summarize all the important informations concerning the newly created deal, the most important field being the deal id. By clicking on the block id, transaction id or the account, the user is redirected to etherscan.io where he can get more information about the transaction:

![image](https://user-images.githubusercontent.com/34804976/147748792-c974644c-8418-4193-bd69-3b4db05553b3.png)

### &#128421; Execute a Rule

On this screen, the user can load a deal, execute a single rule and withdraw any available ETH from the Escrow.

To load a deal, the user has to enter its id (shown during the deal creation) and click on the search button:

![image](https://user-images.githubusercontent.com/34804976/147753721-ce9f6823-683e-46a3-bcaa-1c0f222c648a.png)

The rules contained in the deal are then displayed on screen:

![image](https://user-images.githubusercontent.com/34804976/147753788-147844b3-56bb-4f0e-8c8e-12df3be8c794.png)

The user can then execute a single rule by clicking on the corresponding `▶` button. A popup asks for the msg.value to be sent to the rule:

![image](https://user-images.githubusercontent.com/34804976/147754002-f23caf09-acf0-49c2-a4a5-c760fb80a1b9.png)

Once selected, the transaction is triggered.

If the user has a positive balance in the OpenZeppelin Escrow contract, he can withdraw it by clicking on the withdraw button. Please note that the user balance displayed on screen is updated after each rule execution:

![image](https://user-images.githubusercontent.com/34804976/147754170-fef870ef-40c5-4569-8f58-8c1d3f8e12ef.png)

### &#128421; Admin Dashboard

On this screen, the contract owner is able to modify the different DApp fees parameters, fetch the last ETH/USD conversion rate, pause the DApp and harvest the transaction fees accumulated by the contract. He has also access to a visual representation of the contracts composing the DApp, see their addresses and know where they all points to. This screen is only accessible by the contracts owner which is determined by comparing the Metamask selectedAccount against the Proxy.sol owner (main entry point of the DApp).

To pause or unpause the DApp, the user can use these toogle buttons:

![image](https://user-images.githubusercontent.com/34804976/147815348-0cacee4b-40eb-42bc-8bdd-1e4dd1571df5.png)

To query the last ETH/USD conversion rate from Chainlink Oracle and save it to the `Proxy.sol` contract, the contract owner can press the following button. _**Please note that this feature is not available on your local, but will work on Rinkeby. To make it work on any other testnet or on the mainnet, please change the address of the Oracle in the migration script**_:

![image](https://user-images.githubusercontent.com/34804976/147815469-b1d030ff-2437-41ff-8048-b0cdd85fdadd.png)

The contract owner can modify the fees associated with the creation of an account (Clause 4) or a rule (Clause 5):

![image](https://user-images.githubusercontent.com/34804976/147815829-748c7a46-7aec-4fde-b92d-81d68c3255b3.png)

He can also modify the rule execution fees as well as the minimal transaction value:

![image](https://user-images.githubusercontent.com/34804976/147815877-39fc90ea-1857-4ca2-b293-5885ac80f76b.png)

He can withdraw the fees accumulated in the DApp and know its value:

![image](https://user-images.githubusercontent.com/34804976/148649203-b079d488-e438-48d8-b9c5-f9ec530f88e6.png)

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

My initial idea was to create an interpreter that could run any instruction defined in a meta-language. I made a first version capable of interpreting elementary mathematical operations like `(2*7)+3`. It was based on a AST Tree where each operation was stored as follow:

![image](https://user-images.githubusercontent.com/34804976/147769202-731bad0b-c52e-45c0-a0d9-febddf87a1d6.png)

In order to develop an interpreter capable of running more complex programs, I had to define 4 types of nodes:

- Operator nodes which accepts 2 operands
- Operand, which are terminal nodes and are basically values
- Branch instructions to be able to conditionally execute a part of the tree
- A jump instruction allowing me to emulate for/while loops

Moreover, I had to find a way to manage variables and scope. This means that I had to emulate a program stack used by the interpreter to keep track of intermediate computation steps.

![image](https://user-images.githubusercontent.com/34804976/147769593-2c66dd8f-bc95-4887-b244-aab4acddab43.png)

It turned out that this idea, because of the data struture and the multiple inter-contract calls, was extremely expensive in term of contract storage and gas execution fees. I finally decided to go for a simpler version.

### Specialized interpreter for payments routing

Reducing the scope to payments routing drastically simplified the problem. In a payment, the only variables are:

- The message sender
- The message value
- The message recipient

The last piece of the puzzle was to make the decision to interpret the different instructions composing a rule one after the other and stop the execution as soon as a node does not meet the execution criteria. In that case, the transaction is reverted and the funds sent back to the caller.

#### + Internal representation of a Rule

Given the choices above, a rule can be represented as a succession of nodes: the tree data structure is reduced to a one directional linked list. As an example, let's see how the following rule would be translated by the DApp:

![image](https://user-images.githubusercontent.com/34804976/147826333-1f33f699-2739-4b1a-9888-574e3f029251.png)

Each line of the table correspond to an instruction along with its input data. Let's call them `Article` (legal contract nomenclature):

![image](https://user-images.githubusercontent.com/34804976/147827094-395e15f7-ee20-4cdb-ab64-974ffef17ff6.png)

As we can see, each article is evaluated one after the other and if any fail, we stop the execution and revert the transaction.

#### + Internal representation of an Article

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

Depending on the instruction being incoded, one or more of these variables will be assigned a value. As an example, the instruction "If the sender is Manu" will be stored as follow:

```
storage article = Article(
  "IF-ADDR",                                   // instructionName
  "Manu",                                      // paramStr
  0,                                           // paramUInt (unused)
  "0x001d3f1ef827552ae1114027bd3ecf1f086ba0f9" // paramAddress
);
```
#### + Internal representation of an instruction

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

#### + Internal implementation of an instruction

As we have seen in the previous paragraph, the instruction `IF-ADDR` corresponds to the function `ifAddress(address,address)`. All the instructions defined in the DApp have their implementation declared in the `InstructionsProvider` contract. Therefore, in order to execute the instruction `IF-ADDR`, we should call `_ifAdddress(address,address)` from the `InstructionsProvider` contract which contains its implementation:

```
...
/**
* @dev Checks if the addresses in parameters are equal
* @param _address1 First address used in the comparison
* @param _address2 Second address used in the comparison
* @return Returns true if both addresses are equal
*/
function _ifAddress(address _address1, address _address2) public view onlyInterpreter returns (bool) {
    return (_address1 == _address2);
}
...
```

#### + Upgrability: How to call a function given its signature and type

Given that the DApp should be upgradable, some of the contracts will need to evolve over time. This is the case for the `Interpreter` as well as the `InstructionsProvider` contracts:

![image](https://user-images.githubusercontent.com/34804976/148951153-45b60e47-eec1-4c87-9970-4bb729173c5e.png)

As we can see, the contracts are divided into 2 categories:

- Data contracts contain client data and should never be redeployed
- Logic contracts contains the DApp logic which might change as we introduce new instructions or as we correct defects

**These remarks allow us to come to the following conclusion:** _No data contract should ever import the implementation of a logic contract. Indeed, importing a contract means copying its implementation inside the contract that imports it. If a logic contract implementation changes, it will need to be redeployed: its ABI will change ... but the calling contract will still be using an old version of its code and will not be aware of new functions or changes in existing functions._

As an example, the `Interpreter`, which is a data contract, does import the `CommonStructs`, `Instructions` and `Deals`contracts which implementations will remain unchanged during the lifetime of the DApp BUT only saves a reference to the `InstructionsProvider` contract which is a logic contract that may change in the future:

```
...
/* INTERNAL DEPENDENCIES */
import "./CommonStructs.sol";
import "./Instructions.sol";
import "./Deals.sol";
...
contract Interpreter is Ownable {

  /* STORAGE VARIABLES */

  /// @dev Instructions contract reference
  Instructions public instructionsInstance;

  /// @dev Deals contract reference
  Deals public dealsInstance;
  
  /// @dev InstructionsProvider contract reference
  address public instructionsProviderInstance;
...
```

For the sake of completeness, please note that the `Interpreter` contract does only save the `Proxy` contract address and does not import it (even if it is a data contract) because it only needs to know its address to limit the access to some of its function by defining the following modifier. By doing so, we are saving some deployments ETH:

```
...
contract Interpreter is Ownable {
...
  /// @dev Proxy contract address
  address public proxyContractAddress;
...
  /* MODIFIERS */ 
    
  /// @dev Modifier used to assess that the caller is the Proxy contract
  modifier onlyProxy() {
      require(msg.sender==proxyContractAddress, "Interpreter: Only Proxy may call");
      _;
  }
...
```

Finally, to invoke a logic contract function, we need to call it via a **_low level call_** by encoding the function signature. This allows the EVM to compute the position of our function in the byte code of our contract. This is precisely how the `Interpreter` calls the `InstructionsProvider` contract:

```
function interpretArticle(address _from, uint _dealId, uint _ruleId, uint _articleId) private returns (bool) {
...
  (_success, _result) = instructionsProviderInstance.call(
      abi.encodeWithSignature(
          instructionSignature,
          article.paramAddress,
          _from
      )
  );
...  
```

The readers interested in a more precise insight on the calls happening when interpreting a rule can refer to the following diagram:

![image](https://user-images.githubusercontent.com/34804976/149093403-da1b7f17-1232-4d70-9520-77c3156f6bb9.png)

#### Interpreting a Rule : Wrapping up

Here is a high level description of the calls happening when interpreting a rule:

![image](https://user-images.githubusercontent.com/34804976/148663327-31d49b77-3d09-4589-8bac-d41348bf0fe7.png)

As we can see, in order to interpret a rule, the Interpreter will need to answer 3 questions:

- **What should I execute?** The Interpret passes to the Deals contract the deal and rules ids. The deals contract will then return one by one the different Articles to the Proxy, here the article "IF-ADDR" along with its parameters.

- Now that the Interpreter knows which article he needs to interpret, he will ask to the Instructions contract **Where is the implementation of this instruction located?**. The Instructions contract will return to the Interpreter the signature of the function along with its type. Here, *_ifAddress(address,address)* along with the instruction type ADDRESS_ADDRESS_R_BOOL which means that *ifAddress* instruction accepts 2 addresses as a parameter and returns a boolean. 

- From that moment, the Intepreter knows how to call the correct methods inside the InstructionsProvider contract. The InstructionsProvider contract contains the implementation of all the instructions defined in the DApp which means that he knows "How to execute an instruction"

## &#11014; Upgrading the instructions set [VIDEO](XXX)

MAD architecture was designed with upgradability in mind. The main challenge in this situation is to make sure that an upgrade does not lead to a client data loss. In other words, after extending the instruction set or correcting a bug in the `Interpreter` or `InstructionsProvider` contracts, the deals as well as the Escrow balances should remain unchanged. This is done without having to migrate any data client data.

As we have seen above in the text, among the contracts, only the `Interpreter` and `InstructionsProvider` can be upgraded. In this context, `minor upgrade` will refer to an upgrade where only the `InstructionsProvider` contract is changed and `major upgrade` when both the `Interpreter` and `InstructionsProvider` need to be redeployed.

In order to facilitate the upgrade process, inside the main Truffle deployment script, namely `2_deploy_contracts.js`, 2 additional blocks of code have been added. They are called if the parameter `--upgrade minor || major` is passed to the command line:

```
...
module.exports = async function(deployer) {

  // Are we upgrading the DApp ?

  // No argument given in truffle migrate command: undefined => initial deployment
  if (argv['upgrade']===undefined) {
...
  // ... upgrade 'minor' = redeploy InstructionsProvider
  } else if (argv['upgrade']==="minor") {
...
  // ... upgrade 'major' = redeploy InstructionsProvider & Interpreter
  } else if (argv['upgrade']==="major") {
...
```

Please note that it is also possible in Truffle to define additional migration scripts, for example `3_upgrade_minor.js` and `4_upgrade_major.js` and ask Truffle to only execute the scripts which number prefix is contained between 2 values by using the parameters `-f` and `--to`:

```
truffle migrate -f 3 --to 4
```

In my situation, I found the first solution more adapted to my needs.

### &#11014; Minor Upgrade

To deploy a minor upgrade (= redeploy the `InstructionsProvider.sol` and update the links between the contracts), you can run the following command:

```
> truffle migrate --network develop --upgrade minor
```

### &#11014; Major Upgrade

To deploy a major upgrade (= redeploy the `InstructionsProvider.sol`, the `Interpreter.sol` and update the links between the contracts), you can run the following command:

```
> truffle migrate --network develop --upgrade major
```

### Initial migration

In order to migrate the DApp to the blockchain for the first time, we can use the `truffle migrate` command without mentionning the `upgrade` parameter:

```
> truffle migrate --network develop
```

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

In order to run the code locally, clone this repo. Open a terminal and navigate to the root folder, then run the following commands. Please note that your local testnet should be running on port `7545`:

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

Getting deployed contracts ABIs
Pausing DApp ...
Linking 0x2C2B9C9a4a25e24B174f26114e8926a9f2128FE4 (Deals) => 0x30753E4A8aad7F8597332E813735Def5dD395028 (Proxy)
Linking 0x9FBDa871d559710256a2502A2517b794B482Db40 (InstructionsProvider) => 0xf25186B5081Ff5cE73482AD761DB0eB0d25abfBF (Interpreter)
Linking 0x9FBDa871d559710256a2502A2517b794B482Db40 (InstructionsProvider) => 0x30753E4A8aad7F8597332E813735Def5dD395028 (Proxy)
Linking 0xf25186B5081Ff5cE73482AD761DB0eB0d25abfBF (Interpreter) => 0x8f0483125FCb9aaAEFA9209D8E9d7b9C8B9Fb90F (Instructions)
Linking 0xf25186B5081Ff5cE73482AD761DB0eB0d25abfBF (Interpreter) => 0x9FBDa871d559710256a2502A2517b794B482Db40 (InstructionsProvider)
Linking 0xf25186B5081Ff5cE73482AD761DB0eB0d25abfBF (Interpreter) => 0x2C2B9C9a4a25e24B174f26114e8926a9f2128FE4 (Deals)
Linking 0xf25186B5081Ff5cE73482AD761DB0eB0d25abfBF (Interpreter) => 0x30753E4A8aad7F8597332E813735Def5dD395028 (Proxy)
Linking 0x30753E4A8aad7F8597332E813735Def5dD395028 (Proxy) => 0x8f0483125FCb9aaAEFA9209D8E9d7b9C8B9Fb90F (Instructions)
Linking 0x30753E4A8aad7F8597332E813735Def5dD395028 (Proxy) => 0x9FBDa871d559710256a2502A2517b794B482Db40 (InstructionsProvider)
Linking 0x30753E4A8aad7F8597332E813735Def5dD395028 (Proxy) => 0x2C2B9C9a4a25e24B174f26114e8926a9f2128FE4 (Deals)
Linking 0x30753E4A8aad7F8597332E813735Def5dD395028 (Proxy) => 0xf25186B5081Ff5cE73482AD761DB0eB0d25abfBF (Interpreter)
Linking 0x30753E4A8aad7F8597332E813735Def5dD395028 (Proxy) => 0x8A753747A1Fa494EC906cE90E9f37563A8AF630e (Price Feed Aggregator)
Unpausing DApp ...
Adding instruction 'IF-ADDR'
Adding instruction 'TRANSFER'
Adding instruction 'IF-AMOUNT-BIGGER'

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
      ✓ ... only owner should be able to call, otherwise revert (22898 gas)
      ✓ ... should emit a SetInterpreterContractRef (31622 gas)
    Test supported instructions
      `IF-ADDR` instruction
        ✓ ... only Interpreter should be able to call, otherwise revert
        ✓ ... should return true when addresses are equal
        ✓ ... should return false when addresses are not equal
      `IF-AMOUNT-BIGGER` instruction
        ✓ ... only Interpreter should be able to call, otherwise revert
        ✓ ... should return true when msg.value >= _comparisonValue
        ✓ ... should return false when msg.value < _comparisonValue

  Contract: Interpreter
    Initialisation
      ✓ ... instantiate contracts (6106311 gas)
      ✓ ... link contracts (233157 gas)
      ✓ ... create deal (381342 gas)
    Access Control
      interpretRule
        ✓ ... only Proxy has access, otherwise revert (23704 gas)
    Use Cases
      A-Interpret a whole Rule
        Rule 0 - FROM CEO: IF-ADDR(CHAIRMAN)=false =/> TRANSFER(ACCOUNTANT)=false
          ✓ ... should revert (62718 gas)
        Rule 0 - FROM CHAIRMAN: IF-ADDR(CHAIRMAN)=true => TRANSFER(ACCOUNTANT)=true
          ✓ ... should return 2 events InterpretArticle with the correct event parameters (158183 gas)

  Contract: Proxy
    Access Control: 
      OpenZeppelin Ownable
        ✓ ... only owner can pause the contract (22571 gas)
        ✓ ... only owner can unpause the contract (22483 gas)
        ✓ ... should revert on renounceOwnership even from owner
      OpenZeppelin Pausable
        ✓ ... when the contract is paused, it should emit a `Paused` event (31379 gas)
        ✓ ... createDeal should not be callable by anyone (47858 gas)
        ✓ ... executeRule should not be callable by anyone (23202 gas)
        ✓ ... when the contract is unpaused, it should emit a `Unpaused` event (31285 gas)
    Setters & Getters
      instructionsContractRef :
        ✓ ... setInstructionsContractRef should return a ModifyInstructionsContractAddress (47604 gas)
        ✓ ... instructionsContractRef shoud return the correct address
      dealsContractRef :
        ✓ ... setDealsContractRef should return a ModifyDealsContractAddress (47581 gas)
        ✓ ... interpreterContractRef should return the correct address
      interpreterContractRef :
        ✓ ... setInterpreterContractRef should return a ModifyInterpreterContractAddress (47649 gas)
        ✓ ... interpreterContractRef should return the correct address
      accountCreationFees :
        ✓ ... setAccountCreationFees should return a ModifyAccountCreationFees (46318 gas)
        ✓ ... accountCreationFees should return the correct value
      ruleCreationFees :
        ✓ ... setRuleCreationFees should return a ModifyRuleCreationFees (46318 gas)
        ✓ ... ruleCreationFees should return the correct address
      allowAllAddressesFees :
        ✓ ... setAllowAllAddressesFees should return a ModifyAllowAllAccountsFees (46339 gas)
        ✓ ... interpreterContractRef should return the correct address
      transactionMinimalValue :
        ✓ ... setTransactionMinimalValue should return a ModifyTransactionMinimalValue (46340 gas)
        ✓ ... interpreterContractRef should return the correct address
      transactionFees :
        ✓ ... setTransactionFees should return a ModifyTransactionFees (46405 gas)
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
        ✓ ... should revert with message `Transaction minimal value not reached` (25068 gas)
      Execute rule with msg.value >= transaction minimal value
        ✓ ... should emit a PayTransactionFees event (174488 gas)
        ✓ ... the contract balance should receive 1% of value worth of ETH
        ✓ ... the ACCOUNTANT escrow account should receive a deposit of 1ETH - fees on his Escrow account
        ✓ ... the CHAIRMAN account should pay 1 ETH + gas fees
      Withdraw deposits from escrow account
        ✓ ... balance shoud increase by 1ETH - fees (34939 gas)
      Execute Rule 1: Split payment OF 1ETH from CEO to CHAIRMAN 75% & ACCOUNTANT 25%
        ✓ ... the CHAIRMAN balance should increase by ~.75 ETH (266311 gas)
        ✓ ... the ACCOUNTANT balance should increase by ~.25 ETH (34939 gas)
      Harvest transaction fees
        ✓ ... the owner balance should increase (29802 gas)

·------------------------------------------------------------|----------------------------|-------------|----------------------------·
|            Solc version: 0.8.9+commit.e5eed63a             ·  Optimizer enabled: false  ·  Runs: 200  ·  Block limit: 6718946 gas  │
·····························································|····························|·············|·····························
|  Methods                                                                                                                           │
·························|···································|··············|·············|·············|··············|··············
|  Contract              ·  Method                           ·  Min         ·  Max        ·  Avg        ·  # calls     ·  eur (avg)  │
·························|···································|··············|·············|·············|··············|··············
|  Deals                 ·  createDeal                       ·      381342  ·     556762  ·     506642  ·           7  ·          -  │
·························|···································|··············|·············|·············|··············|··············
|  Deals                 ·  setProxyContractAddress          ·       27464  ·      46664  ·      41864  ·           4  ·          -  │
·························|···································|··············|·············|·············|··············|··············
|  Instructions          ·  addInstruction                   ·       52713  ·      72021  ·      62335  ·           6  ·          -  │
·························|···································|··············|·············|·············|··············|··············
|  InstructionsProvider  ·  setEscrowContractRef             ·           -  ·          -  ·      31622  ·           7  ·          -  │
·························|···································|··············|·············|·············|··············|··············
|  InstructionsProvider  ·  setInterpreterContractRef        ·           -  ·          -  ·      46621  ·           3  ·          -  │
·························|···································|··············|·············|·············|··············|··············
|  Interpreter           ·  interpretRule                    ·           -  ·          -  ·     158183  ·           1  ·          -  │
·························|···································|··············|·············|·············|··············|··············
|  Interpreter           ·  setDealsInstance                 ·           -  ·          -  ·      46631  ·           2  ·          -  │
·························|···································|··············|·············|·············|··············|··············
|  Interpreter           ·  setInstructionsInstance          ·           -  ·          -  ·      46621  ·           1  ·          -  │
·························|···································|··············|·············|·············|··············|··············
|  Interpreter           ·  setInstructionsProviderInstance  ·           -  ·          -  ·      46620  ·           1  ·          -  │
·························|···································|··············|·············|·············|··············|··············
|  Interpreter           ·  setProxyContractAddress          ·           -  ·          -  ·      46708  ·           1  ·          -  │
·························|···································|··············|·············|·············|··············|··············
|  Migrations            ·  setCompleted                     ·           -  ·          -  ·      27513  ·           2  ·          -  │
·························|···································|··············|·············|·············|··············|··············
|  Proxy                 ·  createDeal                       ·           -  ·          -  ·     730884  ·           5  ·          -  │
·························|···································|··············|·············|·············|··············|··············
|  Proxy                 ·  executeRule                      ·      174488  ·     231372  ·     183969  ·           6  ·          -  │
·························|···································|··············|·············|·············|··············|··············
|  Proxy                 ·  harvest                          ·           -  ·          -  ·      29802  ·           1  ·          -  │
·························|···································|··············|·············|·············|··············|··············
|  Proxy                 ·  pause                            ·           -  ·          -  ·      31379  ·           3  ·          -  │
·························|···································|··············|·············|·············|··············|··············
|  Proxy                 ·  setAccountCreationFees           ·           -  ·          -  ·      46318  ·           3  ·          -  │
·························|···································|··············|·············|·············|··············|··············
|  Proxy                 ·  setAllowAllAddressesFees         ·           -  ·          -  ·      46339  ·           3  ·          -  │
·························|···································|··············|·············|·············|··············|··············
|  Proxy                 ·  setDealsContractRef              ·           -  ·          -  ·      47581  ·           3  ·          -  │
·························|···································|··············|·············|·············|··············|··············
|  Proxy                 ·  setInstructionsContractRef       ·           -  ·          -  ·      47604  ·           3  ·          -  │
·························|···································|··············|·············|·············|··············|··············
|  Proxy                 ·  setInterpreterContractRef        ·           -  ·          -  ·      47649  ·           3  ·          -  │
·························|···································|··············|·············|·············|··············|··············
|  Proxy                 ·  setRuleCreationFees              ·           -  ·          -  ·      46318  ·           3  ·          -  │
·························|···································|··············|·············|·············|··············|··············
|  Proxy                 ·  setTransactionFees               ·           -  ·          -  ·      46405  ·           2  ·          -  │
·························|···································|··············|·············|·············|··············|··············
|  Proxy                 ·  setTransactionMinimalValue       ·           -  ·          -  ·      46340  ·           3  ·          -  │
·························|···································|··············|·············|·············|··············|··············
|  Proxy                 ·  unpause                          ·           -  ·          -  ·      31285  ·           1  ·          -  │
·························|···································|··············|·············|·············|··············|··············
|  Proxy                 ·  withdraw                         ·           -  ·          -  ·      34939  ·           6  ·          -  │
·························|···································|··············|·············|·············|··············|··············
|  Deployments                                               ·                                          ·  % of limit  ·             │
·····························································|··············|·············|·············|··············|··············
|  CommonStructs                                             ·           -  ·          -  ·      72281  ·       1.1 %  ·          -  │
·····························································|··············|·············|·············|··············|··············
|  Deals                                                     ·           -  ·          -  ·    1420329  ·      21.1 %  ·          -  │
·····························································|··············|·············|·············|··············|··············
|  Instructions                                              ·           -  ·          -  ·     775240  ·      11.5 %  ·          -  │
·····························································|··············|·············|·············|··············|··············
|  InstructionsProvider                                      ·           -  ·          -  ·    2027826  ·      30.2 %  ·          -  │
·····························································|··············|·············|·············|··············|··············
|  Interpreter                                               ·           -  ·          -  ·    1738970  ·      25.9 %  ·          -  │
·····························································|··············|·············|·············|··············|··············
|  Migrations                                                ·           -  ·          -  ·     248842  ·       3.7 %  ·          -  │
·····························································|··············|·············|·············|··············|··············
|  Proxy                                                     ·           -  ·          -  ·    3601312  ·      53.6 %  ·          -  │
·------------------------------------------------------------|--------------|-------------|-------------|--------------|-------------·

  75 passing (45s)

```

## Directory structure

The project directory structure corresponds to the one obtained after running the `truffle unbox react` command. Please note that I have not used that command because the dependencies seems to be outdated. I just ran the `truffle init` command and then run a `npx create-react-app` command to generate a react project.

The project directory structure is as follow:

![image](https://user-images.githubusercontent.com/34804976/149611268-5f4be590-6cb5-4b56-8130-cd30cc0b88b6.png)

The folder:

- **client** contains the front-end code
- **contracts** contains my smart contracts
- **migrations** contains the truffle migration scripts
- **test** contains the smart contract test files, one per contract along with additional helper functions files

The file:
- **package.json** contains the npm dependencies
- **truffle-config** contains the truffle project configuration (infura provider, develop & rinkeby network config, solidity compiler version & eth-gas-reporter dependency)

The client directory has a react project structure:

![image](https://user-images.githubusercontent.com/34804976/149611287-42a3cde0-dbb1-4b66-ae1e-31c2c5c5d597.png)

The folder:

- **public** contains the main html page along with its logo
- **assets** contains the images used in the html page
- **components** contains the react components
- **contracts** contains the smart contracts ABI

## Technologies
 
- Solidity (Smart Contracts)
- Truffle (testing / debugging / unbox react)
- Mocha.js (testing) & Mocha.eth-gas-reporter (gas reporting)
- React / Bootstrap (Front-End)
- Node v16.9.1
- web3.js (Blockchain connection)
- Miro (prototyping). You can follow this link to see the process: [Miro Board](https://miro.com/app/board/o9J_lwU-JWc=/)

## Certificate as an NFT

If I succeed in this bootcamp, I would be glad to receive my certificate as an NFT on this address: 0x1911617464465fCF30e109bFb3A60C752950f304

Thank you :)

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
