import { renderHook, waitFor } from '@testing-library/react-native';
import { usePeriodData } from '@/hooks/calendar/usePeriodData';
import { useAuth } from '@/context/AuthContext';
import { useTheme } from '@/context/ThemeContext';
import { getCycleStatus, getPeriodHistory, getPredictions } from '@/lib/api';

// Mocks
jest.mock('@/context/AuthContext');
jest.mock('@/context/ThemeContext');
jest.mock('@/lib/api');

// Mock helper to return an empty set
jest.mock('@/utils/calendarHelpers', () => ({
  generateDateSet: jest.fn(() => new Set()),
}));

describe('usePeriodData Hook', () => {
  const mockSetPhase = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();

    // Mock auth context
    (useAuth as jest.Mock).mockReturnValue({
      token: 'valid-token',
      isLoading: false,
    });

    // Mock theme context
    (useTheme as jest.Mock).mockReturnValue({
      setPhase: mockSetPhase,
    });

    // Mock API responses
    (getCycleStatus as jest.Mock).mockResolvedValue({ currentPhase: 'Luteal' });
    (getPeriodHistory as jest.Mock).mockResolvedValue([
      { id: '1', startDate: '2023-01-01', endDate: '2023-01-05' },
    ]);
    (getPredictions as jest.Mock).mockResolvedValue([
      { startDate: '2023-02-01', endDate: '2023-02-05' },
    ]);
  });

  it('should fetch data and update state on mount', async () => {
    const { result } = renderHook(() => usePeriodData());

    // Initially empty
    expect(result.current.periods).toEqual([]);

    // Wait for async operations to complete
    await waitFor(() => {
      expect(result.current.periods.length).toBeGreaterThan(0);
    });

    // Verify data parsing
    expect(result.current.periods[0].id).toBe('1');
    expect(result.current.periods[0].start).toBeInstanceOf(Date);
    expect(result.current.predictions.length).toBe(1);
    
    // Verify theme update
    expect(mockSetPhase).toHaveBeenCalledWith('luteal');
  });

  it('should not fetch data if auth is loading', async () => {
    (useAuth as jest.Mock).mockReturnValue({ token: null, isLoading: true });
    
    renderHook(() => usePeriodData());

    expect(getPeriodHistory).not.toHaveBeenCalled();
  });

  it('should handle API errors', async () => {
    // Spy on console.error
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
    
    // Mock the rejection
    (getPeriodHistory as jest.Mock).mockRejectedValue(new Error('Network Error'));

    const { result } = renderHook(() => usePeriodData());

    // Wait for the API call to trigger
    await waitFor(() => {
      expect(getPeriodHistory).toHaveBeenCalled();
    });

    // Verify the catch block was actually hit
    // This proves the app didn't crash and actually caught the error
    expect(consoleSpy).toHaveBeenCalledWith(
      expect.stringContaining("Failed to fetch cycle calendar data")
    );

    // Verify state remains safe (empty)
    expect(result.current.periods).toEqual([]);
    
    consoleSpy.mockRestore();
  });
});