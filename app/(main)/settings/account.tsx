import React, { useState } from "react";
import { View, Text } from "react-native";
import { SettingsPageLayout } from "@/components/Settings/SettingsPageLayout";
import { PasswordField } from "@/components/PasswordField/PasswordField";
import { ThemedPressable } from "@/components/ThemedPressable/ThemedPressable";
import { isPasswordValid } from "@/utils/validations"; // Assuming this exists based on your example
import { useAuth } from "@/context/AuthContext";

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

  const handleUpdatePassword = () => {
    clearErrors();
    let hasError = false;

    if (!currentPassword) {
      setCurrentPwError("Please enter your current password.");
      hasError = true;
    }

    if (!isPasswordValid(newPassword)) {
      setNewPwError("Password must be 8+ chars, 1 uppercase, 1 number.");
      hasError = true;
    }

    if (newPassword !== confirmPassword) {
      setConfirmPwError("Passwords do not match.");
      hasError = true;
    }

    if (hasError) return;

    // TODO: change mock to actual impl
    setIsUpdatingPassword(true);
    setTimeout(() => {
      setIsUpdatingPassword(false);
      setPasswordSuccessMsg("Password updated successfully.");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    }, 1500);
  };

  const handleDeleteAccount = () => {
    setIsDeleting(true);
    // TODO: change mock to actual impl
    setTimeout(() => {
      setIsDeleting(false);
      console.log("Account deleted");
      signOut();
    }, 2000);
  };

  return (
    <SettingsPageLayout
      title="Account"
      description="Manage your security and account preferences."
    >
      {/* --- Change Password Section --- */}
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

      {/* --- Delete Account Section --- */}
      <View className="bg-white rounded-2xl shadow-sm px-4 py-6 mb-6">
        <Text className="text-lg font-bold text-red-600 mb-2">
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
            // Start with a simpler/outline style or just standard branding,
            // usually distinct from primary actions
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
