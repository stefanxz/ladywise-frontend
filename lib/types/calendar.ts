// Represents a parsed period with start and end dates
export type ParsedPeriod = {
  id: string;
  start: Date;
  end: Date;
  isOngoing?: boolean;
};

// Represents a parsed prediction with start and end dates
export type ParsedPrediction = {
  start: Date;
  end: Date;
};

// Represents the state of a tooltip in the calendar screen
export type TooltipState = {
  visible: boolean;
  position: { x: number; y: number } | null;
  periodId: string | null;
};