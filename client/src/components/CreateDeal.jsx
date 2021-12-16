import React, { Component } from 'react';
import { Container, Button, Spinner } from 'react-bootstrap';

// import clauses
import Signature from "./clauses/Signature";
import Clause0 from './clauses/Clause0';
import Clause1 from './clauses/Clause1';
import Clause2 from './clauses/Clause2';
import Clause3 from './clauses/Clause3';
import Clause4 from './clauses/Clause4';
import Clause5 from './clauses/Clause5';

class CreateDeal extends Component {
  
  constructor(props) {
    super(props);
    this.state = { 
      accounts:[],
      rules: [],
      clauseSignatures:[0,0,0,0,0,0],
      signed:false,
      creating:false,
      created:false,
      clausesCount:6, // from Clause0 to Clause5
      tx: {
        blockNumber:null,
        cumulativeGasUsed:null,
        transactionHash:null,
        dealId:null,
        dealCreationFees:null,
        creationAccount:null
      }
    }
  }

  componentDidMount = async () => {
  }

  createDeal = async () => {
    // Change state creating deal
    this.setState({creating:true});
    const { contract } = this.props;

    // Get deal creation fees
    let dealCreationFees = await contract.methods.computeDealCreationFeesInWEI(this.state.accounts.length, this.state.rules.length).call();

    try{
      const tx = await contract.methods.createDeal(this.state.accounts.map((account)=>account.address), this.state.rules).send({from:this.props.selectedAccount,value: dealCreationFees});
      this.setState({created:true});
      // Update state with tx info
      this.setState({
        tx: {
          blockNumber:tx.blockNumber,
          cumulativeGasUsed:tx.cumulativeGasUsed,
          transactionHash:tx.transactionHash,
          dealId:tx.events["PayDealCreationFees"].returnValues["_dealId"],
          dealCreationFees:tx.events["PayDealCreationFees"].returnValues["_fees"],
          creationAccount:tx.events["PayDealCreationFees"].returnValues["_from"],
        }
      });
      console.log(tx);
    } catch(e) {
      this.setState({creating:false});
      alert(e.message);
    }
  }

  accountsHandler = (accounts) => {
    this.setState({accounts});
  }

  rulesHandler = (rules) => {
    this.setState({rules});
  }

  signHandler = (clauseId,value) => {
    let clauseSignatures = [];
    for (let i=0;i<this.state.clausesCount;i++) {
      if (i!==clauseId){
        clauseSignatures.push(this.state.clauseSignatures[i]);
      } else {
        clauseSignatures.push(value);
      }
    }
    this.setState({clauseSignatures});

    // Check if all the clauses where signed
    let signed = clauseSignatures.every((sig) => sig);
    this.setState({signed});
  }

  render() { 
    return (
      <>
        <Container id="main-container">
          <h1>Let's Make A Deal</h1>
          <br/>
          <Clause0 
            editable={!this.state.creating && !this.state.created}
            contract={this.props.contract} 
            signHandler={this.signHandler}
          />
          <br/>
          <Clause1 
            editable={!this.state.creating && !this.state.created}
            accountsCount={this.state.accounts.length}
            rulesCount={this.state.rules.length}
            contract={this.props.contract} 
            signHandler={this.signHandler} 
          />
          <br/>
          <Clause2
            editable={!this.state.creating && !this.state.created}
            contract={this.props.contract} 
            signHandler={this.signHandler}
          />
          <br/>
          <Clause3 
            editable={!this.state.creating && !this.state.created}
            contract={this.props.contract} 
            signHandler={this.signHandler}
          />
          <br/>
          <Clause4 
            editable={!this.state.creating && !this.state.created}
            contract={this.props.contract} 
            signHandler={this.signHandler} 
            accountsHandler={this.accountsHandler} 
            selectedAccount={this.props.selectedAccount}
          />
          <br/>
          <Clause5 
            editable={!this.state.creating && !this.state.created}
            contract={this.props.contract}
            accounts={this.state.accounts}
            rulesHandler={this.rulesHandler} 
            signHandler={this.signHandler}
          />
          <Container align="center">
          {!this.state.created && !this.state.signed && !this.state.creating &&
            <>
              <br/>
              <Button variant="secondary" onClick={this.createDeal} disabled>Let's Make A Deal</Button>
            </>
          }
          {!this.state.created && this.state.signed && !this.state.creating &&
            <>
              <br/>
              <Button variant="primary" onClick={this.createDeal}>
                Let's Make A Deal
              </Button>
            </>
          }
          {!this.state.created && this.state.creating &&
            <>
              <br/>
              <Button variant="primary" onClick={this.createDeal} disabled>
                <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true"/>
                Signing ...
              </Button>
            </>
          }
          </Container>
        </Container>
        {this.state.created &&
          <Container id="sign-container">
              <Signature tx={this.state.tx}/>
          </Container>
        }
      </>
    );
  }
}

export default CreateDeal
