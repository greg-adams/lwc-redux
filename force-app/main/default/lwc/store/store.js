/* eslint-disable no-unused-vars */
let stores = {};

export function initStore(reducers, {
  storeKey = 'redux',
} = {}) {
  const {
    createStore,
    applyMiddleware,
    combineReducers
  } = window.Redux;
  const ReduxThunk = window.ReduxThunk.default;

  const rootReducer = combineReducers(reducers);

  stores[storeKey] = createStore(
    reducers,
    applyMiddleware(ReduxThunk)
  );
}

export function getStore(keyName = 'redux') {
  return stores[keyName] || null;
}
