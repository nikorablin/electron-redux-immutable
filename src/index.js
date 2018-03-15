let enhancer; // eslint-disable-line import/no-mutable-exports

if (process.type === 'renderer') {
  enhancer = require('./rendererEnhancer').default; // eslint-disable-line global-require
} else {
  enhancer = require('./mainEnhancer').default; // eslint-disable-line global-require
}

export { default as enhanceMainDispatch } from './enhanceMainDispatch';
export { default as enchanceRendererDispatch } from './enhanceRendererDispatch';

export default enhancer;
