import { DividerText } from "@/components/DividerText";
import React from "react";
import { Image, Pressable, View } from "react-native";
import type {
  Provider,
  SocialSignOnProps,
} from "@/components/SocialSignOn/SocialSignOn.types";

export function SocialSignOn({ onPress }: SocialSignOnProps) {
  return (
    <View className="mt-16">
      <DividerText>or sign up with</DividerText>
      <View className="mt-6 flex-row justify-center items-center space-x-12">
        <Pressable
          onPress={() => onPress("google")}
          className="w-12 h-12 items-center justify-center"
          accessibilityRole="button"
          accessibilityLabel="Sign up with Google"
          testID="sso-google"
        >
          <Image
            source={require("@/assets/images/google-icon.png")}
            style={{ width: 60, height: 60 }}
            resizeMode="contain"
          />
        </Pressable>

        <Pressable
          onPress={() => onPress("facebook")}
          className="w-12 h-12 items-center justify-center"
          accessibilityRole="button"
          accessibilityLabel="Sign up with Facebook"
          testID="sso-facebook"
        >
          <Image
            source={require("@/assets/images/facebook-icon.png")}
            style={{ width: 40, height: 40 }}
            resizeMode="contain"
          />
        </Pressable>

        <Pressable
          onPress={() => onPress("apple")}
          className="w-12 h-12 items-center justify-center"
          accessibilityRole="button"
          accessibilityLabel="Sign up with Apple"
          testID="sso-apple"
        >
          <Image
            source={require("@/assets/images/apple-icon.png")}
            style={{ width: 40, height: 40 }}
            resizeMode="contain"
          />
        </Pressable>
      </View>
    </View>
  );
}
