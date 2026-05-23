import { changePassword } from '@/api/authService';
import { useAuth } from '@/context/AuthContext';
import { Feather, Ionicons } from '@expo/vector-icons';
import { router, Stack } from 'expo-router';
import React, { useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    KeyboardAvoidingView,
    Platform,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    View,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

export default function UbahKataSandiScreen() {
    const { user } = useAuth();
    const insets = useSafeAreaInsets();
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [showOld, setShowOld] = useState(false);
    const [showNew, setShowNew] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);

    const handleUpdate = async () => {
        if (!user) {
            Alert.alert('Peringatan', 'Silakan login terlebih dahulu', [
                { text: 'Login', onPress: () => router.replace('/login') },
            ]);
            return;
        }

        if (!oldPassword.trim() || !newPassword || !confirmPassword) {
            Alert.alert('Peringatan', 'Semua kolom wajib diisi');
            return;
        }

        setLoading(true);
        try {
            const res = await changePassword({
                old_password: oldPassword,
                new_password: newPassword,
                new_password_confirmation: confirmPassword,
            });
            Alert.alert('Berhasil', res.message || 'Kata sandi Anda telah diperbarui', [
                {
                    text: 'OK',
                    onPress: () => {
                        setOldPassword('');
                        setNewPassword('');
                        setConfirmPassword('');
                        if (router.canGoBack()) {
                            router.back();
                        } else {
                            router.replace('/(tabs)/profil');
                        }
                    },
                },
            ]);
        } catch (error: any) {
            let msg = 'Gagal mengubah kata sandi';
            if (error.code === 'ECONNABORTED' || error.message === 'Network Error') {
                msg =
                    'Tidak dapat terhubung ke server. Pastikan backend Laravel aktif dan IP di axiosClient benar.';
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

    const goBack = () => {
        if (router.canGoBack()) {
            router.back();
        } else {
            router.replace('/(tabs)/profil');
        }
    };

    return (
        <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
            <Stack.Screen options={{ headerShown: false }} />

            <View style={styles.header}>
                <Pressable onPress={goBack} style={styles.backBtn} hitSlop={12}>
                    <Ionicons name="chevron-back" size={24} color="#333" />
                </Pressable>
                <Text style={styles.headerTitle}>Ubah Kata Sandi</Text>
                <View style={{ width: 40 }} />
            </View>

            <KeyboardAvoidingView
                style={styles.flex}
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                keyboardVerticalOffset={Platform.OS === 'ios' ? 10 : 0}
            >
                <ScrollView
                    style={styles.flex}
                    contentContainerStyle={styles.scrollContent}
                    keyboardShouldPersistTaps="handled"
                    showsVerticalScrollIndicator={false}
                >
                    <View style={styles.infoBox}>
                        <Ionicons name="lock-closed-outline" size={30} color="#2E8B57" />
                        <Text style={styles.infoText}>
                            Kata sandi lama harus sesuai akun Anda. Kata sandi baru minimal 8 karakter dan
                            harus sama dengan konfirmasi.
                        </Text>
                    </View>

                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Kata Sandi Lama</Text>
                        <View style={styles.inputWrapper}>
                            <TextInput
                                style={styles.input}
                                value={oldPassword}
                                onChangeText={setOldPassword}
                                secureTextEntry={!showOld}
                                placeholder="Masukkan kata sandi lama"
                                autoCapitalize="none"
                                autoCorrect={false}
                            />
                            <Pressable onPress={() => setShowOld(!showOld)} hitSlop={8}>
                                <Feather name={showOld ? 'eye' : 'eye-off'} size={18} color="#999" />
                            </Pressable>
                        </View>
                    </View>

                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Kata Sandi Baru</Text>
                        <View style={styles.inputWrapper}>
                            <TextInput
                                style={styles.input}
                                value={newPassword}
                                onChangeText={setNewPassword}
                                secureTextEntry={!showNew}
                                placeholder="Minimal 8 karakter"
                                autoCapitalize="none"
                                autoCorrect={false}
                            />
                            <Pressable onPress={() => setShowNew(!showNew)} hitSlop={8}>
                                <Feather name={showNew ? 'eye' : 'eye-off'} size={18} color="#999" />
                            </Pressable>
                        </View>
                    </View>

                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Konfirmasi Kata Sandi Baru</Text>
                        <View style={styles.inputWrapper}>
                            <TextInput
                                style={styles.input}
                                value={confirmPassword}
                                onChangeText={setConfirmPassword}
                                secureTextEntry={!showConfirm}
                                placeholder="Ulangi kata sandi baru"
                                autoCapitalize="none"
                                autoCorrect={false}
                            />
                            <Pressable onPress={() => setShowConfirm(!showConfirm)} hitSlop={8}>
                                <Feather name={showConfirm ? 'eye' : 'eye-off'} size={18} color="#999" />
                            </Pressable>
                        </View>
                    </View>
                </ScrollView>

                {/* Tombol di footer tetap — tidak tertutup tab bar */}
                <View style={[styles.footer, { paddingBottom: Math.max(insets.bottom, 16) }]}>
                    <Pressable
                        style={({ pressed }) => [
                            styles.updateBtn,
                            loading && styles.disabledBtn,
                            pressed && !loading && styles.updateBtnPressed,
                        ]}
                        onPress={handleUpdate}
                        disabled={loading}
                    >
                        {loading ? (
                            <ActivityIndicator color="#FFF" />
                        ) : (
                            <Text style={styles.updateBtnText}>Simpan Kata Sandi Baru</Text>
                        )}
                    </Pressable>
                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#FFF' },
    flex: { flex: 1 },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#EEE',
    },
    backBtn: { width: 40, height: 40, justifyContent: 'center' },
    headerTitle: { fontSize: 18, fontWeight: 'bold', color: '#333' },
    scrollContent: { padding: 20, paddingBottom: 24 },
    infoBox: {
        flexDirection: 'row',
        backgroundColor: '#F0F4F0',
        padding: 16,
        borderRadius: 16,
        alignItems: 'center',
        gap: 12,
        marginBottom: 24,
    },
    infoText: { flex: 1, fontSize: 13, color: '#555', lineHeight: 18 },
    inputGroup: { marginBottom: 20 },
    label: { fontSize: 14, fontWeight: 'bold', color: '#555', marginBottom: 8 },
    inputWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F9F9F9',
        borderRadius: 12,
        paddingHorizontal: 16,
        height: 52,
        borderWidth: 1,
        borderColor: '#EEE',
    },
    input: { flex: 1, fontSize: 15, color: '#333' },
    footer: {
        paddingHorizontal: 20,
        paddingTop: 12,
        borderTopWidth: 1,
        borderTopColor: '#EEE',
        backgroundColor: '#FFF',
    },
    updateBtn: {
        backgroundColor: '#2E8B57',
        paddingVertical: 16,
        borderRadius: 12,
        alignItems: 'center',
        minHeight: 52,
        justifyContent: 'center',
    },
    updateBtnPressed: { opacity: 0.85 },
    updateBtnText: { color: '#FFF', fontSize: 16, fontWeight: 'bold' },
    disabledBtn: { opacity: 0.7 },
});
