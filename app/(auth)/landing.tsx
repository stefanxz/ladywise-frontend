import { ThemedPressable } from '@/components/ThemedPressable/ThemedPressable';
import { useRouter } from 'expo-router';
import React from 'react';
import { Image, ImageBackground, Pressable, Text, View } from 'react-native';
import '../../assets/styles/main.css';

const logoApp = require("../../assets/images/Elegant-Ladybug-Woman-Logo-Design2.png");
const backgroundPart1 = require("../../assets/images/LandingPage-background-part1.png");
const backgroundPart2 = require("../../assets/images/LandingPage-background-part2.png");


const LandingPage = () => {
  const router = useRouter();

  // Navigation logic to registration page.
  const handleGetStarted = () => {
    router.push('/register');
  };

  // Navigation logic to login page.
  const handleLogin = () => {
    router.push('../login');
  };

    return (
      <View className="flex-1 flex-col">
        {/* Top 55% of the screen holds the Brand Header on a white background. */}
        <View className="flex-[0.55] justify-center bg-[#FFFFFF]">
          <Image source={logoApp} className="w-64 h-64 mx-auto" />
          <Text className="text-4xl font-aclonica-regular text-brand mx-auto">
            LadyWise
          </Text>
          <Text
            className="text-gray-600 mx-auto"
            style={{ maxWidth: 190, textAlign: "center" }}
          >
            Your personal companion for menstrual health insights.
          </Text>
        </View>

        {/* Bottom 45% of the screen for the wave image backgrounds and action buttons. */}
        <View className="flex-[0.45] w-full bg-[#FFFFFF] justify-center">
          <ImageBackground source={backgroundPart1} resizeMode="stretch"  className="absolute inset-0">
            {/* This 25% section acts as vertical padding above the smaller waves. */}
            <View className="flex-[0.25] w-full">

            </View>
            {/* The remaining 75% section holds the second wave image and the AuthActions component. */}
            <View className="flex-[0.75] w-full ">
              <ImageBackground source={backgroundPart2} resizeMode="stretch" className="absolute inset-0" >
                {/* Pass the navigation functions as props to the presentational component */}
                <View className="flex-1 justify-center absolute bottom-24 left-0 right-0 items-center ">
                  <ThemedPressable
                    label="Register"
                    onPress={handleGetStarted}
                    loading={false}
                    disabled={false}
                    className="mt-18 w-80 self-center bg-brand"
                  />
                  <View className="flex-row items-center justify-center space-x-2 mt-4">
                    <Text className="text-gray-600">Already have an account? </Text>
                    <Pressable onPress={handleLogin}>
                      <Text className="text-[#A45A6B] font-body">Log In</Text>
                    </Pressable>
                  </View>
                </View>
              </ImageBackground>
            </View>
          </ImageBackground>
        </View>
    </View>
  );
};


export default LandingPage;
