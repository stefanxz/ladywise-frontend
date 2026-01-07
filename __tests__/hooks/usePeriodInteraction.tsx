import { renderHook, act } from '@testing-library/react-native';
import { Alert } from 'react-native';
import { usePeriodInteraction } from '@/hooks/calendar/usePeriodInteraction';
import { logNewPeriod, deletePeriod } from '@/lib/api';
import { startOfDay, addDays, subDays } from 'date-fns';

// Mocks
jest.mock('@/lib/api');
jest.spyOn(Alert, 'alert');

describe('usePeriodInteraction Hook', () => {
  const today = startOfDay(new Date());
  const mockRefresh = jest.fn();
  
  // Dummy existing periods
  const existingPeriods = [
    { 
      id: 'p1', 
      start: subDays(today, 5), 
      end: subDays(today, 2), 
      isOngoing: false 
    }
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should toggle log mode correctly', () => {
    const { result } = renderHook(() => 
      usePeriodInteraction({ periods: [], refreshData: mockRefresh })
    );

    act(() => {
      result.current.handleLogPeriodStart();
    });

    expect(result.current.isLogMode).toBe(true);
    
    act(() => {
      result.current.handleCancelLog();
    });

    expect(result.current.isLogMode).toBe(false);
  });

  it('should validate overlapping periods', async () => {
    const { result } = renderHook(() => 
      usePeriodInteraction({ periods: existingPeriods, refreshData: mockRefresh })
    );

    // Enter log mode
    act(() => { result.current.handleLogPeriodStart(); });

    // Select dates that overlap with 'p1' (subDays 5 to 2)
    // We select subDays 3
    act(() => {
      result.current.handleDatePress(subDays(today, 3), { x: 0, y: 0 });
    });

    // Try to save
    await act(async () => {
      await result.current.handleSaveLog();
    });

    expect(Alert.alert).toHaveBeenCalledWith(
      "Period already logged!",
      expect.stringContaining("already tracked a period")
    );
    expect(logNewPeriod).not.toHaveBeenCalled();
  });

  it('should validate adjacent periods', async () => {
    const { result } = renderHook(() => 
      usePeriodInteraction({ periods: existingPeriods, refreshData: mockRefresh })
    );

    act(() => { result.current.handleLogPeriodStart(); });

    // Select date exactly 1 day after existing period ends
    // existing ends at subDays(2), so we pick subDays(1)
    act(() => {
      result.current.handleDatePress(subDays(today, 1), { x: 0, y: 0 });
    });

    await act(async () => {
      await result.current.handleSaveLog();
    });

    expect(Alert.alert).toHaveBeenCalledWith(
      "Looks like one continuous period!",
      expect.stringContaining("extending that period")
    );
  });

  it('should delete period after confirmation', async () => {
    const { result } = renderHook(() => 
      usePeriodInteraction({ periods: existingPeriods, refreshData: mockRefresh })
    );

    // Simulate opening tooltip
    act(() => {
      result.current.handleDatePress(subDays(today, 3), { x: 0, y: 0 });
    });

    // Trigger Delete
    act(() => {
      result.current.handleDeletePeriod();
    });

    // Extract 'Delete' button from Alert calls
    const alertButtons = (Alert.alert as jest.Mock).mock.calls[0][2];
    const deleteBtn = alertButtons.find((b: any) => b.text === 'Delete');

    // Confirm Delete
    await act(async () => {
      await deleteBtn.onPress();
    });

    expect(deletePeriod).toHaveBeenCalledWith('p1');
    expect(mockRefresh).toHaveBeenCalled();
  });
});