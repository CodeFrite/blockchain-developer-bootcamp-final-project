// EXTERNAL IMPORTS
import React, { Component } from 'react';
import { Container, Row, Col, Card, Button, ButtonGroup, ToggleButton } from 'react-bootstrap';

// IMPORT CONTRACTS
import Deals from "../contracts/Deals.json";
import Instructions from "../contracts/Instructions.json";
import InstructionsProvider from "../contracts/InstructionsProvider.json";
import Interpreter from "../contracts/Interpreter.json";
import Proxy from "../contracts/Proxy.json";

// IMPORT IMAGES
import imgSmartContract from '../assets/smart-contract_.png';

class AdminDashboard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      contracts: {
          deals: null,
          instructions: null,
          instructionsPovider: null,
          interpreter: null,
          proxy: null
      },
      txtVars: {
        conversionRate: null,
        lastUpdate: null,
        accountCreationFees: null,
        ruleCreationFees: null,
        transactionFees: null,
        transactionMinimalValue: null
      },
      DAppState: null,
      upgradeState: null
    }
  }

  DAPP_SET_STATE = {PAUSE:"PAUSE", RESUME:"RESUME"};
  UPGRADE_STATE = {UPTODATE:"UPTODATE", OUTDATED:"OUTDATED", BROKEN:"BROKEN"}

  // DApp state
  getDAppState = async () => {
    const DAppState = await this.state.contracts.proxy.methods.paused().call();
    this.setState({DAppState});
  }

  unpauseDApp = async () => {
    // Call contract only if DApp is paused
    if (this.state.DAppState) {
      console.log("AdminDashboard> Resuming DApp ...");
      const tx = await this.state.contracts.proxy.methods.unpause().send({from:this.props.selectedAccount});
      console.log(tx);
      console.log("AdminDashboard> ... DApp Resumed");
    }
    await this.getDAppState();
  }
  
  pauseDApp = async () => {
    // Call contract only if DApp is not paused
    if (!this.state.DAppState) {
      console.log("AdminDashboard> Pausing DAPP ...");
      const tx = await this.state.contracts.proxy.methods.pause().send({from:this.props.selectedAccount});
      console.log(tx);
      console.log("AdminDashboard> ... DApp Paused");
    }
    await this.getDAppState();
  }

  // Last quotation
  getLastQuotation = async () => {
    const tx = await this.state.contracts.proxy.methods.getLatestQuotation().call();
    
    // Convert USD/WEI to WEI/USD
    const conversionRate = (10**18) / tx[0];
    const lastUpdate = new Date(tx[1]*1000).toUTCString();

    this.setState({txtVars:{ ...this.state.txtVars, conversionRate, lastUpdate}});
    console.log("AdminDashboard> conversionRate: ", conversionRate);
    console.log("AdminDashboard> lastUpdate: ", lastUpdate);
  }

  // Additional account fees
  getAdditionalAccountFees = async () => {
    const accountCreationFees = await this.state.contracts.proxy.methods.accountCreationFees().call();
    this.setState({txtVars:{ ...this.state.txtVars, accountCreationFees}});
    console.log("AdminDashboard> accountCreationFees: ", accountCreationFees);
  }

  updateAdditionalAccountFees = async () => {
    // Get the value from the input field
    let newValue = document.getElementById("accountCreationFees").value;
    console.log("AdminDashboard> Updating account creation value", newValue, "$ ...");
    // Change the value
    await this.state.contracts.proxy.methods.setAccountCreationFees(newValue)
      .send({from:this.props.selectedAccount})
      .then(async () => {
        await this.getAdditionalAccountFees();
        console.log("AdminDashboard> ... Account creation value updated", newValue, "$");
      })
      .catch(alert);
  }

  // Additional rule fees
  getAdditionalRuleFees = async () => {
    const ruleCreationFees = await this.state.contracts.proxy.methods.ruleCreationFees().call();
    this.setState({txtVars:{ ...this.state.txtVars, ruleCreationFees}});
    console.log("AdminDashboard> ruleCreationFees: ", ruleCreationFees);
  }

  updateAdditionalRuleFees = async () => {
    // Get the value from the input field
    let newValue = document.getElementById("ruleCreationFees").value;
    console.log("AdminDashboard> Updating rule creation value", newValue, "$ ...");
    // Change the value
    await this.state.contracts.proxy.methods.setRuleCreationFees(newValue)
      .send({from:this.props.selectedAccount})
      .then(async () => {
        await this.getAdditionalRuleFees();
        console.log("AdminDashboard> ... Rule creation value updated", newValue, "$");
      })
      .catch(alert);
  }

  // Transaction fees
  getTransactionFees = async () => {
    const transactionFees = await this.state.contracts.proxy.methods.transactionFees().call();
    this.setState({txtVars:{ ...this.state.txtVars, transactionFees}});
    console.log("AdminDashboard> transactionFees: ", transactionFees);
  }

  updateTransactionFees = async () => {
    // Get the value from the input field
    let newValue = document.getElementById("transactionFees").value;
    console.log("AdminDashboard> Updating transaction fees", newValue, "$ ...");
    // Change the value
    await this.state.contracts.proxy.methods.setTransactionFees(newValue)
      .send({from:this.props.selectedAccount})
      .then(async () => {
        await this.getTransactionFees();
        console.log("AdminDashboard> ... Transaction fees updated", newValue, "$");
      })
      .catch(alert);
  }

  // Transaction minimal value
  getTransactionMinimalValue = async () => {
    const transactionMinimalValue = await this.state.contracts.proxy.methods.transactionMinimalValue().call();
    this.setState({txtVars:{ ...this.state.txtVars, transactionMinimalValue}});
    console.log("AdminDashboard> transactionMinimalValue: ", transactionMinimalValue);
  }

  updateTransactionMinimalValue = async () => {
    // Get the value from the input field
    let newValue = document.getElementById("transactionMinimalValue").value;
    console.log("AdminDashboard> Updating transaction minimal value", newValue, "$ ...");
    // Change the value
    await this.state.contracts.proxy.methods.setTransactionMinimalValue(newValue)
      .send({from:this.props.selectedAccount})
      .then(async () => {
        await this.getTransactionMinimalValue();
        console.log("AdminDashboard> ... Transaction minimal value updated", newValue, "$");
      })
      .catch(alert);
  }

  // Upgradibility
  upgradeInstructionsProvider = async (newAddress) => {
    // Transfer Escrow ownership

    // Update ref InstructionsProvider => Proxy

    // Update ref InstructionsProvider => Interpreter

    // Update ref InstructionsProvider => Escrow
    
    // Update ref Proxy => InstructionsProvider

    // Update ref Interpreter => InstructionsProvider

  }

  componentDidMount = async () => {
    // Save web3 object to state
    const { web3 } = this.props;
      
    // Load contracts ABI
    const networkId = await web3.eth.net.getId();
    const deployedNetworkDeals = Deals.networks[networkId];
    const deployedNetworkInstructions = Instructions.networks[networkId];
    const deployedNetworkInstructionsProvider = InstructionsProvider.networks[networkId];
    const deployedNetworkInterpreter = Interpreter.networks[networkId];
    const deployedNetworkProxy = Proxy.networks[networkId];

    // Save contracts ABI to state
    this.setState({ 
      contracts:{
        deals: new web3.eth.Contract(Deals.abi, deployedNetworkDeals && deployedNetworkDeals.address),
        instructions: new web3.eth.Contract(Instructions.abi, deployedNetworkInstructions && deployedNetworkInstructions.address),
        instructionsProvider: new web3.eth.Contract(Instructions.abi, deployedNetworkInstructionsProvider && deployedNetworkInstructionsProvider.address),
        interpreter: new web3.eth.Contract(Instructions.abi, deployedNetworkInterpreter && deployedNetworkInterpreter.address),
        proxy: new web3.eth.Contract(Proxy.abi, deployedNetworkProxy && deployedNetworkProxy.address)
      } 
    });
    console.log("AdminDashboard> Contracts abi loaded ...");

    /* LOAD DATA FROM CONTRACTS */

    // Get DApp state
    await this.getDAppState();

    // Load ETH/USD conversion rate
    await this.getLastQuotation();

    // Load additional account creation fees
    await this.getAdditionalAccountFees();

    // Load additional rule creation fees
    await this.getAdditionalRuleFees();

    // Load transaction fees
    await this.getTransactionFees();

    // Laod transaction minimal value
    await this.getTransactionMinimalValue();
  }

  render() { 
    return (  
      <Container id="main-container">
        <Row>
          <Col xs="9"><h1>Let's Manage the DApp</h1></Col>
          <Col>
            <ButtonGroup className="mb-2">
              <ToggleButton
                id="toggle-check"
                type="checkbox"
                variant="outline-success"
                checked={!this.state.DAppState}
                value="true"
                onClick={() => this.unpauseDApp()}
              >
                Unpause
              </ToggleButton>
              <ToggleButton
                id="toggle-check"
                type="checkbox"
                variant="outline-danger"
                checked={this.state.DAppState}
                value="false"
                onClick={() => this.pauseDApp()}
              >
                Pause
              </ToggleButton>
            </ButtonGroup>
          </Col>
        </Row>
        <br/>
        <h2>DApp parameters</h2>
        <br/>
        <Row>
          <Col xs={4}>
            <Card>
              <Card.Header>ETH/USD conversion rate</Card.Header>
              <Card.Body>
                <Card.Title>Last quotation</Card.Title>
                <Card.Text>
                  + {this.state.txtVars.conversionRate} USD/ETH
                  <br/>
                  + @{this.state.txtVars.lastUpdate}
                  <hr/>
                  <Button variant="primary" size="sm">Update</Button>
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
          <Col xs={4}>
            <Card>
              <Card.Header>Additional Account Fees</Card.Header>
              <Card.Body>
                <Card.Title>Current Value</Card.Title>
                <Card.Text>
                  + {this.state.txtVars.accountCreationFees} USD
                  <hr/>
                  <input id="accountCreationFees" size="2" placeholder={this.state.txtVars.accountCreationFees}/>&nbsp;
                  <Button variant="primary" size="sm" onClick={this.updateAdditionalAccountFees}>Update</Button>
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
          <Col xs={4}>
            <Card>
              <Card.Header>Additional Rule Fees</Card.Header>
              <Card.Body>
                <Card.Title>Current Value</Card.Title>
                <Card.Text>
                  + {this.state.txtVars.ruleCreationFees} USD
                  <hr/>
                  <input id="ruleCreationFees" size="2" placeholder={this.state.txtVars.ruleCreationFees}/>&nbsp;
                  <Button variant="primary" size="sm" onClick={this.updateAdditionalRuleFees}>Update</Button>
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
        </Row>
        <br/>
        <Row>
          <Col xs={4}>
            <Card>
              <Card.Header>Transaction Fees</Card.Header>
              <Card.Body>
                <Card.Title>Current Value</Card.Title>
                <Card.Text>
                  + {this.state.txtVars.transactionFees} %
                  <hr/>
                  <input id="transactionFees" size="2" placeholder={this.state.txtVars.transactionFees}/>&nbsp;
                  <Button variant="primary" size="sm" onClick={this.updateTransactionFees}>Update</Button>
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
          <Col xs={4}>
            <Card>
              <Card.Header>Transaction Minimal Value</Card.Header>
              <Card.Body>
                <Card.Title>Current Value</Card.Title>
                <Card.Text>
                  + {this.state.txtVars.transactionMinimalValue} USD
                  <hr/>
                  <input id="transactionMinimalValue" size="2" placeholder={this.state.txtVars.transactionMinimalValue}/>&nbsp;
                  <Button variant="primary" size="sm" onClick={this.updateTransactionMinimalValue}>Update</Button>
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    );
  }
}
 
export default AdminDashboard;