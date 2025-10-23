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

// --- Get router mock from expo-router ---
const { __getMocks } = jest.requireMock("expo-router");
const router = __getMocks();

describe("landing page", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const setup = () => {
    const utils = render(<LandingPage />);
    const pressGetStarted = () =>
      fireEvent.press(utils.getByTestId("get-started-button"));
    const pressLogIn = () =>
      fireEvent.press(utils.getByTestId("login-button"));
    return { ...utils, pressGetStarted, pressLogIn}
  };

  it("Shows app name", () => {
    const { getByText } = setup();
    expect(getByText("LadyWise")).toBeTruthy();
  });

  it("Shows app description", () => {
    const { getByText } = setup();
    expect(getByText("Your personal companion for menstrual health insights.")).toBeTruthy();
  });

  it("Shows button text 'Get Started'", () => {
    const { getByText } = setup();
    expect(getByText("Get Started")).toBeTruthy();
  });

  it("Shows text for login", () => {
    const { getByText } = setup();
    expect(getByText("Already have an account?")).toBeTruthy();
  });

  it("Shows text for login link", () => {
    const { getByText } = setup();
    expect(getByText("Log In")).toBeTruthy();
  });

  it("Navigates to the register screen when button is pressed", () => {
    const { pressGetStarted } = setup();
    
    pressGetStarted();

    expect(router.push).toHaveBeenCalledWith("/(auth)/register");
  });

  it("Navigates to the login screen when 'Log In' is pressed", () => {
    const { pressLogIn } = setup();
    
    pressLogIn();

    expect(router.push).toHaveBeenCalledWith("/login");
  });
});