import ApotekLogo from '@/components/ApotekLogo';
import { Feather, Ionicons } from '@expo/vector-icons';
import * as Linking from 'expo-linking';
import { router, Stack } from 'expo-router';
import React, { useState } from 'react';
import {
    Alert,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const ADMIN_WHATSAPP = '6281264847315';
const WHATSAPP_MESSAGE = 'Halo admin, saya ingin reset password akun saya.';

export default function LupaPasswordScreen() {
    const [opening, setOpening] = useState(false);

    const openWhatsApp = async () => {
        const url = `https://wa.me/${ADMIN_WHATSAPP}?text=${encodeURIComponent(WHATSAPP_MESSAGE)}`;

        try {
            setOpening(true);
            const supported = await Linking.canOpenURL(url);
            if (!supported) {
                Alert.alert(
                    'WhatsApp tidak tersedia',
                    'Pastikan aplikasi WhatsApp sudah terpasang di perangkat Anda.',
                );
                return;
            }
            await Linking.openURL(url);
        } catch {
            Alert.alert('Gagal membuka WhatsApp', 'Silakan coba lagi atau hubungi admin secara manual.');
        } finally {
            setOpening(false);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <Stack.Screen options={{ headerShown: false }} />

            <View style={styles.header}>
                <View style={styles.headerLeft}>
                    <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                        <Ionicons name="arrow-back" size={24} color="#FFF" />
                    </TouchableOpacity>
                    <View style={styles.logoContainer}>
                        <ApotekLogo size={28} borderRadius={8} />
                        <Text style={styles.headerTitle}>Apotek Permata</Text>
                    </View>
                </View>
            </View>

            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                style={{ flex: 1 }}
            >
                <ScrollView
                    contentContainerStyle={styles.scrollContent}
                    showsVerticalScrollIndicator={false}
                >
                    <View style={styles.heroIcon}>
                        <View style={styles.heroIconInner}>
                            <Feather name="key" size={32} color="#2E8B57" />
                        </View>
                    </View>

                    <Text style={styles.mainTitle}>Lupa Kata Sandi?</Text>
                    <Text style={styles.subTitle}>
                        Reset password dilakukan oleh admin. Hubungi admin melalui WhatsApp
                        dengan pesan otomatis berikut.
                    </Text>

                    <View style={styles.card}>
                        <View style={styles.infoRow}>
                            <View style={styles.infoIconWrap}>
                                <Feather name="info" size={18} color="#2E8B57" />
                            </View>
                            <Text style={styles.infoText}>
                                Siapkan email akun Anda saat admin membalas, agar proses reset
                                lebih cepat.
                            </Text>
                        </View>

                        <View style={styles.previewBox}>
                            <Text style={styles.previewLabel}>Pesan otomatis</Text>
                            <Text style={styles.previewMessage}>"{WHATSAPP_MESSAGE}"</Text>
                        </View>

                        <TouchableOpacity
                            style={[styles.whatsappBtn, opening && styles.whatsappBtnDisabled]}
                            onPress={openWhatsApp}
                            disabled={opening}
                            activeOpacity={0.85}
                        >
                            <Ionicons name="logo-whatsapp" size={24} color="#FFF" />
                            <Text style={styles.whatsappBtnText}>
                                Hubungi Admin via WhatsApp
                            </Text>
                        </TouchableOpacity>
                    </View>

                    <TouchableOpacity
                        style={styles.backToLoginBtn}
                        onPress={() => router.replace('/login' as any)}
                    >
                        <Feather name="arrow-left" size={16} color="#2E8B57" />
                        <Text style={styles.backToLoginText}>Kembali ke Login</Text>
                    </TouchableOpacity>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F4F9F4' },
    header: {
        backgroundColor: '#2E8B57',
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 14,
    },
    headerLeft: { flexDirection: 'row', alignItems: 'center' },
    backButton: { marginRight: 12 },
    logoContainer: { flexDirection: 'row', alignItems: 'center' },
    headerTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#FFF',
        marginLeft: 8,
    },
    scrollContent: { padding: 24, paddingBottom: 40 },
    heroIcon: { alignItems: 'center', marginTop: 8, marginBottom: 20 },
    heroIconInner: {
        width: 72,
        height: 72,
        borderRadius: 36,
        backgroundColor: '#FFF',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: '#DCEBDE',
        shadowColor: '#2E8B57',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.12,
        shadowRadius: 8,
        elevation: 3,
    },
    mainTitle: {
        fontSize: 26,
        fontWeight: 'bold',
        color: '#1A2E1A',
        textAlign: 'center',
        marginBottom: 10,
    },
    subTitle: {
        fontSize: 14,
        color: '#555',
        textAlign: 'center',
        lineHeight: 22,
        marginBottom: 28,
        paddingHorizontal: 8,
    },
    card: {
        backgroundColor: '#FFF',
        borderRadius: 20,
        padding: 22,
        borderWidth: 1,
        borderColor: '#DCEBDE',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.06,
        shadowRadius: 8,
        elevation: 2,
    },
    infoRow: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        backgroundColor: '#F0FAF4',
        padding: 14,
        borderRadius: 12,
        marginBottom: 20,
        borderWidth: 1,
        borderColor: '#C8E6C9',
    },
    infoIconWrap: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: '#E8F5E9',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    infoText: { flex: 1, fontSize: 13, color: '#444', lineHeight: 20 },
    previewBox: {
        backgroundColor: '#FAFAFA',
        borderRadius: 12,
        padding: 16,
        marginBottom: 24,
        borderWidth: 1,
        borderColor: '#EEEEEE',
    },
    previewLabel: {
        fontSize: 11,
        fontWeight: '700',
        color: '#888',
        letterSpacing: 0.8,
        textTransform: 'uppercase',
        marginBottom: 8,
    },
    previewMessage: {
        fontSize: 15,
        color: '#333',
        fontStyle: 'italic',
        lineHeight: 22,
    },
    whatsappBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#25D366',
        paddingVertical: 16,
        borderRadius: 14,
        gap: 10,
        shadowColor: '#25D366',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.35,
        shadowRadius: 8,
        elevation: 4,
    },
    whatsappBtnDisabled: { opacity: 0.7 },
    whatsappBtnText: {
        color: '#FFF',
        fontSize: 16,
        fontWeight: 'bold',
    },
    backToLoginBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 28,
        gap: 8,
        paddingVertical: 12,
    },
    backToLoginText: {
        color: '#2E8B57',
        fontSize: 15,
        fontWeight: '600',
    },
});
