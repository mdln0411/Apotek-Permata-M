import { Stack, useRouter, useRootNavigationState, useSegments } from 'expo-router';
import type { ErrorBoundaryProps } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { AuthProvider, useAuth } from '../context/AuthContext';
import { CartProvider } from '../context/CartContext';

/** Menangkap crash route — menggantikan layar "Something went wrong" Expo Go */
export function ErrorBoundary({ error, retry }: ErrorBoundaryProps) {
  return (
    <View style={ebStyles.container}>
      <Text style={ebStyles.title}>Aplikasi terhenti</Text>
      <Text style={ebStyles.message}>{error.message}</Text>
      <Text style={ebStyles.hint}>
        Tutup Expo Go → jalankan: npx expo start -c --port 8082{'\n'}
        Pastikan backend: php artisan serve --host=0.0.0.0 --port=8000
      </Text>
      <TouchableOpacity style={ebStyles.button} onPress={retry}>
        <Text style={ebStyles.buttonText}>Coba lagi</Text>
      </TouchableOpacity>
    </View>
  );
}

const ebStyles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
    backgroundColor: '#F0F4F7',
  },
  title: { fontSize: 20, fontWeight: '700', color: '#2C3E50', marginBottom: 8 },
  message: { fontSize: 13, color: '#E74C3C', textAlign: 'center', marginBottom: 12 },
  hint: { fontSize: 13, color: '#7F8C8D', textAlign: 'center', lineHeight: 20, marginBottom: 20 },
  button: {
    backgroundColor: '#2E8B57',
    paddingHorizontal: 28,
    paddingVertical: 14,
    borderRadius: 10,
  },
  buttonText: { color: '#FFF', fontWeight: '600', fontSize: 16 },
});

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
      <Stack.Screen name="index" options={{ headerShown: false }} />
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
