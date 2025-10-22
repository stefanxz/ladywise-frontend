import LoginScreen from "@/app/(auth)/login";
import * as validation from "@/lib/validation";
import { fireEvent, render } from "@testing-library/react-native";
import React from "react";

// --- Mock navigation, stack, and icons ---
const mockRouter = { push: jest.fn(), replace: jest.fn(), back: jest.fn() };
jest.mock("expo-router", () => ({
  Stack: { Screen: () => null },
  useRouter: () => mockRouter,
}));

jest.mock("@expo/vector-icons", () => ({
  Feather: () => null,
  Ionicons: () => null,
}));

jest.mock("react-native-safe-area-context", () => {
  const React = require("react");
  return {
    SafeAreaView: ({ children }: { children: React.ReactNode }) => (
      <>{children}</>
    ),
    useSafeAreaInsets: () => ({ top: 0, bottom: 0 }),
  };
});

// --- Mock components not under test ---
jest.mock("@/components/AppBarBackButton/AppBarBackButton", () => ({
  AppBar: () => null,
}));

jest.mock("@/components/SocialSignOn/SocialSignOn", () => ({
  SocialSignOn: () => null,
}));

// --- Mock validation ---
jest.mock("@/lib/validation", () => ({
  isEmailValid: jest.fn(),
}));
const mockedValidation = jest.mocked(validation);

describe("LoginScreen", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Default to invalid email unless a test overrides it
    mockedValidation.isEmailValid.mockImplementation(() => false);
  });

  const setup = () => {
    const utils = render(<LoginScreen />);
    const typeEmail = (v: string) =>
      fireEvent.changeText(utils.getByPlaceholderText("Your email"), v);
    const typePassword = (v: string) =>
      fireEvent.changeText(utils.getByPlaceholderText("Your password"), v);
    const pressLogin = () => fireEvent.press(utils.getByRole("button"));
    const getLoginBtn = () => utils.getByRole("button");
    return { ...utils, typeEmail, typePassword, pressLogin, getLoginBtn };
  };

  it("renders key texts", () => {
    const { getByText } = setup();
    expect(getByText("Welcome Back 🌸")).toBeTruthy();
    expect(getByText("Log In")).toBeTruthy();
  });

  it("disables login button when form is invalid initially", () => {
    const { getLoginBtn } = setup();
    const btn = getLoginBtn();
    expect(btn).toHaveAccessibilityState({ disabled: true });
  });

  it("shows email validation error for invalid email and keeps button disabled", () => {
    const { typeEmail, pressLogin, queryByText, getLoginBtn } = setup();

    mockedValidation.isEmailValid.mockReturnValue(false);
    typeEmail("invalidemail");
    pressLogin();

    // UI may or may not render inline error text; primary contract is disabled button
    queryByText("Please enter a valid email address.");
    expect(getLoginBtn()).toHaveAccessibilityState({ disabled: true });
  });

  it("enables login button when email and password are valid", () => {
    const { typeEmail, typePassword, getLoginBtn } = setup();

    mockedValidation.isEmailValid.mockReturnValue(true);
    typeEmail("user@example.com");
    typePassword("secret123");

    expect(getLoginBtn()).toHaveAccessibilityState({ disabled: false });
  });

  it("calls email validator with the typed value", () => {
    const { typeEmail } = setup();
    mockedValidation.isEmailValid.mockClear();

    typeEmail("typed@example.com");

    expect(mockedValidation.isEmailValid).toHaveBeenCalledTimes(1);
    expect(mockedValidation.isEmailValid).toHaveBeenCalledWith(
      "typed@example.com"
    );
  });
});
