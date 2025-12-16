import React from 'react';
import { View } from 'react-native';
import { render, fireEvent, screen } from '@testing-library/react-native';
import CalendarMonth from '@/components/Calendar/CalendarMonth';
import { format } from 'date-fns'; 

// Mocks and setup

// Mock CalendarDay to isolate CalendarMonth tests from CalendarDay implementation
jest.mock('@/components/Calendar/CalendarDay', () => {
  const { View } = require('react-native');
  
  const MockCalendarDay = (props: any) => {
    // We render a View with a testID that includes the date string for easy finding
    // We attach all props to this View so we can assert against them
    return (
      <View 
        testID={`day-${props.date ? props.date.toISOString() : 'empty'}`}
        {...props} 
      />
    );
  };
  return MockCalendarDay;
});

// Mock feather icons
jest.mock('@expo/vector-icons', () => {
  const { View } = require('react-native');
  return {
    Feather: () => <View testID="icon-feather" />,
  };
});

describe('CalendarMonth component', () => {
  // Test data setup
  const MOCK_TODAY = new Date('2023-10-15T12:00:00Z');
  const THEME_COLOR = '#FCA5A5';
  
  // Create a mock month item structure
  const mockDates = [
    null, // Padding
    new Date('2023-10-01T12:00:00Z'),
    new Date('2023-10-02T12:00:00Z'), // Period
    new Date('2023-10-03T12:00:00Z'), // Period
    new Date('2023-10-04T12:00:00Z'), // Prediction
  ];
  
  const mockItem = {
    id: '2023-10',
    titleMonth: 'October',
    titleYear: '2023',
    date: new Date('2023-10-01T12:00:00Z'),
    days: mockDates,
  };

  const mockOnPress = jest.fn();
  const mockOnCloseTooltip = jest.fn();

  // Helper sets
  const periodSet = new Set(['2023-10-02', '2023-10-03']);
  const predictionSet = new Set(['2023-10-04']);
  const emptySet = new Set<string>();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  // Basic rendering and interactions
  it('renders the correct month and year title', () => {
    render(
      <CalendarMonth
        item={mockItem}
        periodDateSet={emptySet}
        predictionDateSet={emptySet}
        selection={{ start: null, end: null }}
        isLogMode={false}
        isOngoing={false}
        themeColor={THEME_COLOR}
        onPress={mockOnPress}
        onCloseTooltip={mockOnCloseTooltip}
        today={MOCK_TODAY}
      />
    );

    expect(screen.getByText('October')).toBeTruthy();
    expect(screen.getByText('2023')).toBeTruthy();
  });

  it('calls onCloseTooltip when the container is pressed', () => {
    render(
      <CalendarMonth
        item={mockItem}
        periodDateSet={emptySet}
        predictionDateSet={emptySet}
        selection={{ start: null, end: null }}
        isLogMode={false}
        isOngoing={false}
        themeColor={THEME_COLOR}
        onPress={mockOnPress}
        onCloseTooltip={mockOnCloseTooltip}
        today={MOCK_TODAY}
      />
    );

    // Find the main container pressable
    // Since the structure is Pressable > View > Text, clicking October propagates up
    fireEvent.press(screen.getByText('October'));
    
    expect(mockOnCloseTooltip).toHaveBeenCalled();
  });

  // Data mapping (periods and predictions)
  it('correctly maps period and prediction props to CalendarDay children', () => {
    render(
      <CalendarMonth
        item={mockItem}
        periodDateSet={periodSet} // Contains Oct 2, Oct 3
        predictionDateSet={predictionSet} // Contains Oct 4
        selection={{ start: null, end: null }}
        isLogMode={false}
        isOngoing={false}
        themeColor={THEME_COLOR}
        onPress={mockOnPress}
        onCloseTooltip={mockOnCloseTooltip}
        today={MOCK_TODAY}
      />
    );

    // Check Oct 1 (nothing)
    const day1 = screen.getByTestId(`day-${mockDates[1]?.toISOString()}`);
    expect(day1.props.isPeriod).toBe(false);
    expect(day1.props.isPrediction).toBe(false);

    // Check Oct 2 (period)
    const day2 = screen.getByTestId(`day-${mockDates[2]?.toISOString()}`);
    expect(day2.props.isPeriod).toBe(true);
    expect(day2.props.isPrediction).toBe(false);

    // Check Oct 4 (prediction)
    const day4 = screen.getByTestId(`day-${mockDates[4]?.toISOString()}`);
    expect(day4.props.isPeriod).toBe(false);
    expect(day4.props.isPrediction).toBe(true);
  });

  // Selection logic
  it('calculates props for a standard selection range (Start -> End)', () => {
    // Range: Oct 2 to Oct 3
    const selection = {
      start: new Date('2023-10-02T12:00:00Z'),
      end: new Date('2023-10-03T12:00:00Z'),
    };

    render(
      <CalendarMonth
        item={mockItem}
        periodDateSet={emptySet}
        predictionDateSet={emptySet}
        selection={selection}
        isLogMode={true} // Must be true for selection to show
        isOngoing={false}
        themeColor={THEME_COLOR}
        onPress={mockOnPress}
        onCloseTooltip={mockOnCloseTooltip}
        today={MOCK_TODAY}
      />
    );

    // Oct 2: should be start and selected
    const day2 = screen.getByTestId(`day-${mockDates[2]?.toISOString()}`);
    expect(day2.props.isSelectionStart).toBe(true);
    expect(day2.props.isSelected).toBe(true);
    expect(day2.props.isSelectionEnd).toBe(false);

    // Oct 3: should be end and selected
    const day3 = screen.getByTestId(`day-${mockDates[3]?.toISOString()}`);
    expect(day3.props.isSelectionEnd).toBe(true);
    expect(day3.props.isSelected).toBe(true);
    expect(day3.props.isSelectionStart).toBe(false);

    // Oct 4: outside range
    const day4 = screen.getByTestId(`day-${mockDates[4]?.toISOString()}`);
    expect(day4.props.isSelected).toBe(false);
    expect(day4.props.isInRange).toBe(false);
  });

  // "Today" is Oct 15 and we set range to start on Oct 2
  // We need to check if dates between Oct 2 and Oct 15 are in range
  it('calculates props for ongoing selection (Start -> Today)', () => {
    
    const selection = {
      start: new Date('2023-10-02T12:00:00Z'),
      end: null, // End is null because it's ongoing
    };

    render(
      <CalendarMonth
        item={mockItem}
        periodDateSet={emptySet}
        predictionDateSet={emptySet}
        selection={selection}
        isLogMode={true}
        isOngoing={true} // Ongoing mode
        themeColor={THEME_COLOR}
        onPress={mockOnPress}
        onCloseTooltip={mockOnCloseTooltip}
        today={MOCK_TODAY} // Oct 15
      />
    );

    // Oct 2: start
    const day2 = screen.getByTestId(`day-${mockDates[2]?.toISOString()}`);
    expect(day2.props.isSelectionStart).toBe(true);
    expect(day2.props.isSelected).toBe(true);

    // Oct 3: inside the range (between 2 and 15)
    const day3 = screen.getByTestId(`day-${mockDates[3]?.toISOString()}`);
    expect(day3.props.isInRange).toBe(true);
    expect(day3.props.isSelected).toBe(false);

    // Oct 4: inside the range (between 2 and 15)
    const day4 = screen.getByTestId(`day-${mockDates[4]?.toISOString()}`);
    expect(day4.props.isInRange).toBe(true);
  });

  it('ignores selection logic if isLogMode is false', () => {
    const selection = {
      start: new Date('2023-10-02T12:00:00Z'),
      end: new Date('2023-10-03T12:00:00Z'),
    };

    render(
      <CalendarMonth
        item={mockItem}
        periodDateSet={emptySet}
        predictionDateSet={emptySet}
        selection={selection}
        isLogMode={false} // Log mode off
        isOngoing={false}
        themeColor={THEME_COLOR}
        onPress={mockOnPress}
        onCloseTooltip={mockOnCloseTooltip}
        today={MOCK_TODAY}
      />
    );

    // Even though selection dates match, flags should be false
    const day2 = screen.getByTestId(`day-${mockDates[2]?.toISOString()}`);
    expect(day2.props.isSelectionStart).toBe(false);
    expect(day2.props.isSelected).toBe(false);
  });
});