import { useAuth } from '@/context/AuthContext';
import axiosClient from '@/api/axiosClient';
import { Feather, Ionicons } from '@expo/vector-icons';
import { router, Stack, useFocusEffect } from 'expo-router';
import React, { useEffect, useState, useCallback } from 'react';
import { 
    ActivityIndicator, 
    Platform, 
    SafeAreaView, 
    ScrollView, 
    StyleSheet, 
    Text, 
    TouchableOpacity, 
    View,
    RefreshControl
} from 'react-native';

export interface Order {
    id: number;
    order_number: string;
    status: string;
    total_price: number;
    shipping_address: string;
    notes: string;
    created_at: string;
    items?: any[];
}

export default function PesananScreen() {
    const { user } = useAuth();
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    const fetchOrders = async () => {
        if (!user) return;
        try {
            const res = await axiosClient.get('/api/orders');
            setOrders(res.data.data);
        } catch (e) {
            console.error('Failed to fetch orders', e);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useFocusEffect(
        useCallback(() => {
            fetchOrders();
        }, [user])
    );

    const onRefresh = () => {
        setRefreshing(true);
        fetchOrders();
    };

    if (!user) {
        return (
            <SafeAreaView style={styles.container}>
                <View style={styles.header}>
                    <Text style={styles.headerTitle}>Riwayat Pesanan</Text>
                </View>
                <View style={styles.centered}>
                    <Ionicons name="receipt-outline" size={80} color="#CCC" />
                    <Text style={styles.emptyTitle}>Belum Login</Text>
                    <TouchableOpacity onPress={() => router.push('/login' as any)} style={styles.loginBtn}>
                        <Text style={styles.loginBtnText}>Masuk untuk melihat pesanan</Text>
                    </TouchableOpacity>
                </View>
            </SafeAreaView>
        );
    }

    const getStatusColor = (status: string) => {
        switch (status.toLowerCase()) {
            case 'completed':
            case 'selesai':
                return { bg: '#E8F5E9', text: '#2E8B57' };
            case 'pending':
            case 'menunggu':
                return { bg: '#FFF3E0', text: '#F57C00' };
            case 'processing':
            case 'diproses':
                return { bg: '#E3F2FD', text: '#1976D2' };
            default:
                return { bg: '#F5F5F5', text: '#666' };
        }
    };

    const formatDate = (dateStr: string) => {
        const date = new Date(dateStr);
        return date.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
    };

    return (
        <SafeAreaView style={styles.container}>
            <Stack.Screen options={{ headerShown: false }} />
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Riwayat Pesanan</Text>
            </View>

            <ScrollView 
                contentContainerStyle={styles.scrollContent} 
                showsVerticalScrollIndicator={false}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#2E8B57']} />
                }
            >
                {loading && !refreshing ? (
                    <ActivityIndicator size="large" color="#2E8B57" style={{ marginTop: 40 }} />
                ) : orders.length === 0 ? (
                    <View style={styles.centered}>
                        <Ionicons name="receipt-outline" size={80} color="#CCC" />
                        <Text style={styles.emptyTitle}>Belum ada pesanan</Text>
                        <Text style={styles.emptySubtitle}>Ayo mulai belanja obat sekarang!</Text>
                    </View>
                ) : (
                    orders.map((order) => {
                        const statusStyle = getStatusColor(order.status);
                        return (
                            <TouchableOpacity 
                                key={order.id} 
                                style={styles.orderCard}
                                onPress={() => router.push({ pathname: '/detail-pesanan', params: { id: order.id } } as any)}
                            >
                                <View style={styles.cardHeader}>
                                    <View style={styles.orderNumBadge}>
                                        <Text style={styles.orderNumText}>{order.order_number}</Text>
                                    </View>
                                    <View style={[styles.statusBadge, { backgroundColor: statusStyle.bg }]}>
                                        <Text style={[styles.statusText, { color: statusStyle.text }]}>{order.status.toUpperCase()}</Text>
                                    </View>
                                </View>

                                <View style={styles.cardBody}>
                                    <View style={styles.iconBox}>
                                        <Feather name="package" size={24} color="#2E8B57" />
                                    </View>
                                    <View style={styles.infoBox}>
                                        <Text style={styles.dateText}>{formatDate(order.created_at)}</Text>
                                        <Text style={styles.addressText} numberOfLines={1}>{order.shipping_address}</Text>
                                        <Text style={styles.totalPrice}>Rp {order.total_price.toLocaleString('id-ID')}</Text>
                                    </View>
                                    <Ionicons name="chevron-forward" size={20} color="#CCC" />
                                </View>
                            </TouchableOpacity>
                        );
                    })
                )}
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
    centered: { flex: 1, justifyContent: 'center', alignItems: 'center', marginTop: 100 },
    emptyTitle: { fontSize: 18, fontWeight: 'bold', color: '#999', marginTop: 16 },
    emptySubtitle: { fontSize: 14, color: '#AAA', marginTop: 8 },
    loginBtn: { marginTop: 24, backgroundColor: '#2E8B57', paddingHorizontal: 24, paddingVertical: 12, borderRadius: 12 },
    loginBtnText: { color: '#FFF', fontWeight: 'bold' },
    orderCard: { backgroundColor: '#FFF', borderRadius: 16, padding: 16, marginBottom: 16, borderWidth: 1, borderColor: '#EEE', elevation: 2, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 2 },
    cardHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12, alignItems: 'center' },
    orderNumBadge: { backgroundColor: '#F0F4F0', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 },
    orderNumText: { fontSize: 11, color: '#2E8B57', fontWeight: 'bold' },
    statusBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },
    statusText: { fontSize: 10, fontWeight: 'bold' },
    cardBody: { flexDirection: 'row', alignItems: 'center' },
    iconBox: { width: 44, height: 44, borderRadius: 12, backgroundColor: '#F0F4F0', justifyContent: 'center', alignItems: 'center', marginRight: 12 },
    infoBox: { flex: 1 },
    dateText: { color: '#333', fontSize: 13, fontWeight: '500' },
    addressText: { color: '#999', fontSize: 12, marginTop: 2 },
    totalPrice: { fontSize: 14, color: '#2E8B57', fontWeight: 'bold', marginTop: 4 }
});