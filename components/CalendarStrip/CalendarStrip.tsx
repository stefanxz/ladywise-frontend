import { View, Text, TouchableOpacity, FlatList } from "react-native";
import React from "react";
import { themes } from "@/lib/themes";
import { DayItem } from "./DayItem";

export type DayData = {
  id: string;
  dayNumber: string;
  dayLetter: string;
  isCurrentDay: boolean;
  isPeriodDay?: boolean;
};

type CalendarStripProps = {
  days: DayData[];
  themeColor: string; // highlight color for the particular day
  onDayPress: (dayId: string) => void;
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
          justifyContent: "space-around",
          paddingHorizontal: 20,
        }}
      />
    </View>
  );
};

export default CalendarStrip;
