module.exports = {
  parser: 'babel-eslint',
  extends: ['airbnb', 'prettier'],
  plugins: ['prettier'],
  rules: {
    'comma-dangle': ['error', 'never'],
    'prettier/prettier': 'error',
    'no-param-reassign': 'off'
  },
  env: {
    browser: true,
    es6: true
  }
};
