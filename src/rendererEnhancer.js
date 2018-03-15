import { remote, ipcRenderer } from 'electron';
import { convertStateToImmutable } from './immutableHelper';

const rendererEnhancer = () => storeCreator => (reducer, initialState, enhancer) => {
  ipcRenderer.send('client--registered');
  const getReduxState = remote.getGlobal('getReduxState');
  const state = convertStateToImmutable(JSON.parse(getReduxState()));
  const store = storeCreator(reducer, state, enhancer);

  const { dispatch } = store;

  store.dispatch = action => {
    if (!action.forwarded && typeof action !== 'function') {
      requestIdleCallback(() => ipcRenderer.send('renderer--dispatch', JSON.stringify(action)));
    }
    return dispatch(action);
  };

  return store;
};

export default rendererEnhancer;
