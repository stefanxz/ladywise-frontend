import { ThemedTextInput } from "@/components/ThemedTextInput/ThemedTextInput";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Questionnaire() {
  const router = useRouter();
  const [age, setAge] = useState("");

  // error messages
  const [ageError, setAgeError] = useState<string | null>(null);
  

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
      </View>
    </SafeAreaView>
  );
}
