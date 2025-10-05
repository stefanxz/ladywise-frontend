import { useState } from "react";
import { Alert, Text, View } from "react-native";
import "../assets/styles/main.css";
import { ThemedPressable } from "../components/Pressable/ThemedPressable";
import { ThemedTextInput } from "../components/TextInput/ThemedTextInput";

export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [registering, setRegistering] = useState(false);

  const handlePressed = async () => {

    if (!email.trim() && !password.trim()) return Alert.alert("Empty", "Please enter your email and password."); 
    if (!email.trim()) return Alert.alert("Empty", "Please enter your email."); 
    if (!password.trim()) return Alert.alert("Empty", "Please enter your password.");

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
      Alert.alert("Success", "Registraton successful.");
    } catch (err:any) {
      Alert.alert("Error", err?.message ?? "Registration failed.");
    } finally {
      setRegistering(false);
    }
  };

  return (
    <View className="flex-1 bg-red-300 p-4 items-center">
        <Text className="mb-2 text-gray-800 text-center text-2xl my-50"></Text>
        <Text className="mb-2 text-gray-800 text-center text-2xl my-30 font-bold">Create an Account</Text>

        <ThemedTextInput
            value={email}
            onChangeText={setEmail}
            placeholder="you@youremail.com"
            className="h-12 my-10 w-80"
            secureTextEntry={false}
        />

        <ThemedTextInput
            value={password}
            onChangeText={setPassword}
            placeholder="password"
            className="h-12 my-10, w-80"
            secureTextEntry={true}
        />

        <ThemedPressable
            label="Register"
            onPress={handlePressed}
            loading={registering}
            className="my-10 w-50"
        />
    </View>
  );
}
