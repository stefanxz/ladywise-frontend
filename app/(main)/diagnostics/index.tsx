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
import type {
  DiagnosticsResponseDTO,
  RiskNum,
  FlowNum,
} from "@/lib/types/diagnostics";
import ShareReportModal from "@/components/ShareReport/ShareReportModal";
import { useToast } from "@/hooks/useToast";
import { RISK_LABELS, FLOW_LABELS } from "@/constants/diagnostics";
import { formatDateUTC } from "@/utils/helpers";

type DiagnosticsScreenProps = {
  initialHistory?: DiagnosticsResponseDTO[];
};

/**
 * Diagnostics Overview Dashboard
 *
 * Serves as the primary analytical hub of the application, aggregating health
 * data to provide a high-level summary of a user's health status. It specifically
 * tracks and visualizes trends for thrombosis risk, anemia risk, and menstrual flow
 * patterns over time.
 *
 * Each health category is presented as a summary card with current status indicators
 * and interactive trend charts that lead to more detailed diagnostic views.
 */
export default function DiagnosticsScreen({
  initialHistory: historyProp,
}: DiagnosticsScreenProps) {
  const { token, userId } = useAuth();
  const { showToast } = useToast();

  const [history, setHistory] = useState<DiagnosticsResponseDTO[]>(
    historyProp ?? [],
  );
  const [loading, setLoading] = useState(!historyProp);
  const [showShareModal, setShowShareModal] = useState(false);

  /**
   * Diagnostic Data Fetching
   *
   * Refreshes the user's risk and flow history whenever the screen comes into focus.
   * This ensures that the dashboard always displays the most recent calculations
   * based on the latest daily entries and biosensor data.
   */
  useFocusEffect(
    React.useCallback(() => {
      if (historyProp) return; // Don't fetch if history is passed as a prop

      let isActive = true;

      const load = async () => {
        if (!token || !userId) {
          if (isActive) {
            setLoading(false);
          }
          return;
        }

        try {
          if (isActive) setLoading(true);

          const data = await getRiskHistory();

          if (!isActive) return;

          if (Array.isArray(data)) {
            const sorted = data.sort(
              (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
            );
            setHistory(sorted);
          } else {
            showToast("Received invalid data from server.", "error");
          }
        } catch (err: unknown) {
          if (!isActive) return;

          if (isAxiosError(err)) {
            const status = err.response?.status;
            if (status === 401) {
              showToast(
                "Your session has expired. Please log in again.",
                "error",
              );
            } else {
              showToast(
                "Failed to load diagnostic data. Please try again.",
                "error",
              );
            }
          } else {
            showToast(
              "An unexpected error occurred. Please try again.",
              "error",
            );
          }
        } finally {
          if (isActive) setLoading(false);
        }
      };

      load();

      return () => {
        isActive = false;
      };
    }, [token, userId, historyProp]),
  );

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

  // If no history, show empty state
  if (!history.length) {
    return (
      <View className="flex-1 justify-center items-center bg-background px-6">
        <Text className="text-lg text-regularText text-center">
          No diagnostic data available yet.
        </Text>
      </View>
    );
  }

  // Filter history to include only relevant entries for each risk type
  // This ensures the charts don't display "zero" lines for missing data points
  const thrombosisHistory = history.filter(
    (item) => (item.thrombosisRisk ?? 0) > 0,
  );
  const thrombosisLabels = thrombosisHistory.map((item) =>
    formatDateUTC(item.date),
  );
  const thrombosisData = thrombosisHistory.map(
    (item) => item.thrombosisRisk ?? 0,
  );

  // Similar filtering for Anemia risk to maintain chart accuracy
  const anemiaHistory = history.filter((item) => (item.anemiaRisk ?? 0) > 0);
  const anemiaLabels = anemiaHistory.map((item) => formatDateUTC(item.date));
  const anemiaData = anemiaHistory.map((item) => item.anemiaRisk ?? 0);

  // Flow data is typically continuous, so we map the entire history
  // Renamed to flowChartLabels to avoid shadowing the global flowLabels constant
  const flowChartLabels = history.map((item) => formatDateUTC(item.date));
  const flowData = history.map((item) => item.flowLevel ?? 0);

  // Extract the most recent entry to display current status on summary cards
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

          {/* Thrombosis Card */}
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

              {/* Thrombosis Trend Chart */}
              {/* Displays risk levels (1-3) over time. Interactivity enabled for tapping data points. */}
              <RiskLineChart
                labels={thrombosisLabels}
                data={thrombosisData}
                segments={2}
                formatYLabel={formatRiskTick}
                isInteractive
              />
            </TouchableOpacity>
          </Link>

          {/* Anemia Card */}
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

              {/* Anemia Trend Chart */}
              <RiskLineChart
                labels={anemiaLabels}
                data={anemiaData}
                segments={2}
                formatYLabel={formatRiskTick}
                isInteractive
              />
            </TouchableOpacity>
          </Link>

          {/* Flow Card */}
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

            {/* Menstrual Flow Chart */}
            {/* Visualizes flow intensity (Light, Normal, Heavy) over the recorded history. */}
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
