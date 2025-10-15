/** 
 * Unified Jest config (merged .ts + .js)
 * Works for Expo + React Native projects
 */
module.exports = {
  preset: "jest-expo",

  // Run setup after environment load
  setupFilesAfterEnv: [
    "@testing-library/jest-native/extend-expect",
    "<rootDir>/jest.setup.ts",
  ],

  // Clear mocks before every test
  clearMocks: true,

  // Collect coverage reports
  collectCoverage: true,
  coverageDirectory: "coverage",
  coverageProvider: "v8",

  // Resolve @/ aliases
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/$1",
  },

  // Which files to treat as tests
  testMatch: [
    "**/__tests__/**/*.[jt]s?(x)",
    "**/?(*.)+(spec|test).[jt]s?(x)",
  ],

  // Avoid transforming core RN and Expo packages
  transformIgnorePatterns: [
    "node_modules/(?!(react-native" +
      "|@react-native" +
      "|@testing-library" +
      "|expo(nent)?" +
      "|expo-.*" +
      "|@expo" +
      "|expo-router" +
      "|react-native-gesture-handler" +
      "|react-native-reanimated" +
      "|react-native-safe-area-context" +
      "|react-native-svg" +
      "|react-native-css-interop" +
      "|nativewind" +
      "|@expo/vector-icons)/)",
  ],

  // Ignore build and system directories
  testPathIgnorePatterns: [
    "/node_modules/",
    "/android/",
    "/ios/",
    "/dist/",
    "/build/",
    "/.expo/",
  ],

  // File extensions Jest should recognize
  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"],
};
