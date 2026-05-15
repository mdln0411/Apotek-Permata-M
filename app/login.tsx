import { Ionicons } from '@expo/vector-icons';
import { router, Stack } from 'expo-router';
import React from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function LoginScreen() {
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
                    />

                    <Text style={styles.inputLabel}>Password</Text>
                    <TextInput
                        style={styles.textInput}
                        placeholder="••••••••"
                        placeholderTextColor="#999"
                        secureTextEntry
                    />

                    <TouchableOpacity style={styles.forgotPasswordBtn} onPress={() => router.push('/lupa-password' as any)}>
                        <Text style={styles.forgotPasswordText}>Lupa password?</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.primaryButton}>
                        <Text style={styles.primaryButtonText}>Masuk</Text>
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
                    <Text style={styles.demoItem}>• Member: user@mail.com</Text>
                    <Text style={styles.demoItem}>• Apoteker: apoteker@mail.com</Text>
                    <Text style={styles.demoItem}>• Admin: admin@mail.com</Text>
                    <Text style={styles.demoNote}>Password: bebas (demo mode)</Text>
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
    primaryButtonText: { color: '#FFF', fontSize: 16, fontWeight: 'bold' },
    registerRow: { flexDirection: 'row', justifyContent: 'center', marginTop: 20 },
    registerText: { color: '#555', fontSize: 14 },
    registerLink: { color: '#2E8B57', fontSize: 14, fontWeight: 'bold' },
    dividerContainer: { flexDirection: 'row', alignItems: 'center', marginVertical: 24 },
    dividerLine: { flex: 1, height: 1, backgroundColor: '#DCEBDE' },
    dividerText: { marginHorizontal: 12, color: '#555', fontSize: 14 },
    demoTitle: { fontSize: 14, fontWeight: 'bold', color: '#333', marginBottom: 12 },
    demoItem: { fontSize: 14, color: '#444', marginBottom: 8 },
    demoNote: { fontSize: 12, color: '#777', marginTop: 12 }
});