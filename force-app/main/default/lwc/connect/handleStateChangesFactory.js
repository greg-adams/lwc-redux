import shallowEqual from './shallowEqual';

function strictEqual(a, b) {
  return a === b;
}

export default function handleStateChangesFactory(store, {
  initMapStateToProps,
  initMapDispatchToProps,
  initMergeProps,
  areStatesEqual = strictEqual,
  areStatePropsEqual = shallowEqual,
  ...options
} = {}) {
  const mapStateToProps = initMapStateToProps(store.dispatch, options);
  const mapDispatchToProps = initMapDispatchToProps(store.dispatch, options);
  const mergeProps = initMergeProps(store.dispatch, options);

  let hasRunAtLeastOnce = false;
  let state;
  let stateProps;
  let dispatchProps;
  let mergedProps;

  function handleFirstCall(firstState, ownProps) {
    state = firstState;
    stateProps = mapStateToProps(state, ownProps);
    dispatchProps = mapDispatchToProps(store.dispatch);
    hasRunAtLeastOnce = true;
    return mergeProps(stateProps, dispatchProps);
  }

  function handleSubsequentCalls(nextState, ownProps) {
    const stateChanged = !areStatesEqual(nextState, state);
    state = nextState;

    if (stateChanged) {
      return handleNewState(ownProps);
    }
    return mergedProps;
  }

  function handleNewState(ownProps) {
    const nextStateProps = mapStateToProps(state, ownProps);
    const statePropsChanged = !areStatePropsEqual(nextStateProps, stateProps);
    stateProps = nextStateProps;

    if (statePropsChanged) {
      return mergeProps(stateProps, dispatchProps);
    }

    return mergedProps;
  }

  return function (component) {
    return function handleStateChanges() {
      if (component && !component.template.isConnected && component.unsubscribe) {
        component.unsubscribe();
        return;
      }

      const nextState = store.getState();
      const nextMergedProps = hasRunAtLeastOnce
        ? handleSubsequentCalls(nextState, component)
        : handleFirstCall(nextState, component);

      if (!strictEqual(mergedProps, nextMergedProps)) {
        mergedProps = nextMergedProps;
        Object.entries(mergedProps).forEach(([key, value]) => {
          component[key] = value;
        });
      }
    }
  }
}