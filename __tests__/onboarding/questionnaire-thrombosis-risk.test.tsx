import QuestionnaireThrombosisRisk from "@/app/onboarding/questionnaire-thrombosis-risk";
import { useQuestionnaire } from "@/app/onboarding/QuestionnaireContext";
import { fireEvent, render, screen } from "@testing-library/react-native";
import { useRouter } from "expo-router";
import React from "react";

jest.mock("expo-router", () => ({
  useRouter: jest.fn(),
}));

jest.mock("@/app/onboarding/QuestionnaireContext");

const mockPush = jest.fn();
(useRouter as jest.Mock).mockReturnValue({
  push: mockPush,
});

describe("QuestionnaireThrombosisRisk", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders correctly", () => {
    (useQuestionnaire as jest.Mock).mockReturnValue({
      answers: { thrombosisRiskFactors: [] },
    });
    render(<QuestionnaireThrombosisRisk />);
    expect(screen.getByText("Health background Thrombosis risk 💧")).toBeTruthy();
    expect(screen.getByText("Smoking")).toBeTruthy();
  });

  it("selects and deselects options", () => {
    (useQuestionnaire as jest.Mock).mockReturnValue({
      answers: { thrombosisRiskFactors: [] },
      updateAnswers: jest.fn(),
    });
    render(<QuestionnaireThrombosisRisk />);
    const smoking = screen.getByTestId("multiselect-option-smoking");
    fireEvent.press(smoking);
  });

  it('handles "None of the above" correctly', () => {
    (useQuestionnaire as jest.Mock).mockReturnValue({
      answers: { thrombosisRiskFactors: [] },
      updateAnswers: jest.fn(),
    });
    render(<QuestionnaireThrombosisRisk />);
    const smoking = screen.getByTestId("multiselect-option-smoking");
    const none = screen.getByTestId("multiselect-option-none");

    fireEvent.press(smoking);
    fireEvent.press(none);
  });

  it("calls updateAnswers and navigates on continue", () => {
    const updateAnswers = jest.fn();
    (useQuestionnaire as jest.Mock).mockReturnValue({
      answers: { thrombosisRiskFactors: [] },
      updateAnswers,
    });
    render(<QuestionnaireThrombosisRisk />);

    const smoking = screen.getByTestId("multiselect-option-smoking");
    fireEvent.press(smoking);

    fireEvent.press(screen.getByText("Continue"));

    expect(updateAnswers).toHaveBeenCalledWith({
      thrombosisRiskFactors: ["smoking"],
    });
    expect(mockPush).toHaveBeenCalledWith(
      "./questionnaire-final-questions",
    );
  });

  it("disables continue until an option is selected", () => {
    const updateAnswers = jest.fn();
    (useQuestionnaire as jest.Mock).mockReturnValue({
      answers: { thrombosisRiskFactors: [] },
      updateAnswers,
    });
    render(<QuestionnaireThrombosisRisk />);

    const continueButton = screen.getByTestId("themed-pressable");
    expect(continueButton.props.accessibilityState.disabled).toBe(true);

    fireEvent.press(screen.getByTestId("multiselect-option-smoking"));
    expect(continueButton.props.accessibilityState.disabled).toBe(false);

    fireEvent.press(screen.getByText("Continue"));
    expect(updateAnswers).toHaveBeenCalled();
  });
});