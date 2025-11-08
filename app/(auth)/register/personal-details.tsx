import { AuthContext } from "@/app/_layout"; // <-- use context
import { AppBar } from "@/components/AppBarBackButton/AppBarBackButton";
import { ThemedPressable } from "@/components/ThemedPressable/ThemedPressable";
import { ThemedTextInput } from "@/components/ThemedTextInput/ThemedTextInput";
import { useRouter } from "expo-router";
import React, { useCallback, useContext, useState } from "react";
import { Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function RegisterPersDetails() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [firstNameError, setFirstNameError] = useState<string | null>(null);
  const [lastNameError, setLastNameError] = useState<string | null>(null);

  const router = useRouter();
  const { setStatus } = useContext(AuthContext);

  const handleBack = useCallback(() => {
    setStatus("signedIn");
    router.replace("/(main)/home");
  }, [router, setStatus]);

  const handlePressed = async () => {
    setFirstNameError(null);
    setLastNameError(null);

    let hasError = false;
    if (!firstName.trim()) {
      setFirstNameError("Please enter your first name.");
      hasError = true;
    }
    if (!lastName.trim()) {
      setLastNameError("Please enter your last name.");
      hasError = true;
    }
    if (hasError) return;
    router.push("/onboarding/questionnaire-intro");
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <View className="w-full bg-gray-50" style={{ zIndex: 10, elevation: 10 }}>
        <AppBar onBackPress={handleBack} />
      </View>

      <View className="flex-1 w-full items-center font-inter-regular">
        <View className="w-full max-w-md px-6 pt-16">
          <View className="mb-5">
            <View className="mb-5">
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <View style={{ flexShrink: 1, marginLeft: 40 }}>
                  <Text className="text-3xl font-semibold text-brand">
                    {"Let's get to know you"}
                  </Text>
                  <Text
                    className="text-gray-600 mt-2 text-lg"
                    style={{ maxWidth: 300 }}
                  >
                    What should we call you?
                  </Text>
                </View>
              </View>
            </View>
          </View>

          <View className="space-y-4 gap-y-10 pt-10 w-80 self-center">
            <View>
              <Text className="text-gray-700 mb-1 font-extrabold">
                First Name
              </Text>
              <ThemedTextInput
                value={firstName}
                onChangeText={(t: string) => {
                  setFirstName(t);
                  if (firstNameError) setFirstNameError(null);
                }}
                placeholderTextColor="gray"
                className={`h-11 ${firstNameError ? "border border-red-500" : ""}`}
                secureTextEntry={false}
                placeholder="Your first name"
              />
              {firstNameError ? (
                <Text className="text-red-600 text-xs mt-1">
                  {firstNameError}
                </Text>
              ) : null}
            </View>

            <View>
              <Text className="text-gray-700 mb-1 font-extrabold">
                Last Name
              </Text>
              <ThemedTextInput
                value={lastName}
                onChangeText={(t: string) => {
                  setLastName(t);
                  if (lastNameError) setLastNameError(null);
                }}
                placeholderTextColor="gray"
                className={`h-11 ${lastNameError ? "border border-red-500" : ""}`}
                secureTextEntry={false}
                placeholder="Your last name"
              />
              {lastNameError ? (
                <Text className="text-red-600 text-xs mt-1">
                  {lastNameError}
                </Text>
              ) : null}
            </View>

            <ThemedPressable
              label="Continue"
              onPress={handlePressed}
              className="mt-18 w-80 self-center bg-brand"
            />
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}
