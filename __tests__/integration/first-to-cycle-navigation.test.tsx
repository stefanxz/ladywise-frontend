/**
 * Integration Test — First Questionnaire -> Cycle Questionnaire 
 */

import CycleQuestionnaireMock from "@/app/onboarding/cycle-questionnaire-mock";
import FirstQuestionnaireCompletion from "@/app/onboarding/first-questionnaire-completion";
import {
  checkCycleQuestionnaireAccess,
  markFirstQuestionnaireComplete,
} from "@/lib/questionnaireService";
import { fireEvent, render, waitFor } from "@testing-library/react-native";

// Shared router mock
const mockRouter = {
  push: jest.fn(),
  replace: jest.fn(),
};

jest.mock("expo-router", () => ({
  useRouter: () => mockRouter,
}));

jest.mock("@expo/vector-icons");
jest.mock("react-native-safe-area-context", () => {
  const React = require("react");
  return { SafeAreaView: ({ children }: { children: React.ReactNode }) => <>{children}</> };
});

jest.mock("@/components/AppBarBackButton/AppBarBackButton", () => ({ AppBar: () => null }));
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
  checkCycleQuestionnaireAccess: jest.fn(),
}));

const mockMark = markFirstQuestionnaireComplete as jest.Mock;
const mockCheck = checkCycleQuestionnaireAccess as jest.Mock;

beforeEach(() => {
  jest.clearAllMocks();
});

describe("First Questionnaire → Cycle Questionnaire Flow", () => {
  it("redirects to cycle questionnaire after success", async () => {
    mockMark.mockResolvedValueOnce({ success: true });

    const { getByTestId } = render(<FirstQuestionnaireCompletion />);
    fireEvent.press(getByTestId("continue-btn"));

    await waitFor(() =>
      expect(mockRouter.push).toHaveBeenCalledWith("/onboarding/cycle-questionnaire-mock")
    );
  });

  it("redirects back if access is denied", async () => {
    mockCheck.mockResolvedValueOnce({ allowed: false });

    render(<CycleQuestionnaireMock />);

    await waitFor(() =>
      expect(mockRouter.replace).toHaveBeenCalledWith(
        "/onboarding/first-questionnaire-completion"
      )
    );
  });

  it("allows access when allowed=true", async () => {
    mockCheck.mockResolvedValueOnce({ allowed: true });

    const { getByText } = render(<CycleQuestionnaireMock />);

    await waitFor(() => expect(getByText(/Cycle Questionnaire/i)).toBeTruthy());
  });

  it("allows access when backend fails (mock fallback)", async () => {
    mockCheck.mockRejectedValueOnce(new Error("network"));

    const { getByText } = render(<CycleQuestionnaireMock />);

    await waitFor(() => expect(getByText(/Cycle Questionnaire/i)).toBeTruthy());
  });
});
