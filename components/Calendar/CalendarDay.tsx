import React, { useMemo } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { format, isSameDay, isWeekend } from 'date-fns';
import { clsx } from 'clsx';
import { themes } from "@/lib/themes";


interface CalendarDayProps {
  date: Date | null;
  onPress?: (date: Date) => void;
  isPeriod?: boolean;
  themeColor: string;
}

const CalendarDay = React.memo(({ date, onPress, isPeriod = false, themeColor }: CalendarDayProps) => {
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
    if (isPeriod) {
      styles.borderColor = themes.menstrual.highlight;
      styles.borderWidth = 1.5;

      // If it's today apply transparent red tint
      if (!isToday) {
        styles.backgroundColor = "rgba(219, 136, 136, 0.26)";
      }
    }

    // Today styling
    if (isToday) {
      styles.backgroundColor = themeColor;
      styles.borderColor = themeColor;
      styles.borderWidth = 3;
    }

    return styles;


  }, [isPeriod, isToday, themeColor]);

  const textClasses = clsx(
    "text-lg font-bold",
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
        className="w-full h-full items-center justify-center rounded-xl"
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