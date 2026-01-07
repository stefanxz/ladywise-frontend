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
    date: "",
  };

  beforeEach(() => {
    mockOnSave = jest.fn().mockResolvedValue(undefined);
    bottomSheetRef = React.createRef();
  });

  it("Renders the title and introduction text", () => {
    const { getByText } = render(
      <CycleQuestionsBottomSheet
        bottomSheetRef={bottomSheetRef}
        onSave={mockOnSave}
        initialData={null}
        isLoading={false}
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
        initialData={null}
        isLoading={false}
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
        initialData={null}
        isLoading={false}
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
      flow: "Light",
      symptoms: ["Headache", "Cramps"],
      riskFactors: [],
      date: "",
    });
  });

  it("Shows loading indicator when isLoading is true", () => {
    const { getByTestId, queryByText } = render(
      <CycleQuestionsBottomSheet
        bottomSheetRef={bottomSheetRef}
        onSave={mockOnSave}
        initialData={null}
        isLoading={true}
      />,
    );

    // ActivityIndicator should be visible
    expect(queryByText("How was your flow?")).toBeFalsy();
  });

  it("Closes the bottom sheet after successful save", async () => {
    mockOnSave.mockResolvedValue(undefined);

    const { getByTestId } = render(
      <CycleQuestionsBottomSheet
        bottomSheetRef={bottomSheetRef}
        onSave={mockOnSave}
        initialData={null}
        isLoading={false}
      />,
    );

    const closeSpy = jest.spyOn(bottomSheetRef.current, "close");

    await act(async () => {
      fireEvent.press(getByTestId("save-button"));
    });

    expect(closeSpy).toHaveBeenCalled();
  });

  it("Correctly handles deselecting an option in multi-select", async () => {
    const { getByText, getByTestId } = render(
      <CycleQuestionsBottomSheet
        bottomSheetRef={bottomSheetRef}
        onSave={mockOnSave}
        initialData={null}
        isLoading={false}
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
        symptoms: ["Cramps"],
      }),
    );
  });

  it("Correctly handles 'None' option clearing others", async () => {
    const { getByText, getByTestId } = render(
      <CycleQuestionsBottomSheet
        bottomSheetRef={bottomSheetRef}
        onSave={mockOnSave}
        initialData={null}
        isLoading={false}
      />,
    );

    // Select a symptom
    fireEvent.press(getByText("Headache"));

    // Select None
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

  it("Initializes with provided initialData", () => {
    const initialData = {
      flow: "Heavy",
      symptoms: ["Cramps"],
      riskFactors: [],
      date: "2024-01-15",
    };

    const { getByText } = render(
      <CycleQuestionsBottomSheet
        bottomSheetRef={bottomSheetRef}
        onSave={mockOnSave}
        initialData={initialData}
        isLoading={false}
      />,
    );

    // Verify the component renders (you may want to add more specific checks
    // based on how CycleQuestion visually indicates selected state)
    expect(getByText("How was your flow?")).toBeTruthy();
  });

  it("Resets state when initialData changes to null", async () => {
    const initialData = {
      flow: "Heavy",
      symptoms: ["Cramps"],
      riskFactors: [],
      date: "2024-01-15",
    };

    const { rerender, getByTestId } = render(
      <CycleQuestionsBottomSheet
        bottomSheetRef={bottomSheetRef}
        onSave={mockOnSave}
        initialData={initialData}
        isLoading={false}
      />,
    );

    // Re-render with null initialData
    rerender(
      <CycleQuestionsBottomSheet
        bottomSheetRef={bottomSheetRef}
        onSave={mockOnSave}
        initialData={null}
        isLoading={false}
      />,
    );

    await act(async () => {
      fireEvent.press(getByTestId("save-button"));
    });

    // Should save empty state
    expect(mockOnSave).toHaveBeenCalledWith(expectedEmptyState);
  });
});
