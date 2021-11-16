import { createElement } from 'lwc';
import { clearDOM } from 'c/testUtils';
import ActiveList from 'c/activeList';
import { emitStore } from 'c/store';
import { actions } from 'c/exampleAppService';

jest.mock('c/exampleAppService', () => {
    return {
        actions: {
            addNewContact: jest.fn()
        }
    };
});

afterEach(() => {
    clearDOM();
});

describe('c-active-list', () => {
    it('correctly calls action creator', () => {
        const STATE = {
            ui: {
                header: '',
                contacts: [
                    {
                        name: 'Test',
                        id: '1',
                    }
                ]
            }
        };

        emitStore(STATE);

        const element = createElement('c-active-list', { is: ActiveList });

        document.body.appendChild(element);

        return Promise.resolve()
            .then(() => {
                element.shadowRoot.querySelector('[data-add-id]').click();

                // Test action creator individually
                expect(actions.addNewContact).toHaveBeenCalled();
            });
    });


    // Store values are only injected, so we should test component itself for rendering behavior
    it('correctly handles rendering store values', () => {
        const STATE = {
            ui: {
                header: '',
                contacts: [
                    {
                        name: 'Test',
                        id: '1',
                    }
                ]
            }
        };

        emitStore(STATE);

        const element = createElement('c-active-list', { is: ActiveList });

        document.body.appendChild(element);

        return Promise.resolve()
            .then(() => {
                const items = element.shadowRoot.querySelectorAll('li');

                expect(items.length).toEqual(STATE.ui.contacts.length);

                STATE.ui.contacts = STATE.ui.contacts.concat({
                    name: 'test2',
                    id: '2'
                });

                emitStore(STATE);
            })
            .then(() => {
                const items = element.shadowRoot.querySelectorAll('li');

                expect(items.length).toEqual(STATE.ui.contacts.length);
            });
    });

});
