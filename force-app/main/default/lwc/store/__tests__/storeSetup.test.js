import { clearDOM } from 'c/testUtils';

jest.mock(
    'lightning/platformResourceLoader',
    () => {
        return {
            loadScript: jest.fn()
        };
    },
    { virtual: true }
);

beforeAll(() => {
    global.Redux = require('redux');
    global.ReduxThunk = require('redux-thunk');
});

describe('c-store', () => {
    let store;

    beforeEach(() => {
        store = jest.requireActual('c/store');
    });

    afterEach(() => {
        clearDOM();
        jest.resetModules(); // clear "c/store"
    });

    it('Initializes single store', () => {
        store.initStore(() => ['value']);

        // Store-like values
        expect(store.getStore().getState()).toEqual(['value']);
    });

    it('Initializes multiple stores', () => {
        store.initStore(() => ({}), {
            storeKey: 'store1'
        });

        store.initStore(() => ({}), {
            storeKey: 'store2'
        });

        expect(store.getStore('store1') !== store.getStore('store2')).toBe(true);
    });

    it('Initializes store correctly if provided sliced store reducers', () => {
        store.initStore({
            slice1: () => ({}),
            slice2: () => ({})
        });

        expect(store.getStore().getState()).toEqual({
            slice1: {},
            slice2: {}
        });
    });
});
