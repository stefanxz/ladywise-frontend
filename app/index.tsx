import { router } from "expo-router";
import React from "react";
import { Text, View } from "react-native";
import "../assets/styles/main.css";
import { ThemedPressable } from "../components/Pressable/ThemedPressable";

export default function Index() {
  return (
    <View className="flex flex-col items-center justify-center h-screen overflow-y-scroll  bg-red-300 p-4">
      <Text className="font-semibold text-xl my-10">
        Welcome to LadyWise Appication
      </Text>
      <Text className="font-semibold text-xl m-5">
        Login
      </Text>
      <ThemedPressable className="my-4" label="Register" onPress={() => router.push('/Register') } />
    </View>

  );
}
