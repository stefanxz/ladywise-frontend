import React, {
  useCallback,
  useEffect,
  useRef,
  useState,
  useMemo,
} from "react";
import { ActivityIndicator, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { useFocusEffect } from "expo-router";
import { BottomSheetModal } from "@gorhom/bottom-sheet";

// Contexts
import { useAuth } from "@/context/AuthContext";
import { useTheme } from "@/context/ThemeContext";

// Hooks
import { useHealthRealtime } from "@/hooks/useHealthRealtime";

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
import { RiskResult, InsightResult } from "@/lib/types/risks"; // Ensure these are exported from types

const Home = () => {
  const { token, userId, isLoading: isAuthLoading } = useAuth();
  const { theme, setPhase } = useTheme();

  // --- 1. Real-time Hook (The Source of Truth) ---
  const { realtimeRisks, anemiaTrend, thrombosisTrend, isConnected } =
    useHealthRealtime(userId, token);

  // --- 2. Local State ---
  const [initialApiData, setInitialApiData] = useState<RiskData[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isCalculating, setIsCalculating] = useState<boolean>(false); // UI state for "Processing..."

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

  // --- 3. Derived State (Merge Logic) ---
  // Automatically updates when either WebSocket pushes new data OR initial fetch completes.
  // WebSocket data (realtimeRisks) always takes precedence.
  const displayedInsights: RiskData[] = useMemo(() => {
    if (realtimeRisks) {
      return [
        {
          id: "anemia",
          title: "Anemia Risk",
          level: realtimeRisks.anemia.risk,
          description: realtimeRisks.anemia.summary_sentence,
          trend: anemiaTrend?.trend,
        },
        {
          id: "thrombosis",
          title: "Thrombosis Risk",
          level: realtimeRisks.thrombosis.risk,
          description: realtimeRisks.thrombosis.summary_sentence,
          trend: thrombosisTrend?.trend,
        },
      ];
    }

    return initialApiData;
  }, [realtimeRisks, anemiaTrend, thrombosisTrend, initialApiData]);

  // --- 4. Effect: Initial Fetch (Pull) ---
  useEffect(() => {
    const loadInitialData = async () => {
      if (isAuthLoading || !token || !userId) return;

      try {
        // Fetch User Profile
        const user = await getUserById(token, userId);
        const safeName =
          user.firstName || user.lastName
            ? `${user.firstName ?? ""} ${user.lastName ?? ""}`.trim()
            : (user.email?.split("@")[0] ?? "there");
        setUserName(safeName);

        // Fetch Risks from DB (State Snapshot)
        // Only update fallback state if we don't already have live data
        if (!realtimeRisks) {
          const apiData = await getRiskData(token, userId);
          setInitialApiData(mapApiToInsights(apiData));
        }
      } catch (err) {
        console.error("Initial load failed", err);
      } finally {
        setIsLoading(false);
      }
    };

    loadInitialData();
  }, [token, userId, isAuthLoading]); // Dependencies are static, won't loop

  // --- 5. Effect: Cycle Data ---
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
          } else {
            console.error("Cycle fetch error", err);
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

      // OPTIMISTIC UPDATE:
      // We know the backend is processing. Show "Analyzing..." state immediately.
      // The WebSocket update will eventually clear this via the derived state logic if you wire it,
      // but explicitly setting it to false when data arrives is safer or handling it via a useEffect on data change.
      setIsCalculating(true);
    } catch (error: any) {
      setError(error.message ?? "Could not save daily answer entry.");
      setIsCalculating(false);
    }
  };

  // Reset calculating state when new data arrives
  useEffect(() => {
    if (displayedInsights.length > 0) {
      setIsCalculating(false);
    }
  }, [displayedInsights]);

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

            <InsightsSection
              isLoading={isLoading}
              isCalculating={isCalculating}
              insights={displayedInsights}
            />

            {/* Connection Status Debugger (Optional) */}
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
