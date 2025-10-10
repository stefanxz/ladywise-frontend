import { ThemedPressable } from '@/components/ThemedPressable/ThemedPressable';
import { useRouter } from 'expo-router';
import React from 'react';
import { Image, ImageBackground, Pressable, Text, View } from 'react-native';

import logotest from '../../assets/images/Elegant-Ladybug-Woman-Logo-Design2.png';
import backgroundPart1 from '../../assets/images/LandingPage-background-part1.png';
import backgroundPart2 from '../../assets/images/LandingPage-background-part2.png';


const LandingPage = () => {
  const router = useRouter();

  // Navigation logic to registration page.
  const handleGetStarted = () => {
    router.push('/register');
  };

  // Navigation logic to login page.
  const handleLogin = () => {
    router.push('/login');
  };

    return (
      <View className="flex-1 flex-col">
        {/* Top section with logo */}
        <View className="flex-[0.55] justify-center bg-background">
          <Image source={logotest} className="w-168 h-168 mx-auto" />
          <Text className="text-4xl font-aclonica-regular text-brand mx-auto">
            LadyWise
          </Text>
          <Text
            className="max-w-[250px] font-inter-regular text-base text-center text-regularText mx-auto mt-4"
          >
            Your personal companion for menstrual health insights.
          </Text>
        </View>

        {/* Bottom section with button and link */}
        <View className="flex-[0.45] w-full bg-background justify-center">
          <ImageBackground source={backgroundPart1} resizeMode="stretch"  className="absolute inset-0  bg-background">
            {/* Vertical padding */}
            <View className="flex-[0.25] w-full">

            </View>
            <View className="flex-[0.75] w-full ">
              <ImageBackground source={backgroundPart2} resizeMode="stretch" className="absolute inset-0" >
                <View className="flex-1 justify-center absolute bottom-24 left-0 right-0 items-center ">
                  <ThemedPressable
                    label="Get Started"
                    onPress={handleGetStarted}
                    loading={false}
                    disabled={false}
                    className="h-11 w-[327px] mt-18 self-center bg-brand rounded-2xl"
                  />
                  <View className="flex-row items-center justify-center space-x-2 mt-4">
                    <Text className="text-regularText">Already have an account? </Text>
                    <Pressable onPress={handleLogin}>
                      <Text className="text-brand font-inter-semibold">Log In</Text>
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
