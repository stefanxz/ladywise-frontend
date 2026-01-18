import { Redirect, Tabs } from "expo-router";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Colors } from "@/constants/colors";
import { useAuth } from "@/context/AuthContext";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import { usePushNotifications } from "@/hooks/usePushNotifications";

/**
 * Authenticated Main Layout
 *
 * This layout serves as the shell for the core application experience. It
 * establishes the bottom tab navigation structure and provides global context
 * providers like the BottomSheetModalProvider to all nested screens.
 *
 * It acts as a security gate, ensuring that unauthenticated users are redirected
 * to the landing page and managing global background tasks like push
 * notification registration.
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
        <Tabs.Screen
          name="questions/index"
          options={{
            href: null,
            title: "Tutorials",
          }}
        />
      </Tabs>
    </BottomSheetModalProvider>
  );
}
