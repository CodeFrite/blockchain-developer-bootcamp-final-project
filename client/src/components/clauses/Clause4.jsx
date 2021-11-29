import React, { Component } from 'react';
import { Table, Button, Row, Col } from 'react-bootstrap';

class Clause4 extends Component {
  constructor(props) {
    super(props);
    this.state = {
      newAccount: {
        address:'',
        alias:''
      },
      accounts:[],
      signed:false
    }
  }

  addAccount = () => {
    // Push the new account onto the state.accounts
    this.setState({accounts:[...this.state.accounts, this.state.newAccount]})
    console.log("Clause4> Add account ", this.state.newAccount.alias, this.state.newAccount.address);
    this.setState({newAccount:{address:'',alias:''}});
  }

  deleteAccount = (key) => {
    let accounts = this.state.accounts.filter((account, idx) => key!==idx);
    
    this.setState({accounts});
    console.log("Clause4> Delete account ", key+1);
  }

  sign = () => {
    if (this.props.editable) {
      let signed = !this.state.signed;
      this.setState({signed});
      this.props.signHandler(4,signed);
      this.props.accountsHandler([{address:this.props.selectedAccount, alias:'owner'}, ...this.state.accounts]);
    }
  }

  render() { 
    return (
      <Row>
        <Col xs={11}>
          <br/>
          <h2>Clause 4 : External accounts</h2>       
          <br/>

          <p>The users part of this deal are listed in the table below.</p>
          
          <Table bordered hover size="sm">
            <thead>
              <tr>
                <th>#</th>
                <th>Name</th>
                <th>Address</th>
                <th>Delete</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>0</td>
                <td>owner</td>
                <td>{this.props.selectedAccount}</td>
                <td>-</td>
              </tr>
              {
                this.state.accounts.map((account, key) => 
                  <tr key={key}>
                    <td><span className="var">{key+1}</span></td>
                    <td><span className="var">{account.alias}</span></td>
                    <td><span className="var">{account.address}</span></td>
                    <td>
                    {!this.state.signed 
                      ? <span className="var"><Button variant="outline-danger" size="sm" onClick={() => this.deleteAccount(key)}>&#10006;</Button></span>
                      : '-'
                    } 
                    </td>
                  </tr>
                )
              }

              {!this.state.signed &&
                <tr>
                  <td>{this.state.accounts.length+1}</td>
                  <td><input placeholder="Alias, example: Accountant" maxLength="25" size="25" onChange={(e) => this.setState({newAccount:{...this.state.newAccount,alias:e.target.value}})}/></td>
                  <td><input placeholder="Address, example: 0x07972803660e7d087fdf27f25343d618fa21a354" maxLength="42" size="42" onChange={(e) => this.setState({newAccount:{...this.state.newAccount,address:e.target.value}})}/></td>
                  <td><Button variant="outline-success" size="sm" onClick={() => this.addAccount()}>&#10004;</Button></td>
                </tr>
              }
            </tbody>
          </Table>

          <p>Please be aware that if the addresses listed below should correspond to real Ethereum accounts addresses.</p>
          <p>Please note that the funds sent to these addresses will be stored in the DApp. The funds can be withdraw by following this link TODO</p>
        </Col>
        <Col xs={1}>
          {this.state.signed
            ? <span className="signed-true" onClick={this.sign}>&#x2714;</span>
            : <span className="signed-false" onClick={this.sign}>&#x2714;</span>
          }
        </Col>
      </Row>
    );
  }
}
 
export default Clause4;