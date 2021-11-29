import React, { Component } from 'react';
import { Table, Form, Button, Row, Col } from 'react-bootstrap';

class Clause5 extends Component {
  constructor(props) {
    super(props);
    this.state = { 
      rules:[
        {
          articles:[]
        },
        {
          articles:[
            {
              instructionName:"IF-ADDR",
              paramString:"ACCOUNTANT",
              paramUInt:0,
              paramAddress:"0x194262d7D3959416033d1623e16800bD56E0Fb3b"
            },
            {
              instructionName:"TRANSFER",
              paramString:"CEO",
              paramUInt:75,
              paramAddress:"0x0db723d5863a9b33ad83aa349b27f8136b6d5360"
            },
            {
              instructionName:"TRANSFER",
              paramString:"CHAIRMAN",
              paramUInt:25,
              paramAddress:"0x0db723d5863a9b33ad83aa349b27f8136b6d5360"
            }
          ]
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

  renderArticle = (ruleIdx, articleIdx) => {
    let text="";
    const article = this.state.rules[ruleIdx].articles[articleIdx];
    if (article.instructionName === "IF-ADDR")
      text = "If the sender is " + article.paramString;
    else if(article.instructionName === "TRANSFER-ALL")
      text = "I transfer the total amount to " + article.paramString;
    else if(article.instructionName === "TRANSFER-SOME")
      text = "I transfer " + article.paramUInt + "% of the total amount to " + article.paramString;
    return text;
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
      
      let rules = this.state.rules.map((rule) => rule.articles.map((article)=>[this.translateInstructionName(article.instructionName),article.paramString, article.paramUInt, article.paramAddress]));
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

  handleSelectParamUInt = (idx, e) => {
    let newArticles = this.state.newArticles;
    newArticles[idx].paramUInt = e.target.value;    
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

  addArticle = (ruleId) => {
    let rules = [...this.state.rules];
    let newArticle = this.state.newArticles[ruleId];
    let article = {
      instructionName: newArticle.instructionName,
      paramString: newArticle.paramString,
      paramUInt: newArticle.paramUInt,
      paramAddress: newArticle.paramAddress,
    }
    rules[0].articles.push(article);
    this.setState({rules});
  }

  deleteArticle = (ruleId, key) => {
    let rules = this.state.rules.map((rule, ruleIdx) => ({articles: rule.articles.filter((article,articleIdx) => !(ruleIdx===ruleId && articleIdx===key))}));
    console.log(this.state.rules);
    this.setState({rules});
    console.log(this.state.rules);
    console.log("Clause5> Delete article ", key+1);
  }

  render() { 
    return ( 
      <Row>
        <Col xs={11}>
          <br/>
          <h2>Clause 5 : Rules</h2>
          {/* Loop over rules*/}
          <br/>
          <h3>Rule 1</h3>
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
                <td>When an incoming payment is received by the rule 0</td>
                <td>-</td>
              </tr>
              {
                this.state.rules[0].articles.map((article, articleIdx) => {

                  return(
                    <tr>
                      <td  key={"0-articleId" + articleIdx}>{articleIdx+1}</td>
                      <td key={"0-articleName-" + articleIdx}>{article.instructionName}</td>
                      <td key={"0-articleText-" + articleIdx}>{this.renderArticle(0,articleIdx)}</td>
                      <td key={"0-articleDelete-" + articleIdx}>
                        {!this.state.signed
                          ? <Button variant="outline-danger" size="sm" onClick={() => this.deleteArticle(0,articleIdx)}>&#10006;</Button>
                          : '-'
                        }
                      </td>
                    </tr>
                  )
                })
              }
              {!this.state.signed &&
                <tr>
                  <td>{this.state.rules[0].articles.length+1}</td>
                  <td>
                    <Form.Select aria-label="Default select example" onChange={(e) => this.handleSelectInstructionName(0,e)}>
                      <option>Select an instruction</option>
                      <option>IF-ADDR</option>
                      <option>TRANSFER-ALL</option>
                      <option>TRANSFER-SOME</option>
                    </Form.Select>
                  </td>
                  <td>
                    {this.state.newArticles[0].instructionName==="IF-ADDR" &&
                      <Row>
                        <Col>If the sender is</Col>
                        <Col>
                          <Form.Select aria-label="Default select example" onChange={(e)=>this.handleSelectFullAddress(0,e)}>
                            <option>Select an address</option>
                            {this.props.accounts.map((account, accountId) => <option title={account.address}>{account.alias}</option>)}
                          </Form.Select>
                        </Col>
                      </Row>
                    }
                    {this.state.newArticles[0].instructionName==="TRANSFER-ALL" &&
                      <Row>
                        <Col>I transfer the total amount to</Col>
                        <Col>
                          <Form.Select aria-label="Default select example" onChange={(e)=>this.handleSelectFullAddress(0,e)}>
                            <option>Select an address</option>
                            {this.props.accounts.map((account, accountId) => <option title={account.address}>{account.alias}</option>)}
                          </Form.Select>
                        </Col>
                      </Row>
                    }
                    {this.state.newArticles[0].instructionName==="TRANSFER-SOME" &&
                      <Row>
                        <Col lg="2">
                          I transfer
                        </Col>
                        <Col lg="4">
                          <input placeholder="75" size="3" maxLength="3" onChange={(e) => this.handleSelectParamUInt(0,e)}/>
                          % to
                        </Col>
                        <Col lg="6">
                          <Form.Select aria-label="Default select example" onChange={(e)=>this.handleSelectFullAddress(0,e)}>
                          <option>Select an address</option>
                            {this.props.accounts.map((account, accountId) => <option title={account.address}>{account.alias}</option>)}
                          </Form.Select>
                        </Col>
                      </Row>
                    }
                  </td>
                  <td><Button variant="outline-success" size="sm" onClick={() => this.addArticle(0)}>&#10004;</Button></td>
                </tr>
              }
            </tbody>
          </Table>
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
 
export default Clause5;