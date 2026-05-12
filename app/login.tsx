import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  Pressable, 
  StyleSheet, 
  SafeAreaView, 
  StatusBar,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Dimensions
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

export default function LoginScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = () => {
    console.log('Login attempt:', email, password);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#2F8F57" />
      
      {/* Custom Navbar matching the image */}
      <View style={styles.navbar}>
        <View style={styles.navLeft}>
          <View style={styles.navLogo}>
            <Ionicons name="medical" size={24} color="#fff" />
          </View>
          <Text style={styles.navTitle}>Apotek Permata</Text>
        </View>
        <Pressable onPress={() => {}}>
          <Text style={styles.navLink}>Daftar</Text>
        </Pressable>
      </View>

      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
          {/* Header with Logo */}
          <View style={styles.header}>
            <View style={styles.mainLogo}>
              <Ionicons name="medical" size={60} color="#2F8F57" />
              <View style={styles.leafIcon}>
                <Ionicons name="leaf" size={24} color="#fff" />
              </View>
            </View>
            <Text style={styles.title}>Masuk ke Akun</Text>
            <Text style={styles.subtitle}>Masuk untuk melanjutkan pembelian</Text>
          </View>

          {/* Login Card */}
          <View style={styles.loginCard}>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Email</Text>
              <TextInput
                style={styles.input}
                placeholder="email@example.com"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Password</Text>
              <View style={styles.passwordContainer}>
                <TextInput
                  style={styles.passwordInput}
                  placeholder="••••••••"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!showPassword}
                />
                <Pressable onPress={() => setShowPassword(!showPassword)}>
                  <Ionicons 
                    name={showPassword ? "eye-off-outline" : "eye-outline"} 
                    size={20} 
                    color="#666" 
                  />
                </Pressable>
              </View>
            </View>

            <Pressable style={styles.forgotPassword}>
              <Text style={styles.forgotPasswordText}>Lupa password?</Text>
            </Pressable>

            <Pressable style={styles.loginButton} onPress={handleLogin}>
              <Text style={styles.loginButtonText}>Masuk</Text>
            </Pressable>

            <View style={styles.registerPrompt}>
              <Text style={styles.registerText}>Belum punya akun? </Text>
              <Pressable onPress={() => {}}>
                <Text style={styles.registerLink}>Daftar sekarang</Text>
              </Pressable>
            </View>
          </View>

          {/* Demo Section */}
          <View style={styles.demoSection}>
            <View style={styles.demoHeader}>
              <View style={styles.demoLine} />
              <Text style={styles.demoTitle}>Demo Akun</Text>
              <View style={styles.demoLine} />
            </View>

            <View style={styles.demoCard}>
              <Text style={styles.demoCardTitle}>Coba login sebagai:</Text>
              
              <View style={styles.demoList}>
                <Text style={styles.demoItem}>• Member: user@mail.com</Text>
                <Text style={styles.demoItem}>• Apoteker: apoteker@mail.com</Text>
                <Text style={styles.demoItem}>• Admin: admin@mail.com</Text>
              </View>

              <Text style={styles.demoFooter}>Password: bebas (demo mode)</Text>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7FAF7', // Matching the very light green background in image
  },
  navbar: {
    height: 56,
    backgroundColor: '#358A55',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  navLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  navLogo: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  navTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  navLink: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
  scrollContainer: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingTop: 40,
    paddingBottom: 40,
  },
  header: {
    alignItems: 'center',
    marginBottom: 30,
  },
  mainLogo: {
    position: 'relative',
    marginBottom: 20,
  },
  leafIcon: {
    position: 'absolute',
    top: 18,
    left: 18,
  },
  title: {
    fontSize: 26,
    fontWeight: '700',
    color: '#222',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#555',
    textAlign: 'center',
  },
  loginCard: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 24,
    borderWidth: 1,
    borderColor: '#E0EAE0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 10,
    elevation: 2,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 10,
  },
  input: {
    fontSize: 15,
    color: '#333',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#EEE',
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#EEE',
  },
  passwordInput: {
    flex: 1,
    fontSize: 15,
    color: '#333',
    paddingVertical: 8,
  },
  forgotPassword: {
    alignSelf: 'flex-end',
    marginBottom: 20,
  },
  forgotPasswordText: {
    fontSize: 14,
    color: '#4A8C66',
    fontWeight: '500',
  },
  loginButton: {
    backgroundColor: '#358A55',
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  loginButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  registerPrompt: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  registerText: {
    fontSize: 14,
    color: '#555',
  },
  registerLink: {
    fontSize: 14,
    fontWeight: '600',
    color: '#4A8C66',
  },
  demoSection: {
    marginTop: 40,
  },
  demoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  demoLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#DDD',
  },
  demoTitle: {
    marginHorizontal: 15,
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  demoCard: {
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 20,
    borderWidth: 1,
    borderColor: '#E0EAE0',
  },
  demoCardTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 20,
  },
  demoList: {
    marginBottom: 20,
    gap: 8,
  },
  demoItem: {
    fontSize: 14,
    color: '#444',
  },
  demoFooter: {
    fontSize: 13,
    color: '#666',
    marginTop: 10,
  },
});
