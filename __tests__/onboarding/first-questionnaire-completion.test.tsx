/**
 * @file first-questionnaire-completion.test.tsx
 * Tests UI rendering + navigation behavior
 */

import FirstQuestionnaireCompletion from "@/app/onboarding/first-questionnaire-completion";
import { markFirstQuestionnaireComplete } from "@/lib/questionnaireService";
import { fireEvent, render, waitFor } from "@testing-library/react-native";
import { Alert } from "react-native";

// Shared router mock
const mockRouter = {
  push: jest.fn(),
};
jest.mock("expo-router", () => ({
  useRouter: () => mockRouter,
}));

jest.mock("@expo/vector-icons");
jest.mock("react-native-safe-area-context", () => {
  const React = require("react");
  return { SafeAreaView: ({ children }: { children: React.ReactNode }) => <>{children}</> };
});

jest.mock("@/components/ThemedPressable/ThemedPressable", () => ({
  ThemedPressable: ({ label, onPress }: any) => {
    const { Pressable, Text } = require("react-native");
    return (
      <Pressable onPress={onPress} testID="continue-btn">
        <Text>{label}</Text>
      </Pressable>
    );
  },
}));

jest.mock("@/lib/questionnaireService", () => ({
  markFirstQuestionnaireComplete: jest.fn(),
}));

jest.mock("@/components/AppBarBackButton/AppBarBackButton", () => ({
  AppBar: () => null,
  AppBarBackButton: () => null,
}));


const mockMark = markFirstQuestionnaireComplete as jest.Mock;

beforeEach(() => {
  jest.clearAllMocks();
});

describe("FirstQuestionnaireCompletion", () => {
  it("renders the correct UI text and button", () => {
    const { getByText } = render(<FirstQuestionnaireCompletion />);

    expect(getByText(/All set/i)).toBeTruthy();
    expect(getByText(/Thank you for sharing/i)).toBeTruthy();
    expect(getByText(/Continue/i)).toBeTruthy();
  });

  it("navigates to the cycle questionnaire on successful completion", async () => {
    mockMark.mockResolvedValueOnce({ success: true });

    const { getByTestId } = render(<FirstQuestionnaireCompletion />);
    fireEvent.press(getByTestId("continue-btn"));

    await waitFor(() =>
      expect(mockRouter.push).toHaveBeenCalledWith("/onboarding/cycle-questionnaire-mock")
    );
  });

  it("shows an alert if backend returns success=false", async () => {
    mockMark.mockResolvedValueOnce({ success: false });
    const alertSpy = jest.spyOn(Alert, "alert").mockImplementation(() => {});

    const { getByTestId } = render(<FirstQuestionnaireCompletion />);
    fireEvent.press(getByTestId("continue-btn"));

    await waitFor(() => expect(alertSpy).toHaveBeenCalled());
    alertSpy.mockRestore();
  });

  it("shows loading indicator state", async () => {
    mockMark.mockResolvedValueOnce({ success: true });

    const { getByTestId, queryByTestId } = render(<FirstQuestionnaireCompletion />);
    fireEvent.press(getByTestId("continue-btn"));

    // Spinner mounts immediately while waiting
    await waitFor(() => {
      expect(queryByTestId("activity-indicator")).toBeTruthy();
    });
  });
});
