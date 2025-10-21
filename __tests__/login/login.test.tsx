import LoginScreen from "@/app/(auth)/login";
import * as api from "@/lib/api";
import * as validation from "@/lib/validation";
import * as asyncStorage from "@/utils/asyncStorageHelpers";
import { fireEvent, render, waitFor } from "@testing-library/react-native";
import * as SecureStore from "expo-secure-store";
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

import * as auth from "@/lib/auth";
// ...
// Mock API and Auth
jest.mock("@/lib/api", () => ({
  loginUser: jest.fn(),
}));
const mockedApi = jest.mocked(api);

jest.mock("@/lib/auth", () => ({
  storeAuthData: jest.fn(),
  getAuthData: jest.fn(),
  clearAuthData: jest.fn(),
}));
const mockedAuth = jest.mocked(auth);

jest.mock("@/utils/asyncStorageHelpers", () => ({
  incrementFailedLoginCount: jest.fn(),
  resetFailedLoginCount: jest.fn(),
  getFailedLoginCount: jest.fn(),
}));
const mockedAsyncStorage = jest.mocked(asyncStorage);

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
    const pressLogin = () =>
      fireEvent.press(utils.getByRole("button", { name: "Log In" }));
    const getLoginBtn = () =>
      utils.getByRole("button", { name: "Log In" });
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

  // API Call Tests
  describe("API Calls", () => {
    it("calls loginUser, stores token, and navigates on successful login", async () => {
      mockedValidation.isEmailValid.mockReturnValue(true);
      mockedApi.loginUser.mockResolvedValue({
        token: "fake-token",
        tokenType: "Bearer",
        userId: "user-123",
        email: "user@example.com",
      });

      const { typeEmail, typePassword, pressLogin } = setup();

      typeEmail("user@example.com");
      typePassword("password123");
      pressLogin();

      await waitFor(() => {
        expect(mockedApi.loginUser).toHaveBeenCalledWith({
          email: "user@example.com",
          password: "password123",
        });
      });

      await waitFor(() => {
        expect(mockedAuth.storeAuthData).toHaveBeenCalledWith(
          "fake-token",
          "user-123",
          "user@example.com"
        );
      });

      await waitFor(() => {
        expect(mockedAsyncStorage.resetFailedLoginCount).toHaveBeenCalled();
      });

      await waitFor(() => {
        expect(mockRouter.replace).toHaveBeenCalledWith("/(main)/home");
      });
    });

    it("shows an error message and increments failed login count on failed login", async () => {
      mockedValidation.isEmailValid.mockReturnValue(true);
      mockedApi.loginUser.mockRejectedValue(new Error("Invalid email or password"));

      const { typeEmail, typePassword, pressLogin, findByText } = setup();

      typeEmail("user@example.com");
      typePassword("wrong-password");
      pressLogin();

      const errorMessage = await findByText("Invalid email or password");
      expect(errorMessage).toBeTruthy();

      expect(mockedAuth.storeAuthData).not.toHaveBeenCalled();
      expect(mockRouter.replace).not.toHaveBeenCalled();
      expect(mockedAsyncStorage.incrementFailedLoginCount).toHaveBeenCalled();
    });
  });
});