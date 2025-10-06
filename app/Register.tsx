import { useState } from "react";
import { Alert, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import "../assets/styles/main.css";
import { AppBar } from "../components/Pressable/appbar-backbutton";
import { ThemedPressable } from "../components/Pressable/ThemedPressable";
import { ThemedTextInput } from "../components/TextInput/ThemedTextInput";

// At least 8 chars, 1 upper, 1 lower, 1 number, no spaces
const PASSWORD_RE = /^(?=\S{8,}$)(?=.*[A-Z])(?=.*[a-z])(?=.*\d).*$/;

export function isPasswordValid(pw: string): boolean {
  return PASSWORD_RE.test(pw);
}

export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [registering, setRegistering] = useState(false);

  // inline error messages
  const [emailError, setEmailError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);

  const handlePressed = async () => {
    // reset previous errors
    setFormError(null);
    setEmailError(null);
    setPasswordError(null);

    // email non-empty, password validation done above
    let hasError = false;
    if (!email.trim()) {
      setEmailError("Please enter your email.");
      hasError = true;
    }
    if (!isPasswordValid(password)) {
      setPasswordError(
        "Password must contain at least 8 characters, 1 upper case, 1 lower case and 1 number (and no spaces)."
      );
      hasError = true;
    }
    if (hasError) return;

    try {
      setRegistering(true);
      const res = await fetch("http://localhost:8080/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) throw new Error(`HTTP ${res.status}`);

      setEmail("");
      setPassword("");
      Alert.alert("Success", "Registration successful.");
    } catch (err: unknown) {
      const message =
        err instanceof Error
          ? err.message
          : typeof err === "string"
            ? err
            : "Registration failed.";
      setFormError(message);
    } finally {
      setRegistering(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-red-300">
      <View className="flex-1 bg-red-300">
        <AppBar />
        <View className="h-3/4 bg-red-300 items-center justify-center">
          <Text className="mb-2 text-gray-800 text-center text-2xl my-10 font-bold">
            Create an Account
          </Text>

          <View className="w-80 my-5">
            <ThemedTextInput
              value={email}
              onChangeText={(t: string) => {
                setEmail(t);
                if (emailError) setEmailError(null);
              }}
              placeholder="you@youremail.com"
              placeholderTextColor="gray"
              className={`h-12 w-80 ${emailError ? "border border-red-500" : ""}`}
              secureTextEntry={false}
            />
            {emailError ? (
              <Text className="text-red-600 text-xs mt-1">{emailError}</Text>
            ) : null}
          </View>

          <View className="w-80 my-5">
            <ThemedTextInput
              value={password}
              onChangeText={(t: string) => {
                setPassword(t);
                if (passwordError) setPasswordError(null);
              }}
              placeholder="password"
              placeholderTextColor="gray"
              className={`h-12 w-80 ${passwordError ? "border border-red-500" : ""}`}
              secureTextEntry={true}
            />
            {passwordError ? (
              <Text className="text-red-600 text-xs mt-1">{passwordError}</Text>
            ) : null}
          </View>

          <ThemedPressable
            label="Register"
            onPress={handlePressed}
            loading={registering}
            className="my-8 w-50"
          />

          {formError ? (
            <Text className="text-red-700 text-sm mt-2">{formError}</Text>
          ) : null}
        </View>
      </View>
    </SafeAreaView>
  );
}
