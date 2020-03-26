import { LightningElement, api } from 'lwc';
import { ConnectMixin } from 'c/connect';
import { actions } from 'c/exampleAppService';

const mapState = (state) => {
  return {
    contacts: state.ui.contacts,
    name: state.ui.header // Maps state values to component properties
  }
}

const mapDispatch = {
  addNewContact: actions.addNewContact
}

class ActiveList extends LightningElement {
  @api name = '';
  @api contacts = [];

  @api addNewContact = () => { };

  fireAddNewContact() {
    this.addNewContact(this.contacts.length + 1);
  }
}

export default ConnectMixin(mapState, mapDispatch)(ActiveList);
