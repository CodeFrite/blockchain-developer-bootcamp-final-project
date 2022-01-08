// EXTERNAL IMPORTS
import React, { Component } from 'react';
import { Container, Row, Col, Card, Button, ButtonGroup, ToggleButton } from 'react-bootstrap';

// IMPORT CONTRACTS
import CommonStructs from "../contracts/CommonStructs.json";
import Deals from "../contracts/Deals.json";
import Instructions from "../contracts/Instructions.json";
import InstructionsProvider from "../contracts/InstructionsProvider.json";
import Interpreter from "../contracts/Interpreter.json";
import Proxy from "../contracts/Proxy.json";
import Escrow from "../contracts/Escrow.json";

// IMPORT IMAGES
import imgSmartContract from '../assets/smart-contract.png';
import imgSmartContractUpToDate from '../assets/smart-contract_.png';

class AdminDashboard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      contracts: {
          commonStructs: null,
          deals: null,
          instructions: null,
          instructionsProvider: null,
          interpreter: null,
          proxy: null,
          escrow : null
      },
      references: {
        proxyInterpreter: null,
        proxyInstructionsProvider: null,
        escrowInstructionsProvider: null,
        interpreterDeals: null,
        interpreterInstructions: null,
        interpreterInstructionsProvider: null,
        interpreterProxy: null,
        instructionsProviderInterpreter: null,
        instructionsProviderProxy: null,
        instructionsProviderEscrow: null,
      },
      txtVars: {
        conversionRate: 0,
        lastUpdate: null,
        accountCreationFees: null,
        ruleCreationFees: null,
        transactionFees: null,
        transactionMinimalValue: null,
        DAppBalance: null
      },
      DAppState: null,
      upToDate: {
        instructionsProvider: true,
        interpreter: true
      }
    }
  }

  DAPP_SET_STATE = {PAUSE:"PAUSE", RESUME:"RESUME"};
  UPGRADE_STATE = {UPTODATE:"UPTODATE", OUTDATED:"OUTDATED", BROKEN:"BROKEN"}

  // DApp balance
  getDAppBalance = async () => {
    await this.state.contracts.proxy.methods.getContractBalance()
      .call({from:this.props.selectedAccount})
      .then(DAppBalance => this.setState({txtVars: { ...this.state.txtVars, DAppBalance: (parseFloat(DAppBalance) / (10**18)) }}))
      .catch((e) => alert(e.message));
  }

  harvest = async () => {
    await this.state.contracts.proxy.methods.harvest()
      .send({from: this.props.selectedAccount})
      .catch((e) => alert(e.message))
    
      await this.getDAppBalance();
  }

  // DApp state
  getDAppState = async () => {
    const DAppState = await this.state.contracts.proxy.methods.paused().call();
    this.setState({DAppState});
  }

  unpauseDApp = async () => {
    // Call contract only if DApp is paused
    if (this.state.DAppState) {
      console.log("AdminDashboard> Resuming DApp ...");
      await this.state.contracts.proxy.methods.unpause()
        .send({from:this.props.selectedAccount})
        .then(console.log)
        .catch((e) => alert(e.message));
      console.log("AdminDashboard> ... DApp Resumed");
    }
    await this.getDAppState();
  }
  
  pauseDApp = async () => {
    // Call contract only if DApp is not paused
    if (!this.state.DAppState) {
      console.log("AdminDashboard> Pausing DAPP ...");
      await this.state.contracts.proxy.methods.pause()
        .send({from:this.props.selectedAccount})
        .then(console.log)
        .catch((e) => alert(e.message));
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

  updateLastQuotation = async () => {
    await this.state.contracts.proxy.methods.saveLatestQuotation()
      .send({from:this.props.selectedAccount})
      .then(console.log)
      .catch((e) => alert(e.message));
    await this.getLastQuotation();
    console.log("AdminDashboard> Quotation updated");
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
    newValue = (newValue==="" ? 0 : newValue);
    console.log("AdminDashboard> Updating account creation value", newValue, "$ ...");
    // Change the value
    await this.state.contracts.proxy.methods.setAccountCreationFees(newValue)
      .send({from:this.props.selectedAccount})
      .then(async () => {
        await this.getAdditionalAccountFees();
        console.log("AdminDashboard> ... Account creation value updated", newValue, "$");
      })
      .catch((e) => alert(e.message));
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
    newValue = (newValue==="" ? 0 : newValue);
    console.log("AdminDashboard> Updating rule creation value", newValue, "$ ...");
    // Change the value
    await this.state.contracts.proxy.methods.setRuleCreationFees(newValue)
      .send({from:this.props.selectedAccount})
      .then(async () => {
        await this.getAdditionalRuleFees();
        console.log("AdminDashboard> ... Rule creation value updated", newValue, "$");
      })
      .catch((e) => alert(e.message));
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
    newValue = (newValue==="" ? 0 : newValue);
    console.log("AdminDashboard> Updating transaction fees", newValue, "$ ...");
    // Change the value
    await this.state.contracts.proxy.methods.setTransactionFees(newValue)
      .send({from:this.props.selectedAccount})
      .then(async () => {
        await this.getTransactionFees();
        console.log("AdminDashboard> ... Transaction fees updated", newValue, "$");
      })
      .catch((e) => alert(e.message));
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
    newValue = (newValue==="" ? 0 : newValue);
    console.log("AdminDashboard> Updating transaction minimal value", newValue, "$ ...");
    // Change the value
    await this.state.contracts.proxy.methods.setTransactionMinimalValue(newValue)
      .send({from:this.props.selectedAccount})
      .then(async () => {
        await this.getTransactionMinimalValue();
        console.log("AdminDashboard> ... Transaction minimal value updated", newValue, "$");
      })
      .catch((e) => alert(e.message));
  }

  // Upgradibility

  getContractsReferences = async () => {
    
    let proxyInterpreter = await this.state.contracts.proxy.methods.interpreterContractRef().call();
    let proxyInstructionsProvider = await this.state.contracts.proxy.methods.instructionsProviderContractRef().call();

    let interpreterDeals = await this.state.contracts.interpreter.methods.dealsInstance().call();
    let interpreterInstructions = await this.state.contracts.interpreter.methods.instructionsInstance().call();
    let interpreterInstructionsProvider = await this.state.contracts.interpreter.methods.instructionsProviderInstance().call();
    let interpreterProxy = await this.state.contracts.interpreter.methods.proxyContractAddress().call();

    let instructionsProviderInterpreter = await this.state.contracts.instructionsProvider.methods.interpreterContractRef().call();
    let instructionsProviderProxy = await this.state.contracts.instructionsProvider.methods.proxyInstanceRef().call();

    // We want to reach the Escrow of the < OLD > instructionsProvider contract but we only have the new ABI
    // ... no problem since both version will always have the Escrow functions defined
    // ==> we can use a copy of the new ABI and change its address
    let copyABI = Object.assign({}, this.state.contracts.instructionsProvider);
    copyABI._address = proxyInstructionsProvider;
    // We can now use the copy with the old address to make a call to the escrow
    let instructionsProviderEscrow = await copyABI.methods.escrowInstance().call(); 

    let escrowInstructionsProvider = await this.state.contracts.escrow.methods.owner().call();
 
    this.setState({
      references:{
        proxyInterpreter, 
        proxyInstructionsProvider,
        escrowInstructionsProvider,
        interpreterDeals,
        interpreterInstructions,
        interpreterInstructionsProvider,
        interpreterProxy,
        instructionsProviderInterpreter,
        instructionsProviderProxy,
        instructionsProviderEscrow
      }
    });
    
  }

  componentDidMount = async () => {
    // Save web3 object to state
    const { web3 } = this.props;
      
    // Load contracts ABI
    const networkId = await web3.eth.net.getId();
    const deployedCommonStructs = CommonStructs.networks[networkId];
    const deployedNetworkDeals = Deals.networks[networkId];
    const deployedNetworkInstructions = Instructions.networks[networkId];
    const deployedNetworkInstructionsProvider = InstructionsProvider.networks[networkId];
    const deployedNetworkInterpreter = Interpreter.networks[networkId];
    const deployedNetworkProxy = Proxy.networks[networkId];

    // Save contracts ABI to state
    this.setState({ 
      contracts:{
        commonStructs: new web3.eth.Contract(CommonStructs.abi, deployedCommonStructs && deployedCommonStructs.address),
        deals: new web3.eth.Contract(Deals.abi, deployedNetworkDeals && deployedNetworkDeals.address),
        instructions: new web3.eth.Contract(Instructions.abi, deployedNetworkInstructions && deployedNetworkInstructions.address),
        instructionsProvider: new web3.eth.Contract(InstructionsProvider.abi, deployedNetworkInstructionsProvider && deployedNetworkInstructionsProvider.address),
        interpreter: new web3.eth.Contract(Interpreter.abi, deployedNetworkInterpreter && deployedNetworkInterpreter.address),
        proxy: new web3.eth.Contract(Proxy.abi, deployedNetworkProxy && deployedNetworkProxy.address),
        escrow: null
      } 
    });

    // Get Escrow address : the one that proxy->instructionsProvider is pointing to
    let escrowAddress = await this.state.contracts.instructionsProvider.methods.escrowInstance().call();
    this.setState({
      contracts: { ...this.state.contracts, escrow: new web3.eth.Contract(Escrow.abi, escrowAddress) }
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

    // Load transaction minimal value
    await this.getTransactionMinimalValue();

    // Get contracts references
    await this.getContractsReferences();

    // Get DApp balance
    await this.getDAppBalance();
  }

  shortAddress = address => (address===null ? "0x000...00000" : address.substr(0,5) + "..." + address.substr(address.length-5,5));

  saveToClipboard = text => navigator.clipboard.writeText(text);

  highlightSVGElement = id => { document.getElementById("arrow-" + id).className.baseVal = "arrow-highlight" };

  unhighlightSVGElement = id => { document.getElementById("arrow-" + id).className.baseVal = "arrow" };

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
                  + {(this.state.txtVars.conversionRate).toFixed(2)} USD/ETH
                  <br/>
                  + @{this.state.txtVars.lastUpdate}
                </Card.Text>
                <hr/>
                <Card.Text>
                  <Button variant="primary" size="sm" onClick={this.updateLastQuotation}>Update</Button>
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
                </Card.Text>
                <hr/>
                <Card.Text>
                  <input type="number" id="accountCreationFees" size="2" placeholder={this.state.txtVars.accountCreationFees}/>&nbsp;
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
                </Card.Text>
                <hr/>
                <Card.Text>  
                  <input type="number" id="ruleCreationFees" size="2" placeholder={this.state.txtVars.ruleCreationFees}/>&nbsp;
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
                </Card.Text>
                <hr/>
                <Card.Text>  
                  <input type="number" id="transactionFees" size="2" placeholder={this.state.txtVars.transactionFees}/>&nbsp;
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
                </Card.Text>
                <hr/>
                <Card.Text>  
                  <input type="number" min="0" max="100" id="transactionMinimalValue" size="2" placeholder={this.state.txtVars.transactionMinimalValue}/>&nbsp;
                  <Button variant="primary" size="sm" onClick={this.updateTransactionMinimalValue}>Update</Button>
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
          <Col xs={4}>
            <Card>
              <Card.Header>DApp balance</Card.Header>
              <Card.Body>
                <Card.Title>Current Value</Card.Title>
                <Card.Text>
                  + {this.state.txtVars.DAppBalance} ETH
                </Card.Text>
                <hr/>
                <Card.Text>
                  <Button variant="primary" size="sm" onClick={this.harvest}>Harvest</Button>
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
        </Row>
        <br/><br/>
        <h2>Upgradibility</h2>
        <br/>
        <Row>
          <Col xs={8}>
            <svg id="svg-upgrade" height="600" width="100%">
              <defs>
                <marker id="arrow" viewBox="0 0 10 10" refX="5" refY="5"
                    markerWidth="6" markerHeight="6"
                    orient="auto-start-reverse">
                  <path className="arrow" d="M 0 0 L 10 5 L 0 10 z" />
                </marker>
                <marker id="arrow-highlight" viewBox="0 0 10 10" refX="5" refY="5"
                    markerWidth="6" markerHeight="6"
                    orient="auto-start-reverse">
                  <path className="arrow-highlight" d="M 0 0 L 10 5 L 0 10 z" />
                </marker>
              </defs>

              {/* Instructions.sol */}
              <image 
                href={imgSmartContract} 
                x="280" y="50" width="50" height="50" 
                onClick={() => this.saveToClipboard(this.state.contracts.instructions && this.state.contracts.instructions._address)}
              />
              <text x="240" y="125">Instructions.sol</text>
              <text x="250" y="150">{ (this.state.contracts.instructions===null ? "Loading" : this.shortAddress(this.state.contracts.instructions._address)) }</text>

              {/* Interpreter.sol */}
              <image 
                className={
                  (this.state.contracts.interpreter && this.state.references.proxyInterpreter === this.state.contracts.interpreter._address 
                  ? "" 
                  : "smart-contract-outdated") 
                } 
                href={imgSmartContractUpToDate} 
                x="280" y="250" width="50" height="50"
                onClick={() => this.saveToClipboard(this.state.contracts.escrow && this.state.contracts.interpreter._address)} 
              />
              <text x="260" y="325">Interpreter.sol</text>
              <text x="260" y="350">{ (this.state.contracts.interpreter===null ? "Loading" : this.shortAddress(this.state.contracts.interpreter._address)) }</text>
              <line id="arrow-interpreterInstructions" className="arrow" x1="300" y1="245" x2="300" y2="165" markerEnd="url(#arrow)" strokeDasharray="2 2"/>{/* => Instructions */}
              <line id="arrow-interpreterDeals" className="arrow" x1="260" y1="275" x2="150" y2="275" markerEnd="url(#arrow)" strokeDasharray="2 2"/>{/* => Deals */}
              <line id="arrow-interpreterInstructionsProvider" className="arrow" x1="340" y1="260" x2="460" y2="260" markerEnd="url(#arrow)" strokeDasharray="2 2"/>{/* => InstructionsProvider */}
              <line id="arrow-interpreterProxy" className="arrow" x1="330" y1="370" x2="460" y2="470" markerEnd="url(#arrow)" strokeDasharray="2 2"/>{/* => Proxy */}

              {/* Deals.sol */}
              <image
                href={imgSmartContract} 
                x="80" y="250" width="50" height="50" 
                onClick={() => this.saveToClipboard(this.state.contracts.deals && this.state.contracts.deals._address)}
              />
              <text x="60" y="325">Deals.sol</text>
              <text x="40" y="350">{ (this.state.contracts.deals===null ? "Loading" : this.shortAddress(this.state.contracts.deals._address)) }</text>
              
              {/* CommonStructs.sol */}
              <image 
                href={imgSmartContract} 
                x="80" y="450" width="50" height="50" 
                onClick={() => this.saveToClipboard(this.state.contracts.commonStructs && this.state.contracts.commonStructs._address)}
              />
              <text x="20" y="525">CommonStructs.sol</text>
              <text x="40" y="550">{ (this.state.contracts.commonStructs===null ? "Loading" : this.shortAddress(this.state.contracts.commonStructs._address)) }</text>

              {/* InstructionsProvider.sol */}
              <image 
                className={
                  (this.state.contracts.instructionsProvider && this.state.references.proxyInstructionsProvider === this.state.contracts.instructionsProvider._address 
                  ? "" 
                  : "smart-contract-outdated") 
                } 
                href={imgSmartContractUpToDate} 
                x="480" y="250" width="50" height="50" 
                onClick={() => this.saveToClipboard(this.state.contracts.instructionsProvider && this.state.contracts.instructionsProvider._address)}
              />
              <text x="400" y="325">InstructionsProvider.sol</text>
              <text x="450" y="350">{ (this.state.contracts.instructionsProvider===null ? "Loading" : this.shortAddress(this.state.contracts.instructionsProvider._address)) }</text>
              <line id="arrow-instructionsProviderInterpreter" className="arrow" x1="460" y1="290" x2="340" y2="290" markerEnd="url(#arrow)" strokeDasharray="2 2"/>{/* => Interpreter */}
              <line id="arrow-instructionsProviderEscrow" className="arrow" x1="550" y1="260" x2="660" y2="260" markerEnd="url(#arrow)"/> {/* => Escrow */}
              <line id="arrow-instructionsProviderProxy" className="arrow" x1="490" y1="370" x2="490" y2="430" markerEnd="url(#arrow)" strokeDasharray="2 2"/>{/* => Proxy */}

              {/* Escrow.sol */}
              <image 
                href={imgSmartContract} 
                x="680" y="250" width="50" height="50" 
                onClick={() => this.saveToClipboard(this.state.contracts.escrow && this.state.contracts.escrow._address)}
              />
              <text x="660" y="325">Escrow.sol</text>
              <text x="650" y="350">{ (this.state.contracts.escrow===null ? "Loading" : this.shortAddress(this.state.contracts.escrow._address)) }</text>
              <line id="arrow-escrowInstructionsProvider" className="arrow" x1="660" y1="290" x2="550" y2="290" markerEnd="url(#arrow)" strokeDasharray="2 2"/>{/* => InstructionsProver */}
              
              {/* Proxy.sol */}
              <image 
                href={imgSmartContract} 
                x="480" y="450" width="50" height="50"
                onClick={() => this.saveToClipboard(this.state.contracts.proxy && this.state.contracts.proxy._address)}
              />
              <text x="470" y="525">Proxy.sol</text>
              <text x="450" y="550">{ (this.state.contracts.proxy===null ? "Loading" : this.shortAddress(this.state.contracts.proxy._address)) }</text>
              <line id="arrow-proxyInstructionsProvider" className="arrow" x1="510" y1="430" x2="510" y2="370" markerEnd="url(#arrow)" strokeDasharray="2 2"/>{/* => InstructionsProvider */}
              <line id="arrow-proxyInterpreter" className="arrow" x1="460" y1="490" x2="305" y2="370" markerEnd="url(#arrow)" strokeDasharray="2 2"/>{/* => Interpreter */}

            </svg>
          </Col>

          <Col xs={4}>
            <Card>
              <Card.Header>Interpreter</Card.Header>
              <Card.Body>
                
                <Row className="row-highlight-hover" 
                  onMouseEnter={() => this.highlightSVGElement("interpreterProxy")} 
                  onMouseLeave={() => this.unhighlightSVGElement("interpreterProxy")}
                  onClick={() => this.saveToClipboard(this.state.contracts.proxy && this.state.contracts.proxy._address)}
                >
                  <Col lg="7">&#8614; Proxy: </Col>
                  <Col lg="5">
                    <Card.Text>
                      {(
                        this.state.contracts.proxy && this.state.references.interpreterProxy === this.state.contracts.proxy._address 
                        ? this.shortAddress(this.state.contracts.proxy._address) 
                        : this.shortAddress(this.state.references.interpreterProxy)
                      )}
                    </Card.Text>
                  </Col>
                </Row>

                <Row className="row-highlight-hover" 
                onMouseEnter={() => this.highlightSVGElement("interpreterDeals")} 
                onMouseLeave={() => this.unhighlightSVGElement("interpreterDeals")}
                onClick={() => this.saveToClipboard(this.state.contracts.deals && this.state.contracts.deals._address)}
                >
                  <Col lg="7">&#8614; Deals:</Col>
                  <Col lg="5">
                    <Card.Text>
                      {(
                        this.state.contracts.deals && this.state.references.interpreterDeals === this.state.contracts.deals._address 
                        ? this.shortAddress(this.state.contracts.deals._address)
                        : this.shortAddress(this.state.references.interpreterDeals)
                      )}
                      </Card.Text>
                  </Col>
                </Row>

                <Row className="row-highlight-hover" 
                onMouseEnter={() => this.highlightSVGElement("interpreterInstructions")} 
                onMouseLeave={() => this.unhighlightSVGElement("interpreterInstructions")}
                onClick={() => this.saveToClipboard(this.state.contracts.instructions && this.state.contracts.instructions._address)}
                >
                  <Col lg="7">&#8614; Instructions:</Col>
                  <Col lg="5">
                    <Card.Text>
                      {(
                        this.state.contracts.instructions && this.state.references.interpreterInstructions === this.state.contracts.instructions._address 
                        ? this.shortAddress(this.state.contracts.instructions._address) 
                        : this.shortAddress(this.state.references.interpreterInstructions)
                      )}
                    </Card.Text>
                  </Col>
                </Row>

                <Row className="row-highlight-hover" 
                onMouseEnter={() => this.highlightSVGElement("interpreterInstructionsProvider")} 
                onMouseLeave={() => this.unhighlightSVGElement("interpreterInstructionsProvider")}
                onClick={() => this.saveToClipboard(this.state.contracts.instructionsProvider && this.state.contracts.instructionsProvider._address)}
                >
                  <Col lg="7">&#8614; InstructionsProvider:</Col>
                  <Col lg="5">  
                    <Card.Text>
                      {(
                        this.state.contracts.instructionsProvider && this.state.references.interpreterInstructionsProvider === this.state.contracts.instructionsProvider._address 
                        ? this.shortAddress(this.state.contracts.instructionsProvider._address) 
                        : this.shortAddress(this.state.references.interpreterInstructionsProvider)
                      )}
                    </Card.Text>
                  </Col>
                </Row>
                
              </Card.Body>
            </Card>
            
            <br/>

            <Card>
              <Card.Header>InstructionsProvider</Card.Header>
              <Card.Body>
                <Row className="row-highlight-hover" 
                  onMouseEnter={() => this.highlightSVGElement("escrowInstructionsProvider")} 
                  onMouseLeave={() => this.unhighlightSVGElement("escrowInstructionsProvider")}
                  onClick={() => this.saveToClipboard(this.state.references.escrowInstructionsProvider)}
                >
                  <Col lg="7">&#8614; Escrow ownership:</Col>
                  <Col lg="5">
                    <Card.Text>
                      {(
                        this.state.contracts.instructionsProvider && this.state.references.escrowInstructionsProvider === this.state.contracts.instructionsProvider._address 
                        ? this.shortAddress(this.state.contracts.instructionsProvider._address)
                        : this.shortAddress(this.state.references.escrowInstructionsProvider)
                      )}
                    </Card.Text>
                  </Col>
                </Row>
                
                <hr/>
                <Row className="row-highlight-hover" 
                onMouseEnter={() => this.highlightSVGElement("instructionsProviderEscrow")} 
                onMouseLeave={() => this.unhighlightSVGElement("instructionsProviderEscrow")}
                onClick={() => this.saveToClipboard(this.state.contracts.escrow && this.state.contracts.escrow._address)}
                >
                  <Col lg="7">&#8614; Escrow:</Col>
                  <Col lg="5">
                    <Card.Text>  
                      {(
                        this.state.contracts.escrow && this.state.references.instructionsProviderEscrow === this.state.contracts.escrow._address 
                        ? this.shortAddress(this.state.contracts.escrow._address)
                        : this.shortAddress(this.state.references.instructionsProviderEscrow)
                      )}
                    </Card.Text>
                  </Col>
                </Row>

                <Row className="row-highlight-hover" 
                onMouseEnter={() => this.highlightSVGElement("instructionsProviderInterpreter")} 
                onMouseLeave={() => this.unhighlightSVGElement("instructionsProviderInterpreter")}
                onClick={() => this.saveToClipboard(this.state.contracts.interpreter && this.state.contracts.interpreter._address)}
                >
                  <Col lg="7">&#8614; Interpreter:</Col>
                  <Col lg="5">
                    <Card.Text>
                      {(
                        this.state.contracts.interpreter && this.state.references.instructionsProviderInterpreter === this.state.contracts.interpreter._address 
                        ? this.shortAddress(this.state.contracts.interpreter._address) 
                        : this.shortAddress(this.state.references.instructionsProviderInterpreter)
                      )}
                    </Card.Text>
                  </Col>
                </Row>

                <Row className="row-highlight-hover" 
                onMouseEnter={() => this.highlightSVGElement("instructionsProviderProxy")} 
                onMouseLeave={() => this.unhighlightSVGElement("instructionsProviderProxy")}
                onClick={() => this.saveToClipboard(this.state.contracts.proxy && this.state.contracts.proxy._address)}
                >
                  <Col lg="7">&#8614; Proxy:</Col>
                  <Col lg="5">
                    <Card.Text>
                      {(
                        this.state.contracts.proxy && this.state.references.instructionsProviderProxy === this.state.contracts.proxy._address 
                        ? this.shortAddress(this.state.contracts.proxy._address)
                        : this.shortAddress(this.state.references.instructionsProviderProxy)
                      )}
                    </Card.Text>
                  </Col>
                </Row>

              </Card.Body>
            </Card>

            <br/>

            <Card>
              <Card.Header>Proxy</Card.Header>
              <Card.Body>
                  <Row className="row-highlight-hover" 
                  onMouseEnter={() => this.highlightSVGElement("proxyInterpreter")} 
                  onMouseLeave={() => this.unhighlightSVGElement("proxyInterpreter")}
                  onClick={() => this.saveToClipboard(this.state.contracts.interpreter && this.state.contracts.interpreter._address)}
                  >
                    <Col lg="7">&#8614; Interpreter: </Col>
                    <Col lg="5">
                      <Card.Text>
                        {(
                          this.state.contracts.interpreter && this.state.references.proxyInterpreter === this.state.contracts.interpreter._address 
                          ? this.shortAddress(this.state.contracts.interpreter._address) 
                          : this.shortAddress(this.state.references.proxyInterpreter)
                        )}
                      </Card.Text>
                    </Col>
                  </Row>

                  <Row className="row-highlight-hover" 
                  onMouseEnter={() => this.highlightSVGElement("proxyInstructionsProvider")} 
                  onMouseLeave={() => this.unhighlightSVGElement("proxyInstructionsProvider")}
                  onClick={() => this.saveToClipboard(this.state.contracts.instructionsProvider && this.state.contracts.instructionsProvider._address)}
                  >
                    <Col lg="7">&#8614; InstructionsProvider:</Col>
                    <Col lg="5">
                      <Card.Text>
                        {(
                          this.state.contracts.instructionsProvider && this.state.references.proxyInstructionsProvider === this.state.contracts.instructionsProvider._address 
                          ? this.shortAddress(this.state.contracts.instructionsProvider._address) 
                          : this.shortAddress(this.state.references.proxyInstructionsProvider)
                        )}
                      </Card.Text>
                    </Col>
                  </Row>
                
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    );
  }
}
 
export default AdminDashboard;