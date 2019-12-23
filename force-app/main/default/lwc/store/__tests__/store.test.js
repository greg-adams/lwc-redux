import { clearDOM } from 'c/testUtils';

describe('c-store', () => {
  let store;

  beforeEach(() => {
    store = require('c/store');

    global.Redux = require('redux');
    global.ReduxThunk = require('redux-thunk');
  });

  afterEach(() => {
    clearDOM();
    jest.resetModules(); // clear "c/store"
  });

  it('Initializes single store', () => {
    store.initStore(() => (['a', 'b']));

    // Store-like values
    expect(store.getStore().getState()).toEqual(['a', 'b']);
  });

  it('Initializes provided store', () => {
    store.initStore(() => ([1, 2]));

    expect(store.getStore().getState()).toEqual([1, 2]);
  });

  it('Initializes multiple stores', () => {
    store.initStore(
      () => ({}),
      {
        storeKey: 'store1'
      }
    );

    store.initStore(
      () => ({}),
      {
        storeKey: 'store2'
      }
    );

    expect(store.getStore('store1') !== store.getStore('store2')).toBe(true)
  });

});
