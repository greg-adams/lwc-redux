import { LightningElement, track } from 'lwc';
import { connect } from 'c/connect';
import { actions } from 'c/exampleAppService';


const mapStateToProps = (state) => {
  return {
    contacts: state.ui.contacts
  }
}

const mapDispatchToProps = (dispatch) => ({
  addNewContact: () => dispatch(actions.addNewContact())
})

export default class TodoList extends LightningElement {
  @track contacts = [];

  connectedCallback() {
    connect(mapStateToProps, mapDispatchToProps)(this);
  }
}