import { AppBar } from "@/components/AppBarBackButton/AppBarBackButton";
import { ThemedPressable } from "@/components/ThemedPressable/ThemedPressable";
import { ThemedTextInput } from "@/components/ThemedTextInput/ThemedTextInput";
import { Feather } from "@expo/vector-icons";
import { Stack, useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Image,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import appleIcon from "@/assets/images/apple-icon.png";
import facebookIcon from "@/assets/images/facebook-icon.png";
import googleIcon from "@/assets/images/google-icon.png";

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [emailTouched, setEmailTouched] = useState(false);
  const router = useRouter();

  const isValidEmail = (value: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
  const showEmailError =
    emailTouched && email.length > 0 && !isValidEmail(email);

  const handleLogin = () => {
    setEmailTouched(true);
    if (!isValidEmail(email) || password.trim().length === 0) return;
    console.log("Log in pressed");
  };

  return (
    <>
      <Stack.Screen options={{ headerShown: false, title: "Log In" }} />

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1 bg-[#FDFBFB]"
      >
        <ScrollView
          contentContainerStyle={{
            flexGrow: 1,
            justifyContent: "center",
          }}
          keyboardShouldPersistTaps="handled"
        >
          <SafeAreaView className="flex-1 bg-[#FDFBFB] px-6">
            {/* Back button */}
            <View className="pt-4">
              <AppBar />
            </View>

            {/* Main content container */}
            <View className="flex-1 justify-between pt-12 pb-10">
              {/* Welcome Section */}
              <View>
                <Text className="text-2xl font-bold text-[#9B4F60] text-left">
                  Welcome Back 🌸
                </Text>
                <Text
                  className="text-gray-500 text-left mt-2 leading-5 w-72"
                  numberOfLines={2}
                >
                  Log in to continue your journey with{" "}
                  <Text className="text-[#9B4F60] font-semibold">
                    LadyWise.
                  </Text>
                </Text>
              </View>

              {/* Form Section */}
              <View className="gap-5 mt-4">
                {/* Email */}
                <View>
                  <Text className="text-sm font-medium text-gray-700">
                    Email
                  </Text>
                  <ThemedTextInput
                    value={email}
                    onChangeText={(t: string) => {
                      setEmail(t);
                      if (showEmailError) setEmailTouched(false);
                    }}
                    placeholder="your email"
                    placeholderTextColor="#9CA3AF"
                    secureTextEntry={false}
                    className={`h-12 mt-1 ${
                      showEmailError ? "border border-rose-400" : ""
                    }`}
                    onBlur={() => setEmailTouched(true)}
                  />
                  {showEmailError && (
                    <Text className="text-xs text-rose-500 mt-1">
                      Please enter a valid email address.
                    </Text>
                  )}
                </View>

                {/* Password */}
                <View>
                  <Text className="text-sm font-medium text-gray-700">
                    Password
                  </Text>
                  <View className="flex-row items-center">
                    <ThemedTextInput
                      value={password}
                      onChangeText={setPassword}
                      placeholder="your password"
                      placeholderTextColor="#9CA3AF"
                      secureTextEntry={!showPw}
                      className="flex-1 h-12 mt-1"
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
                    <Text className="text-xs font-medium text-[#9B4F60]">
                      Forgot password?
                    </Text>
                  </Pressable>
                </View>

                {/* Log In Button */}
                <ThemedPressable
                  label="Log In"
                  onPress={handleLogin}
                  disabled={
                    !isValidEmail(email) || password.trim().length === 0
                  }
                  className="mt-6 w-full bg-[#9B4F60]"
                />
              </View>

              {/* Bottom Section */}
              <View className="mt-10">
                <View className="flex-row items-center justify-center mb-4">
                  <View className="h-px bg-gray-300 w-1/4" />
                  <Text className="text-gray-400 text-sm mx-3">
                    or log in with
                  </Text>
                  <View className="h-px bg-gray-300 w-1/4" />
                </View>

                <View
                  className="flex-row justify-center mt-2"
                  style={{ gap: 45 }}
                >
                  <Pressable>
                    <Image source={googleIcon} className="w-8 h-8" />
                  </Pressable>
                  <Pressable>
                    <Image source={facebookIcon} className="w-8 h-8" />
                  </Pressable>
                  <Pressable>
                    <Image source={appleIcon} className="w-8 h-8" />
                  </Pressable>
                </View>
              </View>
            </View>
          </SafeAreaView>
        </ScrollView>
      </KeyboardAvoidingView>
    </>
  );
}
