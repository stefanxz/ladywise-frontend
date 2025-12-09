import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { type Theme } from "@/lib/themes";

// Prop types for the component
type HeaderProps = {
  name: string;
  onHelpPress: () => void;
  theme: Theme;
};

const Header: React.FC<HeaderProps> = ({ name, onHelpPress, theme }) => {
  return (
    <View className="flex-row justify-between items-center px-5 pt-2.5 pb-5 w-full">
      {/* Avatar and Greeting */}
      <View className="flex-row items-center">
        <View className="flex-col">
          <Text className="text-base text-gray-500">Hello,</Text>
          <Text className="text-xl font-bold text-black">{name}</Text>
        </View>
      </View>

      <TouchableOpacity
        onPress={onHelpPress}
        className="w-8 h-8 rounded-full bg-gray-100 justify-center items-center"
        style={{ backgroundColor: theme.highlight }}
      >
        <Text
          className="text-lg fond-bold text-gray-800"
          style={{ color: theme.highlightTextColor }}
        >
          ?
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default Header;
