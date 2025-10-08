import React from 'react';
import { Pressable, Text } from 'react-native';
import '../../../assets/styles/main.css';
import { ButtonProps } from './Button.types';

const Button: React.FC<ButtonProps> = ({ title, onPress }) => {
  return (
    <Pressable
      onPress={onPress}
      className="h-[40px] w-[350px] rounded-2xl justify-center bg-[#A45A6B] p-1.5">
      <Text className="text-[#FFFFFF] font-body text-center p-1">
        {title}
      </Text>
    </Pressable>
  );
};

export default Button;