import { clearDOM } from 'c/testUtils';
import { createStore } from 'redux';

describe('c-store', () => {
  let storeLib;

  beforeEach(() => {
    storeLib = require('c/store');

    global.Redux = require('../../../staticresources/redux');
    global.ReduxThunk = require('../../../staticresources/reduxThunk');
  });

  afterEach(() => {
    clearDOM();
    jest.resetModules(); // clear "c/store"
  });

  it('Initializes single store', () => {
    storeLib.initStore(
      null,
      () => (['a', 'b'])
    );

    // Store-like values
    expect(storeLib.getStore().getState()).toEqual(['a', 'b']);
  });

  it('Initializes provided store', () => {
    const testStore = createStore(() => ([1, 2, 3]));

    storeLib.initStore(
      testStore,
      null
    );

    expect(storeLib.getStore().getState()).toEqual(testStore.getState());
  });

  it('Initializes multiple stores', () => {
    storeLib.initStore(
      null,
      () => ({}),
      {
        storeKey: 'store1'
      }
    );

    storeLib.initStore(
      null,
      () => ({}),
      {
        storeKey: 'store2'
      }
    );

    expect(storeLib.getStore('store1') !== storeLib.getStore('store2')).toBe(true)
  });

});
