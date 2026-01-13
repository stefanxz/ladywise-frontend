import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ActivityIndicator,
  ScrollView,
  TouchableOpacity,
  Pressable, // Added import
} from "react-native";
import { Link, useFocusEffect } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { isAxiosError } from "axios";
import { Feather } from "@expo/vector-icons";
import { RiskLineChart } from "@/components/charts/RiskLineChart";
import { useAuth } from "@/context/AuthContext";
import { getRiskHistory } from "@/lib/api";
import { Colors, riskColors, flowColors } from "@/constants/colors";
// Use RiskHistoryPoint to match API
import type { RiskHistoryPoint } from "@/lib/types/risks";
import type { RiskNum, FlowNum } from "@/lib/types/diagnostics";
import ShareReportModal from "@/components/ShareReport/ShareReportModal";
import { useToast } from "@/hooks/useToast";
import { RISK_LABELS, FLOW_LABELS } from "@/constants/diagnostics";
import { mockHistory } from "@/constants/mock-data";
import { formatDateUTC } from "@/utils/helpers";

type DiagnosticsScreenProps = {
  initialHistory?: RiskHistoryPoint[];
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
  const { showToast } = useToast();

  const [history, setHistory] = useState<RiskHistoryPoint[]>(historyProp ?? []);
  const [loading, setLoading] = useState(!historyProp);
  const [error, setError] = useState<string | null>(null);
  const [showShareModal, setShowShareModal] = useState(false);

  const handleSharePress = async () => {
    setShowShareModal(true);
  };

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

        if (Array.isArray(data) && data.length > 0) {
          setHistory(data);
        } else if (!Array.isArray(data)) {
          // console.warn("API returned non-array data:", data);
          setHistory(mockHistory);
          setError("Received invalid data from server. Showing sample data.");
        } else {
          // If API returns empty array, fallback to mock data as requested
          setHistory(mockHistory);
          setError(
            "No history data was found. Showing sample data for demonstration.",
          );
        }
      } catch (err: unknown) {
        // console.error("Failed to load risk history", err);

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
    return RISK_LABELS[rounded] ?? "";
  };

  const formatFlowTick = (value: string) => {
    const rounded = Math.round(Number(value)) as FlowNum;
    return FLOW_LABELS[rounded] ?? "";
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

  const labels = history.map((item) => formatDateUTC(item.recordedAt));

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
                    {RISK_LABELS[latestThrombosis]}
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
                    {RISK_LABELS[latestAnemia]}
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
                  {FLOW_LABELS[latestFlow]}
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

          {/* Share Insights Button */}
          <TouchableOpacity
            testID="share-insights-button"
            onPress={handleSharePress}
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
