import React from 'react';
import { Pressable, Text, View } from 'react-native';
import '../../../assets/styles/main.css';
import { LinkProps } from './Link.types';

const Link: React.FC<LinkProps> = ({
  promptText,
  actionText,
  onPress,
}) => {
  return (
    <View className="flex-row items-center justify-center space-x-2 mt-4">
      <Text className="text-black font-body">{promptText}</Text>
      <Pressable onPress={onPress}>
        <Text className="text-[#A45A6B] font-body">{actionText}</Text>
      </Pressable>
    </View>
  );
};

export default Link;