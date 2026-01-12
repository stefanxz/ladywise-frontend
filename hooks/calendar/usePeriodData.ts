import { useState, useCallback, useMemo, useEffect } from "react";
import { startOfDay, endOfDay } from "date-fns";
import { useAuth } from "@/context/AuthContext";
import { useTheme } from "@/context/ThemeContext";
import { getCycleStatus, getPeriodHistory, getPredictions } from "@/lib/api";
import { generateDateSet, parseToLocalWithoutTime, safeFetch } from "@/utils/calendarHelpers";
import { ParsedPeriod, ParsedPrediction } from "@/lib/types/calendar";

/**
 * Manages the fetching, parsing, and caching of period and predicted period data.
 * Converts backend API responses into locally usable Date objects and optimized lookup sets.
 *
 * @returns An object containing:
 * - `periods`: Array of parsed period objects
 * - `predictions`: Array of parsed prediction objects
 * - `periodDateSet`: Set of strings (yyyy-MM-dd) for O(1) period day lookup
 * - `predictionDateSet`: Set of strings (yyyy-MM-dd) for O(1) prediction day lookup
 * - `refreshData`: Function to re-fetch data from the backend
 * - `today`: Reference to the current date (start of day)
 * - `currentPhase`: The current cycle phase (e.g., "menstrual", "follicular")
 */
export function usePeriodData() {
  const { token, isLoading: isAuthLoading } = useAuth();
  const { setPhase } = useTheme();

  // Memoize 'today' to prevent unnecessary re-calcs
  const today = useMemo(() => startOfDay(new Date()), []);

  // States for periods and predictions
  const [periods, setPeriods] = useState<ParsedPeriod[]>([]);
  const [predictions, setPredictions] = useState<ParsedPrediction[]>([]);

  const [currentPhase, setCurrentPhase] = useState<string | null>(null);

  // Fetch and parse data
  const fetchData = useCallback(async () => {
    if (isAuthLoading || !token) return;

    // Fetch the cycle status
    // We treat 404 as null
    const status = await safeFetch(getCycleStatus(), null, "cycle status");

    // Update theme based on current phase
    if (status?.currentPhase) {
      setPhase(status.currentPhase.toLowerCase() as any);
      setCurrentPhase(status.currentPhase.toLowerCase());
    } else {
      // Reset to default if an error or no data
      setPhase("neutral" as any);
      setCurrentPhase(null);
    }

    // Fetch period history
    // We treat 404 as empty array
    const history = await safeFetch(getPeriodHistory(), [], "period history");

    // Parse periods
    const parsedPeriods = history.map((p) => ({
      id: p.id, // Store ID
      start: parseToLocalWithoutTime(p.startDate),
      // If end date is null (ongoing), use today as temp for visual rendering
      end: p.endDate ? endOfDay(parseToLocalWithoutTime(p.endDate)) : today,
      isOngoing: !p.endDate, // Track original state
    }));
    setPeriods(parsedPeriods);

    // Fetch predictions (next 6 months)
    // We treat 404 as empty array
    const predictionData = await safeFetch(getPredictions(6), [], "predictions");

    // Parse predictions
    const parsedPredictions = predictionData.map((p) => ({
      start: parseToLocalWithoutTime(p.startDate),
      end: endOfDay(parseToLocalWithoutTime(p.endDate)),
    }));
    setPredictions(parsedPredictions);
  }, [token, isAuthLoading, setPhase, today]);

  // Initial load
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Optimized lookup sets (O(1))
  const periodDateSet = useMemo(() => generateDateSet(periods), [periods]);
  const predictionDateSet = useMemo(
    () => generateDateSet(predictions),
    [predictions],
  );

  return {
    periods,
    predictions,
    periodDateSet,
    predictionDateSet,
    refreshData: fetchData,
    today, // Exporting today ensures the UI uses the exact same reference
    currentPhase,
  };
}
