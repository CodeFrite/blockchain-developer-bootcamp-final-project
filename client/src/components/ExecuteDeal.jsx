import Button from '@restart/ui/esm/Button';
import React, { Component } from 'react';
import { Container, Form, InputGroup, Row, Col } from 'react-bootstrap';

// import clauses

class ExecuteDeal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dealId:null,
      ruleId:0
    }
  }

  componentDidMount = async () => {}

  getDeal = async () => {
    const contract = this.props.contract;
    let tx = await contract.methods.executeRule(this.state.dealId,this.state.ruleId).send({from:this.props.selectedAccount,value:10**18});
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

        </Container>
      </>
    );
  }
}

export default ExecuteDeal
