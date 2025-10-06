import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { Pressable, View } from "react-native";

export function AppBar() {
  // Access the navigation object to enable going back
  const navigation = useNavigation();
  // Render a horizontal bar containing a back button
  return (
    <View className="flex-row items-center p-4 bg-transparent">
      <Pressable onPress={() => navigation.goBack()}>
        <Ionicons name="arrow-back" size={24} color="black" />
      </Pressable>
    </View>
  );
}

export default AppBar;
