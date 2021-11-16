import { createElement } from 'lwc';
import { clearDOM, flushPromises } from 'c/testUtils';
import Provider from 'c/provider';
import { initStore } from 'c/store';

jest.mock('c/store', () => {
    return {
        initStore: jest.fn()
    };
});

afterEach(() => {
    clearDOM();
});

describe('c-provider', () => {
    it('Fires store initializer with correct values', () => {
        const REDUCER = jest.fn();
        const KEY = 'store-name';

        const provider = createElement('c-provider', { is: Provider });

        provider.reducer = REDUCER;
        provider.storeKey = KEY;
        document.body.appendChild(provider);

        return flushPromises().then(() => {
            expect(initStore).toHaveBeenCalledWith(
                REDUCER,
                expect.objectContaining({
                    storeKey: KEY
                })
            );
        });
    });

    it('Does not load content until libraries are loaded', () => {
        const element = createElement('c-test-component', { is: Provider });

        document.body.appendChild(element);

        expect(element.shadowRoot.querySelector('slot')).toBeNull();

        return flushPromises().then(() => {
            expect(element.shadowRoot.querySelector('slot')).not.toBeNull();
        });
    });
});
