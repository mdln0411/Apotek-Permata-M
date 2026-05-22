import axiosClient from '@/api/axiosClient';
import AdminSidebar from '@/components/AdminSidebar';
import { Feather, Ionicons } from '@expo/vector-icons';
import { router, Stack } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { 
    SafeAreaView, 
    ScrollView, 
    StyleSheet, 
    Text, 
    TouchableOpacity, 
    View, 
    Platform,
    ActivityIndicator,
    Modal,
    Alert
} from 'react-native';

export default function ManageTransactions() {
    const [sidebarVisible, setSidebarVisible] = useState(false);
    const [orders, setOrders] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedOrder, setSelectedOrder] = useState<any>(null);
    const [detailVisible, setDetailVisible] = useState(false);

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            setLoading(true);
            const response = await axiosClient.get('/api/admin/orders');
            setOrders(response.data.data);
        } catch (error) {
            console.error('Error fetching orders:', error);
        } finally {
            setLoading(false);
        }
    };

    const updateStatus = async (id: number, newStatus: string) => {
        try {
            await axiosClient.put(`/api/admin/orders/${id}/status`, { status: newStatus });
            alert(`Status berhasil diubah ke ${newStatus}`);
            setDetailVisible(false);
            fetchOrders();
        } catch (error) {
            alert('Gagal memperbarui status');
        }
    };

    const getStatusColor = (status: string) => {
        switch (status.toLowerCase()) {
            case 'diproses': 
            case 'processing': return { bg: '#FFF9C4', text: '#F57C00' };
            case 'dikirim': return { bg: '#E3F2FD', text: '#1976D2' };
            case 'selesai': 
            case 'completed': return { bg: '#E8F5E9', text: '#2E8B57' };
            case 'menunggu': 
            case 'pending': return { bg: '#E3F2FD', text: '#1976D2' };
            case 'dibatalkan': return { bg: '#FFEBEE', text: '#D32F2F' };
            case 'dilaporkan': return { bg: '#FFFDE7', text: '#FBC02D' };
            default: return { bg: '#F5F5F5', text: '#999' };

        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <Stack.Screen options={{ headerShown: false }} />

            <AdminSidebar 
                visible={sidebarVisible} 
                onClose={() => setSidebarVisible(false)} 
                activePage="transactions" 
            />

            {/* Modal Detail & Update Status */}
            <Modal
                visible={detailVisible}
                animationType="fade"
                transparent={true}
                onRequestClose={() => setDetailVisible(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>Detail Transaksi</Text>
                            <TouchableOpacity onPress={() => setDetailVisible(false)}>
                                <Ionicons name="close" size={24} color="#333" />
                            </TouchableOpacity>
                        </View>

                        {selectedOrder && (
                            <ScrollView showsVerticalScrollIndicator={false}>
                                <View style={styles.section}>
                                    <Text style={styles.sectionTitle}>Informasi Pesanan</Text>
                                    <Text style={styles.label}>Order ID: <Text style={styles.value}>{selectedOrder.order_number}</Text></Text>
                                    <Text style={styles.label}>Pelanggan: <Text style={styles.value}>{selectedOrder.user?.name}</Text></Text>
                                    <Text style={styles.label}>Alamat: <Text style={styles.value}>{selectedOrder.shipping_address}</Text></Text>
                                    <Text style={styles.label}>Catatan: <Text style={styles.value}>{selectedOrder.notes || '-'}</Text></Text>
                                </View>

                                <View style={styles.section}>
                                    <Text style={styles.sectionTitle}>Item Pesanan</Text>
                                    {selectedOrder.items?.map((item: any, index: number) => (
                                        <View key={index} style={styles.itemRow}>
                                            <Text style={styles.itemName}>{item.name} x {item.quantity}</Text>
                                            <Text style={styles.itemPrice}>Rp {Math.round(Number(item.subtotal)).toLocaleString('id-ID')}</Text>
                                        </View>
                                    ))}
                                    <View style={styles.totalRow}>
                                        <Text style={styles.totalLabel}>Total Pembayaran</Text>
                                        <Text style={styles.totalValue}>Rp {Math.round(Number(selectedOrder.total_price)).toLocaleString('id-ID')}</Text>
                                    </View>
                                </View>

                                <View style={styles.section}>
                                    <Text style={styles.sectionTitle}>Ubah Status</Text>
                                    <View style={styles.statusButtons}>
                                        <TouchableOpacity 
                                            style={[styles.statusBtn, { borderColor: '#1976D2' }]} 
                                            onPress={() => updateStatus(selectedOrder.id, 'pending')}
                                        >
                                            <Text style={{ color: '#1976D2' }}>Menunggu</Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity 
                                            style={[styles.statusBtn, { borderColor: '#F57C00' }]} 
                                            onPress={() => updateStatus(selectedOrder.id, 'diproses')}
                                        >
                                            <Text style={{ color: '#F57C00' }}>Diproses</Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity 
                                            style={[styles.statusBtn, { borderColor: '#1976D2' }]} 
                                            onPress={() => updateStatus(selectedOrder.id, 'dikirim')}
                                        >
                                            <Text style={{ color: '#1976D2' }}>Kirim</Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity 
                                            style={[styles.statusBtn, { borderColor: '#2E8B57' }]} 
                                            onPress={() => updateStatus(selectedOrder.id, 'selesai')}
                                        >
                                            <Text style={{ color: '#2E8B57' }}>Selesai</Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity 
                                            style={[styles.statusBtn, { borderColor: '#FBC02D' }]} 
                                            onPress={() => updateStatus(selectedOrder.id, 'dilaporkan')}
                                        >
                                            <Text style={{ color: '#FBC02D' }}>Dilaporkan</Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity 
                                            style={[styles.statusBtn, { borderColor: '#D32F2F' }]} 
                                            onPress={() => updateStatus(selectedOrder.id, 'dibatalkan')}
                                        >
                                            <Text style={{ color: '#D32F2F' }}>Batal</Text>
                                        </TouchableOpacity>

                                    </View>
                                </View>
                            </ScrollView>
                        )}
                    </View>
                </View>
            </Modal>

            {/* Header */}
            <View style={styles.topBar}>
                <View style={styles.headerLeft}>
                    <TouchableOpacity onPress={() => setSidebarVisible(true)} style={styles.menuIcon}>
                        <Ionicons name="menu" size={28} color="#FFF" />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => router.back()} style={styles.backRow}>
                        <Ionicons name="arrow-back" size={20} color="#FFF" />
                        <Text style={styles.backText}>Kembali</Text>
                    </TouchableOpacity>
                </View>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
                
                <View style={styles.headerTitleRow}>
                    <Text style={styles.pageTitle}>Manajemen Transaksi</Text>
                    <Text style={styles.pageSub}>{orders.length} transaksi</Text>
                </View>

                {/* Transaction List */}
                <View style={styles.listContainer}>
                    {loading ? (
                        <ActivityIndicator size="large" color="#2E8B57" style={{ marginTop: 20 }} />
                    ) : orders.map((item) => {
                        const statusColor = getStatusColor(item.status);
                        return (
                            <TouchableOpacity 
                                key={item.id} 
                                style={styles.transCard}
                                onPress={() => {
                                    setSelectedOrder(item);
                                    setDetailVisible(true);
                                }}
                            >
                                <View style={styles.cardHeader}>
                                    <View>
                                        <Text style={styles.orderId}>{item.order_number}</Text>
                                        <Text style={styles.customerName}>{item.user?.name || 'User'}</Text>
                                        <Text style={styles.orderDate}>{new Date(item.created_at).toLocaleDateString('id-ID')}</Text>
                                    </View>
                                    <View style={[styles.statusBadge, { backgroundColor: statusColor.bg }]}>
                                        <Text style={[styles.statusText, { color: statusColor.text }]}>{(item.status || 'pending').toUpperCase()}</Text>
                                    </View>
                                </View>
                                
                                <View style={styles.divider} />
                                
                                <View style={styles.cardFooter}>
                                    <Text style={styles.itemDetail}>{item.items?.length || 0} Item • {item.notes || 'Reguler'}</Text>
                                    <Text style={styles.totalAmount}>Rp {Math.round(Number(item.total_price)).toLocaleString('id-ID')}</Text>
                                </View>
                            </TouchableOpacity>
                        );
                    })}
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F8FBF8' },
    topBar: { 
        flexDirection: 'row', 
        alignItems: 'center', 
        paddingHorizontal: 16, 
        paddingTop: Platform.OS === 'ios' ? 20 : 50, 
        paddingBottom: 20, 
        backgroundColor: '#2E8B57' 
    },
    headerLeft: { flexDirection: 'row', alignItems: 'center', gap: 5 },
    menuIcon: { width: 40, height: 40, justifyContent: 'center', alignItems: 'center' },
    backRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
    backText: { color: '#FFF', fontSize: 14, fontWeight: '500' },
    scrollContent: { padding: 20 },
    headerTitleRow: { marginBottom: 20 },
    pageTitle: { fontSize: 22, fontWeight: 'bold', color: '#333' },
    pageSub: { fontSize: 13, color: '#999', marginTop: 2 },
    listContainer: { gap: 16 },
    transCard: { backgroundColor: '#FFF', borderRadius: 16, padding: 16, borderWidth: 1, borderColor: '#EEE' },
    cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 },
    orderId: { fontSize: 15, fontWeight: 'bold', color: '#333', marginBottom: 2 },
    customerName: { fontSize: 13, color: '#555' },
    orderDate: { fontSize: 11, color: '#999', marginTop: 2 },
    statusBadge: { paddingHorizontal: 12, paddingVertical: 4, borderRadius: 20 },
    statusText: { fontSize: 12, fontWeight: 'bold' },
    divider: { height: 1, backgroundColor: '#F5F5F5', marginBottom: 16 },
    cardFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    itemDetail: { fontSize: 12, color: '#777' },
    totalAmount: { fontSize: 15, fontWeight: 'bold', color: '#2E8B57' },
    
    // Modal
    modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', padding: 20 },
    modalContent: { backgroundColor: '#FFF', borderRadius: 24, padding: 24, maxHeight: '80%' },
    modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
    modalTitle: { fontSize: 18, fontWeight: 'bold', color: '#333' },
    section: { marginBottom: 20 },
    sectionTitle: { fontSize: 14, fontWeight: 'bold', color: '#2E8B57', marginBottom: 8, borderBottomWidth: 1, borderBottomColor: '#EEE', paddingBottom: 4 },
    label: { fontSize: 13, color: '#777', marginBottom: 4 },
    value: { color: '#333', fontWeight: '500' },
    itemRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 },
    itemName: { fontSize: 13, color: '#555' },
    itemPrice: { fontSize: 13, fontWeight: '500' },
    totalRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 10, paddingTop: 10, borderTopWidth: 1, borderTopColor: '#EEE' },
    totalLabel: { fontWeight: 'bold', fontSize: 14 },
    totalValue: { fontWeight: 'bold', fontSize: 16, color: '#2E8B57' },
    statusButtons: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 10 },
    statusBtn: { paddingVertical: 8, paddingHorizontal: 12, borderRadius: 8, borderWidth: 1, minWidth: 80, alignItems: 'center' }
});
