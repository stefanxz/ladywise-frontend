import { Poppins_400Regular, Poppins_700Bold, useFonts } from '@expo-google-fonts/poppins';
import { Stack } from 'expo-router';

export const unstable_settings = {
  anchor: '(landingpage)',
};

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_700Bold,
  });
  // Check if the fonts have loaded.
  // While they are loading, we can return null (a blank screen)
  // or a simple loading indicator. Returning null is the simplest.
  if (!fontsLoaded) {
    return null; 
  }

  return (
    <Stack>
      <Stack.Screen name="(landingPage)" options={{ headerShown: false }} />
      <Stack.Screen name="(loginPage)" options={{ headerShown: false }} />
      <Stack.Screen name="(registrationPage)" options={{ headerShown: false }} />
    </Stack>
  );
}
