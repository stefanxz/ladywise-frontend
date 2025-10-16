/**
 * @file questionnaire-personal-details.test.tsx
 * @description Unit test for the QuestionnaireIntro screen.
 * Verifies that the screen renders correctly and navigates to the questionnaire page.
 */

import QuestionnairePersonalDetails from "@/app/onboarding/questionnaire-personal-details";
import { render } from "@testing-library/react-native";
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

// --- Get router mock from expo-router ---
const { __getMocks } = jest.requireMock("expo-router");
const router = __getMocks();

describe("QuestionnairePersonalDetails screen", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders all key UI elements", () => {
    const { getByText } = render(<QuestionnairePersonalDetails />);

    expect(getByText("Let's start with a few basics 💫")).toBeTruthy();
    expect(getByText("Tell us a bit about yourself so we can tailor your health insights.")).toBeTruthy();
  });
});