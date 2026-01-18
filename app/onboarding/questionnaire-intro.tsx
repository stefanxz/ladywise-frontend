import { AppBar } from "@/components/AppBarBackButton/AppBarBackButton";
import { ThemedPressable } from "@/components/ThemedPressable/ThemedPressable";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { useRouter } from "expo-router";
import React, { useCallback, useRef } from "react";
import { BackHandler, Image, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

/**
 * Onboarding Initiation Screen
 *
 * This screen welcomes the user to the personalized tracking experience and
 * provides context for why health information is being collected. It acts
 * as a transition point between account creation and detailed health profiling.
 *
 * It includes robust navigation guards to ensure users can return to their
 * personal details configuration if needed, while maintaining the integrity
 * of the onboarding stack.
 */
export default function RegisterQuestIntro() {
  const router = useRouter();
  const navigation = useNavigation();
  const reroutingRef = useRef(false);

  const goBackToPersonalDetails = useCallback(() => {
    if (reroutingRef.current) return;
    reroutingRef.current = true;
    // Explicitly go to the screen we want, regardless of stack
    router.replace("/(auth)/register/personal-details");
  }, [router]);

  /**
   * iOS Swipe-Back Navigation Guard
   *
   * Intercepts standard navigation events (like the iOS swipe-back gesture or
   * header back buttons) to ensure the user is correctly routed back to the
   * personal details section rather than simply popping the previous stack entry.
   */
  useFocusEffect(
    useCallback(() => {
      const sub = navigation.addListener("beforeRemove", (e: any) => {
        if (reroutingRef.current) return;
        const type = e?.data?.action?.type as string | undefined;
        if (type === "GO_BACK" || type === "POP" || type === "POP_TO_TOP") {
          e.preventDefault();
          goBackToPersonalDetails();
        }
      });
      return () => sub();
    }, [navigation, goBackToPersonalDetails]),
  );

  /**
   * Android Hardware Back Navigation Guard
   *
   * Specialized listener for the physical Android back button. It overrides
   * default behavior during the questionnaire intro to maintain consistent
   * cross-platform navigation logic.
   */
  useFocusEffect(
    useCallback(() => {
      const onHardwareBack = () => {
        if (reroutingRef.current) return true;
        goBackToPersonalDetails();
        return true;
      };
      const bh = BackHandler.addEventListener(
        "hardwareBackPress",
        onHardwareBack,
      );
      return () => bh.remove();
    }, [goBackToPersonalDetails]),
  );

  // Reset guard when screen blurs/unmounts
  useFocusEffect(
    useCallback(() => {
      reroutingRef.current = false;
      return () => {
        reroutingRef.current = false;
      };
    }, []),
  );

  const handleContinue = () => {
    router.push("/onboarding/questionnaire-personal-details");
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <View className="w-full bg-gray-50" style={{ zIndex: 10, elevation: 10 }}>
        {/* AppBar uses our explicit back */}
        <AppBar onBackPress={goBackToPersonalDetails} />
      </View>
      <View className="flex-1 w-full items-center font-inter-regular">
        <View className="w-full max-w-md px-6">
          <View className="items-center">
            <Image
              source={require("@/assets/images/woman-holding-phone.png")}
              style={{ width: 275, height: 275 }}
              resizeMode="contain"
            />

            <View className="w-full max-w-md items-start mt-2 gap-y-3 px-10">
              <Text className="text-3xl font-semibold text-brand text-left">
                {"Let's personalize"}
              </Text>
              <Text className="text-3xl text-brand text-left">
                <Text className="font-aclonica-regular">LadyWise</Text>
                <Text className="font-semibold">{" for you"}</Text>
              </Text>
              <Text className="text-lg text-gray-600 text-left leading-relaxed">
                {
                  "We'll ask a few things about your cycle, health, and background to help personalize your insights. It only takes a minute."
                }
              </Text>
            </View>
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
