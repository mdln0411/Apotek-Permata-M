import axiosClient from '@/api/axiosClient';
import AdminSidebar from '@/components/AdminSidebar';
import {
    ADMIN_ORDER_STATUS_OPTIONS,
    getOrderStatusColors,
    getOrderStatusLabel,
    getOrderStatusOptionLabel,
    normalizeToApiOrderStatus,
} from '@/utils/orderStatus';
import { Feather, Ionicons } from '@expo/vector-icons';
import { router, Stack, useFocusEffect } from 'expo-router';
import React, { useCallback, useState } from 'react';
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
} from 'react-native';

export default function ManageTransactions() {
    const [sidebarVisible, setSidebarVisible] = useState(false);
    const [orders, setOrders] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedOrder, setSelectedOrder] = useState<any>(null);
    const [detailVisible, setDetailVisible] = useState(false);
    const [pendingStatus, setPendingStatus] = useState('');
    const [statusDropdownOpen, setStatusDropdownOpen] = useState(false);
    const [savingStatus, setSavingStatus] = useState(false);

    const fetchOrders = async () => {
        try {
            setLoading(true);
            const response = await axiosClient.get('/api/admin/orders');
            setOrders(response.data.data || []);
        } catch (error) {
            console.error('Error fetching orders:', error);
        } finally {
            setLoading(false);
        }
    };

    useFocusEffect(
        useCallback(() => {
            fetchOrders();
        }, [])
    );

    const openDetail = (order: any) => {
        setSelectedOrder(order);
        setPendingStatus(normalizeToApiOrderStatus(order.status || 'menunggu_pembayaran'));
        setStatusDropdownOpen(false);
        setDetailVisible(true);
    };

    const saveStatus = async () => {
        if (!selectedOrder || !pendingStatus) return;
        const current = normalizeToApiOrderStatus(selectedOrder.status || '');
        if (pendingStatus === current) {
            alert('Status sudah sama, tidak ada perubahan.');
            return;
        }

        try {
            setSavingStatus(true);
            const response = await axiosClient.put(`/api/admin/orders/${selectedOrder.id}/status`, {
                status: pendingStatus,
            });
            const updated = response.data.data;
            alert(`Status berhasil diubah menjadi ${getOrderStatusOptionLabel(pendingStatus)}`);
            setSelectedOrder(updated);
            setPendingStatus(normalizeToApiOrderStatus(updated.status));
            setStatusDropdownOpen(false);
            await fetchOrders();
        } catch (error: any) {
            const msg = error.response?.data?.message || 'Gagal memperbarui status';
            alert(msg);
        } finally {
            setSavingStatus(false);
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

            {detailVisible && (
                <Modal
                    visible={detailVisible}
                    animationType="fade"
                    transparent
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
                                        <Text style={styles.label}>
                                            Order ID: <Text style={styles.value}>{selectedOrder.order_number}</Text>
                                        </Text>
                                        <Text style={styles.label}>
                                            Pelanggan: <Text style={styles.value}>{selectedOrder.user?.name}</Text>
                                        </Text>
                                        <Text style={styles.label}>
                                            Alamat: <Text style={styles.value}>{selectedOrder.shipping_address}</Text>
                                        </Text>
                                        <Text style={styles.label}>
                                            Catatan: <Text style={styles.value}>{selectedOrder.notes || '-'}</Text>
                                        </Text>
                                    </View>

                                    <View style={styles.section}>
                                        <Text style={styles.sectionTitle}>Item Pesanan</Text>
                                        {selectedOrder.items?.map((item: any, index: number) => (
                                            <View key={index} style={styles.itemRow}>
                                                <Text style={styles.itemName}>
                                                    {item.name} x {item.quantity}
                                                </Text>
                                                <Text style={styles.itemPrice}>
                                                    Rp {Number(item.subtotal).toLocaleString('id-ID')}
                                                </Text>
                                            </View>
                                        ))}
                                        <View style={styles.totalRow}>
                                            <Text style={styles.totalLabel}>Total Pembayaran</Text>
                                            <Text style={styles.totalValue}>
                                                Rp {Number(selectedOrder.total_price).toLocaleString('id-ID')}
                                            </Text>
                                        </View>
                                    </View>

                                    <View style={styles.section}>
                                        <Text style={styles.sectionTitle}>Status Pesanan</Text>
                                        <Text style={styles.statusHint}>
                                            Perubahan status tersimpan di server dan akan tampil di apoteker & pasien.
                                        </Text>

                                        <Text style={styles.dropdownLabel}>Pilih Status</Text>
                                        <TouchableOpacity
                                            style={styles.dropdownTrigger}
                                            onPress={() => setStatusDropdownOpen((v) => !v)}
                                            activeOpacity={0.8}
                                        >
                                            <View
                                                style={[
                                                    styles.currentStatusBadge,
                                                    {
                                                        backgroundColor: getOrderStatusColors(pendingStatus).bg,
                                                    },
                                                ]}
                                            >
                                                <Text
                                                    style={[
                                                        styles.currentStatusText,
                                                        { color: getOrderStatusColors(pendingStatus).text },
                                                    ]}
                                                >
                                                    {getOrderStatusOptionLabel(pendingStatus)}
                                                </Text>
                                            </View>
                                            <Ionicons
                                                name={statusDropdownOpen ? 'chevron-up' : 'chevron-down'}
                                                size={20}
                                                color="#555"
                                            />
                                        </TouchableOpacity>

                                        {statusDropdownOpen && (
                                            <View style={styles.dropdownList}>
                                                {ADMIN_ORDER_STATUS_OPTIONS.map((opt) => {
                                                    const active = pendingStatus === opt.value;
                                                    const colors = getOrderStatusColors(opt.value);
                                                    return (
                                                        <TouchableOpacity
                                                            key={opt.value}
                                                            style={[
                                                                styles.dropdownItem,
                                                                active && styles.dropdownItemActive,
                                                            ]}
                                                            onPress={() => {
                                                                setPendingStatus(opt.value);
                                                                setStatusDropdownOpen(false);
                                                            }}
                                                        >
                                                            <View
                                                                style={[
                                                                    styles.dropdownItemDot,
                                                                    { backgroundColor: colors.text },
                                                                ]}
                                                            />
                                                            <Text
                                                                style={[
                                                                    styles.dropdownItemText,
                                                                    active && styles.dropdownItemTextActive,
                                                                ]}
                                                            >
                                                                {opt.label}
                                                            </Text>
                                                            {active ? (
                                                                <Ionicons name="checkmark" size={18} color="#2E8B57" />
                                                            ) : null}
                                                        </TouchableOpacity>
                                                    );
                                                })}
                                            </View>
                                        )}

                                        <TouchableOpacity
                                            style={[styles.saveStatusBtn, savingStatus && styles.saveStatusBtnDisabled]}
                                            onPress={saveStatus}
                                            disabled={savingStatus}
                                        >
                                            {savingStatus ? (
                                                <ActivityIndicator color="#FFF" />
                                            ) : (
                                                <Text style={styles.saveStatusBtnText}>Simpan Perubahan Status</Text>
                                            )}
                                        </TouchableOpacity>
                                    </View>
                                </ScrollView>
                            )}
                        </View>
                    </View>
                </Modal>
            )}

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

                <View style={styles.listContainer}>
                    {loading ? (
                        <ActivityIndicator size="large" color="#2E8B57" style={{ marginTop: 20 }} />
                    ) : (
                        orders.map((item) => {
                            const statusColor = getOrderStatusColors(item.status);
                            return (
                                <TouchableOpacity
                                    key={item.id}
                                    style={styles.transCard}
                                    onPress={() => openDetail(item)}
                                >
                                    <View style={styles.cardHeader}>
                                        <View>
                                            <Text style={styles.orderId}>{item.order_number}</Text>
                                            <Text style={styles.customerName}>{item.user?.name || 'User'}</Text>
                                            <Text style={styles.orderDate}>
                                                {new Date(item.created_at).toLocaleDateString('id-ID')}
                                            </Text>
                                        </View>
                                        <View style={[styles.statusBadge, { backgroundColor: statusColor.bg }]}>
                                            <Text style={[styles.statusText, { color: statusColor.text }]}>
                                                {getOrderStatusLabel(item.status)}
                                            </Text>
                                        </View>
                                    </View>

                                    <View style={styles.divider} />

                                    <View style={styles.cardFooter}>
                                        <Text style={styles.itemDetail}>
                                            {item.items?.length || 0} Item • {item.notes || 'Reguler'}
                                        </Text>
                                        <Text style={styles.totalAmount}>
                                            Rp {Number(item.total_price).toLocaleString('id-ID')}
                                        </Text>
                                    </View>
                                </TouchableOpacity>
                            );
                        })
                    )}
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
        backgroundColor: '#2E8B57',
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
    statusText: { fontSize: 11, fontWeight: 'bold' },
    divider: { height: 1, backgroundColor: '#F5F5F5', marginBottom: 16 },
    cardFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    itemDetail: { fontSize: 12, color: '#777' },
    totalAmount: { fontSize: 15, fontWeight: 'bold', color: '#2E8B57' },

    modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', padding: 20 },
    modalContent: { backgroundColor: '#FFF', borderRadius: 24, padding: 24, maxHeight: '85%' },
    modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
    modalTitle: { fontSize: 18, fontWeight: 'bold', color: '#333' },
    section: { marginBottom: 20 },
    sectionTitle: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#2E8B57',
        marginBottom: 8,
        borderBottomWidth: 1,
        borderBottomColor: '#EEE',
        paddingBottom: 4,
    },
    label: { fontSize: 13, color: '#777', marginBottom: 4 },
    value: { color: '#333', fontWeight: '500' },
    itemRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 },
    itemName: { fontSize: 13, color: '#555', flex: 1, paddingRight: 8 },
    itemPrice: { fontSize: 13, fontWeight: '500' },
    totalRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 10,
        paddingTop: 10,
        borderTopWidth: 1,
        borderTopColor: '#EEE',
    },
    totalLabel: { fontWeight: 'bold', fontSize: 14 },
    totalValue: { fontWeight: 'bold', fontSize: 16, color: '#2E8B57' },
    statusHint: { fontSize: 12, color: '#888', marginBottom: 12, lineHeight: 18 },
    dropdownLabel: { fontSize: 13, fontWeight: '600', color: '#555', marginBottom: 8 },
    dropdownTrigger: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderWidth: 1,
        borderColor: '#E8F5E9',
        borderRadius: 12,
        padding: 12,
        backgroundColor: '#F8FBF8',
    },
    currentStatusBadge: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20 },
    currentStatusText: { fontSize: 13, fontWeight: '700' },
    dropdownList: {
        marginTop: 8,
        borderWidth: 1,
        borderColor: '#EEE',
        borderRadius: 12,
        overflow: 'hidden',
        backgroundColor: '#FFF',
    },
    dropdownItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
        paddingHorizontal: 14,
        borderBottomWidth: 1,
        borderBottomColor: '#F5F5F5',
        gap: 10,
    },
    dropdownItemActive: { backgroundColor: '#F0F9F4' },
    dropdownItemDot: { width: 8, height: 8, borderRadius: 4 },
    dropdownItemText: { flex: 1, fontSize: 14, color: '#444' },
    dropdownItemTextActive: { color: '#2E8B57', fontWeight: '700' },
    saveStatusBtn: {
        marginTop: 16,
        backgroundColor: '#2E8B57',
        borderRadius: 12,
        paddingVertical: 14,
        alignItems: 'center',
    },
    saveStatusBtnDisabled: { opacity: 0.7 },
    saveStatusBtnText: { color: '#FFF', fontSize: 15, fontWeight: 'bold' },
});
