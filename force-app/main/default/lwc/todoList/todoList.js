import { LightningElement, api } from 'lwc';
import { ConnectMixin } from 'c/connect';
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

class TodoList extends LightningElement {
  @api contacts = [];

  @api addNewContact = () => { };


}

export default ConnectMixin(mapState, mapDispatch)(TodoList);
