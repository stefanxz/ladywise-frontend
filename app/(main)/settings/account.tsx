import React, { useState } from "react";
import { View, Text, Alert } from "react-native";
import { SettingsPageLayout } from "@/components/Settings/SettingsPageLayout";
import { PasswordField } from "@/components/PasswordField/PasswordField";
import { ThemedPressable } from "@/components/ThemedPressable/ThemedPressable";
import { isPasswordValid } from "@/utils/validations";
import { useAuth } from "@/context/AuthContext";
import { changePassword, deleteCurrentUser } from "@/lib/api";
import axios from "axios";

/**
 * AccountSettings
 *
 * Screen for managing account security settings.
 * Allows users to change their password and delete their account.
 *
 * @returns {JSX.Element} The rendered account settings screen
 */
export default function AccountSettings() {
  const { signOut } = useAuth();

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);
  const [passwordSuccessMsg, setPasswordSuccessMsg] = useState<string | null>(
    null,
  );
  const [currentPwError, setCurrentPwError] = useState<string | null>(null);
  const [newPwError, setNewPwError] = useState<string | null>(null);
  const [confirmPwError, setConfirmPwError] = useState<string | null>(null);

  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const clearErrors = () => {
    setCurrentPwError(null);
    setNewPwError(null);
    setConfirmPwError(null);
    setPasswordSuccessMsg(null);
  };

  const handleUpdatePassword = async () => {
    clearErrors();
    let hasError = false;

    // Validate current password is provided
    if (!currentPassword) {
      setCurrentPwError("Please enter your current password.");
      hasError = true;
    }

    // Validate new password meets requirements
    if (!isPasswordValid(newPassword)) {
      setNewPwError(
        "Password must contain at least 8 characters, 1 upper case, 1 lower case and 1 number (and no spaces).",
      );
      hasError = true;
    }

    // Validate passwords match
    if (newPassword !== confirmPassword) {
      setConfirmPwError("Passwords do not match.");
      hasError = true;
    }

    if (hasError) return;

    setIsUpdatingPassword(true);

    try {
      await changePassword({
        currentPassword,
        newPassword,
      });

      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const status = error.response?.status;
        const message = error.response?.data?.message || error.message;

        if (status === 401) {
          // Invalid current password
          setCurrentPwError("Current password is incorrect.");
        } else if (status === 400) {
          // Validation error (e.g., new password same as current)
          setNewPwError(message);
        } else {
          // Generic error
          setCurrentPwError("Failed to update password. Please try again.");
        }
      } else {
        // Non-Axios error
        setCurrentPwError("An unexpected error occurred. Please try again.");
      }
    } finally {
      setIsUpdatingPassword(false);
    }
  };

  const handleDeleteAccount = async () => {
    setIsDeleting(true);
    try {
      await deleteCurrentUser();
      signOut();
    } catch (error) {
      setIsDeleting(false);

      if (axios.isAxiosError(error)) {
        const status = error.response?.status;

        if (status === 404) {
          console.error("User not found");
          // User doesn't exist, sign out anyway
          signOut();
        } else {
          console.error("Failed to delete account:", error.message);
          Alert.alert("Failed to delete account. Please try again.");
        }
      } else {
        console.error("An unexpected error occurred:", error);
        Alert.alert("An unexpected error occurred. Please try again.");
      }
    }
  };

  return (
    <SettingsPageLayout
      title="Account"
      description="Manage your security and account preferences."
    >
      {/* Change Password Section */}
      <View className="bg-white rounded-2xl shadow-sm px-4 py-6 mb-6">
        <Text className="text-lg font-bold text-headingText mb-4">
          Change Password
        </Text>

        <View className="gap-y-4">
          <PasswordField
            label="Current Password"
            value={currentPassword}
            onChangeText={(t) => {
              setCurrentPassword(t);
              if (currentPwError) setCurrentPwError(null);
            }}
            error={currentPwError}
            testID="current-password-input"
          />

          <PasswordField
            label="New Password"
            value={newPassword}
            onChangeText={(t) => {
              setNewPassword(t);
              if (newPwError) setNewPwError(null);
            }}
            error={newPwError}
            testID="new-password-input"
          />

          <PasswordField
            label="Confirm New Password"
            value={confirmPassword}
            onChangeText={(t) => {
              setConfirmPassword(t);
              if (confirmPwError) setConfirmPwError(null);
            }}
            error={confirmPwError}
            testID="confirm-new-password-input"
          />

          {passwordSuccessMsg && (
            <Text className="text-green-600 text-sm font-medium text-center mt-2">
              {passwordSuccessMsg}
            </Text>
          )}

          <ThemedPressable
            label="Update Password"
            onPress={handleUpdatePassword}
            loading={isUpdatingPassword}
            disabled={isUpdatingPassword}
            className="mt-2 bg-brand"
            testID="update-password-btn"
          />
        </View>
      </View>

      <View className="bg-white rounded-2xl shadow-sm px-4 py-6 mb-6">
        <Text
          className="text-lg font-bold text-red-600 mb-2"
          testID="delete-account-btn"
        >
          Delete Account
        </Text>
        <Text className="text-sm text-inactiveText mb-6 leading-5">
          Permanently remove your account and all associated data. This action
          cannot be undone.
        </Text>

        {!showDeleteConfirm ? (
          <ThemedPressable
            label="Delete Account"
            onPress={() => setShowDeleteConfirm(true)}
            testID="initiate-delete-btn"
            className="bg-gray-200"
            textClassName="text-headingText"
          />
        ) : (
          <View className="bg-red-50 p-4 rounded-xl border border-red-100">
            <Text className="text-red-800 font-bold mb-2">
              Are you absolutely sure?
            </Text>
            <Text className="text-red-600 text-sm mb-4">
              You are about to delete your account. This action cannot be
              reversed.
            </Text>

            <View className="gap-y-3">
              <ThemedPressable
                label="Yes, Delete My Account"
                onPress={handleDeleteAccount}
                loading={isDeleting}
                className="bg-red-600"
                testID="confirm-delete-btn"
              />

              <ThemedPressable
                label="Cancel"
                onPress={() => setShowDeleteConfirm(false)}
                disabled={isDeleting}
                className="bg-transparent border border-gray-300"
                textClassName="text-gray-600"
                testID="cancel-delete-btn"
              />
            </View>
          </View>
        )}
      </View>
    </SettingsPageLayout>
  );
}
