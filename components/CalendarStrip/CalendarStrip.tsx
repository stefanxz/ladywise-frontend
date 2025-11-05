import { View, Text, TouchableOpacity, FlatList } from 'react-native'
import React from 'react'

export type DayData = {
    id: string;
    dayNumber: string;
    dayLetter: string;
    isCurrentDay: boolean;
}

type CalendarStripProps = {
    days: DayData[];
    themeColor: string; // highlight color for the particular day
    onDayPress: (dayId: string) => void;
}

const DayItem : React.FC<{
    item: DayData;
    themeColor: string;
    onPress: () => void;
}> = ({ item, themeColor, onPress}) => {
  const isCurrent = item.isCurrentDay;

  const containerClasses = isCurrent
      ? `rounded-xl py-2 px-3 items-center` // Current day
      : `py-2 px-3 items-center`; // Other days (no shape)


  const numberClasses = isCurrent
    ? `text-lg font-bold text-black` 
    : `text-lg font-bold text-gray-800`; 

  const letterClasses = isCurrent
    ? `text-sm text-black` 
    : `text-sm text-gray-500`; 

  return (
    <TouchableOpacity
      onPress={onPress}
      className={containerClasses}
      style={isCurrent ? { backgroundColor: themeColor } : {}}>
      <Text className={numberClasses}>{item.dayNumber}</Text>
      <Text className={`mt-0.5 ${letterClasses}`}>{item.dayLetter}</Text>
    </TouchableOpacity>
  );
};

const CalendarStrip: React.FC<CalendarStripProps> = ({
  days,
  themeColor,
  onDayPress,
}) => {
  return (
    <View className="w-full pb-5">
      <FlatList
        data={days}
        renderItem={({ item }) => (
          <DayItem
            item={item}
            themeColor={themeColor}
            onPress={() => onDayPress(item.id)}
          />
        )}
        keyExtractor={(item) => item.id}
        horizontal
        showsHorizontalScrollIndicator={false}
        // make sure the days are spaced out
        contentContainerStyle={{
          flexGrow: 1,
          justifyContent: 'space-around',
          paddingHorizontal: 20,
        }}
      />
    </View>
  );
};

export default CalendarStrip;