import { Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function SettingsScreen() {
  return (
    <>
      <SafeAreaView className="flex-1 bg-background p-6">
        <Text className="text-headingText font-inter-semibold text-2xl">
          Settings
        </Text>
      </SafeAreaView>
    </>
  );
}
