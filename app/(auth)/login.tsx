import React from 'react';
import { Text, View } from 'react-native';
import '../../assets/styles/main.css';

const login = () => {
  return (
    <View className="flex-1 bg-white p-[60px]">
      <Text className="text-black text-[30px] font-bold text-center mb-[120px]"> 
        Login to your account
      </Text>
    </View>

  )
}


export default login