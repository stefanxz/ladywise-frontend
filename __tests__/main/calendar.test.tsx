import React from 'react';
import { render, fireEvent, waitFor, act } from '@testing-library/react-native';
import { Alert } from 'react-native';
import CalendarScreen from '@/app/(main)/calendar';
import { useAuth } from '@/context/AuthContext';
import { useTheme } from '@/context/ThemeContext';
import { getCycleStatus, getPeriodHistory, getPredictions, logNewPeriod, updatePeriod, deletePeriod } from '@/lib/api';
import { format, addDays, subDays, startOfDay } from 'date-fns';

// Setup and mocks
// Suppress specific "not wrapped in act" warnings
const originalError = console.error;
beforeAll(() => {
  console.error = (...args: any[]) => {
    if (typeof args[0] === 'string' && args[0].includes('not wrapped in act')) return;
    originalError.call(console, ...args);
  };
});
afterAll(() => {
  console.error = originalError;
});

// Context and API mocks
jest.mock('@/context/AuthContext');
jest.mock('@/context/ThemeContext');
jest.mock('@/lib/api');
jest.mock('react-native-safe-area-context', () => ({
  useSafeAreaInsets: () => ({ top: 44, bottom: 34, left: 0, right: 0 }),
}));
jest.mock('expo-linear-gradient', () => ({
  LinearGradient: 'LinearGradient', 
}));

// Mock calendar helpers
// We require 'date-fns' inside the mock factory because jest.mock is hoisted
// above imports so external variables are not accessible here
jest.mock('@/utils/calendarHelpers', () => {
  const { addDays } = require('date-fns');
  return {
    generateDateSet: jest.fn(() => new Set()),
    generateMonths: jest.fn((start, count) => 
      Array.from({ length: count }, (_, i) => ({
        id: `month-${i}`,
        date: start ? addDays(start, i * 30) : new Date(), 
      }))
    ),
  };
});

jest.mock('@/components/Calendar/CalendarHeader', () => 'CalendarHeader');

jest.mock('@/components/LogNewPeriodButton/LogNewPeriodButton', () => {
  const { TouchableOpacity, Text } = require('react-native');
  return ({ onPress }: any) => (
    <TouchableOpacity onPress={onPress} testID="log-period-button">
      <Text>Log New Period</Text>
    </TouchableOpacity>
  );
});

// Functional mock for CalendarMonth
// This component is rendered for every month in the FlatList
// Tests must use `getAllByTestId` (picking the first index) to interact with specific buttons
jest.mock('@/components/Calendar/CalendarMonth', () => {
  const { TouchableOpacity, Text, View } = require('react-native');
  const { addDays, subDays } = require('date-fns');
  
  return ({ onPress, today, item }: any) => (
    <View testID={`month-view-${item.id}`}>
      <TouchableOpacity 
        testID="day-today" 
        onPress={() => onPress(today, { x: 100, y: 100 })}
      >
        <Text>Today</Text>
      </TouchableOpacity>
      
      <TouchableOpacity 
        testID="day-yesterday" 
        onPress={() => onPress(subDays(today, 1), { x: 100, y: 100 })}
      >
        <Text>Yesterday</Text>
      </TouchableOpacity>

      <TouchableOpacity 
        testID="day-tomorrow" 
        onPress={() => onPress(addDays(today, 1), { x: 100, y: 100 })}
      >
        <Text>Tomorrow</Text>
      </TouchableOpacity>
    </View>
  );
});

jest.mock('@/components/Calendar/EditDeleteTooltip', () => {
  const { View, TouchableOpacity, Text } = require('react-native');
  return ({ visible, onEditPeriod, onDelete }: any) => {
    if (!visible) return null;
    return (
      <View testID="tooltip-container">
        <TouchableOpacity onPress={onEditPeriod} testID="tooltip-edit"><Text>Edit</Text></TouchableOpacity>
        <TouchableOpacity onPress={onDelete} testID="tooltip-delete"><Text>Delete</Text></TouchableOpacity>
      </View>
    );
  };
});

jest.mock('@/components/FloatingAddButton/FloatingAddButton', () => ({
  FloatingAddButton: 'FloatingAddButton',
}));

// Spy on Alert to test confirmation dialogs and validation errors
jest.spyOn(Alert, 'alert');

