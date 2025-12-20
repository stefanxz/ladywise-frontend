import React from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams } from "expo-router";

import { AppBar } from "@/components/AppBarBackButton/AppBarBackButton";

/**
 * PasswordRecoveryCodeScreen
 * 
 * Screen displayed after the user requests a password reset.
 * Informs the user that a reset link has been sent to their email.
 * 
 * @returns {JSX.Element} The rendered mail sent info screen
 */
export default function PasswordRecoveryCodeScreen() {
  const params = useLocalSearchParams<{ email?: string }>();

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="flex-1 bg-[#FDFBFB]"
    >
      <ScrollView
        contentContainerStyle={{ flexGrow: 1, justifyContent: "center" }}
        keyboardShouldPersistTaps="handled"
      >
        <SafeAreaView className="flex-1 bg-background">
          {/* Back Button */}
          <View
            className="w-full bg-gray-50"
            style={{ zIndex: 10, elevation: 10 }}
          >
            <AppBar />
          </View>

          {/* Main content */}
          <View className="flex-1 justify-between pt-12 mb-5">
            {/* Title / subtitle */}
            <View className="px-16 mt-6">
              <Text className="text-3xl font-bold text-[#9B4F60] text-left">
                Check your inbox
              </Text>
              <Text className="text-gray-600 text-base leading-snug text-left mt-3 w-72">
                If an account exists for this{" "}
                {params.email ? ` (${params.email})` : ""}email, a reset link
                has been sent.
              </Text>
            </View>
          </View>
        </SafeAreaView>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
