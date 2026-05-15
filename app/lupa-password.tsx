import { Feather, Ionicons } from '@expo/vector-icons';
import { router, Stack } from 'expo-router';
import React from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function LupaPasswordScreen() {
    return (
        <SafeAreaView style={styles.container}>
            <Stack.Screen options={{ headerShown: false }} />

            <View style={styles.header}>
                <View style={styles.logoContainer}>
                    <Ionicons name="medical" size={24} color="#FFF" />
                    <Text style={styles.headerTitle}>Apotek Permata</Text>
                </View>
                <TouchableOpacity onPress={() => router.push('/register' as any)}>
                    <Text style={styles.headerLink}>Daftar</Text>
                </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent}>

                <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
                    <Feather name="arrow-left" size={20} color="#333" />
                    <Text style={styles.backText}>Kembali</Text>
                </TouchableOpacity>

                <Text style={styles.mainTitle}>Lupa Password</Text>
                <Text style={styles.subTitle}>Masukkan email Anda untuk menerima link reset password</Text>

                <View style={styles.card}>
                    <Text style={styles.inputLabel}>Email</Text>
                    <TextInput
                        style={styles.textInput}
                        placeholder="email@example.com"
                        placeholderTextColor="#999"
                        keyboardType="email-address"
                    />

                    <TouchableOpacity style={styles.primaryButton}>
                        <Text style={styles.primaryButtonText}>Kirim Link Reset</Text>
                    </TouchableOpacity>
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
    scrollContent: { padding: 20 },
    backBtn: { flexDirection: 'row', alignItems: 'center', marginBottom: 24, marginTop: 10 },
    backText: { fontSize: 14, color: '#333', marginLeft: 8, fontWeight: '500' },
    mainTitle: { fontSize: 24, fontWeight: 'bold', color: '#333', marginBottom: 8 },
    subTitle: { fontSize: 14, color: '#555', marginBottom: 24, lineHeight: 20 },
    card: { backgroundColor: '#FFF', borderRadius: 16, padding: 20, borderWidth: 1, borderColor: '#DCEBDE' },
    inputLabel: { fontSize: 14, fontWeight: '500', color: '#333', marginBottom: 8 },
    textInput: { height: 48, borderWidth: 1, borderColor: '#E0E0E0', borderRadius: 8, paddingHorizontal: 16, fontSize: 15, color: '#333', backgroundColor: '#FAFAFA', marginBottom: 20 },
    primaryButton: { backgroundColor: '#2E8B57', height: 48, borderRadius: 8, justifyContent: 'center', alignItems: 'center' },
    primaryButtonText: { color: '#FFF', fontSize: 16, fontWeight: 'bold' },
});