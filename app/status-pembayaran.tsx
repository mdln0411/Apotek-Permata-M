import { Feather, Ionicons } from '@expo/vector-icons';
import { router, Stack } from 'expo-router';
import React from 'react';
import { Platform, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function StatusPembayaranScreen() {
    // Data dummy untuk ringkasan
    const orderId = "INV/20231024/AP/98231";
    const totalBayar = "Rp 29.000";
    const metode = "DANA";

    return (
        <SafeAreaView style={styles.container}>
            <Stack.Screen options={{ headerShown: false }} />

            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

                {/* Ikon Sukses & Status */}
                <View style={styles.successHeader}>
                    <View style={styles.iconCircle}>
                        <Ionicons name="checkmark-circle" size={100} color="#2E8B57" />
                    </View>
                    <Text style={styles.statusTitle}>Pembayaran Berhasil!</Text>
                    <Text style={styles.statusSubtitle}>Pesanan Anda sedang diproses dan akan segera dikirim ke alamat tujuan.</Text>
                </View>

                {/* Rincian Transaksi Card */}
                <View style={styles.receiptCard}>
                    <Text style={styles.receiptTitle}>Rincian Transaksi</Text>

                    <View style={styles.receiptRow}>
                        <Text style={styles.receiptLabel}>ID Pesanan</Text>
                        <Text style={styles.receiptValue}>{orderId}</Text>
                    </View>

                    <View style={styles.receiptRow}>
                        <Text style={styles.receiptLabel}>Waktu Pembayaran</Text>
                        <Text style={styles.receiptValue}>24 Okt 2023, 14:45 WIB</Text>
                    </View>

                    <View style={styles.receiptRow}>
                        <Text style={styles.receiptLabel}>Metode Pembayaran</Text>
                        <Text style={styles.receiptValue}>{metode}</Text>
                    </View>

                    <View style={styles.divider} />

                    <View style={styles.receiptRow}>
                        <Text style={[styles.receiptLabel, { fontWeight: 'bold', color: '#333' }]}>Total Pembayaran</Text>
                        <Text style={styles.totalValue}>{totalBayar}</Text>
                    </View>
                </View>

                {/* Tips Keamanan / Informasi */}
                <View style={styles.infoBox}>
                    <Feather name="info" size={18} color="#2E8B57" />
                    <Text style={styles.infoText}>
                        E-Resep dan bukti pembayaran telah dikirimkan ke email Anda. Silakan cek folder inbox atau spam.
                    </Text>
                </View>

                {/* Tombol Aksi */}
                <View style={styles.buttonContainer}>
                    <TouchableOpacity
                        style={styles.btnPrimary}
                        onPress={() => router.push('/(tabs)' as any)}
                    >
                        <Text style={styles.btnPrimaryText}>Belanja Lagi</Text>
                    </TouchableOpacity>
                </View>

            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F8FBF8' },
    scrollContent: { padding: 24, alignItems: 'center', paddingTop: Platform.OS === 'ios' ? 40 : 60 },

    /* Status Header */
    successHeader: { alignItems: 'center', marginBottom: 32 },
    iconCircle: { marginBottom: 20 },
    statusTitle: { fontSize: 24, fontWeight: 'bold', color: '#333', marginBottom: 12 },
    statusSubtitle: { fontSize: 14, color: '#777', textAlign: 'center', lineHeight: 22, paddingHorizontal: 20 },

    /* Receipt Card */
    receiptCard: { backgroundColor: '#FFF', width: '100%', borderRadius: 20, padding: 20, borderWidth: 1, borderColor: '#EEE', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 10, elevation: 2 },
    receiptTitle: { fontSize: 16, fontWeight: 'bold', color: '#333', marginBottom: 16, borderBottomWidth: 1, borderBottomColor: '#F0F0F0', paddingBottom: 12 },
    receiptRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 14 },
    receiptLabel: { fontSize: 13, color: '#888' },
    receiptValue: { fontSize: 13, color: '#333', fontWeight: '500' },
    divider: { height: 1, backgroundColor: '#F0F0F0', marginVertical: 14, borderStyle: 'dashed', borderRadius: 1 },
    totalValue: { fontSize: 18, fontWeight: 'bold', color: '#2E8B57' },

    /* Info Box */
    infoBox: { flexDirection: 'row', backgroundColor: '#E8F5E9', padding: 16, borderRadius: 12, marginTop: 24, gap: 12, alignItems: 'center' },
    infoText: { flex: 1, fontSize: 12, color: '#2E8B57', lineHeight: 18 },

    /* Buttons */
    buttonContainer: { width: '100%', marginTop: 40 },
    btnPrimary: { backgroundColor: '#2E8B57', width: '100%', paddingVertical: 16, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
    btnPrimaryText: { color: '#FFF', fontSize: 16, fontWeight: 'bold' }
});