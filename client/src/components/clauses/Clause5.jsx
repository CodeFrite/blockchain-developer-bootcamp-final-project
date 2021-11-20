import React, { Component } from 'react';

class Clause5 extends Component {
  constructor(props) {
    super(props);
    this.state = {  }
  }
  render() { 
    return ( 
      <>
        <h2>+ Clause 5 : External accounts</h2>

        <p>When the contract receives a payment from the addresses below, a special behavior may be attached.</p>
        <p>Payment from any other address will be reverted / accepted.</p>

        TABLE
      </>
    );
  }
}
 
export default Clause5;