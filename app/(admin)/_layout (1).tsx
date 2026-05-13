import { Stack } from 'expo-router';
import { Colors } from '../../constants/theme';

export default function AdminLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: Colors.background },
        animation: 'slide_from_right',
      }}
    >
      <Stack.Screen name="index" />
      <Stack.Screen name="transaksi" />
      <Stack.Screen name="obat" />
      <Stack.Screen name="pengguna" />
      <Stack.Screen name="laporan" />
    </Stack>
  );
}
