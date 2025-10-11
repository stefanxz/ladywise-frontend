import { AppBar } from "@/components/AppBarBackButton/AppBarBackButton";
import { ThemedPressable } from "@/components/ThemedPressable/ThemedPressable";
import { ThemedTextInput } from "@/components/ThemedTextInput/ThemedTextInput";
import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Image, Linking, Pressable, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { isEmailValid, isPasswordValid } from "../../utils/validations";


export default function Register1() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [termsConditions, setTermsConditions] = useState(false);
  const [registering, setRegistering] = useState(false);
  const [showPw, setShowPw] = useState(false);
  const [showConfPw, setShowConfPw] = useState(false);
  const router = useRouter(); // Navigation instance

  // error messages
  const [emailError, setEmailError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);;
  const [confirmPasswordError, setConfirmPasswordError] = useState<
    string | null
  >(null);

  const handlePressed = async () => {
    // reset previous errors
    setFormError(null);
    setEmailError(null);
    setPasswordError(null);
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
    
    if (confirmPassword !== password || !confirmPassword.trim()) {
      setConfirmPasswordError("Please make sure the passwords match.");
      hasError = true;
    }
    if (hasError) return;

    // frontend to backend register request
    // try {
    // setRegistering(true);
    // // Submit registration to backend
    // const response = await registerUser({ email, password });
    // // if successful registration, navigate to the second register page
    // router.push("/register2"); 
    
    // } catch (err: unknown) {
    //   //user-friendly error message
    //   const message =
    //     err instanceof Error ? err.message : "Registration failed.";
    //     setFormError(message);
    // } finally {
    //   setRegistering(false);
    // }
    router.push("/register2"); 
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <View className="w-full bg-gray-50" style={{ zIndex: 10, elevation: 10 }}>
        <AppBar />
      </View>

      <View className="w-full max-w-md px-6 pt-10 gap-y-2 self-center">
        <View className="items-start px-10 mb-5">
          <Text className="text-3xl text-brand text-left">
            <Text className="font-semibold">Join </Text>
            <Text className="font-aclonica-regular">LadyWise 💫</Text>
            
          </Text>
          <Text className="text-gray-600 text-lg mt-2 text-left leading-snug max-w-xs">
            Start tracking your menstrual cycle with smart insights.
          </Text>
        </View>

          <View className="gap-y-8 w-80 self-center">
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
                placeholder="Your email"
              />
              {emailError ? (
                <Text className="text-red-600 text-xs mt-1">{emailError}</Text>
              ) : null}
            </View>

            {/* Password input text field */}
            <View>
              <Text className="text-gray-700 mb-1 font-extrabold">Password</Text>
              <View className="relative h-11"> 
                <ThemedTextInput
                  value={password}
                  onChangeText={(t: string) => {
                    setPassword(t);
                    if (passwordError) setPasswordError(null);
                  }}
                  placeholderTextColor="gray"
                  className={`h-11 pr-10 ${passwordError ? "border border-red-500" : ""}`}
                  secureTextEntry={!showPw}
                  placeholder="Your password"
                />
                <View className="absolute right-0 top-0 bottom-0 justify-center pr-3">
                  <Pressable onPress={() => setShowPw(v => !v)} hitSlop={12}>
                    <Feather name={showPw ? "eye-off" : "eye"} size={20} color="#6B7280" />
                  </Pressable>
                </View>
              </View>
              {passwordError ? (
                <Text className="text-red-600 text-xs mt-1">
                  {passwordError}</Text>
              ) : null}
            </View>


            {/* Confirm Password input text field */}
            <View>
              <Text className="text-gray-700 mb-1 font-extrabold">Confirm Password</Text>
              <View className="relative h-11"> 
                <ThemedTextInput
                  value={confirmPassword}
                  onChangeText={(t: string) => {
                    setConfirmPassword(t);
                    if (confirmPasswordError) setConfirmPasswordError(null);
                  }}
                  placeholderTextColor="gray"
                  className={`h-11 pr-10 ${confirmPasswordError ? "border border-red-500" : ""}`}
                  secureTextEntry={!showConfPw}
                  placeholder="Your password"
                />
                <View className="absolute right-0 top-0 bottom-0 justify-center pr-3">
                  <Pressable onPress={() => setShowConfPw(v => !v)} hitSlop={12}>
                    <Feather name={showConfPw ? "eye-off" : "eye"} size={20} color="#6B7280" />
                  </Pressable>
                </View>
              </View>
              {confirmPasswordError ? (
                <Text className="text-red-600 text-xs mt-1">
                  {confirmPasswordError}</Text>
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

          {/* Continue button, remains disabled as long as terms and conditions checkbox is unticked*/}
          <ThemedPressable
            label="Continue"
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

          {/* Bottom Section (social login) */}
              <View className="mt-16">
                <View className="flex-row items-center justify-center mb-10">
                  <View className="h-px bg-gray-300 w-1/4" />
                  <Text className="text-gray-400 text-sm mx-3">
                    or sign up with
                  </Text>
                  <View className="h-px bg-gray-300 w-1/4" />
                </View>

              <View style={{ flexDirection: "row", justifyContent: "center", alignItems: "center", gap: 45}}>
                <Pressable style={{ width: 48, height: 48, alignItems: "center", justifyContent: "center" }}>
                  <Image
                    source={require("../../assets/images/google-icon.png")}
                    style={{ width: 60, height: 60 }}
                    resizeMode="contain"
                  />
                </Pressable>

                <Pressable style={{ width: 48, height: 48, alignItems: "center", justifyContent: "center" }}>
                  <Image
                    source={require("../../assets/images/facebook-icon.png")}
                    style={{ width: 40, height: 40}}
                    resizeMode="contain"
                  />
                </Pressable>

                <Pressable style={{ width: 48, height: 48, alignItems: "center", justifyContent: "center" }}>
                  <Image
                    source={require("../../assets/images/apple-icon.png")}
                    style={{ width: 40, height: 40 }}
                    resizeMode="contain"
                  />
                </Pressable>
              </View>
            </View>
        </View>
    </SafeAreaView>
  );
}
