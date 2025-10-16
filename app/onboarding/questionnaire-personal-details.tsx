import { useRouter } from "expo-router";
import { Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Questionnaire() {
  const router = useRouter();

  return (
    <SafeAreaView className="flex-1 bg-white items-center pt-[162px]">
      <View className="w-full max-w-md items-start mt-2 gap-y-3 px-10">
        <Text className="text-3xl font-semibold text-brand text-left">
        {"Let's start with a few basics 💫"}
        </Text>
        
        <Text className="pr-8 text-lg text-gray-600 text-left leading-relaxed">
        {
          "Tell us a bit about yourself so we can tailor your health insights."
        }
        </Text>
      </View>
    </SafeAreaView>
  );
}
