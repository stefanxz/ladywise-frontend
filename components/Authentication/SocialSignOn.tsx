import { DividerText } from "@/components/DividerText";
import React from "react";
import { Image, Pressable, View } from "react-native";


type Provider = "google" | "facebook" | "apple";

type SocialSignOnProps = {
  onPress: (provider: Provider) => void;
};

export function SocialSignOn({ onPress }: SocialSignOnProps) {
  return (
    <View className="mt-16">
      <DividerText>or sign up with</DividerText>
      <View style={{ flexDirection: "row", justifyContent: "center", alignItems: "center", gap: 45 }} className="mt-6">

        <Pressable
          onPress={() => onPress("google")}
          style={{ width: 48, height: 48, alignItems: "center", justifyContent: "center" }}
          accessibilityRole="button"
          accessibilityLabel="Sign up with Google"
          testID="sso-google"
        >
          <Image source={require("@/assets/images/google-icon.png")} style={{ width: 60, height: 60 }} resizeMode="contain" />
        </Pressable>

        <Pressable
          onPress={() => onPress("facebook")}
          style={{ width: 48, height: 48, alignItems: "center", justifyContent: "center" }}
          accessibilityRole="button"
          accessibilityLabel="Sign up with Facebook"
          testID="sso-facebook"
        >
          <Image source={require("@/assets/images/facebook-icon.png")} style={{ width: 40, height: 40 }} resizeMode="contain" />
        </Pressable>

        <Pressable
          onPress={() => onPress("apple")}
          style={{ width: 48, height: 48, alignItems: "center", justifyContent: "center" }}
          accessibilityRole="button"
          accessibilityLabel="Sign up with Apple"
          testID="sso-apple"
        >
          <Image source={require("@/assets/images/apple-icon.png")} style={{ width: 40, height: 40 }} resizeMode="contain" />
        </Pressable>
      </View>
    </View>
  );
}
