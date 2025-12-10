import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { Alert, View, Text, TouchableOpacity } from 'react-native';
import CalendarScreen from '@/app/(main)/calendar';
import * as api from '@/lib/api';
import { CyclePhase } from '@/lib/types/cycle';
import { PeriodLogResponse } from '@/lib/types/period';

// Mocks

// Mock navigation/safe area
jest.mock('react-native-safe-area-context', () => {
  const inset = { top: 40, right: 0, bottom: 20, left: 0 };
  
  const SafeAreaProvider = ({ children }: any) => children;
  SafeAreaProvider.displayName = 'SafeAreaProvider'; // Required by NativeWind

  const SafeAreaView = ({ children }: any) => children;
  SafeAreaView.displayName = 'SafeAreaView'; // Required by NativeWind

  return {
    SafeAreaProvider,
    SafeAreaView,
    useSafeAreaInsets: jest.fn(() => inset),
  };
});

// Mock external libraries (native modules)
jest.mock('expo-linear-gradient', () => ({
  LinearGradient: ({ children }: any) => children,
}));
jest.mock('@expo/vector-icons', () => ({
  Feather: 'Feather',
}));

// Mock child components to isolate screen logic
jest.mock('@/components/Calendar/CalendarHeader', () => 'CalendarHeader');

// Completely exclude FloatingAddButton logic by rendering null since it's not important here
jest.mock('@/components/FloatingAddButton/FloatingAddButton', () => ({
  FloatingAddButton: () => null,
}));

jest.mock('@/components/LogNewPeriodButton/LogNewPeriodButton', () => {
  const { TouchableOpacity, Text } = require('react-native'); 
  return (props: any) => (
    <TouchableOpacity onPress={props.onPress} testID="log-period-btn">
      <Text>Log Period +</Text>
    </TouchableOpacity>
  );
});

// Mock CalendarMonth to simulate user interactions with dates
jest.mock('@/components/Calendar/CalendarMonth', () => {
  const { View, Button, Text } = require('react-native');
  return ({ item, onPress }: any) => (
    <View testID="calendar-month">
      <Text>{item.titleMonth}</Text>
      
      {/* Button for Jan 15 */}
      <Button
        title="Simulate Jan 15" 
        testID="date-trigger-jan-15"
        onPress={() => onPress(new Date(2025, 0, 15), { x: 100, y: 100 })}
      />
      
      {/* Button for Jan 20 */}
      <Button
        title="Simulate Jan 20" 
        testID="date-trigger-jan-20"
        onPress={() => onPress(new Date(2025, 0, 20), { x: 100, y: 100 })}
      />
    </View>
  );
});

jest.mock('@/components/Calendar/EditDeleteTooltip', () => {
  const { View, Button } = require('react-native');
  return ({ visible, onEditPeriod, onDelete }: any) => {
    if (!visible) return null;
    return (
      <View testID="tooltip-container">
        <Button title="Edit" onPress={onEditPeriod} testID="tooltip-edit" />
        <Button title="Delete" onPress={onDelete} testID="tooltip-delete" />
      </View>
    );
  };
});

// Mock API
jest.mock('@/lib/api');

// Mock Contexts
const mockSetPhase = jest.fn();
jest.mock('@/context/ThemeContext', () => ({
  useTheme: () => ({
    theme: { highlight: '#FF0000' },
    setPhase: mockSetPhase,
  }),
}));

jest.mock('@/context/AuthContext', () => ({
  useAuth: () => ({
    token: 'fake-jwt-token',
    isLoading: false,
  }),
}));

// Test suite

