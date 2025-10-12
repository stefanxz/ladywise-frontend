import { AppBar } from "@/components/AppBarBackButton/AppBarBackButton";
import { ThemedPressable } from "@/components/ThemedPressable/ThemedPressable";
import { useRouter } from "expo-router";
import { Image, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function RegisterQuestIntro() {
  const router = useRouter();

  const handlePressed = async () => {
    router.push("/onboarding/questionnaire");
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <View className="w-full bg-gray-50" style={{ zIndex: 10, elevation: 10 }}>
        <AppBar />
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

            {/* Continue button*/}
            <ThemedPressable
              label="Continue"
              onPress={handlePressed}
              className="mt-10 self-center bg-brand w-80"
            />
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}
