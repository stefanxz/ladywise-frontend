import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ActivityIndicator,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { Link, useFocusEffect } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { isAxiosError } from "axios";
import { Feather } from "@expo/vector-icons";
import { RiskLineChart } from "@/components/charts/RiskLineChart";
import { useAuth } from "@/context/AuthContext";
import { getRiskHistory } from "@/lib/api";
import { Colors, riskColors, flowColors } from "@/constants/colors";
import { mockHistory } from "@/constants/mock-data";
import type {
  DiagnosticsResponseDTO,
  RiskNum,
  FlowNum,
} from "@/lib/types/diagnostics";
import ShareReportModal from "@/components/ShareReport/ShareReportModal";

const riskLabels: Record<RiskNum, string> = {
  0: "Unknown",
  1: "Low",
  2: "Medium",
  3: "High",
};

const flowLabels: Record<FlowNum, string> = {
  0: "None",
  1: "Light",
  2: "Normal",
  3: "Heavy",
};

type DiagnosticsScreenProps = {
  initialHistory?: DiagnosticsResponseDTO[];
};

/**
 * DiagnosticsScreen
 *
 * Main diagnostics dashboard displaying summaries for various risk factors (Thrombosis, Anemia, Menstrual Flow).
 * Shows trend lines and current status for each factor.
 *
 * @param {DiagnosticsScreenProps} props - Component props
 * @returns {JSX.Element} The rendered diagnostics dashboard
 */
