import React, { Component } from 'react';
import { Modal, Button } from 'react-bootstrap';

class CustomModal extends Component {
  constructor(props) {
    super(props);
    this.state = {}
    
  }

  render() { 
    
    return (
      <>

        <Modal show={this.props.show} onHide={this.props.handleClose}>
            <Modal.Header>
            <Modal.Title>Metal Not Detected</Modal.Title>
            <button type="button" className="btn-close" aria-label="Close" onClick={this.props.handleClose}></button>
            </Modal.Header>
            <Modal.Body>This website relies on MetaMask to interact with the contract. Please install MetaMask.</Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={this.props.handleClose}>
                  Close
              </Button>
            </Modal.Footer>
        </Modal>
      </>
    );
  }
}
 
export default CustomModal;