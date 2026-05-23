import { changePassword } from '@/api/authService';
import { SuccessToast } from '@/components/SuccessToast';
import { showAppAlert } from '@/utils/alert';
import { Feather, Ionicons } from '@expo/vector-icons';
import { router, Stack } from 'expo-router';
import React, { useState } from 'react';
import {
    ActivityIndicator,
    Platform,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';

export default function KeamananScreen() {
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [feedback, setFeedback] = useState<{ type: 'error' | 'success'; text: string } | null>(null);
    const [toastVisible, setToastVisible] = useState(false);
    const [toastMessage, setToastMessage] = useState('');

    const [showCurrent, setShowCurrent] = useState(false);
    const [showNew, setShowNew] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);

    const handleUpdate = async () => {
        setFeedback(null);

        if (!currentPassword || !newPassword || !confirmPassword) {
            setFeedback({ type: 'error', text: 'Semua kolom wajib diisi.' });
            return;
        }
        if (newPassword.length < 8) {
            setFeedback({ type: 'error', text: 'Kata sandi baru minimal 8 karakter.' });
            return;
        }
        if (newPassword !== confirmPassword) {
            setFeedback({ type: 'error', text: 'Konfirmasi kata sandi tidak cocok.' });
            return;
        }

        setLoading(true);
        try {
            const res = await changePassword({
                old_password: currentPassword,
                new_password: newPassword,
                new_password_confirmation: confirmPassword,
            });
            setCurrentPassword('');
            setNewPassword('');
            setConfirmPassword('');
            setFeedback({ type: 'success', text: res.message || 'Kata sandi berhasil diperbarui.' });
            setToastMessage(res.message || 'Kata sandi berhasil diperbarui!');
            setToastVisible(true);
            setTimeout(() => {
                if (router.canGoBack()) router.back();
                else router.replace('/(tabs)/profil' as any);
            }, 1500);
        } catch (error: any) {
            let msg = 'Gagal mengubah kata sandi';
            if (error.response?.data?.message) {
                msg = error.response.data.message;
            }
            if (error.response?.data?.errors) {
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
        <SafeAreaView style={styles.container}>
            <Stack.Screen options={{ headerShown: false }} />
            <SuccessToast
                visible={toastVisible}
                message={toastMessage}
                onClose={() => setToastVisible(false)}
            />

            <View style={styles.header}>
                <TouchableOpacity
                    onPress={() => {
                        if (router.canGoBack()) {
                            router.back();
                        } else {
                            router.replace('/(tabs)/profil' as any);
                        }
                    }}
                    style={styles.backBtn}
                >
                    <Ionicons name="chevron-back" size={24} color="#FFF" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Keamanan Akun</Text>
                <View style={{ width: 40 }} />
            </View>

            <ScrollView contentContainerStyle={styles.content}>
                <View style={styles.infoBox}>
                    <Feather name="shield" size={20} color="#2E8B57" />
                    <Text style={styles.infoText}>
                        Gunakan kata sandi yang kuat untuk menjaga keamanan akun Anda di Apotek Permata.
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
                        <Text style={styles.feedbackText}>{feedback.text}</Text>
                    </View>
                ) : null}

                <View style={styles.form}>
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Password Saat Ini</Text>
                        <View style={styles.passwordWrapper}>
                            <TextInput
                                style={styles.input}
                                value={currentPassword}
                                onChangeText={setCurrentPassword}
                                secureTextEntry={!showCurrent}
                                placeholder="Masukkan password lama"
                            />
                            <TouchableOpacity onPress={() => setShowCurrent(!showCurrent)}>
                                <Feather name={showCurrent ? 'eye' : 'eye-off'} size={18} color="#999" />
                            </TouchableOpacity>
                        </View>
                    </View>

                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Password Baru</Text>
                        <View style={styles.passwordWrapper}>
                            <TextInput
                                style={styles.input}
                                value={newPassword}
                                onChangeText={setNewPassword}
                                secureTextEntry={!showNew}
                                placeholder="Minimal 8 karakter"
                            />
                            <TouchableOpacity onPress={() => setShowNew(!showNew)}>
                                <Feather name={showNew ? 'eye' : 'eye-off'} size={18} color="#999" />
                            </TouchableOpacity>
                        </View>
                    </View>

                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Konfirmasi Password Baru</Text>
                        <View style={styles.passwordWrapper}>
                            <TextInput
                                style={styles.input}
                                value={confirmPassword}
                                onChangeText={setConfirmPassword}
                                secureTextEntry={!showConfirm}
                                placeholder="Ulangi password baru"
                            />
                            <TouchableOpacity onPress={() => setShowConfirm(!showConfirm)}>
                                <Feather name={showConfirm ? 'eye' : 'eye-off'} size={18} color="#999" />
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>

                <TouchableOpacity
                    style={[styles.saveBtn, loading && styles.disabledBtn]}
                    onPress={handleUpdate}
                    disabled={loading}
                >
                    {loading ? (
                        <ActivityIndicator color="#FFF" />
                    ) : (
                        <Text style={styles.saveBtnText}>Perbarui Kata Sandi</Text>
                    )}
                </TouchableOpacity>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#FFF' },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingTop: Platform.OS === 'ios' ? 20 : 50,
        paddingBottom: 20,
        backgroundColor: '#2E8B57',
        borderBottomLeftRadius: 20,
        borderBottomRightRadius: 20,
    },
    backBtn: { width: 40, height: 40, justifyContent: 'center' },
    headerTitle: { fontSize: 18, fontWeight: 'bold', color: '#FFF' },
    content: { padding: 20 },
    infoBox: {
        flexDirection: 'row',
        backgroundColor: '#F0F4F0',
        padding: 16,
        borderRadius: 12,
        gap: 12,
        alignItems: 'center',
        marginBottom: 30,
    },
    infoText: { flex: 1, fontSize: 13, color: '#444', lineHeight: 18 },
    feedbackBox: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        gap: 10,
        padding: 12,
        borderRadius: 12,
        marginBottom: 20,
        borderWidth: 1,
    },
    feedbackError: { backgroundColor: '#FFEBEE', borderColor: '#FFCDD2' },
    feedbackSuccess: { backgroundColor: '#E8F5E9', borderColor: '#C8E6C9' },
    feedbackText: { flex: 1, fontSize: 13, lineHeight: 18, color: '#333' },
    form: { gap: 24 },
    inputGroup: { gap: 8 },
    label: { fontSize: 13, fontWeight: 'bold', color: '#333' },
    passwordWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        borderBottomWidth: 1,
        borderBottomColor: '#EEE',
        paddingBottom: 4,
    },
    input: { flex: 1, paddingVertical: 8, fontSize: 15, color: '#333' },
    saveBtn: {
        backgroundColor: '#2E8B57',
        paddingVertical: 16,
        borderRadius: 14,
        alignItems: 'center',
        marginTop: 50,
    },
    saveBtnText: { color: '#FFF', fontSize: 16, fontWeight: 'bold' },
    disabledBtn: { opacity: 0.7 },
});
