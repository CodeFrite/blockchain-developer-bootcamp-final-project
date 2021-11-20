import React, { Component } from 'react';

class Clause4 extends Component {
  constructor(props) {
    super(props);
    this.state = {}
  }
  render() { 
    return (
      <>
        <h2>+ Clause 4 : User privileges</h2>       

        <p>The users part of this deal are listed in the table below, along with their role and privileges.</p>
        TABLE
        <p>Please be aware that if the address of the user is specified, it will correspond to a real Ethereum address where funds may be sent. If no address is specified, then the account will be associated with an internal balance which will allow it to store Ethereum.</p>
        <p>"Has a balance ?" flag determines whether the deal should keep a record of the user internal balance. This internal balance can be used to make payment in the future, use the account as a safe, etc ...</p>
        <p>"Can vote ?" flag determines whether the user can vote when a rule requires a pool before execution.</p>

      </>
    );
  }
}
 
export default Clause4;