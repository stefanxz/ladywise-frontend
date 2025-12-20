import { DayData } from "@/components/CalendarStrip/CalendarStrip";
import { CyclePhase } from "@/lib/types/cycle";

/**
 * formats a Date object into a "YYYY-MM-DD" string based on local time.
 * Avoids UTC shifting issues.
 *
 * @param {Date} date - The date to format
 * @returns {string} The formatted date string
 */
export const getLocalYYYYMMDD = (date: Date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

/**
 * Generates the day data for the specific calendar strip (3 days before + today + 3 days after).
 * Marks days as period days if they are in the `periodDates` list.
 *
 * @param {string[]} periodDates - Array of "YYYY-MM-DD" strings representing period days
 * @returns {DayData[]} Array of day objects for the calendar
 */
export const generateCalendarDays = (periodDates: string[] = []): DayData[] => {
  const today = new Date();
  const days: DayData[] = [];
  const periodSet = new Set(periodDates); // For fast lookup

  // Generate 7 days (e.g., 3 before, today, 3 after)
  for (let i = -3; i <= 3; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() + i);

    const dayNumber = date.getDate().toString();
    const dayLetter = date.toLocaleDateString("en-US", { weekday: "narrow" });
    const isCurrentDay = i === 0;
    const dateString = getLocalYYYYMMDD(date); // "YYYY-MM-DD"

    days.push({
      id: dateString,
      dayNumber,
      dayLetter,
      isCurrentDay,
      isPeriodDay: periodSet.has(dateString),
    });
  }
  return days;
};

/**
 * Formats a raw cycle phase string into a user-friendly display string.
 * Example: "MENSTRUAL" -> "Menstrual Phase"
 *
 * @param {CyclePhase} phase - The raw phase enum
 * @returns {string} The formatted string
 */
export const formatPhaseName = (phase: CyclePhase): string => {
  if (!phase) return "Loading Phase...";
  // "MENSTRUAL" -> "Menstrual"
  const formatted =
    phase.charAt(0).toUpperCase() + phase.slice(1).toLowerCase();
  // "Menstrual" -> "Menstrual Phase"
  return `${formatted} Phase`;
};
