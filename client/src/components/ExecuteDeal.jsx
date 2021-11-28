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
      rules:[]
    }
  }

  componentDidMount = async () => {}

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
    let tx = await contract.methods.executeRule(this.state.dealId, ruleId  ).send({from:this.props.selectedAccount,value:10**17});
    console.log(tx);
  }

  withdraw = async () => {
    const contract = this.props.contracts.proxy;
    let tx = await contract.methods.withdraw().call(); //send({from:this.props.selectedAccount});
    console.log(tx);
  }

  render() { 
    return (
      <>
        <Container id="main-container">
          <h1>Let's Execute A Deal</h1>
          <br/>
          <Row className="mb-3">
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
          </Row>

          {this.state.rules.length!==0 &&
            <>
              {this.state.rules.map((rule,ruleId) =>
                <>
                  <h4>Rule {ruleId}</h4>
                  <Table bordered hover size="sm">
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
                            {article.instructionName==="IF-ADDR" &&
                              <td>If the sender is <span className="var" title={article[3]}>{article[1]}{article[3]===this.props.selectedAccount && '=YOU'}</span></td>
                            }
                            {article.instructionName==="TRANSFER" &&
                              <td>I transfer the total amount to <span className="var" title={article[3]}>{article[1]}{article[3]===this.props.selectedAccount && '=YOU'}</span></td>
                            }
                            <td>-</td>
                          </tr>
                        )
                      }
                    </tbody>
                  </Table>
                </>
              )};
            </>
          }
        <Container>
          <h2>Withdraw money</h2>
          <Button variant="primary" onClick={this.withdraw}>Withdraw</Button>
        </Container>
        </Container>
      </>
    );
  }
}

export default ExecuteDeal
