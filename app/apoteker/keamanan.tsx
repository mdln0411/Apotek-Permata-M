import { changePassword } from '@/api/authService';
import { Ionicons } from '@expo/vector-icons';
import { Stack, useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    KeyboardAvoidingView,
    Platform,
    Pressable,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TextInput,
    View,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
const THEME = {
    primary: '#2E8B57',
    white: '#FFFFFF',
    textDark: '#2C3E50',
    textMuted: '#7F8C8D',
    border: '#E8ECEF',
};

export default function KeamananSandi() {
    const router = useRouter();
    const insets = useSafeAreaInsets();
    const [loading, setLoading] = useState(false);
    const [passwords, setPasswords] = useState({
        current: '',
        new: '',
        confirm: '',
    });

    const handleUpdatePassword = async () => {
        if (!passwords.current || !passwords.new || !passwords.confirm) {
            Alert.alert('Peringatan', 'Semua kolom wajib diisi');
            return;
        }

        setLoading(true);
        try {
            const res = await changePassword({
                old_password: passwords.current,
                new_password: passwords.new,
                new_password_confirmation: passwords.confirm,
            });
            Alert.alert('Berhasil', res.message || 'Kata sandi Anda telah diperbarui', [
                {
                    text: 'OK',
                    onPress: () => {
                        setPasswords({ current: '', new: '', confirm: '' });
                        router.back();
                    },
                },
            ]);
        } catch (error: any) {
            let msg = 'Gagal memperbarui kata sandi';
            if (error.code === 'ECONNABORTED' || error.message === 'Network Error') {
                msg = 'Tidak dapat terhubung ke server. Pastikan backend Laravel aktif.';
            } else if (error.response?.status === 401) {
                msg = 'Sesi login habis. Silakan login ulang.';
            } else if (error.response?.data?.message) {
                msg = error.response.data.message;
            } else if (error.response?.data?.errors) {
                const errors = error.response.data.errors;
                const firstKey = Object.keys(errors)[0];
                msg = errors[firstKey][0];
            }
            Alert.alert('Gagal', msg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
            <StatusBar barStyle="light-content" backgroundColor={THEME.primary} />
            <Stack.Screen options={{ headerShown: false }} />

            <View style={styles.header}>
                <Pressable style={styles.backBtn} onPress={() => router.back()} hitSlop={12}>
                    <Ionicons name="chevron-back" size={24} color={THEME.white} />
                </Pressable>
                <Text style={styles.headerTitle}>Keamanan Akun</Text>
                <View style={{ width: 40 }} />
            </View>

            <KeyboardAvoidingView
                style={styles.flex}
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            >
                <ScrollView
                    contentContainerStyle={styles.scrollContent}
                    keyboardShouldPersistTaps="handled"
                    showsVerticalScrollIndicator={false}
                >
                    <View style={styles.infoBox}>
                        <Ionicons name="shield-checkmark" size={40} color={THEME.primary} />
                        <Text style={styles.infoTitle}>Ubah Kata Sandi</Text>
                        <Text style={styles.infoDesc}>
                            Gunakan kata sandi yang kuat untuk menjaga keamanan akun Anda sebagai Apoteker.
                        </Text>
                    </View>

                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Kata Sandi Saat Ini</Text>
                        <View style={styles.inputWrapper}>
                            <Ionicons name="lock-closed-outline" size={20} color={THEME.textMuted} />
                            <TextInput
                                style={styles.input}
                                placeholder="Masukkan sandi lama"
                                secureTextEntry
                                value={passwords.current}
                                onChangeText={(t) => setPasswords({ ...passwords, current: t })}
                                autoCapitalize="none"
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
                                onChangeText={(t) => setPasswords({ ...passwords, new: t })}
                                autoCapitalize="none"
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
                                onChangeText={(t) => setPasswords({ ...passwords, confirm: t })}
                                autoCapitalize="none"
                            />
                        </View>
                    </View>
                </ScrollView>

                <View style={[styles.footer, { paddingBottom: Math.max(insets.bottom, 16) }]}>
                    <Pressable
                        style={({ pressed }) => [
                            styles.btnSubmit,
                            loading && { opacity: 0.7 },
                            pressed && !loading && { opacity: 0.9 },
                        ]}
                        onPress={handleUpdatePassword}
                        disabled={loading}
                    >
                        {loading ? (
                            <ActivityIndicator color={THEME.white} />
                        ) : (
                            <Text style={styles.btnText}>Simpan Perubahan</Text>
                        )}
                    </Pressable>
                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F8F9FA' },
    flex: { flex: 1 },
    header: {
        backgroundColor: THEME.primary,
        paddingTop: Platform.OS === 'android' ? 16 : 8,
        paddingBottom: 20,
        paddingHorizontal: 20,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    backBtn: { padding: 5 },
    headerTitle: { fontSize: 20, fontWeight: 'bold', color: THEME.white },
    scrollContent: { padding: 25, paddingBottom: 16 },
    infoBox: { alignItems: 'center', marginBottom: 24 },
    infoTitle: { fontSize: 22, fontWeight: 'bold', color: THEME.textDark, marginTop: 15 },
    infoDesc: { textAlign: 'center', color: THEME.textMuted, marginTop: 8, lineHeight: 20 },
    inputGroup: { marginBottom: 20 },
    label: { fontSize: 14, fontWeight: '700', color: THEME.textDark, marginBottom: 8, marginLeft: 4 },
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
    footer: {
        paddingHorizontal: 25,
        paddingTop: 12,
        borderTopWidth: 1,
        borderTopColor: THEME.border,
        backgroundColor: '#F8F9FA',
    },
    btnSubmit: {
        backgroundColor: THEME.primary,
        height: 55,
        borderRadius: 15,
        justifyContent: 'center',
        alignItems: 'center',
    },
    btnText: { color: THEME.white, fontSize: 16, fontWeight: 'bold' },
});
