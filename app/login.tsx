import { login as apiLogin } from '@/api/authService';
import { useAuth } from '@/context/AuthContext';
import { Ionicons } from '@expo/vector-icons';
import { router, Stack } from 'expo-router';
import React, { useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';

export default function LoginScreen() {
    const { login } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const handleLogin = async () => {
        if (!email || !password) {
            Alert.alert('Error', 'Email dan password harus diisi');
            return;
        }

        try {
            setLoading(true);
            console.log('Mencoba login ke:', email);
            const res = await apiLogin({ email, password });
            console.log('Login Berhasil:', res.data.role);
            
            // Simpan ke context
            await login(res.data, res.access_token);
            
            const target = res.data.role === 'admin' ? '/admin/dashboard' : (res.data.role === 'apoteker' ? '/apoteker' : '/(tabs)');
            
            router.replace({
                pathname: '/success-action',
                params: {
                    title: 'Login Berhasil!',
                    message: `Selamat datang kembali, ${res.data.name}. Anda telah berhasil masuk sebagai ${res.data.role}.`,
                    target: target,
                    buttonText: 'Masuk ke Dashboard'
                }
            } as any);


        } catch (e: any) {
            console.error('Error Login Detail:', e);
            console.log('Response Error:', e.response?.data);

            const errorMsg = e.response?.data?.message || e.message || 'Terjadi kesalahan koneksi ke server';
            Alert.alert('Login Gagal', errorMsg);
        } finally {
            setLoading(false);
        }
    };

    // Fungsi helper untuk demo login
    const fillDemo = (e: string) => {
        setEmail(e);
        setPassword('password');
    };


    return (
        <SafeAreaView style={styles.container}>
            <Stack.Screen options={{ headerShown: false }} />

            {/* Header */}
            <View style={styles.header}>
                <View style={styles.logoContainer}>
                    <Ionicons name="medical" size={24} color="#FFF" />
                    <Text style={styles.headerTitle}>Apotek Permata</Text>
                </View>
                <TouchableOpacity onPress={() => router.push('/register' as any)}>
                    <Text style={styles.headerLink}>Daftar</Text>
                </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

                {/* Logo & Title */}
                <View style={styles.titleContainer}>
                    <View style={styles.iconWrapper}>
                        <Ionicons name="medical" size={48} color="#2E8B57" />
                    </View>
                    <Text style={styles.mainTitle}>Masuk ke Akun</Text>
                    <Text style={styles.subTitle}>Masuk untuk melanjutkan pembelian</Text>
                </View>

                {/* Form Card */}
                <View style={styles.card}>
                    <Text style={styles.inputLabel}>Email</Text>
                    <TextInput
                        style={styles.textInput}
                        placeholder="email@example.com"
                        placeholderTextColor="#999"
                        keyboardType="email-address"
                        value={email}
                        onChangeText={setEmail}
                        autoCapitalize="none"
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

                    <TouchableOpacity style={styles.forgotPasswordBtn} onPress={() => router.push('/lupa-password' as any)}>
                        <Text style={styles.forgotPasswordText}>Lupa password?</Text>
                    </TouchableOpacity>

                    <TouchableOpacity 
                        style={[styles.primaryButton, loading && styles.disabledButton]} 
                        onPress={handleLogin}
                        disabled={loading}
                    >
                        {loading ? (
                            <ActivityIndicator color="#FFF" />
                        ) : (
                            <Text style={styles.primaryButtonText}>Masuk</Text>
                        )}
                    </TouchableOpacity>

                    <View style={styles.registerRow}>
                        <Text style={styles.registerText}>Belum punya akun? </Text>
                        <TouchableOpacity onPress={() => router.push('/register' as any)}>
                            <Text style={styles.registerLink}>Daftar sekarang</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Divider */}
                <View style={styles.dividerContainer}>
                    <View style={styles.dividerLine} />
                    <Text style={styles.dividerText}>Demo Akun</Text>
                    <View style={styles.dividerLine} />
                </View>

                {/* Demo Info Card */}
                <View style={styles.card}>
                    <Text style={styles.demoTitle}>Coba login sebagai:</Text>
                    <TouchableOpacity style={styles.demoBtn} onPress={() => fillDemo('member@test.com')}>
                        <Text style={styles.demoItem}>• Member: member@test.com</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.demoBtn} onPress={() => fillDemo('apoteker@test.com')}>
                        <Text style={styles.demoItem}>• Apoteker: apoteker@test.com</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.demoBtn} onPress={() => fillDemo('admin@permata.com')}>
                        <Text style={styles.demoItem}>• Admin: admin@permata.com</Text>
                    </TouchableOpacity>
                    <Text style={styles.demoNote}>Password: password</Text>
                </View>


            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F4F9F4' },
    header: { backgroundColor: '#2E8B57', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingTop: 50, paddingBottom: 16 },
    logoContainer: { flexDirection: 'row', alignItems: 'center' },
    headerTitle: { fontSize: 18, fontWeight: 'bold', color: '#FFF', marginLeft: 8 },
    headerLink: { color: '#FFF', fontSize: 14, fontWeight: 'bold' },
    scrollContent: { padding: 20, paddingBottom: 40 },
    titleContainer: { alignItems: 'center', marginTop: 20, marginBottom: 24 },
    iconWrapper: { backgroundColor: '#FFF', width: 80, height: 80, borderRadius: 40, justifyContent: 'center', alignItems: 'center', marginBottom: 16, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 2 },
    mainTitle: { fontSize: 24, fontWeight: 'bold', color: '#333', marginBottom: 8 },
    subTitle: { fontSize: 14, color: '#555' },
    card: { backgroundColor: '#FFF', borderRadius: 16, padding: 20, borderWidth: 1, borderColor: '#DCEBDE' },
    inputLabel: { fontSize: 14, fontWeight: '500', color: '#333', marginBottom: 8, marginTop: 12 },
    textInput: { height: 48, borderWidth: 1, borderColor: '#E0E0E0', borderRadius: 8, paddingHorizontal: 16, fontSize: 15, color: '#333', backgroundColor: '#FAFAFA' },
    forgotPasswordBtn: { alignSelf: 'flex-end', marginTop: 12, marginBottom: 20 },
    forgotPasswordText: { color: '#2E8B57', fontSize: 14, fontWeight: '500' },
    primaryButton: { backgroundColor: '#2E8B57', height: 48, borderRadius: 8, justifyContent: 'center', alignItems: 'center' },
    disabledButton: { backgroundColor: '#A5D6A7' },
    primaryButtonText: { color: '#FFF', fontSize: 16, fontWeight: 'bold' },
    registerRow: { flexDirection: 'row', justifyContent: 'center', marginTop: 20 },
    registerText: { color: '#555', fontSize: 14 },
    registerLink: { color: '#2E8B57', fontSize: 14, fontWeight: 'bold' },
    dividerContainer: { flexDirection: 'row', alignItems: 'center', marginVertical: 24 },
    dividerLine: { flex: 1, height: 1, backgroundColor: '#DCEBDE' },
    dividerText: { marginHorizontal: 12, color: '#555', fontSize: 14 },
    demoTitle: { fontSize: 14, fontWeight: 'bold', color: '#333', marginBottom: 12 },
    demoBtn: { paddingVertical: 4 },
    demoItem: { fontSize: 14, color: '#444', marginBottom: 8 },
    demoNote: { fontSize: 12, color: '#777', marginTop: 12 }
});