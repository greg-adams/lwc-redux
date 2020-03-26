# lwc-redux

## Usage
ConnectMixin will handle subscribing to the store, updating/rendering the component when a new store is published, and unsubscribing when a component is disconnected.  `mapState` and `mapDispatch` will be run once before the component is connected, and `mapState` run with each store update.

```javascript
import { LightningElement, api } from 'lwc';
import { ConnectMixin } from 'c/connect';
import { actions } from 'c/exampleAppService';

const mapState = (state) => {
  return {
    activeContacts: state.contacts // Maps state values to component properties
  }
}

const mapDispatch = {
  addNewContact: actions.addNewContact // Binds action creators to component properties
}

class ActiveList extends LightningElement {
  @api activeContacts = [];

  @api addNewContact = () => { };

  handleAddNewContactButton() {
    this.addNewContact(this.contacts.length + 1);
  }
}

export default ConnectMixin(mapState, mapDispatch)(ActiveList);
```

## Testing
- Decorate store-sourced properties `@api`. This is both clearer and enables much easier testing.
- Unit tests for store-connected components should generally not test store/state interaction, merely set the values directly and test render behavior.  
```
  const activeList = createElement('c-active-list', { is: ActiveList });
  activeList.records = [1,2,3];
  return Promise.resolve().then(() => {
    const items = activeList.shadowRoot.querySelectorAll('li');
    expect(items.length).toEqual(3);
  })
```
- Test action creators/reducers separately.