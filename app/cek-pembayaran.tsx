import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity } from 'react-native';
import { Stack, router, useLocalSearchParams } from 'expo-router';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

export default function CekPembayaranScreen() {
    const { orderId, orderNumber } = useLocalSearchParams<{ orderId: string, orderNumber: string }>();

    return (
        <SafeAreaView style={styles.container}>
            <Stack.Screen options={{ headerShown: false }} />
            
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.replace('/(tabs)/pesanan' as any)} style={styles.backBtn}>
                    <Ionicons name="close" size={28} color="#333" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Status Pembayaran</Text>
                <View style={{ width: 40 }} />
            </View>

            <View style={styles.content}>
                <View style={styles.iconContainer}>
                    <MaterialCommunityIcons name="clock-fast" size={80} color="#F57C00" />
                </View>

                <Text style={styles.title}>Menunggu Konfirmasi</Text>
                <Text style={styles.subtitle}>Pembayaran Anda telah kami terima laporannya.</Text>

                <View style={styles.card}>
                    <View style={styles.row}>
                        <Text style={styles.label}>Nomor Pesanan</Text>
                        <Text style={styles.value}>{orderNumber}</Text>
                    </View>
                    <View style={styles.divider} />
                    <View style={styles.row}>
                        <Text style={styles.label}>Status Pembayaran</Text>
                        <View style={styles.badgeWarning}>
                            <Text style={styles.badgeWarningText}>Menunggu Konfirmasi</Text>
                        </View>
                    </View>
                    <View style={styles.divider} />
                    <View style={styles.row}>
                        <Text style={styles.label}>Status Pesanan</Text>
                        <View style={styles.badgeInfo}>
                            <Text style={styles.badgeInfoText}>Menunggu Konfirmasi Apoteker</Text>
                        </View>
                    </View>
                </View>

                <View style={styles.infoBox}>
                    <Ionicons name="information-circle-outline" size={24} color="#1976D2" />
                    <Text style={styles.infoText}>
                        Apoteker kami sedang mengecek pembayaran Anda. Pesanan akan otomatis diproses setelah pembayaran terverifikasi.
                    </Text>
                </View>

                <TouchableOpacity 
                    style={styles.primaryBtn}
                    onPress={() => router.replace('/(tabs)/pesanan' as any)}
                >
                    <Text style={styles.primaryBtnText}>Cek Pesanan Saya</Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                    style={styles.secondaryBtn}
                    onPress={() => router.replace('/(tabs)' as any)}
                >
                    <Text style={styles.secondaryBtnText}>Kembali ke Beranda</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F8F9FA' },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingTop: 16,
        paddingBottom: 16,
        backgroundColor: '#FFF',
    },
    backBtn: { width: 40, height: 40, justifyContent: 'center' },
    headerTitle: { fontSize: 18, fontWeight: 'bold', color: '#333' },
    content: { padding: 24, alignItems: 'center' },
    iconContainer: {
        width: 120, height: 120, borderRadius: 60, backgroundColor: '#FFF3E0',
        justifyContent: 'center', alignItems: 'center', marginBottom: 24,
    },
    title: { fontSize: 24, fontWeight: 'bold', color: '#333', marginBottom: 8 },
    subtitle: { fontSize: 14, color: '#666', textAlign: 'center', marginBottom: 32 },
    card: {
        backgroundColor: '#FFF', borderRadius: 16, padding: 20, width: '100%',
        borderWidth: 1, borderColor: '#EEE', marginBottom: 24,
    },
    row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    divider: { height: 1, backgroundColor: '#EEE', marginVertical: 12 },
    label: { fontSize: 14, color: '#666' },
    value: { fontSize: 14, fontWeight: 'bold', color: '#333' },
    badgeWarning: { backgroundColor: '#FFF3E0', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },
    badgeWarningText: { color: '#F57C00', fontSize: 12, fontWeight: 'bold' },
    badgeInfo: { backgroundColor: '#E3F2FD', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },
    badgeInfoText: { color: '#1976D2', fontSize: 12, fontWeight: 'bold' },
    infoBox: {
        flexDirection: 'row', backgroundColor: '#E3F2FD', padding: 16, borderRadius: 12,
        alignItems: 'flex-start', gap: 12, width: '100%', marginBottom: 32,
    },
    infoText: { flex: 1, fontSize: 13, color: '#1976D2', lineHeight: 20 },
    primaryBtn: {
        backgroundColor: '#2E8B57', width: '100%', paddingVertical: 16, borderRadius: 12,
        alignItems: 'center', marginBottom: 12,
    },
    primaryBtnText: { color: '#FFF', fontSize: 16, fontWeight: 'bold' },
    secondaryBtn: {
        backgroundColor: '#FFF', width: '100%', paddingVertical: 16, borderRadius: 12,
        alignItems: 'center', borderWidth: 1, borderColor: '#2E8B57',
    },
    secondaryBtnText: { color: '#2E8B57', fontSize: 16, fontWeight: 'bold' },
});
