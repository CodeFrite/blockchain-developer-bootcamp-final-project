import Button from '@restart/ui/esm/Button';
import React, { Component } from 'react';
import { Container, Form, InputGroup, Table, Row, Col } from 'react-bootstrap';

// import clauses

class ExecuteDeal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dealId:null,
      accounts:[],
      rules:[],
      balance:0
    }
  }

  componentDidMount = async () => {
    await this.checkBalance();
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

    this.setState({rules});

  }

  executeRule = async (ruleId) => {
    const contract = this.props.contracts.proxy;
    let tx = await contract.methods.executeRule(this.state.dealId, ruleId).send({from:this.props.selectedAccount,value:10**18});
    console.log(tx);
    /*let decodedLog = this.props.web3.eth.abi.decodeLog([{type: 'address',name: '_from'},{type: 'uint256',name: '_deposits'}], tx.events[1].raw.data, tx.events[1].raw.topics[0]);*/
    //console.log(decodedLog);

    let receipt = await this.props.web3.eth.getTransactionReceipt(tx.transactionHash);
    const decodedFirstLog = this.props.web3.eth.abi.decodeLog(
      [
        {
          "name": "_from",
          "type": "address"
        },
        {
          "name": "_deposits",
          "type": "uint256"
        }
      ],
      receipt.logs[0].data,
      receipt.logs[0].topics
    );
    console.log(decodedFirstLog)
  }

  withdraw = async () => {
    const contract = this.props.contracts.proxy;
    let tx = await contract.methods.withdraw().send({from:this.props.selectedAccount});
    console.log(tx);
  }

  checkBalance = async () => {
    const contract = this.props.contracts.proxy;
    let tx = await contract.methods.depositsOf().call({from:this.props.selectedAccount});
    console.log(tx);
  }

  render() { 
    return (
      <>
        <Container id="main-container">
          <h1>Let's Execute A Deal</h1>
          <br/>
          <Row>
            <Col lg="10">
              <Form.Group
                as={Col}
                md="6"
                controlId="validationFormik101"
                className="position-relative"
              >
                <InputGroup>
                  <InputGroup.Text>Deal Id</InputGroup.Text>
                  <Form.Control type="number" onChange={(e) => this.setState({dealId:e.target.value})} />
                  <Form.Control.Feedback type="invalid">
                    Please choose a username.
                  </Form.Control.Feedback>
                  <Button variant="primary" onClick={this.getDeal}>Search Deal</Button>
                </InputGroup>
              </Form.Group>
            </Col>
            <Col lg="2">
              <Button variant="primary" onClick={this.withdraw}>Withdraw</Button>
            </Col>
          </Row>

          {this.state.rules.length!==0 &&
            <>
              {this.state.rules.map((rule,ruleId) =>
                <>
                  <br/>
                  <h4>Rule {ruleId}</h4>
                  <Table bordered hover size="sm" key={ruleId}>
                    <thead>
                      <tr>
                        <th>#</th>
                        <th>Type</th>
                        <th>Story</th>
                        <th><Button variant="primary" onClick={() => this.executeRule(ruleId)}>Execute</Button></th>
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
                            <td><span className="var">{article[0]}</span></td>
                            {article[0]==="IF-ADDR" &&
                              <td>If the sender is <span className="var" title={article[3]}>{article[1]}{article[3]===this.props.selectedAccount && '=YOU'}</span></td>
                            }
                            {article[0]==="TRANSFER" && article[2]==="100" &&
                              <td>I transfer the total amount to <span className="var" title={article[3]}>{article[1]}{article[3]===this.props.selectedAccount && '=YOU'}</span></td>
                            }
                            {article[0]==="TRANSFER" && article[2]!=="100" &&
                              <td>I transfer <span className="var">{article[2]}</span>% to <span className="var" title={article[3]}>{article[1]}{article[3]===this.props.selectedAccount && '=YOU'}</span></td>
                            }
                            <td>-</td>
                          </tr>
                        )
                      }
                    </tbody>
                  </Table>
                </>
              )}
            </>
          }
        </Container>
      </>
    );
  }
}

export default ExecuteDeal
