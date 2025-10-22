import "@testing-library/jest-native/extend-expect";

// mock AsyncStorage globally for all tests
jest.mock("@react-native-async-storage/async-storage", () =>
  require("@react-native-async-storage/async-storage/jest/async-storage-mock")
);
