import { ThemedTextInput } from "@/components/ThemedTextInput/ThemedTextInput";
import { UnitInputField } from "@/components/UnitInputField/UnitInputField";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Questionnaire() {
  const router = useRouter();
  const [age, setAge] = useState("");
  const [weight, setWeight] = useState("");
  const [height, setheight] = useState("");

  // error messages
  const [ageError, setAgeError] = useState<string | null>(null);
  const [weightError, setWeightError] = useState<string | null>(null);
  const [heightError, setheightError] = useState<string | null>(null);
  

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
        </Text >
        <View className="w-full mt-12">
          <View>
            <Text className="pr-8 text-lg text-gray-600 text-left leading-relaxed">Age</Text>
            <ThemedTextInput
            value={age}
            onChangeText={(t: string) => {
                setAge(t);
                if (ageError) setAgeError(null);
            }}
            placeholderTextColor="gray"
            className={`h-11 ${ageError ? "border border-red-500" : ""}`}
            secureTextEntry={false}
            placeholder="Your age"
            />
            {ageError ? (
              <Text className="text-red-600 text-xs mt-1">{ageError}</Text>
              ) : null}
          </View>
          <View className="w-full mt-8">
            <Text className="pr-8 text-lg text-gray-600 text-left leading-relaxed">Weight</Text>
            <UnitInputField
            unit="kg"
            value = {weight}
            onChangeText={(t: string) => {
                setWeight(t);
                if (weightError) setWeightError(null);
            }}
            placeholder="Your weight"
            />
            {ageError ? (
              <Text className="text-red-600 text-xs mt-1">{weightError}</Text>
              ) : null}
          </View>
          <View className="w-full mt-8">
            <Text className="pr-8 text-lg text-gray-600 text-left leading-relaxed">Height</Text>
            <UnitInputField
            unit="cm"
            value = {height}
            onChangeText={(t: string) => {
                setheight(t);
                if (heightError) setheightError(null);
            }}
            placeholder="Your height"
            />
            {ageError ? (
              <Text className="text-red-600 text-xs mt-1">{heightError}</Text>
              ) : null}
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}
