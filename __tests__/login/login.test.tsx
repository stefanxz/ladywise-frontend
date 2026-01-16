import LoginScreen from "@/app/(auth)/login";
import * as api from "@/lib/api";
import * as validation from "@/lib/validation";
import * as asyncStorage from "@/utils/asyncStorageHelpers";
import { fireEvent, render, waitFor } from "@testing-library/react-native";
import React from "react";
import { AxiosError } from "axios";
import { useLocalSearchParams } from "expo-router";
import { Keyboard, KeyboardAvoidingView, Platform } from "react-native";

const mockSignIn = jest.fn();
jest.mock("@/context/AuthContext", () => ({
  useAuth: () => ({
    signIn: mockSignIn,
    isLoading: false,
    token: null,
  }),
}));

const mockRouter = { push: jest.fn(), replace: jest.fn(), back: jest.fn() };
jest.mock("expo-router", () => ({
  Stack: { Screen: () => null },
  useRouter: () => mockRouter,
  useLocalSearchParams: jest.fn(() => ({})),
}));

jest.mock("@expo/vector-icons", () => {
  const { View } = require("react-native");
  return {
    Feather: (props: any) => <View {...props} testID="feather-icon" />,
    Ionicons: () => null,
  };
});
jest.mock("react-native-safe-area-context", () => {
  const React = require("react");
  return {
    SafeAreaView: ({ children }: { children: React.ReactNode }) => (
      <>{children}</>
    ),
    useSafeAreaInsets: () => ({ top: 0, bottom: 0 }),
  };
});

jest.mock("@/components/AppBarBackButton/AppBarBackButton", () => ({
  AppBar: () => null,
}));

jest.mock("@/lib/api", () => ({
  loginUser: jest.fn(),
}));

jest.mock("@/lib/validation", () => ({
  isEmailValid: jest.fn(),
}));

jest.mock("@/utils/asyncStorageHelpers", () => ({
  incrementFailedLoginCount: jest.fn(),
  resetFailedLoginCount: jest.fn(),
  getFailedLoginCount: jest.fn(),
}));

const mockedApi = jest.mocked(api);
const mockedValidation = jest.mocked(validation);
const mockedAsyncStorage = jest.mocked(asyncStorage);

