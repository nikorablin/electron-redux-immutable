import { ipcMain } from 'electron';
import { covertImmutableStateToJS } from './immutableHelper';

export const enhanceMainDispatch = (store, options = {}) => {
  const transform = options.transform || covertImmutableStateToJS;
  global.getReduxState = () => JSON.stringify(transform(global.state));

  ipcMain.on('renderer--dispatch', (event, actionJSON) => {
    const action = JSON.parse(actionJSON);
    store.dispatch({ ...action, clientId: event.sender.getId() });
  });
};

export default enhanceMainDispatch;
