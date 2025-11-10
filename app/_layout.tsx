import "@/assets/styles/main.css";
import { Aclonica_400Regular } from "@expo-google-fonts/aclonica";
import {
  Inter_400Regular,
  Inter_600SemiBold,
  useFonts,
} from "@expo-google-fonts/inter";
import { Slot, SplashScreen } from "expo-router";
import { useEffect } from "react";
import { AuthProvider, useAuth } from "@/context/AuthContext";
import { ThemeProvider } from "@/context/ThemeContext";
import { View } from "react-native";

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
    <AuthProvider>
      <ThemeProvider>
        {/* We need this View for the onLayout hack if we used it, 
            but standard SplashScreen.hideAsync() works too. 
            Keeping flex-1 just in case. */}
        <View style={{ flex: 1 }}>
          <AppContent />
        </View>
      </ThemeProvider>
    </AuthProvider>
  );
}
