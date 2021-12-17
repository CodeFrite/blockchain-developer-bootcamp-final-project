import React, { Component } from 'react';
import { Row, Col } from 'react-bootstrap';

class Clause0 extends Component {
  constructor(props) {
    super(props);
    this.state = { 
      txtVars: {
        conversionRate:null, 
        lastUpdate:null, 
        priceFeedRef:null,
      },
      signed: false
    }
  }

  /* PROXY CONTRACT PUBLIC INTERFACE */
  // Proxy.priceFeedRef()
  getPriceFeedRef = async () => {
    const { contract } = this.props;
    const priceFeedRef = await contract.methods.priceFeedRef().call();
    this.setState({txtVars: {...this.state.txtVars,priceFeedRef}});
    console.log("Clause0> pricefeedRef: ", priceFeedRef);
  }

  getLastQuotation = async () => {
    const { contract } = this.props;
    const tx = await contract.methods.getLatestQuotation().call();
    
    // Convert USD/WEI to WEI/USD
    const conversionRate = (10**18) / tx[0];
    const lastUpdate = new Date(tx[1]*1000).toUTCString();

    this.setState({txtVars:{ ...this.state.txtVars,conversionRate, lastUpdate}});
    console.log("Clause0> conversionRate: ", conversionRate);
    console.log("Clause0> lastUpdate: ", lastUpdate);
  }

  componentDidMount = async () => {
    // Load data from Proxy contract
    await this.getPriceFeedRef();
    await this.getLastQuotation();
  }

  sign = () => {
    if (this.props.editable) {
      let signed = !this.state.signed;
      this.setState({signed});
      this.props.signHandler(0,signed);
    }
  }

  render() { 
    return (
      <Row>
        <Col xs={11}>
          <br/>
          <h2>Clause 0 : ETH/USD conversion rate</h2>
          <br/>
          <p>In order to protect the client from ETH price fluctuations, all the prices are given in US dollars. The ETH/USD conversion rate is obtained by querying ChainLink Oracle once a day at the address <a href="https://rinkeby.etherscan.io/address/0x8A753747A1Fa494EC906cE90E9f37563A8AF630e#internaltx" target="_blank" rel="noreferrer"><span className="var">{this.state.txtVars.priceFeedRef}</span></a></p>
          <p>The current conversion rate used across this deal is equal to <span className="var">{this.state.txtVars.conversionRate}</span>$ per ETH. Last price update was made <span className="var">{this.state.txtVars.lastUpdate}</span></p>
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
 
export default Clause0;