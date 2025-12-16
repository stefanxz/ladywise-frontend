import React from 'react';
import { View } from 'react-native';
import { render, screen } from '@testing-library/react-native';
import CalendarDay from '@/components/Calendar/CalendarDay';

// Mocks and setup

// Mock the themes library to ensure consistent color values during testing
jest.mock('@/lib/themes', () => ({
  themes: {
    menstrual: { highlight: '#E11D48' }, // Example highlight color
  },
}));

// Constants from your component for assertion matching
const SELECTION_RED = "rgba(205, 22, 61, 0.9)";
const PERIOD_HIGHLIGHT = '#E11D48'; // Matches the mock above
const THEME_COLOR = '#FCA5A5'; // Arbitrary theme color passed via props

describe('CalendarDay component', () => {
  // We freeze time to a specific weekday to test "Today" and weekend logic deterministically
  // 2023-10-11 (a wednesday)
  const MOCK_TODAY = new Date('2023-10-11T12:00:00Z'); 
  
  beforeAll(() => {
    jest.useFakeTimers();
    jest.setSystemTime(MOCK_TODAY);
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  // Rendering basics
  it('renders nothing visible (placeholder) when date is null', () => {
    const { toJSON } = render(<CalendarDay date={null} themeColor={THEME_COLOR} />);
    
    // Should render a simple View without children/text
    const tree = toJSON();
    expect(tree?.children).toBeNull();
    // Using style checking to confirm it's the spacer view
    expect(tree?.props.className).toContain('w-[14.28%]');
  });

  it('renders the correct day number for a valid date', () => {
    const date = new Date('2023-10-15T12:00:00Z'); // The 15th
    render(<CalendarDay date={date} themeColor={THEME_COLOR} />);

    expect(screen.getByText('15')).toBeTruthy();
  });

  it('renders weekend text color correctly', () => {
    const saturday = new Date('2023-10-14T12:00:00Z'); 
    render(<CalendarDay date={saturday} themeColor={THEME_COLOR} />);

    const text = screen.getByText('14');

    // Weekend days should have the stone-400 text color
    expect(text.props.className).toContain('text-stone-400');
  });

  // Visual states (period, prediction, today)
  it('applies solid border styling for confirmed periods', () => {
    const date = new Date('2023-10-01T12:00:00Z');
    const { toJSON } = render(<CalendarDay date={date} isPeriod={true} themeColor={THEME_COLOR} />);

    // Navigate Tree: View (Container) -> TouchableOpacity (Child 0)
    const tree = toJSON() as any;
    const touchable = tree.children[0];
    
    // We check props.style object directly because we are looking at the JSON representation
    expect(touchable.props.style).toEqual(expect.objectContaining({
      borderColor: PERIOD_HIGHLIGHT,
      borderWidth: 1.5,
      borderStyle: 'solid',
    }));
  });

  it('applies dashed border styling for predictions', () => {
    const date = new Date('2023-10-02T12:00:00Z');
    const { toJSON } = render(<CalendarDay date={date} isPrediction={true} themeColor={THEME_COLOR} />);

    const tree = toJSON() as any;
    const touchable = tree.children[0];

    expect(touchable.props.style).toEqual(expect.objectContaining({
      borderColor: PERIOD_HIGHLIGHT,
      borderWidth: 1.5,
      borderStyle: 'dashed',
    }));
  });

  it('applies special styling for "Today"', () => {
    // Uses the MOCK_TODAY date set in beforeAll
    const { toJSON } = render(<CalendarDay date={MOCK_TODAY} themeColor={THEME_COLOR} />);

    const tree = toJSON() as any;
    const touchable = tree.children[0];

    expect(touchable.props.style).toEqual(expect.objectContaining({
      backgroundColor: THEME_COLOR,
      borderColor: THEME_COLOR,
      borderWidth: 3,
    }));
  });
});