describe('Calendar Screen', () => {
  const mockedApi = jest.mocked(api);

  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();

    // Freeze time to Jan 25, 2025
    jest.setSystemTime(new Date('2025-01-25T12:00:00Z'));

    // Default API success responses
    mockedApi.getCycleStatus.mockResolvedValue({
      currentCycleDay: 5,
      currentPhase: "FOLLICULAR" as CyclePhase,
      nextEvent: "NEXT_OVULATION",
      daysUntilNextEvent: 10,
      nextEventDate: "2025-02-04",
      periodHistory: [],
      periodDates: [],
      predictedPeriodDates: []
    });

    mockedApi.getPeriodHistory.mockResolvedValue([]);
    mockedApi.getPredictions.mockResolvedValue([]);
    mockedApi.logNewPeriod.mockResolvedValue({ id: 'new-id' } as PeriodLogResponse);
    mockedApi.updatePeriod.mockResolvedValue({ id: 'updated-id' } as PeriodLogResponse);
    mockedApi.deletePeriod.mockResolvedValue({} as any);
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  // Rendering test

  it('renders correctly and loads initial data', async () => {
    const { getByText } = render(<CalendarScreen />);
    
    // Wait for API load
    await waitFor(() => expect(mockedApi.getCycleStatus).toHaveBeenCalled());
    
    // Verification: "January" should be visible from the helper generation
    expect(getByText('January')).toBeTruthy();
  });

  // Logging new period tests

//   it('logs a single-day period', async () => {
//     const { getByTestId, getByText, getAllByTestId } = render(<CalendarScreen />);
//     await waitFor(() => expect(mockedApi.getCycleStatus).toHaveBeenCalled());

//     // Enter log mode
//     fireEvent.press(getByTestId('log-period-btn'));

//     // Wait for log mode to be active
//     await waitFor(() => getByText('Save'));
    
//     // Select date
//     fireEvent.press(getAllByTestId('date-trigger-jan-15')[0]);
    
//     // Save
//     fireEvent.press(getByText('Save'));

//     await waitFor(() => {
//       expect(mockedApi.logNewPeriod).toHaveBeenCalledWith({
//         startDate: '2025-01-15',
//         endDate: '2025-01-15', 
//       });
//     });
//   });

  it('logs a multi-day range period (Start -> End)', async () => {
    const { getByTestId, getByText, getAllByTestId } = render(<CalendarScreen />);
    await waitFor(() => expect(mockedApi.getCycleStatus).toHaveBeenCalled());

    // Enter log mode
    fireEvent.press(getByTestId('log-period-btn'));

    // Wait for log mode to be active
    await waitFor(() => getByText('Save'));
    
    // Click start (Jan 15)
    fireEvent.press(getAllByTestId('date-trigger-jan-15')[0]);
    
    // Click end (Jan 20)
    fireEvent.press(getAllByTestId('date-trigger-jan-20')[0]);

    // Save
    fireEvent.press(getByText('Save'));

    await waitFor(() => {
      expect(mockedApi.logNewPeriod).toHaveBeenCalledWith({
        startDate: '2025-01-15',
        endDate: '2025-01-20', 
      });
    });
  });

  it('logs an ongoing period (endDate is null)', async () => {
    const { getByTestId, getByText, getAllByTestId } = render(<CalendarScreen />);
    await waitFor(() => expect(mockedApi.getCycleStatus).toHaveBeenCalled());

    // Enter log mode
    fireEvent.press(getByTestId('log-period-btn'));

    // Select start date (Jan 15)
    fireEvent.press(getAllByTestId('date-trigger-jan-15')[0]);

    // Toggle ongoing switch
    fireEvent.press(getByText('Mark as ongoing'));

    // Save
    fireEvent.press(getByText('Save'));

    await waitFor(() => {
      expect(mockedApi.logNewPeriod).toHaveBeenCalledWith({
        startDate: '2025-01-15',
        endDate: null, 
      });
    });
  });

  // Tests for editing and deleting existing periods

  it('edits an existing period via tooltip', async () => {
    // Setup: one existing period (Jan 15)
    mockedApi.getPeriodHistory.mockResolvedValue([{
      id: 'period-123',
      startDate: '2025-01-15',
      endDate: '2025-01-15', // Originally 1 day
      dailyEntries: []
    }]);

    const { getByTestId, getAllByTestId, getByText } = render(<CalendarScreen />);
    await waitFor(() => expect(mockedApi.getPeriodHistory).toHaveBeenCalled());

    // Click date to open tooltip
    fireEvent.press(getAllByTestId('date-trigger-jan-15')[0]);

    // Click Edit in tooltip
    fireEvent.press(getByTestId('tooltip-edit'));
    // State is now { start: Jan 15, end: Jan 15 }

    // User clicks Jan 15 to reset the range
    fireEvent.press(getAllByTestId('date-trigger-jan-15')[0]);
    // State is now { start: Jan 15, end: null }

    // User clicks Jan 20 to complete the range
    fireEvent.press(getAllByTestId('date-trigger-jan-20')[0]);
    // State is now { start: Jan 15, end: Jan 20 }

    // Save
    fireEvent.press(getByText('Save'));

    await waitFor(() => {
      expect(mockedApi.updatePeriod).toHaveBeenCalledWith('period-123', {
        startDate: '2025-01-15',
        endDate: '2025-01-20'
      });
    });
  });

  it('deletes a period after confirmation', async () => {

    // Spy on Alert to simulate clicking "Delete"
    const alertSpy = jest.spyOn(Alert, 'alert').mockImplementation((title, msg, buttons) => {
      const deleteBtn = buttons?.find(b => b.text === 'Delete');
      deleteBtn?.onPress?.();
    });

    mockedApi.getPeriodHistory.mockResolvedValue([{
      id: 'period-123',
      startDate: '2025-01-15',
      endDate: '2025-01-20',
      dailyEntries: []
    }]);

    const { getByTestId, getAllByTestId } = render(<CalendarScreen />);
    await waitFor(() => expect(mockedApi.getPeriodHistory).toHaveBeenCalled());

    // Open tooltip
    fireEvent.press(getAllByTestId('date-trigger-jan-15')[0]);

    // Click Delete
    fireEvent.press(getByTestId('tooltip-delete'));

    await waitFor(() => {
      expect(alertSpy).toHaveBeenCalled();
      expect(mockedApi.deletePeriod).toHaveBeenCalledWith('period-123');
    });
  });

  // Validation and error handling tests

  it('prevents overlapping periods', async () => {

    // Spy on Alert
    const alertSpy = jest.spyOn(Alert, 'alert');

    // Existing: Jan 14-16
    mockedApi.getPeriodHistory.mockResolvedValue([{
      id: 'existing-1',
      startDate: '2025-01-14',
      endDate: '2025-01-16',
      dailyEntries: []
    }]);

    const { getByTestId, getByText, getAllByTestId } = render(<CalendarScreen />);
    await waitFor(() => expect(mockedApi.getPeriodHistory).toHaveBeenCalled());

    // Enter log mode
    fireEvent.press(getByTestId('log-period-btn'));
    
    // User tries to pick Jan 15 (inside Jan 14-16)
    fireEvent.press(getAllByTestId('date-trigger-jan-15')[0]); 

    // Save
    fireEvent.press(getByText('Save'));

    expect(alertSpy).toHaveBeenCalledWith("Period already logged!", expect.anything());
    expect(mockedApi.logNewPeriod).not.toHaveBeenCalled();
  });

  it('warns about adjacent periods (one continuous period)', async () => {

    // Spy on Alert
    const alertSpy = jest.spyOn(Alert, 'alert');

    // Existing: Jan 10-14
    mockedApi.getPeriodHistory.mockResolvedValue([{
      id: 'existing-1',
      startDate: '2025-01-10',
      endDate: '2025-01-14',
      dailyEntries: []
    }]);

    const { getByTestId, getByText, getAllByTestId } = render(<CalendarScreen />);
    await waitFor(() => expect(mockedApi.getPeriodHistory).toHaveBeenCalled());

    // Enter log mode
    fireEvent.press(getByTestId('log-period-btn'));

    // User picks Jan 15 (Immediately after Jan 14)
    fireEvent.press(getAllByTestId('date-trigger-jan-15')[0]);

    // Save
    fireEvent.press(getByText('Save'));

    expect(alertSpy).toHaveBeenCalledWith("Looks like one continuous period!", expect.anything());
    expect(mockedApi.logNewPeriod).not.toHaveBeenCalled();
  });

  it('handles API errors', async () => {

    // Spy on Alert
    const alertSpy = jest.spyOn(Alert, 'alert');

    // Force API to fail
    mockedApi.logNewPeriod.mockRejectedValue(new Error('Network Error'));

    const { getByTestId, getByText, getAllByTestId } = render(<CalendarScreen />);
    await waitFor(() => expect(mockedApi.getCycleStatus).toHaveBeenCalled());

    // Enter log mode
    fireEvent.press(getByTestId('log-period-btn'));

    // Select date
    fireEvent.press(getAllByTestId('date-trigger-jan-15')[0]);

    // Save
    fireEvent.press(getByText('Save'));

    // Verify Alert is shown with error message
    await waitFor(() => {
      expect(alertSpy).toHaveBeenCalledWith("Oops!", expect.stringContaining("Network Error"));
    });
  });
});