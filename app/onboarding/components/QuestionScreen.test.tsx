import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import { QuestionScreen, BinaryChoiceGroup, MultiSelectGroup } from "./QuestionScreen";
import { Text, View } from "react-native";

// Mock Safe Area
jest.mock("react-native-safe-area-context", () => {
  const { View } = require("react-native");
  return {
    SafeAreaView: ({ children, ...props }: any) => <View {...props}>{children}</View>,
  };
});

// Mock ProgressBar
jest.mock("@/components/ProgressBar/ProgressBar", () => {
  const { View } = require("react-native");
  return {
    ProgressBar: () => <View testID="progress-bar" />,
  };
});

describe("QuestionScreen Component", () => {
  it("renders correctly with all props", () => {
    const onSkip = jest.fn();
    const { getByText, getByTestId } = render(
      <QuestionScreen
        step={1}
        totalSteps={5}
        title="Test Title"
        description="Test Description"
        onSkip={onSkip}
        showSkip={true}
        footer={<Text>Footer</Text>}
      >
        <Text>Child Content</Text>
      </QuestionScreen>
    );

    expect(getByText("Test Title")).toBeTruthy();
    expect(getByText("Test Description")).toBeTruthy();
    expect(getByText("Child Content")).toBeTruthy();
    expect(getByText("Footer")).toBeTruthy();
    expect(getByText("Skip")).toBeTruthy();
    expect(getByTestId("progress-bar")).toBeTruthy();

    fireEvent.press(getByText("Skip"));
    expect(onSkip).toHaveBeenCalled();
  });

  it("renders without description, footer, and skip button", () => {
    const { getByText, queryByText } = render(
      <QuestionScreen
        step={1}
        title="Minimal Title"
        showSkip={false}
      >
        <Text>Child Content</Text>
      </QuestionScreen>
    );

    expect(getByText("Minimal Title")).toBeTruthy();
    expect(queryByText("Test Description")).toBeNull();
    expect(queryByText("Footer")).toBeNull();
    expect(queryByText("Skip")).toBeNull();
  });
});

describe("BinaryChoiceGroup Component", () => {
  it("renders correctly with question and handles selection", () => {
    const onChange = jest.fn();
    const { getByText, getByTestId } = render(
      <BinaryChoiceGroup
        question="Yes or No?"
        value={true}
        onChange={onChange}
        testIDPrefix="choice"
      />
    );

    expect(getByText("Yes or No?")).toBeTruthy();
    
    const yesButton = getByTestId("choice-yes");
    const noButton = getByTestId("choice-no");

    // Check styling for selected vs unselected
    // Note: checking styles in React Native testing library can be tricky without inspecting props.
    // We assume className logic works if rendered. We can check if `onChange` is called.

    fireEvent.press(noButton);
    expect(onChange).toHaveBeenCalledWith(false);
  });

  it("renders without question and testIDPrefix", () => {
    const onChange = jest.fn();
    const { queryByText, getAllByText } = render(
      <BinaryChoiceGroup
        question=""
        value={null}
        onChange={onChange}
      />
    );

    expect(queryByText("Yes or No?")).toBeNull();
    expect(getAllByText(/Yes|No/)).toHaveLength(2);
  });
});

describe("MultiSelectGroup Component", () => {
  const options = [
    { id: "opt1", label: "Option 1" },
    { id: "opt2", label: "Option 2" },
  ];

  it("renders correctly with question and handles toggling", () => {
    const onToggle = jest.fn();
    const { getByText, getByTestId } = render(
      <MultiSelectGroup
        question="Select options"
        options={options}
        selected={["opt1"]}
        onToggle={onToggle}
      />
    );

    expect(getByText("Select options")).toBeTruthy();
    
    // Check accessibility state or props logic
    const opt1 = getByTestId("multiselect-option-opt1");
    const opt2 = getByTestId("multiselect-option-opt2");

    expect(opt1.props.accessibilityState.selected).toBe(true);
    expect(opt2.props.accessibilityState.selected).toBe(false);

    fireEvent.press(opt2);
    expect(onToggle).toHaveBeenCalledWith("opt2");
  });

  it("renders without question", () => {
    const onToggle = jest.fn();
    const { queryByText, getByText } = render(
      <MultiSelectGroup
        question=""
        options={options}
        selected={[]}
        onToggle={onToggle}
      />
    );

    expect(queryByText("Select options")).toBeNull();
    expect(getByText("Option 1")).toBeTruthy();
  });
});
