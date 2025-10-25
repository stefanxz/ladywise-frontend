/**
 * @file first-questionnaire-completion.test.tsx
 * @description Unit test for the FirstQuestionnaireCompletion screen.
 * Verifies that the screen renders correctly and navigates to the cycle questionnaire mock screen.
 */

import FirstQuestionnaireCompletion from "@/app/onboarding/first-questionnaire-completion";
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

describe("FirstQuestionnaireCompletion screen", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders key UI elements", () => {
    const { getByText } = render(<FirstQuestionnaireCompletion />);

    expect(getByText(/All set/i)).toBeTruthy();
    expect(
      getByText(
        /Thank you for sharing your details\. LadyWise will now personalize your health insights based on your profile\./i
      )
    ).toBeTruthy();
    expect(getByText("Continue")).toBeTruthy();
  });

  it("navigates to the cycle questionnaire mock screen on Continue", () => {
    const { getByTestId } = render(<FirstQuestionnaireCompletion />);
    fireEvent.press(getByTestId("continue-button"));
    expect(router.push).toHaveBeenCalledWith(
      "/onboarding/cycle-questionnaire-mock"
    );
  });
});
