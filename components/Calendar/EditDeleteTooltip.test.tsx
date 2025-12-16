import React from "react";
import { Dimensions } from "react-native";
import { render, fireEvent, screen } from "@testing-library/react-native";

// Mocks and setup

// Mock feather icons
jest.mock("@expo/vector-icons", () => {
  const { View } = require("react-native");
  return {
    Feather: (props: any) => <View testID={`icon-${props.name}`} {...props} />,
  };
});

describe("EditDeleteTooltip component", () => {
  let PeriodActionTooltip: any;
  const mockOnEditPeriod = jest.fn();
  const mockOnEditCycleQuestionnaire = jest.fn();
  const mockOnDelete = jest.fn();
  const mockOnClose = jest.fn();

  beforeAll(() => {
    // Mock Dimensions to control the screen width
    jest.spyOn(Dimensions, "get").mockReturnValue({
      width: 400,
      height: 800,
      scale: 1,
      fontScale: 1,
    } as any);

    // Require the component dynamically
    // By doing this after mocking Dimensions, we ensure the component uses the mocked values
    PeriodActionTooltip =
      require("@/components/Calendar/EditDeleteTooltip").default;
  });

  afterAll(() => {
    jest.restoreAllMocks();
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  // Visibility logic
  it("renders nothing when visible is false", () => {
    const { toJSON } = render(
      <PeriodActionTooltip
        visible={false}
        position={{ x: 100, y: 100 }}
        onEditPeriod={mockOnEditPeriod}
        onEditCycleQuestionnaire={mockOnEditCycleQuestionnaire}
        onDelete={mockOnDelete}
        onClose={mockOnClose}
      />,
    );
    expect(toJSON()).toBeNull();
  });

  it("renders nothing when position is null", () => {
    const { toJSON } = render(
      <PeriodActionTooltip
        visible={true}
        position={null}
        onEditPeriod={mockOnEditPeriod}
        onEditCycleQuestionnaire={mockOnEditCycleQuestionnaire}
        onDelete={mockOnDelete}
        onClose={mockOnClose}
      />,
    );
    expect(toJSON()).toBeNull();
  });

  it("renders correctly when visible and position are provided", () => {
    render(
      <PeriodActionTooltip
        visible={true}
        position={{ x: 200, y: 300 }}
        onEditPeriod={mockOnEditPeriod}
        onEditCycleQuestionnaire={mockOnEditCycleQuestionnaire}
        onDelete={mockOnDelete}
        onClose={mockOnClose}
      />,
    );

    expect(screen.getByText("Period")).toBeTruthy();
    expect(screen.getByText("Entry")).toBeTruthy();
    expect(screen.getByText("Del")).toBeTruthy();
  });

  // Button interactions
  it("calls onEditPeriod when Period button is pressed", () => {
    render(
      <PeriodActionTooltip
        visible={true}
        position={{ x: 200, y: 300 }}
        onEditPeriod={mockOnEditPeriod}
        onEditCycleQuestionnaire={mockOnEditCycleQuestionnaire}
        onDelete={mockOnDelete}
        onClose={mockOnClose}
      />,
    );

    // Pass a mock event with stopPropagation to avoid TypeError
    fireEvent.press(screen.getByText("Period"), { stopPropagation: jest.fn() });
    expect(mockOnEditPeriod).toHaveBeenCalled();
  });

  it("calls onEditCycleQuestionnaire when Entry button is pressed", () => {
    render(
      <PeriodActionTooltip
        visible={true}
        position={{ x: 200, y: 300 }}
        onEditPeriod={mockOnEditPeriod}
        onEditCycleQuestionnaire={mockOnEditCycleQuestionnaire}
        onDelete={mockOnDelete}
        onClose={mockOnClose}
      />,
    );

    // Pass a mock event with stopPropagation to avoid TypeError
    fireEvent.press(screen.getByText("Entry"), { stopPropagation: jest.fn() });
    expect(mockOnEditCycleQuestionnaire).toHaveBeenCalled();
  });

  it("calls onDelete when Del button is pressed", () => {
    render(
      <PeriodActionTooltip
        visible={true}
        position={{ x: 200, y: 300 }}
        onEditPeriod={mockOnEditPeriod}
        onEditCycleQuestionnaire={mockOnEditCycleQuestionnaire}
        onDelete={mockOnDelete}
        onClose={mockOnClose}
      />,
    );

    // Pass a mock event with stopPropagation to avoid TypeError
    fireEvent.press(screen.getByText("Del"), { stopPropagation: jest.fn() });
    expect(mockOnDelete).toHaveBeenCalled();
  });

  // positional logic
  it("clamps position to left padding when clicked near left edge", () => {
    // x=20 is very close to left edge
    const x = 20;

    const { toJSON } = render(
      <PeriodActionTooltip
        visible={true}
        position={{ x, y: 300 }}
        onEditPeriod={mockOnEditPeriod}
        onEditCycleQuestionnaire={mockOnEditCycleQuestionnaire}
        onDelete={mockOnDelete}
        onClose={mockOnClose}
      />,
    );

    const root = toJSON();

    // Unclamped left would be 20 - 115 = -95
    // It should clamp to SCREEN_PADDING = 10
    expect(root?.props.style).toEqual(
      expect.objectContaining({
        left: 10,
      }),
    );
  });

  it("clamps position to right padding when clicked near right edge", () => {
    // x=380 is very close to right edge (screen width 400)
    const x = 380;

    const { toJSON } = render(
      <PeriodActionTooltip
        visible={true}
        position={{ x, y: 300 }}
        onEditPeriod={mockOnEditPeriod}
        onEditCycleQuestionnaire={mockOnEditCycleQuestionnaire}
        onDelete={mockOnDelete}
        onClose={mockOnClose}
      />,
    );

    const root = toJSON();

    // Expected max left position: screen (400) - width (230) - padding (10) = 160
    expect(root?.props.style).toEqual(
      expect.objectContaining({
        left: 160,
      }),
    );
  });
});
