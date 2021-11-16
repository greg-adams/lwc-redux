let stores = {};

export function initStore(reducer, { storeKey = 'defaultRedux' } = {}) {
    const { createStore, applyMiddleware, combineReducers } = window.Redux;
    const ReduxThunk = window.ReduxThunk.default;

    const rootReducer = typeof reducer === 'function' ? reducer : combineReducers(reducer);

    // eslint-disable-next-line no-prototype-builtins
    if (!stores.hasOwnProperty(storeKey) || process.env.NODE_ENV !== 'production') {
        stores[storeKey] = createStore(rootReducer, applyMiddleware(ReduxThunk));
    }
}

export function getStore(keyName = 'defaultRedux') {
    return stores[keyName] || null;
}
