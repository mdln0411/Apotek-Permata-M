import { Ionicons } from '@expo/vector-icons';
import { router, Stack } from 'expo-router';
import React from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function RegisterScreen() {
    return (
        <SafeAreaView style={styles.container}>
            <Stack.Screen options={{ headerShown: false }} />

            <View style={styles.header}>
                <View style={styles.logoContainer}>
                    <Ionicons name="medical" size={24} color="#FFF" />
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
                    <TextInput style={styles.textInput} placeholder="Nama Anda" placeholderTextColor="#999" />

                    <Text style={styles.inputLabel}>Email</Text>
                    <TextInput style={styles.textInput} placeholder="email@example.com" placeholderTextColor="#999" keyboardType="email-address" />

                    <Text style={styles.inputLabel}>Password</Text>
                    <TextInput style={styles.textInput} placeholder="••••••••" placeholderTextColor="#999" secureTextEntry />

                    <Text style={styles.inputLabel}>Konfirmasi Password</Text>
                    <TextInput style={styles.textInput} placeholder="••••••••" placeholderTextColor="#999" secureTextEntry />

                    <TouchableOpacity style={styles.primaryButton}>
                        <Text style={styles.primaryButtonText}>Daftar</Text>
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
    primaryButtonText: { color: '#FFF', fontSize: 16, fontWeight: 'bold' },
    loginRow: { flexDirection: 'row', justifyContent: 'center', marginTop: 20 },
    loginText: { color: '#555', fontSize: 14 },
    loginLink: { color: '#2E8B57', fontSize: 14, fontWeight: 'bold' }
});