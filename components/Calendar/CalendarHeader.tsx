import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { clsx } from "clsx";
import { useTheme } from "@/context/ThemeContext"; // 1. Import hook
import { useRouter } from "expo-router";

// The week days we use
const WEEK_DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

/**
 * CalendarHeader
 *
 * Renders the header for the Calendar screen, including the title,
 * a help button, and the row of weekday labels (Mon-Sun).
 *
 * @returns {JSX.Element} The rendered header component
 */
const CalendarHeader = () => {
  const router = useRouter();
  const { theme } = useTheme();
  return (
    // Matches the screen background
    <View className="bg-[#F9F9F9] pb-2 z-10">
      <View className="flex-row justify-between items-center px-8 mb-4 mt-2">
        <Text className="text-3xl font-bold text-stone-800 mb-4 mt-2">
          Calendar
        </Text>

        <TouchableOpacity
          onPress={() => {
            router.push("/(main)/questions");
          }}
          className="w-12 h-12 rounded-full bg-gray-100 justify-center text-sm items-center"
          style={{ backgroundColor: theme.highlight }}
        >
          <Text
            className="text-lg fond-bold text-gray-800"
            style={{ color: theme.highlightTextColor }}
          >
            ?
          </Text>
        </TouchableOpacity>
      </View>

      {/* Rounded Rectangle Container */}
      <View className="mx-6 bg-white rounded-full shadow-sm flex-row justify-between py-3 px-2">
        {WEEK_DAYS.map((day, index) => {
          const isWeekend = index >= 5;
          return (
            <Text
              key={day}
              className={clsx(
                "flex-1 text-center font-bold text-sm",
                isWeekend ? "text-stone-400" : "text-stone-800",
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
