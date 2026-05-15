import axiosClient from '@/api/axiosClient';
import { Feather, Ionicons } from '@expo/vector-icons';
import { router, Stack, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    Image,
    Platform
} from 'react-native';

interface OrderItem {
    id: number;
    name: string;
    quantity: number;
    price: number;
    subtotal: number;
    medicine?: {
        image_url: string;
    }
}

interface OrderDetail {
    id: number;
    order_number: string;
    status: string;
    total_price: number;
    shipping_address: string;
    notes: string;
    created_at: string;
    items: OrderItem[];
}

export default function DetailPesananScreen() {
    const { id } = useLocalSearchParams<{ id: string }>();
    const [order, setOrder] = useState<OrderDetail | null>(null);
    const [loading, setLoading] = useState(true);

    const fetchOrderDetail = async () => {
        try {
            const res = await axiosClient.get(`/api/orders/${id}`);
            setOrder(res.data.data);
        } catch (e) {
            console.error('Failed to fetch order detail', e);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrderDetail();
    }, [id]);

    if (loading) {
        return (
            <SafeAreaView style={styles.container}>
                <Stack.Screen options={{ headerShown: false }} />
                <View style={styles.centered}>
                    <ActivityIndicator size="large" color="#2E8B57" />
                </View>
            </SafeAreaView>
        );
    }

    if (!order) {
        return (
            <SafeAreaView style={styles.container}>
                <Stack.Screen options={{ headerShown: false }} />
                <View style={styles.centered}>
                    <Text>Pesanan tidak ditemukan</Text>
                    <TouchableOpacity onPress={() => router.back()} style={styles.backLink}>
                        <Text style={styles.backLinkText}>Kembali</Text>
                    </TouchableOpacity>
                </View>
            </SafeAreaView>
        );
    }

    const formatDate = (dateStr: string) => {
        const date = new Date(dateStr);
        return date.toLocaleDateString('id-ID', { 
            day: 'numeric', 
            month: 'long', 
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <SafeAreaView style={styles.container}>
            <Stack.Screen options={{ headerShown: false }} />
            
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
                    <Ionicons name="chevron-back" size={24} color="#333" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Detail Pesanan</Text>
                <View style={{ width: 40 }} />
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                
                {/* Status Section */}
                <View style={styles.statusCard}>
                    <View style={styles.statusHeader}>
                        <Ionicons name="receipt" size={24} color="#2E8B57" />
                        <View style={styles.statusInfo}>
                            <Text style={styles.statusLabel}>No. Pesanan</Text>
                            <Text style={styles.statusValue}>{order.order_number}</Text>
                        </View>
                        <View style={styles.badgeStatus}>
                            <Text style={styles.badgeStatusText}>{order.status.toUpperCase()}</Text>
                        </View>
                    </View>
                    <View style={styles.divider} />
                    <View style={styles.dateRow}>
                        <Feather name="calendar" size={14} color="#666" />
                        <Text style={styles.dateText}>{formatDate(order.created_at)} WIB</Text>
                    </View>
                </View>

                {/* Shipping Section */}
                <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                        <Feather name="map-pin" size={18} color="#2E8B57" />
                        <Text style={styles.sectionTitle}>Alamat Pengiriman</Text>
                    </View>
                    <View style={styles.addressBox}>
                        <Text style={styles.addressText}>{order.shipping_address}</Text>
                        {order.notes && (
                            <View style={styles.notesBox}>
                                <Text style={styles.notesLabel}>Catatan:</Text>
                                <Text style={styles.notesText}>{order.notes}</Text>
                            </View>
                        )}
                    </View>
                </View>

                {/* Items Section */}
                <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                        <Feather name="package" size={18} color="#2E8B57" />
                        <Text style={styles.sectionTitle}>Rincian Produk</Text>
                    </View>
                    {order.items.map((item) => (
                        <View key={item.id} style={styles.itemRow}>
                            <View style={styles.itemIcon}>
                                <Ionicons name="medical" size={20} color="#2E8B57" />
                            </View>
                            <View style={styles.itemMain}>
                                <Text style={styles.itemName}>{item.name}</Text>
                                <Text style={styles.itemQty}>{item.quantity} x Rp {item.price.toLocaleString('id-ID')}</Text>
                            </View>
                            <Text style={styles.itemTotal}>Rp {item.subtotal.toLocaleString('id-ID')}</Text>
                        </View>
                    ))}
                </View>

                {/* Payment Detail Section */}
                <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                        <Ionicons name="wallet-outline" size={18} color="#2E8B57" />
                        <Text style={styles.sectionTitle}>Rincian Pembayaran</Text>
                    </View>
                    <View style={styles.paymentRow}>
                        <Text style={styles.paymentLabel}>Subtotal Produk</Text>
                        <Text style={styles.paymentValue}>Rp {order.total_price.toLocaleString('id-ID')}</Text>
                    </View>
                    {/* Statis karena dari API kita hanya simpan total_price saat ini */}
                    <View style={styles.paymentRow}>
                        <Text style={styles.paymentLabel}>Biaya Layanan</Text>
                        <Text style={styles.paymentValue}>Rp 2.000</Text>
                    </View>
                    <View style={styles.divider} />
                    <View style={styles.totalRow}>
                        <Text style={styles.totalLabel}>Total Bayar</Text>
                        <Text style={styles.totalValue}>Rp {(order.total_price + 2000).toLocaleString('id-ID')}</Text>
                    </View>
                </View>

                <TouchableOpacity style={styles.btnHelp}>
                    <Feather name="help-circle" size={18} color="#2E8B57" />
                    <Text style={styles.btnHelpText}>Butuh Bantuan?</Text>
                </TouchableOpacity>

            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F8FBF8' },
    centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingTop: Platform.OS === 'ios' ? 0 : 40, paddingBottom: 16, backgroundColor: '#FFF', borderBottomWidth: 1, borderBottomColor: '#EEE' },
    backBtn: { width: 40, height: 40, justifyContent: 'center' },
    headerTitle: { fontSize: 18, fontWeight: 'bold', color: '#333' },
    scrollContent: { padding: 16, paddingBottom: 40 },
    statusCard: { backgroundColor: '#FFF', borderRadius: 16, padding: 16, marginBottom: 16, borderWidth: 1, borderColor: '#EEE' },
    statusHeader: { flexDirection: 'row', alignItems: 'center' },
    statusInfo: { flex: 1, marginLeft: 12 },
    statusLabel: { fontSize: 12, color: '#999' },
    statusValue: { fontSize: 14, fontWeight: 'bold', color: '#333' },
    badgeStatus: { backgroundColor: '#E8F5E9', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },
    badgeStatusText: { fontSize: 10, color: '#2E8B57', fontWeight: 'bold' },
    divider: { height: 1, backgroundColor: '#F0F0F0', marginVertical: 12 },
    dateRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
    dateText: { fontSize: 13, color: '#666' },
    section: { backgroundColor: '#FFF', borderRadius: 16, padding: 16, marginBottom: 16, borderWidth: 1, borderColor: '#EEE' },
    sectionHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 16 },
    sectionTitle: { fontSize: 15, fontWeight: 'bold', color: '#333' },
    addressBox: { backgroundColor: '#F9F9F9', padding: 12, borderRadius: 12 },
    addressText: { fontSize: 14, color: '#555', lineHeight: 20 },
    notesBox: { marginTop: 12, borderTopWidth: 1, borderTopColor: '#EEE', paddingTop: 8 },
    notesLabel: { fontSize: 12, color: '#999', marginBottom: 2 },
    notesText: { fontSize: 13, color: '#333', fontStyle: 'italic' },
    itemRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
    itemIcon: { width: 40, height: 40, backgroundColor: '#F0F4F0', borderRadius: 10, justifyContent: 'center', alignItems: 'center', marginRight: 12 },
    itemMain: { flex: 1 },
    itemName: { fontSize: 14, fontWeight: '500', color: '#333' },
    itemQty: { fontSize: 12, color: '#777', marginTop: 2 },
    itemTotal: { fontSize: 14, fontWeight: 'bold', color: '#333' },
    paymentRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
    paymentLabel: { fontSize: 14, color: '#666' },
    paymentValue: { fontSize: 14, color: '#333', fontWeight: '500' },
    totalRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 4 },
    totalLabel: { fontSize: 16, fontWeight: 'bold', color: '#333' },
    totalValue: { fontSize: 18, fontWeight: 'bold', color: '#2E8B57' },
    btnHelp: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, marginTop: 10, paddingVertical: 12 },
    btnHelpText: { color: '#2E8B57', fontSize: 14, fontWeight: 'bold' },
    backLink: { marginTop: 20 },
    backLinkText: { color: '#2E8B57', fontWeight: 'bold' }
});
