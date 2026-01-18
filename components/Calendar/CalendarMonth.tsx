import React from "react";
import { View, Text, Pressable } from "react-native";
import { Feather } from "@expo/vector-icons";
import { format, isSameDay, isWithinInterval } from "date-fns";
import CalendarDay from "./CalendarDay";

/**
 * Properties for the CalendarMonth component.
 */
type CalendarMonthProps = {
  /** The month object containing title and days array. */
  item: any;
  /** Set of date strings (yyyy-MM-dd) representing actual period days. */
  periodDateSet: Set<string>;
  /** Set of date strings (yyyy-MM-dd) representing predicted period days. */
  predictionDateSet: Set<string>;
  /** Current selection range (start and end dates). */
  selection: { start: Date | null; end: Date | null };
  /** Whether the user is currently in log selection mode. */
  isLogMode: boolean;
  /** Whether the current selection is ongoing (open-ended). */
  isOngoing: boolean;
  /** Theme highlight color. */
  themeColor: string;
  /** Callback when a date is pressed. */
  onPress: (date: Date, position: { x: number; y: number }) => void;
  /** Callback to close the tooltip. */
  onCloseTooltip: () => void;
  /** The current date (Today). */
  today: Date;
};

/**
 * Calendar Month Component
 *
 * Responsible for rendering a single month's grid within the larger calendar view.
 * It manages the display of individual days, applying distinct visual styles for
 * tracked periods, predicted cycles, and the current user selection.
 *
 * This component handles the logic for determining which days fall within a
 * selected range and coordinates with the parent calendar to handle user interactions.
 */
const CalendarMonth = React.memo(
  ({
    item,
    periodDateSet,
    predictionDateSet,
    selection,
    isLogMode,
    isOngoing,
    themeColor,
    onPress,
    onCloseTooltip,
    today,
  }: CalendarMonthProps) => {
    // Efficient lookup helper
    const checkIsPeriod = (date: Date) =>
      periodDateSet.has(format(date, "yyyy-MM-dd"));
    const checkIsPrediction = (date: Date) =>
      predictionDateSet.has(format(date, "yyyy-MM-dd"));

    return (
      // Container for the month to close tooltip on press
      <Pressable onPress={onCloseTooltip} className="mb-0 px-4">
        <View className="flex-row items-center justify-center mb-2 mt-2 space-x-2">
          <Feather name="calendar" size={18} color="#44403C" />
          <View className="flex-row items-baseline ml-2">
            <Text className="text-stone-900 text-lg font-bold mr-1">
              {item.titleMonth}
            </Text>
            <Text className="text-stone-400 text-lg font-medium">
              {item.titleYear}
            </Text>
          </View>
        </View>

        <View className="flex-row flex-wrap mx-2">
          {item.days.map((date: Date | null, index: number) => {
            const isPeriodDay = date ? checkIsPeriod(date) : false;
            const isPredictionDay =
              date && !isPeriodDay ? checkIsPrediction(date) : false;
            let isSelected = false;
            let isInRange = false;
            let isSelectionStart = false;
            let isSelectionEnd = false;

            // Selection logic (only active in log mode)
            if (isLogMode && date && selection.start) {
              const { start, end } = selection;
              isSelectionStart = isSameDay(date, start);

              // If ongoing, the visual end is 'today'
              const effectiveEnd = isOngoing ? today : end;
              isSelectionEnd = effectiveEnd
                ? isSameDay(date, effectiveEnd)
                : false;
              if (isSelectionStart || isSelectionEnd) {
                isSelected = true;
              } else if (
                effectiveEnd &&
                isWithinInterval(date, { start, end: effectiveEnd })
              ) {
                isInRange = true;
              }
            }

            return (
              <CalendarDay
                key={date ? date.toISOString() : `empty-${item.id}-${index}`}
                date={date}
                isPeriod={isPeriodDay}
                isPrediction={isPredictionDay}
                isSelected={isSelected}
                isInRange={isInRange}
                isSelectionStart={isSelectionStart}
                isSelectionEnd={isSelectionEnd}
                themeColor={themeColor}
                onPress={onPress}
              />
            );
          })}
        </View>
      </Pressable>
    );
  },
);

// needed for "debugging purposes", otherwise the linter complains
CalendarMonth.displayName = "CalendarMonth";

export default CalendarMonth;
