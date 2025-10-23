import { AppBar } from "@/components/AppBarBackButton/AppBarBackButton";
import { ThemedPressable } from "@/components/ThemedPressable/ThemedPressable";
import { markFirstQuestionnaireComplete } from "@/lib/questionnaireService";
import { useRouter } from "expo-router";
import { useState } from "react";
import { ActivityIndicator, Alert, Image, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

/**
 * FirstQuestionnaireCompletion
 * -----------------------------
 * Confirms successful setup and transitions the user to the cycle questionnaire.
 * Integrated with backend to mark the questionnaire as completed.
 */
export default function FirstQuestionnaireCompletion() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  /**
   * Called when user presses "Continue".
   * Marks questionnaire completion via backend before navigating.
   */
  const handleContinue = async () => {
    try {
      setLoading(true);

      // Send completion flag to backend
      const result = await markFirstQuestionnaireComplete();

      if (result.success) {
        // Proceed to the next questionnaire
        router.push("/onboarding/cycle-questionnaire-mock");
      } else {
        // Unexpected response from backend
        Alert.alert("Error", "Could not mark questionnaire as complete. Please try again.");
      }
    } catch (error: any) {
      // Network / auth error
      console.error("Completion error:", error);
      Alert.alert(
        "Connection Error",
        "We couldn’t update your progress. Please check your internet connection."
      );
    } finally {
      setLoading(false);
    }
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
            <View className="mt-10 self-center w-80">
              {loading ? (
                <ActivityIndicator size="large" color="#B87D99" />
              ) : (
                <ThemedPressable
                  label="Continue"
                  onPress={handleContinue}
                  className="bg-brand"
                />
              )}
            </View>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}
