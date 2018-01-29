import React from 'react';
import {
  NavItem,
  Glyphicon,
  Modal,
  Form,
  FormGroup,
  FormControl,
  ControlLabel,
  Button,
  ButtonToolbar,
} from 'react-bootstrap';
import { Redirect } from 'react-router-dom';

import Toast from './Toast';

export default class IssueAddNavItem extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showing: false,
      toastVisible: false,
      toastMessage: '',
      toastType: 'success',
      redirect: false,
      redirectAddress: '',
    };
    this.showModal = this.showModal.bind(this);
    this.hideModal = this.hideModal.bind(this);
    this.submit = this.submit.bind(this);
    this.showError = this.showError.bind(this);
    this.dismissToast = this.dismissToast.bind(this);
  }

  showModal() {
    this.setState({ showing: true });
  }

  hideModal() {
    this.setState({ showing: false });
  }

  showError(message) {
    this.setState({
      toastVisible: true,
      toastMessage: message,
      toastType: 'danger',
    });
  }

  dismissToast() {
    this.setState({ toastVisible: false });
  }

  submit(e) {
    e.preventDefault();
    this.hideModal();
    const form = document.forms.issueAdd;
    const newIssue = {
      owner: form.owner.value,
      title: form.title.value,
      status: 'New',
      created: new Date(),
    };
    fetch('/api/issues', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newIssue),
    })
      .then((response) => {
        console.log(response);
        if (response.ok) {
          response.json()
            .then((updatedIssue) => {
              this.setState({ redirect: true, redirectAddress: `/issues/${updatedIssue._id}` });
            });
        } else {
          response.json()
            .then((error) => {
              this.showError(`Failed to add issue: ${error.message}`);
            });
        }
      })
      .catch((error) => {
        this.showError(`Error in sending data to server ${error.message}`);
      });
  }

  render() {
    if (this.state.redirect) {
      this.state.redirect = false;
      this.state.showing = false;
      return <Redirect to={this.state.redirectAddress} />;
    }
    return (
      <NavItem onClick={this.showModal}>
        <Glyphicon glyph="plus" /> Create Issue
        <Modal keyboard show={this.state.showing} onHide={this.hideModal}>
          <Modal.Header closeButton>
            <Modal.Title>CreateIssue</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form name="issueAdd">
              <FormGroup>
                <ControlLabel>Title</ControlLabel>
                <FormControl name="title" autoFocus />
              </FormGroup>
              <FormGroup>
                <ControlLabel>Owner</ControlLabel>
                <FormControl name="owner" />
              </FormGroup>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <ButtonToolbar>
              <Button type="button" bsStyle="primary" onClick={this.submit}>Submit</Button>
              <Button bsStyle="link" onClick={this.hideModal}>Cancel</Button>
            </ButtonToolbar>
          </Modal.Footer>
        </Modal>
        <Toast
          showing={this.state.toastVisible}
          message={this.state.toastMessage}
          onDismiss={this.dismissToast}
          bsStyle={this.state.toastType}
        />
      </NavItem>
    );
  }
}
