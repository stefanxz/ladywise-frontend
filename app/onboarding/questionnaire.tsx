import { ThemedPressable } from "@/components/ThemedPressable/ThemedPressable";
import { useQuestionnaire } from "@/app/onboarding/QuestionnaireContext";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect } from "react";
import { Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Questionnaire() {
  const router = useRouter();
  const { setUserId } = useQuestionnaire();
  const params = useLocalSearchParams<{ userId?: string }>();

  useEffect(() => {
    if (typeof params.userId === "string" && params.userId.trim().length > 0) {
      setUserId(params.userId.trim());
    }
  }, [params.userId, setUserId]);

  return (
    <SafeAreaView className="flex-1 bg-white items-center justify-center">
      <View className="p-6">
        <Text className="text-3xl font-bold text-brand mb-4 text-center">
          Welcome to LadyWise!
        </Text>

        <Text className="text-base text-gray-700 text-center mb-8">
          This is your first-time questionnaire. Here we'll collect a few
          details to personalise your experience.
        </Text>

        <ThemedPressable
          label="Start Questionnaire"
          onPress={() =>
            router.push("/onboarding/questionnaire-personal-details")
          }
          className="bg-brand w-60 self-center"
        />
      </View>
    </SafeAreaView>
  );
}
