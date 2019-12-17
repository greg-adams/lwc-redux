import { LightningElement, api } from 'lwc';
import { connect } from 'c/connect';
import { actions } from 'c/exampleAppService';


const mapStateToProps = (state) => {
  return {
    contacts: state.ui.contacts
  }
}

const mapDispatchToProps = {
  addNewContact: actions.addNewContact
}

export default class ActiveList extends LightningElement {
  @api name = '';
  @api contacts = [];

  connectedCallback() {
    connect(mapStateToProps, mapDispatchToProps)(this);
  }

  fireAddNewContact() {
    this.addNewContact(this.contacts.length + 1);
  }
}
