const { ipcMain } = require('electron');
const immutableTransformer = require('./immutableHelper');

module.exports = options => storeCreator => (reducer, initialState, enhancer) => {
  let clients = [];
  const store = storeCreator(reducer, initialState, enhancer);
  const { dispatch } = store;

  ipcMain.on('client--registered', ({ sender }) => {
    const id = sender.getId();
    const browserWindow = sender.getOwnerBrowserWindow();
    const index = clients.findIndex(client => client.windowId === browserWindow.id);
    clients = [
      ...clients.slice(0, Math.max(0, index)),
      { id, windowId: browserWindow.id, browserWindow, webContents: sender },
      ...clients.slice(index + 1)
    ];
  });

  store.dispatch = action => {
    clients.filter(client => client.id !== action.clientId).forEach(({ windowId, webContents }) => {
      if (webContents.isDestroyed() || webContents.isCrashed()) {
        const index = clients.findIndex(client => client.windowId === windowId);
        clients = [...clients.slice(0, index), ...clients.slice(index + 1)];
        return;
      }
      webContents.send('main--dispatch', JSON.stringify(action));
    });
    return dispatch(action);
  };

  store.addObservers = (...observers) =>
    observers.map(({ onChange, select = state => state }) => {
      let currentState;

      const handleChange = () => {
        const nextState = select(store.getState());
        if (nextState !== currentState) {
          const prevState = currentState;
          currentState = nextState;
          onChange(prevState, nextState);
        }
      };

      handleChange();
      return store.subscribe(handleChange);
    });

  const transformer = options.transform || immutableTransformer;
  global.getReduxState = () => JSON.stringify(transformer.outbound(global.state, options.types));

  ipcMain.on('renderer--dispatch', (event, actionJSON) => {
    const action = JSON.parse(actionJSON);
    store.dispatch({ ...action, clientId: event.sender.getId() });
  });

  return store;
};
