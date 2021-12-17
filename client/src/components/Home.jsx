import React, { Component } from 'react';
import { Container } from 'react-bootstrap';

class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {  }
  }
  
  render() { 
    return ( 
      <Container id="main-container">
        <h1>Welcome on Make A Deal</h1>
      </Container>
    );
  }
}
 
export default Home;