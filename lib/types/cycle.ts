export type CyclePhase = "MENSTRUAL" | "FOLLICULAR" | "OVULATION" | "LUTEAL";
export type CycleEvent = "NEXT_OVULATION" | "NEXT_PERIOD";

export interface PeriodRecord {
  startDate: string;
  endDate: string;
}

export interface CycleStatusDTO {
  currentCycleDay: number;
  currentPhase: CyclePhase;
  nextEvent: CycleEvent;
  daysUntilNextEvent: number;
  nextEventDate: string;
  periodHistory: PeriodRecord[];
  periodDates: string[];
  predictedPeriodDates: string[];
}
