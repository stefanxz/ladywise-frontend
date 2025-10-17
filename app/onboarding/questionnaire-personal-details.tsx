import { ThemedPressable } from "@/components/ThemedPressable/ThemedPressable";
import { ThemedTextInput } from "@/components/ThemedTextInput/ThemedTextInput";
import { UnitInputField } from "@/components/UnitInputField/UnitInputField";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Image, Platform, Pressable, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

// Assets
import progression from "@/assets/images/progres1.png";
import progressionBar from "@/assets/images/progresbar.png";
import { isInputInteger } from "@/utils/validations";


export default function Questionnaire() {
  const router = useRouter();
  const [age, setAge] = useState("");
  const [weight, setWeight] = useState("");
  const [height, setheight] = useState("");

  // error messages
  const [ageError, setAgeError] = useState<string | null>(null);
  const [weightError, setWeightError] = useState<string | null>(null);
  const [heightError, setheightError] = useState<string | null>(null);

  // Navigate to the login page
  const handleSkip = () => {
    router.push("/landing");
  };

const handleContinue = async () => {
    setAgeError(null);
    setWeightError(null);
    setheightError(null);

    let hasError = false;
    if (!age.trim()) {
      setAgeError("Please enter your age.");
      hasError = true;
    } else if (!isInputInteger(age)) {
      setAgeError("Age must be a number.");
      hasError = true;
    }

    if (!weight.trim()) {
      setWeightError("Please enter your weight.");
      hasError = true;
    } else if (!isInputInteger(weight)) {
      setWeightError("Weight must be a number.");
      hasError = true;
    }

    if (!height.trim()) {
      setheightError("Please enter your height.");
      hasError = true;
    } else if (!isInputInteger(height)) {
      setheightError("Height must be a number.");
      hasError = true;
    }

    if (hasError) return;
    router.push("/onboarding/questionnaire");
  };
  

  return (
    <SafeAreaView className="flex-1 bg-background items-center">
      <View className="w-full max-w-md mt-2 px-10 pt-[71px]">
        <View className="flex-row items-center">
          <View className="relative flex-1">
            <Image
              source={progressionBar}
              className="absolute left-0 top-1/2 -translate-y-1/2"
              resizeMode="contain"
            />
            <Image
              source={progression}
              className="absolute left-0 top-1/2 -translate-y-1/2"
              resizeMode="contain"
            />
            <Pressable 
              onPress={handleSkip}
              >
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
        </Text >
        <View className="w-full mt-12">
          <View>
            <Text className="pr-8 text-inter-regular text-regularText text-left leading-relaxed">Age</Text>
            <ThemedTextInput
            value={age}
            onChangeText={(t: string) => {
                setAge(t);
                if (ageError) setAgeError(null);
            }}
            placeholder="Your age"
            placeholderTextColor="lightGrey"
            className={`h-11 ${ageError ? "border border-red-500" : ""}`}
            secureTextEntry={false}
            />
            {ageError ? (
              <Text className="text-red-600 text-xs mt-1">{ageError}</Text>
              ) : null}
          </View>
          <View className="w-full mt-8">
            <Text className="pr-8 text-inter-regular text-regularText text-left leading-relaxed">Weight</Text>
            <UnitInputField
            unit="kg"
            value = {weight}
            onChangeText={(t: string) => {
                setWeight(t);
                if (weightError) setWeightError(null);
            }}
            placeholder="Your weight"
            />
            {weightError ? (
              <Text className="text-red-600 text-xs mt-1">{weightError}</Text>
              ) : null}
          </View>
          <View className="w-full mt-8">
            <Text className="pr-8 text-inter-regular text-regularText text-left leading-relaxed">Height</Text>
            <UnitInputField
            unit="cm"
            value = {height}
            onChangeText={(t: string) => {
                setheight(t);
                if (heightError) setheightError(null);
            }}
            placeholder="Your height"
            />
            {heightError ? (
              <Text className="text-red-600 text-xs mt-1">{heightError}</Text>
              ) : null}
          </View>
          <View className="w-full mt-8">
            <ThemedPressable
              label="Continue"
              onPress={handleContinue}
            />
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}
