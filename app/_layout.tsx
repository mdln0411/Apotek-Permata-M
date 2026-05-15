import { Stack } from 'expo-router';

export default function RootLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      {/* Baris ini sangat penting. 
         Ini memberitahu aplikasi bahwa folder (tabs) adalah 
         halaman utama yang harus dimuat pertama kali.
      */}
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />

      {/* Halaman lain yang tidak punya tab bar (seperti status pembayaran) 
         tetap didaftarkan di sini secara otomatis oleh Expo Router.
      */}
    </Stack>
  );
}