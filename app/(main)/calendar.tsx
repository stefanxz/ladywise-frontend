import { Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

/**
 * CalendarScreen
 * 
 * Displays the calendar view for tracking cycle events.
 * 
 * @returns {JSX.Element} The rendered calendar screen
 */
export default function CalendarScreen() {
  return (
    <>
      <SafeAreaView className="flex-1 bg-background p-6">
        <Text className="text-headingText font-inter-semibold text-2xl">
          Calendar
        </Text>
      </SafeAreaView>
    </>
  );
}
