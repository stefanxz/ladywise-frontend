import { Link } from 'expo-router';
import React from 'react';
import { Pressable, Text, View } from 'react-native';
import '../../assets/styles/main.css';

const app = () => {
  return (
    <View className="flex-1 bg-pink-200 p-16">
      <Text className="text-black text-[42px] font-bold text-center mb-[120px]"> 
        Welcome to Ladywise!
      </Text>
      <Link href="/login" className="mx-auto" asChild>
        <Pressable className="h-[60px] w-[150px] rounded-2xl justify-center bg-black p-1.5 mb-5">
          <Text className="text-white text-base font-bold text-center p-1">Login</Text>
        </Pressable>
      </Link>
      <Link  href="/register" className="mx-auto" asChild>
        <Pressable className="h-[60px] w-[150px] rounded-2xl justify-center bg-black p-1.5 mb-5">
          <Text className="text-white text-base font-bold text-center p-1">Register</Text>
        </Pressable>
      </Link>
    </View>

  )
}


export default app