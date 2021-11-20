import React, { Component } from 'react';
import { Container } from 'react-bootstrap';

// import clauses
import Signature from "./clauses/Signature";
import Clause0 from './clauses/Clause0';
import Clause1 from './clauses/Clause1';
import Clause2 from './clauses/Clause2';
import Clause3 from './clauses/Clause3';
import Clause4 from './clauses/Clause4';
import Clause5 from './clauses/Clause5';
import Clause6 from './clauses/Clause6';

class CreateDeal extends Component {
  constructor(props) {
    super(props);
    this.state = { }
  }
  render() { 
    return (
      <>
        <Container>
          <Signature/>
        </Container>
        <Container>
          <Clause0/>
          <Clause1/>
          <Clause2/>
          <Clause3/>
          <Clause4/>
          <Clause5/>
          <Clause6/>
        </Container>
      </>
    );
  }
}

export default CreateDeal
