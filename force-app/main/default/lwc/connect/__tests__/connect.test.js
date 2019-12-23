import { createElement, api, LightningElement } from 'lwc';
import { clearDOM, flushPromises } from 'c/testUtils';
import Provider from 'c/provider';
import { ConnectMixin } from 'c/connect';

jest.mock(
  'lightning/platformResourceLoader',
  () => {
    return {
      loadScript() {
        return new Promise((resolve) => {
          global.Redux = require('redux');
          global.ReduxThunk = require('redux-thunk');
          resolve();
        });
      }
    };
  },
  { virtual: true }
);

const baseDisconnected = jest.fn();
const baseConnected = jest.fn();

class Component extends LightningElement {
  @api records = [];
  @api testAction = () => { };

  connectedCallback() {
    baseConnected();
  }

  disconnectedCallback() {
    baseDisconnected();
  }
}


/*
*  Store is stored internally in c/store
*  Mock single store here for teardown/dispatch
*/
let mockStore = null; // "mock*" whitelisted by Jest

jest.mock('redux',
  () => {
    const Redux = jest.requireActual('redux');
    const createStore = Redux.createStore;
    Redux.createStore = (reducer, state) => {
      mockStore = createStore(reducer, state);
      return mockStore;
    }
    return Redux;
  })

jest.mock('c/store',
  () => {
    const storeModule = jest.requireActual('c/store');
    storeModule.getStore = () => {
      return mockStore;
    }
    return storeModule;
  },
);

