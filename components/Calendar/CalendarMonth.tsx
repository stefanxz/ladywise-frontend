import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { format, isSameDay, isWithinInterval } from 'date-fns';
import CalendarDay from './CalendarDay';

// Props for CalendarMonth
type CalendarMonthProps = {
  item: any;
  periodDateSet: Set<string>;
  predictionDateSet: Set<string>;
  selection: { start: Date | null; end: Date | null };
  isLogMode: boolean;
  isOngoing: boolean;
  themeColor: string;
  onPress: (date: Date, position: { x: number; y: number }) => void;
  onCloseTooltip: () => void;
  today: Date;
};

// Defines a month view in the calendar, rendering days with appropriate styles
const CalendarMonth = React.memo(({
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
  const checkIsPeriod = (date: Date) => periodDateSet.has(format(date, 'yyyy-MM-dd'));
  const checkIsPrediction = (date: Date) => predictionDateSet.has(format(date, 'yyyy-MM-dd'));

  return (

    // Container for the month to close tooltip on press
    <Pressable 
      onPress={onCloseTooltip} 
      className="mb-0 px-4"
    >
      <View className="flex-row items-center justify-center mb-2 mt-2 space-x-2">
        <Feather name="calendar" size={18} color="#44403C" />
        <View className="flex-row items-baseline ml-2">
          <Text className="text-stone-900 text-lg font-bold mr-1">{item.titleMonth}</Text>
          <Text className="text-stone-400 text-lg font-medium">{item.titleYear}</Text>
        </View>
      </View>
      
      <View className="flex-row flex-wrap mx-2">
        {item.days.map((date: Date | null, index: number) => {
          const isPeriodDay = date ? checkIsPeriod(date) : false;
          const isPredictionDay = date && !isPeriodDay ? checkIsPrediction(date) : false;
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
             isSelectionEnd = effectiveEnd ? isSameDay(date, effectiveEnd) : false;
             if (isSelectionStart || isSelectionEnd) {
               isSelected = true;
             } else if (effectiveEnd && isWithinInterval(date, { start, end: effectiveEnd })) {
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
});

export default CalendarMonth;