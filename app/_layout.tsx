import "@/assets/styles/main.css";
import { Aclonica_400Regular } from "@expo-google-fonts/aclonica";
import {
  Inter_400Regular,
  Inter_600SemiBold,
  useFonts,
} from "@expo-google-fonts/inter";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import { Slot } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { AuthProvider, useAuth } from "@/context/AuthContext";
import { ThemeProvider } from "@/context/ThemeContext";

SplashScreen.preventAutoHideAsync().catch(() => {});

function AppContent() {
  const { isLoading: isAuthLoading } = useAuth();
  const [fontsLoaded] = useFonts({
    Aclonica_400Regular,
    Inter_400Regular,
    Inter_600SemiBold,
  });

  useEffect(() => {
    if (fontsLoaded && !isAuthLoading) {
      SplashScreen.hideAsync().catch(() => {});
    }
  }, [fontsLoaded, isAuthLoading]);

  if (!fontsLoaded || isAuthLoading) {
    return null;
  }

  return <Slot />;
}

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <AuthProvider>
          <ThemeProvider>
            <BottomSheetModalProvider>
              <AppContent />
            </BottomSheetModalProvider>
          </ThemeProvider>
        </AuthProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
