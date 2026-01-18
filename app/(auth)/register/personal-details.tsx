import { useAuth } from "@/context/AuthContext";
import { AppBar } from "@/components/AppBarBackButton/AppBarBackButton";
import { ThemedPressable } from "@/components/ThemedPressable/ThemedPressable";
import { ThemedTextInput } from "@/components/ThemedTextInput/ThemedTextInput";
import { useRouter } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { updateUser } from "@/lib/api";

/**
 * Personal Details Registration Screen
 *
 * This screen is the second step in the registration flow, displayed immediately
 * after the user has created their account credentials. Its primary purpose is to
 * capture the user's personal identity information (first and last name) to
 * personalize the application experience.
 *
 * It handles input validation, error display, and updating the user's profile
 * via the backend API before navigating to the onboarding questionnaire.
 *
 * @returns {JSX.Element} The rendered screen with a form for personal details.
 */
export default function RegisterPersDetails() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [firstNameError, setFirstNameError] = useState<string | null>(null);
  const [lastNameError, setLastNameError] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const router = useRouter();
  const { userId, email } = useAuth();

  const [isKeyboardVisible, setKeyboardVisible] = useState(false);

  /**
   * Keyboard Visibility Listener
   *
   * Monitors the software keyboard state to adjust the bottom padding of the
   * scroll view. This ensures that the form fields remain visible and accessible
   * even when the keyboard is open, particularly on Android devices where
   * keyboard behavior can overlap UI elements.
   */
  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      "keyboardDidShow",
      () => {
        setKeyboardVisible(true);
      },
    );
    const keyboardDidHideListener = Keyboard.addListener(
      "keyboardDidHide",
      () => {
        setKeyboardVisible(false);
      },
    );

    return () => {
      keyboardDidHideListener.remove();
      keyboardDidShowListener.remove();
    };
  }, []);

  const bottomPadding =
    Platform.OS === "android" && isKeyboardVisible ? 350 : 0;

  const handleBack = useCallback(() => {
    router.replace("/(main)/home");
  }, [router]);

  /**
   * Form Submission Handler
   *
   * Validates the name fields to ensure they are not empty. If validation passes,
   * it initiates an API call to update the user's profile. On success, it
   * advances the user to the next stage of onboarding (the questionnaire).
   * Any errors during validation or API update are caught and displayed to the user.
   */
  const handlePressed = async () => {
    setFirstNameError(null);
    setLastNameError(null);

    let hasError = false;
    if (!firstName.trim()) {
      setFirstNameError("Please enter your first name.");
      hasError = true;
    }
    if (!lastName.trim()) {
      setLastNameError("Please enter your last name.");
      hasError = true;
    }
    if (hasError) return;
    try {
      await updateUser({
        id: userId,
        email: email,
        firstName: firstName,
        lastName: lastName,
      });
      router.push("/onboarding/questionnaire-intro");
    } catch (e) {
      setFormError(e instanceof Error ? e.message : "Update failed.");
    } finally {
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1 bg-background"
        keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 50}
      >
        <ScrollView
          contentContainerStyle={{
            flexGrow: 1,
            paddingBottom: bottomPadding,
            alignItems: "center",
          }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View
            className="w-full bg-gray-50"
            style={{ zIndex: 10, elevation: 10 }}
          >
            <AppBar onBackPress={handleBack} />
          </View>

          <View className="flex-1 w-full items-center font-inter-regular">
            <View className="w-full max-w-md px-6 pt-16">
              <View className="mb-5">
                <View className="mb-5">
                  <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <View style={{ flexShrink: 1, marginLeft: 40 }}>
                      <Text className="text-3xl font-semibold text-brand">
                        {"Let's get to know you"}
                      </Text>
                      <Text
                        className="text-gray-600 mt-2 text-lg"
                        style={{ maxWidth: 300 }}
                      >
                        What should we call you?
                      </Text>
                    </View>
                  </View>
                </View>
              </View>

              <View className="space-y-4 gap-y-10 pt-10 w-80 self-center">
                <View>
                  <Text className="text-gray-700 mb-1 font-extrabold">
                    First Name
                  </Text>
                  <ThemedTextInput
                    value={firstName}
                    onChangeText={(t: string) => {
                      setFirstName(t);
                      if (firstNameError) setFirstNameError(null);
                    }}
                    placeholderTextColor="gray"
                    className={`h-11 ${firstNameError ? "border border-red-500" : ""}`}
                    secureTextEntry={false}
                    placeholder="Your first name"
                  />
                  {firstNameError ? (
                    <Text className="text-red-600 text-xs mt-1">
                      {firstNameError}
                    </Text>
                  ) : null}
                </View>

                <View>
                  <Text className="text-gray-700 mb-1 font-extrabold">
                    Last Name
                  </Text>
                  <ThemedTextInput
                    value={lastName}
                    onChangeText={(t: string) => {
                      setLastName(t);
                      if (lastNameError) setLastNameError(null);
                    }}
                    placeholderTextColor="gray"
                    className={`h-11 ${lastNameError ? "border border-red-500" : ""}`}
                    secureTextEntry={false}
                    placeholder="Your last name"
                  />
                  {lastNameError ? (
                    <Text className="text-red-600 text-xs mt-1">
                      {lastNameError}
                    </Text>
                  ) : null}
                </View>

                {/* Error message */}
                {formError && (
                  <Text className="text-red-600 text-sm">{formError}</Text>
                )}

                <ThemedPressable
                  label="Continue"
                  onPress={handlePressed}
                  className="mt-18 w-80 self-center bg-brand"
                />
              </View>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
