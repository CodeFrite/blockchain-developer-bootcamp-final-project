import React, { Component } from 'react';
import { Modal, Button } from 'react-bootstrap';

class ETHAmountSelector extends Component {
  constructor(props) {
    super(props);
    this.state = { value:0 }
  }

  render() { 
    
    return (
      <>
        <Modal show={this.props.show} onHide={this.props.onHide}>
            <Modal.Header>
            <Modal.Title>Select ETH amount</Modal.Title>
            <button type="button" className="btn-close" aria-label="Close" onClick={this.props.handleClose}></button>
            </Modal.Header>
            <Modal.Body>
              Amount: <input id="value" value={this.state.value} onChange={ (e) => this.setState({value: e.target.value})}/>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="light" onClick={this.props.onHide}>Cancel</Button> 
              <Button variant="success" onClick={() => this.props.handleValidate(this.state.value * 10**18)}>&#9654;</Button>
            </Modal.Footer>
        </Modal>
      </>
    );
  }
}
 
export default ETHAmountSelector;