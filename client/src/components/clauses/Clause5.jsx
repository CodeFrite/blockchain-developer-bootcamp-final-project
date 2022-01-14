import React, { Component } from 'react';
import { Table, Form, Button, Row, Col } from 'react-bootstrap';

class Clause5 extends Component {
  constructor(props) {
    super(props);
    this.state = { 
      rules:[
        {
          articles:[]
        }
      ],
      newArticles: [
        {
          instructionName: null,
          paramString: null,
          paramUInt: null,
          paramAddress: null
        }
      ],
      signed:false
    }
  }

  translateInstructionName = (name) => {
    let rule1 = ["TRANSFER-ALL","TRANSFER-SOME"];
    if (rule1.indexOf(name) !== -1)
      return "TRANSFER";
    return name;
  }

  sign = () => {
    if (this.props.editable) {
      let signed = !this.state.signed;
      this.setState({signed});
      this.props.signHandler(5,signed);
      
      let rules = this.state.rules.map((rule) => rule.articles.map((article)=>[this.translateInstructionName(article.instructionName),article.paramString, article.paramUInt.toString(), article.paramAddress]));
      this.props.rulesHandler(rules);
    }
  }

  handleSelectInstructionName = (idx, e) => {
    let newArticles = this.state.newArticles;

    newArticles[idx] = {
      instructionName: e.target.value,
      paramString: null,
      paramUInt: (e.target.value==="TRANSFER-ALL") ? 100 : 0,
      paramAddress: null
    }
    this.setState({newArticles});
    console.log("handleSelectInstructionName")
  }

  handleSelectParamString = (idx, e) => {
    let newArticles = this.state.newArticles;
    newArticles[idx].paramString = e.target.value;    
    this.setState({newArticles});
    console.log("handleSelectParamString")
  }

  handleSelectParamUInt = (idx, e, factor) => {
    let newArticles = this.state.newArticles;
    newArticles[idx].paramUInt = e.target.value * factor;
    this.setState({newArticles});
    console.log("handleSelectParamUINT")
  }

  handleSelectFullAddress = (idx,e) => {
    // Find the corresponding address
    let account = this.props.accounts.filter((account) => account.alias===e.target.value);
    console.log(account);
    let newArticles = this.state.newArticles;
    newArticles[idx].paramString = e.target.value;
    newArticles[idx].paramAddress = account[0].address;
    this.setState({newArticles});
    console.log("handleSelectFullAddress")
  }

  renderArticle = (ruleIdx, articleIdx) => {
    let text="";
    const article = this.state.rules[ruleIdx].articles[articleIdx];
    if (article.instructionName === "IF-ADDR")
      text = "If the sender is " + article.paramString;
    else if(article.instructionName === "IF-AMOUNT-BIGGER")
      text = "If the received value is bigger than " + article.paramUInt/10**18 + " ETH";
    else if(article.instructionName === "TRANSFER-ALL")
      text = "I transfer the total amount to " + article.paramString;
    else if(article.instructionName === "TRANSFER-SOME")
      text = "I transfer " + article.paramUInt + "% of the total amount to " + article.paramString;
    return text;
  }

  addArticle = (ruleId) => {
    let rules = [...this.state.rules];
    let newArticle = this.state.newArticles[ruleId];
    let article = {
      instructionName: newArticle.instructionName,
      paramString: (newArticle.paramString ? newArticle.paramString : ""),
      paramUInt: newArticle.paramUInt,
      paramAddress: (newArticle.paramAddress ? newArticle.paramAddress : "0x0000000000000000000000000000000000000000"),
    }
    rules[ruleId].articles.push(article);
    this.setState({rules});
  }

  deleteArticle = (ruleId, key) => {
    let rules = this.state.rules.map((rule, ruleIdx) => ({articles: rule.articles.filter((article,articleIdx) => !(ruleIdx===ruleId && articleIdx===key))}));
    this.setState({rules});
    console.log("Clause5> Delete article ", key+1);
  }

  addRule = () => {
    let newArticle = {
      instructionName: null,
      paramString: null,
      paramUInt: null,
      paramAddress: null
    };
    let newArticles = [...this.state.newArticles, newArticle];
    this.setState({newArticles})
    let rule = {
      articles:[]
    };
    let rules = [...this.state.rules, rule];
    this.setState({rules});
    console.log("Clause5> Add rule");
  }

  deleteRule = (ruleId) => {
    let rules = this.state.rules.filter((rule, ruleIdx) => ruleIdx!==ruleId);
    this.setState({rules});
    console.log("Clause5> Delete rule ", ruleId);
  }

