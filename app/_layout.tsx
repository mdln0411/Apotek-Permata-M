import { Stack, useRouter, useSegments } from 'expo-router';
import { AuthProvider, useAuth } from '../context/AuthContext';
import { CartProvider } from '../context/CartContext';
import { useEffect } from 'react';

function InitialLayout() {
  const { user, loading } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;

    const inAuthGroup = segments[0] === '(tabs)' || segments[0] === 'admin' || segments[0] === 'apoteker';

    if (!user && inAuthGroup) {
      // Jika tidak login tapi mencoba akses halaman terproteksi
      router.replace('/login');
    } else if (user) {
      // Role Guard: Cegah akses ke folder yang tidak sesuai role
      const isAccessingAdmin = segments[0] === 'admin';
      const isAccessingApoteker = segments[0] === 'apoteker';
      const isAccessingMember = segments[0] === '(tabs)';

      if (isAccessingAdmin && user.role !== 'admin') {
        router.replace('/(tabs)');
      } else if (isAccessingApoteker && user.role !== 'apoteker' && user.role !== 'admin') {
        router.replace('/(tabs)');
      } else if (user && segments[0] === 'login') {
        // Jika sudah login tapi di halaman login, arahkan sesuai role
        if (user.role === 'admin') router.replace('/admin/dashboard');
        else if (user.role === 'apoteker') router.replace('/apoteker');
        else router.replace('/(tabs)');
      }
    }
  }, [user, loading, segments]);

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="admin" options={{ headerShown: false }} />
      <Stack.Screen name="apoteker" options={{ headerShown: false }} />
      <Stack.Screen name="login" options={{ headerShown: false }} />
      <Stack.Screen name="chat-room" options={{ headerShown: false }} />
    </Stack>
  );
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <CartProvider>
        <InitialLayout />
      </CartProvider>
    </AuthProvider>
  );
}