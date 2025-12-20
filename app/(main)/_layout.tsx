import { Redirect, Tabs } from "expo-router";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Colors } from "@/constants/colors";
import { useAuth } from "@/context/AuthContext";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import { usePushNotifications } from "@/hooks/usePushNotifications";

/**
 * HomeLayout
 * 
 * Main layout for the authenticated application.
 * Manages the bottom tab navigation and global providers like BottomSheetModalProvider.
 * Redirects to landing if no authentication token is present.
 * 
 * @returns {JSX.Element | null} The rendered layout or null/redirect
 */
export default function HomeLayout() {
  const { token, isLoading } = useAuth();

  usePushNotifications(!!token);

  if (isLoading) {
    return null;
  }

  if (!token) {
    return <Redirect href="/(auth)/landing" />;
  }

  return (
    <BottomSheetModalProvider>
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarActiveTintColor: Colors.brand,
          tabBarInactiveTintColor: Colors.inactiveTab,
        }}
      >
        <Tabs.Screen
          name="home"
          options={{
            title: "Home",
            tabBarIcon: ({ color, size }) => (
              <MaterialCommunityIcons name="home" size={size} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="calendar"
          options={{
            title: "Calendar",
            tabBarIcon: ({ color, size }) => (
              <MaterialCommunityIcons
                name="calendar"
                size={size}
                color={color}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="diagnostics"
          options={{
            title: "Diagnostics",
            tabBarIcon: ({ color, size }) => (
              <MaterialCommunityIcons name="pulse" size={size} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="settings"
          options={{
            title: "Settings",
            tabBarIcon: ({ color, size }) => (
              <MaterialCommunityIcons name="cog" size={size} color={color} />
            ),
          }}
        />
      </Tabs>
    </BottomSheetModalProvider>
  );
}