  render() { 
    return ( 
      <>
        <Row>
          <Col xs={11}>
            <h2>Clause 5 : Rules</h2>
          </Col>
          <Col xs={1}>
            {this.state.signed
              ? <span className="signed-true" onClick={this.sign}>&#x2714;</span>
              : <span className="signed-false" onClick={this.sign}>&#x2714;</span>
            }
          </Col>
        </Row>
        {/* Loop over rules */}
        {
          this.state.rules.map((rule, ruleIdx) => {
            return (
              <Row key="ruleIdx">
                <Col xs={11}>
                  <br/>
                  <h3>Rule {ruleIdx}</h3>
                  <br/>
                  <Table bordered hover size="sm">
                    <thead>
                      <tr>
                        <th>#</th>
                        <th>Type</th>
                        <th>Story</th>
                        <th>Delete</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>0</td>
                        <td>Entry point</td>
                        <td>When an incoming payment is received by the rule {ruleIdx}</td>
                        <td>-</td>
                      </tr>
                      {/* Loop over articles */}
                      {
                        this.state.rules[ruleIdx].articles.map((article, articleIdx) => {

                          return(
                            <tr key={articleIdx}>
                              <td key={"ruleId-" + {ruleIdx} + "-articleId" + articleIdx}>{articleIdx+1}</td>
                              <td key={"ruleId-" + {ruleIdx} + "-articleName-" + articleIdx}>{article.instructionName}</td>
                              <td key={"ruleId-" + {ruleIdx} + "-articleText-" + articleIdx}>{this.renderArticle(ruleIdx,articleIdx)}</td>
                              <td key={"ruleId-" + {ruleIdx} + "-articleDelete-" + articleIdx}>
                                {!this.state.signed
                                  ? <Button variant="outline-danger" size="sm" onClick={() => this.deleteArticle(ruleIdx,articleIdx)}>&#10006;</Button>
                                  : '-'
                                }
                              </td>
                            </tr>
                          )
                        })
                      }
                      {!this.state.signed &&
                        <tr>
                          <td>{this.state.rules[ruleIdx].articles.length+1}</td>
                          <td>
                            <Form.Select aria-label="Default select example" onChange={(e) => this.handleSelectInstructionName(ruleIdx,e)}>
                              <option>Select an instruction</option>
                              <option>IF-ADDR</option>
                              <option>IF-AMOUNT-BIGGER</option>
                              <option>TRANSFER-ALL</option>
                              <option>TRANSFER-SOME</option>
                            </Form.Select>
                          </td>
                          <td>
                            {this.state.newArticles[ruleIdx].instructionName==="IF-ADDR" &&
                              <Row>
                                <Col>If the sender is</Col>
                                <Col>
                                  <Form.Select aria-label="Default select example" onChange={(e)=>this.handleSelectFullAddress(ruleIdx,e)}>
                                    <option>Select an address</option>
                                    {this.props.accounts.map((account, accountId) => <option title={account.address}>{account.alias}</option>)}
                                  </Form.Select>
                                </Col>
                              </Row>
                            }
                            {this.state.newArticles[ruleIdx].instructionName==="IF-AMOUNT-BIGGER" &&
                              <Row>
                                <Col>If the amount received is bigger than</Col>
                                <Col>
                                  <input placeholder="75" size="20" maxLength="20" onChange={(e) => this.handleSelectParamUInt(ruleIdx, e, 10**18)}/> ETH
                                </Col>
                              </Row>
                            }
                            {this.state.newArticles[ruleIdx].instructionName==="TRANSFER-ALL" &&
                              <Row>
                                <Col>I transfer the total amount to</Col>
                                <Col>
                                  <Form.Select aria-label="Default select example" onChange={(e)=>this.handleSelectFullAddress(ruleIdx,e)}>
                                    <option>Select an address</option>
                                    {this.props.accounts.map((account, accountId) => <option title={account.address}>{account.alias}</option>)}
                                  </Form.Select>
                                </Col>
                              </Row>
                            }
                            {this.state.newArticles[ruleIdx].instructionName==="TRANSFER-SOME" &&
                              <Row>
                                <Col lg="2">
                                  I transfer
                                </Col>
                                <Col lg="4">
                                  <input placeholder="75" size="3" maxLength="3" onChange={(e) => this.handleSelectParamUInt(ruleIdx,e,1)}/>
                                  % to
                                </Col>
                                <Col lg="6">
                                  <Form.Select aria-label="Default select example" onChange={(e)=>this.handleSelectFullAddress(ruleIdx,e)}>
                                  <option>Select an address</option>
                                    {this.props.accounts.map((account, accountId) => <option title={account.address}>{account.alias}</option>)}
                                  </Form.Select>
                                </Col>
                              </Row>
                            }
                          </td>
                          <td><Button variant="outline-success" size="sm" onClick={() => this.addArticle(ruleIdx)}>&#10004;</Button></td>
                        </tr>
                      }
                    </tbody>
                  </Table>
                </Col>
                <Col xs={1}>
                  {/* Add a delete Rule button for rules > 0 */}
                  {ruleIdx>0 && !this.state.signed &&
                    <>
                    <br/>
                    <Button variant="outline-danger" size="m" onClick={() => this.deleteRule(ruleIdx)}>&#10006;</Button>
                    </>
                  }
                </Col>
              </Row>
            )
          })
        }
        <Row>
          {!this.state.signed &&
            <p onClick={this.addRule} className="button">+ Add a new Rule ...</p>
          }
        </Row>
      </>
    );
  }
}
 
export default Clause5;