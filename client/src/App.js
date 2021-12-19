// EXTERNAL IMPORTS
import Web3 from "web3";
import React, { Component } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { Container } from "react-bootstrap";

// IMPORT COMPONENTS
import Header from "./components/Header";
import Home from "./components/Home";
import CreateDeal from "./components/CreateDeal";
import ExecuteDeal from "./components/ExecuteDeal";
import AdminDashboard from "./components/AdminDashboard";
import CustomModal from "./components/CustomModal";

// IMPORT CSS
import 'bootstrap/dist/css/bootstrap.min.css';
import "./App.css";

// IMPORT CONTRACTS
import Proxy from "./contracts/Proxy.json";
import Deals from "./contracts/Deals.json";
import InstructionsProvider from "./contracts/InstructionsProvider.json";

// GLOBALS
var {ethereum} = window;

class App extends Component {

  state = {
    contracts: {
      proxy:null,
      deals:null
    },
    contractOwner: null,
    accounts: null,
    selectedAccount: null,
    isOwnerAccount:false,
    metamask: {
      showModal: false,
      installed: false,
      unlocked: false,
      connected: false
    },
    ethereum: null,
    web3:null,
    priceFeedRef:null
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

  };

  /* Public Interface to Proxy */

  getContractOwner = async () => {
    const contract= this.state.contracts.proxy;
    const _contractOwner = await contract.methods.owner().call();
    this.setState({contractOwner:_contractOwner});
  }

  connectMetaMask = async () => {
    try {
      // Authenticate MetaMask
      console.log("Connecting to MetaMask ...");
      this.setState({metamask: {...this.state.metamask, connecting:true}})
      await ethereum.request({ method: 'eth_requestAccounts' });
      console.log("Connected to MetaMask!");
      this.setState({metamask: {...this.state.metamask, connecting:false, connected:true}})

      // Create web3 object
      console.log("Creating web3 object ...");
      this.setState({ web3: new Web3(this.state.ethereum) });

      // Query accounts
      console.log("Querying MetaMask accounts ...");
      //const accounts = await ethereum.request({ method: 'eth_accounts' }); // Returns accounts all in lower case (https://github.com/MetaMask/metamask-extension/issues/12348)
      const accounts = await this.state.web3.eth.getAccounts();
      this.setState({accounts});
      console.log("... accounts: ", accounts);

      // Create contract objects
      const networkId = await this.state.web3.eth.net.getId();
      const deployedNetworkProxy = Proxy.networks[networkId];
      const deployedNetworkDeals = Deals.networks[networkId];
      const deployedNetworkInstructionsProvider = InstructionsProvider.networks[networkId];
      this.setState({ 
        contracts:{
          proxy: new this.state.web3.eth.Contract(Proxy.abi, deployedNetworkProxy && deployedNetworkProxy.address),
          deals: new this.state.web3.eth.Contract(Deals.abi, deployedNetworkDeals && deployedNetworkDeals.address),
          instructionsProvider: new this.state.web3.eth.Contract(InstructionsProvider.abi, deployedNetworkInstructionsProvider && deployedNetworkInstructionsProvider.address)
        } 
      });
      console.log("Contracts instances created ...");

      // Check if user is owner 
      
      //this.setState({selectedAccount:this.state.web3.currentProvider.selectedAddress}); // Returns selectedAddress in lower case (https://github.com/MetaMask/metamask-extension/issues/12348)
      this.setState({selectedAccount:accounts[0]});

      // Load data
      await this.getContractOwner();

      // Is user logged with contract owner account?
      this.setState({isOwnerAccount: (this.state.selectedAccount.toUpperCase() === this.state.contractOwner.toUpperCase())});
      console.log("Selected account:",this.state.selectedAccount.toUpperCase());
      console.log("Contract owner:",this.state.contractOwner.toUpperCase());

      // Set event Listeners
      window.ethereum.on('accountsChanged', async (accounts) => {
        let accs = await this.state.web3.eth.getAccounts();
        //this.setState({selectedAccount:accounts[0]}) // Returns accounts in lower case (https://github.com/MetaMask/metamask-extension/issues/12348)
        this.setState({selectedAccount:accs[0]})
        // Check if the account is the owner
        this.setState({isOwnerAccount: (this.state.selectedAccount.toUpperCase() === this.state.contractOwner.toUpperCase())});
        console.log("Selected account:",this.state.selectedAccount.toUpperCase());
      });
      
    } catch (error) {
      console.error(error);
    }
  }

  disconnectMetaMask = () => {
    this.setState({
      contracts: {
        proxy:null,
        deals:null
      },
      contractOwner: null,
      accounts: null,
      selectedAccount: null,
      isOwnerAccount:false,
      metamask: {
        showModal: false,
        installed: true,
        unlocked: true,
        connected: false
      },
      web3:null,
      priceFeedRef:null
    });
    console.log("Disconnected from MetaMask");
  }
  


  render() {

    return (
      <Container>
        
        <Router>
          <Header logout={this.disconnectMetaMask}  isOwnerAccount={this.state.isOwnerAccount} metamask={this.state.metamask} handleConnectMetaMask={this.connectMetaMask} handleDisconnectMetaMask={this.disconnectMetaMask}/>
          
          {/* Modal MetaMask */}
          <CustomModal show={this.state.metamask.showModal} handleClose={() => {
            this.setState( {metamask: {...this.state.metamask, showModal: false}});
          }} />
          
          <Routes>
          <Route exact path='/' element={<Home/>}></Route>
            <Route exact path='/Home' element={<Home/>}></Route>
            <Route path='/CreateDeal' element={<CreateDeal contract={this.state.contracts.proxy} selectedAccount={this.state.selectedAccount}/>}></Route>
            <Route path='/ExecuteDeal' element={<ExecuteDeal web3={this.state.web3} contracts={this.state.contracts} selectedAccount={this.state.selectedAccount}/>}></Route>
            <Route path='/AdminDashboard' element={<AdminDashboard web3={this.state.web3} selectedAccount={this.state.selectedAccount}/>}></Route>
          </Routes>
        </Router>
      </Container>
    );
  }
}

export default App;
