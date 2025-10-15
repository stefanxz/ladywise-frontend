module.exports = {
  preset: "jest-expo",
  setupFilesAfterEnv: ["@testing-library/jest-native/extend-expect"],
  moduleNameMapper: { "^@/(.*)$": "<rootDir>/$1" },
testMatch: [
  "**/__tests__/**/*.[jt]s?(x)",
  "**/?(*.)+(spec|test).[jt]s?(x)"
],
  transformIgnorePatterns: [
    "node_modules/(?!(react-native|@react-native|@testing-library|expo(nent)?|expo-.*|@expo|expo-router|react-native-gesture-handler|react-native-reanimated|react-native-safe-area-context|react-native-svg|react-native-css-interop|nativewind|@expo/vector-icons)/)",
  ],
  testPathIgnorePatterns: ["/node_modules/", "/android/", "/ios/", "/dist/", "/build/", "/.expo/"],
  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"],
};
