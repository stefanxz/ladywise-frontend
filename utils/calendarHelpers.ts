import {
  eachDayOfInterval,
  endOfMonth,
  format,
  getDay,
  startOfMonth,
  addMonths,
  isSameDay,
  isBefore,
  areIntervalsOverlapping,
  addDays,
  subDays,
} from "date-fns";

// Interface for objects that have a start and end date (Periods, Predictions)
export interface DateRange {
  id?: string;
  start: Date;
  end: Date;
}

/**
 * Parses a "YYYY-MM-DD" string directly into a Date object representing
 * midnight in the user's local timezone.
 * This prevents dates from shifting with +-1 days due to UTC offsets.
 *
 * @param dateStr - The date string to parse (YYYY-MM-DD).
 * @returns A Date object at local midnight.
 */
export const parseToLocalWithoutTime = (dateStr: string): Date => {
  if (!dateStr) return new Date();

  // Split the string to get purely year, month, and day
  const parts = dateStr.split("T")[0].split("-");

  // Construct a Date in local timezone
  const year = parseInt(parts[0], 10);
  const month = parseInt(parts[1], 10) - 1;
  const day = parseInt(parts[2], 10);

  return new Date(year, month, day);
};

/**
 * Helper to safely handle fetch errors.
 * Includes a 'context' param for clear debugging.
 *
 * @param promise - The promise to await.
 * @param fallbackValue - The value to return if the promise fails.
 * @param context - A string describing the context of the fetch (for logging).
 * @returns The result of the promise or the fallback value.
 */
export const safeFetch = async <T>(
  promise: Promise<T>,
  fallbackValue: T,
  context: string,
): Promise<T> => {
  try {
    return await promise;
  } catch (err: any) {
    // If the error is a 404, it just means there is no data yet for a new user
    // We return the fallback value (null or empty array) and suppress the error
    if (err.response && err.response.status === 404) {
      return fallbackValue;
    }
    // For other errors (500s, network issues) we log them for debugging
    console.warn(`Error fetching ${context}:`, err.message || err);
    return fallbackValue;
  }
};

/**
 * Generates the grid of days for a specific month, including empty padding slots.
 * Adjusts for Monday-start weeks.
 *
 * @param monthDate - Any date within the target month.
 * @returns An array of Date objects (days) and nulls (padding).
 */
export const generateDaysForMonth = (monthDate: Date) => {
  const start = startOfMonth(monthDate);
  const end = endOfMonth(monthDate);

  const days = eachDayOfInterval({ start, end });

  // Adjust start index for Monday (0) to Sunday (6) alignment
  const startDayIndex = getDay(start);
  const adjustedStartIndex = startDayIndex === 0 ? 6 : startDayIndex - 1;

  // Create padding (nulls) for days before the 1st of the month
  const padding = Array(adjustedStartIndex).fill(null);

  return [...padding, ...days];
};

/**
 * Generates a list of months for the FlatList.
 *
 * @param startDate - The starting date for generation.
 * @param count - The number of months to generate.
 * @returns An array of month objects suitable for rendering.
 */
export const generateMonths = (startDate: Date, count: number) => {
  return Array.from({ length: count }).map((_, index) => {
    const monthDate = addMonths(startDate, index);
    return {
      id: format(monthDate, "yyyy-MM"),
      date: monthDate,
      titleMonth: format(monthDate, "MMMM"),
      titleYear: format(monthDate, "yyyy"),
      days: generateDaysForMonth(monthDate),
    };
  });
};

/**
 * Transforms an array of date ranges into a Set of 'yyyy-MM-dd' strings
 * for O(1) lookup during rendering.
 *
 * @param ranges - Array of objects with start and end dates.
 * @returns A Set containing all ISO date strings within the ranges.
 */
export const generateDateSet = (ranges: DateRange[]): Set<string> => {
  const set = new Set<string>();

  ranges.forEach((range) => {
    try {
      const days = eachDayOfInterval({ start: range.start, end: range.end });
      days.forEach((d) => set.add(format(d, "yyyy-MM-dd")));
    } catch (e) {
      console.warn("Invalid interval skipped", range);
    }
  });

  return set;
};
