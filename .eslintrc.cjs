/** @type {import("eslint").Linter.Config} */
module.exports = {
  root: true,
  env: {
    es2021: true,
    node: true,
    "react-native/react-native": true,
    jest: true,
  },
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaVersion: "latest",
    sourceType: "module",
    ecmaFeatures: {
      jsx: true,
    },
  },
  plugins: ["react", "react-hooks", "react-native", "@typescript-eslint"],
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:react/recommended",
    "plugin:react-hooks/recommended",
    "plugin:react-native/all",
  ],
  settings: {
    react: {
      version: "detect",
    },
  },
  rules: {
    // tweak to taste:
    "react/react-in-jsx-scope": "off", // not needed in React Native
    "react-native/no-inline-styles": "off", // often inconvenient
    "@typescript-eslint/no-explicit-any": "off",
  },
};
