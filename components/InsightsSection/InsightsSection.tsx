import React from "react";
import { View } from "react-native";
import RiskCard from "../RiskCard/RiskCard";

interface InsightProps {}

const InsightsSection = () => {
  return (
    <View>
      <RiskCard
        title="Thrombosis Risk"
        level="Medium"
        description="lorem ipsum"
      ></RiskCard>
      <RiskCard
        title="Thrombosis Risk"
        level="Medium"
        description="lorem ipsum"
      ></RiskCard>
    </View>
  );
};

export default InsightsSection;
