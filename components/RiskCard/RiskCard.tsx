import React from "react";
import { View } from "react-native";
import { Text } from "react-native-svg";

interface RiskCardProps {
  title: string;
  level: "Low" | "Medium" | "High";
  description: string;
}

interface riskLevelColorMap {
  Low: "text-green-500";
  Medium: "text-yellow-500";
  High: "text-red-500";
}

const RiskCard = ({ title, level, description }: RiskCardProps) => {
  return (
    <View className="bg-white px-24 py-16 rounded-xl shadow-sm">
      <Text>{title}</Text>
      <Text>{level}</Text>
      <Text>{description}</Text>
    </View>
  );
};

export default RiskCard;
