// https://docs.expo.dev/guides/using-eslint/
const { defineConfig } = require("eslint/config");
const expoConfig = require("eslint-config-expo/flat");
const eslintPluginPrettierRecommended = require("eslint-plugin-prettier/recommended");
const globals = require("globals");

module.exports = defineConfig([
  expoConfig,

  eslintPluginPrettierRecommended,

  {
    settings: {
      react: {
        version: "detect",
      },
    },
    rules: {
      "react/react-in-jsx-scope": "off",

      "react-native/no-inline-styles": "off",

      "@typescript-eslint/no-explicit-any": "off",
    },
  },

  {
    ignores: ["dist/*"],
  },

  {
    files: ["**/*.test.ts", "**/*.test.tsx", "**/*.spec.ts", "**/*.spec.tsx"],
    languageOptions: {
      globals: {
        ...globals.jest,
      },
    },
    rules: {
      "import/no-extraneous-dependencies": ["error", { devDependencies: true }],
    },
  },
]);
