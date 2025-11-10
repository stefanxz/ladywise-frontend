import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { type Theme } from "@/lib/themes";
import { LinearGradient } from "expo-linear-gradient";

type PhaseCardProps = {
  phaseName: string;
  dayOfPhase: string;
  subtitle: string;
  theme: Theme;
  onLogPeriodPress: () => void;
  onCardPress: () => void;
};

const PhaseCard: React.FC<PhaseCardProps> = ({
  phaseName,
  dayOfPhase,
  subtitle,
  theme,
  onLogPeriodPress,
  onCardPress,
}) => {
  return (
    <View
      className="mx-5 rounded-3xl shadow-lg shadow-black/10 overflow-hidden"
      style={{ backgroundColor: theme.cardColor }}
    >
      <TouchableOpacity
        onPress={onCardPress}
        activeOpacity={0.8}
        className="p-6"
      >
        <View
          className="absolute top-6 right-6 w-7 h-7 rounded-full justify-center items-center"
          style={{ backgroundColor: theme.highlight }}
        >
          <Text
            className="text-sm font-bold"
            style={{ color: theme.highlightTextColor }}
          >
            &gt;
          </Text>
        </View>

        <View className="items-center my-5">
          <Text className="text-base font-medium text-gray-800 mb-1">
            {phaseName}
          </Text>
          <Text className="text-3xl font-bold text-black">{dayOfPhase}</Text>
          <View className="flex-row items-center mt-1">
            <Ionicons name="time-outline" size={14} color="#333" />
            <Text className="text-sm text-gray-800 ml-1.5">{subtitle}</Text>
          </View>
        </View>

        <TouchableOpacity
          onPress={(e) => {
            e.stopPropagation();
            onLogPeriodPress();
          }}
          activeOpacity={0.7}
          className="self-center py-3 px-6 rounded-xl mt-5"
          style={{ backgroundColor: theme.highlight }}
        >
          <Text
            className="text-base font-semibold"
            style={{ color: theme.buttonText }}
          >
            Log period +
          </Text>
        </TouchableOpacity>
      </TouchableOpacity>
    </View>
  );
};

export default PhaseCard;
