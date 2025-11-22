import React, { useState } from "react";
import {
  Text,
  View,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";

import { AppBar } from "@/components/AppBarBackButton/AppBarBackButton";
import { EmailField } from "@/components/EmailField/EmailField";
import { ThemedPressable } from "@/components/ThemedPressable/ThemedPressable";
import { isEmailValid } from "@/utils/validations";
import { requestPasswordReset } from "@/lib/api";

export default function PasswordRecovery() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const onChangeEmail = (t: string) => {
    setEmail(t);
    if (emailError) setEmailError(null);
  };

  const handleContinue = async () => {
    setEmailError(null);
    setFormError(null);

    let hasError = false;

    if (!email.trim()) {
      setEmailError("Please enter your email.");
      hasError = true;
    } else if (!isEmailValid(email.trim())) {
      setEmailError("Email must have the format example@domain.com.");
      hasError = true;
    }

    if (hasError) return;

    try {
      setIsSubmitting(true);
      console.log("----------sending request to backend----------");
      await requestPasswordReset({ email: email.trim() });
      console.log("----------sending request to backend----------");
      router.push("/(auth)/password_recovery/mail-sent-info");
    } catch (err) {
      console.error("Recovery error:", err);
      setFormError("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="flex-1 bg-[#FDFBFB]"
    >
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        keyboardShouldPersistTaps="handled"
      >
        <SafeAreaView className="flex-1 bg-background">
          {/* Top AppBar */}
          <View
            className="w-full bg-gray-50"
            style={{ zIndex: 10, elevation: 10 }}
          >
            <AppBar />
          </View>

          <View className="w-full max-w-md px-6 pt-10 gap-y-2 self-center">
            {/* Title Section */}
            <View className="items-start px-10 mb-5">
              <Text className="text-3xl font-bold text-brand text-left">
                Password Recovery
              </Text>
              <Text className="text-gray-600 text-lg mt-2 leading-snug max-w-xs">
                Enter your email address below and we&apos;ll help you reset
                your password.
              </Text>
            </View>

            {/* Email Input */}
            <View className="gap-y-8 w-80 self-center">
              <EmailField
                label="Email"
                value={email}
                onChangeText={onChangeEmail}
                placeholder="Your email"
                error={emailError}
                testID="email-input"
              />
            </View>

            {/* Error Message */}
            {formError ? (
              <Text className="text-red-700 text-sm mt-2 text-center">
                {formError}
              </Text>
            ) : null}

            {/* Continue Button */}
            <ThemedPressable
              label="Continue"
              onPress={handleContinue}
              loading={isSubmitting}
              disabled={false}
              className="mt-6 w-80 self-center bg-brand"
              testID="continue-button"
            />
          </View>
        </SafeAreaView>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
