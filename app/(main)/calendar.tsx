import React, {
  useCallback,
  useState,
  useEffect,
  useMemo,
  useRef,
} from "react";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  StatusBar,
  ActivityIndicator,
  Pressable,
  Alert,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { Feather } from "@expo/vector-icons";
import { generateDateSet, generateMonths } from "@/utils/calendarHelpers";
import CalendarHeader from "@/components/Calendar/CalendarHeader";
import LogNewPeriodButton from "@/components/LogNewPeriodButton/LogNewPeriodButton";
import {
  addDays,
  addMonths,
  endOfDay,
  areIntervalsOverlapping,
  format,
  isAfter,
  isBefore,
  isSameDay,
  parseISO,
  startOfDay,
  subDays,
  subMonths,
  isWithinInterval,
} from "date-fns";
import { useTheme } from "@/context/ThemeContext";
import {
  deletePeriod,
  getCycleStatus,
  getPeriodHistory,
  getPredictions,
  logNewPeriod,
  updatePeriod,
} from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import { PeriodLogRequest } from "@/lib/types/period";
import CalendarMonth from "@/components/Calendar/CalendarMonth";
import PeriodActionTooltip from "@/components/Calendar/EditDeleteTooltip";
import { FloatingAddButton } from "@/components/FloatingAddButton/FloatingAddButton";

// Configuration
const PRELOAD_PAST_MONTHS = 6; // Load 6 months back for initial render
const PRELOAD_FUTURE_MONTHS = 6; // Load 6 months forward for initial render
const BATCH_SIZE = 6; // Load 6 months at a time

// Period type definition
type ParsedPeriod = {
  id: string; // Crucial for editing/deleting
  start: Date;
  end: Date;
  isOngoing?: boolean; // Track if it came from backend as ongoing
};

// Prediction type definition
type ParsedPrediction = {
  start: Date;
  end: Date;
};

// Tooltip state type definition
type TooltipState = {
  visible: boolean;
  position: { x: number; y: number } | null;
  periodId: string | null;
};

