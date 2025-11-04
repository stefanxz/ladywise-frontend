import { ThemedPressable } from "@/components/ThemedPressable/ThemedPressable";
import { useRouter } from "expo-router";
import { Image, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function QuestionnaireComplete() {
  const router = useRouter();

  const handleContinue = () => {
    router.replace("/(main)/home");
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50 items-center justify-center">
      <View className="w-full max-w-md px-6 items-center">
        <Image
          source={require("@/assets/images/woman-holding-phone.png")}
          style={{ width: 260, height: 260 }}
          resizeMode="contain"
        />
        <Text className="text-3xl font-inter-semibold text-brand text-center mt-6">
          All set! 🌼
        </Text>
        <Text className="text-base text-gray-600 text-center mt-3 leading-relaxed">
          Thank you for sharing your details. LadyWise will now personalise your
          health insights based on your profile.
        </Text>
        <ThemedPressable
          label="Continue"
          onPress={handleContinue}
          className="mt-10 w-60"
        />
      </View>
    </SafeAreaView>
  );
}
