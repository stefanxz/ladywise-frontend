import React, { useCallback, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  StatusBar,
  ActivityIndicator,
  Pressable,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { Feather } from "@expo/vector-icons";

// Components
import CalendarHeader from "@/components/Calendar/CalendarHeader";
import LogNewPeriodButton from "@/components/LogNewPeriodButton/LogNewPeriodButton";
import CalendarMonth from "@/components/Calendar/CalendarMonth";
import PeriodActionTooltip from "@/components/Calendar/EditDeleteTooltip";
import { FloatingAddButton } from "@/components/FloatingAddButton/FloatingAddButton";

// Hooks for data, pagination, and interactions
import { usePeriodData } from "@/hooks/calendar/usePeriodData";
import { useCalendarPagination } from "@/hooks/calendar/useCalendarPagination";
import { usePeriodInteraction } from "@/hooks/calendar/usePeriodInteraction";

// Theme context
import { useTheme } from "@/context/ThemeContext";
import { CycleQuestionsBottomSheet } from "@/components/CycleQuestionsBottomSheet/CycleQuestionsBottomSheet";
import { useDailyEntry } from "@/hooks/useDailyEntry";
import { useLocalSearchParams } from "expo-router";

// Main calendar screen component
/**
 * CalendarScreen
 * 
 * The main screen for viewing and managing menstrual cycle data.
 * Displays a vertical list of months, allows logging of periods, and provides
 * visual feedback for cycle predictions and history.
 * 
 * Features:
 * - Infinite scrolling of past and future months
 * - Period logging and editing (start/end dates, ongoing status)
 * - Visual indicators for period days, predictions, and today
 * - Tooltip interactions for editing/deleting entries
 * 
 * @returns {JSX.Element} The rendered calendar screen
 */
export default function CalendarScreen() {
  const params = useLocalSearchParams();
  const shouldStartInLogMode = params["log-mode"] === "true";

  const insets = useSafeAreaInsets();
  const { theme } = useTheme();
  const flatListRef = useRef<FlatList>(null);

  // Data logic
  const {
    periods,
    periodDateSet,
    predictionDateSet,
    refreshData,
    today,
    currentPhase,
  } = usePeriodData();

  // Pagination logic
  const {
    months,
    isListReady,
    setIsListReady,
    isLoadingPast,
    isLoadingFuture,
    loadMorePast,
    loadMoreFuture,
    PRELOAD_PAST_MONTHS,
  } = useCalendarPagination();

  // Interaction logic
  const {
    isLogMode,
    isOngoing,
    isSaving,
    selection,
    tooltip,
    setTooltip,
    handleLogPeriodStart,
    handleCancelLog,
    toggleOngoing,
    handleEditPeriod,
    handleDeletePeriod,
    handleSaveLog,
    handleDatePress,
  } = usePeriodInteraction({
    periods,
    refreshData,
    initialLogMode: shouldStartInLogMode,
  });

  const {
    bottomSheetRef,
    isLoading,
    selectedDayData,
    openQuestionnaire,
    handleSave,
  } = useDailyEntry(refreshData);

  // Determine if the floating button should be shown
  const showFloatingButton = currentPhase === "menstrual";

  // Edit daily cycle questionnaire handler
  const handleEditDailyQuestionnaire = () => {
    if (!tooltip.date) return;
    // Close tooltip
    setTooltip({ visible: false, position: null, periodId: null, date: null });

    // Open bottom sheet
    openQuestionnaire(tooltip.date);
  };

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
        onCloseTooltip={() => setTooltip((t) => ({ ...t, visible: false }))}
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
      setTooltip,
    ],
  );

  return (
    <>
      {/* Main container */}
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
                  const wait = new Promise((resolve) =>
                    setTimeout(resolve, 500),
                  );
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
                    setTooltip((t) => ({ ...t, visible: false }));
                  }
                }}
                // This keeps the scroll position stable when we add new items to the top of the list
                maintainVisibleContentPosition={{ minIndexForVisible: 0 }}
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
                // Loader indicators
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
                    "rgba(249, 249, 249, 0)",
                    "rgba(249, 249, 249, 0.8)",
                    "rgba(249, 249, 249, 0.95)",
                    "#F9F9F9",
                  ]}
                  locations={[0, 0.2, 0.5, 0.8]}
                  style={{
                    position: "absolute",
                    width: "100%",
                    height: "100%",
                  }}
                  pointerEvents="none"
                />

                <View className="absolute bottom-0 w-full px-8 pb-4 z-10">
                  {!isLogMode ? (
                    // When not in log/edit mode, show the log new period button and the cycle questionnaire button
                    <View className="w-full flex-row items-center justify-center relative">
                      {/* Log period button */}
                      <LogNewPeriodButton
                        key={periods.length}
                        color={theme.highlight}
                        onPress={handleLogPeriodStart}
                        style={{ width: "42%" }}
                      />

                      {/* Cycle questionnaire button */}
                      {showFloatingButton && (
                        <View className="absolute right-0">
                          <FloatingAddButton
                            size={50}
                            buttonColor={theme.highlight}
                            textColor="black"
                            onPress={() => openQuestionnaire(new Date())}
                          />
                        </View>
                      )}
                    </View>
                  ) : (
                    // Logging/editing mode
                    <View className="w-full">
                      {/* Ongoing checkbox */}
                      <Pressable
                        onPress={toggleOngoing}
                        className="flex-row items-center justify-center mb-6"
                      >
                        <View
                          className={`w-6 h-6 rounded border-2 mr-3 items-center justify-center ${
                            isOngoing
                              ? "bg-red-400 border-red-400"
                              : "border-stone-300 bg-white"
                          }`}
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
                          style={[
                            {
                              backgroundColor: theme.highlight,
                            },
                          ]}
                          className="w-[48%]  py-3 rounded-full items-center shadow-md"
                        >
                          {isSaving ? (
                            <ActivityIndicator
                              color={theme.highlightTextColor}
                            />
                          ) : (
                            <Text
                              style={{ color: theme.highlightTextColor }}
                              className="font-bold text-lg"
                            >
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
                setTooltip({
                  visible: false,
                  position: null,
                  periodId: null,
                  date: null,
                })
              }
            />
          </View>
        </View>
      </View>

      <CycleQuestionsBottomSheet
        bottomSheetRef={bottomSheetRef}
        initialData={selectedDayData}
        isLoading={isLoading}
        onSave={handleSave}
      />
    </>
  );
}
