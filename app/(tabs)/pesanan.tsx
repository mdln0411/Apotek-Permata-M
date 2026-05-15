import { Feather, Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Platform, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function PesananScreen() {
    const history = [
        { id: '1', date: '24 Mei 2024', status: 'Selesai', total: 'Rp 25.000', item: 'Paracetamol 500mg', method: 'Antar', icon: 'truck' },
        { id: '2', date: '25 Mei 2024', status: 'Siap Diambil', total: 'Rp 15.000', item: 'Promag Tablet', method: 'Jemput', icon: 'shopping-bag' },
        { id: '3', date: '23 Mei 2024', status: 'Selesai', total: 'Rp 45.000', item: 'Amoxicillin', method: 'Jemput', icon: 'shopping-bag' },
    ];

    return (
        <SafeAreaView style={styles.container}>
            {/* Header Hijau sesuai revisi */}
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Riwayat Pesanan</Text>
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                {history.map((item) => (
                    <TouchableOpacity key={item.id} style={styles.orderCard}>
                        <View style={styles.cardHeader}>
                            <View style={styles.methodBadge}>
                                <Feather name={item.icon as any} size={12} color="#666" />
                                <Text style={styles.methodText}>{item.method}</Text>
                            </View>
                            <View style={[
                                styles.statusBadge,
                                { backgroundColor: item.status === 'Selesai' ? '#E8F5E9' : '#E3F2FD' }
                            ]}>
                                <Text style={[
                                    styles.statusText,
                                    { color: item.status === 'Selesai' ? '#2E8B57' : '#1976D2' }
                                ]}>{item.status}</Text>
                            </View>
                        </View>

                        <View style={styles.cardBody}>
                            <View style={styles.iconBox}><Feather name="package" size={24} color="#2E8B57" /></View>
                            <View style={styles.infoBox}>
                                <Text style={styles.itemName}>{item.item}</Text>
                                <Text style={styles.dateText}>{item.date}</Text>
                                <Text style={styles.totalPrice}>{item.total}</Text>
                            </View>
                            <Ionicons name="chevron-forward" size={20} color="#CCC" />
                        </View>

                        {item.status === 'Siap Diambil' && (
                            <View style={styles.pickupAlert}>
                                <Feather name="info" size={14} color="#1976D2" />
                                <Text style={styles.pickupAlertText}>Silakan ambil pesanan Anda di Apotek Permata.</Text>
                            </View>
                        )}
                    </TouchableOpacity>
                ))}
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F8FBF8' },
    header: {
        backgroundColor: '#2E8B57',
        paddingHorizontal: 20,
        paddingBottom: 20,
        paddingTop: Platform.OS === 'ios' ? 50 : 60,
        borderBottomLeftRadius: 20,
        borderBottomRightRadius: 20,
    },
    headerTitle: { fontSize: 20, fontWeight: 'bold', color: '#FFF' },
    scrollContent: { padding: 16 },
    orderCard: { backgroundColor: '#FFF', borderRadius: 16, padding: 16, marginBottom: 16, borderWidth: 1, borderColor: '#EEE' },
    cardHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12, alignItems: 'center' },
    methodBadge: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: '#F5F5F5', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 },
    methodText: { fontSize: 11, color: '#666', fontWeight: '500' },
    statusBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },
    statusText: { fontSize: 11, fontWeight: 'bold' },
    cardBody: { flexDirection: 'row', alignItems: 'center' },
    iconBox: { width: 50, height: 50, borderRadius: 12, backgroundColor: '#F0F4F0', justifyContent: 'center', alignItems: 'center', marginRight: 12 },
    infoBox: { flex: 1 },
    itemName: { fontSize: 15, fontWeight: 'bold', color: '#333' },
    dateText: { color: '#999', fontSize: 12, marginTop: 2 },
    totalPrice: { fontSize: 14, color: '#2E8B57', fontWeight: 'bold', marginTop: 4 },
    pickupAlert: { flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: '#E3F2FD', padding: 10, borderRadius: 8, marginTop: 12 },
    pickupAlertText: { fontSize: 11, color: '#1976D2', fontWeight: '500' }
});