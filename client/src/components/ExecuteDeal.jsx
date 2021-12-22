import React, { Component } from 'react';
import { Container, Table, Row, Col, Button } from 'react-bootstrap';
import ETHAmountSelector from './ETHAmountSelector';

// import clauses

class ExecuteDeal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dealId:0,
      accounts:[],
      rules:[],
      balance:0,
      dealNotFound:false,
      msgValue:0,
      modal: {
        show:false,
        params:{ruleId:null}
      },
      DappIsPaused: true
    }
  }

  componentDidMount = async () => {
    await this.getDappIsPaused();
    await this.checkBalance();
  }

  // DApp state
  getDappIsPaused = async () => {
    const DappIsPaused = await this.props.contracts.proxy.methods.paused().call();
    this.setState({DappIsPaused});
  }

  getDeal = async () => {
    console.log("Getting deal informations (dealId=", this.state.dealId, "):")
    const contract = this.props.contracts.deals;

    // Get accounts from Deals contract
    let accountsCount = await contract.methods.getAccountsCount(this.state.dealId).call();
    console.log("+ accountsCount: ", accountsCount);
    
    let accountsAddresses = [];
    for (let i=0;i<accountsCount;i++) {
      let account = await contract.methods.getAccount(this.state.dealId,i).call();
      accountsAddresses.push(account);
    }
    console.log("+ accountsAddresses: " + accountsAddresses);

    // Get Articles from deals
    let rules=[];
    let rulesCount = await contract.methods.getRulesCount(this.state.dealId).call();

    for (let i=0;i<rulesCount;i++) {
      let articlesCount = await contract.methods.getArticlesCount(this.state.dealId, i).call();
      let rule=[];
      for (let j=0;j<articlesCount;j++) {
        let article = await contract.methods.getArticle(this.state.dealId,i,j).call();
        rule.push(article);
      }
      rules.push(rule);
    }
    console.log("+ Rules: ", rules);

    // Deal found?
    if (rules.length===0)
      this.setState({dealNotFound:true});
    else
    this.setState({dealNotFound:false});
    this.setState({rules});

  }

  executeRule = async (ruleId, value) => {
    const contract = this.props.contracts.proxy;
    await contract.methods.executeRule(this.state.dealId, ruleId)
      .send({from:this.props.selectedAccount,value: value})
      .then(console.log)
      .catch((e) => alert(e.message));

    // Update Escrow balance
    await this.checkBalance();
  }

  checkBalance = async () => {
    const contract = this.props.contracts.instructionsProvider;
    let balance = await contract.methods.getBalance().call({from:this.props.selectedAccount});
    this.setState({balance});
    console.log("ExecuteDeal> Escrow balance: ", balance/10**18, "ETH");
  }

  withdraw = async () => {
    const contract = this.props.contracts.proxy;
    await contract.methods.withdraw()
      .send({from:this.props.selectedAccount})
      .then(console.log)
      .catch((e) => alert(e.message));
    await this.checkBalance();
  }

  // ETH Amount dialog
  showModal = (ruleId) => {
    this.setState({modal:{show: true, params:{ruleId}}});
  }

  hideModal = () => {
    this.setState({showModal: false});
    this.setState({modal:{...this.state.modal, show: false}});
  }

  handleValidate = (value) => {
    this.hideModal();
    this.executeRule(this.state.modal.params.ruleId, value);
  }

  render() { 

    if (this.state.DappIsPaused)
      return (
        <Container id="main-container"><h2>MAD is under maintenance, please try later.</h2></Container>
      )
    else {
      return (
        <Container id="main-container">
          <h1>Let's Execute A Rule</h1>
          <br/>
          <Row>
            <Col className="border-dashed-black padding-5" lg="4">
              Deal Id: <input size="3" type="number" min="0" value={this.state.dealId} onChange={(e) => this.setState({dealId:e.target.value})} />&nbsp;
              <Button variant="primary" size="sm" onClick={this.getDeal} >Search</Button>
            </Col>
            <Col lg="4"></Col>
            <Col className="border-dashed-black padding-5" lg="4">
            {this.state.balance>0 && 
              <>
                DApp balance: {this.state.balance/10**18} ETH <Button variant="primary" size="sm" onClick={this.withdraw}>Withdraw</Button>
              </>
            }
            {this.state.balance<=0 && 
              <>
                DApp balance: {this.state.balance/10**18} ETH <Button variant="primary" size="sm" onClick={this.withdraw} disabled>Withdraw</Button>
              </>
            }
            </Col>
          </Row>

          {this.state.rules.length!==0 &&
            <>
              {this.state.rules.map((rule,ruleId) =>
                <div key={ruleId}>
                  <br/><br/>
                  <h4>Rule {ruleId}</h4>
                  <br/>
                  <Table bordered hover size="sm" key={ruleId}>
                    <thead>
                      <tr>
                        <th>#</th>
                        <th>Type</th>
                        <th>Story</th>
                        <th><Button size="sm" onClick={() => this.showModal(ruleId)}>&#9654;</Button></th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>0</td>
                        <td>Entry point</td>
                        <td>When an incoming payment is received by the rule 0</td>
                        <td>-</td>
                      </tr>
                      {
                        rule.map((article, key) => 
                          <tr key={key}>
                            <td><span className="var">{key+1}</span></td>
                            {article[0]==="IF-ADDR" &&
                              <>
                                <td><span className="var">{article[0]}</span></td>
                                <td>If the sender is <span className="var" title={article[3]}>{article[1]}{article[3]===this.props.selectedAccount && '=YOU'}</span></td>
                              </>
                            }
                            {article[0]==="TRANSFER" && article[2]==="100" &&
                              <>
                                <td><span className="var">TRANSFER-ALL</span></td>
                                <td>I transfer the total amount to <span className="var" title={article[3]}>{article[1]}{article[3]===this.props.selectedAccount && '=YOU'}</span></td>
                              </>
                            }
                            {article[0]==="TRANSFER" && article[2]!=="100" &&
                              <>
                                <td><span className="var">TRANSFER-SOME</span></td>
                                <td>I transfer <span className="var">{article[2]}</span>% to <span className="var" title={article[3]}>{article[1]}{article[3]===this.props.selectedAccount && '=YOU'}</span></td>
                              </>
                            }
                            <td>-</td>
                          </tr>
                        )
                      }
                    </tbody>
                  </Table>
                </div>
              )}
            </>
          }
          {this.state.dealNotFound &&
            <>
              <br/><br/>
              <h3><i>... no deal found for this id</i></h3>
            </>
          }
          {/* ETHAmountSelector */}
          <ETHAmountSelector show={this.state.modal.show} onHide={this.hideModal} handleValidate={this.handleValidate} params={this.state.modal.params}/>
        </Container>
      );
    }
  }
}

export default ExecuteDeal
