/* eslint-disable no-unused-vars */
let stores = {};

export function initStore(testStore, reducers, {
  storeKey = 'defaultRedux',
} = {}) {
  if (testStore) {
    stores[storeKey] = {
      ...testStore
    }
  } else {
    const {
      createStore,
      applyMiddleware,
      combineReducers
    } = window.Redux;
    const ReduxThunk = window.ReduxThunk.default;

    const rootReducer = typeof reducers === 'function' ?
      reducers :
      combineReducers(reducers);

    stores[storeKey] = createStore(
      rootReducer,
      applyMiddleware(ReduxThunk)
    );
  }
}

export function getStore(keyName = 'defaultRedux') {
  return stores[keyName] || null;
}
