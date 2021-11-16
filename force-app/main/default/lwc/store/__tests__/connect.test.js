import { createElement, api, LightningElement } from 'lwc';
import { clearDOM } from 'c/testUtils';
import { ConnectMixin } from '../connect';

const baseDisconnected = jest.fn();
const baseConnected = jest.fn();

class Component extends LightningElement {
    @api records = [];
    @api fireAction = () => {};

    connectedCallback() {
        baseConnected();
    }

    disconnectedCallback() {
        baseDisconnected();
    }
}

beforeAll(() => {
    global.Redux = require('redux');
    global.ReduxThunk = require('redux-thunk');
});

/*
 *  Store is stored internally in c/store
 *  Mock single store here for teardown/dispatch
 */
let mockStore = null; // "mock*" whitelisted by Jest

jest.mock('c/store', () => {
    return {
        initStore: jest.fn(),
        getStore: () => {
            return mockStore;
        }
    };
});

beforeEach(() => {
    mockStore = null;
});

afterEach(() => {
    clearDOM();
});

describe('ConnectMixin', () => {
    it('Runs mapState/mapDispatch on initialize', () => {
        mockStore = global.Redux.createStore(() => ({ records: [1, 2] }));

        const mapState = jest.fn(state => {
            return {
                records: state.records
            };
        });

        const mapDispatch = {
            fireAction: jest.fn(() => ({ type: 'ADD_RECORD' }))
        };

        const TestComponent = ConnectMixin(mapState, mapDispatch)(Component);
        const testCmpEl = createElement('c-test-component', { is: TestComponent });

        document.body.appendChild(testCmpEl);

        return Promise.resolve().then(() => {
            // state
            expect(mapState).toHaveBeenCalledTimes(1);
            expect(testCmpEl.records).toEqual([1, 2]);

            // dispatch
            expect(testCmpEl.fireAction()).toEqual({ type: 'ADD_RECORD' });
        });
    });

    it('Subscribes to store updates', () => {
        mockStore = global.Redux.createStore((state = [], action) => {
            return action.type === 'APPEND' ? state.concat(action.payload) : state;
        });

        const mapState = jest.fn(state => {
            return {
                records: state
            };
        });

        const TestComponent = ConnectMixin(mapState, null)(Component);
        const testCmpEl = createElement('c-test-component', { is: TestComponent });

        document.body.appendChild(testCmpEl);

        return Promise.resolve().then(() => {
            expect(mapState).toHaveBeenCalledTimes(1);
            expect(testCmpEl.records).toEqual([]);

            mockStore.dispatch({ type: 'APPEND', payload: 'a' });

            expect(mapState).toHaveBeenCalledTimes(2);
            expect(testCmpEl.records).toEqual(['a']);

            mockStore.dispatch({ type: 'APPEND', payload: 'b' });

            expect(mapState).toHaveBeenCalledTimes(3);
            expect(testCmpEl.records).toEqual(['a', 'b']);
        });
    });

    it('does not subscribe or apply state when mapState not provided', () => {
        mockStore = global.Redux.createStore(() => ({ records: [1, 2] }));

        mockStore.subscribe = jest.fn();

        const mapDispatch = {
            fireAction: jest.fn()
        };

        const TestComponent = ConnectMixin(null, mapDispatch)(Component);
        const testCmpEl = createElement('c-test-component', { is: TestComponent });

        document.body.appendChild(testCmpEl);

        return Promise.resolve().then(() => {
            expect(testCmpEl.records).not.toEqual([1, 2]);
            expect(mockStore.subscribe).not.toHaveBeenCalled();
        });
    });

    it('Correctly binds actions on component', () => {
        const dispatchedActions = [];

        mockStore = global.Redux.createStore((state = [], action) => {
            dispatchedActions.push(action.type);

            return state;
        });

        const mapDispatch = {
            fireAction: jest.fn(() => ({ type: 'TEST_ACTION' }))
        };

        const TestComponent = ConnectMixin(null, mapDispatch)(Component);
        const testCmpEl = createElement('c-test-component', { is: TestComponent });

        document.body.appendChild(testCmpEl);

        return Promise.resolve().then(() => {
            testCmpEl.fireAction();

            expect(mapDispatch.fireAction).toHaveBeenCalledTimes(1);
            expect(dispatchedActions).toContain('TEST_ACTION');
        });
    });

    it('Should unsubscribe to store updates on removal', () => {
        mockStore = global.Redux.createStore(() => ({ records: [] }));

        let unSubscribeSpy = jest.fn();

        // Keep track of unsubscribe by wrapping subscribe()
        const subscribe = mockStore.subscribe;

        mockStore.subscribe = listener => {
            unSubscribeSpy.mockImplementation(subscribe(listener));

            return () => unSubscribeSpy();
        };

        const mapState = jest.fn(state => {
            return {
                records: state.records
            };
        });

        const TestComponent = ConnectMixin(mapState, null)(Component);
        const testCmpEl = createElement('c-test-component', { is: TestComponent });

        document.body.appendChild(testCmpEl);

        return Promise.resolve().then(() => {
            expect(mapState).toHaveBeenCalledTimes(1);

            // Disconnect cmp
            document.body.removeChild(testCmpEl);

            expect(unSubscribeSpy).toHaveBeenCalled();

            // Ensure new state emitted
            mockStore.dispatch({ type: 'TEST_ACTION' });

            expect(mapState).toHaveBeenCalledTimes(1);
        });
    });

    it('Should call base class lifecycle methods', () => {
        mockStore = global.Redux.createStore(() => ({ records: [] }));

        const mapState = jest.fn(state => {
            return {
                records: state.records
            };
        });

        const TestComponent = ConnectMixin(mapState, null)(Component);
        const testCmpEl = createElement('c-test-component', { is: TestComponent });

        document.body.appendChild(testCmpEl);

        return Promise.resolve().then(() => {
            expect(mapState).toHaveBeenCalledTimes(1);
            expect(baseConnected).toHaveBeenCalledTimes(1);

            // Disconnect cmp
            document.body.removeChild(testCmpEl);

            expect(baseDisconnected).toHaveBeenCalledTimes(1);
        });
    });

    it('Should throw an error if rendered without provider or resource loaded', () => {
        const spy = jest.spyOn(global.console, 'error').mockImplementation(() => {});

        const mapState = jest.fn(state => ({ records: state.records }));

        const TestComponent = ConnectMixin(mapState, null)(Component);
        const testCmpEl = createElement('c-test-component', { is: TestComponent });

        document.body.appendChild(testCmpEl);

        expect(spy).toHaveBeenCalledWith(expect.stringMatching(/loaded before Provider/));
        spy.mockRestore();
    });
});
