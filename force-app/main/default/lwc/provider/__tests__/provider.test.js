import { createElement } from 'lwc';
import { clearDOM, flushPromises } from 'c/testUtils';
import Provider from 'c/provider';

import { initStore } from 'c/store';

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

jest.mock('c/store', () => {
  return {
    initStore: jest.fn(),
  }
});

describe('c-provider', () => {

  afterEach(() => {
    clearDOM();
  });

  it('Fires store initializer with correct values', () => {
    const REDUCER = jest.fn();
    const KEY = 'store-name';

    const provider = createElement('c-provider', { is: Provider });
    provider.reducer = REDUCER;
    provider.storeKey = KEY;
    document.body.appendChild(provider);

    return flushPromises()
      .then(() => {
        expect(initStore).toHaveBeenCalledWith(
          REDUCER,
          expect.objectContaining({
            storeKey: KEY
          })
        );
      })
  });

});
