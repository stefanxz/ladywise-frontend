import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { format, isSameDay, isWeekend } from 'date-fns';
import { clsx } from 'clsx';

interface CalendarDayProps {
  date: Date | null;
  onPress: (date: Date) => void;
}

const CalendarDay = React.memo(({ date, onPress }: CalendarDayProps) => {
  // Handle empty days (padding at start of month)
  if (!date) {
    return <View className="w-[14.28%] aspect-square" />;
  }

  // Calculate status
  const isToday = isSameDay(date, new Date());

  // Base container style (1/7th width)
  const containerBase = "w-[14.28%] aspect-square justify-center items-center mb-1 rounded-full";
  
  return (
    <TouchableOpacity 
      onPress={() => onPress?.(date)}
      activeOpacity={0.7}
      className={containerBase}
    >
      {/* Today Indicator (Small dot) */}
      {isToday && (
        <View className="absolute top-1 right-2 w-1.5 h-1.5 bg-red-400 rounded-full" />
      )}
      
      <Text className={clsx(
        "text-xl font-bold",
        isToday 
          ? "text-red-500" // Today overrides everything
          : isWeekend(date)
            ? "text-stone-400" // Grey for weekends
            : "text-stone-800" // Black for weekdays
      )}>
        {format(date, 'd')}
      </Text>
    </TouchableOpacity>
  );
});

export default CalendarDay;