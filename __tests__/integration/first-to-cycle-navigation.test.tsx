/**
 * Integration Test — First Questionnaire → Cycle Questionnaire
 * ------------------------------------------------------------
 * Verifies that:
 * - User transitions correctly after completing the first questionnaire
 * - Redirect occurs if not allowed to access cycle questionnaire
 * - Edge cases and backend errors are handled gracefully
 */

import CycleQuestionnaireMock from "@/app/onboarding/cycle-questionnaire-mock";
import FirstQuestionnaireCompletion from "@/app/onboarding/first-questionnaire-completion";
import {
    checkCycleQuestionnaireAccess,
    markFirstQuestionnaireComplete,
} from "@/lib/questionnaireService";
import { act, fireEvent, render, waitFor } from "@testing-library/react-native";
import React from "react";
import { Alert } from "react-native";

//Unified router mock (shared reference across components)
const mockRouter = {
  push: jest.fn(),
  replace: jest.fn(),
};

//Mock all external dependencies before imports
jest.mock("expo-router", () => ({
  useRouter: () => mockRouter,
}));

jest.mock("@expo/vector-icons");
jest.mock("react-native-safe-area-context", () => {
  const React = require("react");
  return {
    SafeAreaView: ({ children }: { children: React.ReactNode }) => (
      <>{children}</>
    ),
  };
});

//Mock shared components
jest.mock("@/components/AppBarBackButton/AppBarBackButton", () => ({
  AppBar: () => null,
}));
jest.mock("@/components/ThemedPressable/ThemedPressable", () => ({
  ThemedPressable: ({
    label,
    onPress,
  }: {
    label: string;
    onPress: () => void;
  }) => {
    const { Pressable, Text } = require("react-native");
    return (
      <Pressable onPress={onPress} testID="continue-btn">
        <Text>{label}</Text>
      </Pressable>
    );
  },
}));

//Mock questionnaire service methods
jest.mock("@/lib/questionnaireService", () => ({
  markFirstQuestionnaireComplete: jest.fn(),
  checkCycleQuestionnaireAccess: jest.fn(),
}));

const mockMarkComplete = markFirstQuestionnaireComplete as jest.Mock;
const mockCheckAccess = checkCycleQuestionnaireAccess as jest.Mock;

beforeEach(() => {
  jest.clearAllMocks();
});

describe("Integration: First Questionnaire → Cycle Questionnaire", () => {
  it("navigates to cycle questionnaire after successful completion", async () => {
    mockMarkComplete.mockResolvedValueOnce({ success: true });

    const { getByTestId } = render(<FirstQuestionnaireCompletion />);
    fireEvent.press(getByTestId("continue-btn"));

    await waitFor(() =>
      expect(mockRouter.push).toHaveBeenCalledWith(
        "/onboarding/cycle-questionnaire-mock"
      )
    );
  });

  it("shows alert if backend returns success=false", async () => {
    const alertSpy = jest.spyOn(Alert, "alert").mockImplementation(() => {});
    mockMarkComplete.mockResolvedValueOnce({ success: false });

    const { getByTestId } = render(<FirstQuestionnaireCompletion />);
    fireEvent.press(getByTestId("continue-btn"));

    await waitFor(() => {
      expect(alertSpy).toHaveBeenCalled();
    });

    alertSpy.mockRestore();
  });

  it("blocks access if completion flag is false", async () => {
    mockCheckAccess.mockResolvedValueOnce({ allowed: false });

    render(<CycleQuestionnaireMock />);

    // Wait for async useEffect + mock call
    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 100));
    });

    expect(mockRouter.replace).toHaveBeenCalledWith(
      "/onboarding/first-questionnaire-completion"
    );
  });

  it("allows access if completion flag is true", async () => {
    mockCheckAccess.mockResolvedValueOnce({ allowed: true });

    const { getByText } = render(<CycleQuestionnaireMock />);

    await waitFor(() => {
      expect(getByText("Cycle Questionnaire")).toBeTruthy();
    });
  });

  it("handles backend errors gracefully (mock allows access)", async () => {
    mockCheckAccess.mockRejectedValueOnce(new Error("Network error"));

    const { getByText } = render(<CycleQuestionnaireMock />);

    await waitFor(() => {
      expect(getByText("Cycle Questionnaire")).toBeTruthy();
    });
  });
});
