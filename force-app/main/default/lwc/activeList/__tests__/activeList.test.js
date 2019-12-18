import { createElement } from 'lwc';
import { clearDOM, flushPromises } from 'c/testUtils';
import ActiveList from 'c/activeList';
import Provider from 'c/provider';

import { actions } from 'c/exampleAppService';
import { createStore } from 'redux';

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

const initialState = {
  ui: {
    contacts: [],
  }
}

jest.mock('c/exampleAppService', () => {
  return {
    actions: {
      addNewContact: jest.fn(() => ({ type: null }))
    }
  }
});

describe('c-active-list', () => {
  afterEach(() => {
    clearDOM();
  });

  it('correctly calls action creator', () => {
    const testStore = createStore(() => ({ ...initialState }));
    const provider = createElement('c-provider', { is: Provider });
    provider.store = testStore;
    document.body.appendChild(provider);

    const aList = createElement('c-active-list', { is: ActiveList });
    return flushPromises()
      .then(() => provider.appendChild(aList))
      .then(() => {
        aList.shadowRoot.querySelector('[data-add-id]').click();
      })
      .then(() => {
        // Test action creator individually
        expect(actions.addNewContact).toHaveBeenCalled();
      })
  });

  it('correctly handles non-store behavior', () => {
    const testStore = createStore(() => ({ ...initialState }));
    const provider = createElement('c-provider', { is: Provider });
    provider.store = testStore;
    document.body.appendChild(provider);

    const HEADER = 'My Header';

    const aList = createElement('c-active-list', { is: ActiveList });
    aList.name = HEADER;

    return flushPromises()
      .then(() => provider.appendChild(aList))
      .then(() => {
        const header = aList.shadowRoot.querySelector('[data-header-id]');
        expect(header.textContent).toEqual(HEADER);
      })
  });


  // Redux only injects values, so we should test component for rendering behavior
  it('correctly handles rendering store values', () => {
    const testStore = createStore(() => ({ ...initialState }));
    const provider = createElement('c-provider', { is: Provider });
    provider.store = testStore;
    document.body.appendChild(provider);

    const aList = createElement('c-active-list', { is: ActiveList });

    return flushPromises()
      .then(() => provider.appendChild(aList))
      .then(() => {
        aList.contacts = [
          {
            name: 'Test',
            id: '1',
          }
        ];
      })
      .then(() => {
        const items = aList.shadowRoot.querySelectorAll('li');
        expect(items.length).toEqual(1);
      })
  });

});
