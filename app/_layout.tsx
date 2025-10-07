import { Stack } from 'expo-router';

export const unstable_settings = {
  anchor: '(landingpage)',
};

export default function RootLayout() {

  return (
    <Stack>
      <Stack.Screen name="landingPage" options={{ headerShown: false }} />
      <Stack.Screen name="loginPage" options={{ headerShown: false }} />
      <Stack.Screen name="registrationPage" options={{ headerShown: false }} />
    </Stack>
  );
}
