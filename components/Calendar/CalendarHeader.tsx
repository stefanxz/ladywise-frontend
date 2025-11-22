import React from 'react';
import { View, Text } from 'react-native';
import { clsx } from 'clsx';

// The week days we use
const WEEK_DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

const CalendarHeader = () => {
  return (
    // Matches the screen background
    <View className="bg-[#F9F9F9] pb-2 z-10">
      <Text className="text-3xl font-bold text-stone-800 px-8 mb-4 font-sans mt-2">
        Calendar
      </Text>
      
      {/* Rounded Rectangle Container */}
      <View className="mx-6 bg-white rounded-full shadow-sm flex-row justify-between py-3 px-2">
        {WEEK_DAYS.map((day, index) => {
          const isWeekend = index >= 5; 
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