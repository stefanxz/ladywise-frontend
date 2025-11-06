import LoginScreen from "@/app/(auth)/login";
import { AuthContext } from "@/app/_layout";
import * as api from "@/lib/api";
import * as auth from "@/lib/auth";
import * as validation from "@/lib/validation";
import * as asyncStorage from "@/utils/asyncStorageHelpers";
import { fireEvent, render, waitFor } from "@testing-library/react-native";
import React from "react";
const mockSetStatus = jest.fn();

// Provide a lightweight AuthContext mock so the screen can drive setStatus without pulling in the real layout.
jest.mock("@/app/_layout", () => {
  const React = require("react");
  const AuthContext = React.createContext({
    status: "signedOut",
    setStatus: mockSetStatus,
  });
  return {
    __esModule: true,
    AuthContext,
  };
});

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

// --- Mock modules --- //
jest.mock("@/lib/api", () => ({
  loginUser: jest.fn(),
}));

jest.mock("@/lib/auth", () => ({
  storeAuthData: jest.fn(),
  getAuthData: jest.fn(),
  clearAuthData: jest.fn(),
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
const mockedAuth = jest.mocked(auth);
const mockedValidation = jest.mocked(validation);
const mockedAsyncStorage = jest.mocked(asyncStorage);

describe("LoginScreen", () => {

  beforeEach(() => {
    jest.clearAllMocks();
    mockSetStatus.mockClear();
    mockedValidation.isEmailValid.mockImplementation(() => false);
    mockedAsyncStorage.getFailedLoginCount.mockResolvedValue(0);
  });

  const setup = () => {
    const utils = render(
      // Wrap the screen with the mocked context so navigation state updates can be asserted.
      <AuthContext.Provider value={{ status: "signedOut", setStatus: mockSetStatus }}>
        <LoginScreen />
      </AuthContext.Provider>
    );
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
        expect(mockedAuth.storeAuthData).toHaveBeenCalledWith(
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

      expect(mockSetStatus).toHaveBeenCalledWith("signedIn");
    });

    it("shows an error message and increments failed login count on failed login", async () => {
      mockedValidation.isEmailValid.mockReturnValue(true);
      mockedApi.loginUser.mockRejectedValue({
        isAxiosError: true,
        response: { status: 401 },
      } as any);

      const { typeEmail, typePassword, pressLogin, findByText } = setup();

      typeEmail("user@example.com");
      typePassword("wrong-password");
      pressLogin();

      const errorMessage = await findByText("Invalid email or password");
      expect(errorMessage).toBeTruthy();

      expect(mockedAuth.storeAuthData).not.toHaveBeenCalled();
      expect(mockRouter.replace).not.toHaveBeenCalled();
      expect(mockedAsyncStorage.incrementFailedLoginCount).toHaveBeenCalled();
      expect(mockSetStatus).not.toHaveBeenCalled();
    });
  });
});
