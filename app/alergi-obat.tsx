import axiosClient from '@/api/axiosClient';
import { Feather, Ionicons } from '@expo/vector-icons';
import { router, Stack } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    Modal,
    Platform,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';

export default function AlergiObatScreen() {
    const [allergies, setAllergies] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    
    // Form Modal states
    const [modalVisible, setModalVisible] = useState(false);
    const [allergenName, setAllergenName] = useState('');
    const [symptom, setSymptom] = useState('');
    const [description, setDescription] = useState('');
    const [severity, setSeverity] = useState<'sedang' | 'berat'>('sedang');
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        fetchAllergies();
    }, []);

    const fetchAllergies = async () => {
        setLoading(true);
        try {
            const response = await axiosClient.get('/api/allergies');
            if (response.data && response.data.data) {
                setAllergies(response.data.data);
            }
        } catch (error) {
            console.error('Error fetching allergies:', error);
            Alert.alert('Gagal', 'Tidak dapat memuat data alergi Anda.');
        } finally {
            setLoading(false);
        }
    };

    const handleAddAllergy = async () => {
        if (!allergenName.trim()) {
            Alert.alert('Peringatan', 'Nama obat/alergen harus diisi.');
            return;
        }

        setSubmitting(true);
        try {
            const response = await axiosClient.post('/api/allergies', {
                allergen_name: allergenName.trim(),
                symptom: symptom.trim() || null,
                description: description.trim() || null,
                severity: severity
            });

            if (response.data && response.data.success) {
                Alert.alert('Berhasil', 'Data alergi berhasil disimpan.');
                setModalVisible(false);
                setAllergenName('');
                setSymptom('');
                setDescription('');
                setSeverity('sedang');
                fetchAllergies();
            }
        } catch (error) {
            console.error('Error adding allergy:', error);
            Alert.alert('Gagal', 'Terjadi kesalahan saat menambahkan alergi.');
        } finally {
            setSubmitting(false);
        }
    };

    const handleDeleteAllergy = (id: number, name: string) => {
        Alert.alert(
            'Hapus Alergi',
            `Apakah Anda yakin ingin menghapus data alergi terhadap "${name}"?`,
            [
                { text: 'Batal', style: 'cancel' },
                {
                    text: 'Hapus',
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            const response = await axiosClient.delete(`/api/allergies/${id}`);
                            if (response.data && response.data.success) {
                                Alert.alert('Berhasil', 'Data alergi telah berhasil dihapus.');
                                fetchAllergies();
                            }
                        } catch (error) {
                            console.error('Error deleting allergy:', error);
                            Alert.alert('Gagal', 'Gagal menghapus data alergi.');
                        }
                    }
                }
            ]
        );
    };

    return (
        <SafeAreaView style={styles.container}>
            <Stack.Screen options={{ headerShown: false }} />
            
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity 
                    onPress={() => {
                        if (router.canGoBack()) {
                            router.back();
                        } else {
                            router.replace('/(tabs)');
                        }
                    }} 
                    style={styles.backButton}
                >
                    <Ionicons name="chevron-back" size={24} color="#FFF" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Alergi Obat</Text>
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                
                {/* Tombol Tambah Alergi */}
                <TouchableOpacity style={styles.addButton} onPress={() => setModalVisible(true)}>
                    <Feather name="plus" size={20} color="#FFF" style={styles.addIcon} />
                    <Text style={styles.addButtonText}>Tambah Alergi Baru</Text>
                </TouchableOpacity>

                {loading ? (
                    <ActivityIndicator size="large" color="#2E8B57" style={{ marginTop: 50 }} />
                ) : allergies.length === 0 ? (
                    <View style={styles.emptyContainer}>
                        <Ionicons name="heart-dislike-outline" size={80} color="#BDC3C7" />
                        <Text style={styles.emptyTitle}>Belum Ada Alergi</Text>
                        <Text style={styles.emptyText}>
                            Anda belum mendaftarkan alergi obat. Klik tombol di atas untuk menambahkannya agar apoteker dapat memantau pesanan Anda.
                        </Text>
                    </View>
                ) : (
                    allergies.map((item) => (
                        <View 
                            key={item.id} 
                            style={[
                                styles.card, 
                                item.severity === 'berat' ? styles.cardBeratBorder : styles.cardSedangBorder
                            ]}
                        >
                            <View style={styles.cardTopRow}>
                                <View style={{ flex: 1, paddingRight: 10 }}>
                                    <Text style={styles.allergyName}>{item.allergen_name}</Text>
                                    <Text style={styles.symptomText}>
                                        {item.symptom ? `Gejala: ${item.symptom}` : 'Tidak ada catatan gejala'}
                                    </Text>
                                    {item.description ? (
                                        <Text style={styles.descriptionText}>
                                            Deskripsi: {item.description}
                                        </Text>
                                    ) : null}
                                </View>
                                <TouchableOpacity 
                                    style={styles.deleteButton} 
                                    onPress={() => handleDeleteAllergy(item.id, item.allergen_name)}
                                >
                                    <Feather name="trash-2" size={20} color="#D32F2F" />
                                </TouchableOpacity>
                            </View>
                            <View style={styles.badgeContainer}>
                                <View style={[styles.badge, item.severity === 'berat' ? styles.badgeBerat : styles.badgeSedang]}>
                                    <Text style={item.severity === 'berat' ? styles.badgeTextBerat : styles.badgeTextSedang}>
                                        {item.severity === 'berat' ? 'Berat' : 'Sedang'}
                                    </Text>
                                </View>
                            </View>

                            {/* Warning Box jika alergi berat */}
                            {item.severity === 'berat' && (
                                <View style={styles.warningBox}>
                                    <Feather name="alert-triangle" size={14} color="#D32F2F" style={styles.warningIcon} />
                                    <Text style={styles.warningText}>Alergi berat - Berisiko tinggi terhadap kesehatan Anda</Text>
                                </View>
                            )}
                        </View>
                    ))
                )}

                {/* Info Box: Mengapa Penting? */}
                <View style={styles.infoContainer}>
                    <Text style={styles.infoTitle}>Mengapa Penting?</Text>
                    <View style={styles.infoItem}>
                        <Ionicons name="checkmark-circle" size={16} color="#2E8B57" />
                        <Text style={styles.infoText}>Data dicek otomatis saat pesan obat</Text>
                    </View>
                    <View style={styles.infoItem}>
                        <Ionicons name="checkmark-circle" size={16} color="#2E8B57" />
                        <Text style={styles.infoText}>Sistem akan memperingatkan jika ada risiko</Text>
                    </View>
                    <View style={styles.infoItem}>
                        <Ionicons name="checkmark-circle" size={16} color="#2E8B57" />
                        <Text style={styles.infoText}>Apoteker bisa memberikan alternatif yang aman</Text>
                    </View>
                </View>

            </ScrollView>

            {/* Modal Tambah Alergi */}
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Tambah Alergi Baru</Text>
                        
                        <Text style={styles.inputLabel}>Nama Obat / Zat Aktif</Text>
                        <TextInput
                            placeholder="Contoh: Penisilin, Aspirin, Ibuprofen..."
                            value={allergenName}
                            onChangeText={setAllergenName}
                            style={[styles.input, { outlineStyle: 'none' } as any]}
                        />

                        <Text style={styles.inputLabel}>Gejala yang Ditimbulkan</Text>
                        <TextInput
                            placeholder="Contoh: Ruam kulit, sesak napas, gatal..."
                            value={symptom}
                            onChangeText={setSymptom}
                            style={[styles.input, { outlineStyle: 'none' } as any]}
                        />

                        <Text style={styles.inputLabel}>Deskripsi Alergi</Text>
                        <TextInput
                            placeholder="Catatan tambahan mengenai riwayat alergi..."
                            value={description}
                            onChangeText={setDescription}
                            style={[styles.input, { outlineStyle: 'none' } as any]}
                        />

                        <Text style={styles.inputLabel}>Tingkat Keparahan</Text>
                        <View style={styles.severityRow}>
                            <TouchableOpacity
                                style={[
                                    styles.severityBtn,
                                    severity === 'sedang' && styles.severityBtnActiveSedang
                                ]}
                                onPress={() => setSeverity('sedang')}
                            >
                                <Text style={[
                                    styles.severityBtnText,
                                    severity === 'sedang' && styles.severityBtnTextActiveSedang
                                ]}>Sedang</Text>
                            </TouchableOpacity>
                            
                            <TouchableOpacity
                                style={[
                                    styles.severityBtn,
                                    severity === 'berat' && styles.severityBtnActiveBerat
                                ]}
                                onPress={() => setSeverity('berat')}
                            >
                                <Text style={[
                                    styles.severityBtnText,
                                    severity === 'berat' && styles.severityBtnTextActiveBerat
                                ]}>Berat</Text>
                            </TouchableOpacity>
                        </View>

                        <View style={styles.modalBtnRow}>
                            <TouchableOpacity 
                                style={styles.modalCancelBtn} 
                                onPress={() => setModalVisible(false)}
                                disabled={submitting}
                            >
                                <Text style={styles.modalCancelBtnText}>Batal</Text>
                            </TouchableOpacity>
                            <TouchableOpacity 
                                style={styles.modalSubmitBtn} 
                                onPress={handleAddAllergy}
                                disabled={submitting}
                            >
                                {submitting ? (
                                    <ActivityIndicator color="#FFF" size="small" />
                                ) : (
                                    <Text style={styles.modalSubmitBtnText}>Simpan</Text>
                                )}
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FAFAFA',
    },
    header: {
        backgroundColor: '#2E8B57',
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 16,
        paddingHorizontal: 16,
        paddingTop: Platform.OS === 'ios' ? 15 : 40,
    },
    backButton: {
        marginRight: 16,
    },
    headerTitle: {
        color: '#FFF',
        fontSize: 20,
        fontWeight: 'bold',
    },
    scrollContent: {
        padding: 20,
    },
    addButton: {
        backgroundColor: '#2E8B57',
        flexDirection: 'row',
        height: 50,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 24,
        shadowColor: '#2E8B57',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 2,
    },
    addIcon: {
        marginRight: 8,
    },
    addButtonText: {
        color: '#FFF',
        fontSize: 16,
        fontWeight: 'bold',
    },
    card: {
        backgroundColor: '#FFF',
        borderRadius: 16,
        padding: 16,
        marginBottom: 16,
        borderWidth: 1,
        borderColor: '#E0E0E0',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 2,
    },
    cardSedangBorder: {
        borderLeftWidth: 5,
        borderLeftColor: '#F57C00',
    },
    cardBeratBorder: {
        borderLeftWidth: 5,
        borderLeftColor: '#D32F2F',
    },
    cardTopRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
    },
    allergyName: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#2C3E50',
        marginBottom: 4,
    },
    symptomText: {
        fontSize: 14,
        color: '#555',
        marginBottom: 8,
    },
    descriptionText: {
        fontSize: 13,
        color: '#7F8C8D',
        marginTop: 2,
        marginBottom: 8,
    },
    deleteButton: {
        padding: 6,
    },
    badgeContainer: {
        alignItems: 'flex-start',
        marginTop: 4,
    },
    badge: {
        paddingHorizontal: 12,
        paddingVertical: 4,
        borderRadius: 12,
    },
    badgeSedang: {
        backgroundColor: '#FFF3E0',
    },
    badgeTextSedang: {
        color: '#E65100',
        fontSize: 12,
        fontWeight: 'bold',
    },
    badgeBerat: {
        backgroundColor: '#FFEBEE',
    },
    badgeTextBerat: {
        color: '#D32F2F',
        fontSize: 12,
        fontWeight: 'bold',
    },
    warningBox: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFEBEE',
        padding: 12,
        borderRadius: 8,
        marginTop: 12,
    },
    warningIcon: {
        marginRight: 8,
    },
    warningText: {
        fontSize: 12,
        color: '#D32F2F',
        flex: 1,
    },
    infoContainer: {
        backgroundColor: '#E8F5E9',
        borderRadius: 16,
        padding: 20,
        marginTop: 10,
        borderLeftWidth: 4,
        borderLeftColor: '#2E8B57',
    },
    infoTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#2E8B57',
        marginBottom: 12,
    },
    infoItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    infoText: {
        marginLeft: 8,
        fontSize: 13,
        color: '#2C3E50',
    },
    emptyContainer: {
        alignItems: 'center',
        paddingVertical: 40,
        paddingHorizontal: 20,
        backgroundColor: '#FFF',
        borderRadius: 16,
        borderWidth: 1,
        borderColor: '#E0E0E0',
        marginBottom: 20,
    },
    emptyTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#2C3E50',
        marginTop: 12,
        marginBottom: 6,
    },
    emptyText: {
        fontSize: 14,
        color: '#7F8C8D',
        textAlign: 'center',
        lineHeight: 20,
    },

    // Modal styles
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    modalContent: {
        backgroundColor: '#FFF',
        borderRadius: 20,
        width: '100%',
        maxWidth: 340,
        padding: 24,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.25,
        shadowRadius: 10,
        elevation: 10,
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#2C3E50',
        marginBottom: 20,
        textAlign: 'center',
    },
    inputLabel: {
        fontSize: 14,
        fontWeight: '600',
        color: '#34495E',
        marginBottom: 6,
        marginTop: 12,
    },
    input: {
        backgroundColor: '#F5F6F8',
        borderRadius: 10,
        paddingHorizontal: 16,
        height: 46,
        fontSize: 14,
        color: '#2C3E50',
        borderWidth: 1,
        borderColor: '#E2E8F0',
    },
    severityRow: {
        flexDirection: 'row',
        gap: 12,
        marginTop: 6,
        marginBottom: 20,
    },
    severityBtn: {
        flex: 1,
        height: 40,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#CBD5E1',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#FFF',
    },
    severityBtnActiveSedang: {
        borderColor: '#F57C00',
        backgroundColor: '#FFF3E0',
    },
    severityBtnActiveBerat: {
        borderColor: '#D32F2F',
        backgroundColor: '#FFEBEE',
    },
    severityBtnText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#64748B',
    },
    severityBtnTextActiveSedang: {
        color: '#E65100',
    },
    severityBtnTextActiveBerat: {
        color: '#D32F2F',
    },
    modalBtnRow: {
        flexDirection: 'row',
        gap: 12,
        marginTop: 10,
    },
    modalCancelBtn: {
        flex: 1,
        height: 48,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#CBD5E1',
    },
    modalCancelBtnText: {
        fontSize: 15,
        fontWeight: '600',
        color: '#64748B',
    },
    modalSubmitBtn: {
        flex: 1,
        height: 48,
        borderRadius: 12,
        backgroundColor: '#2E8B57',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalSubmitBtnText: {
        fontSize: 15,
        fontWeight: '600',
        color: '#FFF',
    },
});