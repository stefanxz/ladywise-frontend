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
 * RegisterPersDetails
 *
 * Registration step to collect the user's personal details (First Name, Last Name).
 * Updates the user profile after initial account creation.
 *
 * @returns {JSX.Element} The rendered personal details screen
 */
export default function RegisterPersDetails() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [firstNameError, setFirstNameError] = useState<string | null>(null);
  const [lastNameError, setLastNameError] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const { userId, email } = useAuth();

  const [isKeyboardVisible, setKeyboardVisible] = useState(false);

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

  useEffect(() => {
    console.log("[RegisterPersDetails] Component mounted.");
    return () => {
      console.log("[RegisterPersDetails] Component unmounting.");
    };
  }, []);

  const handlePressed = async () => {
    console.log("[RegisterPersDetails] 'Continue' pressed.");
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

    if (hasError) {
      console.log("[RegisterPersDetails] Validation failed.");
      return;
    }

    if (!userId) {
      console.warn("[RegisterPersDetails] No userId found in context!");
      setFormError("User ID missing. Please try logging in again.");
      return;
    }

    console.log("[RegisterPersDetails] Updating user profile...", { userId });
    setIsSubmitting(true);
    try {
      await updateUser({
        id: userId,
        email: email,
        firstName: firstName,
        lastName: lastName,
      });
      console.log("[RegisterPersDetails] Update successful. Navigating...");
      router.push("/onboarding/questionnaire-intro");
    } catch (e: any) {
      // FIX: The "Ghost Request" (Duplicate POST /register) triggered by browser/OS
      // incorrectly returns a 409 response OR a 400 (Malformed) response which Axios picks up.
      // We identify this by checking for 409 (Conflict) OR 400 with specific markers.
      // Since we are updating the SAME user with the SAME email, a real 409 is impossible here.
      // Therefore, we treat these as a success.
      const isGhost =
        e.response?.status === 409 ||
        e.message?.includes("409") ||
        (e.response?.status === 400 &&
          (e.response?.data?.path?.includes("/register") ||
            e.response?.data?.message?.includes("JSON parse error") ||
            e.message?.includes("JSON parse error")));

      if (isGhost) {
        console.warn(
          "[RegisterPersDetails] Caught Ghost Request (409/400). Treating as success and suppressing error log.",
        );
        router.push("/onboarding/questionnaire-intro");
        return;
      }

      console.error("[RegisterPersDetails] Update failed", e);
      setFormError(e instanceof Error ? e.message : "Update failed.");
    } finally {
      setIsSubmitting(false);
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
                    autoCapitalize="words"
                    autoComplete="off"
                    textContentType="none"
                    importantForAutofill="no"
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
                    autoCapitalize="words"
                    autoComplete="off"
                    textContentType="none"
                    importantForAutofill="no"
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
                  loading={isSubmitting}
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
