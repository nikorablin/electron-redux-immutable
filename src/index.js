let electronEnhancer; // eslint-disable-line import/no-mutable-exports
// let dispatch;

if (process.type === 'renderer') {
  electronEnhancer = require('./rendererEnhancer'); // eslint-disable-line global-require
  // dispatch = require('./enhanceRendererDispatch').default; // eslint-disable-line global-require
} else {
  electronEnhancer = require('./mainEnhancer'); // eslint-disable-line global-require
  // dispatch = require('./enhanceMainDispatch').default; // eslint-disable-line global-require
}

// export const enhanceDispatch = dispatch;

module.exports = electronEnhancer;
