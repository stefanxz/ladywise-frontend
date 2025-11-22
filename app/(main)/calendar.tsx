import React, { useCallback, useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, FlatList, StatusBar, ActivityIndicator } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Calendar as CalendarIcon } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Feather } from '@expo/vector-icons';
import { generateMonths } from '@/utils/calendarHelpers';
import CalendarDay from '@/components/Calendar/CalendarDay';
import CalendarHeader from '@/components/Calendar/CalendarHeader';
import LogNewPeriodButton from '@/components/LogNewPeriodButton/LogNewPeriodButton';
import { addMonths, subMonths } from 'date-fns';

// Configuration
const PRELOAD_PAST_MONTHS = 6;
const PRELOAD_FUTURE_MONTHS = 12;
const BATCH_SIZE = 10; // How many months to load at a time

export default function CalendarScreen() {
  const insets = useSafeAreaInsets(); // Used to get precise safe area dimensions
  const [months, setMonths] = useState<any[]>([]);
  const [isLoadingPast, setIsLoadingPast] = useState(false);
  const [isLoadingFuture, setIsLoadingFuture] = useState(false);

  // Initial Load
  useEffect(() => {
    const today = new Date();
    const start = subMonths(today, PRELOAD_PAST_MONTHS);
    const totalMonths = PRELOAD_PAST_MONTHS + PRELOAD_FUTURE_MONTHS;
    setMonths(generateMonths(start, totalMonths));
  }, []);

  // Placeholder handler for future logic
  const handleDatePress = useCallback((date: Date) => {
    console.log("Date pressed:", date);
  }, []);

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
        {item.days.map((date: Date | null, index: number) => (
          <CalendarDay 
            key={date ? date.toISOString() : `empty-${item.id}-${index}`}
            date={date}
            onPress={handleDatePress}
          />
        ))}
      </View>
    </View>
  ), [handleDatePress]);

  return (
    <View 
      className="flex-1 bg-[#F9F9F9]"
      style={{ 
        // Apply safe area padding for top (Status Bar)
        // Add extra 20px as requested to "lower the screen"
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
          onEndReachedThreshold={0.5}   // Trigger when near bottom
          
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

        {/* Overlay */}
        <View className="absolute bottom-0 w-full h-[40%] justify-end pointer-events-box-none">
          <LinearGradient
            colors={['rgba(249,249,249,0)', 'rgba(249,249,249,0.9)', '#F9F9F9']}
            locations={[0, 0.4, 1]}
            className="absolute w-full h-full"
          />

          <View className="pb-8 px-8 items-center z-10 w-full">
            <LogNewPeriodButton 
              color="#FCA5A5" 
              onPress={() => console.log("Log period clicked")}
            />
            <View className="h-8" />
          </View>
        </View>

      </View>
    </View>
  );
}
