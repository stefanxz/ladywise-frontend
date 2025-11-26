import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ActivityIndicator,
  ScrollView,
  Dimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LineChart } from "react-native-chart-kit";
import { isAxiosError } from "axios";

import { useAuth } from "@/context/AuthContext";
import { getRiskHistory } from "@/lib/api";
import type { RiskHistoryPoint } from "@/lib/types/risks";
import { Colors } from "@/constants/colors";

const screenWidth = Dimensions.get("window").width - 32;

type RiskNum = 0 | 1 | 2;
type FlowNum = 0 | 1 | 2 | 3;

const riskLabels: Record<RiskNum, string> = {
  0: "Low",
  1: "Medium",
  2: "High",
};

const flowLabels: Record<FlowNum, string> = {
  0: "None",
  1: "Light",
  2: "Normal",
  3: "Heavy",
};

// colors for text (and later, maybe dots) per level
const riskColors: Record<RiskNum, string> = {
  0: "#16a34a", // green
  1: "#eab308", // yellow
  2: "#dc2626", // red
};

const flowColors: Record<FlowNum, string> = {
  0: "#6B7280", // grey for "None"
  1: "#22c55e", // light-ish green
  2: Colors.brand, // normal = brand
  3: "#dc2626", // heavy = red
};

//TODO: When backend is properly implemented for keeping track of risk history remove this and change the
//useEffect so that it doesnt fall back on the mock data.
const mockHistory: RiskHistoryPoint[] = [
  {
    recordedAt: "2025-10-28T10:00:00Z",
    anemiaRisk: 1,
    thrombosisRisk: 0,
    menstrualFlow: 2,
  },
  {
    recordedAt: "2025-10-29T10:00:00Z",
    anemiaRisk: 1,
    thrombosisRisk: 1,
    menstrualFlow: 3,
  },
  {
    recordedAt: "2025-10-30T10:00:00Z",
    anemiaRisk: 2,
    thrombosisRisk: 1,
    menstrualFlow: 2,
  },
  {
    recordedAt: "2025-10-31T10:00:00Z",
    anemiaRisk: 1,
    thrombosisRisk: 2,
    menstrualFlow: 1,
  },
  {
    recordedAt: "2025-11-01T10:00:00Z",
    anemiaRisk: 0,
    thrombosisRisk: 1,
    menstrualFlow: 0,
  },
];

type DiagnosticsScreenProps = {
  history?: RiskHistoryPoint[];
};

