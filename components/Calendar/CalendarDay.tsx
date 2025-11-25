import React, { useMemo } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { format, isSameDay, isWeekend } from 'date-fns';
import { clsx } from 'clsx';
import { themes } from "@/lib/themes";


interface CalendarDayProps {
  date: Date | null;
  onPress?: (date: Date) => void;
  isPeriod?: boolean;
  isPrediction?: boolean;
  themeColor: string;
}

const CalendarDay = React.memo(({ date, onPress, isPeriod = false, isPrediction = false, themeColor }: CalendarDayProps) => {
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
      borderStyle?: 'solid' | 'dotted' | 'dashed';
    } = {
      backgroundColor: "transparent",
      borderColor: "transparent",
      borderWidth: 0,
      borderStyle: 'solid',
    };

    // Period styling 
    if (isPeriod) {
      styles.borderColor = themes.menstrual.highlight;
      styles.borderWidth = 1.5;

      // If it's today apply transparent red tint
      if (!isToday) {
        styles.backgroundColor = "rgba(219, 136, 136, 0.12)";
      }
    }

    else if (isPrediction) {
      styles.borderColor = themes.menstrual.highlight;
      styles.borderWidth = 1.5;
      styles.borderStyle = 'dashed'; // Dashed border for predictions
      if (!isToday) {
        styles.backgroundColor = "rgba(219, 136, 136, 0.05)"; // Very faint tint
      }
    }

    // Today styling
    if (isToday) {
      styles.backgroundColor = themeColor;

      if (isPeriod || isPrediction) {
        // keep the styles set in block 1 or 2 :D
      } else {
        // standard today look
        styles.borderColor = themeColor;
        styles.borderWidth = 3;
        styles.borderStyle = 'solid';
      }
    }

    return styles;


  }, [isPeriod, isPrediction, isToday, themeColor]);

  const textClasses = clsx(
    "text-xl font-bold",
    {
      "text-black": isToday,
      "text-stone-800": !isToday && !isWeekend(date),
      "text-stone-400": !isToday && isWeekend(date),
    }
  )
  
  return (
    <View className={containerBase}>
      <TouchableOpacity 
        onPress={() => onPress?.(date)}
        activeOpacity={0.7}
        className="w-[88%] h-[88%] items-center justify-center rounded-xl"
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