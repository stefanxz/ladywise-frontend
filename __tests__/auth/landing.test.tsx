/**
 * @file landing.test.tsx
 * @description Unit test for the landing screen.
 * Verifies that the screen renders correctly and navigates to the register page and login page.
 */

import LandingPage from "@/app/(auth)/landing";
import { fireEvent, render } from "@testing-library/react-native";
import { Platform } from "react-native";
import React from "react";

// Mocks
jest.mock("expo-router");
jest.mock("@expo/vector-icons");
jest.mock("react-native-safe-area-context");

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
    const pressLogIn = () => fireEvent.press(utils.getByTestId("login-button"));
    return { ...utils, pressGetStarted, pressLogIn };
  };

  it("renders all key UI elements", () => {
    const { getByText } = setup();

    expect(getByText("LadyWise")).toBeTruthy();
    expect(
      getByText("Your personal companion for menstrual health insights."),
    ).toBeTruthy();
    expect(getByText("Get Started")).toBeTruthy();
    expect(getByText("Already have an account?")).toBeTruthy();
    expect(getByText("Log In")).toBeTruthy();
  });

  it("renders logo image", () => {
    const { getByTestId } = setup();
    expect(getByTestId("logo-image")).toBeTruthy();
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

  it("renders ThemedPressable with correct props", () => {
    const { getByTestId } = setup();
    const button = getByTestId("get-started-button");

    expect(button).toBeTruthy();
  });

  describe("Platform-specific styling", () => {
    const originalPlatform = Platform.OS;

    afterEach(() => {
      Platform.OS = originalPlatform;
    });

    it("applies Android-specific padding when on Android", () => {
      Platform.OS = "android";
      const { getByText } = render(<LandingPage />);

      const title = getByText("LadyWise");
      expect(title.props.style).toEqual(
        expect.objectContaining({
          paddingRight: 3,
        }),
      );
    });

    it("applies no extra padding on iOS", () => {
      Platform.OS = "ios";
      const { getByText } = render(<LandingPage />);

      const title = getByText("LadyWise");
      expect(title.props.style).toEqual(
        expect.objectContaining({
          paddingRight: 0,
        }),
      );
    });
  });
});
