import axiosClient from '@/api/axiosClient';
import { Feather, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { Stack, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Image,
    Modal,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
    Platform,
    StatusBar,
    RefreshControl
} from 'react-native';

const THEME = {
    primary: '#2E8B57',
    secondary: '#F0F9F4',
    white: '#FFFFFF',
    textDark: '#2C3E50',
    textMuted: '#7F8C8D',
    danger: '#FF5252',
    warning: '#FFA000',
    info: '#1976D2',
    border: '#E8ECEF',
    success: '#4CAF50',
    cardShadow: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 5,
        elevation: 2
    }
};

export default function ValidasiResep() {
    const router = useRouter();
    const [prescriptions, setPrescriptions] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [selectedImg, setSelectedImg] = useState<string | null>(null);
    const [notes, setNotes] = useState('');
    const [selectedStatus, setSelectedStatus] = useState<string>('all');

    useEffect(() => {
        fetchPrescriptions();
    }, []);

    const fetchPrescriptions = async () => {
        try {
            setLoading(true);
            const response = await axiosClient.get('/api/prescriptions');
            setPrescriptions(response.data.data || []);
        } catch (error) {
            console.error('Error fetching prescriptions:', error);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    const filteredPrescriptions = prescriptions.filter(item => {
        if (selectedStatus === 'all') return true;
        return item.status === selectedStatus;
    });

    const handleUpdateStatus = async (id: number, status: string) => {
        try {
            await axiosClient.put(`/api/prescriptions/${id}/status`, { status, notes });
            alert(`Resep berhasil di${status === 'valid' ? 'validasi' : 'tolak'}`);
            setNotes('');
            fetchPrescriptions();
        } catch (error) {
            alert('Gagal memperbarui status resep');
        }
    };

    const getImageUrl = (url: string) => {
        if (!url) return '';
        if (url.startsWith('http')) return url;
        const host = Platform.OS === 'android' ? 'http://10.0.2.2:8000' : 'http://localhost:8000';
        return `${host}/storage/${url}`;
    };

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor={THEME.primary} />
            <Stack.Screen options={{ headerShown: false }} />

            {/* Header */}
            <View style={styles.header}>
                <View style={styles.headerTop}>
                    <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
                        <Ionicons name="chevron-back" size={24} color={THEME.white} />
                    </TouchableOpacity>
                    <View>
                        <Text style={styles.headerTitle}>Validasi Resep</Text>
                        <Text style={styles.headerSub}>{filteredPrescriptions.length} Resep Terfilter ({prescriptions.filter(p => p.status === 'pending').length} Menunggu)</Text>
                    </View>
                </View>
            </View>

            {/* Filter Chips */}
            <View style={styles.filterContainer}>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterScroll}>
                    {[
                        { id: 'all', label: 'Semua Resep' },
                        { id: 'pending', label: 'Menunggu' },
                        { id: 'valid', label: 'Valid' },
                        { id: 'rejected', label: 'Ditolak' }
                    ].map(chip => (
                        <TouchableOpacity
                            key={chip.id}
                            style={[
                                styles.filterChip,
                                selectedStatus === chip.id && styles.filterChipActive
                            ]}
                            onPress={() => setSelectedStatus(chip.id)}
                        >
                            <Text style={[
                                styles.filterChipText,
                                selectedStatus === chip.id && styles.filterChipTextActive
                            ]}>
                                {chip.label}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>
            </View>

            <ScrollView 
                showsVerticalScrollIndicator={false} 
                contentContainerStyle={styles.scrollContent}
                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); fetchPrescriptions(); }} colors={[THEME.primary]} />}
            >
                {loading && !refreshing ? (
                    <View style={styles.loader}>
                        <ActivityIndicator size="large" color={THEME.primary} />
                    </View>
                ) : filteredPrescriptions.length === 0 ? (
                    <View style={styles.emptyContainer}>
                        <MaterialCommunityIcons name="file-document-outline" size={80} color={THEME.border} />
                        <Text style={styles.emptyText}>Belum ada resep digital masuk</Text>
                    </View>
                ) : (
                    filteredPrescriptions.map((item) => (
                        <View key={item.id} style={styles.resepCard}>
                            <TouchableOpacity 
                                activeOpacity={0.9}
                                style={styles.imgContainer}
                                onPress={() => setSelectedImg(getImageUrl(item.image_url))}
                            >
                                <Image
                                    source={{ uri: getImageUrl(item.image_url) }}
                                    style={styles.resepImg}
                                />
                                <View style={styles.zoomOverlay}>
                                    <View style={styles.zoomBadge}>
                                        <Feather name="maximize" size={16} color={THEME.white} />
                                        <Text style={styles.zoomText}>Lihat Detail</Text>
                                    </View>
                                </View>
                            </TouchableOpacity>

                            <View style={styles.resepInfo}>
                                <View style={styles.cardHead}>
                                    <View style={styles.patientBox}>
                                        <Text style={styles.patientName}>{item.user?.name || 'Pasien Anonim'}</Text>
                                        <Text style={styles.resepDate}>
                                            {new Date(item.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                                        </Text>
                                    </View>
                                    <View style={[styles.statusBadge, { 
                                        backgroundColor: item.status === 'valid' ? THEME.secondary : 
                                                        item.status === 'rejected' ? '#FFF5F5' : '#EBF5FB' 
                                    }]}>
                                        <Text style={[styles.statusText, { 
                                            color: item.status === 'valid' ? THEME.primary : 
                                                   item.status === 'rejected' ? THEME.danger : THEME.info 
                                        }]}>
                                            {(item.status || 'Pending').toUpperCase()}
                                        </Text>
                                    </View>
                                </View>

                                {item.status === 'pending' && (
                                    <View style={styles.actionSection}>
                                        <View style={styles.divider} />
                                        <TextInput
                                            style={styles.noteInput}
                                            placeholder="Catatan Apoteker (opsional)..."
                                            placeholderTextColor={THEME.textMuted}
                                            value={notes}
                                            onChangeText={setNotes}
                                            multiline
                                        />
                                        <View style={styles.actionRow}>
                                            <TouchableOpacity 
                                                style={[styles.actionBtn, styles.btnReject]} 
                                                onPress={() => handleUpdateStatus(item.id, 'rejected')}
                                            >
                                                <Ionicons name="close-circle-outline" size={18} color={THEME.danger} />
                                                <Text style={styles.btnRejectText}>Tolak Resep</Text>
                                            </TouchableOpacity>
                                            <TouchableOpacity 
                                                style={[styles.actionBtn, styles.btnValid]} 
                                                onPress={() => handleUpdateStatus(item.id, 'valid')}
                                            >
                                                <Ionicons name="checkmark-circle-outline" size={18} color={THEME.white} />
                                                <Text style={styles.btnValidText}>Validasi Sekarang</Text>
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                )}
                                
                                {item.notes && (
                                    <View style={styles.noteDisplay}>
                                        <Text style={styles.noteLabel}>Catatan:</Text>
                                        <Text style={styles.noteValue}>{item.notes}</Text>
                                    </View>
                                )}
                            </View>
                        </View>
                    ))
                )}
            </ScrollView>

            {/* Image Modal */}
            <Modal visible={!!selectedImg} transparent animationType="fade">
                <View style={styles.modalBg}>
                    <TouchableOpacity style={styles.closeModal} onPress={() => setSelectedImg(null)}>
                        <Ionicons name="close" size={32} color={THEME.white} />
                    </TouchableOpacity>
                    {selectedImg && (
                        <Image source={{ uri: selectedImg }} style={styles.fullImg} resizeMode="contain" />
                    )}
                </View>
            </Modal>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F8F9FA' },
    header: { 
        backgroundColor: THEME.primary, 
        paddingTop: Platform.OS === 'android' ? 60 : 40, 
        paddingBottom: 30, 
        paddingHorizontal: 20,
        borderBottomLeftRadius: 30,
        borderBottomRightRadius: 30,
        ...THEME.cardShadow
    },
    headerTop: { flexDirection: 'row', alignItems: 'center' },
    backBtn: { marginRight: 15, padding: 5 },
    headerTitle: { fontSize: 24, fontWeight: 'bold', color: THEME.white },
    headerSub: { fontSize: 13, color: 'rgba(255,255,255,0.8)', marginTop: 2 },
    scrollContent: { padding: 20 },
    loader: { marginTop: 100 },
    resepCard: { 
        backgroundColor: THEME.white, 
        borderRadius: 25, 
        overflow: 'hidden', 
        marginBottom: 20,
        borderWidth: 1,
        borderColor: THEME.border,
        ...THEME.cardShadow
    },
    imgContainer: { height: 200, width: '100%', position: 'relative' },
    resepImg: { width: '100%', height: '100%' },
    zoomOverlay: { 
        ...StyleSheet.absoluteFillObject, 
        backgroundColor: 'rgba(0,0,0,0.2)', 
        justifyContent: 'center', 
        alignItems: 'center' 
    },
    zoomBadge: { 
        flexDirection: 'row', 
        alignItems: 'center', 
        backgroundColor: 'rgba(0,0,0,0.6)', 
        paddingHorizontal: 15, 
        paddingVertical: 8, 
        borderRadius: 25,
        gap: 6
    },
    zoomText: { color: THEME.white, fontSize: 12, fontWeight: 'bold' },
    resepInfo: { padding: 20 },
    cardHead: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
    patientBox: { flex: 1, marginRight: 10 },
    patientName: { fontSize: 18, fontWeight: 'bold', color: THEME.textDark, marginBottom: 4 },
    resepDate: { fontSize: 12, color: THEME.textMuted },
    statusBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },
    statusText: { fontSize: 10, fontWeight: '800' },
    divider: { height: 1, backgroundColor: THEME.border, marginVertical: 15 },
    noteInput: { 
        backgroundColor: '#F8F9FA', 
        borderWidth: 1, 
        borderColor: THEME.border, 
        borderRadius: 12, 
        padding: 12, 
        fontSize: 14, 
        color: THEME.textDark,
        minHeight: 60,
        textAlignVertical: 'top',
        marginBottom: 15
    },
    actionRow: { flexDirection: 'row', gap: 10 },
    actionBtn: { 
        flex: 1, 
        height: 48, 
        borderRadius: 12, 
        flexDirection: 'row', 
        alignItems: 'center', 
        justifyContent: 'center', 
        gap: 8 
    },
    btnReject: { backgroundColor: THEME.white, borderWidth: 1, borderColor: THEME.danger },
    btnRejectText: { color: THEME.danger, fontWeight: 'bold', fontSize: 14 },
    btnValid: { backgroundColor: THEME.primary },
    btnValidText: { color: THEME.white, fontWeight: 'bold', fontSize: 14 },
    noteDisplay: { marginTop: 15, backgroundColor: THEME.secondary, padding: 12, borderRadius: 12 },
    noteLabel: { fontSize: 11, color: THEME.primary, fontWeight: '800', marginBottom: 2 },
    noteValue: { fontSize: 13, color: THEME.textDark },
    modalBg: { flex: 1, backgroundColor: 'rgba(0,0,0,0.95)', justifyContent: 'center', alignItems: 'center' },
    fullImg: { width: '90%', height: '80%' },
    closeModal: { position: 'absolute', top: 50, right: 25, padding: 10, zIndex: 10 },
    emptyContainer: { alignItems: 'center', marginTop: 100 },
    emptyText: { color: THEME.textMuted, marginTop: 15, fontSize: 15, fontWeight: '500' },
    filterContainer: {
        backgroundColor: THEME.white,
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: THEME.border,
    },
    filterScroll: {
        paddingHorizontal: 20,
        gap: 10,
    },
    filterChip: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
        backgroundColor: THEME.secondary,
        borderWidth: 1,
        borderColor: 'transparent',
    },
    filterChipActive: {
        backgroundColor: THEME.primary,
    },
    filterChipText: {
        fontSize: 13,
        fontWeight: '600',
        color: THEME.primary,
    },
    filterChipTextActive: {
        color: THEME.white,
    },
});