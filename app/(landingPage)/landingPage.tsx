import { useRouter } from 'expo-router';
import React from 'react';
import { Image, ImageBackground, Text, View } from 'react-native';
import '../../assets/styles/main.css';
import AuthActions from '../../src/components/AuthActions';

const logoApp = require("../../assets/images/Elegant-Ladybug-Woman-Logo-Design2.png");
const backgroundPart1 = require("../../assets/images/LandingPage-background-part1.png");
const backgroundPart2 = require("../../assets/images/LandingPage-background-part2.png");


const LandingPage = () => {
  const router = useRouter();

  // Navigation logic to registration page.
  const handleGetStarted = () => {
    router.push('../registrationPage/');
  };

  // Navigation logic to login page.
  const handleLogin = () => {
    router.push('../loginPage/');
  };

    return (
      <View className="flex-1 flex-col">
        {/* Top 55% of the screen holds the Brand Header on a white background. */}
        <View className="h-[55%] w-full bg-[#FFFFFF]">
          <View>
            <Image source={logoApp} className="w-64 h-64 mx-auto mt-20" />
            <Text className="text-[#A45A6B] text-[36px] font-heading text-center">
              LadyWise
            </Text>
            <Text className="text-black text-[16px] font-body text-center">
              Your personal companion for
            </Text>
            <Text className="text-black text-[16px] font-body text-center">
              menstrual health insights.
            </Text>
          </View>
        </View>
        {/* Bottom 45% of the screen for the wave image backgrounds and action buttons. */}
        <View className="h-[45%] w-full bg-[#FFFFFF]">
          <ImageBackground source={backgroundPart1} resizeMode="stretch"  className="absolute inset-0">
            {/* This 25% section acts as vertical padding above the smaller waves. */}
            <View className="h-[25%] w-full">

            </View>
            {/* The remaining 75% section holds the second wave image and the AuthActions component. */}
            <View className="h-[75%] w-full">
              <ImageBackground source={backgroundPart2} resizeMode="stretch" className="absolute inset-0" >
                {/* Pass the navigation functions as props to the presentational component */}
                <AuthActions onGetStarted={handleGetStarted} onLogin={handleLogin} />
              </ImageBackground>
            </View>
          </ImageBackground>
        </View>
    </View>
  );
};


export default LandingPage;
