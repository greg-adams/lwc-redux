import { LightningElement, api } from 'lwc';
import { connect } from 'c/connect';
import { actions } from 'c/exampleAppService';


const mapState = (state) => {
  return {
    contacts: state.ui.contacts
  }
}

const mapDispatch = {
  addNewContact: actions.addNewContact
}

export default class ActiveList extends LightningElement {
  @api name = '';
  @api contacts = [];

  connectedCallback() {
    connect(mapState, mapDispatch)(this);
  }

  fireAddNewContact() {
    this.addNewContact(this.contacts.length + 1);
  }
}
