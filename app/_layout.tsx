import { Stack, useRouter, useSegments } from 'expo-router';
import { AuthProvider, useAuth } from '../context/AuthContext';
import { CartProvider } from '../context/CartContext';
import { useEffect } from 'react';
import { ActivityIndicator, View } from 'react-native';

function InitialLayout() {
  const { user, loading } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  const protectedRoutes = [
    'admin',
    'apoteker',
    'checkout',
    'chat-room',
    'edit-profil',
    'detail-pesanan',
    'ubah-kata-sandi',
    'keamanan',
    'upload-resep',
    'pengingat',
    'konsultasi',
    'notifikasi'
  ];
  const inAuthGroup = protectedRoutes.includes(segments[0]);

  useEffect(() => {
    if (loading) return;

    if (!user && inAuthGroup) {
      // Jika tidak login tapi mencoba akses halaman terproteksi
      router.replace('/login');
    } else if (user) {
      // Role Guard: Cegah akses ke folder yang tidak sesuai role
      const isAccessingAdmin = segments[0] === 'admin';
      const isAccessingApoteker = segments[0] === 'apoteker';

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

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#FFF' }}>
        <ActivityIndicator size="large" color="#2E8B57" />
      </View>
    );
  }

  // Prevent rendering if the guest is attempting to access a protected route
  if (!user && inAuthGroup) {
    return null;
  }

  // Prevent rendering if the user has the wrong role
  if (user) {
    const isAccessingAdmin = segments[0] === 'admin';
    const isAccessingApoteker = segments[0] === 'apoteker';

    if (isAccessingAdmin && user.role !== 'admin') {
      return null;
    }
    if (isAccessingApoteker && user.role !== 'apoteker' && user.role !== 'admin') {
      return null;
    }
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="admin" options={{ headerShown: false }} />
      <Stack.Screen name="apoteker" options={{ headerShown: false }} />
      <Stack.Screen name="login" options={{ headerShown: false }} />
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