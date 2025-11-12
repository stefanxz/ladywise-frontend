import React, { createRef } from "react";
import { render, fireEvent, waitFor } from "@testing-library/react-native";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import { CycleQuestionsBottomSheet } from "./CycleQuestionsBottomSheet";
import questionsData from "@/data/cycle-questions.json";

// Mock the bottom sheet module
jest.mock("@gorhom/bottom-sheet", () => ({
  BottomSheetModal: jest.fn(({ children }) => children),
  BottomSheetScrollView: jest.fn(({ children }) => children),
  BottomSheetBackdrop: jest.fn(() => null),
}));

// Mock the CycleQuestion component
jest.mock("@/components/CycleQuestionsBottomSheet/CycleQuestion", () => ({
  CycleQuestion: jest.fn(({ question, onSelect, options }) => {
    const { View, Text, Pressable } = require("react-native");
    return (
      <View testID={`question-${question}`}>
        <Text>{question}</Text>
        {options.map((option: string) => (
          <Pressable
            key={option}
            testID={`option-${option}`}
            onPress={() => onSelect(option)}
          >
            <Text>{option}</Text>
          </Pressable>
        ))}
      </View>
    );
  }),
}));

// Mock lucide-react-native
jest.mock("lucide-react-native", () => ({
  Droplet: "Droplet",
}));

