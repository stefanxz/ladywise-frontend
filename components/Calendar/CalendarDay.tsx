import React, { useMemo, useRef } from 'react';
import { View, Text, TouchableOpacity, GestureResponderEvent } from 'react-native';
import { format, isSameDay, isWeekend } from 'date-fns';
import { clsx } from 'clsx';
import { themes } from "@/lib/themes";

// Fixed darker red for selection endpoints
const SELECTION_RED = "rgba(205, 22, 61, 0.9)";

interface CalendarDayProps {
  date: Date | null;
  onPress?: (date: Date, position: { x: number; y: number }) => void;
  isPeriod?: boolean;
  isSelected?: boolean;
  isInRange?: boolean;
  isSelectionStart?: boolean; 
  isSelectionEnd?: boolean;
  isPrediction?: boolean;
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
  isPrediction = false, themeColor 
}: CalendarDayProps) => {
  
  // Reference to the day view for measuring position
  const viewRef = useRef<View>(null);

  // Handle empty days (padding at start of month)
  if (!date) {
    return <View className="w-[14.28%] aspect-square" />;
  }

  // Calculate status
  const isToday = isSameDay(date, new Date());

  // Base container style (1/7th width)
  const containerBase = "w-[14.28%] aspect-square justify-center items-center mb-1 rounded-full";

  // Handle press to measure position for tooltip
  const handlePress = () => {
    if (onPress && viewRef.current) {
      // .measure calculates the position of the element relative to the screen
      viewRef.current.measure((x, y, width, height, pageX, pageY) => {
        // Calculate center X (the horizontal center of the day component)
        const centerX = pageX + (width / 2);
        // Calculate top Y (the top edge of the day component)
        const topY = pageY;
        
        onPress(date, { x: centerX, y: topY });
      });
    }
  };
  
  // Dynamic styles based on state
  const dynamicStyles = useMemo(() => {
    const styles: any = {
      backgroundColor: "transparent",
      borderColor: "transparent",
      borderWidth: 0,
      borderStyle: 'solid',
    };

    // Period styling 
    if (isPeriod && !isSelected && !isInRange) {
      styles.borderColor = themes.menstrual.highlight;
      styles.borderWidth = 1.5;

      // If it's not today apply transparent red tint
      if (!isToday) {
        styles.backgroundColor = "rgba(225, 29, 72, 0.15)";
      }
      // Prediction styling
    } else if (isPrediction) {
      styles.borderColor = themes.menstrual.highlight;
      styles.borderWidth = 1.5;
      styles.borderStyle = 'dashed'; // Dashed border for predictions
      if (!isToday) {
        styles.backgroundColor = "rgba(219, 136, 136, 0.05)"; // Very faint tint
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
      styles.backgroundColor = themeColor;
      // If it's selected, period, or prediction, we don't keep the standard today border
      if (!isSelected && !isInRange && !isPeriod && !isPrediction) {
        // Standard today style
        styles.borderColor = themeColor;
        styles.borderWidth = 3;
        styles.borderStyle = 'solid';
      }
    }

    return styles;
  }, [isPeriod, isPrediction, isToday, isSelected, isInRange, themeColor]);

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
    <View
      className={containerBase}
      ref={viewRef}
      collapsable={false}
    >
      <TouchableOpacity 
        onPress={handlePress}
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