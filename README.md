# lwc-redux

## Components

-   Closely follows React-Redux library with few modifications for LWC/SFDC platform:
    -   `Provider` - Wraps app at top-level to ensure Redux is loaded via static resources and store is initialized. Needs to be given the reducer (or an object that can be passed to the Redux `combinedReducers` helper function).
    -   `Store` - Holds the store, and allows access to the store outside of a component using `getStore()`.
        -   `ConnectMixin` - Subscribes component to Redux store, binds action creators, and applies store updates.
        -   `initStore(reducer, { storeKey })` - Creates store with reducer after static resource is loaded.
        -   `getStore(storeKey)` - returns default store (or specific store w/ store key)

## Usage

### ConnectMixin

ConnectMixin will handle subscribing to the store, updating/rendering the component when a new store is published, and unsubscribing after a component is disconnected. `mapState` and `mapDispatch` will be run once before the component is connected, and `mapState` run with each store update. It accomodates multiple Redux stores by providing a third argument

```javascript
import { LightningElement, api } from 'lwc';
import { ConnectMixin } from 'c/store';
import { actions } from 'c/exampleAppService';

const mapState = state => {
    return {
        activeContacts: state.contacts // Maps state values to component properties
    };
};

const mapDispatch = {
    addNewContact: actions.addNewContact // Binds action creators to component properties
};

class ActiveList extends LightningElement {
    activeContacts = [];
    addNewContact = () => {};

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
const mapState = state => {
    const memoContacts = memoize(contacts => {
        // do expensive operation here
        return activeContacts;
    });

    return state => {
        activeContacts: memoContacts(state.contacts); // run only if state.contacts is updated
    };
};
```

### mapDispatch

`mapDispatch` is used to apply action creators for use directly on your component. It accepts either a plain object:

```javascript
const mapDispatch = {
    addNewContact: actions.addNewContact // Binds action creators to component properties
};
```

or a function that is provided with the Redux `dispatch` method and returns a plain object:

```javascript
const mapDispatch = dispatch => {
    return {
        addNewContact: name => dispatch({ type: 'ADD_CONTACT', payload: name })
    };
};
```

## Testing

-   `emitStore` is available during unit tests to force the mocked Redux store to emit a new state. This state will be provided to the component prior to it's `connectedCallback` lifecycle method.
-   Unit tests for store-connected components should generally not test store/state interaction, merely set the values directly and test render behavior.

```javascript
import { emitStore } from 'c/store';

// Force test store to emit a new state
emitStore({
    records: [1, 2, 3]
});

const element = createElement('c-active-list', { is: ActiveList });
return Promise.resolve()
    .then(() => {
        const items = element.shadowRoot.querySelectorAll('li');
        expect(items.length).toEqual(3);

        emitStore({
            records: [1, 2]
        });
    })
    .then(() => {
        const items = element.shadowRoot.querySelectorAll('li');
        expect(items.length).toEqual(2);
    });
```

Test action creators/reducers separately.

```javascript
it('should correctly add a contact', () => {
    const oldState = {
        contacts: []
    };

    expect(
        reducer(oldState, {
            type: 'ADD_CONTACT',
            payload: 'Lucy'
        })
    ).toMatchObject({
        contacts: ['Lucy']
    });
});
```
