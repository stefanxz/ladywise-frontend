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
  isInputDecimal: jest.fn(),
}));
const mockedValidations = jest.mocked(validations);

// --- Get router mock from expo-router ---
const { __getMocks } = jest.requireMock("expo-router");
const router = __getMocks();

describe("QuestionnairePersonalDetails screen", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockedValidations.isInputInteger.mockReset();
    mockedValidations.isInputDecimal.mockReset();
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

  it("shows 'Age must be a whole positive number.' when age is not a number", () => {
    const { pressContinue, getByText, typeAge } = setup();
    
    mockedValidations.isInputInteger.mockReturnValue(false);

    typeAge("abc");
    pressContinue();

    expect(getByText("Age must be a whole positive number.")).toBeTruthy();
    expect(router.push).not.toHaveBeenCalled();
    expect(mockedValidations.isInputInteger).toHaveBeenCalledWith("abc");
  });

  it("shows 'Age must be a whole positive number.' when age is not a decimal", () => {
    const { pressContinue, getByText, typeAge } = setup();
    
    mockedValidations.isInputInteger.mockReturnValue(false);

    typeAge("12.1");
    pressContinue();

    expect(getByText("Age must be a whole positive number.")).toBeTruthy();
    expect(router.push).not.toHaveBeenCalled();
    expect(mockedValidations.isInputInteger).toHaveBeenCalledWith("12.1");
  });

  it("shows 'Age must be a whole positive number.' when age < 0", () => {
    const { pressContinue, getByText, typeAge } = setup();
    
    mockedValidations.isInputInteger.mockReturnValue(false);

    typeAge("-1");
    pressContinue();

    expect(getByText("Age must be a whole positive number.")).toBeTruthy();
    expect(router.push).not.toHaveBeenCalled();
    expect(mockedValidations.isInputInteger).toHaveBeenCalledWith("-1");
  });

  it("Accpets integer value for age", () => {
    const { pressContinue, queryByText, typeWeight} = setup();
    
    mockedValidations.isInputDecimal.mockReturnValue(true);

    typeWeight("12");
    pressContinue();

    expect(queryByText("Weight must be a number.")).toBeNull();
    expect(mockedValidations.isInputDecimal).toHaveBeenCalledWith("12");
  });

  it("shows 'Please enter your weight.' when weight is empty", () => {
    const { pressContinue,  getByText } = setup();
    mockedValidations.isInputDecimal.mockReturnValue(false);

    pressContinue();

    expect(getByText("Please enter your weight.")).toBeTruthy();
    expect(router.push).not.toHaveBeenCalled();
  });

  it("shows 'Weight must be a positive number, using a dot (.) for decimals.' when weight is not a number", () => {
    const { pressContinue, getByText, typeWeight} = setup();
    
    mockedValidations.isInputDecimal.mockReturnValue(false);

    typeWeight("abc");
    pressContinue();

    expect(getByText("Weight must be a positive number, using a dot (.) for decimals.")).toBeTruthy();
    expect(router.push).not.toHaveBeenCalled();
    expect(mockedValidations.isInputDecimal).toHaveBeenCalledWith("abc");
  });

  it("Accpets integer value for weight", () => {
    const { pressContinue, queryByText, typeWeight} = setup();
    
    mockedValidations.isInputDecimal.mockReturnValue(true);

    typeWeight("12");
    pressContinue();

    expect(queryByText("Weight must be a positive number, using a dot (.) for decimals.")).toBeNull();
    expect(mockedValidations.isInputDecimal).toHaveBeenCalledWith("12");
  });

  it("Accpets decimal value for weight", () => {
    const { pressContinue, queryByText, typeWeight} = setup();
    
    mockedValidations.isInputDecimal.mockReturnValue(true);

    typeWeight("12.1");
    pressContinue();

    expect(queryByText("Weight must be a positive number, using a dot (.) for decimals.")).toBeNull();
    expect(mockedValidations.isInputDecimal).toHaveBeenCalledWith("12.1");
  });

   it("shows 'Weight must be a positive number, using a dot (.) for decimals.' when weight < 0", () => {
    const { pressContinue, getByText, typeWeight} = setup();
    
    mockedValidations.isInputDecimal.mockReturnValue(false);

    typeWeight("-1");
    pressContinue();

    expect(getByText("Weight must be a positive number, using a dot (.) for decimals.")).toBeTruthy();
    expect(mockedValidations.isInputDecimal).toHaveBeenCalledWith("-1");
  });

  it("shows 'Please enter your height.' when age is empty", () => {
    const { pressContinue,  getByText } = setup();
    mockedValidations.isInputDecimal.mockReturnValue(false);

    pressContinue();

    expect(getByText("Please enter your height.")).toBeTruthy();
    expect(router.push).not.toHaveBeenCalled();
  });

  it("shows 'Please enter your height.' when height is empty", () => {
    const { pressContinue,  getByText } = setup();
    mockedValidations.isInputDecimal.mockReturnValue(false);

    pressContinue();

    expect(getByText("Please enter your height.")).toBeTruthy();
    expect(router.push).not.toHaveBeenCalled();
  });

  it("shows 'Height must be a positive number, using a dot (.) for decimals.' when height is not a number", () => {
    const { pressContinue, getByText, typeHeight} = setup();
    
    mockedValidations.isInputDecimal.mockReturnValue(false);

    typeHeight("abc");
    pressContinue();

    expect(getByText("Height must be a positive number, using a dot (.) for decimals.")).toBeTruthy();
    expect(router.push).not.toHaveBeenCalled();
    expect(mockedValidations.isInputDecimal).toHaveBeenCalledWith("abc");
  });

  it("Accpets integer value for height", () => {
    const { pressContinue, queryByText, typeHeight} = setup();
    
    mockedValidations.isInputDecimal.mockReturnValue(true);

    typeHeight("12");
    pressContinue();

    expect(queryByText("Height must be a positive number, using a dot (.) for decimals.")).toBeNull();
    expect(mockedValidations.isInputDecimal).toHaveBeenCalledWith("12");
  });

  it("Accpets decimal value for height", () => {
    const { pressContinue, queryByText, typeHeight} = setup();
    
    mockedValidations.isInputDecimal.mockReturnValue(true);

    typeHeight("12.1");
    pressContinue();

    expect(queryByText("Height must be a positive number, using a dot (.) for decimals.")).toBeNull();
    expect(mockedValidations.isInputDecimal).toHaveBeenCalledWith("12.1");
  });

   it("shows 'Height must be a positive number, using a dot (.) for decimals.' when height < 0", () => {
    const { pressContinue, getByText, typeHeight} = setup();
    
    mockedValidations.isInputDecimal.mockReturnValue(false);

    typeHeight("-1");
    pressContinue();

    expect(getByText("Height must be a positive number, using a dot (.) for decimals.")).toBeTruthy();
    expect(mockedValidations.isInputDecimal).toHaveBeenCalledWith("-1");
  });

  it("navigates successfully when all fields are valid", () => {
    const { pressContinue, typeAge, typeWeight, typeHeight } = setup();

    // Mock the validation to always return true for this happy path test
    mockedValidations.isInputInteger.mockReturnValue(true);
    mockedValidations.isInputDecimal.mockReturnValue(true);

    // Fill in all fields with valid-looking data
    typeAge("25");
    typeWeight("70");
    typeHeight("175");
    pressContinue();

    // Assert that navigation happened
    expect(router.push).toHaveBeenCalledWith("/onboarding/questionnaire");
  });
});