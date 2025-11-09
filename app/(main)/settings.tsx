import { useAuth } from "@/context/AuthContext";
import { Button, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function SettingsScreen() {
  const { signOut } = useAuth();

  const handleLogout = () => {
    signOut();
    // auth layout should redirect automatically
  }
  return (
    <>
      <SafeAreaView className="flex-1 bg-background p-6">
        <Text className="text-headingText font-inter-semibold text-2xl">
          Settings
        </Text>
        <Button title="Log Out" onPress={handleLogout} color="#ff3b30" />
      </SafeAreaView>
    </>
  );
}
