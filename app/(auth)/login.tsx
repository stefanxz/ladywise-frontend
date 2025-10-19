import { AppBar } from "@/components/AppBarBackButton/AppBarBackButton";
import { ThemedPressable } from "@/components/ThemedPressable/ThemedPressable";
import { ThemedTextInput } from "@/components/ThemedTextInput/ThemedTextInput";
import { isEmailValid } from "@/lib/validation";
import { Feather } from "@expo/vector-icons";
import { Stack, useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { SocialSignOn } from "@/components/SocialSignOn/SocialSignOn";
import * as SecureStore from "expo-secure-store";

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [emailError, setEmailError] = useState<string | null>(null);
  const [loginError, setLoginError] = useState<string | null>(null); // For backend errors
  // Initialize the router for navigation.
  const router = useRouter();

  const handleLogin = async () => {
    // Reset client-side and server-side errors
    setEmailError(null);
    setLoginError(null);

    //Client-Side Validation
    if (!email.trim()) {
      setEmailError("Please enter your email.");
      return;
    }
    if (!isEmailValid(email)) {
      setEmailError("Please enter a valid email address.");
      return;
    }
    if (password.trim().length === 0) {
      // This case is handled by the disabled button, but good to have
      return;
    }

    // Backend Authentication
    try {
      // Send login credentials to the backend API.
      const response = await fetch("http://localhost:8080/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email.trim(),
          password: password,
        }),
      });

      // If login is successful (HTTP 200-299), process the response.
      if (response.ok) {
        const data = await response.json();
        console.log("Login successful:", data);

        // Securely store the authentication token on the device.
        await SecureStore.setItemAsync("userToken", data.token);

        // Navigate to the main part of the app, replacing the login screen in the history
        // so the user cannot press the back button to return to it.
        router.replace("/(tabs)");
      } else {
        // If the server returns an error (e.g., 401 Unauthorized), display it.
        const errorText = await response.text();
        setLoginError(errorText || "An unknown error occurred during login.");
      }
    } catch (error) {
      // Handle network errors or other exceptions during the fetch call.
      console.error("Login failed:", error);
      setLoginError("Could not connect to the server. Please try again later.");
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
          contentContainerStyle={{ flexGrow: 1, justifyContent: "center" }}
          keyboardShouldPersistTaps="handled"
        >
          <SafeAreaView className="flex-1 bg-background px-6">
            {/* Back Button */}
            <View className="pt-4">
              <AppBar />
            </View>

            {/* Main content container */}
            <View className="flex-1 justify-between pt-12 pb-10">
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
              <View className="space-y-4 mt-6 w-full px-16 self-center">
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
                      if (loginError) setLoginError(null); // Also clear login error
                    }}
                    placeholder="Your email"
                    placeholderTextColor="gray"
                    secureTextEntry={false}
                    className={`h-11 ${
                      emailError || loginError ? "border border-red-500" : ""
                    }`} // Highlight on login error too
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
                      onChangeText={(t: string) => {
                        setPassword(t);
                        if (loginError) setLoginError(null); // Also clear login error
                      }}
                      placeholder="Your password"
                      placeholderTextColor="gray"
                      secureTextEntry={!showPw}
                      className={`flex-1 h-11 ${
                        loginError ? "border border-red-500" : ""
                      }`} // Highlight on login error too
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

                {/* Display Login Error */}
                {loginError && (
                  <Text className="text-red-600 text-sm text-center">
                    {loginError}
                  </Text>
                )}

                {/* Log In Button */}
                <ThemedPressable
                  label="Log In"
                  onPress={handleLogin}
                  disabled={
                    !isEmailValid(email) || password.trim().length === 0
                  }
                  className="mt-6 w-full bg-[#9B4F60]"
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
