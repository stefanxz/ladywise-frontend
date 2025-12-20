import { ThemedPressable } from "@/components/ThemedPressable/ThemedPressable";
import { useRouter } from "expo-router";
import React from "react";
import { Image, Platform, Pressable, Text, View } from "react-native";

// Assets
import logotest from "@/assets/images/Elegant-Ladybug-Woman-Logo-Design2.png";
import backgroundPart1 from "@/assets/images/LandingPage-background-part1.png";
import backgroundPart2 from "@/assets/images/LandingPage-background-part2.png";

/**
 * LandingPage
 *
 * The entry screen displayed when the application launches.
 * Provides navigation options for users to either register a new account
 * or log in to an existing one.
 *
 * @returns {JSX.Element} The rendered landing page
 */
export default function LandingPage() {
  const router = useRouter();

  // Navigate to the registration page
  const handleGetStarted = () => {
    router.push("/(auth)/register");
  };

  // Navigate to the login page
  const handleLogin = () => {
    router.push("/login");
  };

  return (
    <View className="flex-1 flex-col bg-background">
      {/* Top Section */}
      <View className="flex-[0.55] justify-center items-center px-6">
        <Image
          source={logotest}
          className="w-40 h-40 mb-3"
          resizeMode="contain"
        />
        <Text
          className="text-4xl font-aclonica-regular text-brand text-center"
          style={{
            flexShrink: 1,
            // Fix for Android text truncation bug
            paddingRight: Platform.OS === "android" ? 3 : 0,
          }}
        >
          LadyWise
        </Text>

        <Text
          className="max-w-[250px] font-inter-regular text-base text-center text-regularText mt-4 leading-snug"
          style={{
            paddingHorizontal: 8,
          }}
        >
          Your personal companion for menstrual health insights.
        </Text>
      </View>

      {/* Bottom Section */}
      <View className="flex-[0.45] w-full justify-center">
        <Image
          source={backgroundPart1}
          resizeMode="stretch"
          className="absolute bottom-0 w-full h-full"
        />
        <Image
          source={backgroundPart2}
          resizeMode="stretch"
          className="absolute bottom-0 w-full h-3/4"
        />
        <View className="absolute bottom-0 w-full items-center pb-24">
          <ThemedPressable
            label="Get Started"
            onPress={handleGetStarted}
            testID="get-started-button"
            loading={false}
            disabled={false}
            className="h-11 w-[327px] mt-18 self-center bg-brand rounded-2xl"
          />
          <View className="flex-row items-center justify-center space-x-2 mt-4">
            <Text className="text-regularText">Already have an account? </Text>
            <Pressable onPress={handleLogin} testID="login-button">
              <Text
                className="text-brand font-inter-semibold"
                style={{
                  // Fix for Android text truncation bug
                  paddingRight: Platform.OS === "android" ? 3 : 0,
                }}
              >
                Log In
              </Text>
            </Pressable>
          </View>
        </View>
      </View>
    </View>
  );
}
