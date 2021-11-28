import React, { Component } from 'react';
import { Table, Button, Row, Col } from 'react-bootstrap';

class Clause5 extends Component {
  constructor(props) {
    super(props);
    this.state = { 
      rules:[
        {
          articles:[
            {
              instructionName:"IF-ADDR",
              paramString:"CEO",
              paramUInt:0,
              paramAddress:"0x07972803660E7d087fDf27F25343D618fA21A354"
            },
            {
              instructionName:"TRANSFER",
              paramString:"ACCOUNTANT",
              paramUInt:0,
              paramAddress:"0x0db723d5863a9b33ad83aa349b27f8136b6d5360"
            }
          ]
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
      signed:false
    }
  }

  renderArticle = (ruleIdx, articleIdx) => {
    let text="";
    const article = this.state.rules[ruleIdx].articles[articleIdx];
    if (article.instructionName === "IF-ADDR")
      text = "If the sender is " + article.paramString;
    else if(article.instructionName === "TRANSFER")
      text = "I transfer the total amount to " + article.paramString;
    return text;
  }

  sign = () => {
    if (this.props.editable) {
      let signed = !this.state.signed;
      this.setState({signed});
      this.props.signHandler(5,signed);
      
      let rules = this.state.rules.map((rule) => rule.articles.map((article)=>[article.instructionName,article.paramString, article.paramUInt, article.paramAddress]));
      this.props.rulesHandler(rules);
    }
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
                    <tr key={articleIdx}>
                      <td>{articleIdx+1}</td>
                      <td>{article.instructionName}</td>
                      <td>{this.renderArticle(0,articleIdx)}</td>
                      <td>
                        {!this.state.signed
                          ? <Button variant="outline-danger" size="sm" onClick={() => this.deleteRule(articleIdx)}>&#10006;</Button>
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
                  <td><input placeholder="Alias, example: Accountant" maxLength="25" size="25" onChange={(e) => this.setState({newRule:{...this.state.newAccount,alias:e.target.value}})}/></td>
                  <td><input placeholder="Address, example: 0x07972803660e7d087fdf27f25343d618fa21a354" maxLength="42" size="42" onChange={(e) => this.setState({newAccount:{...this.state.newAccount,address:e.target.value}})}/></td>
                  <td><Button variant="outline-success" size="sm" onClick={() => this.addAccount()}>&#10004;</Button></td>
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