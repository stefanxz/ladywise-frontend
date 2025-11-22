import React from "react";
import { render, fireEvent, waitFor, act } from "@testing-library/react-native";
import { CycleQuestionsBottomSheet } from "@/components/CycleQuestionsBottomSheet/CycleQuestionsBottomSheet";

jest.mock("lucide-react-native", () => ({
  Droplet: () => <></>,
}));

jest.mock("@gorhom/bottom-sheet", () => {
  const React = require("react");
  const { View } = require("react-native");

  const BottomSheetModal = React.forwardRef((props: any, ref: any) => {
    React.useImperativeHandle(ref, () => ({
      close: jest.fn(),
      present: jest.fn(),
      dismiss: jest.fn(),
    }));
    return <View testID="bottom-sheet-mock">{props.children}</View>;
  });
  BottomSheetModal.displayName = "BottomSheetModal";

  return {
    BottomSheetModal,
    BottomSheetScrollView: (props: any) => <View>{props.children}</View>,
    BottomSheetBackdrop: (props: any) => <View {...props} />,
  };
});

jest.mock("@/data/cycle-questions.json", () => {
  return [
    {
      key: "flow",
      question: "How was your flow?",
      options: ["Light", "Heavy"],
      multiSelect: false,
    },
    {
      key: "symptoms",
      question: "Any symptoms?",
      options: ["Headache", "Cramps", "None of the above"],
      multiSelect: true,
    },
  ];
});

describe("CycleQuestionsBottomSheet Integration", () => {
  let mockOnSave: jest.Mock;
  let bottomSheetRef: React.RefObject<any>;

  const expectedEmptyState = {
    flow: null,
    symptoms: [],
    riskFactors: [],
  };

  beforeEach(() => {
    mockOnSave = jest.fn();
    bottomSheetRef = React.createRef();
  });

  it("Renders the title and introduction text", () => {
    const { getByText } = render(
      <CycleQuestionsBottomSheet
        bottomSheetRef={bottomSheetRef}
        onSave={mockOnSave}
      />,
    );

    expect(getByText("Daily Cycle Check-In")).toBeTruthy();
    expect(getByText(/Answer a few quick questions/)).toBeTruthy();
  });

  it("Renders questions from the mock data", () => {
    const { getByText } = render(
      <CycleQuestionsBottomSheet
        bottomSheetRef={bottomSheetRef}
        onSave={mockOnSave}
      />,
    );

    expect(getByText("How was your flow?")).toBeTruthy();
    expect(getByText("Any symptoms?")).toBeTruthy();
  });

  it("Collects answers and calls onSave with correct typed object", async () => {
    const { getByText, getByTestId } = render(
      <CycleQuestionsBottomSheet
        bottomSheetRef={bottomSheetRef}
        onSave={mockOnSave}
      />,
    );

    fireEvent.press(getByText("Light"));

    fireEvent.press(getByText("Headache"));
    fireEvent.press(getByText("Cramps"));

    const saveButton = getByTestId("save-button");

    await act(async () => {
      fireEvent.press(saveButton);
    });

    expect(mockOnSave).toHaveBeenCalledTimes(1);
    expect(mockOnSave).toHaveBeenCalledWith({
      ...expectedEmptyState,
      flow: "Light",
      symptoms: ["Headache", "Cramps"],
    });
  });

  it("Updates Save button text while saving", async () => {
    // Simulate a slow API call
    mockOnSave.mockImplementation(
      () => new Promise((resolve) => setTimeout(resolve, 500)),
    );

    const { getByTestId, getByText } = render(
      <CycleQuestionsBottomSheet
        bottomSheetRef={bottomSheetRef}
        onSave={mockOnSave}
      />,
    );

    const saveButton = getByTestId("save-button");

    fireEvent.press(saveButton);

    // Check immediate loading state
    expect(getByText("Saving answers...")).toBeTruthy();

    // Wait for async finish
    await waitFor(() => expect(mockOnSave).toHaveBeenCalled());
  });

  it("Closes the bottom sheet after successful save", async () => {
    mockOnSave.mockResolvedValue(true);

    const { getByTestId } = render(
      <CycleQuestionsBottomSheet
        bottomSheetRef={bottomSheetRef}
        onSave={mockOnSave}
      />,
    );

    const closeSpy = jest.spyOn(bottomSheetRef.current, "close");

    await act(async () => {
      fireEvent.press(getByTestId("save-button"));
    });

    expect(closeSpy).toHaveBeenCalled();
  });

  it("Does NOT close the bottom sheet if save fails", async () => {
    mockOnSave.mockRejectedValue(new Error("Network error"));
    const consoleSpy = jest
      .spyOn(console, "error")
      .mockImplementation(() => {});

    const { getByTestId } = render(
      <CycleQuestionsBottomSheet
        bottomSheetRef={bottomSheetRef}
        onSave={mockOnSave}
      />,
    );

    const closeSpy = jest.spyOn(bottomSheetRef.current, "close");

    await act(async () => {
      fireEvent.press(getByTestId("save-button"));
    });

    expect(mockOnSave).toHaveBeenCalled();
    expect(closeSpy).not.toHaveBeenCalled();

    consoleSpy.mockRestore();
  });

  it("Correctly handles deselecting an option in multi-select", async () => {
    const { getByText, getByTestId } = render(
      <CycleQuestionsBottomSheet
        bottomSheetRef={bottomSheetRef}
        onSave={mockOnSave}
      />,
    );

    // Select two items
    fireEvent.press(getByText("Headache"));
    fireEvent.press(getByText("Cramps"));
    // Deselect one
    fireEvent.press(getByText("Headache"));

    await act(async () => {
      fireEvent.press(getByTestId("save-button"));
    });

    expect(mockOnSave).toHaveBeenCalledWith(
      expect.objectContaining({
        symptoms: ["Cramps"], // Should only have Cramps
      }),
    );
  });

  it("Correctly handles 'None' option clearing others", async () => {
    const { getByText, getByTestId } = render(
      <CycleQuestionsBottomSheet
        bottomSheetRef={bottomSheetRef}
        onSave={mockOnSave}
      />,
    );

    // Select a symptom
    fireEvent.press(getByText("Headache"));

    // Select None (assuming your CycleQuestion component handles this logic internally via onChange)
    fireEvent.press(getByText("None of the above"));

    await act(async () => {
      fireEvent.press(getByTestId("save-button"));
    });

    expect(mockOnSave).toHaveBeenCalledWith(
      expect.objectContaining({
        symptoms: ["None of the above"],
      }),
    );
  });
});