describe('c-connect', () => {

  beforeEach(() => {
    mockStore = null;
  })

  afterEach(() => {
    clearDOM();
  });

  it('Runs mapState/mapDispatch on initialize', () => {
    const provider = createElement('c-provider', { is: Provider });
    provider.reducer = () => ({ records: [1, 2] });
    document.body.appendChild(provider);

    const mapState = jest.fn((state) => {
      return {
        records: state.records
      }
    })

    const mapDispatch = {
      testAction: jest.fn(() => ({ type: 'ADD_RECORD' })),
    };

    const TestComponent = ConnectMixin(mapState, mapDispatch)(Component);
    const testCmpEl = createElement('c-test-component', { is: TestComponent });

    return flushPromises()
      .then(() => provider.appendChild(testCmpEl))
      .then(() => {
        // state
        expect(mapState).toHaveBeenCalledTimes(1);
        expect(testCmpEl.records).toEqual([1, 2]);

        // dispatch
        expect(testCmpEl.testAction()).toEqual({ type: 'ADD_RECORD' });
      })
  });


  it('Subscribes to store updates', () => {
    const provider = createElement('c-provider', { is: Provider });
    provider.reducer = (state = [], action) => {
      return action.type === 'APPEND' ? state.concat(action.payload) : state;
    };

    document.body.appendChild(provider);

    const mapState = jest.fn((state) => {
      return {
        records: state
      }
    });

    const TestComponent = ConnectMixin(mapState, null)(Component);
    const testCmpEl = createElement('c-test-component', { is: TestComponent });

    return flushPromises()
      .then(() => provider.appendChild(testCmpEl))
      .then(() => {
        expect(mapState).toHaveBeenCalledTimes(1);
        expect(testCmpEl.records).toEqual([]);

        mockStore.dispatch({ type: 'APPEND', payload: 'a' });

        expect(mapState).toHaveBeenCalledTimes(2);
        expect(testCmpEl.records).toEqual(['a']);

        mockStore.dispatch({ type: 'APPEND', payload: 'b' });

        expect(mapState).toHaveBeenCalledTimes(3);
        expect(testCmpEl.records).toEqual(['a', 'b']);
      })
  });


  it('does not subscribe or apply state when mapState not provided', () => {
    const provider = createElement('c-provider', { is: Provider });
    provider.reducer = () => ({ records: [1, 2] });
    document.body.appendChild(provider);

    const mapDispatch = {
      testAction: jest.fn(),
    };

    const TestComponent = ConnectMixin(null, mapDispatch)(Component);
    const testCmpEl = createElement('c-test-component', { is: TestComponent });

    return flushPromises()
      .then(() => {
        mockStore.subscribe = jest.fn();
      })
      .then(() => provider.appendChild(testCmpEl))
      .then(() => {
        expect(testCmpEl.records).not.toEqual([1, 2]);
        expect(mockStore.subscribe).not.toHaveBeenCalled();
      })
  });


  it('Correctly binds actions', () => {
    const dispatchedActions = [];
    const provider = createElement('c-provider', { is: Provider });
    provider.reducer = (state = [], action) => {
      dispatchedActions.push(action.type);
      return state;
    };
    document.body.appendChild(provider);

    const mapDispatch = {
      testAction: jest.fn(() => ({ type: 'TEST_ACTION' })),
    };

    const TestComponent = ConnectMixin(null, mapDispatch)(Component);
    const testCmpEl = createElement('c-test-component', { is: TestComponent });
    return flushPromises()
      .then(() => provider.appendChild(testCmpEl))
      .then(() => {
        testCmpEl.testAction();

        expect(mapDispatch.testAction).toHaveBeenCalledTimes(1);
        expect(dispatchedActions).toContain('TEST_ACTION');
      })
  });


  it('Unsubscribes to store updates on removal', () => {
    const provider = createElement('c-provider', { is: Provider });
    provider.reducer = () => ({ records: [1, 2] });
    document.body.appendChild(provider);

    const mapState = jest.fn((state) => {
      return {
        records: state.records
      }
    })

    const TestComponent = ConnectMixin(mapState, null)(Component);
    const testCmpEl = createElement('c-test-component', { is: TestComponent });

    let unSubscribeSpy = jest.fn();

    return flushPromises()
      .then(() => {
        // Keep track of unsubscribe by wrapping subscribe()
        const subscribe = mockStore.subscribe;
        mockStore.subscribe = listener => {
          unSubscribeSpy.mockImplementation(subscribe(listener));
          return () => unSubscribeSpy()
        }
      })
      .then(() => provider.appendChild(testCmpEl))
      .then(() => {
        expect(mapState).toHaveBeenCalledTimes(1);

        // Disconnect cmp
        provider.removeChild(testCmpEl);

        expect(unSubscribeSpy).toHaveBeenCalled();

        // Ensure new state emitted
        mockStore.dispatch({ type: 'TEST_ACTION' });

        expect(mapState).toHaveBeenCalledTimes(1);
      })
  });

  it('Calls base class lifecycle methods', () => {
    const provider = createElement('c-provider', { is: Provider });
    provider.reducer = () => ({ records: [1, 2] });
    document.body.appendChild(provider);

    const mapState = jest.fn((state) => {
      return {
        records: state.records
      }
    })

    const TestComponent = ConnectMixin(mapState, null)(Component);
    const testCmpEl = createElement('c-test-component', { is: TestComponent });

    return flushPromises()
      .then(() => provider.appendChild(testCmpEl))
      .then(() => {
        expect(mapState).toHaveBeenCalledTimes(1);
        expect(baseConnected).toHaveBeenCalledTimes(1);

        // Disconnect cmp
        provider.removeChild(testCmpEl);

        expect(baseDisconnected).toHaveBeenCalledTimes(1);
      })
  });

  it('should throw an error if rendered without provider or resource loaded', () => {
    const spy = jest.spyOn(global.console, 'error').mockImplementation(() => { });

    const mapState = jest.fn((state) => ({ records: state.records }));

    const TestComponent = ConnectMixin(mapState, null)(Component);
    const testCmpEl = createElement('c-test-component', { is: TestComponent });

    document.body.appendChild(testCmpEl);

    expect(spy).toHaveBeenCalledWith(expect.stringMatching(/loaded before Provider/));
    spy.mockRestore();
  })


});
