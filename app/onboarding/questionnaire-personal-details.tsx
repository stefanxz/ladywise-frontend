import { ThemedPressable } from "@/components/ThemedPressable/ThemedPressable";
import { ThemedTextInput } from "@/components/ThemedTextInput/ThemedTextInput";
import { UnitInputField } from "@/components/UnitInputField/UnitInputField";
import { useRouter } from "expo-router";
import { useState, useEffect } from "react";
import { Text, View, KeyboardAvoidingView, Platform, ScrollView, Keyboard } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useQuestionnaire } from "./QuestionnaireContext";

// Assets
import { ProgressBar } from "@/components/ProgressBar/ProgressBar";

export default function Questionnaire() {
  const router = useRouter();
  const { answers, updateAnswers } = useQuestionnaire();
  const [age, setAge] = useState(answers.personal.age);
  const [weight, setWeight] = useState(answers.personal.weight);
  const [height, setHeight] = useState(answers.personal.height);

  // error messages
  const [ageError, setAgeError] = useState<string | null>(null);
  const [weightError, setWeightError] = useState<string | null>(null);
  const [heightError, setHeightError] = useState<string | null>(null);

  // State to track keyboard visibility
  const [isKeyboardVisible, setKeyboardVisible] = useState(false);

  useEffect(() => {
    // 1. Subscribe to keyboard show/hide events
    const keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      () => {
        setKeyboardVisible(true); // Keyboard is open
      },
    );
    const keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      () => {
        setKeyboardVisible(false); // Keyboard is closed
      },
    );

    // 2. Clean up listeners on component unmount
    return () => {
      keyboardDidHideListener.remove();
      keyboardDidShowListener.remove();
    };
  }, []); // Empty dependency array means this runs once on mount and once on unmount

  // Calculate dynamic padding
  // Only apply the large padding (e.g., 400) when the keyboard is visible.
  // When the keyboard is hidden, use a small, standard padding (e.g., 50 or 0).
  const bottomPadding = isKeyboardVisible ? 400 : 50;

  // navigation to the next screen of first time questionnaire
  // Only go to the next page of the questionair when all fiels are inputed correctly
  const handleContinue = async () => {
    setAgeError(null);
    setWeightError(null);
    setHeightError(null);

    const ageNum = Number(age);
    const weightNum = Number(weight);
    const heightNum = Number(height);

    let hasError = false;
    if (!age.trim()) {
      setAgeError("Please enter your age.");
      hasError = true;
    } else if (isNaN(ageNum)) {
      setAgeError("Age must be a whole positive number.");
      hasError = true;
    } else if (!isNaN(ageNum)) {
      if (!Number.isInteger(ageNum) || ageNum < 1) {
        setAgeError("Age must be a whole positive number.");
        hasError = true;
        // Earliest age with menstrual flow = 8
        // Latest age with menstirual flow = 56
      } else if (Number.isInteger(ageNum) && (ageNum < 8 || ageNum > 56)) {
        setAgeError("Age is out of range.");
        hasError = true;
      }
    }

    if (!weight.trim()) {
      setWeightError("Please enter your weight.");
      hasError = true;
    } else if (isNaN(weightNum)) {
      setWeightError(
        "Weight must be a positive number, using a dot (.) for decimals.",
      );
      hasError = true;
    } else if (!isNaN(weightNum)) {
      // Lightest woman ~5 kg
      // Heaviest woman ~ 540 kg
      if (weightNum < 5 || weightNum > 540) {
        setWeightError("Weight is out of range.");
        hasError = true;
      }
    }

    if (!height.trim()) {
      setHeightError("Please enter your height.");
      hasError = true;
    } else if (isNaN(heightNum)) {
      setHeightError(
        "Height must be a positive number, using a dot (.) for decimals.",
      );
      hasError = true;
    } else if (!isNaN(heightNum)) {
      // Smallest woman ~62 cm
      // Tallest woman ~ 216cm
      if (heightNum < 62 || 216 < heightNum) {
        setHeightError("Height is out of range.");
        hasError = true;
      }
    }

    if (hasError) return;

    updateAnswers({ personal: { age, weight, height } });
    router.push("./questionnaire-family-history");
  };

  return (
    <SafeAreaView className="flex-1 bg-background items-center">
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"} // Use 'padding' for iOS and 'height' for Android
        className="flex-1 bg-background" // Use flex-1 to take up the whole screen
        keyboardVerticalOffset={Platform.OS === "ios" ? 0 : -50}
      >
        <ScrollView 
          contentContainerStyle={{ flexGrow: 1, paddingBottom: bottomPadding, alignItems: "center"}}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >

        <View className="w-full max-w-md mt-2 px-10 pt-[71px]">
        <View className="flex-row items-center">
          <View className="flex-1">
            <ProgressBar currentStep={1} totalSteps={5} edgeOffset={0.08} />
          </View>
          <View className="w-1/6" />
        </View>
      </View>

      <View className="w-full max-w-md items-start mt-2 gap-y-3 px-10 pt-[71px]">
        <Text className="text-3xl font-inter-semibold text-brand text-left">
          {"Let's start with a few basics 💫"}
        </Text>

        <Text className="pr-8 text-inter-regular text-regularText text-left leading-relaxed">
          {
            "Tell us a bit about yourself so we can tailor your health insights."
          }
        </Text>

        <View className="w-full mt-12">
          <View>
            <Text className="pr-8 text-inter-regular text-regularText text-left leading-relaxed">
              Age
            </Text>
            <ThemedTextInput
              value={age}
              onChangeText={(t: string) => {
                setAge(t);
                if (ageError) setAgeError(null);
              }}
              placeholder="Your age"
              placeholderTextColor="lightGrey"
              secureTextEntry={false}
              testID="age-input"
            />
            {ageError ? (
              <Text className="text-red-600 text-xs mt-1">{ageError}</Text>
            ) : null}
          </View>

          <View className="w-full mt-8">
            <Text className="pr-8 text-inter-regular text-regularText text-left leading-relaxed">
              Weight
            </Text>
            <UnitInputField
              unit="kg"
              value={weight}
              onChangeText={(t: string) => {
                setWeight(t);
                if (weightError) setWeightError(null);
              }}
              placeholder="Your weight"
              testID="weight-input"
            />
            {weightError ? (
              <Text className="text-red-600 text-xs mt-1">{weightError}</Text>
            ) : null}
          </View>

          <View className="w-full mt-8">
            <Text className="pr-8 text-inter-regular text-regularText text-left leading-relaxed">
              Height
            </Text>
            <UnitInputField
              unit="cm"
              value={height}
              onChangeText={(t: string) => {
                setHeight(t);
                if (heightError) setHeightError(null);
              }}
              placeholder="Your height"
              testID="height-input"
            />
            {heightError ? (
              <Text className="text-red-600 text-xs mt-1">{heightError}</Text>
            ) : null}
          </View>

          <View className="w-full mt-8">
            <ThemedPressable
              label="Continue"
              onPress={handleContinue}
              testID="continue-button"
            />
          </View>
        </View>
      </View>
      </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
