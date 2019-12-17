import { LightningElement, track } from 'lwc';
import { connect } from 'c/connect';
import { actions } from 'c/exampleAppService';


const mapStateToProps = (state) => {
  return {
    contacts: state.ui.contacts
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    addNewContact: () => dispatch(actions.addNewContact(Math.ceil(Math.random() * 1000)))
  }
}

export default class TodoList extends LightningElement {
  @track contacts = [];

  connectedCallback() {
    connect(mapStateToProps, mapDispatchToProps)(this);
  }
}