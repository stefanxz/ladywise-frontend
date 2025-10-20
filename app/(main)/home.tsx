import { Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function HomeScreen() {
  return (
    <>
      <SafeAreaView className="flex-1 bg-background p-6">
        <Text className="text-headingText font-inter-semibold text-2xl">
          Home
        </Text>
      </SafeAreaView>
    </>
  );
}
