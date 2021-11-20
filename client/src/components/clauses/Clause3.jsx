import React, { Component } from 'react';

class Clause3 extends Component {
  constructor(props) {
    super(props);
    this.state = { minTransactionValue: 10  }
  }
  render() { 
    return (
      <>
        <h2>+ Clause 3 : Minimal transaction value</h2>

        <p>A rule execution will only be triggered if the value of the transaction is higher than {this.state.minTransactionValue}$. This value might change in the future.</p>

      </>
    );
  }
}
 
export default Clause3;