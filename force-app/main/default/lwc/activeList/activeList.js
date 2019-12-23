import { LightningElement, api } from 'lwc';
import { ConnectMixin } from 'c/connect';
import { actions } from 'c/exampleAppService';

const mapState = (state) => {
  return {
    contacts: state.ui.contacts
  }
}

const mapDispatch = {
  addNewContact: actions.addNewContact
}

class ActiveList extends LightningElement {
  @api name = '';
  @api contacts = [];

  fireAddNewContact() {
    this.addNewContact(this.contacts.length + 1);
  }
}

export default ConnectMixin(mapState, mapDispatch)(ActiveList);
