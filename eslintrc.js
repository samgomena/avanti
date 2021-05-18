// See: https://melih193.medium.com/next-js-eslint-setup-tutorial-for-airbnb-config-c2b04183a92a
// See: https://stackoverflow.com/questions/58233482/next-js-setting-up-eslint-for-nextjs

module.exports = {
  root: true,
  parser: "babel-eslint",
  extends: [
    "eslint:recommended",
    "plugin:react/recommended",
    "plugin:import/errors",
    "plugin:import/warnings",
    "plugin:jsx-a11y/recommended",
    "plugin:react-hooks/recommended",
    "airbnb",
  ],
  rules: {},
  env: {
    browser: true,
    commonjs: true,
    es6: true,
    node: true,
  },
  parserOptions: {
    ecmaVersion: 2021,
    sourceType: "module",
    ecmaFeatures: {
      jsx: true,
    },
  },
  settings: {
    react: {
      version: "detect",
    },
  },
  plugins: [],
};
