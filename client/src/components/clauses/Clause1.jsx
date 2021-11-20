import React, { Component } from 'react';
import { Table } from "react-bootstrap";

class Clause1 extends Component {
  constructor(props) {
    super(props);
    this.state = {}
  }
  render() { 
    return (
      <>
        <h2>+ Clause 1 : Deal creation fees</h2>

        <p>The total price for the creation of a deal depends on the number of users, accounts and rules it is composed out of. This fee is charged once at the creation of the contract.</p>
        <p>The table below details the total deal creation fees. The current price of each feature in also shown. All prices are in US dollars:</p>
        
        <Table bordered hover size="sm">
          <thead>
            <tr>
              <th>#</th>
              <th>Feature</th>
              <th>Price</th>
              <th>#Features</th>
              <th>Subtotal</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>1</td>              
              <td>Additional user</td>
              <td>25$</td>
              <td>x3</td>
              <td>75$</td>
            </tr>
            <tr>
              <td>2</td>
              <td>Additional account</td>
              <td>25$</td>
              <td>x5</td>
              <td>125$</td>
            </tr>
            <tr>
              <td>3</td>
              <td>Additional rule</td>
              <td>50$</td>
              <td>x2</td>
              <td>100$</td>
            </tr>
            <tr>
              <td>4</td>
              <td>Allow payment from all addresses</td>
              <td>100$</td>
              <td>x1</td>
              <td>100$</td>
            </tr>
          </tbody>
        </Table>

        <p>At the current conversion rate, 400$ correspond to 0.0877770463 ETH</p>

      </>
    );
  }
}
 
export default Clause1;