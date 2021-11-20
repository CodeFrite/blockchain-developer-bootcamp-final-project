import React, { Component } from 'react';

class Clause0 extends Component {
  constructor(props) {
    super(props);
    this.state = { 
      txtVars: {
        conversionRate:4400, 
        lastUpdate:"Today @6A.M.", 
        oracleAddress: "0xe3E0596AC55Ae6044b757baB27426F7dC9e018d4"
      },
      isAccepted: false
    }
  }
  render() { 
    return (
      <>
        <h2>+ Clause 0 : ETH/USD conversion rate</h2>
        
        <p>In order to protect the client from ETH price fluctuations, all the prices are given in US dollars.</p>
        <p>The ETH/USD conversion rate is obtained by querying ChainLink Oracle once a day at the address <span className="var">{this.state.txtVars.oracleAddress}</span></p>
        <p>The current conversion rate used across this deal is equal to <span className="var">{this.state.txtVars.conversionRate}$</span> per ETH</p>
        <p>Last price update was made <span className="var">{this.state.txtVars.lastUpdate}</span></p>
      </>
    );
  }
}
 
export default Clause0;