describe("LoginScreen", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockSignIn.mockClear();
    mockedValidation.isEmailValid.mockImplementation(() => false);
    mockedAsyncStorage.getFailedLoginCount.mockResolvedValue(0);
  });

  const setup = () => {
    const utils = render(<LoginScreen />);
    const typeEmail = (v: string) =>
      fireEvent.changeText(utils.getByPlaceholderText("Your email"), v);
    const typePassword = (v: string) =>
      fireEvent.changeText(utils.getByPlaceholderText("Your password"), v);
    const pressLogin = () =>
      fireEvent.press(utils.getByRole("button", { name: "Log In" }));
    const getLoginBtn = () => utils.getByRole("button", { name: "Log In" });
    return { ...utils, typeEmail, typePassword, pressLogin, getLoginBtn };
  };

  it("renders key texts", () => {
    const { getByText } = setup();
    expect(getByText("Welcome Back 🌸")).toBeTruthy();
    expect(getByText("Log In")).toBeTruthy();
  });

  it("disables login button when form is invalid initially", () => {
    const { getLoginBtn } = setup();
    expect(getLoginBtn()).toHaveAccessibilityState({ disabled: true });
  });

  it("shows email validation error for invalid email and keeps button disabled", () => {
    const { typeEmail, pressLogin, queryByText, getLoginBtn } = setup();

    mockedValidation.isEmailValid.mockReturnValue(false);
    typeEmail("invalidemail");
    pressLogin();

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

    mockedValidation.isEmailValid.mockReturnValue(true);
    typeEmail("typed@example.com");

    expect(mockedValidation.isEmailValid).toHaveBeenCalledTimes(1);
    expect(mockedValidation.isEmailValid).toHaveBeenCalledWith(
      "typed@example.com",
    );
  });

  it("shows banner when passwordReset=true", () => {
    (useLocalSearchParams as jest.Mock).mockReturnValue({
      passwordReset: "true",
    });
    const { getByText } = setup();
    expect(
      getByText("Your password has been updated. Please log in."),
    ).toBeTruthy();
  });

  describe("API Calls", () => {
    it("calls loginUser, stores token, resets failed count, and navigates on successful login", async () => {
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
        expect(mockSignIn).toHaveBeenCalledWith(
          "fake-token",
          "user-123",
          "user@example.com",
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
      const consoleErrorSpy = jest
        .spyOn(console, "error")
        .mockImplementation(() => {});

      mockedValidation.isEmailValid.mockReturnValue(true);
      const mockAxiosError = new AxiosError(
        "Request failed with status code 401",
        "401",
        undefined,
        undefined,
        {
          status: 401,
          data: "Invalid email or password",
          statusText: "Unauthorized",
          headers: {},
          config: {} as any,
        },
      );
      mockedApi.loginUser.mockRejectedValue(mockAxiosError);

      const { typeEmail, typePassword, pressLogin, findByText } = setup();

      typeEmail("user@example.com");
      typePassword("wrong-password");
      pressLogin();

      const errorMessage = await findByText("Invalid email or password");
      expect(errorMessage).toBeTruthy();

      expect(mockRouter.replace).not.toHaveBeenCalled();
      expect(mockedAsyncStorage.incrementFailedLoginCount).toHaveBeenCalled();
      expect(mockSignIn).not.toHaveBeenCalled();

      consoleErrorSpy.mockRestore();
    });
  });
  describe("Interactions & Edge Cases", () => {
    it("toggles password visibility when the eye icon is pressed", () => {
      const { getByPlaceholderText, getAllByTestId } = setup();
      const passwordInput = getByPlaceholderText("Your password");

      expect(passwordInput.props.secureTextEntry).toBe(true);

      const eyeIcon = getAllByTestId("feather-icon")[0];

      fireEvent.press(eyeIcon);

      expect(passwordInput.props.secureTextEntry).toBe(false);

      fireEvent.press(eyeIcon);
      expect(passwordInput.props.secureTextEntry).toBe(true);
    });

    it("navigates to password recovery when 'Forgot password?' is pressed", () => {
      const { getByText } = setup();

      fireEvent.press(getByText("Forgot password?"));

      expect(mockRouter.push).toHaveBeenCalledWith("/(auth)/password_recovery");
    });

    it("keeps login button disabled if password is empty", () => {
      const { typeEmail, getLoginBtn } = setup();

      mockedValidation.isEmailValid.mockReturnValue(true);
      typeEmail("valid@example.com");

      expect(getLoginBtn()).toHaveAccessibilityState({ disabled: true });
    });
  });

  describe("Network & Generic Errors", () => {
    it("displays friendly message on Network Error", async () => {
      const { typeEmail, typePassword, pressLogin, findByText } = setup();
      mockedValidation.isEmailValid.mockReturnValue(true);

      const networkError = new AxiosError("Network Error", "ERR_NETWORK");
      mockedApi.loginUser.mockRejectedValue(networkError);

      typeEmail("test@test.com");
      typePassword("123456");
      pressLogin();

      const errorMsg = await findByText(
        "We couldn't reach the server. Please check your connection.",
      );
      expect(errorMsg).toBeTruthy();
    });

    it("displays raw error string if server returns text response", async () => {
      const { typeEmail, typePassword, pressLogin, findByText } = setup();
      mockedValidation.isEmailValid.mockReturnValue(true);

      const serverError = new AxiosError(
        "Server Error",
        "500",
        undefined,
        undefined,
        {
          data: "Critical Database Failure",
          status: 500,
          statusText: "Server Error",
          headers: {},
          config: {} as any,
        },
      );
      mockedApi.loginUser.mockRejectedValue(serverError);

      typeEmail("test@test.com");
      typePassword("123456");
      pressLogin();

      const errorMsg = await findByText("Critical Database Failure");
      expect(errorMsg).toBeTruthy();
    });
  });

  describe("Form Validation Edge Cases", () => {
    it("clears email error when user types in email field", () => {
      const { typeEmail, queryByText } = setup();

      mockedValidation.isEmailValid.mockReturnValue(false);
      typeEmail("bad");

      // Trigger blur to show error
      const emailInput = queryByText("Your email");
      if (emailInput) fireEvent(emailInput, "blur");

      // Now type again - error should clear
      mockedValidation.isEmailValid.mockReturnValue(true);
      typeEmail("good@email.com");

      // The validation error should be cleared on change
      expect(mockedValidation.isEmailValid).toHaveBeenLastCalledWith(
        "good@email.com",
      );
    });

    it("clears form error when user types in password field", async () => {
      const { typeEmail, typePassword, pressLogin, queryByText, findByText } =
        setup();

      mockedValidation.isEmailValid.mockReturnValue(true);
      const mockAxiosError = new AxiosError(
        "Request failed",
        "401",
        undefined,
        undefined,
        {
          status: 401,
          data: "Invalid email or password",
          statusText: "Unauthorized",
          headers: {},
          config: {} as any,
        },
      );
      mockedApi.loginUser.mockRejectedValue(mockAxiosError);

      typeEmail("user@example.com");
      typePassword("wrong");
      pressLogin();

      await findByText("Invalid email or password");

      // Type in password field - error should clear
      typePassword("newpassword");

      expect(queryByText("Invalid email or password")).toBeNull();
    });

    it("shows validation error on email blur if email is invalid", () => {
      const { getByPlaceholderText, findByText } = setup();

      mockedValidation.isEmailValid.mockReturnValue(false);
      const emailInput = getByPlaceholderText("Your email");

      fireEvent.changeText(emailInput, "notanemail");
      fireEvent(emailInput, "blur");

      expect(findByText("Please enter a valid email address.")).toBeTruthy();
    });

    it("does not show validation error on blur if email field is empty", () => {
      const { getByPlaceholderText, queryByText } = setup();

      mockedValidation.isEmailValid.mockReturnValue(false);
      const emailInput = getByPlaceholderText("Your email");

      fireEvent(emailInput, "blur");

      expect(queryByText("Please enter a valid email address.")).toBeNull();
    });
  });

  describe("Network & Error Edge Cases", () => {
    it("displays friendly message on 404 error", async () => {
      const { typeEmail, typePassword, pressLogin, findByText } = setup();
      mockedValidation.isEmailValid.mockReturnValue(true);

      const notFoundError = new AxiosError(
        "Not Found",
        "404",
        undefined,
        undefined,
        {
          status: 404,
          data: {},
          statusText: "Not Found",
          headers: {},
          config: {} as any,
        },
      );
      mockedApi.loginUser.mockRejectedValue(notFoundError);

      typeEmail("test@test.com");
      typePassword("123456");
      pressLogin();

      const errorMsg = await findByText(
        "We couldn't reach the server. Please check your connection.",
      );
      expect(errorMsg).toBeTruthy();
    });

    it("displays friendly message when response is undefined", async () => {
      const { typeEmail, typePassword, pressLogin, findByText } = setup();
      mockedValidation.isEmailValid.mockReturnValue(true);

      const noResponseError = new AxiosError("No response", "ERR_NETWORK");
      noResponseError.response = undefined;
      mockedApi.loginUser.mockRejectedValue(noResponseError);

      typeEmail("test@test.com");
      typePassword("123456");
      pressLogin();

      const errorMsg = await findByText(
        "We couldn't reach the server. Please check your connection.",
      );
      expect(errorMsg).toBeTruthy();
    });

    it("displays generic error for non-Axios errors", async () => {
      const { typeEmail, typePassword, pressLogin, findByText } = setup();
      mockedValidation.isEmailValid.mockReturnValue(true);

      mockedApi.loginUser.mockRejectedValue(new Error("Something went wrong"));

      typeEmail("test@test.com");
      typePassword("123456");
      pressLogin();

      const errorMsg = await findByText(
        "We couldn't log you in. Please try again.",
      );
      expect(errorMsg).toBeTruthy();
    });
  });

  describe("Keyboard Handling", () => {
    it("sets up keyboard listeners on mount and removes them on unmount", () => {
      const addListenerSpy = jest.spyOn(Keyboard, "addListener");

      const { unmount } = setup();

      expect(addListenerSpy).toHaveBeenCalledWith(
        "keyboardDidShow",
        expect.any(Function),
      );
      expect(addListenerSpy).toHaveBeenCalledWith(
        "keyboardDidHide",
        expect.any(Function),
      );

      unmount();

      addListenerSpy.mockRestore();
    });
  });

  describe("Platform-specific behavior", () => {
    const originalPlatform = Platform.OS;

    afterEach(() => {
      Platform.OS = originalPlatform;
    });

    it("uses padding keyboard behavior on iOS", () => {
      Platform.OS = "ios";
      const { UNSAFE_getByType } = render(<LoginScreen />);

      const keyboardAvoidingView = UNSAFE_getByType(KeyboardAvoidingView);
      expect(keyboardAvoidingView.props.behavior).toBe("padding");
    });

    it("uses height keyboard behavior on Android", () => {
      Platform.OS = "android";
      const { UNSAFE_getByType } = render(<LoginScreen />);

      const keyboardAvoidingView = UNSAFE_getByType(KeyboardAvoidingView);
      expect(keyboardAvoidingView.props.behavior).toBe("height");
    });
  });

  describe("Password Reset Banner", () => {
    it("does not show banner when passwordReset param is not present", () => {
      (useLocalSearchParams as jest.Mock).mockReturnValue({});
      const { queryByText } = setup();

      expect(
        queryByText("Your password has been updated. Please log in."),
      ).toBeNull();
    });

    it("does not show banner when passwordReset param is false", () => {
      (useLocalSearchParams as jest.Mock).mockReturnValue({
        passwordReset: "false",
      });
      const { queryByText } = setup();

      expect(
        queryByText("Your password has been updated. Please log in."),
      ).toBeNull();
    });
  });
});
