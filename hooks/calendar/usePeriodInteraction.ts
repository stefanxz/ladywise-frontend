import { useState, useCallback, useMemo } from "react";
import { Alert } from "react-native";
import {
  isAfter,
  isBefore,
  isSameDay,
  startOfDay,
  isWithinInterval,
  areIntervalsOverlapping,
  addDays,
  subDays,
  format,
} from "date-fns";
import { deletePeriod, logNewPeriod, updatePeriod } from "@/lib/api";
import { PeriodLogRequest } from "@/lib/types/period";
import { ParsedPeriod, TooltipState } from "@/lib/types/calendar";

interface UsePeriodInteractionProps {
  periods: ParsedPeriod[];
  refreshData: () => Promise<void>;
}

/**
 * Manages user interactions: selection, logging, editing, deleting, and validation of periods
 */
export function usePeriodInteraction({ periods, refreshData }: UsePeriodInteractionProps) {
  const today = useMemo(() => startOfDay(new Date()), []);

  // Mode and selection state
  const [isLogMode, setIsLogMode] = useState(false);
  const [editingPeriodId, setEditingPeriodId] = useState<string | null>(null);
  const [selection, setSelection] = useState<{ start: Date | null; end: Date | null }>({ start: null, end: null });
  const [isOngoing, setIsOngoing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Tooltip state
  const [tooltip, setTooltip] = useState<TooltipState>({
    visible: false,
    position: null,
    periodId: null,
  });

  // Actions

  // Handle logging a new period
  const handleLogPeriodStart = () => {
    setIsLogMode(true);
    setEditingPeriodId(null);
    setSelection({ start: null, end: null });
    setIsOngoing(false);
    setTooltip((prev) => ({ ...prev, visible: false }));
  };

  // Handle log canceling
  const handleCancelLog = () => {
    setIsLogMode(false);
    setEditingPeriodId(null);
    setSelection({ start: null, end: null });
    setIsOngoing(false);
  };

  // Handle "Ongoing" toggle
  const toggleOngoing = () => {
    const newState = !isOngoing;
    setIsOngoing(newState);
    if (newState && selection.start) {
      // If toggle on, sets end date to today (visual only, API will get null)
      setSelection((prev) => ({ ...prev, end: today }));
    } else if (!newState) {
      // If toggle off, clear the end date so user can pick manually
      setSelection((prev) => ({ ...prev, end: null }));
    }
  };  

  // Handle editing an existing period
  const handleEditPeriod = () => {
    const periodToEdit = periods.find((p) => p.id === tooltip.periodId);
    if (!periodToEdit) return;

    // Enter log mode with pre-filled data
    setIsLogMode(true);
    setEditingPeriodId(periodToEdit.id);
    setSelection({ start: periodToEdit.start, end: periodToEdit.end });
    setIsOngoing(!!periodToEdit.isOngoing);

    // Close tooltip
    setTooltip({ visible: false, position: null, periodId: null });
  };

  // Handle deleting an existing period
  const handleDeletePeriod = () => {
    Alert.alert("Delete Period", "Are you sure you want to delete this period log?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          if (!tooltip.periodId) return;
          try {
            await deletePeriod(tooltip.periodId);
            await refreshData();
            setTooltip({ visible: false, position: null, periodId: null });
          } catch (error) {
            Alert.alert("Error", "Failed to delete period." + error);
          }
        },
      },
    ]);
  };

  const handleDatePress = useCallback(
    (date: Date, position: { x: number; y: number }) => {
      // Log Mode Logic
      if (isLogMode) {
        if (isAfter(date, today)) return; // No future dates

        setSelection((prev) => {
          // If "Ongoing" is checked, we only allow picking a Start Date
          if (isOngoing) return { start: date, end: today };
          const { start, end } = prev;

          // Start new selection
          if (!start) return { start: date, end: null };

          // Complete selection
          if (start && !end) {
            // Clicked before start so we reset start
            if (isBefore(date, start)) return { start: date, end: null };
            // Clicked same day so we deselect
            if (isSameDay(date, start)) return { start: null, end: null };
            // Click after start means the range is complete
            return { start, end: date };
          }
          // Restart selection if full range already exists
          return { start: date, end: null };
        });
        return;
      }

      // Not in log mode - handle tooltip for existing periods
      // Check if the tapped date belongs to an existing period
      const clickedPeriod = periods.find((p) =>
        isWithinInterval(date, { start: p.start, end: p.end })
      );
      if (clickedPeriod) {
        // Show tooltip at click position
        setTooltip({ visible: true, position, periodId: clickedPeriod.id });
      } else {
        // Hide tooltip if clicking empty space
        setTooltip({ visible: false, position: null, periodId: null });
      }
    },
    [isLogMode, isOngoing, today, periods]
  );

  // Validation for overlapping or adjacent periods
  const validateSelection = (start: Date, end: Date) => {
    // Overlap check

    // Filter out the period currently being edited from the overlap check
    // so it doesn't collide with its own previous state
    const otherPeriods = editingPeriodId
      ? periods.filter((p) => p.id !== editingPeriodId)
      : periods;

    const hasOverlap = otherPeriods.some((p) =>
      areIntervalsOverlapping({ start, end }, { start: p.start, end: p.end }, { inclusive: true })
    );

    if (hasOverlap) {
      Alert.alert("Period already logged!", "It looks like you've already tracked a period during this timeframe. You can just tap on the existing entry to edit it!");
      return false;
    }

    // Adjacency check (1 day gap)
    const isAdjacent = otherPeriods.some((p) => {
      // Check if new.start is 1 day after p.end
      const touchesAfter = isSameDay(start, addDays(p.end, 1));
      // Check if new.end is 1 day before p.start
      const touchesBefore = isSameDay(end, subDays(p.start, 1));
      return touchesAfter || touchesBefore;
    });

    if (isAdjacent) {
      Alert.alert("Looks like one continuous period!", "Since these dates are right next to an existing log, try extending that period instead.");
      return false;
    }
    return true;
  };

  const handleSaveLog = async () => {
    if (!selection.start) {
      Alert.alert("Just a quick check!", "We need a start date to log this entry properly.");
      return;
    }

    // If ongoing, validation range is start -> today
    // If not ongoing, validation range is start -> end (or start -> start if single day)
    const effectiveEnd = selection.end || selection.start;
    if (!validateSelection(selection.start, effectiveEnd)) return;

    setIsSaving(true);
    try {
      const payload: PeriodLogRequest = {
        startDate: format(selection.start, "yyyy-MM-dd"),
        // If ongoing, send null. Otherwise send formatted date.
        endDate: isOngoing ? null : format(effectiveEnd, "yyyy-MM-dd"),
      };

      if (editingPeriodId) {
        // Update existing
        await updatePeriod(editingPeriodId, payload);
      } else {
        // Create new
        await logNewPeriod(payload);
      }

      // Refresh data and reset
      await refreshData();
      handleCancelLog();
      Alert.alert("Success!", editingPeriodId ? "We've updated this period in your history." : "We've added this period to your history.");
    } catch (error: any) {
      Alert.alert("Oops!", error.message || "We had trouble saving that just now. Please try again in a moment.");
    } finally {
      setIsSaving(false);
    }
  };

  return {
    isLogMode,
    isOngoing,
    isSaving,
    selection,
    tooltip,
    setTooltip,
    handleLogPeriodStart,
    handleCancelLog,
    toggleOngoing,
    handleEditPeriod,
    handleDeletePeriod,
    handleSaveLog,
    handleDatePress,
  };
}