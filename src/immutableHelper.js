const { fromJS } = require('immutable');

export const convertStateToImmutable = state => {
  if (state === undefined) {
    return state;
  }
  return Object.keys(state).reduce((map, key) => {
    map[key] = fromJS(state[key], key);
    return map;
  }, {});
};

export const covertImmutableStateToJS = state => {
  if (state === undefined) {
    return {};
  }
  return Object.keys(state).reduce((map, key) => {
    map[key] = state[key].toJS();
    return map;
  }, {});
};

module.exports = {
  inbound: convertStateToImmutable,
  outbound: covertImmutableStateToJS
};
