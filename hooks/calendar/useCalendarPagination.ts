import { useState, useCallback, useRef, useMemo } from "react";
import { subMonths, addMonths, startOfDay } from "date-fns";
import { generateMonths } from "@/utils/calendarHelpers";

// Configuration
const PRELOAD_PAST_MONTHS = 6; // Load 6 months back for initial render
const PRELOAD_FUTURE_MONTHS = 6; // Load 6 months forward for initial render
const BATCH_SIZE = 6; // Load 6 months at a time

/**
 * Manages the infinite scroll state, loading locks, and month generation for the calendar.
 *
 * @returns An object containing:
 * - `months`: Array of month objects to display
 * - `isListReady`: Boolean indicating if the initial list preparation is done
 * - `isLoadingPast/Future`: Loading states for pagination
 * - `loadMorePast/Future`: Callbacks to trigger pagination
 * - `PRELOAD_PAST_MONTHS`: Constant for initial scroll index calculation
 */
export function useCalendarPagination() {
  const today = useMemo(() => startOfDay(new Date()), []);
  const [isListReady, setIsListReady] = useState(false);

  // Initialize months state with past and future buffer
  const [months, setMonths] = useState<any[]>(() => {
    const start = subMonths(today, PRELOAD_PAST_MONTHS);
    const totalMonths = PRELOAD_PAST_MONTHS + 1 + PRELOAD_FUTURE_MONTHS;
    return generateMonths(start, totalMonths);
  });

  // Loading states
  const [isLoadingPast, setIsLoadingPast] = useState(false);
  const [isLoadingFuture, setIsLoadingFuture] = useState(false);

  // Refs for synchronous locking during rapid scrolling
  const isLoadingPastRef = useRef(false);
  const isLoadingFutureRef = useRef(false);

  // Load previous months
  const loadMorePast = useCallback(() => {
    // Check if locked
    if (isLoadingPastRef.current) return;

    // Set lock for past loading
    isLoadingPastRef.current = true;
    setIsLoadingPast(true);

    // Small delay to allow UI to show spinner (feels more responsive)
    setTimeout(() => {
      setMonths((currentMonths) => {
        return [
          ...generateMonths(
            subMonths(currentMonths[0].date, BATCH_SIZE),
            BATCH_SIZE,
          ),
          ...currentMonths,
        ];
      });

      // Release lock
      setTimeout(() => {
        isLoadingPastRef.current = false;
        setIsLoadingPast(false);
      }, 500);
    }, 800);
  }, []);

  // Load future months
  const loadMoreFuture = useCallback(() => {
    // Check if locked
    if (isLoadingFutureRef.current) return;

    // Set lock for future loading
    isLoadingFutureRef.current = true;
    setIsLoadingFuture(true);

    // Small delay to allow UI to show spinner (feels more responsive)
    setTimeout(() => {
      setMonths((currentMonths) => {
        return [
          ...currentMonths,
          ...generateMonths(
            addMonths(currentMonths[currentMonths.length - 1].date, 1),
            BATCH_SIZE,
          ),
        ];
      });

      // Release lock
      setTimeout(() => {
        isLoadingFutureRef.current = false;
        setIsLoadingFuture(false);
      }, 500);
    }, 800);
  }, []);

  return {
    months,
    isListReady,
    setIsListReady,
    isLoadingPast,
    isLoadingFuture,
    loadMorePast,
    loadMoreFuture,
    PRELOAD_PAST_MONTHS, // Exported for initialScrollIndex
  };
}
