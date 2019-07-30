import { LightningElement, track } from 'lwc';
import { connect } from 'c/connect';
import { actions } from 'c/exampleAppService';


const mapStateToProps = (state) => {
  return {
    contacts: state.contacts
  }
}

const mapDispatchToProps = {
  addNewContact: actions.addNewContact
}

export default class ActiveList extends LightningElement {
  @track contacts = [];

  connectedCallback() {
    connect(mapStateToProps, mapDispatchToProps)(this);
  }
}
