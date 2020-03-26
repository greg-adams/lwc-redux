import { createElement } from 'lwc';
import { clearDOM, flushPromises } from 'c/testUtils';
import ActiveList from 'c/activeList';
import { actions, reducer } from 'c/exampleAppService';

describe('c-active-list', () => {
  afterEach(() => {
    clearDOM();
  });

  it('correctly calls action creator', () => {
    const handler = jest.fn();

    const element = createElement('c-active-list', { is: ActiveList });
    element.addNewContact = handler;

    document.body.appendChild(element);
    return Promise.resolve()
      .then(() => {
        element.shadowRoot.querySelector('[data-add-id]').click();

        // Test action creator individually
        expect(handler).toHaveBeenCalled();
      })
  });


  // Store values are only injected, so we should test component itself for rendering behavior
  it('correctly handles rendering store values', () => {
    const CONTACTS = [
      {
        name: 'Test',
        id: '1',
      }
    ];

    const element = createElement('c-active-list', { is: ActiveList });
    element.contacts = CONTACTS;

    document.body.appendChild(element);
    return Promise.resolve()
      .then(() => {
        const items = element.shadowRoot.querySelectorAll('li');
        expect(items.length).toEqual(CONTACTS.length);
      })
  });

});