// Tests
describe('CalendarScreen', () => {
  const mockToken = 'mock-token';
  const mockSetPhase = jest.fn();
  const today = startOfDay(new Date());

  const mockPeriodHistory = [
    {
      id: 'period-old',
      startDate: format(subDays(today, 10), 'yyyy-MM-dd'),
      endDate: format(subDays(today, 6), 'yyyy-MM-dd'),
    }
  ];
  
  const mockPredictions = [
    { startDate: '2025-01-01', endDate: '2025-01-05' }
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    
    (useAuth as jest.Mock).mockReturnValue({
      token: mockToken,
      isLoading: false,
    });

    (useTheme as jest.Mock).mockReturnValue({
      theme: { highlight: '#FCA5A5' },
      setPhase: mockSetPhase,
    });

    (getCycleStatus as jest.Mock).mockResolvedValue({ currentPhase: 'follicular' });
    (getPeriodHistory as jest.Mock).mockResolvedValue(mockPeriodHistory);
    (getPredictions as jest.Mock).mockResolvedValue(mockPredictions);
  });

  describe('Initial Rendering', () => {
    // Tests that the component successfully calls all required APIs on mount 
    // and displays the main calendar list
    it('should fetch data and render list on mount', async () => {
      const { getByTestId } = render(<CalendarScreen />);

      await waitFor(() => {
        expect(getPeriodHistory).toHaveBeenCalled();
        expect(getPredictions).toHaveBeenCalled();
      });

      expect(getByTestId('calendar-list')).toBeTruthy();
      expect(mockSetPhase).toHaveBeenCalledWith('follicular');
    });

    // Tests that the component doesn't crash if the API returns an error
    it('should handle API errors gracefully', async () => {
      const consoleError = jest.spyOn(console, 'error').mockImplementation();
      (getPeriodHistory as jest.Mock).mockRejectedValue(new Error('API Error'));

      render(<CalendarScreen />);

      await waitFor(() => {
        expect(consoleError).toHaveBeenCalledWith(expect.stringContaining('Failed to fetch cycle'));
      });
      consoleError.mockRestore();
    });
  });

  describe('Logging New Period (User Flow)', () => {
    // Tests the standard path: user opens log mode, selects a range 
    // (start date -> end date), and successfully saves
    it('should allow user to enter log mode, select dates, and save', async () => {
      (logNewPeriod as jest.Mock).mockResolvedValue({ success: true });
      const { getByTestId, getAllByTestId, getByText, queryByText } = render(<CalendarScreen />);

      await waitFor(() => expect(getPeriodHistory).toHaveBeenCalled());

      // Enter log mode
      fireEvent.press(getByTestId('log-period-button'));
      
      await waitFor(() => {
        expect(getByText('Cancel')).toBeTruthy();
        expect(getByText('Save')).toBeTruthy();
      });

      // Select dates
      // We use getAllByTestId(...)[0] because the list renders multiple Yesterday buttons (one per month item)
      fireEvent.press(getAllByTestId('day-yesterday')[0]); // Start
      fireEvent.press(getAllByTestId('day-today')[0]);     // End

      // Save
      fireEvent.press(getByText('Save'));

      // Verify API call
      await waitFor(() => {
        expect(logNewPeriod).toHaveBeenCalledWith({
          startDate: format(subDays(today, 1), 'yyyy-MM-dd'),
          endDate: format(today, 'yyyy-MM-dd'),
        });
      });

      // Verify exit log mode
      await waitFor(() => {
        expect(queryByText('Save')).toBeNull();
      });
    });

    // Tests the flow for logging a period that is still active (Ongoing),
    // ensuring the payload sends a null endDate
    it('should handle ongoing period logging', async () => {
      (logNewPeriod as jest.Mock).mockResolvedValue({ success: true });
      const { getByTestId, getAllByTestId, getByText } = render(<CalendarScreen />);

      await waitFor(() => expect(getPeriodHistory).toHaveBeenCalled());

      fireEvent.press(getByTestId('log-period-button'));
      await waitFor(() => getByText('Mark as ongoing'));

      fireEvent.press(getByText('Mark as ongoing'));
      
      // Select start date only
      fireEvent.press(getAllByTestId('day-today')[0]);
      
      fireEvent.press(getByText('Save'));

      await waitFor(() => {
        expect(logNewPeriod).toHaveBeenCalledWith({
          startDate: format(today, 'yyyy-MM-dd'),
          endDate: null,
        });
      });
    });
  });

  describe('Validation Logic', () => {
    // Tests validation ensuring the user cannot save without selecting any date
    it('should alert if saving without a start date', async () => {
      const { getByTestId, getByText } = render(<CalendarScreen />);
      await waitFor(() => expect(getPeriodHistory).toHaveBeenCalled());

      fireEvent.press(getByTestId('log-period-button'));
      await waitFor(() => getByText('Save'));

      fireEvent.press(getByText('Save'));

      expect(Alert.alert).toHaveBeenCalledWith(
        "Just a quick check!",
        expect.stringContaining("need a start date")
      );
      expect(logNewPeriod).not.toHaveBeenCalled();
    });

    // Tests validation ensuring the user cannot log periods for future dates
    it('should prevent selection of future dates', async () => {
      const { getByTestId, getAllByTestId, getByText } = render(<CalendarScreen />);
      await waitFor(() => expect(getPeriodHistory).toHaveBeenCalled());

      fireEvent.press(getByTestId('log-period-button'));
      await waitFor(() => getByText('Save'));

      // Try to click future date
      fireEvent.press(getAllByTestId('day-tomorrow')[0]);
      
      fireEvent.press(getByText('Save'));

      expect(Alert.alert).toHaveBeenCalledWith(
        "Just a quick check!",
        "We need a start date to log this entry properly."
      );
    });
  });

  describe('Editing & Deleting (User Flow)', () => {
    const periodOnToday = [{
      id: 'period-today',
      startDate: format(today, 'yyyy-MM-dd'),
      endDate: format(today, 'yyyy-MM-dd'),
    }];

    // Tests the delete workflow: tapping a date -> tooltip appearing -> clicking delete -> confirming alert
    it('should open tooltip and allow deletion', async () => {
      (getPeriodHistory as jest.Mock).mockResolvedValue(periodOnToday);
      (deletePeriod as jest.Mock).mockResolvedValue({ success: true });
      
      const { getByTestId, getAllByTestId, queryByTestId } = render(<CalendarScreen />);
      await waitFor(() => expect(getPeriodHistory).toHaveBeenCalled());

      // Tap Today
      fireEvent.press(getAllByTestId('day-today')[0]);

      await waitFor(() => expect(getByTestId('tooltip-container')).toBeTruthy());

      // Press Delete button on the tooltip (triggers the Alert)
      fireEvent.press(getByTestId('tooltip-delete'));

      // Confirm Alert exists
      expect(Alert.alert).toHaveBeenCalled();
      
      // Extract the Delete button logic from the Alert mock
      const alertButtons = (Alert.alert as jest.Mock).mock.calls[0][2];
      const deleteAction = alertButtons.find((b: any) => b.text === 'Delete');
      
      // We wrap the manual async call in act() to ensure state updates flush
      await act(async () => {
        await deleteAction.onPress();
      });

      // Verify API was called
      expect(deletePeriod).toHaveBeenCalledWith('period-today');

      // Verify UI updated (tooltip is gone)
      await waitFor(() => {
        expect(queryByTestId('tooltip-container')).toBeNull();
      });
    });

    // Tests the edit workflow: tapping a date -> tooltip -> clicking edit -> modifying the dates -> saving
    it('should open tooltip and enter edit mode', async () => {
      (getPeriodHistory as jest.Mock).mockResolvedValue(periodOnToday);
      (updatePeriod as jest.Mock).mockResolvedValue({ success: true });

      const { getByTestId, getAllByTestId, getByText, queryByTestId } = render(<CalendarScreen />);
      await waitFor(() => expect(getPeriodHistory).toHaveBeenCalled());

      fireEvent.press(getAllByTestId('day-today')[0]);
      await waitFor(() => expect(getByTestId('tooltip-edit')).toBeTruthy());

      fireEvent.press(getByTestId('tooltip-edit'));

      await waitFor(() => {
        expect(getByText('Save')).toBeTruthy();
        expect(queryByTestId('tooltip-container')).toBeNull();
      });

      // Change selection to yesterday
      fireEvent.press(getAllByTestId('day-yesterday')[0]);

      fireEvent.press(getByText('Save'));

      await waitFor(() => {
        expect(updatePeriod).toHaveBeenCalledWith(
          'period-today',
          expect.objectContaining({
             startDate: format(subDays(today, 1), 'yyyy-MM-dd')
          })
        );
      });
    });
  });

  describe('Infinite Scroll', () => {
    // Tests that reaching the end of the FlatList triggers the logic to generate more months
    it('should trigger loading when reaching end of list', async () => {
      const { getByTestId } = render(<CalendarScreen />);
      await waitFor(() => expect(getPeriodHistory).toHaveBeenCalled());

      const list = getByTestId('calendar-list');
      
      fireEvent(list, 'onEndReached');
      
      await waitFor(() => {
        expect(require('@/utils/calendarHelpers').generateMonths).toHaveBeenCalledTimes(2);
      });
    });
  });
});