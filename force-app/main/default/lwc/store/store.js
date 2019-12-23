let stores = {};

export function initStore(reducer, {
  storeKey = 'defaultRedux',
} = {}) {
  const {
    createStore,
    applyMiddleware,
    combineReducers
  } = window.Redux;
  const ReduxThunk = window.ReduxThunk.default;

  const rootReducer = typeof reducer === 'function' ?
    reducer :
    combineReducers(reducer);

  stores[storeKey] = createStore(
    rootReducer,
    applyMiddleware(ReduxThunk)
  );
}

export function getStore(keyName = 'defaultRedux') {
  return stores[keyName] || null;
}

export default {
  initStore,
  getStore
}
