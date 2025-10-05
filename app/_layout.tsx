import { Stack } from 'expo-router';

export default function RootLayout() {
  return (
    <Stack initialRouteName="index">
      <Stack.Screen
        name="index"
        options={{ headerTitle: 'Landing' }}
      />
      <Stack.Screen
        name="register_page"
        options={{ headerTitle: 'Register' }}
      />
    </Stack>
  );
}