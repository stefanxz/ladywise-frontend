/**
 * @file questionnaire-personal-details.test.tsx
 * @description Unit test for the QuestionnaireIntro screen.
 * Verifies that the screen renders correctly and navigates to the questionnaire page.
 */

import QuestionnairePersonalDetails from "@/app/onboarding/questionnaire-personal-details";
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

// --- Get router mock from expo-router ---
const { __getMocks } = jest.requireMock("expo-router");
const router = __getMocks();

describe("QuestionnairePersonalDetails screen", () => {
  beforeEach(() => {
    jest.clearAllMocks();
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

    pressContinue();

    expect(getByText("Please enter your age.")).toBeTruthy();
    expect(router.push).not.toHaveBeenCalled();
  });

  it("shows 'Age must be a whole positive number.' when age is not a number", () => {
    const { pressContinue, getByText, typeAge } = setup();

    typeAge("abc");
    pressContinue();

    expect(getByText("Age must be a whole positive number.")).toBeTruthy();
    expect(router.push).not.toHaveBeenCalled();
  });

  it("shows 'Age must be a whole positive number.' when age is not a decimal", () => {
    const { pressContinue, getByText, typeAge } = setup();

    typeAge("12.1");
    pressContinue();

    expect(getByText("Age must be a whole positive number.")).toBeTruthy();
    expect(router.push).not.toHaveBeenCalled();
  });

  it("shows 'Age must be a whole positive number.' when age < 0", () => {
    const { pressContinue, getByText, typeAge } = setup();

    typeAge("-1");
    pressContinue();

    expect(getByText("Age must be a whole positive number.")).toBeTruthy();
    expect(router.push).not.toHaveBeenCalled();
  });

  it("Accpets integer value for age", () => {
    const { pressContinue, queryByText, typeAge} = setup();
    

    typeAge("12");
    pressContinue();

    expect(queryByText("Age must be a whole positive number.")).toBeNull();
  });

  it("shows 'Please enter your weight.' when weight is empty", () => {
    const { pressContinue,  getByText } = setup();

    pressContinue();

    expect(getByText("Please enter your weight.")).toBeTruthy();
    expect(router.push).not.toHaveBeenCalled();
  });

  it("shows 'Weight must be a positive number, using a dot (.) for decimals.' when weight is not a number", () => {
    const { pressContinue, getByText, typeWeight} = setup();

    typeWeight("abc");
    pressContinue();

    expect(getByText("Weight must be a positive number, using a dot (.) for decimals.")).toBeTruthy();
    expect(router.push).not.toHaveBeenCalled();
  });

  it("Accpets integer value for weight", () => {
    const { pressContinue, queryByText, typeWeight} = setup();

    typeWeight("12");
    pressContinue();

    expect(queryByText("Weight must be a positive number, using a dot (.) for decimals.")).toBeNull();
  });

  it("Accpets decimal value for weight", () => {
    const { pressContinue, queryByText, typeWeight} = setup();

    typeWeight("12.1");
    pressContinue();

    expect(queryByText("Weight must be a positive number, using a dot (.) for decimals.")).toBeNull();
  });

  it("shows 'Weight must be a positive number, using a dot (.) for decimals.' when weight number is with a comma", () => {
    const { pressContinue, getByText, typeWeight} = setup();

    typeWeight("12,1");
    pressContinue();

    expect(getByText("Weight must be a positive number, using a dot (.) for decimals.")).toBeTruthy();
  });

   it("shows 'Weight must be a positive number, using a dot (.) for decimals.' when weight < 0", () => {
    const { pressContinue, getByText, typeWeight} = setup();

    typeWeight("-1");
    pressContinue();

    expect(getByText("Weight must be a positive number, using a dot (.) for decimals.")).toBeTruthy();
  });

  it("shows 'Please enter your height.' when height is empty", () => {
    const { pressContinue,  getByText } = setup();

    pressContinue();

    expect(getByText("Please enter your height.")).toBeTruthy();
    expect(router.push).not.toHaveBeenCalled();
  });

  it("shows 'Please enter your height.' when height is empty", () => {
    const { pressContinue,  getByText } = setup();

    pressContinue();

    expect(getByText("Please enter your height.")).toBeTruthy();
    expect(router.push).not.toHaveBeenCalled();
  });

  it("shows 'Height must be a positive number, using a dot (.) for decimals.' when height is not a number", () => {
    const { pressContinue, getByText, typeHeight} = setup();

    typeHeight("abc");
    pressContinue();

    expect(getByText("Height must be a positive number, using a dot (.) for decimals.")).toBeTruthy();
    expect(router.push).not.toHaveBeenCalled();
  });

  it("Accpets integer value for height", () => {
    const { pressContinue, queryByText, typeHeight} = setup();

    typeHeight("12");
    pressContinue();

    expect(queryByText("Height must be a positive number, using a dot (.) for decimals.")).toBeNull();
  });

  it("Accpets decimal value for height", () => {
    const { pressContinue, queryByText, typeHeight} = setup();

    typeHeight("12.1");
    pressContinue();

    expect(queryByText("Height must be a positive number, using a dot (.) for decimals.")).toBeNull();
  });

  it("shows 'Height must be a positive number, using a dot (.) for decimals.' when height number is with a comma", () => {
    const { pressContinue, getByText, typeHeight} = setup();

    typeHeight("12,1");
    pressContinue();

    expect(getByText("Height must be a positive number, using a dot (.) for decimals.")).toBeTruthy();
  });

   it("shows 'Height must be a positive number, using a dot (.) for decimals.' when height < 0", () => {
    const { pressContinue, getByText, typeHeight} = setup();

    typeHeight("-1");
    pressContinue();

    expect(getByText("Height must be a positive number, using a dot (.) for decimals.")).toBeTruthy();
  });

  it("navigates successfully when all fields are valid", () => {
    const { pressContinue, typeAge, typeWeight, typeHeight } = setup();

    // Fill in all fields with valid-looking data
    typeAge("25");
    typeWeight("70");
    typeHeight("175");
    pressContinue();

    // Assert that navigation happened
    expect(router.push).toHaveBeenCalledWith("/onboarding/questionnaire");
  });
});