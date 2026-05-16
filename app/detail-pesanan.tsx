import { useAuth } from '@/context/AuthContext';
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
    Platform,
    Alert,
    Modal,
    TextInput
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
    user_id: number;
    user?: {
        id: number;
        name: string;
    }
}


export default function DetailPesananScreen() {
    const { id } = useLocalSearchParams<{ id: string }>();
    const { user } = useAuth();
    const [order, setOrder] = useState<OrderDetail | null>(null);
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState(false);
    
    // Reporting State
    const [reportModalVisible, setReportModalVisible] = useState(false);
    const [reportReason, setReportReason] = useState('');

    // Status Update Modal State
    const [confirmModalVisible, setConfirmModalVisible] = useState(false);
    const [pendingStatus, setPendingStatus] = useState<string | null>(null);



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

    const handleConfirmReceived = async () => {
        try {
            setUpdating(true);
            const response = await axiosClient.post(`/api/orders/${id}/confirm-received`);
            if (response.data.status === 'success') {
                setOrder(prev => prev ? { ...prev, status: 'selesai' } : null);
                router.push({
                    pathname: '/success-action',
                    params: {
                        title: 'Pesanan Selesai!',
                        message: 'Terima kasih telah berbelanja di Apotek Permata. Semoga lekas sembuh!',
                        target: '/(tabs)/pesanan'
                    }
                } as any);
            }
        } catch (e) {
            Alert.alert('Gagal', 'Terjadi kesalahan saat konfirmasi');
        } finally {
            setUpdating(false);
        }
    };

    const handleReportIssue = () => {
        setReportModalVisible(true);
    };

    const submitReport = async () => {
        if (!reportReason) {
            Alert.alert('Error', 'Silakan masukkan alasan laporan');
            return;
        }
        try {
            setUpdating(true);
            const res = await axiosClient.post(`/api/orders/${id}/report`, { reason: reportReason });
            if (res.data.status === 'success') {
                setOrder(prev => prev ? { ...prev, status: 'dilaporkan' } : null);
                setReportModalVisible(false);
                setReportReason('');
                Alert.alert('Terkirim', 'Laporan Anda telah kami terima dan sedang ditinjau.');
            }
        } catch (e) {
            Alert.alert('Gagal', 'Gagal mengirim laporan');
        } finally {
            setUpdating(false);
        }
    };


    const handleChatUser = async () => {
        if (!order?.user_id) return;
        try {
            setUpdating(true);
            const res = await axiosClient.post('/api/consultations/start', { user_id: order.user_id });
            if (res.data.status === 'success') {
                router.push({
                    pathname: '/apoteker/chat-room',
                    params: { id: res.data.data.id }
                } as any);
            }
        } catch (e) {
            Alert.alert('Error', 'Gagal memulai percakapan');
        } finally {
            setUpdating(false);
        }
    };

    const confirmStatusUpdate = (status: string) => {
        setPendingStatus(status);
        setConfirmModalVisible(true);
    };

    const updateStatus = async () => {
        if (!pendingStatus) return;
        const newStatus = pendingStatus;
        try {
            setUpdating(true);
            const response = await axiosClient.put(`/api/admin/orders/${id}/status`, { status: newStatus });
            
            if (response.data.status === 'success') {
                setConfirmModalVisible(false);
                setOrder(prev => prev ? { ...prev, status: newStatus } : null);
                
                router.push({
                    pathname: '/success-action',
                    params: {
                        title: 'Status Berhasil Diubah',
                        message: `Pesanan #${order?.order_number} sekarang berstatus ${newStatus.toUpperCase()}.`,
                        target: user?.role === 'apoteker' ? '/apoteker' : '/admin/manage-transactions'
                    }
                } as any);
            }
        } catch (e) {
            console.error('Failed to update status', e);
            Alert.alert('Gagal', 'Terjadi kesalahan saat memperbarui status');
        } finally {
            setUpdating(false);
            setPendingStatus(null);
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

    const o = order!;

    return (

        <SafeAreaView style={styles.container}>
            <Stack.Screen options={{ headerShown: false }} />
            
            {/* Modal Laporan */}
            <Modal
                visible={reportModalVisible}
                transparent
                animationType="fade"
                onRequestClose={() => setReportModalVisible(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Laporkan Masalah</Text>
                        <Text style={styles.modalSubtitle}>Jelaskan masalah yang Anda alami pada pesanan ini:</Text>
                        
                        <TextInput
                            style={styles.textArea}
                            placeholder="Contoh: Obat belum sampai walaupun status sudah selesai..."
                            multiline
                            numberOfLines={4}
                            value={reportReason}
                            onChangeText={setReportReason}
                        />

                        <View style={styles.modalButtons}>
                            <TouchableOpacity 
                                style={[styles.modalBtn, styles.btnCancel]} 
                                onPress={() => setReportModalVisible(false)}
                            >
                                <Text style={styles.btnCancelText}>Batal</Text>
                            </TouchableOpacity>
                            <TouchableOpacity 
                                style={[styles.modalBtn, styles.btnSubmit]} 
                                onPress={submitReport}
                                disabled={updating}
                            >
                                {updating ? <ActivityIndicator color="#FFF" /> : <Text style={styles.btnSubmitText}>Kirim Laporan</Text>}
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>

            {/* Modal Konfirmasi Status */}
            <Modal
                visible={confirmModalVisible}
                transparent
                animationType="slide"
                onRequestClose={() => setConfirmModalVisible(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <View style={styles.iconCircle}>
                            <Ionicons name="help-circle" size={40} color="#2E8B57" />
                        </View>
                        <Text style={styles.modalTitle}>Ubah Status Pesanan?</Text>
                        <Text style={styles.modalSubtitle}>
                            Apakah Anda yakin ingin mengubah status pesanan ini menjadi {pendingStatus?.toUpperCase()}?
                        </Text>
                        
                        <View style={styles.modalButtons}>
                            <TouchableOpacity 
                                style={[styles.modalBtn, styles.btnCancel]} 
                                onPress={() => setConfirmModalVisible(false)}
                            >
                                <Text style={styles.btnCancelText}>Kembali</Text>
                            </TouchableOpacity>
                            <TouchableOpacity 
                                style={[styles.modalBtn, { backgroundColor: '#2E8B57' }]} 
                                onPress={updateStatus}
                                disabled={updating}
                            >
                                {updating ? <ActivityIndicator color="#FFF" /> : <Text style={styles.btnSubmitText}>Ya, Update</Text>}
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>

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
                            <Text style={styles.statusValue}>{o.order_number}</Text>

                        </View>
                        <View style={[
                            styles.badgeStatus, 
                            order.status === 'diproses' && { backgroundColor: '#E3F2FD' },
                            order.status === 'dikirim' && { backgroundColor: '#FFF3E0' },
                            order.status === 'selesai' && { backgroundColor: '#E8F5E9' },
                            order.status === 'dibatalkan' && { backgroundColor: '#FFEBEE' },
                            order.status === 'dilaporkan' && { backgroundColor: '#FFFDE7' }
                        ]}>
                            <Text style={[
                                styles.badgeStatusText,
                                o.status === 'diproses' && { color: '#1976D2' },
                                o.status === 'dikirim' && { color: '#EF6C00' },
                                o.status === 'selesai' && { color: '#2E8B57' },
                                o.status === 'dibatalkan' && { color: '#D32F2F' },
                                o.status === 'dilaporkan' && { color: '#FBC02D' }
                            ]}>{o.status.toUpperCase()}</Text>


                        </View>
                        {user?.role === 'apoteker' && (
                            <TouchableOpacity style={styles.chatBtnHeader} onPress={handleChatUser}>
                                <Ionicons name="chatbubble-ellipses" size={18} color="#1976D2" />
                                <Text style={styles.chatBtnHeaderText}>Chat</Text>
                            </TouchableOpacity>
                        )}

                    </View>

                    <View style={styles.divider} />
                    <View style={styles.dateRow}>
                        <Feather name="calendar" size={14} color="#666" />
                        <Text style={styles.dateText}>{formatDate(o.created_at)} WIB</Text>

                    </View>
                </View>

                {/* Shipping Section */}
                <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                        <Feather name="map-pin" size={18} color="#2E8B57" />
                        <Text style={styles.sectionTitle}>Alamat Pengiriman</Text>
                    </View>
                    <View style={styles.addressBox}>
                        <Text style={styles.addressText}>{o.shipping_address}</Text>
                        {o.notes && (
                            <View style={styles.notesBox}>
                                <Text style={styles.notesLabel}>Catatan:</Text>
                                <Text style={styles.notesText}>{o.notes}</Text>
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
                    {o.items.map((item) => (

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
                        <Text style={styles.paymentValue}>Rp {o.total_price.toLocaleString('id-ID')}</Text>
                    </View>
                    {/* Statis karena dari API kita hanya simpan total_price saat ini */}
                    <View style={styles.paymentRow}>
                        <Text style={styles.paymentLabel}>Biaya Layanan</Text>
                        <Text style={styles.paymentValue}>Rp 2.000</Text>
                    </View>
                    <View style={styles.divider} />
                    <View style={styles.totalRow}>
                        <Text style={styles.totalLabel}>Total Bayar</Text>
                        <Text style={styles.totalValue}>Rp {(o.total_price + 2000).toLocaleString('id-ID')}</Text>
                    </View>

                </View>

                {/* User Actions */}
                {user?.role === 'member' && (o.status === 'dikirim' || o.status === 'selesai') && (
                    <View style={styles.userActionSection}>
                        <Text style={styles.actionSectionTitle}>Aksi Pesanan</Text>
                        <View style={styles.actionRow}>
                            {o.status === 'dikirim' && (
                                <TouchableOpacity 
                                    style={[styles.btnAction, { backgroundColor: '#2E8B57' }]} 
                                    onPress={handleConfirmReceived}
                                    disabled={updating}
                                >
                                    <Text style={styles.btnActionText}>Konfirmasi Diterima</Text>
                                </TouchableOpacity>
                            )}
                            <TouchableOpacity 
                                style={[styles.btnAction, { backgroundColor: '#FF5252', flex: 0.8 }]} 
                                onPress={handleReportIssue}
                                disabled={updating}
                            >
                                <Text style={styles.btnActionText}>Laporkan Masalah</Text>
                            </TouchableOpacity>
                        </View>
                        {o.status === 'selesai' && (

                            <Text style={styles.infoTextSmall}>
                                Jika Anda belum menerima obat tetapi status sudah "Selesai", silakan klik "Laporkan Masalah".
                            </Text>
                        )}
                    </View>
                )}

                {/* Pharmacist Actions */}
                {user?.role === 'apoteker' && (

                    <View style={styles.pharmacistSection}>
                        <Text style={styles.adminTitle}>Panel Apoteker</Text>
                        <View style={styles.actionRow}>
                            {o.status === 'pending' && (
                                <TouchableOpacity 
                                    style={[styles.btnAction, { backgroundColor: '#1976D2' }]} 
                                    onPress={() => confirmStatusUpdate('diproses')}
                                    disabled={updating}
                                >
                                    <Text style={styles.btnActionText}>Proses</Text>
                                </TouchableOpacity>
                            )}
                            {o.status === 'diproses' && (
                                <TouchableOpacity 
                                    style={[styles.btnAction, { backgroundColor: '#EF6C00' }]} 
                                    onPress={() => confirmStatusUpdate('dikirim')}
                                    disabled={updating}
                                >
                                    <Text style={styles.btnActionText}>Kirim</Text>
                                </TouchableOpacity>
                            )}
                            {(o.status === 'dikirim' || o.status === 'dilaporkan') && (
                                <TouchableOpacity 
                                    style={[styles.btnAction, { backgroundColor: '#2E8B57' }]} 
                                    onPress={() => confirmStatusUpdate('selesai')}
                                    disabled={updating}
                                >
                                    <Text style={styles.btnActionText}>Selesaikan</Text>
                                </TouchableOpacity>
                            )}
                            {o.status !== 'selesai' && o.status !== 'dibatalkan' && (
                                <TouchableOpacity 
                                    style={[styles.btnAction, { backgroundColor: '#D32F2F' }]} 
                                    onPress={() => confirmStatusUpdate('dibatalkan')}
                                    disabled={updating}
                                >
                                    <Text style={styles.btnActionText}>Batalkan</Text>
                                </TouchableOpacity>
                            )}



                        </View>
                        {updating && <ActivityIndicator color="#2E8B57" style={{ marginTop: 10 }} />}
                    </View>

                )}

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
    pharmacistSection: { backgroundColor: '#FFF', borderRadius: 16, padding: 16, marginBottom: 16, borderWidth: 2, borderColor: '#E3F2FD' },
    adminTitle: { fontSize: 14, fontWeight: 'bold', color: '#1976D2', marginBottom: 12, textTransform: 'uppercase' },
    actionRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
    btnAction: { flex: 1, minWidth: 120, paddingVertical: 12, borderRadius: 10, alignItems: 'center' },
    btnActionText: { color: '#FFF', fontWeight: 'bold', fontSize: 13 },
    backLink: { marginTop: 20 },
    backLinkText: { color: '#2E8B57', fontWeight: 'bold' },
    userActionSection: { backgroundColor: '#FFF', borderRadius: 16, padding: 16, marginBottom: 16, borderWidth: 1, borderColor: '#EEE' },
    actionSectionTitle: { fontSize: 14, fontWeight: 'bold', color: '#333', marginBottom: 12 },
    infoTextSmall: { fontSize: 11, color: '#FF5252', marginTop: 10, fontStyle: 'italic' },
    
    // Modal Styles
    modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', padding: 20 },
    modalContent: { backgroundColor: '#FFF', borderRadius: 20, padding: 20, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.25, shadowRadius: 4, elevation: 5 },
    modalTitle: { fontSize: 18, fontWeight: 'bold', color: '#333', marginBottom: 8 },
    modalSubtitle: { fontSize: 14, color: '#666', marginBottom: 16 },
    textArea: { backgroundColor: '#F5F5F5', borderRadius: 12, padding: 12, height: 100, textAlignVertical: 'top', fontSize: 14, color: '#333', marginBottom: 20 },
    modalButtons: { flexDirection: 'row', gap: 12 },
    modalBtn: { flex: 1, height: 48, borderRadius: 12, justifyContent: 'center', alignItems: 'center' },
    btnCancel: { backgroundColor: '#EEE' },
    btnCancelText: { color: '#666', fontWeight: 'bold' },
    btnSubmit: { backgroundColor: '#FF5252' },
    btnSubmitText: { color: '#FFF', fontWeight: 'bold' },
    chatBtnHeader: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: '#E3F2FD', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20 },
    chatBtnHeaderText: { fontSize: 12, fontWeight: 'bold', color: '#1976D2' },
    iconCircle: { width: 70, height: 70, borderRadius: 35, backgroundColor: '#E8F5E9', justifyContent: 'center', alignItems: 'center', alignSelf: 'center', marginBottom: 15 }
});



