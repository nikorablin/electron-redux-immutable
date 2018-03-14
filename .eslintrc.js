module.exports = {
  parser: 'babel-eslint',
  extends: ['airbnb', 'prettier'],
  plugins: ['prettier'],
  rules: {
    'comma-dangle': ['error', 'never'],
    'prettier/prettier': 'error',
    'linebreak-style': ['error', 'unix'],
    'react/sort-comp': 'off',
    'class-methods-use-this': 'off',
    'import/prefer-default-export': 'off'
  },
  env: {
    browser: true,
    es6: true,
    jest: true
  }
};
