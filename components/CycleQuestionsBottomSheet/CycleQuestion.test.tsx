import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import { CycleQuestion } from "./CycleQuestion";

// Mock CycleQuestionOptionPill to simplify interactions
jest.mock("./CycleQuestionOptionPill", () => {
  const { Text, TouchableOpacity } = require("react-native");
  return {
    CycleQuestionOptionPill: ({ label, onPress, selected }: any) => (
      <TouchableOpacity onPress={onPress} testID={`pill-${label}`}>
        <Text>{label} {selected ? "(selected)" : ""}</Text>
      </TouchableOpacity>
    ),
  };
});

describe("CycleQuestion", () => {
  const defaultProps = {
    question: "How do you feel?",
    options: ["Happy", "Sad", "Neutral", "None of the above"],
    onSelect: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders correctly", () => {
    const { getByText } = render(<CycleQuestion {...defaultProps} value={null} />);
    expect(getByText("How do you feel?")).toBeTruthy();
    expect(getByText("Happy")).toBeTruthy();
  });

  describe("Single Select", () => {
    it("selects an option", () => {
      const { getByTestId } = render(<CycleQuestion {...defaultProps} value={null} />);
      fireEvent.press(getByTestId("pill-Happy"));
      expect(defaultProps.onSelect).toHaveBeenCalledWith("Happy");
    });

    it("marks option as selected", () => {
      const { getByText } = render(<CycleQuestion {...defaultProps} value="Happy" />);
      expect(getByText("Happy (selected)")).toBeTruthy();
    });
  });

  describe("Multi Select", () => {
    it("adds an option to selection", () => {
      const { getByTestId } = render(
        <CycleQuestion {...defaultProps} multiSelect={true} value={[]} />
      );
      fireEvent.press(getByTestId("pill-Happy"));
      expect(defaultProps.onSelect).toHaveBeenCalledWith(["Happy"]);
    });

    it("removes an option from selection", () => {
      const { getByTestId } = render(
        <CycleQuestion {...defaultProps} multiSelect={true} value={["Happy", "Sad"]} />
      );
      fireEvent.press(getByTestId("pill-Happy"));
      expect(defaultProps.onSelect).toHaveBeenCalledWith(["Sad"]);
    });

    it("clears 'None' when selecting a valid option", () => {
      const { getByTestId } = render(
        <CycleQuestion {...defaultProps} multiSelect={true} value={["None of the above"]} />
      );
      fireEvent.press(getByTestId("pill-Happy"));
      // Should result in JUST Happy, removing None
      expect(defaultProps.onSelect).toHaveBeenCalledWith(["Happy"]);
    });

    it("clears other options when selecting 'None'", () => {
      const { getByTestId } = render(
        <CycleQuestion {...defaultProps} multiSelect={true} value={["Happy", "Sad"]} />
      );
      fireEvent.press(getByTestId("pill-None of the above"));
      // Should result in JUST None
      expect(defaultProps.onSelect).toHaveBeenCalledWith(["None of the above"]);
    });

    it("handles selection correctly when value is not array (defensive)", () => {
      const { getByTestId } = render(
        // @ts-ignore - simulating bad prop
        <CycleQuestion {...defaultProps} multiSelect={true} value={null} />
      );
      fireEvent.press(getByTestId("pill-Happy"));
      expect(defaultProps.onSelect).toHaveBeenCalledWith(["Happy"]);
    });
  });
});
