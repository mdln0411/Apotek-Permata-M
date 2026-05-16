import axiosClient from '@/api/axiosClient';
import { Feather, Ionicons } from '@expo/vector-icons';
import { Stack, router, useFocusEffect } from 'expo-router';
import React, { useEffect, useState, useCallback } from 'react';
import { 
    SafeAreaView, 
    ScrollView, 
    StyleSheet, 
    Text, 
    TouchableOpacity, 
    View, 
    Platform,
    ActivityIndicator,
    RefreshControl
} from 'react-native';

export default function PesananMasuk() {
    const [activeTab, setActiveTab] = useState('menunggu');
    const [orders, setOrders] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    const fetchOrders = async () => {
        try {
            setLoading(true);
            const response = await axiosClient.get('/api/admin/orders');
            setOrders(response.data.data);
        } catch (error) {
            console.error('Error fetching orders:', error);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useFocusEffect(
        useCallback(() => {
            fetchOrders();
        }, [])
    );

    const onRefresh = () => {
        setRefreshing(true);
        fetchOrders();
    };

    const handleUpdateStatus = async (id: number, status: string) => {
        try {
            await axiosClient.put(`/api/admin/orders/${id}/status`, { status });
            alert(`Pesanan berhasil di${status === 'diproses' ? 'terima' : 'selesaikan'}`);
            fetchOrders();
        } catch (error) {
            alert('Gagal memperbarui status');
        }
    };

    const filteredOrders = orders.filter(o => {
        const status = (o.status || 'pending').toLowerCase().trim();
        
        if (activeTab === 'menunggu') {
            return status === 'pending' || status === 'menunggu';
        }
        if (activeTab === 'diproses') {
            return status === 'diproses' || status === 'processing';
        }
        if (activeTab === 'dikirim') {
            return status === 'dikirim' || status === 'shipped';
        }
        if (activeTab === 'selesai') {
            return status === 'selesai' || status === 'completed';
        }
        if (activeTab === 'dilaporkan') {
            return status === 'dilaporkan' || status === 'reported';
        }
        return false;

    });

    const TabButton = ({ title, id }: { title: string, id: string }) => (
        <TouchableOpacity 
            style={[styles.tabItem, activeTab === id && styles.activeTabItem]}
            onPress={() => setActiveTab(id)}
        >
            <Text style={[styles.tabText, activeTab === id && styles.activeTabText]}>
                {title}
            </Text>
        </TouchableOpacity>
    );

    return (
        <SafeAreaView style={styles.container}>
            <Stack.Screen options={{ headerShown: false }} />

            {/* Header */}
            <View style={styles.header}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                    <TouchableOpacity onPress={() => router.push('/apoteker/dashboard')}>
                        <Ionicons name="grid-outline" size={24} color="#FFF" />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Pesanan Masuk</Text>
                </View>
            </View>

            {/* Tabs */}
            <View style={styles.tabContainer}>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 5, paddingRight: 20 }}>
                    <TabButton title="Menunggu" id="menunggu" />
                    <TabButton title="Diproses" id="diproses" />
                    <TabButton title="Dikirim" id="dikirim" />
                    <TabButton title="Selesai" id="selesai" />
                    <TabButton title="Laporan" id="dilaporkan" />
                </ScrollView>
            </View>


            <ScrollView 
                showsVerticalScrollIndicator={false} 
                contentContainerStyle={styles.scrollContent}
                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#2E8B57']} />}
            >
                {loading && !refreshing ? (
                    <ActivityIndicator size="large" color="#2E8B57" style={{ marginTop: 50 }} />
                ) : filteredOrders.length === 0 ? (
                    <View style={styles.emptyContainer}>
                        <Ionicons name="document-text-outline" size={60} color="#DDD" />
                        <Text style={styles.emptyText}>Tidak ada pesanan {activeTab}</Text>
                    </View>
                ) : (
                    filteredOrders.map((item) => (
                        <View key={item.id} style={styles.orderCard}>
                            <View style={styles.cardHeader}>
                                <View>
                                    <Text style={styles.orderNumber}>{item.order_number}</Text>
                                    <Text style={styles.customerName}>{item.user?.name || 'User'}</Text>
                                </View>
                                <Text style={styles.statusLabel}>{activeTab === 'menunggu' ? 'Menunggu' : activeTab === 'diproses' ? 'Diproses' : 'Selesai'}</Text>
                            </View>

                            <View style={styles.cardBody}>
                                <View style={styles.infoRow}>
                                    <Text style={styles.infoLabel}>Item</Text>
                                    <Text style={styles.infoValue}>{item.items?.length || 0} Item</Text>
                                </View>
                                <View style={styles.infoRow}>
                                    <Text style={styles.infoLabel}>Total</Text>
                                    <Text style={styles.infoValue}>Rp {item.total_price.toLocaleString('id-ID')}</Text>
                                </View>
                            </View>

                            <View style={styles.cardActions}>
                                {activeTab === 'menunggu' && (
                                    <TouchableOpacity 
                                        style={styles.btnTerima}
                                        onPress={() => handleUpdateStatus(item.id, 'diproses')}
                                    >
                                        <Text style={styles.btnTerimaText}>✓ Terima</Text>
                                    </TouchableOpacity>
                                )}
                                {activeTab === 'diproses' && (
                                    <TouchableOpacity 
                                        style={[styles.btnTerima, { backgroundColor: '#EF6C00' }]}
                                        onPress={() => handleUpdateStatus(item.id, 'dikirim')}
                                    >
                                        <Text style={styles.btnTerimaText}>Kirim</Text>
                                    </TouchableOpacity>
                                )}
                                {activeTab === 'dikirim' && (
                                    <TouchableOpacity 
                                        style={styles.btnTerima}
                                        onPress={() => handleUpdateStatus(item.id, 'selesai')}
                                    >
                                        <Text style={styles.btnTerimaText}>Selesaikan</Text>
                                    </TouchableOpacity>
                                )}
                                {activeTab === 'dilaporkan' && (
                                    <TouchableOpacity 
                                        style={[styles.btnTerima, { backgroundColor: '#FF5252' }]}
                                        onPress={() => router.push({ pathname: '/detail-pesanan', params: { id: item.id } } as any)}
                                    >
                                        <Text style={styles.btnTerimaText}>Cek Masalah</Text>
                                    </TouchableOpacity>
                                )}

                                <TouchableOpacity 
                                    style={styles.btnDetail}
                                    onPress={() => router.push({ pathname: '/detail-pesanan', params: { id: item.id } } as any)}
                                >
                                    <Text style={styles.btnDetailText}>Detail</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    ))
                )}
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F8FBF8' },
    header: { 
        backgroundColor: '#2E8B57', 
        paddingTop: Platform.OS === 'ios' ? 20 : 60, 
        paddingBottom: 25, 
        paddingHorizontal: 24,
        borderBottomLeftRadius: 0,
        borderBottomRightRadius: 0
    },
    headerTitle: { fontSize: 22, fontWeight: 'bold', color: '#FFF' },
    tabContainer: { 
        flexDirection: 'row', 
        backgroundColor: '#FFF', 
        padding: 6, 
        marginHorizontal: 20, 
        marginTop: -20, 
        borderRadius: 15,
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        gap: 5
    },
    tabItem: { flex: 1, paddingVertical: 10, alignItems: 'center', borderRadius: 10 },
    activeTabItem: { backgroundColor: '#2E8B57' },
    tabText: { fontSize: 13, color: '#999', fontWeight: '500' },
    activeTabText: { color: '#FFF', fontWeight: 'bold' },
    scrollContent: { padding: 20, paddingTop: 10 },
    orderCard: { backgroundColor: '#FFF', borderRadius: 18, padding: 16, marginBottom: 16, elevation: 2, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 5 },
    cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 15 },
    orderNumber: { fontSize: 14, fontWeight: 'bold', color: '#333' },
    customerName: { fontSize: 13, color: '#666', marginTop: 2 },
    statusLabel: { fontSize: 11, color: '#F57C00', fontWeight: 'bold' },
    cardBody: { backgroundColor: '#F9FBF9', borderRadius: 12, padding: 12, marginBottom: 15 },
    infoRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 },
    infoLabel: { fontSize: 12, color: '#999' },
    infoValue: { fontSize: 13, fontWeight: 'bold', color: '#333' },
    cardActions: { flexDirection: 'row', gap: 10 },
    btnTerima: { flex: 2, backgroundColor: '#2E8B57', paddingVertical: 10, borderRadius: 10, alignItems: 'center' },
    btnTerimaText: { color: '#FFF', fontWeight: 'bold', fontSize: 14 },
    btnDetail: { flex: 1, backgroundColor: '#FFF', paddingVertical: 10, borderRadius: 10, alignItems: 'center', borderWidth: 1, borderColor: '#EEE' },
    btnDetailText: { color: '#666', fontWeight: 'bold', fontSize: 14 },
    emptyContainer: { alignItems: 'center', marginTop: 100 },
    emptyText: { color: '#999', marginTop: 10, fontSize: 15 }
});
