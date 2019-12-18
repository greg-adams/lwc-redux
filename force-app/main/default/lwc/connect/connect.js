import { getStore } from 'c/store';
import mapStateToPropsFactories from './mapStateToProps';
import mapDispatchToPropsFactories from './mapDispatchToProps';
import handleStateChangesFactory from './handleStateChangesFactory';

function defaultMergeProps(stateProps, dispatchProps) {
  return { ...stateProps, ...dispatchProps }
}

function match(arg, factories, name) {
  for (let i = factories.length - 1; i >= 0; i--) {
    const result = factories[i](arg)
    if (result) return result
  }

  return (dispatch, options) => {
    throw new Error(
      `Invalid value of type ${typeof arg} for ${name} argument when connecting component ${
      options.displayName
      }.`
    )
  }
}

export function connect(
  mapStateToProps,
  mapDispatchToProps,
  storeKey = 'defaultRedux'
) {
  if (!getStore(storeKey)) {
    // eslint-disable-next-line no-console
    console.error('Store not properly initialized or component loaded before Provider.');
    return () => { };
  }

  const initMapStateToProps = match(
    mapStateToProps,
    mapStateToPropsFactories,
    'mapStateToProps'
  );
  const initMapDispatchToProps = match(
    mapDispatchToProps,
    mapDispatchToPropsFactories,
    'mapDispatchToProps'
  );
  const initMergeProps = () => defaultMergeProps;

  return function (component) {
    const store = getStore(storeKey);
    const subscribe = store.subscribe;
    const unsubscribeKey = Symbol('Unsubscribe');

    if (mapStateToProps || mapDispatchToProps) {
      const stateHandler = handleStateChangesFactory(
        store,
        {
          initMapDispatchToProps,
          initMapStateToProps,
          initMergeProps,
          // eslint-disable-next-line no-undef
          displayName: process.env.NODE_ENV !== 'production' ? 'test-component' : component.template.host.tagName,
          unsubscribeKey,
        }
      )(component);
      stateHandler();

      // Only subscribe to store w/ mapState function
      if (mapStateToProps) {
        try {
          component[unsubscribeKey] = subscribe(stateHandler);
        } catch (e) {
          // fail silently
        }
      }
    }
  }
}