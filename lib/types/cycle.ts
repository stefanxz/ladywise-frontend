/**
 * CyclePhase
 * Represents the four main phases of the menstrual cycle.
 */
export type CyclePhase = "MENSTRUAL" | "FOLLICULAR" | "OVULATION" | "LUTEAL";

/**
 * CycleEvent
 * Next significant event to display to the user.
 */
export type CycleEvent = "NEXT_OVULATION" | "NEXT_PERIOD";

export interface PeriodRecord {
  startDate: string;
  endDate: string;
}

/**
 * CycleStatusDTO
 * Data transfer object for the current cycle status response.
 */
export interface CycleStatusDTO {
  currentCycleDay: number;
  currentPhase: CyclePhase;
  nextEvent?: CycleEvent;
  daysUntilNextEvent: number;
  nextEventDate: string;
  periodHistory: PeriodRecord[];
  periodDates: string[];
  predictedPeriodDates: string[];
}
