import { 
  parseToLocalWithoutTime, 
  safeFetch, 
  generateDaysForMonth,
  generateMonths,
  generateDateSet
} from '@/utils/calendarHelpers';

describe('Calendar Helpers', () => {
  
  // Test parseToLocalWithoutTime
  describe('parseToLocalWithoutTime', () => {
    it('should parse YYYY-MM-DD string to local midnight correctly', () => {
      // Input: 20th of May
      const dateStr = '2023-05-20';
      const result = parseToLocalWithoutTime(dateStr);

      // Verify year, month, day are preserved exactly
      expect(result.getFullYear()).toBe(2023);
      expect(result.getMonth()).toBe(4); // 0-indexed: may is 4
      expect(result.getDate()).toBe(20);

      // Verify time is set to Local Midnight (00:00:00)
      expect(result.getHours()).toBe(0);
      expect(result.getMinutes()).toBe(0);
      expect(result.getSeconds()).toBe(0);
      expect(result.getMilliseconds()).toBe(0);
    });

    it('should handle null or empty strings safely', () => {
      const result = parseToLocalWithoutTime('');
      expect(result).toBeInstanceOf(Date);
      // Just ensure it returns a valid Date object
      expect(result.getTime()).not.toBeNaN();
    });
  });

  // Test safeFetch
  describe('safeFetch', () => {
    const consoleSpy = jest.spyOn(console, 'warn').mockImplementation();

    afterEach(() => {
      jest.clearAllMocks();
    });

    it('should return fallback value silently on 404 (New User)', async () => {
      // Mock an error that looks like an Axios 404
      const mock404Error = Promise.reject({
        response: { status: 404 }
      });

      const result = await safeFetch(mock404Error, 'Fallback', 'Test Context');

      // Should get fallback
      expect(result).toBe('Fallback');
      // Should not log a warning
      expect(consoleSpy).not.toHaveBeenCalled();
    });

    it('should return fallback and warn on 500/Network errors', async () => {
      const mockNetworkError = Promise.reject(new Error('Network Fail'));

      const result = await safeFetch(mockNetworkError, 'Fallback', 'Test Context');

      // Should get fallback to keep app alive
      expect(result).toBe('Fallback');
      // Should log the warning
      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining('Error fetching Test Context'),
        expect.anything()
      );
    });
  });

  // Test generateDaysForMonth
  describe('generateDaysForMonth', () => {
    it('should add correct null padding for a month starting on Friday', () => {
      // September 1st, 2023 was a friday
      const sept2023 = new Date(2023, 8, 1); 
      
      const grid = generateDaysForMonth(sept2023);

      // Friday is the 5th day of the week
      // So we expect 4 nulls padding at the start
      expect(grid[0]).toBeNull();
      expect(grid[1]).toBeNull();
      expect(grid[2]).toBeNull();
      expect(grid[3]).toBeNull();
      expect(grid[4]).toBeInstanceOf(Date);
    });

    it('should have no padding for a month starting on Monday', () => {
      // May 1st, 2023 was a monday
      const may2023 = new Date(2023, 4, 1);
      
      const grid = generateDaysForMonth(may2023);

      // 0 padding expected
      expect(grid[0]).toBeInstanceOf(Date);
    });
  });

  // Test generateMonths
  describe('generateMonths', () => {
    it('should generate the correct number of months', () => {
      const start = new Date(2023, 0, 1); // Jan 2023
      const count = 3;
      
      const result = generateMonths(start, count);

      expect(result).toHaveLength(3);
      expect(result[0].titleMonth).toBe('January');
      expect(result[1].titleMonth).toBe('February');
      expect(result[2].titleMonth).toBe('March');
    });

    it('should increment years correctly', () => {
      // Start in Dec 2023, request 2 months
      const start = new Date(2023, 11, 1); 
      const result = generateMonths(start, 2);

      expect(result[0].titleYear).toBe('2023'); // Dec 2023
      expect(result[1].titleYear).toBe('2024'); // Jan 2024
    });
  });

  // Test generateDateSet
  describe('generateDateSet', () => {
    it('should expand a date range into individual string keys', () => {
      const ranges = [
        {
          start: new Date(2023, 0, 1), // Jan 1
          end: new Date(2023, 0, 3) // Jan 3
        }
      ];

      const set = generateDateSet(ranges);

      expect(set.size).toBe(3);
      expect(set.has('2023-01-01')).toBe(true);
      expect(set.has('2023-01-02')).toBe(true);
      expect(set.has('2023-01-03')).toBe(true);
    });
  });
});