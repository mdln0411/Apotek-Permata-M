import axiosClient from '@/api/axiosClient';
import { storageUrl } from '@/constants/api';
import { useAuth } from '@/context/AuthContext';
import { normalizeOrderStatus } from '@/utils/orderStatus';
import { isPickupOrder } from '@/utils/orderFulfillment';
import { showAppAlert } from '@/utils/alert';
import { Feather, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { router, Stack, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    Image,
    Modal,
    Platform,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
    KeyboardAvoidingView
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


const renderMedicineImage = (item: any) => {
    if (item.image_url) {
        const imageUrl = storageUrl(item.image_url);
        return (
            <Image 
                source={{ uri: imageUrl }} 
                style={styles.itemImage || { width: '100%', height: '100%' }} 
                resizeMode="cover"
            />
        );
    }

    const unitLower = (item.unit || '').toLowerCase();
    const nameLower = (item.name || '').toLowerCase();
    const isLiquid = unitLower.includes('ml') || unitLower.includes('botol') || unitLower.includes('cair') || nameLower.includes('sirup') || nameLower.includes('cair') || nameLower.includes('drop') || nameLower.includes('suspensi');
    const iconName = isLiquid ? 'bottle-tonic-plus' : 'pill';
    
    const bgColors = ['#E8F5E9', '#E3F2FD', '#FFF3E0', '#F3E5F5', '#E8EAF6'];
    const textColors = ['#2E8B57', '#1976D2', '#F57C00', '#7B1FA2', '#3F51B5'];
    
    let hash = 0;
    const name = item.name || '';
    for (let i = 0; i < name.length; i++) {
        hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    const colorIndex = Math.abs(hash) % bgColors.length;
    const bgColor = bgColors[colorIndex];
    const textColor = textColors[colorIndex];

    return (
        <View style={{ width: '100%', height: '100%', backgroundColor: bgColor, justifyContent: 'center', alignItems: 'center' }}>
            <MaterialCommunityIcons name={iconName as any} size={20} color={textColor} />
        </View>
    );
};

export default function DetailPesananScreen() {
    const { id } = useLocalSearchParams<{ id: string }>();
    const orderId = Array.isArray(id) ? id[0] : id;
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

    // Cancellation Modal State
    const [cancelModalVisible, setCancelModalVisible] = useState(false);
    const [cancelReason, setCancelReason] = useState('');
    const [isApotekerCancel, setIsApotekerCancel] = useState(false);
    const [completeModalVisible, setCompleteModalVisible] = useState(false);

    const submitCancellation = async () => {
        if (!cancelReason) {
            Alert.alert('Error', 'Silakan masukkan alasan pembatalan');
            return;
        }
        try {
            setUpdating(true);
            const res = await axiosClient.post(`/api/orders/${orderId}/cancel`, { reason: cancelReason });
            if (res.data.status === 'success') {
                setOrder(prev => prev ? { ...prev, status: 'dibatalkan' } : null);
                setCancelModalVisible(false);
                setCancelReason('');
                
                router.push({
                    pathname: '/success-action',
                    params: {
                        title: 'Pesanan Dibatalkan',
                        message: `Pesanan #${order?.order_number} telah berhasil dibatalkan.`,
                        target: user?.role === 'apoteker' ? '/apoteker' : '/(tabs)/pesanan'
                    }
                } as any);
            }
        } catch (e: any) {
            console.error('Failed to cancel order:', e.response?.data || e.message);
            Alert.alert('Gagal', e.response?.data?.message || 'Terjadi kesalahan saat membatalkan pesanan');
        } finally {
            setUpdating(false);
        }
    };



    const fetchOrderDetail = async () => {
        try {
            const res = await axiosClient.get(`/api/orders/${orderId}`);
            console.log('Order Detail Data:', JSON.stringify(res.data.data.items[0], null, 2));
            setOrder(res.data.data);
        } catch (e) {
            console.error('Failed to fetch order detail', e);
        } finally {
            setLoading(false);
        }
    };

    const submitOrderComplete = async () => {
        if (!orderId) return;
        try {
            setUpdating(true);
            const response = await axiosClient.post(`/api/orders/${orderId}/confirm-received`, {});
            if (response.data?.status === 'success') {
                setCompleteModalVisible(false);
                setOrder((prev) => (prev ? { ...prev, status: 'selesai' } : null));
                router.replace({
                    pathname: '/(tabs)/pesanan',
                    params: { tab: 'pesanan', subTab: 'selesai' },
                } as any);
            } else {
                showAppAlert('Gagal', response.data?.message || 'Gagal menyelesaikan pesanan');
            }
        } catch (e: any) {
            showAppAlert(
                'Gagal',
                e.response?.data?.message || 'Terjadi kesalahan saat menyelesaikan pesanan',
            );
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
            const res = await axiosClient.post(`/api/orders/${orderId}/report`, { reason: reportReason });
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
            let response;
            let newActualStatus = newStatus;

            if (newStatus === 'verify_payment') {
                response = await axiosClient.post(`/api/admin/orders/${orderId}/verify-payment`);
                newActualStatus = response.data?.data?.status ?? (isPickupOrder(order ?? {}) ? 'sedang_diproses' : 'perlu_diproses');
            } else if (newStatus === 'pickup_complete') {
                response = await axiosClient.post(`/api/admin/orders/${orderId}/pickup-complete`);
                newActualStatus = 'selesai';
            } else {
                response = await axiosClient.put(`/api/admin/orders/${orderId}/status`, { status: newStatus });
            }
            
            if (response.data.status === 'success') {
                setConfirmModalVisible(false);
                setOrder(prev => prev ? { ...prev, status: newActualStatus } : null);
                
                let successTitle = 'Status Berhasil Diubah';
                let successMessage = `Pesanan #${order?.order_number} sekarang berstatus ${newStatus.toUpperCase()}.`;
                
                if (newActualStatus === 'perlu_diproses') {
                    successTitle = 'Pembayaran Diverifikasi!';
                    successMessage = `Pembayaran untuk pesanan #${order?.order_number} telah berhasil diverifikasi. Pesanan masuk ke tahap perlu diproses.`;
                } else if (newActualStatus === 'sedang_diproses') {
                    successTitle = order && isPickupOrder(order) ? 'Pesanan Siap Diproses!' : 'Pesanan Diproses';
                    successMessage = order && isPickupOrder(order)
                        ? `Pembayaran pesanan #${order?.order_number} diverifikasi. Obat sedang disiapkan untuk diambil di apotek.`
                        : `Pesanan #${order?.order_number} sekarang sedang diproses.`;
                } else if (newActualStatus === 'dikirim') {
                    successTitle = 'Pesanan Dikirim!';
                    successMessage = `Pesanan #${order?.order_number} telah berhasil diserahkan ke kurir dan sedang dalam perjalanan.`;
                } else if (newStatus === 'selesai' || newStatus === 'pickup_complete') {
                    successTitle = 'Pesanan Selesai!';
                    successMessage = `Pesanan #${order?.order_number} telah berhasil diselesaikan.`;
                }
                
                router.push({
                    pathname: '/success-action',
                    params: {
                        title: successTitle,
                        message: successMessage,
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
        if (orderId) {
            fetchOrderDetail();
        }
    }, [orderId]);

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
    const orderStatus = normalizeOrderStatus(o.status);

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
                            {pendingStatus === 'pickup_complete'
                                ? 'Tandai pesanan ini sudah dijemput pasien dan selesai?'
                                : pendingStatus === 'verify_payment' && isPickupOrder(o)
                                  ? 'Verifikasi pembayaran dan mulai siapkan obat untuk diambil di apotek?'
                                  : `Apakah Anda yakin ingin mengubah status pesanan ini menjadi ${pendingStatus?.toUpperCase()}?`}
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

            {/* Modal Pembatalan Pesanan dengan Alasan */}
            <Modal
                visible={cancelModalVisible}
                transparent
                animationType="fade"
                onRequestClose={() => setCancelModalVisible(false)}
            >
                <View style={styles.modalOverlay}>
                    <KeyboardAvoidingView 
                        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                        style={{ width: '100%', alignItems: 'center', justifyContent: 'center' }}
                    >
                        <View style={styles.modalContent}>
                            <View style={[styles.iconCircle, { backgroundColor: '#FFEBEE' }]}>
                                <Ionicons name="close-circle" size={40} color="#D32F2F" />
                            </View>
                            <Text style={styles.modalTitle}>Batalkan Pesanan?</Text>
                            <Text style={styles.modalSubtitle}>Silakan masukkan alasan pembatalan pesanan ini:</Text>
                            
                            <TextInput
                                style={styles.textArea}
                                placeholder="Tulis alasan pembatalan di sini (contoh: Salah input obat, Ingin ganti metode bayar, Stok obat habis...)"
                                multiline
                                numberOfLines={4}
                                value={cancelReason}
                                onChangeText={setCancelReason}
                            />

                            <View style={styles.modalButtons}>
                                <TouchableOpacity 
                                    style={[styles.modalBtn, styles.btnCancel]} 
                                    onPress={() => {
                                        setCancelModalVisible(false);
                                        setCancelReason('');
                                    }}
                                >
                                    <Text style={styles.btnCancelText}>Kembali</Text>
                                </TouchableOpacity>
                                <TouchableOpacity 
                                    style={[styles.modalBtn, { backgroundColor: '#D32F2F' }]} 
                                    onPress={submitCancellation}
                                    disabled={updating}
                                >
                                    {updating ? <ActivityIndicator color="#FFF" /> : <Text style={styles.btnSubmitText}>Ya, Batalkan</Text>}
                                </TouchableOpacity>
                            </View>
                        </View>
                    </KeyboardAvoidingView>
                </View>
            </Modal>

            {/* Modal konfirmasi selesai (pasien) */}
            <Modal
                visible={completeModalVisible}
                transparent
                animationType="fade"
                onRequestClose={() => !updating && setCompleteModalVisible(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <View style={styles.iconCircle}>
                            <Ionicons name="checkmark-circle" size={40} color="#2E8B57" />
                        </View>
                        <Text style={styles.modalTitle}>Selesaikan Pesanan?</Text>
                        <Text style={styles.modalSubtitle}>
                            Pastikan Anda sudah menerima semua obat. Status akan berubah menjadi Selesai di akun
                            pasien dan apoteker.
                        </Text>
                        <View style={styles.modalButtons}>
                            <TouchableOpacity
                                style={[styles.modalBtn, styles.btnCancel]}
                                onPress={() => setCompleteModalVisible(false)}
                                disabled={updating}
                            >
                                <Text style={styles.btnCancelText}>Batal</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.modalBtn, { backgroundColor: '#2E8B57' }]}
                                onPress={submitOrderComplete}
                                disabled={updating}
                            >
                                {updating ? (
                                    <ActivityIndicator color="#FFF" />
                                ) : (
                                    <Text style={styles.btnSubmitText}>Ya, Selesai</Text>
                                )}
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
                        {(() => {
                            const statusLower = (o.status || '').toLowerCase().trim();
                            let label = o.status.toUpperCase();
                            let color = '#666';
                            let bgColor = '#F5F5F5';
                            
                            if (statusLower === 'pending' || statusLower === 'menunggu_pembayaran') {
                                label = 'MENUNGGU PEMBAYARAN';
                                color = '#F57C00';
                                bgColor = '#FFF3E0';
                            } else if (statusLower === 'menunggu_konfirmasi') {
                                label = 'MENUNGGU VERIFIKASI';
                                color = '#F57C00';
                                bgColor = '#FFF3E0';
                            } else if (statusLower === 'perlu_diproses') {
                                label = 'PERLU DIPROSES';
                                color = '#1976D2';
                                bgColor = '#E3F2FD';
                            } else if (statusLower === 'diproses' || statusLower === 'processing' || statusLower === 'sedang_diproses') {
                                label = 'SEDANG DIPROSES';
                                color = '#1976D2';
                                bgColor = '#E3F2FD';
                            } else if (statusLower === 'dikirim' || statusLower === 'shipped') {
                                label = 'SEDANG DIKIRIM';
                                color = '#EF6C00';
                                bgColor = '#FFF3E0';
                            } else if (statusLower === 'selesai' || statusLower === 'completed') {
                                label = 'SELESAI';
                                color = '#2E8B57';
                                bgColor = '#E8F5E9';
                            } else if (statusLower === 'dibatalkan' || statusLower === 'cancelled') {
                                label = 'DIBATALKAN';
                                color = '#D32F2F';
                                bgColor = '#FFEBEE';
                            } else if (statusLower === 'dilaporkan' || statusLower === 'reported') {
                                label = 'DILAPORKAN';
                                color = '#D32F2F';
                                bgColor = '#FFEBEE';
                            }

                            return (
                                <View style={[styles.badgeStatus, { backgroundColor: bgColor }]}>
                                    <Text style={[styles.badgeStatusText, { color: color }]}>{label}</Text>
                                </View>
                            );
                        })()}
                        {user?.role === 'apoteker' && (
                            <TouchableOpacity style={styles.chatBtnHeader} onPress={handleChatUser}>
                                <Ionicons name="chatbubble-ellipses" size={18} color="#1976D2" />
                                <Text style={styles.chatBtnHeaderText}>Chat</Text>
                            </TouchableOpacity>
                        )}

                    </View>

                    {user?.role === 'member' &&
                        ['perlu_diproses', 'sedang_diproses', 'diproses', 'processing', 'dikirim', 'selesai', 'completed'].includes(
                            (o.status || '').toLowerCase(),
                        ) && (
                        <View style={styles.progressSteps}>
                            {(isPickupOrder(o)
                                ? [
                                    { key: 'proses', label: 'Diproses', done: ['perlu_diproses', 'sedang_diproses', 'diproses', 'processing', 'selesai', 'completed'] },
                                    { key: 'jemput', label: 'Siap Diambil', done: ['sedang_diproses', 'selesai', 'completed'] },
                                    { key: 'selesai', label: 'Selesai', done: ['selesai', 'completed'] },
                                  ]
                                : [
                                    { key: 'proses', label: 'Diproses', done: ['perlu_diproses', 'sedang_diproses', 'diproses', 'processing', 'dikirim', 'selesai', 'completed'] },
                                    { key: 'dikirim', label: 'Dikirim', done: ['dikirim', 'selesai', 'completed'] },
                                    { key: 'selesai', label: 'Selesai', done: ['selesai', 'completed'] },
                                  ]
                            ).map((step, index, arr) => {
                                const s = (o.status || '').toLowerCase();
                                const isDone = step.done.includes(s);
                                const isLast = index === arr.length - 1;
                                return (
                                    <React.Fragment key={step.key}>
                                        <View style={styles.progressRow}>
                                            <View style={[styles.progressDot, isDone && (isLast ? styles.progressDotDone : styles.progressDotActive)]} />
                                            <Text style={[styles.progressLabel, isDone && styles.progressLabelActive]}>{step.label}</Text>
                                        </View>
                                        {!isLast && <View style={[styles.progressLine, isDone && styles.progressLineActive]} />}
                                    </React.Fragment>
                                );
                            })}
                        </View>
                    )}

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
                        <Text style={styles.sectionTitle}>
                            {isPickupOrder(o) ? 'Pengambilan di Apotek' : 'Alamat Pengiriman'}
                        </Text>
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
                            <View style={styles.itemImageContainer}>
                                {renderMedicineImage((item as any).medicine || { name: item.name, image_url: (item as any).medicine?.image_url })}
                            </View>
                            <View style={styles.itemMain}>
                                <Text style={styles.itemName}>{item.name}</Text>
                                <Text style={styles.itemQty}>{item.quantity} x Rp {Math.round(Number(item.price)).toLocaleString('id-ID')}</Text>
                            </View>
                            <Text style={styles.itemTotal}>Rp {Math.round(Number(item.subtotal)).toLocaleString('id-ID')}</Text>
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
                        <Text style={styles.paymentValue}>Rp {Math.round(Number(o.total_price)).toLocaleString('id-ID')}</Text>
                    </View>
                    <View style={styles.paymentRow}>
                        <Text style={styles.paymentLabel}>Biaya Layanan</Text>
                        <Text style={styles.paymentValue}>Rp 2.000</Text>
                    </View>
                    {o.shipping_address && o.shipping_address !== 'Ambil di Apotek' && (
                        <View style={styles.paymentRow}>
                            <Text style={styles.paymentLabel}>Ongkos Kirim</Text>
                            <Text style={styles.paymentValue}>Rp 10.000</Text>
                        </View>
                    )}
                    <View style={styles.divider} />
                    <View style={styles.totalRow}>
                        <Text style={styles.totalLabel}>Total Bayar</Text>
                        <Text style={styles.totalValue}>
                            Rp {Math.round(
                                Number(o.total_price || 0) + 
                                2000 + 
                                (o.shipping_address && o.shipping_address !== 'Ambil di Apotek' ? 10000 : 0)
                            ).toLocaleString('id-ID')}
                        </Text>
                    </View>

                </View>

                {/* User Actions */}
                {/* User Actions */}
                {user?.role === 'member' && (orderStatus === 'menunggu_pembayaran' || orderStatus === 'dikirim' || orderStatus === 'selesai') && (
                    <View style={styles.userActionSection}>
                        <Text style={styles.actionSectionTitle}>Aksi Pesanan</Text>
                        <View style={styles.actionRow}>
                            {/* Member can pay or cancel if status is menunggu_pembayaran */}
                            {orderStatus === 'menunggu_pembayaran' && (
                                <>
                                    <TouchableOpacity 
                                        style={[styles.btnAction, { backgroundColor: '#2E8B57' }]} 
                                        onPress={() => {
                                            router.push({
                                                pathname: '/payment-qris',
                                                params: {
                                                    orderId: o.id,
                                                    orderNumber: o.order_number,
                                                    totalPrice: o.total_price
                                                }
                                            } as any);
                                        }}
                                        disabled={updating}
                                    >
                                        <Text style={styles.btnActionText}>Bayar Sekarang</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity 
                                        style={[styles.btnAction, { backgroundColor: '#D32F2F' }]} 
                                        onPress={() => {
                                            setIsApotekerCancel(false);
                                            setCancelModalVisible(true);
                                        }}
                                        disabled={updating}
                                    >
                                        <Text style={styles.btnActionText}>Batalkan Pesanan</Text>
                                    </TouchableOpacity>
                                </>
                            )}

                            {orderStatus === 'dikirim' && (
                                <TouchableOpacity
                                    style={[styles.btnAction, { backgroundColor: '#2E8B57', flex: 1 }]}
                                    onPress={() => setCompleteModalVisible(true)}
                                    disabled={updating}
                                >
                                    {updating ? (
                                        <ActivityIndicator color="#FFF" />
                                    ) : (
                                        <Text style={styles.btnActionText}>Selesai</Text>
                                    )}
                                </TouchableOpacity>
                            )}

                            {orderStatus === 'selesai' && (
                                <View style={[styles.btnAction, { backgroundColor: '#E8F5E9', flex: 1, elevation: 0 }]}>
                                    <Text style={[styles.btnActionText, { color: '#2E8B57' }]}>Pesanan Selesai</Text>
                                </View>
                            )}

                            {orderStatus === 'dikirim' && (
                                <TouchableOpacity 
                                    style={[styles.btnAction, { backgroundColor: '#FF5252', flex: 0.8 }]} 
                                    onPress={handleReportIssue}
                                    disabled={updating}
                                >
                                    <Text style={styles.btnActionText}>Laporkan Masalah</Text>
                                </TouchableOpacity>
                            )}
                        </View>
                        {orderStatus === 'selesai' && (
                            <Text style={styles.infoTextSmall}>
                                Pesanan telah selesai. Jika obat belum diterima, silakan klik &quot;Laporkan Masalah&quot;.
                            </Text>
                        )}
                        {orderStatus === 'dikirim' && (
                            <Text style={styles.infoTextSmall}>
                                Pesanan sedang dikirim. Tekan tombol Selesai setelah obat Anda terima.
                            </Text>
                        )}
                    </View>
                )}

                {/* Pharmacist Actions */}
                {user?.role === 'apoteker' && (
                    <View style={styles.pharmacistSection}>
                        <Text style={styles.adminTitle}>Panel Apoteker</Text>
                        <View style={styles.actionRow}>
                            {o.status === 'menunggu_konfirmasi' && (
                                <TouchableOpacity 
                                    style={[styles.btnAction, { backgroundColor: '#2E8B57' }]} 
                                    onPress={() => confirmStatusUpdate('verify_payment')}
                                    disabled={updating}
                                >
                                    <Text style={styles.btnActionText}>Konfirmasi Pembayaran</Text>
                                </TouchableOpacity>
                            )}
                            {o.status === 'perlu_diproses' && (
                                <TouchableOpacity 
                                    style={[styles.btnAction, { backgroundColor: '#1976D2' }]} 
                                    onPress={() => confirmStatusUpdate('sedang_diproses')}
                                    disabled={updating}
                                >
                                    <Text style={styles.btnActionText}>Proses Pesanan</Text>
                                </TouchableOpacity>
                            )}
                            {orderStatus === 'menunggu_pembayaran' && (
                                <View style={[styles.btnAction, { backgroundColor: '#E0E0E0', elevation: 0 }]}>
                                    <Text style={[styles.btnActionText, { color: '#757575', textAlign: 'center' }]}>Menunggu Pembayaran Pasien</Text>
                                </View>
                            )}
                            {o.status === 'sedang_diproses' && (
                                isPickupOrder(o) ? (
                                    <TouchableOpacity
                                        style={[styles.btnAction, { backgroundColor: '#2E8B57' }]}
                                        onPress={() => confirmStatusUpdate('pickup_complete')}
                                        disabled={updating}
                                    >
                                        <Text style={styles.btnActionText}>Sudah di Jemput</Text>
                                    </TouchableOpacity>
                                ) : (
                                    <TouchableOpacity
                                        style={[styles.btnAction, { backgroundColor: '#EF6C00' }]}
                                        onPress={() => confirmStatusUpdate('dikirim')}
                                        disabled={updating}
                                    >
                                        <Text style={styles.btnActionText}>Kirim Pesanan</Text>
                                    </TouchableOpacity>
                                )
                            )}
                            {o.status === 'dikirim' && (
                                <View style={[styles.btnAction, { backgroundColor: '#E0E0E0', elevation: 0 }]}>
                                    <Text style={[styles.btnActionText, { color: '#757575', textAlign: 'center' }]}>Pesanan Sedang Dikirim</Text>
                                </View>
                            )}
                            {o.status === 'selesai' && (
                                <View style={[styles.btnAction, { backgroundColor: '#E8F5E9', elevation: 0 }]}>
                                    <Text style={[styles.btnActionText, { color: '#2E8B57' }]}>Pesanan Selesai</Text>
                                </View>
                            )}
                            {o.status === 'dibatalkan' && (
                                <View style={[styles.btnAction, { backgroundColor: '#FFEBEE', elevation: 0 }]}>
                                    <Text style={[styles.btnActionText, { color: '#D32F2F' }]}>Pesanan Dibatalkan</Text>
                                </View>
                            )}
                            {o.status === 'dilaporkan' && (
                                <TouchableOpacity 
                                    style={[styles.btnAction, { backgroundColor: '#FF5252' }]} 
                                    onPress={handleChatUser}
                                    disabled={updating}
                                >
                                    <Text style={styles.btnActionText}>Hubungi Pasien (Tinjau Laporan)</Text>
                                </TouchableOpacity>
                            )}
                        </View>
                        {updating && <ActivityIndicator color="#2E8B57" style={{ marginTop: 10 }} />}
                    </View>
                )}

                <TouchableOpacity 
                    style={styles.btnHelp}
                    onPress={() => router.push('/pusat-bantuan')}
                >
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
    progressSteps: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 16, paddingHorizontal: 4 },
    progressRow: { alignItems: 'center', flex: 1 },
    progressDot: { width: 14, height: 14, borderRadius: 7, backgroundColor: '#E0E0E0', marginBottom: 6 },
    progressDotActive: { backgroundColor: '#EF6C00' },
    progressDotDone: { backgroundColor: '#2E8B57' },
    progressLabel: { fontSize: 11, color: '#999', fontWeight: '600' },
    progressLabelActive: { color: '#333' },
    progressLine: { flex: 0.6, height: 2, backgroundColor: '#E0E0E0', marginBottom: 20, marginHorizontal: 2 },
    progressLineActive: { backgroundColor: '#81C784' },
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
    itemImageContainer: { width: 45, height: 45, backgroundColor: '#F0F4F0', borderRadius: 10, justifyContent: 'center', alignItems: 'center', marginRight: 12, overflow: 'hidden' },
    itemImage: { width: '100%', height: '100%' },
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
    fallbackIcon: { width: '100%', height: '100%', backgroundColor: '#F0F4F0', justifyContent: 'center', alignItems: 'center' },
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



