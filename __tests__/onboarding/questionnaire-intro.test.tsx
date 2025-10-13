/**
 * @file questionnaire-intro.test.tsx
 * @description Unit test for the QuestionnaireIntro screen.
 * Verifies that the screen renders correctly and navigates to the questionnaire page.
 */

import QuestionnaireIntro from "@/app/onboarding/questionnaire-intro";
import { fireEvent, render } from "@testing-library/react-native";
import React from "react";

// --- Mock dependencies ---
jest.mock("expo-router");
jest.mock("@expo/vector-icons");
jest.mock("react-native-safe-area-context", () => {
  const React = require("react");
  return {
    SafeAreaView: ({ children }: { children: React.ReactNode }) => (
      <>{children}</>
    ),
  };
});
jest.mock("@/components/AppBarBackButton/AppBarBackButton", () => ({
  AppBar: () => null,
}));
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
      <Pressable onPress={onPress} testID="continue-button">
        <Text>{label}</Text>
      </Pressable>
    );
  },
}));

// --- Get router mock from expo-router ---
const { __getMocks } = jest.requireMock("expo-router");
const router = __getMocks();

describe("QuestionnaireIntro screen", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders all key UI elements", () => {
    const { getByText } = render(<QuestionnaireIntro />);

    expect(getByText("Let's personalize")).toBeTruthy();
    expect(getByText("LadyWise")).toBeTruthy();
    expect(getByText("Continue")).toBeTruthy();
  });

  it("navigates to the questionnaire screen on Continue", () => {
    const { getByTestId } = render(<QuestionnaireIntro />);
    fireEvent.press(getByTestId("continue-button"));
    expect(router.push).toHaveBeenCalledWith("/onboarding/questionnaire");
  });
});
