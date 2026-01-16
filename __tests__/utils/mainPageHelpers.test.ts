import {
  getLocalYYYYMMDD,
  generateCalendarDays,
  formatPhaseName,
} from "@/utils/mainPageHelpers";
import { CyclePhase } from "@/lib/types/cycle";

describe("mainPageHelpers", () => {
  describe("getLocalYYYYMMDD", () => {
    it("formats a date correctly (double digit month/day)", () => {
      const date = new Date("2023-12-25T12:00:00");
      expect(getLocalYYYYMMDD(date)).toBe("2023-12-25");
    });

    it("formats a date correctly (single digit month/day)", () => {
      const date = new Date("2023-01-05T12:00:00");
      expect(getLocalYYYYMMDD(date)).toBe("2023-01-05");
    });
  });

  describe("generateCalendarDays", () => {
    beforeAll(() => {
      jest.useFakeTimers();
      jest.setSystemTime(new Date("2023-10-15T12:00:00")); // Sunday
    });

    afterAll(() => {
      jest.useRealTimers();
    });

    it("generates 7 days centered around today", () => {
      const days = generateCalendarDays([]);
      expect(days).toHaveLength(7);

      // Today should be at index 3 (center of 7 days: -3, -2, -1, 0, 1, 2, 3)
      expect(days[3].isCurrentDay).toBe(true);
      expect(days[3].id).toBe("2023-10-15");
      expect(days[3].dayNumber).toBe("15");

      // Check first day (Oct 12)
      expect(days[0].id).toBe("2023-10-12");
      expect(days[0].isCurrentDay).toBe(false);

      // Check last day (Oct 18)
      expect(days[6].id).toBe("2023-10-18");
      expect(days[6].isCurrentDay).toBe(false);
    });

    it("uses empty array as default for periodDates", () => {
      const days = generateCalendarDays();
      expect(days).toHaveLength(7);
      expect(days.every(d => !d.isPeriodDay)).toBe(true);
    });

    it("marks period days correctly", () => {
      const periodDates = ["2023-10-14", "2023-10-15", "2023-10-16"];
      const days = generateCalendarDays(periodDates);

      // Oct 14 (index 2)
      expect(days[2].id).toBe("2023-10-14");
      expect(days[2].isPeriodDay).toBe(true);

      // Oct 15 (index 3, today)
      expect(days[3].id).toBe("2023-10-15");
      expect(days[3].isPeriodDay).toBe(true);

      // Oct 16 (index 4)
      expect(days[4].id).toBe("2023-10-16");
      expect(days[4].isPeriodDay).toBe(true);

      // Oct 13 (index 1) - not period
      expect(days[1].id).toBe("2023-10-13");
      expect(days[1].isPeriodDay).toBe(false);
    });
  });

  describe("formatPhaseName", () => {
    it("formats MENSTRUAL phase", () => {
      expect(formatPhaseName("MENSTRUAL")).toBe("Menstrual Phase");
    });

    it("formats FOLLICULAR phase", () => {
      expect(formatPhaseName("FOLLICULAR")).toBe("Follicular Phase");
    });

    it("formats OVULATION phase", () => {
      expect(formatPhaseName("OVULATION")).toBe("Ovulation Phase");
    });

    it("formats LUTEAL phase", () => {
      expect(formatPhaseName("LUTEAL")).toBe("Luteal Phase");
    });

    it("handles null/undefined gracefully", () => {
        // @ts-ignore
      expect(formatPhaseName(null)).toBe("Loading Phase...");
       // @ts-ignore
      expect(formatPhaseName(undefined)).toBe("Loading Phase...");
    });
  });
});
