import React, { useEffect, useState } from "react";
import { View, Text, ActivityIndicator, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { isAxiosError } from "axios";
import { RiskLineChart } from "@/components/charts/RiskLineChart";
import { useAuth } from "@/context/AuthContext";
import { getRiskHistory } from "@/lib/api";
import type { RiskHistoryPoint } from "@/lib/types/risks";
import { Colors, riskColors, flowColors } from "@/constants/colors";
import { mockHistory } from "@/constants/mock-data";
import type { RiskNum, FlowNum } from "@/lib/types/diagnostics";

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
          // If API returns no data, fallback to mock data as requested
          setHistory(mockHistory);
          setError(
            "No history data was found. Showing sample data for demonstration.",
          );
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
            setError(
              `We couldn't load your data. Showing sample data. Error: ${err.message}`,
            );
          }
        } else if (err instanceof Error) {
          setError(
            `An unexpected error occurred: ${err.message}. Showing sample data.`,
          );
        } else {
          setError("An unexpected error occurred. Showing sample data.");
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
        <ActivityIndicator
          size="large"
          color={Colors.brand}
          testID="loading-indicator"
        />
      </View>
    );
  }

  if (error && error.includes("session has expired")) {
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

  return (
    <SafeAreaView className="flex-1 bg-background" edges={["top"]}>
      <ScrollView testID="diagnostics-scroll-view">
        <View className="px-4 pt-10">
          <Text className="text-3xl font-bold text-headingText mb-6">
            Diagnostics
          </Text>

          {error && (
            <Text className="text-center text-red-500 mb-4">{error}</Text>
          )}

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

            <RiskLineChart
              labels={labels}
              data={thrombosisData}
              segments={2}
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

            <RiskLineChart
              labels={labels}
              data={anemiaData}
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

            <RiskLineChart
              labels={labels}
              data={flowData}
              segments={3}
              formatYLabel={formatFlowTick}
            />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
