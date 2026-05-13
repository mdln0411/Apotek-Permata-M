import { Stack } from 'expo-router';
import { StatusBar } from 'react-native';
import Colors from '../app/constants/colors';

export default function RootLayout() {
  return (
    <>
      <StatusBar
        barStyle="light-content"
        backgroundColor={Colors.primary700}
        translucent={false}
      />
      <Stack
        screenOptions={{
          headerShown: false,          // Sembunyikan header default, kita buat custom
          animation: 'slide_from_right', // Animasi transisi
          contentStyle: {
            backgroundColor: Colors.gray50,
          },
        }}
      >
        <Stack.Screen
          name="index"
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="validasi-resep"
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="data-obat"
          options={{ headerShown: false }}
        />
      </Stack>
    </>
  );
}