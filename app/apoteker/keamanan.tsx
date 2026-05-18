import axiosClient from '@/api/axiosClient';
import { useAuth } from '@/context/AuthContext';
import { Ionicons } from '@expo/vector-icons';
import { Stack, useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    KeyboardAvoidingView,
    Platform,
    SafeAreaView,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';

const THEME = {
    primary: '#2E8B57',
    secondary: '#F0F9F4',
    white: '#FFFFFF',
    textDark: '#2C3E50',
    textMuted: '#7F8C8D',
    danger: '#FF5252',
    border: '#E8ECEF',
};

export default function KeamananSandi() {
    const router = useRouter();
    const { user } = useAuth();
    const [loading, setLoading] = useState(false);
    const [passwords, setPasswords] = useState({
        current: '',
        new: '',
        confirm: ''
    });

    const handleUpdatePassword = async () => {
        if (!passwords.current || !passwords.new || !passwords.confirm) {
            Alert.alert('Error', 'Semua field harus diisi');
            return;
        }

        if (passwords.new !== passwords.confirm) {
            Alert.alert('Error', 'Konfirmasi kata sandi tidak cocok');
            return;
        }

        if (passwords.new.length < 8) {
            Alert.alert('Error', 'Kata sandi baru minimal 8 karakter');
            return;
        }

        try {
            setLoading(true);
            await axiosClient.put('/api/user/password', {
                current_password: passwords.current,
                password: passwords.new,
                password_confirmation: passwords.confirm
            });
            Alert.alert('Berhasil', 'Kata sandi Anda telah diperbarui', [
                { text: 'OK', onPress: () => router.back() }
            ]);
        } catch (error: any) {
            const msg = error.response?.data?.message || 'Gagal memperbarui kata sandi. Pastikan kata sandi lama benar.';
            Alert.alert('Gagal', msg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor={THEME.primary} />
            <Stack.Screen options={{ headerShown: false }} />

            <View style={styles.header}>
                <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
                    <Ionicons name="chevron-back" size={24} color={THEME.white} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Keamanan Akun</Text>
                <View style={{ width: 40 }} />
            </View>

            <KeyboardAvoidingView 
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                style={{ flex: 1 }}
            >
                <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
                    <View style={styles.infoBox}>
                        <Ionicons name="shield-checkmark" size={40} color={THEME.primary} />
                        <Text style={styles.infoTitle}>Ubah Kata Sandi</Text>
                        <Text style={styles.infoDesc}>Gunakan kata sandi yang kuat untuk menjaga keamanan akun Anda sebagai Apoteker.</Text>
                    </View>

                    <View style={styles.form}>
                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Kata Sandi Saat Ini</Text>
                            <View style={styles.inputWrapper}>
                                <Ionicons name="lock-closed-outline" size={20} color={THEME.textMuted} />
                                <TextInput 
                                    style={styles.input}
                                    placeholder="Masukkan sandi lama"
                                    secureTextEntry
                                    value={passwords.current}
                                    onChangeText={(t) => setPasswords({...passwords, current: t})}
                                />
                            </View>
                        </View>

                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Kata Sandi Baru</Text>
                            <View style={styles.inputWrapper}>
                                <Ionicons name="key-outline" size={20} color={THEME.textMuted} />
                                <TextInput 
                                    style={styles.input}
                                    placeholder="Minimal 8 karakter"
                                    secureTextEntry
                                    value={passwords.new}
                                    onChangeText={(t) => setPasswords({...passwords, new: t})}
                                />
                            </View>
                        </View>

                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Konfirmasi Kata Sandi Baru</Text>
                            <View style={styles.inputWrapper}>
                                <Ionicons name="key-outline" size={20} color={THEME.textMuted} />
                                <TextInput 
                                    style={styles.input}
                                    placeholder="Ulangi sandi baru"
                                    secureTextEntry
                                    value={passwords.confirm}
                                    onChangeText={(t) => setPasswords({...passwords, confirm: t})}
                                />
                            </View>
                        </View>

                        <TouchableOpacity 
                            style={[styles.btnSubmit, loading && { opacity: 0.7 }]} 
                            onPress={handleUpdatePassword}
                            disabled={loading}
                        >
                            {loading ? (
                                <ActivityIndicator color={THEME.white} />
                            ) : (
                                <Text style={styles.btnText}>Simpan Perubahan</Text>
                            )}
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F8F9FA' },
    header: { 
        backgroundColor: THEME.primary, 
        paddingTop: Platform.OS === 'android' ? 60 : 40, 
        paddingBottom: 25, 
        paddingHorizontal: 20,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    backBtn: { padding: 5 },
    headerTitle: { fontSize: 20, fontWeight: 'bold', color: THEME.white },
    content: { padding: 25 },
    infoBox: { alignItems: 'center', marginBottom: 30 },
    infoTitle: { fontSize: 22, fontWeight: 'bold', color: THEME.textDark, marginTop: 15 },
    infoDesc: { textAlign: 'center', color: THEME.textMuted, marginTop: 8, lineHeight: 20 },
    form: { gap: 20 },
    inputGroup: { gap: 8 },
    label: { fontSize: 14, fontWeight: '700', color: THEME.textDark, marginLeft: 4 },
    inputWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: THEME.white,
        borderRadius: 15,
        paddingHorizontal: 15,
        height: 55,
        borderWidth: 1,
        borderColor: THEME.border,
    },
    input: { flex: 1, marginLeft: 10, fontSize: 16, color: THEME.textDark },
    btnSubmit: {
        backgroundColor: THEME.primary,
        height: 55,
        borderRadius: 15,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 10,
        elevation: 4,
        shadowColor: THEME.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8
    },
    btnText: { color: THEME.white, fontSize: 16, fontWeight: 'bold' }
});