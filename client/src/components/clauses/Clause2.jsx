import React, { Component } from 'react';

class Clause2 extends Component {
  constructor(props) {
    super(props);
    this.state = {}
  }
  render() { 
    return (
      <>
        <h2>+ Clause 2 : Deal trigger fees and execution costs</h2>

        <p>Each time a deal is triggered by a payment, on top of the current 1% trigger fees over the total payment value of the transaction paid to the contract itself, the user will pay a certain amount of ETH depending on the current Gas price, set by the Ethereum protocol itself.</p>

      </>
    );
  }
}
 
export default Clause2;