export default function DiagnosticsScreen({
  history: historyProp,
}: DiagnosticsScreenProps) {
  const { token, userId } = useAuth();

  const [history, setHistory] = useState<RiskHistoryPoint[]>(historyProp ?? []);
  const [loading, setLoading] = useState(!historyProp);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (historyProp) return; // Don't fetch if history is passed as a prop

    if (!token || !userId) {
      // Not logged in, but for development purposes, show mock data.
      setHistory(mockHistory);
      setLoading(false);
      return;
    }

    const load = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getRiskHistory(token, userId);
        if (data && data.length > 0) {
          setHistory(data);
        } else {
          // If API returns no data, fallback to mock data for development
          setHistory(mockHistory);
        }
      } catch (err: unknown) {
        console.error("Failed to load risk history", err);

        // Fallback to mock data if API fails, as requested for development
        setHistory(mockHistory);

        if (isAxiosError(err)) {
          const status = err.response?.status;
          if (status === 401) {
            setError("Your session has expired. Please log in again.");
          } else {
            // Don't show a "not found" error, just use mock data for now.
            setError(null);
          }
        } else {
          setError(null); // Or a generic error message
        }
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [token, userId, historyProp]);

  const formatRiskTick = (value: string) => {
    const rounded = Math.round(Number(value)) as RiskNum;
    return riskLabels[rounded] ?? "";
  };

  const formatFlowTick = (value: string) => {
    const rounded = Math.round(Number(value)) as FlowNum;
    return flowLabels[rounded] ?? "";
  };

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-background">
        <ActivityIndicator size="large" color={Colors.brand} />
      </View>
    );
  }

  if (error) {
    return (
      <View className="flex-1 justify-center items-center bg-background px-6">
        <Text className="text-lg text-regularText text-center">{error}</Text>
      </View>
    );
  }

  if (!history.length) {
    return (
      <View className="flex-1 justify-center items-center bg-background px-6">
        <Text className="text-lg text-regularText text-center">
          No diagnostic data available yet.
        </Text>
      </View>
    );
  }

  const labels = history.map((item) =>
    new Date(item.recordedAt).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    }),
  );

  const thrombosisData = history.map((item) => item.thrombosisRisk);
  const anemiaData = history.map((item) => item.anemiaRisk);
  const flowData = history.map((item) => item.menstrualFlow);

  const latest = history[history.length - 1];
  const latestThrombosis = latest.thrombosisRisk as RiskNum;
  const latestAnemia = latest.anemiaRisk as RiskNum;
  const latestFlow = latest.menstrualFlow as FlowNum;

  const chartConfig = {
    backgroundGradientFrom: "#ffffff",
    backgroundGradientTo: "#ffffff",
    color: (opacity = 1) => `rgba(164, 90, 107, ${opacity})`,
    labelColor: () => "#374151",
    propsForDots: {
      r: "4",
      strokeWidth: "2",
      stroke: Colors.brand,
      fill: Colors.brand,
    },
  };

  return (
    <SafeAreaView className="flex-1 bg-background">
      <ScrollView testID="diagnostics-scroll-view">
        <View className="px-4 pt-10">
          <Text className="text-3xl font-bold text-headingText mb-6">
            Diagnostics
          </Text>

          {/* --- Thrombosis Card --- */}
          <View className="bg-white rounded-2xl shadow-sm p-4 mb-6">
            <Text className="text-lg font-semibold text-headingText mb-3">
              Thrombosis Risk
            </Text>

            <View className="flex-row justify-between items-center mb-4">
              <View>
                <Text className="text-xs text-inactiveText">Current Risk</Text>
                <Text
                  className="text-xl font-semibold"
                  style={{ color: riskColors[latestThrombosis] }}
                >
                  {riskLabels[latestThrombosis]}
                </Text>
              </View>
              {/* placeholder for "same as last month" etc. */}
              <Text className="text-xs text-inactiveText">
                latest measurement
              </Text>
            </View>

            <LineChart
              data={{
                labels,
                datasets: [{ data: thrombosisData }],
              }}
              width={screenWidth}
              height={220}
              chartConfig={chartConfig}
              bezier
              fromZero
              withShadow={false}
              segments={2} // 0,1,2 → Low,Medium,High
              formatYLabel={formatRiskTick}
            />
          </View>

          {/* --- Anemia Card --- */}
          <View className="bg-white rounded-2xl shadow-sm p-4 mb-6">
            <Text className="text-lg font-semibold text-headingText mb-3">
              Anemia Risk
            </Text>

            <View className="flex-row justify-between items-center mb-4">
              <View>
                <Text className="text-xs text-inactiveText">Current Risk</Text>
                <Text
                  className="text-xl font-semibold"
                  style={{ color: riskColors[latestAnemia] }}
                >
                  {riskLabels[latestAnemia]}
                </Text>
              </View>
              <Text className="text-xs text-inactiveText">
                latest measurement
              </Text>
            </View>

            <LineChart
              data={{
                labels,
                datasets: [{ data: anemiaData }],
              }}
              width={screenWidth}
              height={220}
              chartConfig={chartConfig}
              bezier
              fromZero
              withShadow={false}
              segments={2}
              formatYLabel={formatRiskTick}
            />
          </View>

          {/* --- Flow Card --- */}
          <View className="bg-white rounded-2xl shadow-sm p-4 mb-10">
            <Text className="text-lg font-semibold text-headingText mb-3">
              Menstrual Flow
            </Text>

            <View className="flex-row justify-between items-center mb-4">
              <View>
                <Text className="text-xs text-inactiveText">Current Level</Text>
                <Text
                  className="text-xl font-semibold"
                  style={{ color: flowColors[latestFlow] }}
                >
                  {flowLabels[latestFlow]}
                </Text>
              </View>
              <Text className="text-xs text-inactiveText">
                latest measurement
              </Text>
            </View>

            <LineChart
              data={{
                labels,
                datasets: [{ data: flowData }],
              }}
              width={screenWidth}
              height={220}
              chartConfig={chartConfig}
              bezier
              fromZero
              withShadow={false}
              segments={3} // 0..3 → None,Light,Normal,Heavy
              formatYLabel={formatFlowTick}
            />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
