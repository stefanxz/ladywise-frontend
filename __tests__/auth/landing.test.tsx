/**
 * @file landing.test.tsx
 * @description Unit test for the lading screen.
 * Verifies that the screen renders correctly and navigates to the register page and login page.
 */

import LandingPage from "@/app/(auth)/landing";
import { fireEvent, render } from "@testing-library/react-native";
import React from "react";

// Mocks
jest.mock("expo-router");
jest.mock("@expo/vector-icons");
jest.mock("react-native-safe-area-context");
jest.mock("@/components/ThemedPressable/ThemedPressable", () => ({
  ThemedPressable: ({
    label,
    onPress,
  }: {
    label: string;
    onPress: () => void;
  }) => {
    const { Pressable, Text } = require("react-native");
    return (
      <Pressable onPress={onPress} testID="get-started-button">
        <Text>{label}</Text>
      </Pressable>
    );
  },
}));

// --- Get router mock from expo-router ---
const { __getMocks } = jest.requireMock("expo-router");
const router = __getMocks();

describe("landing page", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("navigates to the register screen when button is pressed", () => {
    const { getByTestId } = render(<LandingPage />);
    fireEvent.press(getByTestId("get-started-button"));
    expect(router.push).toHaveBeenCalledWith("/(auth)/register");
  });

  it("navigates to the login screen when 'Log In' is pressed", () => {
    const {getByText} = render(<LandingPage />);
    fireEvent.press(getByText("Log In"));
    expect(router.push).toHaveBeenCalledWith("/login");
  });
});