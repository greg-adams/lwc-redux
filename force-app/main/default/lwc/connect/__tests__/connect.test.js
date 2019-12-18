import { createElement, api, LightningElement } from 'lwc';
import { clearDOM, flushPromises } from 'c/testUtils';
import Provider from 'c/provider';
import { connect } from 'c/connect';
import { createStore } from 'redux';

class TestComponent extends LightningElement {
  @api records = [];
  @api testAction = () => { };
}

jest.mock(
  'lightning/platformResourceLoader',
  () => {
    return {
      loadScript() {
        return new Promise((resolve) => {
          global.Redux = require('../../../staticresources/redux');
          global.ReduxThunk = require('../../../staticresources/reduxThunk');
          resolve();
        });
      }
    };
  },
  { virtual: true }
);

describe('c-connect', () => {
  afterEach(() => {
    clearDOM();
  });


  it('Runs mapState/mapDispatch on initialize', () => {
    const testStore = createStore(() => ({ records: [1, 2, 3] }));

    const provider = createElement('c-provider', { is: Provider });
    provider.store = testStore;
    document.body.appendChild(provider);

    let testCmp = createElement('c-test-component', { is: TestComponent });
    return flushPromises()
      .then(() => provider.appendChild(testCmp))
      .then(() => {
        const mapState = jest.fn((state) => {
          return {
            records: state.records
          }
        })

        const mapDispatch = {
          addRecord: jest.fn(() => ({ type: 'ADD_RECORD' })),
        };

        connect(mapState, mapDispatch)(testCmp);

        expect(mapState).toHaveBeenCalledTimes(1);
        expect(testCmp.records).toEqual([1, 2, 3]);

        expect(testCmp.addRecord()).toEqual({ type: 'ADD_RECORD' });
      })
  });


  it('Subscribes to store updates', () => {
    const testStore = createStore((state = [], action) => {
      return action.type === 'APPEND' ? state.concat(action.payload) : state;
    });

    const provider = createElement('c-provider', { is: Provider });
    provider.store = testStore;
    document.body.appendChild(provider);

    let testCmp = createElement('c-test-component', { is: TestComponent });
    return flushPromises()
      .then(() => provider.appendChild(testCmp))
      .then(() => {
        const mapState = jest.fn((state) => {
          return {
            records: state
          }
        });

        connect(mapState, null)(testCmp);
        expect(mapState).toHaveBeenCalledTimes(1);
        expect(testCmp.records).toEqual([]);

        testStore.dispatch({ type: 'APPEND', payload: 'a' });

        expect(mapState).toHaveBeenCalledTimes(2);
        expect(testCmp.records).toEqual(['a']);

        testStore.dispatch({ type: 'APPEND', payload: 'b' });

        expect(mapState).toHaveBeenCalledTimes(3);
        expect(testCmp.records).toEqual(['a', 'b']);
      })
  });


  it('does not apply state when mapState not provided', () => {
    const testStore = createStore(() => ({ records: [1, 2, 3] }));

    const provider = createElement('c-provider', { is: Provider });
    provider.store = testStore;
    document.body.appendChild(provider);

    let testCmp = createElement('c-test-component', { is: TestComponent });
    return flushPromises()
      .then(() => provider.appendChild(testCmp))
      .then(() => {
        const mapDispatch = {
          testAction: jest.fn(),
        };

        connect(null, mapDispatch)(testCmp);

        expect(testCmp.records).not.toEqual([1, 2, 3]);
      })
  });


  it('Correctly binds actions', () => {
    let dispatchedActions = [];
    const testStore = createStore((state = {}, action) => {
      dispatchedActions.push(action.type);
      return state;
    });

    const provider = createElement('c-provider', { is: Provider });
    provider.store = testStore;
    document.body.appendChild(provider);

    let testCmp = createElement('c-test-component', { is: TestComponent });
    return flushPromises()
      .then(() => provider.appendChild(testCmp))
      .then(() => {
        const mapDispatch = {
          testAction: jest.fn(() => ({ type: 'TEST_ACTION' })),
        };

        connect(null, mapDispatch)(testCmp);

        testCmp.testAction();

        expect(mapDispatch.testAction).toHaveBeenCalledTimes(1);
        expect(dispatchedActions).toContain('TEST_ACTION');
      })
  });


  it('Unsubscribes to store updates on dispatch', () => {
    const testStore = createStore(() => ({ records: [1, 2, 3] }));

    const provider = createElement('c-provider', { is: Provider });
    provider.store = testStore;
    document.body.appendChild(provider);

    let testCmp = createElement('c-test-component', { is: TestComponent });
    return flushPromises()
      .then(() => provider.appendChild(testCmp))
      .then(() => {
        const mapState = jest.fn((state) => {
          return {
            records: state.records
          }
        })

        connect(mapState, null)(testCmp);
        expect(mapState).toHaveBeenCalledTimes(1);

        // Disconnect cmp
        provider.removeChild(testCmp);

        // Ensure new state
        testStore.dispatch({ type: 'TEST_ACTION' });

        expect(mapState).toHaveBeenCalledTimes(1);

        provider.appendChild(testCmp);
        connect(mapState, null)(testCmp);
        expect(mapState).toHaveBeenCalledTimes(2);
      })
  });

});
