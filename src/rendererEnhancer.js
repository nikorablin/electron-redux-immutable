import { remote, ipcRenderer } from 'electron';
import immutableTransformer from './immutableHelper';

const rendererEnhancer = options => storeCreator => (reducer, initialState, enhancer) => {
  ipcRenderer.send('client--registered');
  const getReduxState = remote.getGlobal('getReduxState');

  const transformer = options.transform || immutableTransformer;

  const state = transformer.inbound(JSON.parse(getReduxState()));
  const store = storeCreator(reducer, state, enhancer);

  const { dispatch } = store;

  store.dispatch = action => {
    if (!action.forwarded && typeof action !== 'function') {
      requestIdleCallback(() => ipcRenderer.send('renderer--dispatch', JSON.stringify(action)));
    }
    return dispatch(action);
  };

  ipcRenderer.on('main--dispatch', (event, actionJSON) => {
    const action = JSON.parse(actionJSON);
    store.dispatch({ ...action, forwarded: true });
  });

  return store;
};

export default rendererEnhancer;
