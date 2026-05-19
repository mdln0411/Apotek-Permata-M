import axiosClient from '@/api/axiosClient';
import { useAuth } from '@/context/AuthContext';
import { Feather, Ionicons } from '@expo/vector-icons';
import { router, Stack, useFocusEffect, useLocalSearchParams } from 'expo-router';
import React, { useCallback, useState, useEffect } from 'react';
import {
    ActivityIndicator,
    Image,
    Platform,
    RefreshControl,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
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

export interface Prescription {
    id: number;
    image_url: string;
    status: string;
    notes: string | null;
    created_at: string;
}

export default function PesananScreen() {
    const { user } = useAuth();
    const { tab } = useLocalSearchParams<{ tab?: string }>();
    const [orders, setOrders] = useState<Order[]>([]);
    const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [activeTab, setActiveTab] = useState<'pesanan' | 'resep'>('pesanan');
    const [subTab, setSubTab] = useState<'semua' | 'pending' | 'selesai' | 'dibatalkan'>('semua');

    const filteredOrders = orders.filter(order => {
        if (subTab === 'semua') return true;
        if (subTab === 'pending') return order.status === 'pending';
        if (subTab === 'selesai') return order.status === 'selesai';
        if (subTab === 'dibatalkan') return order.status === 'dibatalkan';
        return true;
    });

    useEffect(() => {
        if (tab === 'resep' || tab === 'pesanan') {
            setActiveTab(tab);
        }
    }, [tab]);

    const fetchOrders = async () => {
        if (!user) return;
        try {
            const [orderRes, prescriptionRes] = await Promise.all([
                axiosClient.get('/api/orders'),
                axiosClient.get('/api/prescriptions')
            ]);
            setOrders(orderRes.data.data);
            setPrescriptions(prescriptionRes.data.data || []);
        } catch (e) {
            console.error('Failed to fetch orders or prescriptions', e);
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
            case 'valid':
                return { bg: '#E8F5E9', text: '#2E8B57' };
            case 'pending':
            case 'menunggu':
                return { bg: '#FFF3E0', text: '#F57C00' };
            case 'processing':
            case 'diproses':
                return { bg: '#E3F2FD', text: '#1976D2' };
            case 'rejected':
            case 'ditolak':
                return { bg: '#FFEBEE', text: '#D32F2F' };
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

            {/* Tab Swither */}
            <View style={styles.tabContainer}>
                <TouchableOpacity 
                    style={[styles.tabButton, activeTab === 'pesanan' && styles.tabButtonActive]}
                    onPress={() => setActiveTab('pesanan')}
                >
                    <Text style={[styles.tabText, activeTab === 'pesanan' && styles.tabTextActive]}>Pesanan Saya</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                    style={[styles.tabButton, activeTab === 'resep' && styles.tabButtonActive]}
                    onPress={() => setActiveTab('resep')}
                >
                    <Text style={[styles.tabText, activeTab === 'resep' && styles.tabTextActive]}>Upload Resep</Text>
                </TouchableOpacity>
            </View>

            {activeTab === 'pesanan' && (
                <View style={styles.subTabContainer}>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.subTabScrollContent}>
                        {(['semua', 'pending', 'selesai', 'dibatalkan'] as const).map((tabKey) => {
                            const label = tabKey === 'semua' ? 'Semua' 
                                        : tabKey === 'pending' ? 'Pending'
                                        : tabKey === 'selesai' ? 'Selesai'
                                        : 'Dibatalkan';
                            const isActive = subTab === tabKey;
                            return (
                                <TouchableOpacity
                                    key={tabKey}
                                    style={[styles.subTabButton, isActive && styles.subTabButtonActive]}
                                    onPress={() => setSubTab(tabKey)}
                                >
                                    <Text style={[styles.subTabText, isActive && styles.subTabTextActive]}>
                                        {label}
                                    </Text>
                                </TouchableOpacity>
                            );
                        })}
                    </ScrollView>
                </View>
            )}

            <ScrollView 
                contentContainerStyle={styles.scrollContent} 
                showsVerticalScrollIndicator={false}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#2E8B57']} />
                }
            >
                {loading && !refreshing ? (
                    <ActivityIndicator size="large" color="#2E8B57" style={{ marginTop: 40 }} />
                ) : activeTab === 'pesanan' ? (
                    filteredOrders.length === 0 ? (
                        <View style={styles.centered}>
                            <Ionicons name="receipt-outline" size={80} color="#CCC" />
                            <Text style={styles.emptyTitle}>
                                {subTab === 'semua' ? 'Belum ada pesanan' : `Tidak ada pesanan ${subTab}`}
                            </Text>
                            <Text style={styles.emptySubtitle}>
                                {subTab === 'semua' ? 'Ayo mulai belanja obat sekarang!' : 'Coba ubah filter status pesanan Anda.'}
                            </Text>
                        </View>
                    ) : (
                        filteredOrders.map((order) => {
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
                                        <View style={styles.imageBox}>
                                            {order.items && order.items.length > 0 && order.items[0].medicine?.image_url ? (
                                                <Image 
                                                    source={{ uri: order.items[0].medicine.image_url }} 
                                                    style={styles.medicinePreview}
                                                    resizeMode="cover"
                                                />
                                            ) : (
                                                <Feather name="package" size={24} color="#2E8B57" />
                                            )}
                                        </View>
                                        <View style={styles.infoBox}>
                                            <Text style={styles.dateText}>{formatDate(order.created_at)}</Text>
                                            <Text style={styles.addressText} numberOfLines={1}>{order.shipping_address}</Text>
                                            <View style={styles.priceRow}>
                                                <Text style={styles.totalPrice}>Rp {order.total_price.toLocaleString('id-ID')}</Text>
                                                {order.items && order.items.length > 1 && (
                                                    <Text style={styles.itemCountText}>+{order.items.length - 1} produk lainnya</Text>
                                                )}
                                            </View>
                                        </View>
                                        <Ionicons name="chevron-forward" size={20} color="#CCC" />
                                    </View>
                                </TouchableOpacity>
                            );
                        })
                    )
                ) : (
                    // Resep Tab
                    prescriptions.length === 0 ? (
                        <View style={styles.centered}>
                            <Ionicons name="document-text-outline" size={80} color="#CCC" />
                            <Text style={styles.emptyTitle}>Belum ada resep</Text>
                            <Text style={styles.emptySubtitle}>Upload resep dokter Anda di sini!</Text>
                            <TouchableOpacity 
                                style={styles.uploadNowBtn}
                                onPress={() => router.push('/upload-resep')}
                            >
                                <Text style={styles.uploadNowBtnText}>Upload Sekarang</Text>
                            </TouchableOpacity>
                        </View>
                    ) : (
                        prescriptions.map((prescription) => {
                            const statusStyle = getStatusColor(prescription.status);
                            return (
                                <View key={prescription.id} style={styles.orderCard}>
                                    <View style={styles.cardHeader}>
                                        <View style={styles.orderNumBadge}>
                                            <Text style={styles.orderNumText}>RESEP #{prescription.id}</Text>
                                        </View>
                                        <View style={[styles.statusBadge, { backgroundColor: statusStyle.bg }]}>
                                            <Text style={[styles.statusText, { color: statusStyle.text }]}>{prescription.status.toUpperCase()}</Text>
                                        </View>
                                    </View>

                                    <View style={styles.cardBody}>
                                        <View style={styles.imageBox}>
                                            {prescription.image_url ? (
                                                <Image 
                                                    source={{ uri: `${Platform.OS === 'android' ? 'http://10.0.2.2:8000' : 'http://localhost:8000'}/storage/${prescription.image_url}` }} 
                                                    style={styles.medicinePreview}
                                                    resizeMode="cover"
                                                />
                                            ) : (
                                                <Feather name="image" size={24} color="#2E8B57" />
                                            )}
                                        </View>
                                        <View style={styles.infoBox}>
                                            <Text style={styles.dateText}>{formatDate(prescription.created_at)}</Text>
                                            <Text style={styles.addressText} numberOfLines={1}>
                                                {prescription.notes || 'Menunggu verifikasi apoteker'}
                                            </Text>
                                        </View>
                                    </View>
                                </View>
                            );
                        })
                    )
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
    tabContainer: {
        flexDirection: 'row',
        paddingHorizontal: 20,
        backgroundColor: '#FFF',
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#EEE',
    },
    tabButton: {
        flex: 1,
        paddingVertical: 10,
        alignItems: 'center',
        borderBottomWidth: 2,
        borderBottomColor: 'transparent',
    },
    tabButtonActive: {
        borderBottomColor: '#2E8B57',
    },
    tabText: {
        fontSize: 14,
        color: '#888',
        fontWeight: '600',
    },
    tabTextActive: {
        color: '#2E8B57',
    },
    uploadNowBtn: {
        marginTop: 20,
        backgroundColor: '#2E8B57',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 8,
    },
    uploadNowBtnText: {
        color: '#FFF',
        fontWeight: 'bold',
    },
    cardHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12, alignItems: 'center' },
    orderNumBadge: { backgroundColor: '#F0F4F0', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 },
    orderNumText: { fontSize: 11, color: '#2E8B57', fontWeight: 'bold' },
    statusBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },
    statusText: { fontSize: 10, fontWeight: 'bold' },
    cardBody: { flexDirection: 'row', alignItems: 'center' },
    imageBox: { width: 44, height: 44, borderRadius: 12, backgroundColor: '#F0F4F0', justifyContent: 'center', alignItems: 'center', marginRight: 12, overflow: 'hidden' },
    medicinePreview: { width: '100%', height: '100%' },
    infoBox: { flex: 1 },
    dateText: { color: '#333', fontSize: 13, fontWeight: '500' },
    addressText: { color: '#999', fontSize: 12, marginTop: 2 },
    priceRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
    totalPrice: { fontSize: 14, color: '#2E8B57', fontWeight: 'bold', marginTop: 4 },
    itemCountText: { fontSize: 10, color: '#999', marginTop: 4 },
    subTabContainer: {
        backgroundColor: '#FFF',
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#F0F0F0',
    },
    subTabScrollContent: {
        paddingHorizontal: 16,
        gap: 10,
        flexDirection: 'row',
    },
    subTabButton: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
        backgroundColor: '#F5F5F5',
        borderWidth: 1,
        borderColor: '#EEE',
    },
    subTabButtonActive: {
        backgroundColor: '#E8F5E9',
        borderColor: '#2E8B57',
    },
    subTabText: {
        fontSize: 13,
        color: '#666',
        fontWeight: '600',
    },
    subTabTextActive: {
        color: '#2E8B57',
    },
});