import { Stack } from 'expo-router';

export default function AdminLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="dashboard" options={{ headerShown: false }} />
      <Stack.Screen name="manage-education" options={{ headerShown: false }} />
      <Stack.Screen name="manage-medicines" options={{ headerShown: false }} />
      <Stack.Screen name="manage-transactions" options={{ headerShown: false }} />
      <Stack.Screen name="manage-users" options={{ headerShown: false }} />
      <Stack.Screen name="reports" options={{ headerShown: false }} />
    </Stack>
  );
}
