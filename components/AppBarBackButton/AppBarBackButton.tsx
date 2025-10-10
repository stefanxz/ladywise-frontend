import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { Pressable, View } from "react-native";

export function AppBar() {
  // Access the router object to enable going back
  const router = useRouter();
  // Render a transparent horizontal bar containing a back button
  return (
    <View className="flex-row items-center p-4 bg-transparent">
      <Pressable
        testID="back-pressable"
        onPress={() =>
          router.canGoBack() ? router.back() : router.replace("/")
        }
      >
        <Ionicons name="arrow-back" size={24} color="black" />
      </Pressable>
    </View>
  );
}

export default AppBar;
