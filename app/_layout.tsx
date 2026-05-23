import { Stack, useRouter, useSegments } from 'expo-router';
import { useEffect } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { AuthProvider, useAuth } from '../context/AuthContext';
import { CartProvider } from '../context/CartContext';

const PUBLIC_SEGMENTS = new Set([
  'login',
  'register',
  'lupa-password',
  'index',
  'modal',
]);

function InitialLayout() {
  const { user, loading } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  const firstSegment = segments[0] ?? '';
  const isPublicRoute = PUBLIC_SEGMENTS.has(firstSegment);
  const needsAuth = !isPublicRoute && firstSegment !== '(tabs)';

  useEffect(() => {
    if (loading) return;

    if (!user && needsAuth) {
      router.replace('/login');
      return;
    }

    if (user) {
      const isAccessingAdmin = firstSegment === 'admin';
      const isAccessingApoteker = firstSegment === 'apoteker';

      if (isAccessingAdmin && user.role !== 'admin') {
        router.replace('/(tabs)');
      } else if (isAccessingApoteker && user.role !== 'apoteker' && user.role !== 'admin') {
        router.replace('/(tabs)');
      } else if (firstSegment === 'login') {
        if (user.role === 'admin') router.replace('/admin/dashboard');
        else if (user.role === 'apoteker') router.replace('/apoteker');
        else router.replace('/(tabs)');
      }
    }
  }, [user, loading, firstSegment, needsAuth]);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#FFF' }}>
        <ActivityIndicator size="large" color="#2E8B57" />
      </View>
    );
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" options={{ redirect: true, href: '/(tabs)' } as any} />
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="admin" options={{ headerShown: false }} />
      <Stack.Screen name="apoteker" options={{ headerShown: false }} />
      <Stack.Screen name="login" options={{ headerShown: false }} />
      <Stack.Screen name="register" options={{ headerShown: false }} />
      <Stack.Screen name="ubah-kata-sandi" options={{ headerShown: false }} />
      <Stack.Screen name="edit-profil" options={{ headerShown: false }} />
      <Stack.Screen name="chat-room" options={{ headerShown: false }} />
      <Stack.Screen name="payment-qris" options={{ headerShown: false }} />
      <Stack.Screen name="notifikasi" options={{ headerShown: true }} />
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
