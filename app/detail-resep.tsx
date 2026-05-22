import { useAuth } from '@/context/AuthContext';
import axiosClient from '@/api/axiosClient';
import { Feather, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { router, Stack, useLocalSearchParams } from 'expo-router';
import React, { useState, useEffect } from 'react';
import { 
    ActivityIndicator, 
    Alert, 
    SafeAreaView, 
    ScrollView, 
    StyleSheet, 
    Text, 
    TouchableOpacity, 
    View, 
    Image, 
    Platform, 
    Dimensions 
} from 'react-native';

const { width } = Dimensions.get('window');

interface PrescriptionDetail {
    id: number;
    user_id: number;
    image_url: string;
    status: 'pending' | 'valid' | 'rejected';
    notes: string | null;
    total_price: string | null;
    created_at: string;
    updated_at: string;
    order?: {
        id: number;
        status: string;
        order_number: string;
    } | null;
}

export default function DetailResepScreen() {
    const { id } = useLocalSearchParams<{ id: string }>();
    const { user } = useAuth();
    const [prescription, setPrescription] = useState<PrescriptionDetail | null>(null);
    const [loading, setLoading] = useState(true);
    const [startingChat, setStartingChat] = useState(false);

    const startConsultation = async () => {
        try {
            setStartingChat(true);
            // Cek apakah sudah ada konsultasi aktif
            const checkRes = await axiosClient.get('/api/consultations');
            const activeConsultation = checkRes.data.data.find((c: any) => c.status === 'active');

            if (activeConsultation) {
                router.push(`/chat-room?id=${activeConsultation.id}`);
            } else {
                // Buat baru
                const createRes = await axiosClient.post('/api/consultations');
                router.push(`/chat-room?id=${createRes.data.data.id}`);
            }
        } catch (error) {
            console.error('Consultation error:', error);
            Alert.alert('Gagal', 'Terjadi kesalahan saat memulai konsultasi.');
        } finally {
            setStartingChat(false);
        }
    };

    const fetchPrescriptionDetail = async () => {
        try {
            setLoading(true);
            const res = await axiosClient.get(`/api/prescriptions/${id}`);
            if (res.data.status === 'success') {
                setPrescription(res.data.data);
            }
        } catch (e) {
            console.error('Failed to fetch prescription details:', e);
            Alert.alert('Error', 'Gagal mengambil detail resep.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (id) {
            fetchPrescriptionDetail();
        }
    }, [id]);

    const formatDate = (dateStr: string) => {
        if (!dateStr) return '';
        const d = new Date(dateStr);
        return d.toLocaleDateString('id-ID', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        }) + ' WIB';
    };

    const getStatusInfo = (status: string, hasOrder?: boolean) => {
        switch (status) {
            case 'valid':
                return {
                    label: hasOrder ? 'Sudah Dicheckout' : 'Valid / Diterima',
                    color: hasOrder ? '#1976D2' : '#2E8B57',
                    bg: hasOrder ? '#E3F2FD' : '#E8F5E9',
                    icon: 'checkmark-circle',
                    desc: hasOrder
                        ? 'Resep Anda telah dicheckout dan diproses. Silakan lihat detail pesanan Anda.'
                        : 'Resep Anda telah diperiksa dan disetujui oleh Apoteker kami. Silakan lanjutkan ke checkout untuk menyelesaikan pesanan.'
                };
            case 'rejected':
                return {
                    label: 'Ditolak',
                    color: '#D32F2F',
                    bg: '#FFEBEE',
                    icon: 'close-circle',
                    desc: 'Resep Anda ditolak oleh Apoteker kami. Silakan baca catatan di bawah untuk penjelasan lebih detail.'
                };
            default:
                return {
                    label: 'Menunggu Validasi',
                    color: '#F57C00',
                    bg: '#FFF3E0',
                    icon: 'time',
                    desc: 'Resep Anda sedang diperiksa oleh Apoteker kami. Kami akan segera memperbarui status dan mengabari Anda.'
                };
        }
    };

    if (loading) {
        return (
            <SafeAreaView style={styles.container}>
                <Stack.Screen options={{ headerShown: false }} />
                <View style={styles.centered}>
                    <ActivityIndicator size="large" color="#2E8B57" />
                    <Text style={styles.loadingText}>Memuat detail resep...</Text>
                </View>
            </SafeAreaView>
        );
    }

    if (!prescription) {
        return (
            <SafeAreaView style={styles.container}>
                <Stack.Screen options={{ headerShown: false }} />
                <View style={styles.centered}>
                    <Ionicons name="document-text-outline" size={60} color="#CCC" />
                    <Text style={styles.emptyTitle}>Resep Tidak Ditemukan</Text>
                    <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                        <Text style={styles.backButtonText}>Kembali</Text>
                    </TouchableOpacity>
                </View>
            </SafeAreaView>
        );
    }

    const statusInfo = getStatusInfo(prescription.status, !!prescription.order);
    const imageUrl = prescription.image_url.startsWith('http') ? prescription.image_url : `${axiosClient.defaults.baseURL}/storage/${prescription.image_url}`;

    return (
        <SafeAreaView style={styles.container}>
            <Stack.Screen options={{ headerShown: false }} />
            
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backHeaderBtn}>
                    <Ionicons name="chevron-back" size={24} color="#333" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Detail Resep</Text>
                <View style={{ width: 40 }} />
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                {/* Status Card */}
                <View style={styles.sectionCard}>
                    <View style={styles.sectionHeader}>
                        <MaterialCommunityIcons name="shield-check-outline" size={20} color="#2E8B57" />
                        <Text style={styles.sectionCardTitle}>Status Verifikasi</Text>
                    </View>
                    
                    <View style={[styles.statusBadgeContainer, { backgroundColor: statusInfo.bg }]}>
                        <Ionicons name={statusInfo.icon as any} size={20} color={statusInfo.color} />
                        <Text style={[styles.statusLabelText, { color: statusInfo.color }]}>
                            {statusInfo.label}
                        </Text>
                    </View>
                    <Text style={styles.statusDescription}>{statusInfo.desc}</Text>
                    <Text style={styles.uploadTimeText}>Diunggah pada: {formatDate(prescription.created_at)}</Text>
                </View>

                {/* Prescription Image */}
                <View style={styles.sectionCard}>
                    <View style={styles.sectionHeader}>
                        <Ionicons name="image-outline" size={20} color="#2E8B57" />
                        <Text style={styles.sectionCardTitle}>Foto Resep Yang Diunggah</Text>
                    </View>
                    <View style={styles.imageContainer}>
                        <Image 
                            source={{ uri: imageUrl }} 
                            style={styles.prescriptionImage} 
                            resizeMode="contain"
                        />
                    </View>
                </View>

                {/* Pharmacist Notes / Medicine Details */}
                {(prescription.status === 'valid' || prescription.notes) && (
                    <View style={styles.sectionCard}>
                        <View style={styles.sectionHeader}>
                            <MaterialCommunityIcons name="doctor" size={20} color="#2E8B57" />
                            <Text style={styles.sectionCardTitle}>
                                {prescription.status === 'valid' ? 'Rincian Obat & Dosis dari Apoteker' : 'Catatan Apoteker'}
                            </Text>
                        </View>
                        
                        <View style={styles.notesContainer}>
                            <Text style={styles.notesText}>{prescription.notes || 'Tidak ada catatan tambahan.'}</Text>
                        </View>

                        {prescription.status === 'valid' && prescription.total_price && (
                            <View style={styles.priceContainer}>
                                <Text style={styles.priceLabel}>Estimasi Total Harga Obat:</Text>
                                <Text style={styles.priceValue}>
                                    Rp {Math.round(Number(parseFloat(prescription.total_price))).toLocaleString('id-ID')}
                                </Text>
                            </View>
                        )}
                    </View>
                )}

                {/* Instructions Guidance Section */}
                {prescription.status === 'valid' && (
                    prescription.order ? (
                        <View style={[styles.instructionCard, { backgroundColor: '#E3F2FD' }]}>
                            <Ionicons name="information-circle-outline" size={24} color="#1976D2" />
                            <View style={styles.instructionTextContainer}>
                                <Text style={[styles.instructionTitle, { color: '#1976D2' }]}>Resep Sudah Dicheckout</Text>
                                <Text style={styles.instructionBody}>
                                    Pesanan untuk resep ini telah dibuat dengan nomor pesanan {prescription.order?.order_number}. Anda dapat melihat status transaksi dan pengiriman obat pada halaman detail pesanan.
                                </Text>
                            </View>
                        </View>
                    ) : (
                        <View style={styles.instructionCard}>
                            <Ionicons name="information-circle-outline" size={24} color="#2E8B57" />
                            <View style={styles.instructionTextContainer}>
                                <Text style={styles.instructionTitle}>Petunjuk Pembayaran & Pengambilan</Text>
                                <Text style={styles.instructionBody}>
                                    Klik tombol di bawah untuk melanjutkan ke checkout. Anda dapat memilih apakah obat ingin diantar ke rumah atau diambil sendiri ke Apotek Permata, serta memilih metode pembayaran (QRIS, Transfer Bank, atau DANA).
                                </Text>
                            </View>
                        </View>
                    )
                )}

            </ScrollView>

            {/* Bottom Actions */}
            <View style={styles.footer}>
                {prescription.status === 'valid' ? (
                    prescription.order ? (
                        <TouchableOpacity 
                            style={[styles.checkoutBtn, { backgroundColor: '#1976D2' }]}
                            onPress={() => router.push({ pathname: '/detail-pesanan', params: { id: prescription.order?.id } } as any)}
                        >
                            <Text style={styles.checkoutBtnText}>Lihat Detail Pesanan</Text>
                            <Ionicons name="eye-outline" size={18} color="#FFF" />
                        </TouchableOpacity>
                    ) : (
                        <TouchableOpacity 
                            style={styles.checkoutBtn}
                            onPress={() => router.push({ pathname: '/checkout', params: { prescription_id: prescription.id } } as any)}
                        >
                            <Text style={styles.checkoutBtnText}>Lanjutkan ke Pembayaran</Text>
                            <Ionicons name="arrow-forward" size={18} color="#FFF" />
                        </TouchableOpacity>
                    )
                ) : (
                    <TouchableOpacity 
                        style={[styles.checkoutBtn, { backgroundColor: '#F0FAF4', borderWidth: 1, borderColor: '#2E8B57' }]}
                        onPress={startConsultation}
                        disabled={startingChat}
                    >
                        {startingChat ? (
                            <ActivityIndicator size="small" color="#2E8B57" />
                        ) : (
                            <>
                                <Ionicons name="chatbubble-ellipses" size={18} color="#2E8B57" />
                                <Text style={[styles.checkoutBtnText, { color: '#2E8B57' }]}>Tanya Apoteker</Text>
                            </>
                        )}
                    </TouchableOpacity>
                )}
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F8FBF8',
    },
    centered: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    loadingText: {
        marginTop: 12,
        color: '#666',
        fontSize: 14,
        fontWeight: '500',
    },
    emptyTitle: {
        fontSize: 16,
        color: '#999',
        marginTop: 12,
        marginBottom: 20,
        fontWeight: '600',
    },
    backButton: {
        backgroundColor: '#2E8B57',
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 8,
    },
    backButtonText: {
        color: '#FFF',
        fontWeight: 'bold',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingTop: Platform.OS === 'ios' ? 0 : 40,
        paddingBottom: 16,
        backgroundColor: '#FFF',
        borderBottomWidth: 1,
        borderBottomColor: '#EEE',
    },
    backHeaderBtn: {
        width: 40,
        height: 40,
        justifyContent: 'center',
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
    },
    scrollContent: {
        padding: 16,
        paddingBottom: 100,
    },
    sectionCard: {
        backgroundColor: '#FFF',
        borderRadius: 16,
        padding: 16,
        marginBottom: 16,
        borderWidth: 1,
        borderColor: '#EEE',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2,
    },
    sectionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        marginBottom: 14,
    },
    sectionCardTitle: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#333',
    },
    statusBadgeContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        alignSelf: 'flex-start',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
        gap: 6,
        marginBottom: 12,
    },
    statusLabelText: {
        fontSize: 13,
        fontWeight: 'bold',
    },
    statusDescription: {
        fontSize: 13,
        color: '#666',
        lineHeight: 20,
        marginBottom: 12,
    },
    uploadTimeText: {
        fontSize: 11,
        color: '#999',
        fontStyle: 'italic',
    },
    imageContainer: {
        width: '100%',
        height: 250,
        borderRadius: 12,
        backgroundColor: '#F5F5F5',
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: '#EFEFEF',
    },
    prescriptionImage: {
        width: '100%',
        height: '100%',
    },
    notesContainer: {
        backgroundColor: '#F9FAF9',
        borderWidth: 1,
        borderColor: '#E8EFE9',
        borderRadius: 12,
        padding: 14,
        marginBottom: 12,
    },
    notesText: {
        fontSize: 13,
        color: '#444',
        lineHeight: 20,
    },
    priceContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderTopWidth: 1,
        borderTopColor: '#EEE',
        paddingTop: 12,
    },
    priceLabel: {
        fontSize: 13,
        color: '#666',
        fontWeight: '500',
    },
    priceValue: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#2E8B57',
    },
    instructionCard: {
        backgroundColor: '#E8F5E9',
        borderRadius: 16,
        padding: 16,
        flexDirection: 'row',
        gap: 12,
        alignItems: 'flex-start',
        marginBottom: 16,
    },
    instructionTextContainer: {
        flex: 1,
    },
    instructionTitle: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#2E8B57',
        marginBottom: 4,
    },
    instructionBody: {
        fontSize: 12,
        color: '#4A5568',
        lineHeight: 18,
    },
    footer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: '#FFF',
        padding: 16,
        borderTopWidth: 1,
        borderTopColor: '#EEE',
        paddingBottom: Platform.OS === 'ios' ? 30 : 16,
    },
    checkoutBtn: {
        backgroundColor: '#2E8B57',
        borderRadius: 12,
        paddingVertical: 14,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 8,
        shadowColor: '#2E8B57',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 4,
    },
    checkoutBtnText: {
        color: '#FFF',
        fontSize: 15,
        fontWeight: 'bold',
    },
});
