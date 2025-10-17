import { Stack } from "expo-router";

export default function MainPageLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="home" options={{ title: "Home Page/ Main Page" }} />
    </Stack>
  );
}
