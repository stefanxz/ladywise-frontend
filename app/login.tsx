import { Feather } from "@expo/vector-icons";
import { Stack } from "expo-router";
import React, { useState } from "react";
import { Image, Pressable, Text, TextInput, View } from "react-native";
import ladybugLogo from "../assets/images/ladybug.png";

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);

  return (
    <>
      {/* Header is hidden for now; _layout can override this if needed. */}
      <Stack.Screen options={{ headerShown: false, title: "Log In" }} />

      <View className="flex-1 bg-[#FDFBFB] px-6">
        <View className="mt-8 gap-6">
          {/* Logo */}
          <View className="items-center mt-12 mb-8">
            <Image
              source={ladybugLogo}
              className="w-20 h-20 mb-3"
              resizeMode="contain"
            />
            <Text className="text-2xl font-bold text-[#9B4F60]">LadyWise</Text>
            <Text className="text-gray-500 text-center mt-1">
              Your personal companion for menstrual health insights.
            </Text>
          </View>

          {/* Email */}
          <View className="gap-2">
            <Text className="text-sm font-medium text-gray-700">Email</Text>
            <View className="rounded-2xl bg-white/90 shadow-sm">
              <TextInput
                className="px-4 py-4 text-base text-gray-900"
                placeholder="your email"
                placeholderTextColor="#9CA3AF"
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                value={email}
                onChangeText={setEmail}
                testID="email-input"
              />
            </View>
          </View>

          {/* Password */}
          <View className="gap-2">
            <Text className="text-sm font-medium text-gray-700">Password</Text>
            <View className="flex-row items-center rounded-2xl bg-white/90 shadow-sm">
              <TextInput
                className="flex-1 px-4 py-4 text-base text-gray-900"
                placeholder="your password"
                placeholderTextColor="#9CA3AF"
                autoCapitalize="none"
                secureTextEntry={!showPw}
                value={password}
                onChangeText={setPassword}
                testID="password-input"
              />

              <Pressable
                onPress={() => setShowPw((v) => !v)}
                hitSlop={12}
                className="px-4"
                accessibilityRole="button"
                accessibilityLabel={showPw ? "Hide password" : "Show password"}
                testID="toggle-password-visibility"
              >
                <Feather
                  name={showPw ? "eye-off" : "eye"}
                  size={20}
                  color="#6B7280"
                />
              </Pressable>
            </View>

            {/* UI only for now */}
            <Pressable className="self-end mt-2" hitSlop={6}>
              <Text className="text-xs text-gray-500">Forgot password?</Text>
            </Pressable>
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
      </View>
    </>
  );
}
