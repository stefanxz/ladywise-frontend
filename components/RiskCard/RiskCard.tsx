import React from "react";
import { Text, View } from "react-native";
interface RiskCardProps {
  title: string;
  level: "Low" | "Medium" | "High";
  description: string;
}

const riskLevelColorMap = {
  Low: "text-green-500",
  Medium: "text-yellow-500",
  High: "text-red-500",
};

const RiskCard = ({ title, level, description }: RiskCardProps) => {
  const dynamicColor = riskLevelColorMap[level];
  return (
    <View className="bg-white p-4 rounded-xl shadow-sm items-center">
      <Text className="text-grey-600 mb-2">{title}</Text>
      <Text className={`text-xl font-bold ${dynamicColor}`}>{level}</Text>
      <Text className="text-sm text-gray-400 mt-1">{description}</Text>
    </View>
  );
};

export default RiskCard;
