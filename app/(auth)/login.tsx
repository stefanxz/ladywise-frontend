import { AppBar } from "@/components/AppBarBackButton/AppBarBackButton";
import { SocialSignOn } from "@/components/SocialSignOn/SocialSignOn";
import { ThemedPressable } from "@/components/ThemedPressable/ThemedPressable";
import { ThemedTextInput } from "@/components/ThemedTextInput/ThemedTextInput";
import { isEmailValid } from "@/lib/validation";
import {
  incrementFailedLoginCount,
  resetFailedLoginCount,
} from "@/utils/asyncStorageHelpers";
import { Feather } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [emailError, setEmailError] = useState<string | null>(null);

  const handleLogin = async () => {
    // Reset any existing error
    setEmailError(null);

    // Validation checks
    if (!email.trim()) {
      setEmailError("Please enter your email.");
      return;
    }
    if (!isEmailValid(email)) {
      setEmailError("Please enter a valid email address.");
      return;
    }
    if (password.trim().length === 0) return;

    try {
      // TODO: Replace with actual API call later
      const isLoginSuccessful = false; // placeholder for now

      if (isLoginSuccessful) {
        await resetFailedLoginCount();
      } else {
        await incrementFailedLoginCount();
      }
    } catch (error) {
      await incrementFailedLoginCount();
      console.error("Login error:", error);
    }
  };

  return (
    <>
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

            {/* Main content container */}
            <View className="flex-1 justify-between pt-12 mb-5">
              {/* Welcome Section */}
              <View className="px-16">
                <Text className="text-3xl font-bold text-brand text-left">
                  Welcome Back 🌸
                </Text>
                <Text
                  className="text-gray-600 text-lg leading-snug text-left mt-2 w-72"
                  numberOfLines={2}
                >
                  Log in to continue your journey with{" "}
                  <Text className="text-brand font-aclonica-regular">
                    LadyWise
                  </Text>
                  .
                </Text>
              </View>

              {/* Form Section */}
              <View className="gap-y-8 w-full px-16 self-center">
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
                  <View className="flex-row items-center">
                    <ThemedTextInput
                      value={password}
                      onChangeText={setPassword}
                      placeholder="Your password"
                      placeholderTextColor="gray"
                      secureTextEntry={!showPw}
                      className="flex-1 h-11"
                    />
                    <Pressable
                      onPress={() => setShowPw((v) => !v)}
                      hitSlop={12}
                      className="px-3"
                    >
                      <Feather
                        name={showPw ? "eye-off" : "eye"}
                        size={20}
                        color="#6B7280"
                      />
                    </Pressable>
                  </View>

                  <Pressable className="self-end mt-1" hitSlop={6}>
                    <Text className="text-xs font-medium text-brand">
                      Forgot password?
                    </Text>
                  </Pressable>
                </View>

                {/* Log In Button */}
                <ThemedPressable
                  label="Log In"
                  onPress={handleLogin}
                  disabled={
                    !isEmailValid(email) || password.trim().length === 0
                  }
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
