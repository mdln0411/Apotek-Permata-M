import axiosClient from '@/api/axiosClient';
import { Feather, Ionicons } from '@expo/vector-icons';
import { Stack } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { 
    SafeAreaView, 
    ScrollView, 
    StyleSheet, 
    Text, 
    TouchableOpacity, 
    View, 
    Platform,
    Image,
    Modal,
    ActivityIndicator,
    TextInput
} from 'react-native';

export default function ValidasiResep() {
    const [prescriptions, setPrescriptions] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedImg, setSelectedImg] = useState<string | null>(null);
    const [notes, setNotes] = useState('');

    useEffect(() => {
        fetchPrescriptions();
    }, []);

    const fetchPrescriptions = async () => {
        try {
            setLoading(true);
            const response = await axiosClient.get('/api/prescriptions');
            setPrescriptions(response.data.data);
        } catch (error) {
            console.error('Error fetching prescriptions:', error);
        } finally {
            setLoading(false);
        }
    };

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

    return (
        <SafeAreaView style={styles.container}>
            <Stack.Screen options={{ headerShown: true, title: 'Validasi Resep', headerTintColor: '#FFF', headerStyle: { backgroundColor: '#2E8B57' } }} />

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
                <Text style={styles.sectionTitle}>Daftar Resep Masuk</Text>
                
                {loading ? (
                    <ActivityIndicator size="large" color="#2E8B57" style={{ marginTop: 50 }} />
                ) : prescriptions.length === 0 ? (
                    <Text style={{ textAlign: 'center', color: '#999', marginTop: 50 }}>Belum ada resep yang diunggah.</Text>
                ) : prescriptions.map((item) => (
                    <View key={item.id} style={styles.resepCard}>
                        <TouchableOpacity onPress={() => setSelectedImg(item.image_url.startsWith('http') ? item.image_url : `http://127.0.0.1:8000/storage/${item.image_url}`)}>
                            <Image 
                                source={{ uri: item.image_url.startsWith('http') ? item.image_url : `http://127.0.0.1:8000/storage/${item.image_url}` }} 
                                style={styles.resepImg} 
                            />
                            <View style={styles.zoomIcon}>
                                <Feather name="search" size={20} color="#FFF" />
                            </View>
                        </TouchableOpacity>
                        
                        <View style={styles.resepInfo}>
                            <View style={styles.cardHead}>
                                <View>
                                    <Text style={styles.patientLabel}>Pasien</Text>
                                    <Text style={styles.patientName}>{item.user?.name}</Text>
                                </View>
                                <View style={[styles.statusBadge, { backgroundColor: item.status === 'valid' ? '#E8F5E9' : item.status === 'rejected' ? '#FFEBEE' : '#E3F2FD' }]}>
                                    <Text style={{ fontSize: 10, fontWeight: 'bold', color: item.status === 'valid' ? '#2E8B57' : item.status === 'rejected' ? '#FF5252' : '#1976D2' }}>
                                        {item.status.toUpperCase()}
                                    </Text>
                                </View>
                            </View>

                            <Text style={styles.resepDate}>{new Date(item.created_at).toLocaleDateString('id-ID')}</Text>
                            
                            {item.status === 'pending' && (
                                <>
                                    <TextInput 
                                        style={styles.noteInput}
                                        placeholder="Tambahkan catatan (opsional)..."
                                        value={notes}
                                        onChangeText={setNotes}
                                    />
                                    <View style={styles.actionRow}>
                                        <TouchableOpacity style={[styles.actionBtn, styles.btnReject]} onPress={() => handleUpdateStatus(item.id, 'rejected')}>
                                            <Text style={styles.btnRejectText}>Tolak</Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity style={[styles.actionBtn, styles.btnApprove]} onPress={() => handleUpdateStatus(item.id, 'valid')}>
                                            <Text style={styles.btnApproveText}>Validasi</Text>
                                        </TouchableOpacity>
                                    </View>
                                </>
                            )}
                        </View>
                    </View>
                ))}
            </ScrollView>

            <Modal visible={!!selectedImg} transparent={true} animationType="fade">
                <View style={styles.modalBg}>
                    <TouchableOpacity style={styles.closeBtn} onPress={() => setSelectedImg(null)}>
                        <Ionicons name="close-circle" size={40} color="#FFF" />
                    </TouchableOpacity>
                    {selectedImg && <Image source={{ uri: selectedImg }} style={styles.fullImg} resizeMode="contain" />}
                </View>
            </Modal>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F8FBF8' },
    scrollContent: { padding: 20 },
    sectionTitle: { fontSize: 16, fontWeight: 'bold', color: '#333', marginBottom: 15 },
    resepCard: { backgroundColor: '#FFF', borderRadius: 20, overflow: 'hidden', marginBottom: 20, elevation: 3, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 5 },
    resepImg: { width: '100%', height: 200, backgroundColor: '#F0F0F0' },
    zoomIcon: { position: 'absolute', right: 15, top: 15, backgroundColor: 'rgba(0,0,0,0.4)', padding: 8, borderRadius: 20 },
    resepInfo: { padding: 20 },
    cardHead: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
    statusBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 },
    patientLabel: { fontSize: 12, color: '#999', marginBottom: 2 },
    patientName: { fontSize: 18, fontWeight: 'bold', color: '#333' },
    resepDate: { fontSize: 11, color: '#999', marginTop: 4, marginBottom: 15 },
    noteInput: { backgroundColor: '#F9F9F9', borderSize: 1, borderColor: '#EEE', borderWidth: 1, borderRadius: 10, padding: 12, marginBottom: 15, fontSize: 13 },
    actionRow: { flexDirection: 'row', gap: 12 },
    actionBtn: { flex: 1, paddingVertical: 12, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
    btnReject: { backgroundColor: '#FFF', borderColor: '#FF5252', borderWidth: 1 },
    btnRejectText: { color: '#FF5252', fontWeight: 'bold' },
    btnApprove: { backgroundColor: '#2E8B57' },
    btnApproveText: { color: '#FFF', fontWeight: 'bold' },
    modalBg: { flex: 1, backgroundColor: 'rgba(0,0,0,0.9)', justifyContent: 'center', alignItems: 'center' },
    closeBtn: { position: 'absolute', top: 50, right: 20, zIndex: 10 },
    fullImg: { width: '90%', height: '80%' }
});
