import { useState, useCallback } from "react";
import { useFocusEffect } from "expo-router";
import { getRiskHistory } from "@/lib/api";
import { DiagnosticsResponseDTO } from "@/lib/types/diagnostics";
import { useToast } from "@/hooks/useToast";

/**
 * Custom hook to fetch and manage historical diagnostic data.
 *
 * This hook retrieves the user's risk history (anemia, thrombosis) and flow data
 * from the backend, sorted chronologically. It automatically refreshes data when
 * the screen comes into focus.
 *
 * @param riskFactor - Optional filter (currently unused in fetching, but preserved for API alignment).
 * @param view - The time granularity for the data (e.g., "daily", "weekly"). Defaults to "daily".
 * @returns An object containing the history array, loading state, and a manual refetch function.
 */
export const useRiskData = (riskFactor?: string, view: string = "daily") => {
  const { showToast } = useToast();
  const [history, setHistory] = useState<DiagnosticsResponseDTO[]>([]);
  const [loading, setLoading] = useState(true);

  /**
   * Fetches diagnostic history from the API.
   * Handles error states via toast notifications and ensures data is sorted by date.
   */
  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getRiskHistory(view);
      if (Array.isArray(data)) {
        const sorted = data.sort(
          (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
        );
        setHistory(sorted);
      } else {
        showToast("Received invalid data from server.", "error");
      }
    } catch (e: any) {
      // Only show specific errors or generic fallback
      showToast("Failed to load history.", "error");
    } finally {
      setLoading(false);
    }
  }, [view, showToast]);

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [loadData]),
  );

  return { history, loading, refetch: loadData };
};
