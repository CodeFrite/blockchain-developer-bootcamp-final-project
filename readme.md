# blockchain-developer-bootcamp-final-project
Let's Make A Deal (MAD) : Point and click platform allowing everyone to create versatile deals on the Ethereum blockchain
 
## Problematic

- Work with someone and share the benefits
- Pay salaries
- Save money until a date is met
- Save money until an amount is reached
- ...
 
## WorkFlow




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