// Main calendar screen component
export default function CalendarScreen() {
  const insets = useSafeAreaInsets(); // Used to get precise safe area dimensions
  const { theme, setPhase } = useTheme();
  const { token, isLoading: isAuthLoading } = useAuth();
  const flatListRef = useRef<FlatList>(null);

  // Use refs for loading locks to prevent re-renders during rapid scrolling
  const isLoadingPastRef = useRef(false);
  const isLoadingFutureRef = useRef(false);

  // We add a 'ready' state to hide the initial loading
  const [isListReady, setIsListReady] = useState(false);

  // Memoize 'today' so it doesn't trigger re-renders
  const today = useMemo(() => startOfDay(new Date()), []);

  // This ensures 'months' already has the initial months on the very first render
  const [months, setMonths] = useState<any[]>(() => {
    const start = subMonths(today, PRELOAD_PAST_MONTHS);
    const totalMonths = PRELOAD_PAST_MONTHS + 1 + PRELOAD_FUTURE_MONTHS;
    return generateMonths(start, totalMonths);
  });

  // Periods state
  const [periods, setPeriods] = useState<ParsedPeriod[]>([]);

  // Predictions state
  const [predictions, setPredictions] = useState<ParsedPrediction[]>([]);

  // Loading states for infinite scroll
  const [isLoadingPast, setIsLoadingPast] = useState(false);
  const [isLoadingFuture, setIsLoadingFuture] = useState(false);

  // Period logging and editing state
  const [isLogMode, setIsLogMode] = useState(false);
  const [editingPeriodId, setEditingPeriodId] = useState<string | null>(null); // Null = creating new, String = editing existing
  const [selection, setSelection] = useState<{
    start: Date | null;
    end: Date | null;
  }>({ start: null, end: null });
  const [isOngoing, setIsOngoing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Tooltip state
  const [tooltip, setTooltip] = useState<TooltipState>({
    visible: false,
    position: null,
    periodId: null,
  });

  // Fetch data
  const fetchData = useCallback(async () => {
    if (isAuthLoading || !token) return;
    try {
      // For theme color
      const status = await getCycleStatus();
      // Update the tehme context so we have the correct theme.highlight
      if (status?.currentPhase) {
        setPhase(status.currentPhase.toLowerCase() as any);
      }

      // Fetch period history
      const history = await getPeriodHistory();

      // Parse periods
      const parsedPeriods = history.map((p) => ({
        id: p.id, // Store ID
        start: startOfDay(parseISO(p.startDate)),
        // If end date is null (ongoing), use today as temp for visual rendering
        end: p.endDate ? endOfDay(parseISO(p.endDate)) : today,
        isOngoing: !p.endDate, // Track original state
      }));
      setPeriods(parsedPeriods);

      // Predictions, fetch 3-6 months
      const predictionData = await getPredictions(6);

      const parsedPredictions = predictionData.map((p) => ({
        start: startOfDay(parseISO(p.startDate)),
        end: endOfDay(parseISO(p.endDate)),
      }));
      setPredictions(parsedPredictions);
    } catch (err) {
      console.error("Failed to fetch cycle calendar data: " + err);
    }
  }, [token, isAuthLoading, setPhase, today]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Optimize by putting period dates into a set for O(1) lookup
  const periodDateSet = useMemo(() => generateDateSet(periods), [periods]);

  // Same for predictions
  const predictionDateSet = useMemo(
    () => generateDateSet(predictions),
    [predictions],
  );

  // Logging new period
  const handleLogPeriodStart = () => {
    setIsLogMode(true);
    setEditingPeriodId(null); // Clear editing ID
    setSelection({ start: null, end: null });
    setIsOngoing(false);
    setTooltip((prev) => ({ ...prev, visible: false })); // Close tooltip
  };

  // Cancel logging
  const handleCancelLog = () => {
    setIsLogMode(false);
    setEditingPeriodId(null); // Clear editing ID
    setSelection({ start: null, end: null });
    setIsOngoing(false);
  };

  // Edit period handler
  const handleEditPeriod = () => {
    const periodToEdit = periods.find((p) => p.id === tooltip.periodId);
    if (!periodToEdit) return;

    // Enter log mode with pre-filled data
    setIsLogMode(true);
    setEditingPeriodId(periodToEdit.id);
    setSelection({ start: periodToEdit.start, end: periodToEdit.end });
    setIsOngoing(!!periodToEdit.isOngoing);

    // Close tooltip
    setTooltip({ visible: false, position: null, periodId: null });
  };

  // Edit daily cycle questionnaire handler
  const handleEditDailyQuestionnaire = () => {
    console.log("Edit cycle questionnaire button pressed - To be implemented"); //TODO DAVID MEREACRE

    // Close tooltip
    setTooltip({ visible: false, position: null, periodId: null });
  };

  // Delete period handler
  const handleDeletePeriod = () => {
    Alert.alert(
      "Delete Period",
      "Are you sure you want to delete this period log?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            if (!tooltip.periodId) return;
            try {
              await deletePeriod(tooltip.periodId);
              await fetchData(); // Refresh
              setTooltip({ visible: false, position: null, periodId: null });
            } catch (error) {
              Alert.alert("Error", "Failed to delete period." + error);
            }
          },
        },
      ],
    );
  };

  const handleDatePress = useCallback(
    (date: Date, position: { x: number; y: number }) => {
      if (isLogMode) {
        // Prevent selection of future dates
        if (isAfter(date, today)) return;

        setSelection((prev) => {
          // If "Ongoing" is checked, we only allow picking a Start Date
          if (isOngoing) return { start: date, end: today }; // End is visually today
          const { start, end } = prev;

          // Start new selection
          if (!start) return { start: date, end: null };

          // Adjust selection
          if (start && !end) {
            if (isBefore(date, start)) {
              // Clicked before start so we reset start
              return { start: date, end: null };
            } else if (isSameDay(date, start)) {
              // Clicked same day so we deselect
              return { start: null, end: null };
            } else {
              // Click after start means the range is complete
              return { start, end: date };
            }
          }

          // Reset if full range exists
          return { start: date, end: null };
        });
        return;
      }

      // Not in log mode - handle tooltip for existing periods
      // Check if the tapped date belongs to an existing period
      const clickedPeriod = periods.find((p) =>
        isWithinInterval(date, { start: p.start, end: p.end }),
      );
      if (clickedPeriod) {
        // Show tooltip at click position
        setTooltip({
          visible: true,
          position,
          periodId: clickedPeriod.id,
        });
      } else {
        // Hide tooltip if clicking empty space
        setTooltip({ visible: false, position: null, periodId: null });
      }
    },
    [isLogMode, isOngoing, today, periods],
  );

  // Handle "Ongoing" toggle
  const toggleOngoing = () => {
    const newState = !isOngoing;
    setIsOngoing(newState);

    if (newState) {
      // If turning on, sets end date to today (visual only, API will get null)
      if (selection.start) {
        setSelection((prev) => ({ ...prev, end: today }));
      }
    } else {
      // If turning off, clear the end date so user can pick manually
      setSelection((prev) => ({ ...prev, end: null }));
    }
  };

  // Selection validation and save
  const validateSelection = (start: Date, end: Date) => {
    // Overlap check

    // Filter out the period currently being edited from the overlap check
    // so it doesn't collide with its own previous state
    const otherPeriods = editingPeriodId
      ? periods.filter((p) => p.id !== editingPeriodId)
      : periods;

    const hasOverlap = otherPeriods.some((p) =>
      areIntervalsOverlapping(
        { start, end },
        { start: p.start, end: p.end },
        { inclusive: true },
      ),
    );
    if (hasOverlap) {
      Alert.alert(
        "Period already logged!",
        "It looks like you've already tracked a period during this timeframe. You can just tap on the existing entry to edit it!",
      );
      return false;
    }

    // Adjacency check (1 day gap)
    const isAdjacent = otherPeriods.some((p) => {
      // Check if new.start is 1 day after p.end
      const touchesAfter = isSameDay(start, addDays(p.end, 1));
      // Check if new.end is 1 day before p.start
      const touchesBefore = isSameDay(end, subDays(p.start, 1));

      return touchesAfter || touchesBefore;
    });
    if (isAdjacent) {
      Alert.alert(
        "Looks like one continuous period!",
        "Since these dates are right next to an existing log, it works best to just extend the dates of that period.",
      );
      return false;
    }
    return true;
  };

  const handleSaveLog = async () => {
    if (!selection.start) {
      Alert.alert(
        "Just a quick check!",
        "We need a start date to log this entry properly.",
      );
      return;
    }

    // If ongoing, validation range is start -> today
    // If not ongoing, validation range is start -> end (or start -> start if single day)
    const effectiveEnd = selection.end || selection.start;
    if (!validateSelection(selection.start, effectiveEnd)) return;

    setIsSaving(true);
    try {
      const payload: PeriodLogRequest = {
        startDate: format(selection.start, "yyyy-MM-dd"),
        // If ongoing, send null. Otherwise send formatted date.
        endDate: isOngoing ? null : format(effectiveEnd, "yyyy-MM-dd"),
      };
      if (editingPeriodId) {
        // Update existing
        await updatePeriod(editingPeriodId, payload);
      } else {
        // Create new
        await logNewPeriod(payload);
      }

      // Refresh & reset
      await fetchData();
      handleCancelLog();
      Alert.alert(
        "Success",
        editingPeriodId
          ? "We've updated this period in your history."
          : "We've added this period to your history.",
      );
    } catch (error: any) {
      Alert.alert(
        "Oops!",
        error.message ||
          "We had trouble saving that just now. Please try again in a moment.",
      );
    } finally {
      setIsSaving(false);
    }
  };

  // Load previous months (scroll up)
  const loadMorePast = useCallback(() => {
    // Check ref (synchronous lock)
    if (isLoadingPastRef.current) return;

    // Set lock
    isLoadingPastRef.current = true;
    setIsLoadingPast(true);

    // Small delay to allow UI to show spinner (feels more responsive)
    setTimeout(() => {
      setMonths((currentMonths) => {
        return [
          ...generateMonths(
            subMonths(currentMonths[0].date, BATCH_SIZE),
            BATCH_SIZE,
          ),
          ...currentMonths,
        ];
      });

      // Release lock
      setTimeout(() => {
        isLoadingPastRef.current = false;
        setIsLoadingPast(false);
      }, 500);
    }, 800);
  }, []);

  // Load future months (scroll down)
  const loadMoreFuture = useCallback(() => {
    // Check ref (synchronous lock)
    if (isLoadingFutureRef.current) return;

    // Set lock
    isLoadingFutureRef.current = true;
    setIsLoadingFuture(true);

    // Small delay to allow UI to show spinner (feels more responsive)
    setTimeout(() => {
      setMonths((currentMonths) => {
        return [
          ...currentMonths,
          ...generateMonths(
            addMonths(currentMonths[currentMonths.length - 1].date, 1),
            BATCH_SIZE,
          ),
        ];
      });

      // Release lock
      setTimeout(() => {
        isLoadingFutureRef.current = false;
        setIsLoadingFuture(false);
      }, 500);
    }, 800);
  }, []);

  // Helper function to close tooltip safely
  const closeTooltip = useCallback(() => {
    if (tooltip.visible) {
      setTooltip({ visible: false, position: null, periodId: null });
    }
  }, [tooltip.visible]);

  // Months rendering
  const renderMonth = useCallback(
    ({ item }: any) => (
      <CalendarMonth
        item={item}
        periodDateSet={periodDateSet}
        predictionDateSet={predictionDateSet}
        selection={selection}
        isLogMode={isLogMode}
        isOngoing={isOngoing}
        themeColor={theme.highlight}
        onPress={handleDatePress}
        onCloseTooltip={closeTooltip}
        today={today}
      />
    ),
    [
      periodDateSet,
      predictionDateSet,
      selection,
      isLogMode,
      isOngoing,
      theme.highlight,
      handleDatePress,
      today,
      closeTooltip,
    ],
  );

  return (
    // Main container - full screen with background color
    <View className="flex-1 bg-[#F9F9F9]">
      <StatusBar barStyle="dark-content" />
      <View
        className="flex-1"
        style={{
          // Add extra 20px for better visual spacing at top of screen (for the status bar)
          paddingTop: insets.top + 20,
        }}
      >
        {/* Main content container */}
        <View className="flex-1">
          <CalendarHeader />

          {/* Wrapper for overlay and list content */}
          <View className="flex-1 relative">
            {/* The initial screen loading overlay */}
            {!isListReady && (
              <View className="absolute inset-0 z-50 items-center justify-center bg-[#F9F9F9] mt-24">
                <ActivityIndicator
                  size="large"
                  color={theme.highlight || "#FCA5A5"}
                />
              </View>
            )}

            {/* Months list */}
            <FlatList
              ref={flatListRef}
              testID="calendar-list"
              data={months}
              keyExtractor={(item) => item.id}
              renderItem={renderMonth}
              // Hide list until the initial load is complete
              style={{ opacity: isListReady ? 1 : 0 }}
              // Start at index 6 because we loaded 6 past months + current month
              initialScrollIndex={PRELOAD_PAST_MONTHS}
              // We use this to confirm we are ready to show the list
              onLayout={() => {
                // Small safety timeout to ensure the scroll command has processed
                setTimeout(() => {
                  setIsListReady(true);
                }, 1000);
              }}
              // This handles scroll index failures (happens on some slow devices)
              onScrollToIndexFailed={(info) => {
                const wait = new Promise((resolve) => setTimeout(resolve, 500));
                wait.then(() => {
                  flatListRef.current?.scrollToIndex({
                    index: info.index,
                    animated: false,
                  });
                });
              }}
              // This hides the tooltip when the user starts scrolling
              onScrollBeginDrag={() => {
                if (tooltip.visible) {
                  setTooltip({
                    visible: false,
                    position: null,
                    periodId: null,
                  });
                }
              }}
              // This keeps the scroll position stable when we add new items to the top of the list
              // Without this, adding items to the top pushes the content down, causing a visual jump
              maintainVisibleContentPosition={{
                minIndexForVisible: 0,
              }}
              // Infinite scroll props
              onStartReached={loadMorePast}
              onStartReachedThreshold={0.2} // Trigger when near top
              onEndReached={loadMoreFuture}
              onEndReachedThreshold={0.2} // Trigger when near bottom
              showsVerticalScrollIndicator={false} // Hide scrollbar for cleaner look
              // Extra padding at bottom so content isn't hidden behind buttons
              contentContainerStyle={{
                paddingBottom: isLogMode ? 340 : 180,
              }}
              // Performance props
              initialNumToRender={2}
              maxToRenderPerBatch={3}
              windowSize={3}
              removeClippedSubviews={true}
              // Loaders
              ListHeaderComponent={
                isLoadingPast ? (
                  <ActivityIndicator
                    size="small"
                    color="#FCA5A5"
                    className="py-4"
                  />
                ) : null
              }
              ListFooterComponent={
                isLoadingFuture ? (
                  <ActivityIndicator
                    size="small"
                    color="#FCA5A5"
                    className="py-4"
                  />
                ) : null
              }
            />
          </View>

          {/* Bottom styling */}
          <View className="absolute bottom-0 w-full justify-end">
            {/* Dynamic height based on mode: log mode needs more space, and regular mode needs less */}
            <View
              className={`w-full ${isLogMode ? "h-[200px]" : "h-[150px]"}`}
              pointerEvents="box-none"
            >
              <LinearGradient
                colors={[
                  "rgba(249,249,249,0)",
                  "rgba(249,249,249,0.95)",
                  "#F9F9F9",
                ]}
                locations={[0, 0.3, 0.7]}
                className="absolute w-full h-full"
                pointerEvents="none" // Allow touches to pass through
              />

              <View className="absolute bottom-0 w-full px-8 pb-4 z-10">
                {!isLogMode ? (
                  // When not in log/edit mode, show the log new period button and the cycle questionnaire button
                  <View className="w-full flex-row items-center justify-center relative">
                    {/* Log period button */}
                    <LogNewPeriodButton
                      color="#FCA5A5"
                      onPress={handleLogPeriodStart}
                      style={{ width: "42%" }}
                    />

                    {/* Cycle questionnaire button */}
                    <View className="absolute right-0">
                      <FloatingAddButton
                        size={50}
                        buttonColor="#FCA5A5"
                        textColor="black"
                        onPress={() =>
                          console.log("Add Questionnaire Response")
                        } // TODO Replace with logic
                      />
                    </View>
                  </View>
                ) : (
                  // When in log mode, show the logging controls
                  <View className="w-full">
                    {/* Ongoing checkbox */}
                    <Pressable
                      onPress={toggleOngoing}
                      className="flex-row items-center justify-center mb-6"
                    >
                      <View
                        className={`w-6 h-6 rounded border-2 mr-3 items-center justify-center ${isOngoing ? "bg-red-400 border-red-400" : "border-stone-300 bg-white"}`}
                      >
                        {isOngoing && (
                          <Feather name="check" size={16} color="white" />
                        )}
                      </View>
                      <Text className="text-stone-700 text-base font-semibold">
                        Mark as ongoing
                      </Text>
                    </Pressable>

                    {/* Buttons for canceling and saving */}
                    <View className="flex-row justify-between items-center px-1">
                      <TouchableOpacity
                        onPress={handleCancelLog}
                        className="w-[48%] bg-stone-200 py-3 rounded-full items-center"
                      >
                        <Text className="text-stone-600 font-bold text-lg">
                          Cancel
                        </Text>
                      </TouchableOpacity>

                      <TouchableOpacity
                        onPress={handleSaveLog}
                        disabled={isSaving}
                        className="w-[48%] bg-red-400 py-3 rounded-full items-center shadow-sm"
                      >
                        {isSaving ? (
                          <ActivityIndicator color="white" />
                        ) : (
                          <Text className="text-white font-bold text-lg">
                            Save
                          </Text>
                        )}
                      </TouchableOpacity>
                    </View>
                  </View>
                )}
                <View className="h-4" />
              </View>
            </View>
          </View>

          {/* Tooltip component */}
          <PeriodActionTooltip
            visible={tooltip.visible}
            position={tooltip.position}
            onEditPeriod={handleEditPeriod}
            onEditCycleQuestionnaire={handleEditDailyQuestionnaire}
            onDelete={handleDeletePeriod}
            onClose={() =>
              setTooltip({ visible: false, position: null, periodId: null })
            }
          />
        </View>
      </View>
    </View>
  );
}
