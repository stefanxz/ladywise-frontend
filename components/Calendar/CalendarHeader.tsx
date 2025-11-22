import React from 'react';
import { View, Text } from 'react-native';
import { clsx } from 'clsx';

// The week days we use
const WEEK_DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

const CalendarHeader = () => {
  return (
    <View className="bg-white pt-4 pb-2 z-10">
      <Text className="text-3xl font-bold text-stone-800 px-8 mb-6 font-sans">
        Calendar
      </Text>
      
      {/* Rounded Rectangle Container */}
      <View className="mx-8 bg-white flex-row justify-between py-2">
        {WEEK_DAYS.map((day, index) => {
          const isWeekend = index >= 5; // Sat (5) or Sun (6)
          return (
            <Text 
              key={day} 
              className={clsx(
                "flex-1 text-center font-bold text-sm",
                isWeekend ? "text-stone-400" : "text-stone-800"
              )}
            >
              {day}
            </Text>
          );
        })}
      </View>
    </View>
  );
};

export default CalendarHeader;