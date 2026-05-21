import axiosClient from '@/api/axiosClient';
import { Ionicons } from '@expo/vector-icons';
import { router, Stack } from 'expo-router';
import React, { useState } from 'react';
import { 
    ActivityIndicator, 
    Alert, 
    Image,
    SafeAreaView, 
    ScrollView, 
    StyleSheet, 
    Text, 
    TextInput, 
    TouchableOpacity, 
    View 
} from 'react-native';

export default function RegisterScreen() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const handleRegister = async () => {
        if (!name || !email || !password || !confirmPassword) {
            Alert.alert('Peringatan', 'Semua kolom harus diisi.');
            return;
        }

        if (password.length < 8) {
            Alert.alert('Peringatan', 'Password harus minimal 8 karakter.');
            return;
        }

        if (password !== confirmPassword) {
            Alert.alert('Peringatan', 'Konfirmasi password tidak cocok.');
            return;
        }

        try {
            setLoading(true);
            const response = await axiosClient.post('/api/auth/register', {
                name,
                email,
                password,
            });

            router.replace({
                pathname: '/success-action',
                params: {
                    title: 'Akun Berhasil Dibuat!',
                    message: `Selamat! Akun atas nama ${name} telah berhasil terdaftar di Apotek Permata. Silakan masuk untuk mulai berbelanja.`,
                    target: '/login',
                    buttonText: 'Masuk Sekarang'
                }
            } as any);
        } catch (error: any) {
            console.error('Registration error:', error);
            const errorMsg = error.response?.data?.message || error.message || 'Terjadi kesalahan saat mendaftar.';
            Alert.alert('Pendaftaran Gagal', errorMsg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <Stack.Screen options={{ headerShown: false }} />

            <View style={styles.header}>
                <View style={styles.logoContainer}>
                    <Image 
                        source={require('../assets/images/logoimk.png')} 
                        style={{ width: 28, height: 28 }}
                        resizeMode="contain"
                    />
                    <Text style={styles.headerTitle}>Apotek Permata</Text>
                </View>
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

                <View style={styles.titleContainer}>
                    <Text style={styles.mainTitle}>Daftar Akun Baru</Text>
                    <Text style={styles.subTitle}>Buat akun untuk mulai berbelanja</Text>
                </View>

                <View style={styles.card}>
                    <Text style={styles.inputLabel}>Nama Lengkap</Text>
                    <TextInput 
                        style={styles.textInput} 
                        placeholder="Nama Anda" 
                        placeholderTextColor="#999" 
                        value={name}
                        onChangeText={setName}
                    />

                    <Text style={styles.inputLabel}>Email</Text>
                    <TextInput 
                        style={styles.textInput} 
                        placeholder="email@example.com" 
                        placeholderTextColor="#999" 
                        keyboardType="email-address" 
                        autoCapitalize="none"
                        value={email}
                        onChangeText={setEmail}
                    />

                    <Text style={styles.inputLabel}>Password</Text>
                    <TextInput 
                        style={styles.textInput} 
                        placeholder="••••••••" 
                        placeholderTextColor="#999" 
                        secureTextEntry 
                        value={password}
                        onChangeText={setPassword}
                    />

                    <Text style={styles.inputLabel}>Konfirmasi Password</Text>
                    <TextInput 
                        style={styles.textInput} 
                        placeholder="••••••••" 
                        placeholderTextColor="#999" 
                        secureTextEntry 
                        value={confirmPassword}
                        onChangeText={setConfirmPassword}
                    />

                    <TouchableOpacity 
                        style={[styles.primaryButton, loading && styles.disabledButton]}
                        onPress={handleRegister}
                        disabled={loading}
                    >
                        {loading ? (
                            <ActivityIndicator color="#FFF" />
                        ) : (
                            <Text style={styles.primaryButtonText}>Daftar</Text>
                        )}
                    </TouchableOpacity>

                    <View style={styles.loginRow}>
                        <Text style={styles.loginText}>Sudah punya akun? </Text>
                        <TouchableOpacity onPress={() => router.push('/login' as any)}>
                            <Text style={styles.loginLink}>Masuk</Text>
                        </TouchableOpacity>
                    </View>
                </View>

            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F4F9F4' },
    header: { backgroundColor: '#2E8B57', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingTop: 50, paddingBottom: 16 },
    headerLeft: { flexDirection: 'row', alignItems: 'center' },
    backButton: { marginRight: 12 },
    logoContainer: { flexDirection: 'row', alignItems: 'center' },
    headerTitle: { fontSize: 18, fontWeight: 'bold', color: '#FFF', marginLeft: 8 },
    scrollContent: { padding: 20, paddingBottom: 40 },
    titleContainer: { alignItems: 'center', marginTop: 20, marginBottom: 24 },
    mainTitle: { fontSize: 24, fontWeight: 'bold', color: '#333', marginBottom: 8 },
    subTitle: { fontSize: 14, color: '#555' },
    card: { backgroundColor: '#FFF', borderRadius: 16, padding: 20, borderWidth: 1, borderColor: '#DCEBDE' },
    inputLabel: { fontSize: 14, fontWeight: '500', color: '#333', marginBottom: 8, marginTop: 12 },
    textInput: { height: 48, borderWidth: 1, borderColor: '#E0E0E0', borderRadius: 8, paddingHorizontal: 16, fontSize: 15, color: '#333', backgroundColor: '#FAFAFA' },
    primaryButton: { backgroundColor: '#2E8B57', height: 48, borderRadius: 8, justifyContent: 'center', alignItems: 'center', marginTop: 24 },
    disabledButton: { backgroundColor: '#A5D6A7' },
    primaryButtonText: { color: '#FFF', fontSize: 16, fontWeight: 'bold' },
    loginRow: { flexDirection: 'row', justifyContent: 'center', marginTop: 20 },
    loginText: { color: '#555', fontSize: 14 },
    loginLink: { color: '#2E8B57', fontSize: 14, fontWeight: 'bold' }
});