const { remote, ipcRenderer } = require('electron');
const immutableTransformer = require('./immutableHelper');

module.exports = options => storeCreator => (reducer, initialState, enhancer) => {
  ipcRenderer.send('client--registered');
  const getReduxState = remote.getGlobal('getReduxState');

  const transformer = options.transform || immutableTransformer;

  const state = transformer.inbound(JSON.parse(getReduxState()), options.types);
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
