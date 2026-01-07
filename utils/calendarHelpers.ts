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
  subDays
} from 'date-fns';

// Interface for objects that have a start and end date (Periods, Predictions)
export interface DateRange {
  id?: string;
  start: Date;
  end: Date;
}

/**
 * Generates the grid of days for a specific month, including empty padding slots.
 * Adjusts for Monday-start weeks.
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
 */
export const generateMonths = (startDate: Date, count: number) => {
  return Array.from({ length: count }).map((_, index) => {
    const monthDate = addMonths(startDate, index);
    return {
      id: format(monthDate, 'yyyy-MM'),
      date: monthDate,
      titleMonth: format(monthDate, 'MMMM'),
      titleYear: format(monthDate, 'yyyy'),
      days: generateDaysForMonth(monthDate),
    };
  });
};

/**
 * Transforms an array of date ranges into a Set of 'yyyy-MM-dd' strings
 * for O(1) lookup during rendering.
 */
export const generateDateSet = (ranges: DateRange[]): Set<string> => {
  const set = new Set<string>();

  ranges.forEach(range => {
    try {
      const days = eachDayOfInterval({ start: range.start, end: range.end });
      days.forEach(d => set.add(format(d, 'yyyy-MM-dd')));
    } catch (e) {
      console.warn("Invalid interval skipped", range);
    }
  });

  return set;
};