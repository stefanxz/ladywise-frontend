import InsightsSection from "@/components/InsightsSection/InsightsSection";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { RiskData } from "@/lib/types/risks";
import { ActivityIndicator, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Header from "@/components/MainPageHeader/Header";
import CalendarStrip, {
  DayData,
} from "@/components/CalendarStrip/CalendarStrip";
import PhaseCard from "@/components/PhaseCard/PhaseCard";
import { LinearGradient } from "expo-linear-gradient";
import { useTheme } from "@/context/ThemeContext";
import {
  createDailyEntry,
  getCycleStatus,
  getRiskData,
  getUserById,
} from "@/lib/api";
import { CycleStatusDTO } from "@/lib/types/cycle";
import { useFocusEffect } from "expo-router";
import { useAuth } from "@/context/AuthContext";
import { formatPhaseName, generateCalendarDays } from "@/utils/mainPageHelpers";
import { FloatingAddButton } from "@/components/FloatingAddButton/FloatingAddButton";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import { CycleQuestionsBottomSheet } from "@/components/CycleQuestionsBottomSheet/CycleQuestionsBottomSheet";
import { DailyCycleAnswers } from "@/components/CycleQuestionsBottomSheet/CycleQuestionsBottomSheet.types";
import { mapAnswersToPayload, mapApiToInsights } from "@/utils/helpers";
import { MOCK_INSIGHTS } from "@/constants/mock-data";

async function fetchRiskData(
  token: string,
  userId: string,
): Promise<RiskData[]> {
  try {
    // Fetch the raw API data
    const apiResponse = await getRiskData(token, userId);

    // Map the raw data to the shape your component needs
    const mappedData = mapApiToInsights(apiResponse);

    return mappedData;
  } catch (e) {
    // console.error("Error fetching Risk Data: ", e);
    return []; // Return empty array on failure
  }
}

const Home = () => {
  const { token, userId, isLoading: isAuthLoading } = useAuth();
  const { theme, setPhase } = useTheme();
  const [data, setData] = useState<RiskData[]>(MOCK_INSIGHTS);
  const [isLoading, setIsLoading] = useState<boolean>(true); // For risk data
  const [cycleStatus, setCycleStatus] = useState<CycleStatusDTO | null>(null);
  const [calendarDays, setCalendarDays] = useState<DayData[]>(
    generateCalendarDays(),
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);
  const [userName, setUserName] = useState<string>("");

  const openSheet = useCallback(() => {
    bottomSheetModalRef.current?.present();
  }, []);

  // Effect for fetching risk data
  useEffect(() => {
    const loadData = async () => {
      // We already know token and userId are valid strings here
      try {
        // Pass the credentials from the context
        const riskData = await fetchRiskData(token!, userId!);
        setData(riskData);
        console.log(riskData);

        const user = await getUserById(token!, userId!);
        const safeFirst = user.firstName ?? "";
        const safeLast = user.lastName ?? "";

        const fullName =
          safeFirst || safeLast
            ? `${safeFirst} ${safeLast}`.trim()
            : (user.email?.split("@")[0] ?? "there"); // fallback to email prefix or "there"

        setUserName(fullName);
      } catch (error) {
        // console.error("[REMOVE IN PROD] error inside useEffect hook!");
        setData([]);
      } finally {
        setIsLoading(false);
      }
    };

    // This is the critical guard.
    // Do not attempt to fetch data if auth is loading or if the token is missing.
    if (isAuthLoading || !token || !userId) {
      setIsLoading(false); // Stop the loader, there's nothing to fetch
      return; // Do nothing
    }

    console.log("ATTEMPTING FETCH WITH:", { token, userId });

    loadData();
  }, [token, userId, isAuthLoading]);

  // Effect for fetching cycle data
  useFocusEffect(
    useCallback(() => {
      if (isAuthLoading || !token) {
        console.log("Waiting for auth...");
        return;
      }
      const fetchCycleData = async () => {
        try {
          setLoading(true);
          setError(null);

          const status = await getCycleStatus();

          setCycleStatus(status);

          // Update theme based on backend data
          setPhase(status.currentPhase.toLowerCase() as any);

          // Generate calendar days with period data
          setCalendarDays(generateCalendarDays(status.periodDates));
        } catch (err: any) {
          // console.error("Failed to fetch cycle status:", err);

          if (err.response?.status === 404) {
            console.log("No cycle data found (user needs setup).");

            setPhase("neutral" as any);

            setCalendarDays(generateCalendarDays([]));
          } else {
            // console.error("Error fetching cycle", err);
            setError(err.message || "Failed to load data.");
          }
        } finally {
          setLoading(false);
        }
      };

      fetchCycleData();
    }, [setPhase, token, isAuthLoading]),
  );

  const handleLogPeriod = () => console.log("Log period pressed");
  const handleHelpPress = () => console.log("Help pressed");
  const handleDayPress = (dayId: string) => console.log("Pressed day: ", dayId);
  const handleCardPress = () => console.log("Phase Card Pressed");

  /**
   * Called when the user clicks 'Save answers' on the cycle questionnaire bottom sheet.
   * First maps answers to the payload that the backend expects, then creates the new
   * daily entry.
   * @param answers {DailyCycleAnswers} - user's answers to the cycle questionnaire
   */
  const handleAddDailyEntry = async (answers: DailyCycleAnswers) => {
    const payload = mapAnswersToPayload(answers);
    try {
      await createDailyEntry(payload);
    } catch (error: any) {
      setError(error.message ?? "Could not save daily answer entry.");
    }
  };

  if (loading) {
    return (
      <LinearGradient
        colors={[theme.gradientStart, theme.gradientEnd]}
        style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
      >
        <ActivityIndicator
          size="large"
          color={theme.highlight}
          testID="loading-indicator"
        />
      </LinearGradient>
    );
  }

  if (error) {
    return (
      <LinearGradient
        colors={["#FFFFFF", "#F0F0F0"]}
        style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
      >
        <Text className="text-lg text-red-500 font-bold mb-4">
          Error: {error || "Could not load cycle data."}
        </Text>
      </LinearGradient>
    );
  }

  return (
    <>
      <LinearGradient
        colors={[theme.gradientStart, theme.gradientEnd]}
        style={{ flex: 1 }}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 1 }}
      >
        <SafeAreaView
          style={{ flex: 1, backgroundColor: "transparent" }}
          edges={["top"]}
        >
          <ScrollView
            className="flex-1"
            contentContainerStyle={{ justifyContent: "space-between" }}
          >
            <View className="pt-10">
              <Header
                name={userName || "there"}
                onHelpPress={handleHelpPress}
                theme={theme}
              />

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
                onDayPress={handleDayPress}
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
                onLogPeriodPress={handleLogPeriod}
                onCardPress={() => {}}
              />
            </View>
            <InsightsSection
              isLoading={isLoading}
              insights={data}
            ></InsightsSection>
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
