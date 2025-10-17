import InsightsSection from "@/components/InsightsSection/InsightsSection";
import { RiskData } from "@/lib/types/health";
import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";

const MOCK_INSIGHTS: RiskData[] = [
  {
    id: "1",
    title: "Thrombosis Risk",
    level: "Medium",
    description: "Some factors may raise clotting risk.",
  },
  {
    id: "2",
    title: "Anemia Risk",
    level: "Low",
    description: "Iron levels appear sufficient.",
  },
];

const home = () => {
  useEffect(() => {}, []);
  const [data, setData] = useState<RiskData[]>(MOCK_INSIGHTS);
  return (
    <SafeAreaView>
      <InsightsSection insights={data}></InsightsSection>
    </SafeAreaView>
  );
};
export default home;
