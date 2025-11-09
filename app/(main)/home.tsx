import InsightsSection from "@/components/InsightsSection/InsightsSection";
import { getRiskData } from "@/lib/api";
import { getAuthData } from "@/lib/auth";
import { RiskData } from "@/lib/types/health";
import React, { useEffect, useState } from "react";
import { ActivityIndicator } from "react-native";
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

async function fetchRiskData(): Promise<RiskData[]> {
  try {
    const payload = await getAuthData();
    const riskData = await getRiskData(payload);
    return [riskData]; // Success: return data
  } catch (e) {
    console.error("Error fetching Risk Data: ", e);
    return []; // Failure: return empty array to prevent UI crashes
  }
}

const home = () => {
  useEffect(() => {}, []);
  const [data, setData] = useState<RiskData[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  useEffect(() => {
    const loadData = async () => {
      try {
        console.log("Current auth data: ", getAuthData());
        const riskData = await fetchRiskData();
        console.log(riskData);
        setData(riskData);
      } catch (error) {
        console.error("[REMOVE IN PROD] error inside useEffect hook!");
        setData([]);
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, []);

  if (isLoading) {
    return (
      <SafeAreaView
        style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
      >
        <ActivityIndicator size="large" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView>
      <InsightsSection insights={data}></InsightsSection>
    </SafeAreaView>
  );
};
export default home;
