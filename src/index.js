let enhancer; // eslint-disable-line import/no-mutable-exports
let dispatch;

if (process.type === 'renderer') {
  enhancer = require('./rendererEnhancer').default; // eslint-disable-line global-require
  dispatch = require('./enhanceRendererDispatch').default; // eslint-disable-line global-require
} else {
  enhancer = require('./mainEnhancer').default; // eslint-disable-line global-require
  dispatch = require('./enhanceMainDispatch').default; // eslint-disable-line global-require
}

export const enhanceDispatch = dispatch;

export default enhancer;
