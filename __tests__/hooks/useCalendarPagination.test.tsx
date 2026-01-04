import { renderHook, waitFor, act } from '@testing-library/react-native';
import { useCalendarPagination } from '@/hooks/calendar/useCalendarPagination';
import { generateMonths } from '@/utils/calendarHelpers';

// Mocks
jest.mock('@/utils/calendarHelpers');

describe('useCalendarPagination Hook', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Mock generateMonths to return dummy objects based on count
    (generateMonths as jest.Mock).mockImplementation((start, count) => 
      Array.from({ length: count }, (_, i) => ({ id: `month-${i}`, date: new Date() }))
    );
  });

  it('should initialize with correct number of months', () => {
    const { result } = renderHook(() => useCalendarPagination());
    
    // PRELOAD_PAST(6) + CURRENT(1) + PRELOAD_FUTURE(6) = 13
    expect(result.current.months.length).toBe(13);
    expect(result.current.isListReady).toBe(false);
  });

  it('should handle loadMorePast (scrolling up)', async () => {
    const { result } = renderHook(() => useCalendarPagination());
    const initialLength = result.current.months.length;

    // Trigger load more
    act(() => {
      result.current.loadMorePast();
    });

    expect(result.current.isLoadingPast).toBe(true);

    // Wait for the full cycle (data update + loading reset)
    // The hook has nested timeouts (800ms + 500ms), so we must wait for both
    await waitFor(() => {
      expect(result.current.months.length).toBeGreaterThan(initialLength);
      expect(result.current.isLoadingPast).toBe(false);
    }, { timeout: 2000 });
  });

  it('should handle loadMoreFuture (scrolling down)', async () => {
    const { result } = renderHook(() => useCalendarPagination());
    const initialLength = result.current.months.length;

    act(() => {
      result.current.loadMoreFuture();
    });

    expect(result.current.isLoadingFuture).toBe(true);

    // Wait for the full cycle (data update + loading reset)
    await waitFor(() => {
      expect(result.current.months.length).toBeGreaterThan(initialLength);
      expect(result.current.isLoadingFuture).toBe(false);
    }, { timeout: 2000 });
  });
  
  it('should ignore duplicate load calls while already loading', async () => {
    const { result } = renderHook(() => useCalendarPagination());
    const initialLength = result.current.months.length;

    // Trigger loading twice rapidly
    act(() => {
      result.current.loadMorePast();
      result.current.loadMorePast(); // This should be ignored
    });

    // If the lock works, the array only grows by BATCH_SIZE * 1 (6 items)
    const BATCH_SIZE = 6;
    
    await waitFor(() => {
      expect(result.current.months.length).toBe(initialLength + BATCH_SIZE);
      expect(result.current.isLoadingPast).toBe(false);
    }, { timeout: 2000 });
  });
});