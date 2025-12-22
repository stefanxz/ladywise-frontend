import { useAuth } from "@/context/AuthContext";
import { AppBar } from "@/components/AppBarBackButton/AppBarBackButton";
import { SocialSignOn } from "@/components/SocialSignOn/SocialSignOn";
import { ThemedPressable } from "@/components/ThemedPressable/ThemedPressable";
import { ThemedTextInput } from "@/components/ThemedTextInput/ThemedTextInput";
import { loginUser } from "@/lib/api";
import { isEmailValid } from "@/lib/validation";
import {
  incrementFailedLoginCount,
  resetFailedLoginCount,
} from "@/utils/asyncStorageHelpers";
import { Feather } from "@expo/vector-icons";
import { isAxiosError } from "axios";
import { useRouter, useLocalSearchParams } from "expo-router";
import React, { useState, useEffect } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  View,
  Keyboard,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

/**
 * LoginScreen
 *
 * Screen component that allows users to authenticate with their email and password.
 * Handles form validation, credential submission, and error feedback.
 *
 * @returns {JSX.Element} The rendered login screen
 */
export default function LoginScreen() {
  const router = useRouter();
  const { signIn } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [emailError, setEmailError] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { passwordReset } = useLocalSearchParams<{ passwordReset?: string }>();
  const showPasswordResetBanner = passwordReset === "true";

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

  const handleLogin = async () => {
    setEmailError(null);
    setFormError(null);

    if (!email.trim()) {
      setEmailError("Please enter your email.");
      return;
    }
    if (!isEmailValid(email)) {
      setEmailError("Please enter a valid email address.");
      return;
    }
    if (password.trim().length === 0) {
      setFormError("Please enter your password.");
      return;
    }

    try {
      setIsSubmitting(true);
      const loginResponse = await loginUser({
        email: email.trim(),
        password: password.trim(),
      });

      await resetFailedLoginCount();
      // Update session context immediately so navigation switches to the main stack.

      await signIn(
        loginResponse.token,
        loginResponse.userId,
        loginResponse.email,
      );

      router.replace("/(main)/home");
    } catch (error) {
      await incrementFailedLoginCount();
      let message = "We couldn't log you in. Please try again.";

      if (isAxiosError(error)) {
        // Normalize API/network failures into human-readable messages.
        const { response, code } = error;
        const status = response?.status;
        if (status === 401) {
          message = "Invalid email or password";
        } else if (!response || code === "ERR_NETWORK" || status === 404) {
          message =
            "We couldn't reach the server. Please check your connection.";
        } else if (typeof response?.data === "string") {
          message = response.data;
        }
      }
      setFormError(message);
      console.error("Login error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
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
          <SafeAreaView className="flex-1 bg-background">
            {/* Back Button */}
            <View
              className="w-full bg-gray-50"
              style={{ zIndex: 10, elevation: 10 }}
            >
              <AppBar />
            </View>

            {/* Main content container */}
            <View className="w-full max-w-md px-6 pt-10 self-center">
              {/* Welcome Section */}
              <View className="items-start px-10 pt-12 mb-5">
                <Text className="text-3xl font-bold text-brand text-left">
                  Welcome Back 🌸
                </Text>
                <Text
                  className="text-gray-600 text-lg leading-snug text-left mt-2 max-w-xs"
                  numberOfLines={2}
                >
                  Log in to continue your journey with{" "}
                  <Text className="text-brand font-aclonica-regular">
                    LadyWise
                  </Text>
                  .
                </Text>

                {showPasswordResetBanner && (
                  <View className="mt-3">
                    <Text className="text-green-700 text-sm">
                      Your password has been updated. Please log in.
                    </Text>
                  </View>
                )}
              </View>

              {/* Form Section */}
              <View className="gap-y-8 w-80 self-center">
                {/* Email */}
                <View>
                  <Text className="text-gray-700 mb-1 font-extrabold">
                    Email
                  </Text>
                  <ThemedTextInput
                    value={email}
                    onChangeText={(t: string) => {
                      setEmail(t);
                      if (emailError) setEmailError(null);
                      if (formError) setFormError(null);
                    }}
                    placeholder="Your email"
                    placeholderTextColor="gray"
                    secureTextEntry={false}
                    className={`h-11 ${emailError ? "border border-red-500" : ""}`}
                    onBlur={() => {
                      if (email && !isEmailValid(email))
                        setEmailError("Please enter a valid email address.");
                    }}
                  />
                  {emailError && (
                    <Text className="text-red-600 text-xs mt-1">
                      {emailError}
                    </Text>
                  )}
                </View>

                {/* Password */}
                <View>
                  <Text className="text-gray-700 mb-1 font-extrabold">
                    Password
                  </Text>
                  <View className="relative">
                    <ThemedTextInput
                      value={password}
                      onChangeText={(value: string) => {
                        setPassword(value);
                        if (formError) setFormError(null);
                      }}
                      placeholder="Your password"
                      placeholderTextColor="gray"
                      secureTextEntry={!showPw}
                      className="h-11 pr-12"
                    />
                    <Pressable
                      onPress={() => setShowPw((v) => !v)}
                      hitSlop={12}
                      className="absolute right-3 top-0 bottom-0 justify-center"
                    >
                      <Feather
                        name={showPw ? "eye-off" : "eye"}
                        size={20}
                        color="#6B7280"
                      />
                    </Pressable>
                  </View>

                  <Pressable
                    className="self-end mt-3"
                    hitSlop={6}
                    onPress={() => router.push("/(auth)/password_recovery")}
                  >
                    <Text className="text-sm font-medium text-brand">
                      Forgot password?
                    </Text>
                  </Pressable>
                </View>

                {/* Error message */}
                {formError && (
                  <Text className="text-red-600 text-sm">{formError}</Text>
                )}

                {/* Log In Button */}
                <ThemedPressable
                  label="Log In"
                  onPress={handleLogin}
                  disabled={
                    !isEmailValid(email) ||
                    password.trim().length === 0 ||
                    isSubmitting
                  }
                  loading={isSubmitting}
                  className="w-full bg-[#9B4F60]"
                />
              </View>

              {/* Bottom Section */}
              <SocialSignOn
                onPress={(provider) => {
                  {
                    /*TODO: Actual social media sign on*/
                  }
                  console.log("SSO pressed:", provider);
                }}
              />
            </View>
          </SafeAreaView>
        </ScrollView>
      </KeyboardAvoidingView>
    </>
  );
}
