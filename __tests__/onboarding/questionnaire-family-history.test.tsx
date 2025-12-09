import QuestionnaireFamilyHistory from "@/app/onboarding/questionnaire-family-history";
import { useQuestionnaire } from "@/app/onboarding/QuestionnaireContext";
import { fireEvent, render, screen } from "@testing-library/react-native";
import { useRouter } from "expo-router";
import React from "react";

// Mock the router
jest.mock("expo-router", () => ({
  useRouter: jest.fn(),
}));

// Mock the QuestionnaireContext
jest.mock("@/app/onboarding/QuestionnaireContext");

const mockPush = jest.fn();
(useRouter as jest.Mock).mockReturnValue({
  push: mockPush,
});

describe("QuestionnaireFamilyHistory", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders correctly", () => {
    (useQuestionnaire as jest.Mock).mockReturnValue({
      answers: { familyHistory: { anemia: null, thrombosis: null } },
      updateAnswers: jest.fn(),
    });
    render(<QuestionnaireFamilyHistory />);
    expect(screen.getByText("Family health matters 🌿")).toBeTruthy();
    expect(screen.getByText("Anemia")).toBeTruthy();
    expect(screen.getByText("Thrombosis")).toBeTruthy();
  });

  it("calls updateAnswers and navigates on continue when inputs are valid", () => {
    const updateAnswers = jest.fn();
    (useQuestionnaire as jest.Mock).mockReturnValue({
      answers: { familyHistory: { anemia: null, thrombosis: null } },
      updateAnswers,
    });
    render(<QuestionnaireFamilyHistory />);

    fireEvent.press(screen.getByTestId("family-anemia-no"));
    fireEvent.press(screen.getByTestId("family-thrombosis-yes"));
    fireEvent.press(screen.getByTestId("themed-pressable"));

    expect(updateAnswers).toHaveBeenCalledWith({
      familyHistory: {
        anemia: false,
        thrombosis: true,
      },
    });
    expect(mockPush).toHaveBeenCalledWith("./questionnaire-anemia-risk");
  });

  it("disables continue until an answer is given", () => {
    const updateAnswers = jest.fn();
    (useQuestionnaire as jest.Mock).mockReturnValue({
      answers: { familyHistory: { anemia: null, thrombosis: null } },
      updateAnswers,
    });
    render(<QuestionnaireFamilyHistory />);

    const continueButton = screen.getByTestId("themed-pressable");
    expect(continueButton.props.accessibilityState.disabled).toBe(true);

    fireEvent.press(screen.getByTestId("family-anemia-yes"));
    expect(continueButton.props.accessibilityState.disabled).toBe(false);

    fireEvent.press(continueButton);
    expect(updateAnswers).toHaveBeenCalled();
    expect(mockPush).toHaveBeenCalledWith("./questionnaire-anemia-risk");
  });
});
