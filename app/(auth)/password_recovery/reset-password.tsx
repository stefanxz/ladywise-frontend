import React, { useState } from "react";
import { Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams, useRouter } from "expo-router";

import { AppBar } from "@/components/AppBarBackButton/AppBarBackButton";
import { PasswordField } from "@/components/PasswordField/PasswordField";
import { ThemedPressable } from "@/components/ThemedPressable/ThemedPressable";
import { resetPassword } from "@/lib/api";
import { isPasswordValid } from "@/utils/validations";

/**
 * ResetPasswordScreen
 *
 * Screen that allows users to set a new password using a token from the reset link.
 * Validates the new password and confirmation before submitting.
 *
 * @returns {JSX.Element} The rendered password reset screen
 */
export default function ResetPasswordScreen() {
  const router = useRouter();
  const { token } = useLocalSearchParams<{ token?: string }>();

  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");

  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [confirmPasswordError, setConfirmPasswordError] = useState<
    string | null
  >(null);
  const [formError, setFormError] = useState<string | null>(null);

  const [submitting, setSubmitting] = useState(false);

  const onChangeNewPassword = (t: string) => {
    setNewPassword(t);
    if (passwordError) setPasswordError(null);
    if (formError) setFormError(null);
  };

  const onChangeConfirm = (t: string) => {
    setConfirmNewPassword(t);
    if (confirmPasswordError) setConfirmPasswordError(null);
    if (formError) setFormError(null);
  };

  const handleResetPassword = async () => {
    setFormError(null);
    setPasswordError(null);
    setConfirmPasswordError(null);

    // Validate presence of token
    if (!token || typeof token !== "string" || token.trim().length === 0) {
      setFormError(
        "Invalid or missing reset token. Please request a new link.",
      );
      return;
    }

    let hasError = false;

    // Validate new password
    if (!isPasswordValid(newPassword)) {
      setPasswordError(
        "Password must contain at least 8 characters, 1 upper case, 1 lower case and 1 number (and no spaces).",
      );
      hasError = true;
    }

    // Validate confirmation
    if (confirmNewPassword !== newPassword || !confirmNewPassword.trim()) {
      setConfirmPasswordError("Please make sure the passwords match.");
      hasError = true;
    }

    if (hasError) return;

    try {
      setSubmitting(true);

      await resetPassword({
        token: token.toString(),
        newPassword: newPassword.trim(),
      });

      router.replace({
        pathname: "/(auth)/login",
        params: { passwordReset: "true" },
      });
    } catch (e) {
      console.error("Reset password error:", e);
      setFormError(
        e instanceof Error
          ? e.message
          : "We couldn't reset your password. Please try again.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-background">
      {/* Top AppBar */}
      <View className="w-full bg-gray-50" style={{ zIndex: 10, elevation: 10 }}>
        <AppBar />
      </View>

      {/* Main content */}
      <View className="w-full max-w-md px-6 pt-10 gap-y-2 self-center">
        {/* Title Section */}
        <View className="items-start px-10 mb-5">
          <Text className="text-3xl text-brand text-left">
            <Text className="font-semibold">Set a </Text>
            <Text className="font-aclonica-regular">New Password 🔒</Text>
          </Text>
          <Text className="text-gray-600 text-lg mt-2 text-left leading-snug max-w-xs">
            Choose a strong new password to secure your account.
          </Text>
        </View>

        {/* Password fields */}
        <View className="gap-y-8 w-80 self-center">
          <PasswordField
            label="New password"
            value={newPassword}
            onChangeText={onChangeNewPassword}
            error={passwordError}
            testID="new-password-input"
          />

          <PasswordField
            label="Confirm new password"
            value={confirmNewPassword}
            onChangeText={onChangeConfirm}
            error={confirmPasswordError}
            testID="confirm-new-password-input"
          />
        </View>

        {/* Error message */}
        {formError ? (
          <Text className="text-red-700 text-sm mt-2 text-center">
            {formError}
          </Text>
        ) : null}

        {/* Reset button */}
        <ThemedPressable
          label="Reset password"
          onPress={handleResetPassword}
          loading={submitting}
          disabled={submitting}
          className="mt-6 w-80 self-center bg-brand"
          testID="reset-password-button"
        />
      </View>
    </SafeAreaView>
  );
}
