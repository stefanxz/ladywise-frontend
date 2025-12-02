import { useAuth } from "@/context/AuthContext";
import { Button, ScrollView, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ThemedPressable } from "@/components/ThemedPressable/ThemedPressable";
import React from "react";

export default function SettingsScreen() {
  const { signOut } = useAuth();

  const handleLogout = () => {
    signOut();
    // auth layout should redirect automatically
  };
  return (
    <>
      <SafeAreaView className="flex-1 bg-background px-6">
        <Text className="text-headingText font-inter-semibold text-2xl">
          Settings
        </Text>

        {/* Settings content */}
        <ScrollView className="flex-1 py-8 w-full">
          <ThemedPressable
            label="Log Out"
            onPress={handleLogout}
            testID="log-out-button"
            loading={false}
            disabled={false}
          />
        </ScrollView>
      </SafeAreaView>
    </>
  );
}
