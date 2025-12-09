import "@testing-library/jest-native/extend-expect";
import React from "react";

// mock AsyncStorage globally for all tests
jest.mock("@react-native-async-storage/async-storage", () =>
  require("@react-native-async-storage/async-storage/jest/async-storage-mock"),
);

// Mock react-native-safe-area-context
jest.mock("react-native-safe-area-context", () => ({
  useSafeAreaInsets: () => ({
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
  }),
  SafeAreaProvider: ({ children }: { children: React.ReactNode }) => children,
  SafeAreaView: ({ children }: { children: React.ReactNode }) => children,
}));

// Mock @gorhom/bottom-sheet
jest.mock("@gorhom/bottom-sheet", () => {
  const React = require("react");
  const { View, ScrollView } = require("react-native");

  return {
    __esModule: true,
    default: React.forwardRef(({ children }: any, ref: any) => children),
    BottomSheetModal: React.forwardRef(
      ({ children }: any, ref: any) => children,
    ),
    BottomSheetBackdrop: ({ children }: any) => children,
    BottomSheetView: ({ children, ...props }: any) =>
      React.createElement(View, props, children),
    BottomSheetScrollView: React.forwardRef(
      ({ children, ...props }: any, ref: any) =>
        React.createElement(ScrollView, { ...props, ref }, children),
    ),
  };
});
