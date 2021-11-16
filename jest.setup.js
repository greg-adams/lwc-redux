/*
 *  Store is stored internally in c/store
 *  Mock single store here for teardown/dispatch
 */
let mockStore = null; // "mock*" whitelisted by Jest

function genStore() {
    let listeners = [];
    let state = null;

    return {
        getState() {
            return state;
        },
    
        subscribe (cb) {
            if (typeof cb === 'function') {
                listeners.push(cb)
            }
    
            return () => {
                const index = listeners.indexOf(cb)
    
                if (index === -1) {
                    return
                }
    
                listeners.splice(index, 1)
            }
        },
    
        dispatch: jest.fn(),

        emit(val) {
            state = val;
            listeners.forEach((cb) => {
                cb(state);
            })
        }
    }
    
}


jest.mock('c/store', () => {
    let storeModule = Object.assign({}, jest.requireActual('c/store').default, {
        getStore: () => {
            return mockStore;
        },
        
        emitStore: (emitVal) => {
            mockStore.emit(emitVal);
        }
    })
    
    return storeModule;
});

beforeAll(() => {
    global.Redux = require('redux');
    global.ReduxThunk = require('redux-thunk');
})

beforeEach(() => {
    mockStore = genStore();
})