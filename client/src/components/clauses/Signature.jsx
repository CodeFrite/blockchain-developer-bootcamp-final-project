import React, { Component } from 'react';

class Signature extends Component {
  constructor(props) {
    super(props);
    this.state = {}
  }
  render() { 
    return (  
      <>
        <h2>Signature</h2>
        <br/>
        <p>This deal is linked to the id <span className="var">{this.props.tx.dealId}</span></p>
        <p>This deal was mined in the block <span className="var"><a href={"https://rinkeby.etherscan.io/block/"+this.props.tx.blockNumber} target="_blank" rel="noreferrer">{this.props.tx.blockNumber}</a></span> inside the transaction <span className="var"><a href={"https://rinkeby.etherscan.io/tx/"+this.props.tx.transactionHash} target="_blank" rel="noreferrer">{this.props.tx.transactionHash}</a></span></p>
        <p>This deal was created and payed by the account <span className="var"><a href={"https://rinkeby.etherscan.io/address/"+this.props.tx.creationAccount} target="_blank" rel="noreferrer">{this.props.tx.creationAccount}</a></span></p>
      </>
    );
  }
}
 

export default Signature;