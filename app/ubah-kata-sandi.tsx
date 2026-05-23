import { changePassword } from '@/api/authService';
import { SuccessToast } from '@/components/SuccessToast';
import { useAuth } from '@/context/AuthContext';
import { showAppAlert } from '@/utils/alert';
import { Feather, Ionicons } from '@expo/vector-icons';
import { router, Stack } from 'expo-router';
import React, { useState } from 'react';
import {
    ActivityIndicator,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
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
    const [feedback, setFeedback] = useState<{ type: 'error' | 'success'; text: string } | null>(null);
    const [toastVisible, setToastVisible] = useState(false);
    const [toastMessage, setToastMessage] = useState('');

    const goBack = () => {
        if (router.canGoBack()) {
            router.back();
        } else {
            router.replace('/(tabs)/profil');
        }
    };

    const handleUpdate = async () => {
        setFeedback(null);

        if (!user) {
            setFeedback({ type: 'error', text: 'Silakan login terlebih dahulu.' });
            return;
        }

        if (!oldPassword.trim() || !newPassword || !confirmPassword) {
            setFeedback({ type: 'error', text: 'Semua kolom wajib diisi.' });
            return;
        }

        if (newPassword.length < 8) {
            setFeedback({ type: 'error', text: 'Kata sandi baru minimal 8 karakter.' });
            return;
        }

        if (newPassword !== confirmPassword) {
            setFeedback({ type: 'error', text: 'Konfirmasi kata sandi baru tidak cocok.' });
            return;
        }

        if (oldPassword === newPassword) {
            setFeedback({ type: 'error', text: 'Kata sandi baru harus berbeda dari kata sandi lama.' });
            return;
        }

        setLoading(true);
        try {
            const res = await changePassword({
                old_password: oldPassword,
                new_password: newPassword,
                new_password_confirmation: confirmPassword,
            });

            setOldPassword('');
            setNewPassword('');
            setConfirmPassword('');
            setFeedback({ type: 'success', text: res.message || 'Kata sandi berhasil diperbarui.' });
            setToastMessage(res.message || 'Kata sandi berhasil diperbarui!');
            setToastVisible(true);

            setTimeout(() => {
                goBack();
            }, 1500);
        } catch (error: any) {
            let msg = 'Gagal mengubah kata sandi';
            if (error.code === 'ECONNABORTED' || error.message === 'Network Error') {
                msg =
                    'Tidak dapat terhubung ke server. Pastikan backend Laravel aktif.';
            } else if (error.response?.status === 401) {
                msg = 'Sesi login habis. Silakan login ulang.';
            } else if (error.response?.data?.message) {
                msg = error.response.data.message;
            } else if (error.response?.data?.errors) {
                const errors = error.response.data.errors;
                const firstKey = Object.keys(errors)[0];
                msg = errors[firstKey][0];
            }
            setFeedback({ type: 'error', text: msg });
            showAppAlert('Gagal', msg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <SafeAreaView style={styles.container} edges={['top', 'left', 'right', 'bottom']}>
            <Stack.Screen options={{ headerShown: false }} />
            <SuccessToast
                visible={toastVisible}
                message={toastMessage}
                onClose={() => setToastVisible(false)}
            />

            <View style={styles.header}>
                <TouchableOpacity onPress={goBack} style={styles.backBtn} activeOpacity={0.7}>
                    <Ionicons name="chevron-back" size={24} color="#333" />
                </TouchableOpacity>
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

                    {feedback ? (
                        <View
                            style={[
                                styles.feedbackBox,
                                feedback.type === 'error' ? styles.feedbackError : styles.feedbackSuccess,
                            ]}
                        >
                            <Feather
                                name={feedback.type === 'error' ? 'alert-circle' : 'check-circle'}
                                size={18}
                                color={feedback.type === 'error' ? '#D32F2F' : '#2E8B57'}
                            />
                            <Text
                                style={[
                                    styles.feedbackText,
                                    feedback.type === 'error' ? styles.feedbackTextError : styles.feedbackTextSuccess,
                                ]}
                            >
                                {feedback.text}
                            </Text>
                        </View>
                    ) : null}

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
                                editable={!loading}
                            />
                            <TouchableOpacity onPress={() => setShowOld(!showOld)} hitSlop={8}>
                                <Feather name={showOld ? 'eye' : 'eye-off'} size={18} color="#999" />
                            </TouchableOpacity>
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
                                editable={!loading}
                            />
                            <TouchableOpacity onPress={() => setShowNew(!showNew)} hitSlop={8}>
                                <Feather name={showNew ? 'eye' : 'eye-off'} size={18} color="#999" />
                            </TouchableOpacity>
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
                                editable={!loading}
                            />
                            <TouchableOpacity onPress={() => setShowConfirm(!showConfirm)} hitSlop={8}>
                                <Feather name={showConfirm ? 'eye' : 'eye-off'} size={18} color="#999" />
                            </TouchableOpacity>
                        </View>
                    </View>
                </ScrollView>

                <View style={[styles.footer, { paddingBottom: Math.max(insets.bottom, 16) }]}>
                    <TouchableOpacity
                        style={[styles.updateBtn, loading && styles.disabledBtn]}
                        onPress={handleUpdate}
                        disabled={loading}
                        activeOpacity={0.85}
                    >
                        {loading ? (
                            <ActivityIndicator color="#FFF" />
                        ) : (
                            <Text style={styles.updateBtnText}>Simpan Kata Sandi Baru</Text>
                        )}
                    </TouchableOpacity>
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
        marginBottom: 16,
    },
    infoText: { flex: 1, fontSize: 13, color: '#555', lineHeight: 18 },
    feedbackBox: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        gap: 10,
        padding: 12,
        borderRadius: 12,
        marginBottom: 16,
        borderWidth: 1,
    },
    feedbackError: { backgroundColor: '#FFEBEE', borderColor: '#FFCDD2' },
    feedbackSuccess: { backgroundColor: '#E8F5E9', borderColor: '#C8E6C9' },
    feedbackText: { flex: 1, fontSize: 13, lineHeight: 18 },
    feedbackTextError: { color: '#C62828' },
    feedbackTextSuccess: { color: '#2E7D32' },
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
        zIndex: 10,
        elevation: 8,
    },
    updateBtn: {
        backgroundColor: '#2E8B57',
        paddingVertical: 16,
        borderRadius: 12,
        alignItems: 'center',
        minHeight: 52,
        justifyContent: 'center',
    },
    updateBtnText: { color: '#FFF', fontSize: 16, fontWeight: 'bold' },
    disabledBtn: { opacity: 0.7 },
});
