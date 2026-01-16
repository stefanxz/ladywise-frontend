/**
 * @file first-to-cycle-navigation.test.tsx
 * Integration test: verifies that finishing the first questionnaire
 * navigates the user to the Home screen.
 */

import FirstQuestionnaireCompletion from "@/app/onboarding/first-questionnaire-completion";
import { markFirstQuestionnaireComplete } from "@/lib/api";
import { fireEvent, render, waitFor } from "@testing-library/react-native";

jest.mock("@expo/vector-icons", () => ({
  Ionicons: () => null,
}));

// Mock router
const mockRouter = {
  replace: jest.fn(),
};

jest.mock("expo-router", () => ({
  useRouter: () => mockRouter,
}));

jest.mock("@/lib/api", () => ({
  markFirstQuestionnaireComplete: jest.fn(),
}));

jest.mock("react-native-safe-area-context", () => {
  const React = require("react");
  return { SafeAreaView: ({ children }: any) => <>{children}</> };
});

jest.mock("@expo/vector-icons");

// Mock ThemedPressable to simplify
jest.mock("@/components/ThemedPressable/ThemedPressable", () => {
  const { TouchableOpacity, Text } = require("react-native");
  return {
    ThemedPressable: ({ onPress, testID, label }: any) => (
      <TouchableOpacity onPress={onPress} testID={testID}>
        <Text>{label}</Text>
      </TouchableOpacity>
    ),
  };
});

const mockMark = markFirstQuestionnaireComplete as jest.Mock;

beforeEach(() => {
  jest.clearAllMocks();
});

describe("First questionnaire to Home navigation flow", () => {
  it("navigates to /(main)/home after successful completion", async () => {
    mockMark.mockResolvedValueOnce({ success: true });

    const { getByTestId } = render(<FirstQuestionnaireCompletion />);
    fireEvent.press(getByTestId("continue-btn"));

    await waitFor(() =>
      expect(mockRouter.replace).toHaveBeenCalledWith("/(main)/home"),
    );
  });

  it("shows alert on completion error", async () => {
    const alertSpy = jest.spyOn(require("react-native").Alert, "alert");
    mockRouter.replace.mockImplementationOnce(() => {
      throw new Error("Navigation Failed");
    });

    const { getByTestId } = render(<FirstQuestionnaireCompletion />);
    fireEvent.press(getByTestId("continue-btn"));

    await waitFor(() => {
      expect(alertSpy).toHaveBeenCalledWith(
        "Connection Error",
        expect.stringContaining("could not update your progress"),
      );
    });
  });

  // TODO: uncomment this once backend endpoint works
  // it("does NOT navigate when backend fails", async () => {
  //   mockMark.mockResolvedValueOnce({ success: false });
  //
  //   const { getByTestId } = render(<FirstQuestionnaireCompletion />);
  //   fireEvent.press(getByTestId("continue-btn"));
  //
  //   await waitFor(() => {
  //     expect(mockRouter.replace).not.toHaveBeenCalled();
  //   });
  // });
});
