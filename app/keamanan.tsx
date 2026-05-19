import { Feather, Ionicons } from '@expo/vector-icons';
import { router, Stack } from 'expo-router';
import React, { useState } from 'react';
import { Platform, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function KeamananScreen() {
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const [showCurrent, setShowCurrent] = useState(false);
    const [showNew, setShowNew] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);

    return (
        <SafeAreaView style={styles.container}>
            <Stack.Screen options={{ headerShown: false }} />

            {/* Header Hijau */}
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

                <View style={styles.form}>
                    {/* Password Saat Ini */}
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
                                <Feather name={showCurrent ? "eye" : "eye-off"} size={18} color="#999" />
                            </TouchableOpacity>
                        </View>
                    </View>

                    {/* Password Baru */}
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
                                <Feather name={showNew ? "eye" : "eye-off"} size={18} color="#999" />
                            </TouchableOpacity>
                        </View>
                    </View>

                    {/* Konfirmasi Password */}
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
                                <Feather name={showConfirm ? "eye" : "eye-off"} size={18} color="#999" />
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>

                <TouchableOpacity 
                    style={styles.saveBtn} 
                    onPress={() => {
                        if (router.canGoBack()) {
                            router.back();
                        } else {
                            router.replace('/(tabs)/profil' as any);
                        }
                    }}
                >
                    <Text style={styles.saveBtnText}>Perbarui Kata Sandi</Text>
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
        borderBottomRightRadius: 20
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
        marginBottom: 30
    },
    infoText: { flex: 1, fontSize: 13, color: '#444', lineHeight: 18 },
    form: { gap: 24 },
    inputGroup: { gap: 8 },
    label: { fontSize: 13, fontWeight: 'bold', color: '#333' },
    passwordWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        borderBottomWidth: 1,
        borderBottomColor: '#EEE',
        paddingBottom: 4
    },
    input: { flex: 1, paddingVertical: 8, fontSize: 15, color: '#333' },
    saveBtn: {
        backgroundColor: '#2E8B57',
        paddingVertical: 16,
        borderRadius: 14,
        alignItems: 'center',
        marginTop: 50
    },
    saveBtnText: { color: '#FFF', fontSize: 16, fontWeight: 'bold' }
});