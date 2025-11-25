import React, { useMemo } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { format, isSameDay, isWeekend } from 'date-fns';
import { clsx } from 'clsx';
import { themes } from "@/lib/themes";

// Fixed darker red for selection endpoints
const SELECTION_RED = "#E11D48";

interface CalendarDayProps {
  date: Date | null;
  onPress?: (date: Date) => void;
  isPeriod?: boolean;
  isSelected?: boolean;
  isInRange?: boolean;
  isSelectionStart?: boolean; 
  isSelectionEnd?: boolean;
  themeColor: string;
}

const CalendarDay = React.memo(({ 
  date, 
  onPress, 
  isPeriod = false, 
  isSelected = false,
  isInRange = false,
  isSelectionStart = false,
  isSelectionEnd = false,
  themeColor 
}: CalendarDayProps) => {
  // Handle empty days (padding at start of month)
  if (!date) {
    return <View className="w-[14.28%] aspect-square" />;
  }

  // Calculate status
  const isToday = isSameDay(date, new Date());

  // Base container style (1/7th width)
  const containerBase = "w-[14.28%] aspect-square justify-center items-center mb-1 rounded-full";

  const dynamicStyles = useMemo(() => {
    const styles: {
      backgroundColor: string;
      borderColor: string;
      borderWidth: number;
    } = {
      backgroundColor: "transparent",
      borderColor: "transparent",
      borderWidth: 0,
    };

    // Period styling 
    if (isPeriod && !isSelected && !isInRange) {
      styles.borderColor = themes.menstrual.highlight;
      styles.borderWidth = 1.5;

      // If it's today apply transparent red tint
      if (!isToday) {
        styles.backgroundColor = "rgba(219, 136, 136, 0.12)";
      }
    }

    // Styling for days in the new selection range
    if (isInRange) {
      styles.backgroundColor = "rgba(225, 29, 72, 0.15)"; // Light tint of SELECTION_RED
    }

    // Styling for new selection start and end days
    if (isSelected) {
      styles.backgroundColor = SELECTION_RED;
      styles.borderColor = SELECTION_RED;
    }

    // Today styling
    if (isToday) {
      // If it's selected, we don't keep the themeColor as background
      if (!isSelected && !isInRange) {
        styles.backgroundColor = themeColor;
      }
      styles.borderColor = themeColor;
      styles.borderWidth = 3;
    }

    return styles;
  }, [isPeriod, isToday, isSelected, isInRange, themeColor]);

  // Rounding logic for selection days
  let borderRadiusClass = "rounded-full"; // Default circle for single-day selections
  if (isInRange) {
    borderRadiusClass = "rounded-none"; // Inner days of the selection range are square-ish
  }
  // Only round left side for start day of the selection
  if (isSelectionStart && !isSelectionEnd) borderRadiusClass = "rounded-l-full rounded-r-none";
  // Only round right side for end day of the selection
  if (isSelectionEnd && !isSelectionStart) borderRadiusClass = "rounded-r-full rounded-l-none";

  // Text styling
  const textClasses = clsx(
    "text-xl font-bold",
    {
      "text-white": isSelected, // White text on the dark red selection
      "text-black": isToday && !isSelected, // Black text for today if not selected
      "text-stone-800": !isToday && !isWeekend(date) && !isSelected,
      "text-stone-400": !isToday && isWeekend(date) && !isSelected,
    }
  )
  
  return (
    <View className={containerBase}>
      <TouchableOpacity 
        onPress={() => onPress?.(date)}
        activeOpacity={0.7}
        // If in range, we span wider to connect. If single selection, we stay round.
        className={clsx(
          "h-[88%] items-center justify-center", 
          borderRadiusClass,
          (isInRange || isSelected) ? "w-[100%]" : "w-[88%] rounded-xl"
        )}
        style={dynamicStyles}
      >
        <Text className={textClasses}>
          {format(date, 'd')}
        </Text>
      </TouchableOpacity>
    </View>
  );
});

export default CalendarDay;