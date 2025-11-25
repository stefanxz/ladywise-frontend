import React, { useCallback, useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, FlatList, StatusBar, ActivityIndicator, Pressable, Alert } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Calendar as CalendarIcon } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Feather } from '@expo/vector-icons';
import { generateMonths } from '@/utils/calendarHelpers';
import CalendarDay from '@/components/Calendar/CalendarDay';
import CalendarHeader from '@/components/Calendar/CalendarHeader';
import LogNewPeriodButton from '@/components/LogNewPeriodButton/LogNewPeriodButton';
import { addDays, addMonths, areIntervalsOverlapping, format, isAfter, isBefore, isSameDay, isWithinInterval, parseISO, startOfDay, subDays, subMonths } from 'date-fns';
import { useTheme } from '@/context/ThemeContext';
import { getCycleStatus, getPeriodHistory, logNewPeriod } from '@/lib/api';
import { useAuth } from "@/context/AuthContext";
import { PeriodLogRequest } from '@/lib/types/period';

// Configuration
const PRELOAD_PAST_MONTHS = 6;
const PRELOAD_FUTURE_MONTHS = 12;
const BATCH_SIZE = 10; // How many months to load at a time

type ParsedPeriod = {
  start: Date,
  end: Date,
};

export default function CalendarScreen() {
  const insets = useSafeAreaInsets(); // Used to get precise safe area dimensions
  const { theme, setPhase } = useTheme();
  const { token, isLoading: isAuthLoading } = useAuth();

  const today = startOfDay(new Date());

  const [months, setMonths] = useState<any[]>([]);
  const [periods, setPeriods] = useState<ParsedPeriod[]>([]);
  const [isLoadingPast, setIsLoadingPast] = useState(false);
  const [isLoadingFuture, setIsLoadingFuture] = useState(false);

  // Period logging state
  const [isLogMode, setIsLogMode] = useState(false);
  const [selection, setSelection] = useState<{ start: Date | null, end: Date | null }>({ start: null, end: null });
  const [isOngoing, setIsOngoing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Fetch data
  const fetchData = useCallback (async () => {
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

      const parsedPeriods = history.map(p => ({
        start: parseISO(p.startDate),
        // If end date is null (ongoing), use today as temp for visual rendering
        end: p.endDate ? parseISO(p.endDate) : today
      }));

      setPeriods(parsedPeriods);
    } catch (err) {
      console.error("Failed to fetch cycle calendar data: " + err);
    }
  }, [token, isAuthLoading, setPhase]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Initial Load
  useEffect(() => {
    const today = new Date();
    const start = subMonths(today, PRELOAD_PAST_MONTHS);
    const totalMonths = PRELOAD_PAST_MONTHS + PRELOAD_FUTURE_MONTHS;
    setMonths(generateMonths(start, totalMonths));
  }, []);

  const checkIsPeriod = useCallback((date: Date) => {
    return periods.some(period =>
      isWithinInterval(date, { start: period.start, end: period.end})
    );
  }, [periods])

  // Logging new period
  const handleLogPeriodStart = () => {
    setIsLogMode(true);
    setSelection({ start: null, end: null });
    setIsOngoing(false);
  };

  const handleCancelLog = () => {
    setIsLogMode(false);
    setSelection({ start: null, end: null });
    setIsOngoing(false);
  };

  const handleDatePress = useCallback((date: Date) => {
    if (!isLogMode) return; // Only interactive in log mode

    // Prevent selection of future dates
    if (isAfter(date, today)) {
      return; 
    }

    setSelection(prev => {
      // If "Ongoing" is checked, we only allow picking a Start Date
      if (isOngoing) {
        return { start: date, end: today }; // End is visually "Today"
      }

      const { start, end } = prev;

      // Start new selection
      if (!start) {
        return { start: date, end: null };
      }

      // Adjust selection
      if (start && !end) {
        if (isBefore(date, start)) {
          // Clicked before start -> Reset start
          return { start: date, end: null };
        } else if (isSameDay(date, start)) {
          // Clicked same day -> Deselect
          return { start: null, end: null };
        } else {
          // Clicked after start -> Range complete
          return { start, end: date };
        }
      }

      // Reset if full range exists
      return { start: date, end: null };
    });
  }, [isLogMode, isOngoing]);

  // Handle "Ongoing" toggle
  const toggleOngoing = () => {
    const newState = !isOngoing;
    setIsOngoing(newState);
    
    if (newState) {
      // If turning on, sets end date to today (visual only, API will get null)
      if (selection.start) {
        setSelection(prev => ({ ...prev, end: today }));
      }
    } else {
      // If turning off, clear the end date so user can pick manually
      setSelection(prev => ({ ...prev, end: null }));
    }
  };

  // Selection validation and save
  const validateSelection = (start: Date, end: Date) => {
    // Overlap Check
    const hasOverlap = periods.some(p => 
      areIntervalsOverlapping({ start, end }, { start: p.start, end: p.end })
    );

    if (hasOverlap) {
      Alert.alert("Overlap Detected", "This period overlaps with an existing one. Please edit or delete the existing period first.");
      return false;
    }

    // Adjacency Check (1 day gap)
    const isAdjacent = periods.some(p => {
      // Check if new.start is 1 day after p.end
      const touchesAfter = isSameDay(start, addDays(p.end, 1));
      // Check if new.end is 1 day before p.start
      const touchesBefore = isSameDay(end, subDays(p.start, 1));
      
      return touchesAfter || touchesBefore;
    });

    if (isAdjacent) {
      Alert.alert("Periods are adjacent", "You have selected a period immediately before or after an existing one. Please edit the existing period to extend it instead.");
      return false;
    }

    return true;
  };

  const handleSaveLog = async () => {
    if (!selection.start) {
      Alert.alert("Missing Date", "Please select a start date.");
      return;
    }

    // If ongoing, validation range is Start -> Today
    // If not ongoing, validation range is Start -> End (or Start -> Start if single day)
    const effectiveEnd = selection.end || selection.start;
    
    if (!validateSelection(selection.start, effectiveEnd)) return;

    setIsSaving(true);
    try {
      const payload: PeriodLogRequest = {
        startDate: format(selection.start, 'yyyy-MM-dd'),
        // If ongoing, send null. Otherwise send formatted date.
        endDate: isOngoing ? null : format(effectiveEnd, 'yyyy-MM-dd'),
      };

      await logNewPeriod(payload);
      
      // Refresh & Reset
      await fetchData();
      handleCancelLog();
      Alert.alert("Success", "Period logged successfully!");
    } catch (error: any) {
      Alert.alert("Error", error.message || "Failed to log period");
    } finally {
      setIsSaving(false);
    }
  };

  // Load Previous Months (Scroll Up)
  const loadMorePast = useCallback(() => {
    if (isLoadingPast || months.length === 0) return;
    setIsLoadingPast(true);

    // Small delay to allow UI to show spinner (feels more responsive)
    setTimeout(() => {
      setMonths((currentMonths) => {        
        return [...generateMonths(subMonths(currentMonths[0].date, BATCH_SIZE),
        BATCH_SIZE), ...currentMonths];
      });
      setIsLoadingPast(false);
    }, 500);
  }, [isLoadingPast, months]);

  // Load Future Months (Scroll Down)
  const loadMoreFuture = useCallback(() => {
    if (isLoadingFuture || months.length === 0) return;

    setIsLoadingFuture(true);

    setTimeout(() => {
      setMonths((currentMonths) => {
        return [...currentMonths,
        ...generateMonths(addMonths(currentMonths[currentMonths.length - 1].date, 1), BATCH_SIZE)];
      });
      setIsLoadingFuture(false);
    }, 500);
  }, [isLoadingFuture, months]);
  
  // Helper for rendering the months
  const renderMonth = useCallback(({ item }: any) => (
    <View className="mb-0 px-4"> 
      <View className="flex-row items-center justify-center mb-2 mt-2 space-x-2">
        <Feather name="calendar" size={18} color="#44403C" />
        <View className="flex-row items-baseline ml-2">
          <Text className="text-stone-900 text-lg font-bold mr-1">
            {item.titleMonth}
          </Text>
          <Text className="text-stone-400 text-lg font-medium">
            {item.titleYear}
          </Text>
        </View>
      </View>
      
      <View className="flex-row flex-wrap mx-2">
        {item.days.map((date: Date | null, index: number) => {
          // Existing Period Check
          const isPeriodDay = date ? checkIsPeriod(date) : false;
          
          // Selection Checks
          let isSelected = false;
          let isInRange = false;
          let isSelectionStart = false;
          let isSelectionEnd = false;

          if (isLogMode && date && selection.start) {
             const { start, end } = selection;
             isSelectionStart = isSameDay(date, start);
             isSelectionEnd = end ? isSameDay(date, end) : false;
             
             if (isSelectionStart || isSelectionEnd) {
               isSelected = true;
             } else if (end && isWithinInterval(date, { start, end })) {
               isInRange = true;
             }
          }

          return (
            <CalendarDay 
              key={date ? date.toISOString() : `empty-${item.id}-${index}`}
              date={date}
              isPeriod={isPeriodDay}
              isSelected={isSelected}
              isInRange={isInRange}
              isSelectionStart={isSelectionStart}
              isSelectionEnd={isSelectionEnd}
              themeColor={theme.highlight}
              onPress={handleDatePress}
            />
          );
        })}
      </View>
    </View>
  ), [checkIsPeriod, handleDatePress, isLogMode, selection, theme.highlight]);


  return (
    <View 
      className="flex-1 bg-[#F9F9F9]"
      style={{ 
        // Apply safe area padding for top (Status Bar)
        // Add extra 20px for better visual spacing at top of screen
        paddingTop: insets.top + 20 
      }}
    >
      <StatusBar barStyle="dark-content" />

      {/* Main Content Container */}
      <View className="flex-1">
        
        <CalendarHeader />

        <FlatList
          data={months}
          keyExtractor={(item) => item.id}
          renderItem={renderMonth}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 160 }} 
          
          // Infinite Scroll Props
          onStartReached={loadMorePast}
          onStartReachedThreshold={0.5} // Trigger when near top
          onEndReached={loadMoreFuture}
          onEndReachedThreshold={0.5} // Trigger when near bottom
          
          // Keeps scroll position stable when adding items to top
          maintainVisibleContentPosition={{ minIndexForVisible: 0 }}
          
          // Loaders
          ListHeaderComponent={
            isLoadingPast ? <ActivityIndicator size="small" color="#FCA5A5" className="py-4" /> : null
          }
          ListFooterComponent={
            isLoadingFuture ? <ActivityIndicator size="small" color="#FCA5A5" className="py-4" /> : null
          }

          initialNumToRender={3}
          maxToRenderPerBatch={5}
          windowSize={5}
        />

        {/* Bottom styling */}
        <View className="absolute bottom-0 w-full justify-end">
           {/* Dynamic height based on mode: log mode needs more space, and regular mode needs less */}
           <View className={`w-full ${isLogMode ? "h-[320px]" : "h-[180px]"}`} pointerEvents="box-none">
             <LinearGradient
                colors={['rgba(249,249,249,0)', 'rgba(249,249,249,0.95)', '#F9F9F9']}
                locations={[0, 0.3, 0.7]}
                className="absolute w-full h-full"
              />

              <View className="absolute bottom-0 w-full px-8 pb-8 z-10">
                {!isLogMode ? (
                  // When not in Log Mode, show the log new period Button
                  <LogNewPeriodButton 
                    color="#FCA5A5" 
                    onPress={handleLogPeriodStart}
                  />
                ) : (
                  // When in Log Mode, show the logging controls
                  <View className="w-full">
                    {/* Ongoing checkbox */}
                    <Pressable 
                      onPress={toggleOngoing}
                      className="flex-row items-center justify-center mb-6"
                    >
                      <View className={`w-6 h-6 rounded border-2 mr-3 items-center justify-center ${isOngoing ? 'bg-red-400 border-red-400' : 'border-stone-300 bg-white'}`}>
                        {isOngoing && <Feather name="check" size={16} color="white" />}
                      </View>
                      <Text className="text-stone-700 text-base font-semibold">Mark as ongoing</Text>
                    </Pressable>

                    {/* Buttons for canceling and saving */}
                    <View className="flex-row space-x-4">
                      <TouchableOpacity
                        onPress={handleCancelLog}
                        className="flex-1 bg-stone-200 py-3 rounded-full items-center"
                      >
                        <Text className="text-stone-600 font-bold text-lg">Cancel</Text>
                      </TouchableOpacity>
                      
                      <TouchableOpacity
                        onPress={handleSaveLog}
                        disabled={isSaving}
                        className="flex-1 bg-red-400 py-3 rounded-full items-center shadow-sm"
                      >
                        {isSaving ? (
                          <ActivityIndicator color="white" />
                        ) : (
                          <Text className="text-white font-bold text-lg">Save</Text>
                        )}
                      </TouchableOpacity>
                    </View>
                  </View>
                )}
                <View className="h-4" />
              </View>
           </View>
        </View>

      </View>
    </View>
  );
}
