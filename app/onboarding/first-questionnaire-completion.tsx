import { AppBar } from "@/components/AppBarBackButton/AppBarBackButton";
import { ThemedPressable } from "@/components/ThemedPressable/ThemedPressable";
import { useRouter } from "expo-router";
import { Image, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

/**
 * FirstQuestionnaireCompletion
 * -----------------------------
 * Final screen after completing the first-time questionnaire.
 * Confirms successful setup and transitions the user to the cycle questionnaire.
 */
export default function FirstQuestionnaireCompletion() {
  const router = useRouter();

  const handleContinue = () => {
    router.push("/onboarding/cycle-questionnaire-mock"); 
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      {/* App Bar */}
      <View className="w-full bg-gray-50" style={{ zIndex: 10, elevation: 10 }}>
        <AppBar />
      </View>

      {/* Main content */}
      <View className="flex-1 w-full items-center justify-center font-inter-regular">
        <View className="w-full max-w-md px-6">
          <View className="items-center">
            {/* Illustration */}
            <Image
              source={require("@/assets/images/woman-holding-phone.png")}
              style={{ width: 275, height: 275 }}
              resizeMode="contain"
            />

            {/* Text block */}
            <View className="w-full max-w-md items-start mt-2 gap-y-3 px-10">
              <Text className="text-3xl font-semibold text-brand text-left">
                {"All set!"} <Text>🌼</Text>
              </Text>

              <Text className="text-lg text-gray-600 text-left leading-relaxed">
                {
                  "Thank you for sharing your details. LadyWise will now personalize your health insights based on your profile."
                }
              </Text>
            </View>

            {/* Continue button */}
            <ThemedPressable
              label="Continue"
              onPress={handleContinue}
              className="mt-10 self-center bg-brand w-80"
            />
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}
