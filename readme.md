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

... and bonuses when the CEO makes a payment:

![image](https://user-images.githubusercontent.com/34804976/144057427-8468723e-cb95-4362-92c6-2f0f30a93484.png)

## WorkFlow

Once connected to [MAD](), the user


## Features & User Stories

### 👔 Contract Owner

📁 `F-CO-00: Contract Owner: Contracts Migration` [[Link: Sequence Diagram]](https://sequencediagram.org/index.html#initialData=C4S2BsFMAIDEFoDCB5eAGATALmog9gHbABOAhgMbDTIDuBkxOAsiAOZmiEBQXARnsGB4AtgAdSxUORDiiAZy7jJIabODs8AV1HQAxODYALdcUgBPaACpL0ACrFNAM0dQuFIcWp0GXSAQAmihJSMqREGtp6BqzG7JB+VpYAQuB45ADWiIakIATWQcqqYVQAosCGDJCawr4BPLT0xPDwAHxlFabVOP6QoqlmDAB0PX14ZgAUtpCkwnIANNCk-v6mcnIAlG6UIABupMAw7ZXVXA0MzW3lx8Ldvf1DI-3jAArEeABWkJTzi8urG6dvE1WkdOjdoI8xg87mNxgBBTT+MA-JYrSBrTZnYGXDpVcGQgbEYYwiYASQIO3RHhRf3RAKxF1BeNuo0JxNZ8IAIsgaWiMVweu5dvtDlcwVx1kA)
+ CONTEXT: *As a contract owner, When I migrate the contracts on the blockchain, Then I should be the owner of ...*
    + 📝 US-00: *... the contract "Deals"*
    + 📝 US-01: *... the contract "Instructions"*
    + 📝 US-02: *... the contract "InstructionsProvider"*
    + 📝 US-03: *... the contract "Interpreter"*
    + 📝 US-04: *... the contract "Proxy"*

📁 `F-CO-00: Contract Owner: Pause contracts` [[Link: Sequence Diagram]](https://sequencediagram.org/index.html#initialData=C4S2BsFMAIDEFoDCB5eAGATALmog9gHbABOAhgMbDTIDuBkxOAsiAOZmiEBQXARnsGB4AtgAdSxUORDiiAZy7jJIabODs8AV1HQAxODYALdcUgBPaACpL0ACrFNAM0dQuFIcWp0GXSAQAmihJSMqREGtp6BqzG7JB+VpYAQuB45ADWiIakIATWQcqqYVQAosCGDJCawr4BPLT0xPDwAHxlFabVOP6QoqlmDAB0PX14ZgAUtpCkwnIANNCk-v6mcnIAlG6UIABupMAw7ZXVXA0MzW3lx8Ldvf1DI-3jAArEeABWkJTzi8urG6dvE1WkdOjdoI8xg87mNxgBBTT+MA-JYrSBrTZnYGXDpVcGQgbEYYwiYASQIO3RHhRf3RAKxF1BeNuo0JxNZ8IAIsgaWiMVweu5dvtDlcwVx1kA)
+ CONTEXT: *As a contract owner, When I pause the DApp, Then ...*
    + 📝 US-00: *... the contract "Deals" 's function noted pausable shouldn't be callable*
    + 📝 US-01: *... the contract "Instructions"*
    + 📝 US-02: *... the contract "InstructionsProvider"*
    + 📝 US-03: *... the contract "Interpreter"*
    + 📝 US-04: *... the contract "Proxy"*


### 👪 Unregistered User

📁 `F-UU-00: Unregistered User: General Layout`
+ CONTEXT: *As an unregistered user, When I navigate to the Home Page (/), ...*
    + 📝 US-00: *... Then I should always see the header on top (10%) and the page content below (90%) [front-end|mvp]*
    + 📝 US-01: *... And I scroll the page content, Then the header should remain fixed, always on top and visible [front-end|mvp]*
    + 📝 US-02: *... And I am not connected to a wallet (no web3 injected), Then I should see in the header the button 'Connect Wallet' [front-end|mvp]*
    + 📝 US-03: *... And I am connected to a wallet (no web3 injected), Then I should see in the content the buttons 'Register a Team' and 'Become an investor' [front-end|mvp]*

## Technologies
 
- Solidity (Smart Contract)
- Truffle (testing / unbox react)
- React / Bootstrap (Front-End)
- web3.js (Blockchain connection)

## Disclaimer

- I changed the subject of my project. Please find [here](https://github.com/CodeFrite/consensys-bootcamp-initial-idea) the initial idea I was working on.
