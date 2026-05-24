import { Stack, useRouter, useRootNavigationState, useSegments } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import { AuthProvider, useAuth } from '../context/AuthContext';
import { CartProvider } from '../context/CartContext';

SplashScreen.preventAutoHideAsync().catch(() => {});

export const unstable_settings = {
  initialRouteName: '(tabs)',
};

const PUBLIC_SEGMENTS = new Set([
  'login',
  'register',
  'lupa-password',
  'modal',
]);

function InitialLayout() {
  const { user, loading } = useAuth();
  const segments = useSegments();
  const router = useRouter();
  const navigationState = useRootNavigationState();
  const isNavigationReady = Boolean(navigationState?.key);

  const firstSegment = segments[0] ?? '';
  const isPublicRoute = PUBLIC_SEGMENTS.has(firstSegment);
  const needsAuth = !isPublicRoute && firstSegment !== '(tabs)';

  useEffect(() => {
    if (!loading && isNavigationReady) {
      SplashScreen.hideAsync().catch(() => {});
    }
  }, [loading, isNavigationReady]);

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

  if (!isNavigationReady) {
    return null;
  }

  return (
    <Stack screenOptions={{ headerShown: false }} initialRouteName="(tabs)">
      <Stack.Screen name="index" redirect href="/(tabs)" />
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="admin" options={{ headerShown: false }} />
      <Stack.Screen name="apoteker" options={{ headerShown: false }} />
      <Stack.Screen name="login" options={{ headerShown: false }} />
      <Stack.Screen name="register" options={{ headerShown: false }} />
      <Stack.Screen name="ubah-kata-sandi" options={{ headerShown: false }} />
      <Stack.Screen name="edit-profil" options={{ headerShown: false }} />
      <Stack.Screen name="chat-room" options={{ headerShown: false }} />
      <Stack.Screen name="payment-qris" options={{ headerShown: false }} />
      <Stack.Screen name="payment-transfer" options={{ headerShown: false }} />
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
