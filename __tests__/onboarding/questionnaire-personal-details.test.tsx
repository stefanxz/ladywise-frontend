/**
 * @file questionnaire-personal-details.test.tsx
 * @description Unit test for the QuestionnaireIntro screen.
 * Verifies that the screen renders correctly and navigates to the questionnaire page.
 */

import QuestionnairePersonalDetails from "@/app/onboarding/questionnaire-personal-details";
import * as validations from "@/utils/validations";
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

//Mock validations
jest.mock("@/utils/validations", () => ({
  isInputInteger: jest.fn(),
}));
const mockedValidations = jest.mocked(validations);

// --- Get router mock from expo-router ---
const { __getMocks } = jest.requireMock("expo-router");
const router = __getMocks();

describe("QuestionnairePersonalDetails screen", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockedValidations.isInputInteger.mockReset();
  });

  const setup = () => {
    const utils = render(<QuestionnairePersonalDetails />);
    const pressContinue = () =>
          fireEvent.press(utils.getByTestId("continue-button"));
    const typeAge = (v: string) =>
      fireEvent.changeText(utils.getByTestId("age-input"), v);
    const typeWeight = (v: string) =>
      fireEvent.changeText(utils.getByTestId("weight-input"), v);
    const typeHeight = (v: string) =>
      fireEvent.changeText(utils.getByTestId("height-input"), v);
    return { ...utils, pressContinue, typeAge, typeWeight, typeHeight}
  }

  it("renders all key UI elements", () => {
    const { getByText } = setup();

    expect(getByText("Let's start with a few basics 💫")).toBeTruthy();
    expect(getByText("Tell us a bit about yourself so we can tailor your health insights.")).toBeTruthy();
    expect(getByText("Age")).toBeTruthy();
    expect(getByText("Weight")).toBeTruthy();
    expect(getByText("Height")).toBeTruthy();
    expect(getByText("Continue")).toBeTruthy();
    expect(getByText("Skip")).toBeTruthy();
  });

  it("shows 'Please enter your age.' when age is empty", () => {
    const { pressContinue,  getByText } = setup();
    mockedValidations.isInputInteger.mockReturnValue(false);

    pressContinue();

    expect(getByText("Please enter your age.")).toBeTruthy();
    expect(router.push).not.toHaveBeenCalled();
  });

  it("shows 'Age must be a number.' when age is not an integer", () => {
    const { pressContinue, getByText, typeAge } = setup();
    
    mockedValidations.isInputInteger.mockReturnValue(false);

    typeAge("abc");
    pressContinue();

    expect(getByText("Age must be a number.")).toBeTruthy();
    expect(router.push).not.toHaveBeenCalled();
    expect(mockedValidations.isInputInteger).toHaveBeenCalledWith("abc");
  });

  it("shows 'Please enter your weight.' when weight is empty", () => {
    const { pressContinue,  getByText } = setup();
    mockedValidations.isInputInteger.mockReturnValue(false);

    pressContinue();

    expect(getByText("Please enter your weight.")).toBeTruthy();
    expect(router.push).not.toHaveBeenCalled();
  });

  it("shows 'Weight must be a number.' when weight is not an integer", () => {
    const { pressContinue, getByText, typeWeight} = setup();
    
    mockedValidations.isInputInteger.mockReturnValue(false);

    typeWeight("abc");
    pressContinue();

    expect(getByText("Weight must be a number.")).toBeTruthy();
    expect(router.push).not.toHaveBeenCalled();
    expect(mockedValidations.isInputInteger).toHaveBeenCalledWith("abc");
  });

  it("shows 'Please enter your height.' when age is empty", () => {
    const { pressContinue,  getByText } = setup();
    mockedValidations.isInputInteger.mockReturnValue(false);

    pressContinue();

    expect(getByText("Please enter your height.")).toBeTruthy();
    expect(router.push).not.toHaveBeenCalled();
  });

  it("shows 'Height must be a number.' when height is not an integer", () => {
    const { pressContinue, getByText, typeHeight} = setup();
    
    mockedValidations.isInputInteger.mockReturnValue(false);

    typeHeight("abc");
    pressContinue();

    expect(getByText("Height must be a number.")).toBeTruthy();
    expect(router.push).not.toHaveBeenCalled();
    expect(mockedValidations.isInputInteger).toHaveBeenCalledWith("abc");
  });

  it("navigates successfully when all fields are valid", () => {
    const { pressContinue, typeAge, typeWeight, typeHeight } = setup();

    // Mock the validation to always return true for this happy path test
    mockedValidations.isInputInteger.mockReturnValue(true);

    // Fill in all fields with valid-looking data
    typeAge("25");
    typeWeight("70");
    typeHeight("175");
    pressContinue();

    // Assert that navigation happened
    expect(router.push).toHaveBeenCalledWith("/onboarding/questionnaire");
  });
});