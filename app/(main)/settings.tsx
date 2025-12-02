import { useAuth } from "@/context/AuthContext";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ThemedPressable } from "@/components/ThemedPressable/ThemedPressable";
import React from "react";
import { Feather } from "@expo/vector-icons";

export default function SettingsScreen() {
  const { signOut } = useAuth();

  const handleLogout = () => {
    signOut();
    // auth layout should redirect automatically
  };
  return (
    <>
      <SafeAreaView className="flex-1 bg-background">
        {/* Settings content */}
        <ScrollView className="flex-1 px-4 pt-10 w-full">
          <Text className="text-3xl font-bold text-headingText mb-6">
            Settings
          </Text>

          {/* Setting Cards
          TODO: move to separate component, render settings dynamically?
          */}
          <View>
            <Text className="text-sm text-inactiveText pb-2 font-bold">
              Account Settings
            </Text>

            <View className="bg-white rounded-2xl shadow-sm px-4 mb-6">
              {[
                { name: "Profile", icon: "user" },
                { name: "Account", icon: "settings" },
                { name: "Notifications", icon: "bell" },
                { name: "Questions", icon: "help-circle" },
              ].map((item, index, array) => (
                <View key={item.name}>
                  <TouchableOpacity className="flex-row items-center justify-between py-4">
                    <View className="flex-row items-center">
                      <Feather
                        name={item.icon}
                        size={20}
                        className="text-regularText"
                      />
                      <Text className="ml-3 text-base font-medium text-regularText">
                        {item.name}
                      </Text>
                    </View>

                    <Feather
                      name="chevron-right"
                      size={20}
                      className="text-lightGrey"
                    />
                  </TouchableOpacity>

                  {index < array.length - 1 && (
                    <View className="h-[1px] bg-gray-100 w-full" />
                  )}
                </View>
              ))}
            </View>
          </View>

          <View>
            <Text className="text-sm text-inactiveText pb-2 font-bold">
              Other Settings
            </Text>

            <View className="bg-white rounded-2xl shadow-sm px-4 mb-6">
              {[
                { name: "Privacy Policy", icon: "book-open" },
                { name: "Rate Us", icon: "star" },
              ].map((item, index, array) => (
                <View key={item.name}>
                  <TouchableOpacity className="flex-row items-center justify-between py-4">
                    <View className="flex-row items-center">
                      <Feather
                        name={item.icon}
                        size={20}
                        className="text-regularText"
                      />
                      <Text className="ml-3 text-base font-medium text-regularText">
                        {item.name}
                      </Text>
                    </View>

                    <Feather
                      name="chevron-right"
                      size={20}
                      className="text-lightGrey"
                    />
                  </TouchableOpacity>

                  {index < array.length - 1 && (
                    <View className="h-[1px] bg-gray-100 w-full" />
                  )}
                </View>
              ))}
            </View>
          </View>

          {/* Log Out */}
          <ThemedPressable
            label="Log Out"
            onPress={handleLogout}
            testID="log-out-button"
            loading={false}
            disabled={false}
          />
        </ScrollView>
      </SafeAreaView>
    </>
  );
}
