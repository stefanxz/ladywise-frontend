import { Link } from 'expo-router';
import React from 'react';
import { Image, ImageBackground, Pressable, Text, View } from 'react-native';
import '../../assets/styles/main.css';

const logoApp = require("../../assets/images/Elegant-Ladybug-Woman-Logo-Design2.png");

const backgroundPart1 = require("../../assets/images/LandingPage-background-part1.png");
const backgroundPart2 = require("../../assets/images/LandingPage-background-part2.png");

const landingPage = () => {
  return (
    <View className="flex-1 flex-col">
      <View className="h-[55%] w-full bg-white">
        <Image source={logoApp} className="w-64 h-64 mx-auto mt-20"/>
        <Text className="text-Dusty-Rose text-[36px] font-bold text-center">
          LadyWise
        </Text>
        <Text className="text-black text-[16px] text-center">
          Your personal companion for
        </Text>
        <Text className="text-black text-[16px] text-center">
          menstrual health insights.
        </Text>
      </View>
      <View className="h-[45%] w-full bg-white">
        <ImageBackground source={backgroundPart1} resizeMode="stretch"  className="absolute inset-0 w-full h-full">
          <View className="h-1/4 w-full">

          </View>
          <View className="h-3/4 w-full">
            <ImageBackground source={backgroundPart2} resizeMode="stretch" className="absolute inset-0" >
              <View className="absolute bottom-24 left-0 right-0 items-center">
                <Link href="../registrationPage/" className="mx-auto" asChild>
                  <Pressable className="h-[40px] w-[350px] rounded-2xl justify-center bg-Dusty-Rose p-1.5">
                    <Text className="text-white text-base font-bold text-[16px] text-center p-1">
                      Get Started
                    </Text>
                  </Pressable>
                </Link>
                <View className="flex-row items-center justify-center space-x-2 mt-4">
                  <Text className="text-black text-base text-[16px]">
                    Already have an account?
                  </Text>
                  <Link href="../loginPage/" asChild>
                    <Text className="text-Dusty-Rose text-base font-bold">
                      Log In
                    </Text>
                  </Link>
                </View>
              </View>
            </ImageBackground>
          </View>
        </ImageBackground>
      </View>
    
    
    
    
    
    
    {/* <View className="flex-1 bg-white">
      <View className="flex-3 bg-white">
        <Image source={logoApp} className="w-64 h-64 mx-auto mt-20"/>
      </View>
      {/* <View className="absolute bottom-12 w-full items-center z-30 px-5">
        <Link  href="../registrationPage/" className="mx-auto" asChild>
          <Pressable className="h-[40px] w-[350px] absolute bottom-24 rounded-2xl justify-center bg-Dusty-Rose p-1.5">
            <Text className="text-white text-base font-bold text-center">Register</Text>
          </Pressable>
        </Link>
      </View>
      <View className="flex-1">
        <ImageBackground source={backgroundPart1} className="w-full h-auto" >
          <Image source={backgroundPart2} className="w-full h-auto"/>
        </ImageBackground>
      </View> */}




      {/* <Text className="text-black text-[42px] font-bold text-center mb-[120px]"> 
        Welcome to Ladywise!
      </Text>
      <Link href="../loginPage/" className="mx-auto" asChild>
        <Pressable className="h-[40px] w-[350px] rounded-2xl justify-center bg-Dusty-Rose p-1.5 mb-5">
          <Text className="text-white text-base font-bold text-center p-1">Log In</Text>
        </Pressable>
      </Link>
      <Link  href="../registrationPage/" className="mx-auto" asChild>
        <Pressable className="h-[60px] w-[350px] rounded-2xl justify-center bg-white p-1.5 mb-5">
          <Text className="text-white text-base font-bold text-center p-3">Register</Text>
        </Pressable>
      </Link> */}
    </View>

  )
}


export default landingPage


{/* <Text className="text-black text-base text-[16px] text-center p-1">
                            Already have an account?
                          </Text>
                          <Link  href="../loginPage/" className="mx-auto" asChild>
                            <Text className="text-Dusty-Rose text-base font-bold text-center p-3">Log In</Text>
                          </Link> */}