import { LightningElement, track } from 'lwc';
import { connect } from 'c/connect';
import { actions } from 'c/exampleAppService';


const mapState = (state) => {
  return {
    contacts: state.ui.contacts
  }
}

const mapDispatch = (dispatch) => {
  return {
    addNewContact: () => dispatch(actions.addNewContact(Math.ceil(Math.random() * 1000)))
  }
}

export default class TodoList extends LightningElement {
  @track contacts = [];

  connectedCallback() {
    connect(mapState, mapDispatch)(this);
  }
}