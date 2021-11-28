import React, { Component } from 'react';
import { Row, Col } from 'react-bootstrap';

class Clause2 extends Component {
  constructor(props) {
    super(props);
    this.state = {
      txtVars: {
        transactionFees: null
      },
      signed:false
    }
  }

  getTransactionFees = async () => {
    const { contract } = this.props;
    const transactionFees = await contract.methods.transactionFees().call();
    this.setState({txtVars:{...this.txtVars,transactionFees}});
    console.log("Clause2> transactionFees: ", transactionFees);
  }

  componentDidMount = async () => {
    // Load data from Proxy contract
    await this.getTransactionFees();
  }

  sign = () => {
    if (this.props.editable) {
      let signed = !this.state.signed;
      this.setState({signed});
      this.props.signHandler(2,signed);
    }
  }

  render() { 
    return (
      <Row>
        <Col xs={11}>
          <br/>
          <h2>Clause 2 : Deal trigger fees and execution costs</h2>
          <br/>
          <p>Each time a deal is triggered by a payment, on top of the current <span className="var">{this.state.txtVars.transactionFees}</span>% trigger fees over the total payment value of the transaction paid to the contract itself, the user will pay a certain amount of ETH depending on the current Gas price, set by the Ethereum protocol itself.</p>
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
 
export default Clause2;