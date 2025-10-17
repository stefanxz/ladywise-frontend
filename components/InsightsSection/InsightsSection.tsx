import React from "react";
import { Text, View } from "react-native";
import RiskCard from "../RiskCard/RiskCard";

const InsightsSection = () => {
  return (
    <View className="p-4 mt-9">
      <Text className="text-xl font-bold mb-4">Your insights</Text>
      <View className="flex-row gap-4">
        <View className="flex-1">
          <RiskCard
            title="Thrombosis Risk"
            level="Medium"
            description="lorem ipsum"
          ></RiskCard>
        </View>
        <View className="flex-1">
          <RiskCard
            title="Thrombosis Risk"
            level="Low"
            description="lorem ipsum"
          ></RiskCard>
        </View>
      </View>
    </View>
  );
};

export default InsightsSection;
