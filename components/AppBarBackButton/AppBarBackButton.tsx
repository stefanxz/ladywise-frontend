import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useCallback } from "react";
import { Pressable, View } from "react-native";

type AppBarProps = { onBackPress?: () => void };

/**
 * AppBar
 * 
 * Custom navigation header with a back button.
 * Uses `expo-router` for navigation management.
 * 
 * @param {AppBarProps} props - Component props
 * @param {function} [props.onBackPress] - Optional custom back handler
 * @returns {JSX.Element} The rendered app bar
 */
export function AppBar({ onBackPress }: AppBarProps) {
  const router = useRouter();

  const defaultBackHandler = useCallback(() => {
    if (router.canGoBack()) router.back();
    else router.replace("/");
  }, [router]);

  const handleBack = onBackPress ?? defaultBackHandler;

  return (
    <View className="flex-row items-center p-4 bg-transparent">
      <Pressable testID="back-pressable" onPress={handleBack}>
        <Ionicons name="arrow-back" size={24} color="black" />
      </Pressable>
    </View>
  );
}
export default AppBar;