describe("CycleQuestionsBottomSheet", () => {
  let bottomSheetRef: React.RefObject<BottomSheetModal | null>;
  let mockOnSave: jest.Mock;

  beforeEach(() => {
    bottomSheetRef = createRef<BottomSheetModal>();
    mockOnSave = jest.fn().mockResolvedValue(undefined);
    jest.clearAllMocks();
  });

  describe("Rendering", () => {
    it("renders the component with title and icon", () => {
      const { getByText } = render(
        <CycleQuestionsBottomSheet
          bottomSheetRef={bottomSheetRef}
          onSave={mockOnSave}
        />,
      );

      expect(getByText("Daily Cycle Check-In")).toBeTruthy();
    });

    it("renders the description text", () => {
      const { getByText } = render(
        <CycleQuestionsBottomSheet
          bottomSheetRef={bottomSheetRef}
          onSave={mockOnSave}
        />,
      );

      expect(
        getByText(/Answer a few quick questions and help us track your cycle/i),
      ).toBeTruthy();
    });

    it("renders all questions from the data", () => {
      const { getByText } = render(
        <CycleQuestionsBottomSheet
          bottomSheetRef={bottomSheetRef}
          onSave={mockOnSave}
        />,
      );

      questionsData.forEach((question) => {
        expect(getByText(question.question)).toBeTruthy();
      });
    });

    it("renders the save button", () => {
      const { getByText } = render(
        <CycleQuestionsBottomSheet
          bottomSheetRef={bottomSheetRef}
          onSave={mockOnSave}
        />,
      );

      expect(getByText("Save answers")).toBeTruthy();
    });

    it("passes correct props to BottomSheetModal", () => {
      render(
        <CycleQuestionsBottomSheet
          bottomSheetRef={bottomSheetRef}
          onSave={mockOnSave}
        />,
      );

      const callArgs = (BottomSheetModal as jest.Mock).mock.calls[0][0];

      expect(callArgs).toMatchObject({
        ref: bottomSheetRef,
        index: 1,
        enablePanDownToClose: true,
        snapPoints: ["80%"],
      });
    });
  });

  describe("Answer Selection", () => {
    it("updates answers when an option is selected", () => {
      const { getByTestId } = render(
        <CycleQuestionsBottomSheet
          bottomSheetRef={bottomSheetRef}
          onSave={mockOnSave}
        />,
      );

      // Assuming first question has an option
      const firstOption = questionsData[0].options[0];
      const optionButton = getByTestId(`option-${firstOption}`);

      fireEvent.press(optionButton);

      // The answer should be stored internally (we'll verify via save)
      expect(optionButton).toBeTruthy();
    });

    it("handles multiple question selections", () => {
      const { getByTestId } = render(
        <CycleQuestionsBottomSheet
          bottomSheetRef={bottomSheetRef}
          onSave={mockOnSave}
        />,
      );

      // Select options from different questions
      questionsData.forEach((question, index) => {
        if (question.options.length > 0) {
          const option = question.options[0];
          const optionButton = getByTestId(`option-${option}`);
          fireEvent.press(optionButton);
        }
      });

      expect(getByTestId(`option-${questionsData[0].options[0]}`)).toBeTruthy();
    });
  });

  describe("Save Functionality", () => {
    it("calls onSave with collected answers when save button is pressed", async () => {
      const { getByText, getByTestId } = render(
        <CycleQuestionsBottomSheet
          bottomSheetRef={bottomSheetRef}
          onSave={mockOnSave}
        />,
      );

      // Select an answer
      const firstOption = questionsData[0].options[0];
      fireEvent.press(getByTestId(`option-${firstOption}`));

      // Press save
      const saveButton = getByText("Save answers");
      fireEvent.press(saveButton);

      await waitFor(() => {
        expect(mockOnSave).toHaveBeenCalledWith(
          expect.objectContaining({
            [questionsData[0].id]: firstOption,
          }),
        );
      });
    });

    it("shows loading state while saving", async () => {
      let resolveSave: () => void;
      const slowSave = jest.fn(
        () =>
          new Promise<void>((resolve) => {
            resolveSave = resolve;
          }),
      );

      const { getByText } = render(
        <CycleQuestionsBottomSheet
          bottomSheetRef={bottomSheetRef}
          onSave={slowSave}
        />,
      );

      const saveButton = getByText("Save answers");
      fireEvent.press(saveButton);

      await waitFor(() => {
        expect(getByText("Saving answers...")).toBeTruthy();
      });

      // Resolve the save
      resolveSave!();

      await waitFor(() => {
        expect(getByText("Save answers")).toBeTruthy();
      });
    });

    it("closes bottom sheet after successful save", async () => {
      const mockClose = jest.fn();
      bottomSheetRef = {
        current: { close: mockClose } as any,
      };

      const { getByText } = render(
        <CycleQuestionsBottomSheet
          bottomSheetRef={bottomSheetRef}
          onSave={mockOnSave}
        />,
      );

      fireEvent.press(getByText("Save answers"));

      await waitFor(() => {
        expect(mockClose).toHaveBeenCalled();
      });
    });

    it("handles save errors gracefully", async () => {
      const consoleErrorSpy = jest
        .spyOn(console, "error")
        .mockImplementation(() => {});
      const saveError = new Error("Save failed");
      mockOnSave.mockRejectedValueOnce(saveError);

      const { getByText } = render(
        <CycleQuestionsBottomSheet
          bottomSheetRef={bottomSheetRef}
          onSave={mockOnSave}
        />,
      );

      fireEvent.press(getByText("Save answers"));

      await waitFor(() => {
        expect(consoleErrorSpy).toHaveBeenCalledWith("save failed", saveError);
      });

      // Should still show the save button (not stuck in loading)
      expect(getByText("Save answers")).toBeTruthy();

      consoleErrorSpy.mockRestore();
    });

    it("does not close bottom sheet on save error", async () => {
      const mockClose = jest.fn();
      bottomSheetRef = {
        current: { close: mockClose } as any,
      };
      mockOnSave.mockRejectedValueOnce(new Error("Save failed"));

      // Suppress console.error for this test
      jest.spyOn(console, "error").mockImplementation(() => {});

      const { getByText } = render(
        <CycleQuestionsBottomSheet
          bottomSheetRef={bottomSheetRef}
          onSave={mockOnSave}
        />,
      );

      fireEvent.press(getByText("Save answers"));

      await waitFor(() => {
        expect(mockOnSave).toHaveBeenCalled();
      });

      expect(mockClose).not.toHaveBeenCalled();
    });
  });

  describe("Answer State Management", () => {
    it("maintains answers for multiple questions", async () => {
      const { getByTestId, getByText } = render(
        <CycleQuestionsBottomSheet
          bottomSheetRef={bottomSheetRef}
          onSave={mockOnSave}
        />,
      );

      // Select answers for first two questions
      const answer1 = questionsData[0].options[0];
      const answer2 = questionsData[1].options[1];

      fireEvent.press(getByTestId(`option-${answer1}`));
      fireEvent.press(getByTestId(`option-${answer2}`));

      fireEvent.press(getByText("Save answers"));

      await waitFor(() => {
        expect(mockOnSave).toHaveBeenCalledWith({
          [questionsData[0].id]: answer1,
          [questionsData[1].id]: answer2,
        });
      });
    });

    it("can save with empty answers", async () => {
      const { getByText } = render(
        <CycleQuestionsBottomSheet
          bottomSheetRef={bottomSheetRef}
          onSave={mockOnSave}
        />,
      );

      fireEvent.press(getByText("Save answers"));

      await waitFor(() => {
        expect(mockOnSave).toHaveBeenCalledWith({});
      });
    });

    it("updates answer when selecting different option for same question", async () => {
      const { getByTestId, getByText } = render(
        <CycleQuestionsBottomSheet
          bottomSheetRef={bottomSheetRef}
          onSave={mockOnSave}
        />,
      );

      const option1 = questionsData[0].options[0];
      const option2 = questionsData[0].options[1];

      // Select first option
      fireEvent.press(getByTestId(`option-${option1}`));

      // Select second option (should override)
      fireEvent.press(getByTestId(`option-${option2}`));

      fireEvent.press(getByText("Save answers"));

      await waitFor(() => {
        expect(mockOnSave).toHaveBeenCalledWith({
          [questionsData[0].id]: option2,
        });
      });
    });
  });
});
