# lwc-redux

## Components 
- Closely follows React-Redux library with few modifications for LWC/SFDC platform:
  - `Connect` - Subscribes component to Redux store, binds action creators, and applies store updates. 
  - `Provider` - Wraps app at top-level to ensure Redux is loaded via static resources and store is initialized. Needs to be given the reducer (or an object that can be passed to the Redux `combinedReducers` helper function).
  - `Store` - Holds the store, and allows access to the store outside of a component using `getStore()`.

## Usage

### ConnectMixin
ConnectMixin will handle subscribing to the store, updating/rendering the component when a new store is published, and unsubscribing after a component is disconnected.  `mapState` and `mapDispatch` will be run once before the component is connected, and `mapState` run with each store update. It accomodates multiple Redux stores by providing a third argument

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
    this.addNewContact('Lucy');
  }
}

export default ConnectMixin(mapState, mapDispatch)(ActiveList);
```

### mapState
The mapState function will be run every time the store publishes a new state (if the store state has changed), so it should be fast. The LWC engine will handle strict equality checks on component properties, re-rendering only if values have actually changed. 

One common technique is to hold unaltered data in the store, and modify/filter it for individual components. If the derived values are expensive to compute, `mapState` can alternately return a function, which will be run once, and the resulting function will be used for store updates, allowing access for internal variables/memoized values.  
```javascript
const mapState = (state) => {
  
  const memoContacts = memoize((contacts) => {
    // do expensive operation here
    return activeContacts;
  })

  return (state) => {
    activeContacts: memoContacts(state.contacts) // run only if state.contacts is updated
  }
}
```

### mapDispatch
`mapDispatch` is used to apply action creators for use directly on your component. It accepts either a plain object:
```javascript
const mapDispatch = {
  addNewContact: actions.addNewContact // Binds action creators to component properties
}
```
or a function that is provided with the Redux `dispatch` method and returns a plain object:
```javascript
const mapDispatch = (dispatch) => {
  return {
    addNewContact: (name) => dispatch({ type: 'ADD_CONTACT', payload: name })
  }
}
```

## Testing
- Decorate store-sourced properties `@api`. This is both clearer and enables much easier testing.
- Unit tests for store-connected components should generally not test store/state interaction, merely set the values directly and test render behavior.
```javascript
  const activeList = createElement('c-active-list', { is: ActiveList });
  activeList.records = [1,2,3];
  return Promise.resolve().then(() => {
    const items = activeList.shadowRoot.querySelectorAll('li');
    expect(items.length).toEqual(3);
  })
```
By default, store-connected components will not run `mapState` or `mapDispatch` or connect to the store during tests unless specified in the options object. This frees us from loading the `Provider` component for every test.
```
export default ConnectMixin(mapState, mapDispatch, 'storeName', { runForTest: true })
```
Test action creators/reducers separately.
```javascript
it('should correctly add a contact', () => {
    const oldState = {
      contacts: [],
    }

    expect(reducer(oldState,
      {
        type: 'ADD_CONTACT',
        payload: 'Lucy',
      }
    )).toMatchObject({
      contacts: ['Lucy']
    })
  });
```