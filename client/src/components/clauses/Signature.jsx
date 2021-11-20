import React, { Component } from 'react';

class Signature extends Component {
  constructor(props) {
    super(props);
    this.state = { 
      txtVars: {
          dealId: 12,
          blockNumber: 13616099,
          blockCreationTime: "1st of April @22:51:17GMT",
          transactionId: "0x53b8a4339463e4d51e2251bfd757ded3e7b7b72a6dd6e0142df54ead41d14d52",
          creationAccount: "0xFb4E3151ad50A071C254e57738B063263268e7Bc"
      }
    }
  }
  render() { 
    return (  
      <>
        <h2>+ Signature</h2>
        <p>This deal is linked to the id <span className="var">{this.state.txtVars.dealId}</span></p>
        <p>This deal was mined in the block <span className="var">{this.state.txtVars.blockNumber}</span> on the <span className="var">{this.state.txtVars.blockCreationTime}</span> inside the transaction <span className="var">{this.state.txtVars.transactionId}</span></p>
        <p>This deal was created and payed by the account <span className="var">{this.state.txtVars.creationAccount}</span></p>
      </>
    );
  }
}
 

export default Signature;