import React, { Component } from 'react';
import {Link} from 'react-router-dom';
import { Container, Navbar, Nav, Button, Spinner } from 'react-bootstrap';

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
              <div className="vr"/>
              <Link className="header-link" to="/ExecuteDeal">Let's Execute A Rule</Link>
              <div className="vr"/>
              <Link className="header-link" to="/AdminDashboard">Let's Manage the DApp</Link>
            </>
          )
        } else {
          return (
            <>
              <Link className="header-link" to="/CreateDeal">Let's Make A Deal</Link>
              <div className="vr" />
              <Link className="header-link" to="/ExecuteDeal">Let's Execute a Rule</Link>
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
            return <Link className="header-metamask-connect" to="/CreateDeal" onClick={this.props.handleConnectMetaMask}>Connect Metamask</Link>
          else
            return <Link className="header-metamask-disconnect" to="/" onClick={this.props.logout}>Disconnect</Link>
          }
        }
    }

    // Main render
    return (
      <Navbar expand="lg">
        
        <Container className="container-fluid">
          
          <Navbar.Brand>
            <img src="scientist.png" alt="MAD icon" width="35px"></img>
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              {renderNavLinks()}
            </Nav>
            <Nav>
              {renderConnectMetaMaskButton()}
            </Nav>
          </Navbar.Collapse>

        </Container>
      </Navbar>
    );
  } 
}
 
export default Header;