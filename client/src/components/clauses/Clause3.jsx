import React, { Component } from 'react';
import { Row, Col } from 'react-bootstrap';

class Clause3 extends Component {
  constructor(props) {
    super(props);
    this.state = { 
      txtVars: {
        transactionMinimalValue: null
      },
      signed:false
     }
  }

  getTransactionMinimalValue = async () => {
    const { contract } = this.props;
    const transactionMinimalValue = await contract.methods.transactionMinimalValue().call();
    this.setState({txtVars:{...this.txtVars,transactionMinimalValue}});
    console.log("Clause3> transactionMinimalValue: ", transactionMinimalValue);
  }

  componentDidMount = async () => {
    await this.getTransactionMinimalValue();
  }

  sign = () => {
    if (this.props.editable) {
      let signed = !this.state.signed;
      this.setState({signed});
      this.props.signHandler(3,signed);
    }
  }

  render() { 
    return (
      <Row>
        <Col xs={11}>
        <br/>
        <h2>Clause 3 : Minimal transaction value</h2>
        <br/>

        <p>A rule execution will only be triggered if the value of the transaction is higher than <span className="var">{this.state.txtVars.transactionMinimalValue}</span>$. This value might change in the future.</p>

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
 
export default Clause3;