import { AppBar } from "@/components/AppBarBackButton/AppBarBackButton";
import { ThemedPressable } from "@/components/ThemedPressable/ThemedPressable";
import { useRouter } from "expo-router";
import { useState } from "react";
import { ActivityIndicator, Alert, Image, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

/**
 * FirstQuestionnaireCompletion
 *
 * Final screen of the first-time onboarding questionnaire.
 * Once the backend confirms completion, the user is redirected
 * into the main app flow using `router.replace()` to prevent
 * navigating back into onboarding.
 */
export default function FirstQuestionnaireCompletion() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  /**
   * Marks the questionnaire as completed in the backend.
   * Navigation uses `replace` to avoid the user returning
   * to onboarding screens via the back gesture or button.
   */
  const handleContinue = async () => {
    try {
      setLoading(true);

      // TODO: uncomment this once this functionality exists on backend
      // const result = await markFirstQuestionnaireComplete();
      //
      // if (result.success) {
      //   // Replace navigation stack so user cannot go back to onboarding
      //   router.replace("/(main)/home");
      // } else {
      //   Alert.alert(
      //     "Error",
      //     "Could not mark questionnaire as complete. Please try again.",
      //   );
      // }
      router.replace("/(main)/home");
    } catch (error: any) {
      console.error("Completion error:", error);
      Alert.alert(
        "Connection Error",
        "We could not update your progress. Please check your internet connection.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      {/* AppBar with back button styling (disabled functionality by design) */}
      <View className="w-full bg-gray-50" style={{ zIndex: 10, elevation: 10 }}>
        <AppBar />
      </View>

      {/* Main content container */}
      <View className="flex-1 w-full items-center justify-center font-inter-regular">
        <View className="w-full max-w-md px-6">
          <View className="items-center">
            {/* Illustration */}
            <Image
              source={require("@/assets/images/woman-holding-phone.png")}
              style={{ width: 275, height: 275 }}
              resizeMode="contain"
            />

            {/* Text section */}
            <View className="w-full max-w-md items-start mt-2 gap-y-3 px-10">
              <Text className="text-3xl font-semibold text-brand text-left">
                All set! <Text>🌼</Text>
              </Text>

              <Text className="text-lg text-gray-600 text-left leading-relaxed">
                Thank you for sharing your details. LadyWise will now
                personalize your health insights based on your profile.
              </Text>
            </View>

            {/* Continue button */}
            <View className="mt-10 self-center w-80">
              {loading ? (
                <ActivityIndicator
                  testID="activity-indicator"
                  size="large"
                  color="#B87D99"
                />
              ) : (
                <ThemedPressable
                  label="Continue"
                  onPress={handleContinue}
                  className="bg-brand"
                  testID="continue-btn"
                />
              )}
            </View>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}
