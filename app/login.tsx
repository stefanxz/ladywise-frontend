import AppBar from "@/components/ThemedPressable/appbar-backbutton";
import { Feather } from "@expo/vector-icons";
import { Stack, useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import appleIcon from "../assets/images/apple-icon.png";
import facebookIcon from "../assets/images/facebook-icon.png";
import googleIcon from "../assets/images/google-icon.png";

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const router = useRouter();
  // validate only after user interaction
  const [emailTouched, setEmailTouched] = useState(false);
  const isValidEmail = (value: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
  const showEmailError =
    emailTouched && email.length > 0 && !isValidEmail(email);
  // optional: gate submit; still validate on press
  const handleLogin = () => {
    setEmailTouched(true);               // ensure we validate if user never blurred
    if (!isValidEmail(email)) return;    // stop here if invalid
    console.log("Log in pressed");       // continue with your flow
  };


  const validateEmail = (text: string) => {
    setEmail(text);
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (text && !emailRegex.test(text)) {
      Alert.alert("Invalid email", "Please enter a valid email address.");
    }
  };

  return (
    <>

      <Stack.Screen options={{ headerShown: false, title: "Log In" }} />

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1 bg-[#FDFBFB]"
      >
        <ScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          keyboardShouldPersistTaps="handled"
        >
          <View className="flex-1 justify-between px-6 pt-8 pb-6">
            {/* Back Arrow */}
            <Pressable
              onPress={() => router.push("/landing")}
              className="absolute top-10 left-6 z-10"
            >
              <Feather name="arrow-left" size={24} color="#6B7280" />
            </Pressable>

            {/* Top Section */}
            <View className="mt-28 mb-8">
              <Text className="text-2xl font-bold text-[#9B4F60] text-left">
                Welcome Back 🌸
              </Text>
              <Text
                className="text-gray-500 text-left mt-2 leading-5 w-72"
                numberOfLines={2}
              >
                Log in to continue your journey with{" "}
                <Text className="text-[#9B4F60] font-semibold">LadyWise.</Text>
              </Text>
            </View>
          </View>
      <SafeAreaView className="flex-1 bg-[#FDFBFB] px-6">
        <AppBar />
        <View className="mt-8 gap-6">

            {/* Form Section */}
            <View className="gap-6">
              {/* Email */}
              <View className="gap-2">
                <Text className="text-sm font-medium text-gray-700">Email</Text>
                <View
                  className={`rounded-2xl bg-white/90 shadow-sm ${
                    showEmailError ? "border border-rose-400" : ""
                  }`}
                >
                  <TextInput
                    className="px-4 py-4 text-base text-gray-900"
                    placeholder="your email"
                    placeholderTextColor="#9CA3AF"
                    keyboardType="email-address"
                    inputMode="email"
                    textContentType="emailAddress"
                    autoCapitalize="none"
                    autoCorrect={false}
                    value={email}
                    onChangeText={setEmail}        // no validation here
                    onBlur={() => setEmailTouched(true)}  // validate when leaving the field
                    testID="email-input"
                  />
                </View>
                {showEmailError && (
                  <Text className="mt-1 text-xs text-rose-500">
                    Please enter a valid email address.
                  </Text>
                )}
              </View>

              {/* Password */}
              <View className="gap-2">
                <Text className="text-sm font-medium text-gray-700">
                  Password
                </Text>
                <View className="flex-row items-center rounded-2xl bg-white/90 shadow-sm">
                  <TextInput
                    className="flex-1 px-4 py-4 text-base text-gray-900"
                    placeholder="your password"
                    placeholderTextColor="#9CA3AF"
                    autoCapitalize="none"
                    secureTextEntry={!showPw}
                    value={password}
                    onChangeText={setPassword}
                  />
                  <Pressable
                    onPress={() => setShowPw((v) => !v)}
                    hitSlop={12}
                    className="px-4"
                  >
                    <Feather
                      name={showPw ? "eye-off" : "eye"}
                      size={20}
                      color="#6B7280"
                    />
                  </Pressable>
                </View>

                <Pressable
                  className="self-end mt-1"
                  hitSlop={6}
                  // onPress={() => router.push("/password-recovery")}
                >
                  <Text className="text-xs font-medium text-[#9B4F60]">
                    Forgot password?
                  </Text>
                </Pressable>
              </View>
            </View>

            {/* Log In Button */}
            <Pressable
              className={`bg-[#9B4F60] rounded-full py-4 mt-6 w-full ${
                !isValidEmail(email) ? "opacity-50" : ""
              }`}
              onPress={handleLogin}
              disabled={!isValidEmail(email)}   
            >
              <Text className="text-white text-center font-semibold text-base">
                Log In
              </Text>
            </Pressable>

            {/* Divider and Social Icons */}
            <View className="mt-8">
              <View className="flex-row items-center justify-center mb-4">
                <View className="h-px bg-gray-300 w-1/4" />
                <Text className="text-gray-400 text-sm mx-3">or log in with</Text>
                <View className="h-px bg-gray-300 w-1/4" />
              </View>

              <View
                className="flex-row justify-center mt-4"
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
        {/* Primary action (visual only for these tasks) */}
        <Pressable
          className="bg-[#9B4F60] rounded-full py-4 mt-6 w-full"
          onPress={() => console.log("Log in pressed")}
        >
          <Text className="text-white text-center font-semibold text-base">
            Log In
          </Text>
        </Pressable>
      </SafeAreaView>
      </ScrollView>
      </KeyboardAvoidingView>
    </>
  );
}
