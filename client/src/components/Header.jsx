import React, { Component } from 'react';
import { Container, Navbar, Nav, Button, Form, Spinner } from 'react-bootstrap';

class Header extends Component {
  constructor(props) {
    super(props);
    this.state = {  }
  }
  render() { 
    // Helper rendering functions for connect wallet button
    const renderConnectMetaMaskButton = () => {
      if (!this.props.metamask.installed)
        return <Button variant="outline-danger" disabled>Install MetaMask</Button>;
      else {
        if (!this.props.metamask.unlocked)
          return <Button variant="outline-warning" disabled>Unlock you wallet</Button>;
        else {
          if (this.props.metamask.connecting)
          return <Button variant="primary" disabled><Spinner animation="border" variant="primary" size="sm"/>Connecting MetaMask...</Button>;
          else if (!this.props.metamask.connected)
            return <Button variant="primary" onClick={this.props.handleConnectMetaMask}>Connect MetaMask</Button>;
          else
            return <Button variant="outline-success" onClick={this.props.handleDisconnectMetaMask}>Disconnect MetaMask</Button>;
          }
        }
    }

    // Main render
    return (
      <Navbar variant="light" bg="light" expand="lg">
        <Container className="container-fluid">

          <Navbar.Brand>
            MAD          
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav>
              <Form className="d-flex">
                {renderConnectMetaMaskButton()}
              </Form>          
            </Nav>
          </Navbar.Collapse>

        </Container>
      </Navbar>
    );
  } 
}
 
export default Header;