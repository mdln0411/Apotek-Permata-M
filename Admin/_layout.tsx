import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

export default function RootLayout() {
  return (
    <>
      <StatusBar style="light" backgroundColor="#2D7A4F" />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(admin)" />
      </Stack>
    </>
  );
}
