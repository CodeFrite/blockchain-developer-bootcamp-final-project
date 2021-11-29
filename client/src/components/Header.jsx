import React, { Component } from 'react';
import { Container, Navbar, Nav, Button, Spinner } from 'react-bootstrap';
import {Link} from 'react-router-dom';

class Header extends Component {
  constructor(props) {
    super(props);
    this.state = {  }
  }
  render() { 
    // Helper rendering function for nav links
    const renderNavLinks = () => {
      if (this.props.metamask.connected){
        if (this.props.isOwnerAccount){
          return (
            <>
              <Link className="header-link" to="/CreateDeal">Let's Make A Deal</Link>
              |
              <Link className="header-link" to="/ExecuteDeal">Execute A Deal</Link>
              |
              <Link className="header-link" to="/">Admin Dashboard</Link>
            </>
          )
        } else {
          return (
            <>
              <Link className="header-link" to="/CreateDeal">Let's Make A Deal</Link>
              |
              <Link className="header-link" to="/ExecuteDeal">Execute a rule</Link>
            </>
          )
        }
      }
    }

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
          
          <Navbar.Brand href="/">
            MAD          
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav>
              {renderNavLinks()}
              {renderConnectMetaMaskButton()}
            </Nav>
          </Navbar.Collapse>

        </Container>
      </Navbar>
    );
  } 
}
 
export default Header;