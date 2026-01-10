import { useState, useCallback, useMemo, useEffect } from "react";
import { startOfDay, endOfDay, parseISO } from "date-fns";
import { useAuth } from "@/context/AuthContext";
import { useTheme } from "@/context/ThemeContext";
import { getCycleStatus, getPeriodHistory, getPredictions } from "@/lib/api";
import { generateDateSet } from "@/utils/calendarHelpers";
import { ParsedPeriod, ParsedPrediction } from "@/lib/types/calendar";

/**
 * Manages the fetching, parsing, and caching of period and predicted period data
 */
export function usePeriodData() {
  const { token, isLoading: isAuthLoading } = useAuth();
  const { setPhase } = useTheme();

  // Memoize 'today' to prevent unnecessary re-calcs
  const today = useMemo(() => startOfDay(new Date()), []);

  // States for periods and predictions
  const [periods, setPeriods] = useState<ParsedPeriod[]>([]);
  const [predictions, setPredictions] = useState<ParsedPrediction[]>([]);

  // Fetch and parse data
  const fetchData = useCallback(async () => {
    if (isAuthLoading || !token) return;
    try {
      // For theme color
      const status = await getCycleStatus();
      // Update the theme context so we have the correct theme.highlight
      if (status?.currentPhase) {
        setPhase(status.currentPhase.toLowerCase() as any);
      }

      // Fetch period history
      const history = await getPeriodHistory();

      // Parse periods
      const parsedPeriods = history.map((p) => ({
        id: p.id, // Store ID
        start: startOfDay(parseISO(p.startDate)),
        // If end date is null (ongoing), use today as temp for visual rendering
        end: p.endDate ? endOfDay(parseISO(p.endDate)) : today,
        isOngoing: !p.endDate, // Track original state
      }));
      setPeriods(parsedPeriods);

      // Fetch predictions (next 6 months)
      const predictionData = await getPredictions(6);

      // Parse predictions
      const parsedPredictions = predictionData.map((p) => ({
        start: startOfDay(parseISO(p.startDate)),
        end: endOfDay(parseISO(p.endDate)),
      }));
      setPredictions(parsedPredictions);
    } catch (err) {
      console.error("Failed to fetch cycle calendar data: " + err);
    }
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
  };
}
