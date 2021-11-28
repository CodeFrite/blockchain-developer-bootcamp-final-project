import React, { Component } from 'react';
import { Table, Row, Col } from "react-bootstrap";

class Clause1 extends Component {
  constructor(props) {
    super(props);
    this.state = {
      conversionRate:0,
      txtVars: {
        accountCreationFees:0,
        ruleCreationFees:0
      },
      signed:false
    }
  }
  
  computeDealCreationFees = () => (this.state.txtVars.accountCreationFees * this.props.accountsCount + this.state.txtVars.ruleCreationFees * this.props.rulesCount);

  getAccountCreationFees = async () => {
    const { contract } = this.props;
    const accountCreationFees = await contract.methods.accountCreationFees().call();
    this.setState({txtVars:{ ...this.state.txtVars, accountCreationFees}});
    console.log("Clause1> accountCreationFees: ", accountCreationFees);
  }

  getRuleCreationFees = async () => {
    const { contract } = this.props;
    const ruleCreationFees = await contract.methods.ruleCreationFees().call();
    this.setState({txtVars:{ ...this.state.txtVars, ruleCreationFees}});
    console.log("Clause1> ruleCreationFees: ", ruleCreationFees);
  }

  getLastQuotation = async () => {
    const { contract } = this.props;
    const tx = await contract.methods.getLatestQuotation().call();
    
    // Convert USD/WEI to WEI/USD
    const conversionRate = tx[0] / 10**18;
    this.setState({conversionRate});
  }

  componentDidMount = async () => {
    await this.getAccountCreationFees();
    await this.getRuleCreationFees();
    await this.getLastQuotation();
  }

  sign = () => {
    if (this.props.editable) {
      // Toggle state.signed
      let signed = !this.state.signed;
      this.setState({signed});
      
      // callback parent handler
      this.props.signHandler(1,signed);
    }
  }

  render() { 
    return (
      <Row>
        <Col xs={11}>
          <br/>
          <h2>Clause 1 : Deal creation fees</h2>
          <br/>

          <p>The total price for the creation of a deal depends on the number of users, accounts and rules it is composed out of. This fee is charged once at the creation of the contract.</p>
          <p>The table below details the total deal creation fees. The current price of each feature in also shown. All prices are in US dollars:</p>
          
          <Table bordered hover size="sm">
            <thead>
              <tr>
                <th>#</th>
                <th>Feature</th>
                <th>Price</th>
                <th>#Features</th>
                <th>Subtotal</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>1</td>
                <td>Additional account</td>
                <td>{this.state.txtVars.accountCreationFees}</td>
                <td><span className="var">{this.props.accountsCount}</span></td>
                <td><span className="var">{this.state.txtVars.accountCreationFees * this.props.accountsCount}</span></td>
              </tr>
              <tr>
                <td>2</td>
                <td>Additional rule</td>
                <td>{this.state.txtVars.ruleCreationFees}</td>
                <td><span className="var">{this.props.rulesCount}</span></td>
                <td><span className="var">{this.state.txtVars.ruleCreationFees * this.props.rulesCount}</span></td>
              </tr>
              <tr>
                <td></td>
                <td colSpan="3">Total</td>
                <td><span className="var">{this.state.txtVars.accountCreationFees * this.props.accountsCount + this.state.txtVars.ruleCreationFees * this.props.rulesCount}</span></td>
              </tr>
            </tbody>
          </Table>

          <p>At the current conversion rate, <span className="var">{this.state.txtVars.accountCreationFees * this.props.accountsCount + this.state.txtVars.ruleCreationFees * this.props.rulesCount}</span>$ correspond to <span className="var">{this.state.conversionRate * (this.state.txtVars.accountCreationFees * this.props.accountsCount + this.state.txtVars.ruleCreationFees * this.props.rulesCount)}</span> ETH</p>
        </Col>
        <Col xs={1}>
          {this.state.signed &&
            <span className="signed-true" onClick={this.sign}>&#x2714;</span>
          }
          {!this.state.signed &&
            <span className="signed-false" onClick={this.sign}>&#x2714;</span>
          }
        </Col>
      </Row>
    );
  }
}
 
export default Clause1;