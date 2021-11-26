import Web3 from "web3";
import React, { Component } from "react";
import { Container } from "react-bootstrap";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

// import components
import Header from "./components/Header";
import Home from "./components/Home";
import CreateDeal from "./components/CreateDeal";
import CustomModal from "./components/CustomModal";

// IMPORT CSS
import 'bootstrap/dist/css/bootstrap.min.css';
import "./App.css";

/* IMPORT CONTRACTS */
import Proxy from "./contracts/Proxy.json";

// GLOBALS
var {ethereum} = window;

class App extends Component {

  state = {
    contract: null,
    accounts: null,
    profile: null,
    metamask: {
      showModal: false,
      installed: false,
      unlocked: false,
      connected: false
    },
    ethereum: null,
    web3:null
  };

  
  // Check if MetaMask is installed:
  // - Has the 'ethereum' object been injected? 
  // - Is it Metamask?
  isMetaMaskInstalled = () => Boolean(ethereum && ethereum.isMetaMask);

  // Check if MetaMask is unlocked (user connected with his password)
  isMetaMaskUnlocked = async () => ethereum._metamask.isUnlocked();

  componentDidMount = async () => {
    new Promise((resolve, reject) => {
      window.addEventListener("load", async() => {
        try{
          
          // Check if MetaMask is installed
          if (this.isMetaMaskInstalled()){
            console.log("MetaMask detected!");

            // Check if MetaMask is unlocked
            let unlocked = await this.isMetaMaskUnlocked();
            
            (unlocked ? console.log("MetaMask unlocked!") : console.log("MetaMask is locked. Please unlock your wallet."));

            this.setState({
              metamask: {
                showModal: false,
                installed: true,
                unlocked,
                connecting: false,
                connected: false
              },
              ethereum: ethereum
            });
            
          } else {
            this.setState({
              metamask: {
                showModal:true,
                installed: false,
                unlocked: false,
                connecting: false,
                connected: false
              }
            });
            
            console.log("MetaMask NOT detected. Please install it.");
          }
          resolve(true);
        } catch(error) {
          reject(false);
        }
      });
    });

    // TODO: Add some listener to check wether the user change account and ask relog/connection
  };

  // TODO: Catch errors in contract calls
  // example: 
  /* 
  MetaMask - RPC Error: [ethjs-query] while formatting outputs from RPC '{"value":{"code":-32603,"data":{"message":"VM Exception while processing transaction: revert SimpleStorage: only the owner can call transferOwner","code":-32000,"data":{"0x637335867d1dfcae81bde285f33eb663003610c57b60ac86401876093344a962":{"error":"revert","program_counter":371,"return":"0x08c379a00000000000000000000000000000000000000000000000000000000000000020000000000000000000000000000000000000000000000000000000000000003453696d706c6553746f726167653a206f6e6c7920746865206f776e65722063616e2063616c6c207472616e736665724f776e6572000000000000000000000000","reason":"SimpleStorage: only the owner can call transferOwner"},"stack":"RuntimeError: VM Exception while processing transaction: revert SimpleStorage: only the owner can call transferOwner\n    at Function.RuntimeError.fromResults (/tmp/.mount_ganach1kwE0k/resources/static/node/node_modules/ganache-core/lib/utils/runtimeerror.js:94:13)\n    at BlockchainDouble.processBlock (/tmp/.mount_ganach1kwE0k/resources/static/node/node_modules/ganache-core/lib/blockchain_double.js:627:24)\n    at runMicrotasks (<anonymous>)\n    at processTicksAndRejections (internal/process/task_queues.js:93:5)","name":"RuntimeError"}}}}'
  */

  // TODO: Change transferowner . Add control: https://web3js.readthedocs.io/en/v1.5.2/web3-utils.html#checkaddresschecksum

  // TODO: Convert ether units: https://web3js.readthedocs.io/en/v1.5.2/web3-utils.html#fromwei

  // TODO: Add Transaction Event handler : look here .on('event', callback) https://web3js.readthedocs.io/en/v1.5.2/callbacks-promises-events.html

  // TODO: Give gas estimate const amountOfGas = await instance.sendTokens.estimateGas(4, myAccount); (https://www.trufflesuite.com/docs/truffle/getting-started/interacting-with-your-contracts)

  transferOwner = async () => {
    const { accounts, contract } = this.state;
    const addr = "0x16A37fc3C810161827F580E3a0B997973E304E1a";

    // Stores a given value, 5 by default.
    contract.methods.transferOwner(addr).send({ from: accounts[0] })
      .then((result) => {
        alert("OYEOYEOYE");
      })
      .catch((error) => {
        alert("KOKOKO");
      });
  };

  getOwner = async () => {
    const { contract } = this.state;
    // Get the value from the contract to prove it worked.
    const response = await contract.methods.getOwner().call();
    return response;
  }

  connectMetaMask = async () => {
    try {
      // Authenticate MetaMask
      console.log("Connecting to MetaMask ...");
      this.setState({metamask: {...this.state.metamask, connecting:true}})
      await ethereum.request({ method: 'eth_requestAccounts' });
      console.log("Connected to MetaMask!");
      this.setState({metamask: {...this.state.metamask, connecting:false, connected:true}})

      // Query accounts
      console.log("Querying MetaMask accounts ...");
      const accounts = await ethereum.request({ method: 'eth_accounts' });
      this.setState({accounts});
      console.log("... accounts: ", accounts);

      // Create web3 object
      console.log("Creating web3 object ...");
      this.setState({ web3: new Web3(this.state.ethereum) });

      // Create contract objects
      
      const networkId = await this.state.web3.eth.net.getId();
      const deployedNetwork = Proxy.networks[networkId];
      this.setState({ contract: new this.state.web3.eth.Contract(Proxy.abi, deployedNetwork && deployedNetwork.address) });
      console.log("Contract instance created ...");

      // Call contract
      
      console.log("Calling Proxy: Get rule creation fees ...");
      await this.transferOwner();
      const _newValue =  await this.getOwner();
      this.setState({ storageValue: _newValue });
      console.log("... Contract call returned value ",  _newValue);
      
    } catch (error) {
      console.error(error);
    }
  }

  disconnectMetaMask = () => {
    this.setState({
      metamask: { 
        showModal: false, 
        installed:true, 
        unlocked:true,
        connecting: false, 
        connected:false 
      },
      accounts: [],
      web3: null
    });
    console.log("Disconnected from MetaMask");
  }
  

  render() {
    return (
      <Container>
        
        <Router>
          <Header profile={this.state.profile} metamask={this.state.metamask} handleConnectMetaMask={this.connectMetaMask} handleDisconnectMetaMask={this.disconnectMetaMask}/>
          
          {/* Modal MetaMask */}
          <CustomModal show={this.state.metamask.showModal} handleClose={() => {
            this.setState( {metamask: {...this.state.metamask, showModal: false}});
          }} />
          
          <Routes>
            <Route exact path='/' element={<Home/>}></Route>
            <Route path='/CreateDeal' element={<CreateDeal/>}></Route>
          </Routes>
        </Router>
      </Container>
    );
  }
}

export default App;
