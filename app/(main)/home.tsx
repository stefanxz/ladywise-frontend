import React, { useCallback, useEffect, useRef, useState } from "react";
import { ActivityIndicator, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { useFocusEffect } from "expo-router";
import { BottomSheetModal } from "@gorhom/bottom-sheet";

// Contexts
import { useAuth } from "@/context/AuthContext";
import { useTheme } from "@/context/ThemeContext";

import { useHealthRealtime } from "@/hooks/useHealthRealtime";
import { RiskResult, InsightResult } from "@/lib/types/risks"; // Or wherever you put the types

// Components
import Header from "@/components/MainPageHeader/Header";
import CalendarStrip, {
  DayData,
} from "@/components/CalendarStrip/CalendarStrip";
import PhaseCard from "@/components/PhaseCard/PhaseCard";
import InsightsSection from "@/components/InsightsSection/InsightsSection";
import { FloatingAddButton } from "@/components/FloatingAddButton/FloatingAddButton";
import { CycleQuestionsBottomSheet } from "@/components/CycleQuestionsBottomSheet/CycleQuestionsBottomSheet";

// Utils & Types
import {
  createDailyEntry,
  getCycleStatus,
  getRiskData,
  getUserById,
} from "@/lib/api";
import { CycleStatusDTO } from "@/lib/types/cycle";
import { RiskData } from "@/lib/types/risks";
import { DailyCycleAnswers } from "@/components/CycleQuestionsBottomSheet/CycleQuestionsBottomSheet.types";
import { mapAnswersToPayload, mapApiToInsights } from "@/utils/helpers";
import { formatPhaseName, generateCalendarDays } from "@/utils/mainPageHelpers";

const Home = () => {
  const { token, userId, isLoading: isAuthLoading } = useAuth();
  const { theme, setPhase } = useTheme();

  // --- 1. INITIALIZE THE HOOK ---
  // This opens the connection. 'realtimeRisks' will be null initially,
  // then populate automatically when the server pushes data.
  const { realtimeRisks, anemiaTrend, thrombosisTrend, isConnected } =
    useHealthRealtime(userId, token);

  const [data, setData] = useState<RiskData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // New State: calculating mode for UX feedback
  const [isCalculating, setIsCalculating] = useState(false);

  const [cycleStatus, setCycleStatus] = useState<CycleStatusDTO | null>(null);
  const [calendarDays, setCalendarDays] = useState<DayData[]>(
    generateCalendarDays()
  );
  const [error, setError] = useState<string | null>(null);
  const [userName, setUserName] = useState<string>("");

  const bottomSheetModalRef = useRef<BottomSheetModal>(null);
  const openSheet = useCallback(
    () => bottomSheetModalRef.current?.present(),
    []
  );

  // This function converts the complex WebSocket object into your simple UI 'RiskCard' format
  const updateRiskUI = useCallback(
    (
      risks: RiskResult,
      aTrend: InsightResult | null,
      tTrend: InsightResult | null
    ) => {
      const mappedData: RiskData[] = [
        {
          id: "anemia",
          title: "Anemia Risk",
          level: risks.anemia.risk,
          description: risks.anemia.summary_sentence,
          trend: aTrend?.trend, // The new field you added
        },
        {
          id: "thrombosis",
          title: "Thrombosis Risk",
          level: risks.thrombosis.risk,
          description: risks.thrombosis.summary_sentence,
          trend: tTrend?.trend,
        },
      ];
      setData(mappedData);
      setIsLoading(false);
      setIsCalculating(false); // Stop the spinner if we were waiting
    },
    []
  );

  useEffect(() => {
    if (realtimeRisks) {
      console.log("⚡️ WebSocket: Merging Live Updates");
      updateRiskUI(realtimeRisks, anemiaTrend, thrombosisTrend);
    }
  }, [realtimeRisks, anemiaTrend, thrombosisTrend, updateRiskUI]);

  useEffect(() => {
    const loadInitialData = async () => {
      if (isAuthLoading || !token || !userId) return;

      try {
        const user = await getUserById(token, userId);
        const safeName =
          user.firstName || user.lastName
            ? `${user.firstName ?? ""} ${user.lastName ?? ""}`.trim()
            : (user.email?.split("@")[0] ?? "there");
        setUserName(safeName);

        if (!realtimeRisks) {
          const apiData = await getRiskData(token, userId);
          const mappedData = mapApiToInsights(apiData);
          setData(mappedData);
        }
      } catch (err) {
        console.error("Initial load failed", err);
      } finally {
        setIsLoading(false);
      }
    };

    loadInitialData();
  }, [token, userId, isAuthLoading]);

  useFocusEffect(
    useCallback(() => {
      if (isAuthLoading || !token) return;

      const fetchCycleData = async () => {
        try {
          const status = await getCycleStatus();
          setCycleStatus(status);
          setPhase(status.currentPhase.toLowerCase() as any);
          setCalendarDays(generateCalendarDays(status.periodDates));
        } catch (err: any) {
          if (err.response?.status === 404) {
            setPhase("neutral" as any);
            setCalendarDays(generateCalendarDays([]));
          }
        }
      };

      fetchCycleData();
    }, [setPhase, token, isAuthLoading])
  );

  const handleAddDailyEntry = async (answers: DailyCycleAnswers) => {
    const payload = mapAnswersToPayload(answers);
    try {
      await createDailyEntry(payload);
      setIsCalculating(true);
    } catch (error: any) {
      setError(error.message ?? "Could not save daily answer entry.");
      setIsCalculating(false);
    }
  };

  if (isAuthLoading) {
    return (
      <LinearGradient
        colors={[theme.gradientStart, theme.gradientEnd]}
        style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
      >
        <ActivityIndicator size="large" color={theme.highlight} />
      </LinearGradient>
    );
  }

  return (
    <>
      <LinearGradient
        colors={[theme.gradientStart, theme.gradientEnd]}
        style={{ flex: 1 }}
      >
        <SafeAreaView
          style={{ flex: 1, backgroundColor: "transparent" }}
          edges={["top"]}
        >
          <ScrollView
            className="flex-1"
            contentContainerStyle={{ paddingBottom: 100 }}
          >
            <View className="pt-10">
              <Header name={userName} onHelpPress={() => {}} theme={theme} />

              <Text className="text-base text-gray-500 px-5 mb-5 pt-5">
                {new Date().toLocaleDateString("en-US", {
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                })}
              </Text>

              <CalendarStrip
                days={calendarDays}
                themeColor={theme.highlight}
                onDayPress={() => {}}
              />

              <PhaseCard
                phaseName={
                  cycleStatus
                    ? formatPhaseName(cycleStatus.currentPhase)
                    : "Hello!"
                }
                dayOfPhase={
                  cycleStatus
                    ? `Day ${cycleStatus.currentCycleDay}`
                    : "Ready to start?"
                }
                subtitle={
                  cycleStatus
                    ? `${cycleStatus.daysUntilNextEvent} days until ${cycleStatus.nextEvent.toLowerCase()}`
                    : "Log your first period to begin tracking."
                }
                theme={theme}
                onLogPeriodPress={() => {}}
                onCardPress={() => {}}
              />
            </View>

            {/* --- UPDATED SECTION --- */}
            <InsightsSection
              isLoading={isLoading}
              isCalculating={isCalculating} // Pass the "AI Processing" state
              insights={data}
            />

            {/* Status Debugger */}
            <View className="items-center mt-2 opacity-50">
              <Text className="text-[10px] text-gray-500">
                {isConnected ? "● Live Updates Active" : "○ Real-time Offline"}
              </Text>
            </View>
          </ScrollView>

          <View className="absolute bottom-4 right-4">
            <FloatingAddButton
              buttonColor={theme.button}
              textColor={theme.buttonText}
              onPress={openSheet}
            />
          </View>
        </SafeAreaView>
      </LinearGradient>

      <CycleQuestionsBottomSheet
        bottomSheetRef={bottomSheetModalRef}
        onSave={handleAddDailyEntry}
      />
    </>
  );
};

export default Home;
