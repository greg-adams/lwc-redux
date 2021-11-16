import { LightningElement } from 'lwc';
import { ConnectMixin } from 'c/store';
import { actions } from 'c/exampleAppService';

const mapState = ({ ui }) => {
    return {
        contacts: ui.contacts,
        name: ui.header // Maps state values to component properties
    };
};

const mapDispatch = {
    addNewContact: actions.addNewContact
};

class ActiveList extends LightningElement {
    name = '';
    contacts = [];

    addNewContact = () => { };

    fireAddNewContact() {
        this.addNewContact(this.contacts.length + 1);
    }
}

export default ConnectMixin(mapState, mapDispatch)(ActiveList);
