import { AppBar } from "@/components/AppBarBackButton/AppBarBackButton";
import { ThemedPressable } from "@/components/ThemedPressable/ThemedPressable";
import { ThemedTextInput } from "@/components/ThemedTextInput/ThemedTextInput";
import { registerUser } from "@/lib/api";
import { useState } from "react";
import { Image, Linking, Pressable, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

// At least 8 chars, 1 upper, 1 lower, 1 number, no spaces
const PASSWORD_FORMAT = /^(?=\S{8,}$)(?=.*[A-Z])(?=.*[a-z])(?=.*\d).*$/;

//At least one character before and after the @ and one . after the email service
const EMAIL_FORMAT = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function isPasswordValid(password: string): boolean {
  return PASSWORD_FORMAT.test(password);
}

export function isEmailValid(email: string): boolean {
  return EMAIL_FORMAT.test(email);
}

export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [termsConditions, setTermsConditions] = useState(false);
  const [registering, setRegistering] = useState(false);

  // error messages
  const [emailError, setEmailError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [nameError, setNameError] = useState<string | null>(null);
  const [confirmPasswordError, setConfirmPasswordError] = useState<
    string | null
  >(null);

  const handlePressed = async () => {
    // reset previous errors
    setFormError(null);
    setEmailError(null);
    setPasswordError(null);
    setNameError(null);
    setConfirmPasswordError(null);

    // checks for displaying respective error messages
    let hasError = false;
    if (!email.trim()) {
      setEmailError("Please enter your email.");
      hasError = true;
    } else if (!isEmailValid(email)) {
      setEmailError("Email must have the format example@domain.com.");
      hasError = true;
    }
    if (!isPasswordValid(password)) {
      setPasswordError(
        "Password must contain at least 8 characters, 1 upper case, 1 lower case and 1 number (and no spaces).",
      );
      hasError = true;
    }
    if (!name.trim()) {
      setNameError("Please enter your name.");
      hasError = true;
    }
    if (confirmPassword !== password || !confirmPassword.trim()) {
      setConfirmPasswordError("Please make sure the passwords match.");
      hasError = true;
    }
    if (hasError) return;

    // frontend to backend register request
    try {
      setRegistering(true);
      await registerUser({ email, name, password });
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Registration failed.";
    } finally {
      setRegistering(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <View className="w-full bg-gray-50" style={{ zIndex: 10, elevation: 10 }}>
        <AppBar />
      </View>

      <View className="flex-1 w-full items-center font-inter-regular">
        <View className="w-full max-w-md px-6 pt-6">
          <View className="mb-6">
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Image
                source={require("../../assets/images/ladybug.png")}
                style={{
                  width: 100,
                  height: 100,
                  marginLeft: 20,
                  marginRight: 12,
                }}
                resizeMode="contain"
              />
              <View style={{ flexShrink: 1 }}>
                <Text className="text-4xl font-aclonica-regular text-brand ml-3">
                  LadyWise
                </Text>
                <Text
                  className="text-gray-600 mt-1"
                  style={{ maxWidth: 190, textAlign: "center" }}
                >
                  Your personal companion for menstrual health insights.
                </Text>
              </View>
            </View>
          </View>

          <View className="space-y-3 gap-y-4 w-80 self-center">
            {/* Email input text field */}
            <View>
              <Text className="text-gray-700 mb-1 font-extrabold">Email</Text>
              <ThemedTextInput
                value={email}
                onChangeText={(t: string) => {
                  setEmail(t);
                  if (emailError) setEmailError(null);
                }}
                placeholderTextColor="gray"
                className={`h-11 ${emailError ? "border border-red-500" : ""}`}
                secureTextEntry={false}
              />
              {emailError ? (
                <Text className="text-red-600 text-xs mt-1">{emailError}</Text>
              ) : null}
            </View>

            {/* Name input text field */}
            <View>
              <Text className="text-gray-700 mb-1 font-extrabold">Name</Text>
              <ThemedTextInput
                value={name}
                onChangeText={(t: string) => {
                  setName(t);
                  if (nameError) setNameError(null);
                }}
                placeholderTextColor="gray"
                className={`h-11 ${nameError ? "border border-red-500" : ""}`}
                secureTextEntry={false}
              />
              {nameError ? (
                <Text className="text-red-600 text-xs mt-1">{nameError}</Text>
              ) : null}
            </View>

            {/* Password input text field */}
            <View>
              <Text className="text-gray-700 mb-1 font-extrabold">
                Password
              </Text>
              <ThemedTextInput
                value={password}
                onChangeText={(t: string) => {
                  setPassword(t);
                  if (passwordError) setPasswordError(null);
                }}
                placeholderTextColor="gray"
                className={`h-11 ${passwordError ? "border border-red-500" : ""}`}
                secureTextEntry
              />
              {passwordError ? (
                <Text className="text-red-600 text-xs mt-1">
                  {passwordError}
                </Text>
              ) : null}
            </View>

            {/* Confirm Password input text field */}
            <View>
              <Text className="text-gray-700 mb-1 font-extrabold">
                Confirm Password
              </Text>
              <ThemedTextInput
                value={confirmPassword}
                onChangeText={(t: string) => {
                  setConfirmPassword(t);
                  if (passwordError) setPasswordError(null);
                }}
                placeholderTextColor="gray"
                className={`h-11 ${passwordError ? "border border-red-500" : ""}`}
                secureTextEntry
              />
              {confirmPasswordError ? (
                <Text className="text-red-600 text-xs mt-1">
                  {confirmPasswordError}
                </Text>
              ) : null}
            </View>
          </View>

          {/* Checkbox for terms and conditions */}
          <View className="mt-6 mb-2 w-80 self-center">
            <View className="flex-row items-center">
              <Pressable
                onPress={() => setTermsConditions((v) => !v)}
                accessibilityRole="checkbox"
                accessibilityState={{ checked: termsConditions }}
                hitSlop={8}
                className={`h-5 w-5 rounded border items-center justify-center
              ${termsConditions ? "bg-slate-800 border-slate-800" : "bg-white border-slate-300"}`}
              >
                {termsConditions ? (
                  <Text className="text-white text-xs">✓</Text>
                ) : null}
              </Pressable>

              <Text className="ml-2 text-slate-950 text-sm">
                I agree with the{" "}
                <Text
                  className="font-bold"
                  onPress={() => Linking.openURL("https://example.com/terms")}
                >
                  {" "}
                  terms and conditions.
                </Text>
              </Text>
            </View>
          </View>

          {/* Register button, remains disabled as long as terms and conditions checkbox is unticked*/}
          <ThemedPressable
            label="Register"
            onPress={handlePressed}
            loading={registering}
            disabled={!termsConditions}
            className="mt-18 w-80 self-center bg-brand"
          />
          {formError ? (
            <Text className="text-red-700 text-sm mt-2 text-center">
              {formError}
            </Text>
          ) : null}
        </View>
      </View>
    </SafeAreaView>
  );
}