export default function DiagnosticsScreen({
  initialHistory: historyProp,
}: DiagnosticsScreenProps) {
  const { token, userId } = useAuth();

  const [history, setHistory] = useState<DiagnosticsResponseDTO[]>(
    historyProp ?? [],
  );
  const [loading, setLoading] = useState(!historyProp);
  const [error, setError] = useState<string | null>(null);
  const [showShareModal, setShowShareModal] = useState(false);

  useFocusEffect(
    React.useCallback(() => {
      if (historyProp) return; // Don't fetch if history is passed as a prop

      let isActive = true;

      const load = async () => {
        if (!token || !userId) {
          if (isActive) {
            setHistory(mockHistory);
            setLoading(false);
          }
          return;
        }

        try {
          // Only show loading spinner on first load or if we want to show it every time
          // For better UX during "refresh", we might keep the old data visible, 
          // but sticking to simple "setLoading(true)" ensures the user knows it's updating.
          if (isActive) setLoading(true);

          setError(null);

          console.log(
            "[Diagnostics] Starting fetch. UserID:",
            userId,
            "Token exists:",
            !!token,
          );

          const data = await getRiskHistory(token, userId);
          console.log("[Diagnostics] API Response Data:", data);

          if (!isActive) return;

          if (Array.isArray(data) && data.length > 0) {
            console.log("[Diagnostics] Using real API data. Count:", data.length);
            // Sort by date ascending
            const sorted = data.sort(
              (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
            );
            setHistory(sorted);
          } else if (!Array.isArray(data)) {
            console.warn(
              "[Diagnostics] Fallback triggered: API returned non-array data:",
              data,
            );
            setHistory(mockHistory);

            let dataStr = "";
            try {
              dataStr = JSON.stringify(data, null, 2).substring(0, 200);
            } catch (e) {
              dataStr = String(data);
            }
            setError(
              `Received invalid data (not array): ${dataStr}... Showing sample data.`,
            );
          } else {
            console.warn(
              "[Diagnostics] Fallback triggered: API returned empty list.",
            );
            setHistory(mockHistory);
            setError(
              "No history data was found. Showing sample data for demonstration.",
            );
          }
        } catch (err: unknown) {
          if (!isActive) return;
          console.error(
            "[Diagnostics] Fallback triggered: API Request Failed",
            err,
          );

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
          if (isActive) setLoading(false);
        }
      };

      load();

      return () => {
        isActive = false;
      };
    }, [token, userId, historyProp])
  );

  // Helper to format UTC date
  const formatDateUTC = (dateStr: string) => {
    // Handle potential object format if somehow leaked (defensive)
    const dStr =
      typeof dateStr === "object" && (dateStr as any).$date
        ? (dateStr as any).$date
        : String(dateStr);
    const d = new Date(dStr);

    // Use UTC methods to avoid timezone shift
    if (isNaN(d.getTime())) return "";

    const month = d.toLocaleString("en-US", {
      month: "short",
      timeZone: "UTC",
    });
    const day = d.getUTCDate();

    return `${month} ${day}`;
  };

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

  const thrombosisHistory = history.filter(
    (item) => (item.thrombosisRisk ?? 0) > 0,
  );
  const thrombosisLabels = thrombosisHistory.map((item) =>
    formatDateUTC(item.date),
  );
  const thrombosisData = thrombosisHistory.map(
    (item) => item.thrombosisRisk ?? 0,
  );

  const anemiaHistory = history.filter((item) => (item.anemiaRisk ?? 0) > 0);
  const anemiaLabels = anemiaHistory.map((item) => formatDateUTC(item.date));
  const anemiaData = anemiaHistory.map((item) => item.anemiaRisk ?? 0);

  // Renamed to flowChartLabels to avoid shadowing the global flowLabels constant
  const flowChartLabels = history.map((item) => formatDateUTC(item.date));
  const flowData = history.map((item) => item.flowLevel ?? 0);

  const latest = history[history.length - 1];
  const latestThrombosis = (latest.thrombosisRisk ?? 0) as RiskNum;
  const latestAnemia = (latest.anemiaRisk ?? 0) as RiskNum;
  const latestFlow = (latest.flowLevel ?? 0) as FlowNum;

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
          <Link
            href={
              {
                pathname: "/diagnostics/thrombosis-risk",
                params: {
                  risk_factor: "thrombosis-risk",
                },
              } as any
            }
            asChild
          >
            <TouchableOpacity className="bg-white rounded-2xl shadow-sm p-4 mb-6">
              <Text className="text-lg font-semibold text-headingText mb-3">
                Thrombosis Risk
              </Text>

              <View className="flex-row justify-between items-center mb-4">
                <View>
                  <Text className="text-xs text-inactiveText">
                    Current Risk
                  </Text>
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
                labels={thrombosisLabels}
                data={thrombosisData}
                segments={2}
                formatYLabel={formatRiskTick}
                isInteractive
              />
            </TouchableOpacity>
          </Link>

          {/* --- Anemia Card --- */}
          <Link
            href={
              {
                pathname: "/diagnostics/anemia-risk",
                params: {
                  risk_factor: "anemia-risk",
                },
              } as any
            }
            asChild
          >
            <TouchableOpacity className="bg-white rounded-2xl shadow-sm p-4 mb-6">
              <Text className="text-lg font-semibold text-headingText mb-3">
                Anemia Risk
              </Text>

              <View className="flex-row justify-between items-center mb-4">
                <View>
                  <Text className="text-xs text-inactiveText">
                    Current Risk
                  </Text>
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
                labels={anemiaLabels}
                data={anemiaData}
                segments={2}
                formatYLabel={formatRiskTick}
                isInteractive
              />
            </TouchableOpacity>
          </Link>

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
              labels={flowChartLabels}
              data={flowData}
              segments={3}
              formatYLabel={formatFlowTick}
            />
          </View>

          {/* Share Insights Button */}
          <TouchableOpacity
            testID="share-insights-button"
            onPress={() => setShowShareModal(true)}
            className="bg-gray-200 rounded-xl py-3 px-6 flex-row items-center justify-center self-center mb-2"
          >
            <Text className="text-headingText font-medium text-sm mr-2">
              Share insights
            </Text>
            <Feather name="arrow-right" size={16} color="#1F2937" />
          </TouchableOpacity>

          {/* Terms notice */}
          <Text className="text-xs text-inactiveText text-center px-4 mb-10">
            By sharing your data, you agree with our Terms and Conditions.
            LifeSense Group is not responsible for your data from here on.
          </Text>

          {/* Share Report Modal */}
          <ShareReportModal
            visible={showShareModal}
            onClose={() => setShowShareModal(false)}
            reportType="FULL_REPORT"
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
