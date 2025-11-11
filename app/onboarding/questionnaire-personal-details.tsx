import { ThemedPressable } from "@/components/ThemedPressable/ThemedPressable";
import { ThemedTextInput } from "@/components/ThemedTextInput/ThemedTextInput";
import { UnitInputField } from "@/components/UnitInputField/UnitInputField";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Platform, Pressable, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

// Assets
import { ProgressBar } from "@/components/ProgressBar/ProgressBar";

export default function Questionnaire() {
  const router = useRouter();
  const [age, setAge] = useState("");
  const [weight, setWeight] = useState("");
  const [height, setHeight] = useState("");

  // error messages
  const [ageError, setAgeError] = useState<string | null>(null);
  const [weightError, setWeightError] = useState<string | null>(null);
  const [heightError, setHeightError] = useState<string | null>(null);

  // Navigate to the main page
  // Main page does not exist yet so naviagtion is to langing page
  const handleSkip = () => {
    router.push("/landing");
  };

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
      if (weightNum < 5 || 540 < weightNum) {
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
    router.push("/onboarding/questionnaire-family-history");
  };

  return (
    <SafeAreaView className="flex-1 bg-background items-center">
      <View className="w-full max-w-md mt-2 px-10 pt-[71px]">
        <View className="flex-row items-center">
          <View className="flex-1">
            <ProgressBar currentStep={1} totalSteps={5} />
          </View>
          <View className="w-1/6">
            <Pressable onPress={handleSkip}>
              <Text
                className="text-inter-regular text-right text-lightGrey"
                style={{
                  // Fix for Android text truncation bug
                  paddingRight: Platform.OS === "android" ? 3 : 0,
                }}
              >
                Skip
              </Text>
            </Pressable>
          </View>
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
    </SafeAreaView>
  );
}
function isDecimal(weightNum: number) {
  throw new Error("Function not implemented.");
}