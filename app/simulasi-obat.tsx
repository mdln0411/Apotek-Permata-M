import { Feather, Ionicons } from '@expo/vector-icons';
import { router, Stack } from 'expo-router';
import React, { useState, useEffect } from 'react';
import { 
    SafeAreaView, 
    ScrollView, 
    StyleSheet, 
    Text, 
    TouchableOpacity, 
    View,
    Platform,
    TextInput,
    Modal,
    FlatList,
    ActivityIndicator
} from 'react-native';
import { getSimulationMedicines, checkSimulationInteraction } from '@/api/medicineService';

export default function SimulasiObatScreen() {
    const [obatA, setObatA] = useState('');
    const [obatB, setObatB] = useState('');
    const [result, setResult] = useState<null | 'aman' | 'bahaya' | 'peringatan'>(null);
    const [interactionText, setInteractionText] = useState('');
    const [checking, setChecking] = useState(false);

    // List of unique medicines loaded from DB
    const [medicines, setMedicines] = useState<string[]>([]);
    const [loadingMedicines, setLoadingMedicines] = useState(false);
    const [loadError, setLoadError] = useState('');
    
    // Modal state for selecting medicines
    const [modalVisible, setModalVisible] = useState(false);
    const [activeSelection, setActiveSelection] = useState<'A' | 'B' | null>(null);
    const [searchQuery, setSearchQuery] = useState('');

    // Fetch the list of medicines on load
    useEffect(() => {
        const loadMedicines = async () => {
            try {
                setLoadingMedicines(true);
                setLoadError('');
                const res = await getSimulationMedicines();
                if (res?.status === 'success' && Array.isArray(res.data)) {
                    setMedicines(res.data);
                    if (res.data.length === 0) {
                        setLoadError('Database simulasi kosong. Jalankan seeder di backend.');
                    }
                } else {
                    setLoadError('Format data simulasi tidak valid.');
                }
            } catch (e: any) {
                console.error("Gagal memuat data obat simulasi:", e);
                setLoadError(
                    e.response?.data?.message ||
                    'Gagal memuat database simulasi. Pastikan backend Laravel & MySQL berjalan.'
                );
            } finally {
                setLoadingMedicines(false);
            }
        };
        loadMedicines();
    }, []);

    const handleCheck = async () => {
        if (!obatA || !obatB) return;
        
        try {
            setChecking(true);
            const res = await checkSimulationInteraction(obatA, obatB);
            if (res && res.status === 'success') {
                const simResult = res.data.simulasi;
                setInteractionText(simResult);
                
                // Classify safety level dynamically based on database text content
                const textLower = simResult.toLowerCase();
                if (
                    textLower.includes('tidak aman') || 
                    textLower.includes('bahaya') || 
                    textLower.includes('overdosis') || 
                    textLower.includes('depresi') || 
                    textLower.includes('menurunkan') ||
                    textLower.includes('mengurangi penyerapan') ||
                    textLower.includes('meningkatkan risiko')
                ) {
                    // Check if it's actually warning instead of danger, e.g. "Aman dengan pengawasan"
                    if (textLower.includes('aman dengan') || textLower.includes('pengawasan') || textLower.includes('pemantauan')) {
                        setResult('peringatan');
                    } else {
                        setResult('bahaya');
                    }
                } else if (textLower.includes('aman dikonsumsi bersamaan') || textLower.includes('aman dengan')) {
                    if (textLower.includes('pengawasan') || textLower.includes('pemantauan') || textLower.includes('hati-hati')) {
                        setResult('peringatan');
                    } else {
                        setResult('aman');
                    }
                } else {
                    setResult('peringatan');
                }
            }
        } catch (e) {
            console.error("Gagal mengecek interaksi obat:", e);
        } finally {
            setChecking(false);
        }
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
                    style={styles.backBtn}
                >
                    <Ionicons name="chevron-back" size={24} color="#333" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Simulasi Interaksi</Text>
                <View style={{ width: 40 }} />
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                
                <View style={styles.infoBox}>
                    <View style={styles.iconCircle}>
                        <Ionicons name="shield-checkmark" size={40} color="#2E8B57" />
                    </View>
                    <Text style={styles.infoTitle}>Cek Keamanan Obat</Text>
                    <Text style={styles.infoSub}>Pilih dua nama obat dari database untuk melihat potensi interaksi kimianya saat dikonsumsi bersamaan.</Text>
                    {loadError ? (
                        <Text style={styles.errorBanner}>{loadError}</Text>
                    ) : !loadingMedicines && medicines.length > 0 ? (
                        <Text style={styles.dataInfo}>{medicines.length} nama obat tersedia di database</Text>
                    ) : null}
                </View>

                {/* Input Area */}
                <View style={styles.inputCard}>
                    <Text style={styles.label}>Obat Pertama</Text>
                    <TouchableOpacity 
                        style={styles.dropdownTrigger}
                        onPress={() => {
                            setActiveSelection('A');
                            setSearchQuery('');
                            setModalVisible(true);
                        }}
                    >
                        <Text style={[styles.dropdownTriggerText, !obatA && styles.placeholderText]}>
                            {obatA || "Pilih Obat Pertama"}
                        </Text>
                        <Feather name="chevron-down" size={20} color="#666" />
                    </TouchableOpacity>

                    <View style={styles.plusWrapper}>
                        <View style={styles.plusLine} />
                        <View style={styles.plusIconBg}>
                            <Ionicons name="add" size={24} color="#2E8B57" />
                        </View>
                        <View style={styles.plusLine} />
                    </View>

                    <Text style={styles.label}>Obat Kedua</Text>
                    <TouchableOpacity 
                        style={styles.dropdownTrigger}
                        onPress={() => {
                            setActiveSelection('B');
                            setSearchQuery('');
                            setModalVisible(true);
                        }}
                    >
                        <Text style={[styles.dropdownTriggerText, !obatB && styles.placeholderText]}>
                            {obatB || "Pilih Obat Kedua"}
                        </Text>
                        <Feather name="chevron-down" size={20} color="#666" />
                    </TouchableOpacity>

                    <TouchableOpacity 
                        style={[styles.checkBtn, (!obatA || !obatB || checking) && styles.disabledBtn]} 
                        onPress={handleCheck}
                        disabled={!obatA || !obatB || checking}
                    >
                        {checking ? (
                            <ActivityIndicator size="small" color="#FFF" />
                        ) : (
                            <Text style={styles.checkBtnText}>Cek Interaksi Sekarang</Text>
                        )}
                    </TouchableOpacity>
                </View>

                {/* Result Area */}
                {result && (
                    <View style={[
                        styles.resultCard, 
                        result === 'aman' && styles.resultAman,
                        result === 'bahaya' && styles.resultBahaya,
                        result === 'peringatan' && styles.resultPeringatan
                    ]}>
                        <View style={styles.resultHeader}>
                            <Ionicons 
                                name={result === 'aman' ? 'checkmark-circle' : result === 'bahaya' ? 'alert-circle' : 'warning'} 
                                size={24} 
                                color={result === 'aman' ? '#2E8B57' : result === 'bahaya' ? '#D32F2F' : '#F57C00'} 
                            />
                            <Text style={[
                                styles.resultTitle,
                                { color: result === 'aman' ? '#2E8B57' : result === 'bahaya' ? '#D32F2F' : '#F57C00' }
                            ]}>
                                {result === 'aman' ? 'Aman Digunakan' : result === 'bahaya' ? 'Bahaya / Kontraindikasi' : 'Perlu Perhatian'}
                            </Text>
                        </View>
                        <Text style={styles.resultDesc}>
                            {interactionText}
                        </Text>
                    </View>
                )}

                <View style={styles.disclaimer}>
                    <Text style={styles.disclaimerText}>* Data simulasi ini hanya sebagai referensi awal. Selalu konsultasikan dengan Apoteker kami melalui fitur Chat untuk kepastian medis.</Text>
                </View>

            </ScrollView>

            {/* Selection Modal */}
            <Modal
                visible={modalVisible}
                animationType="slide"
                transparent={true}
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        {/* Modal Header */}
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>
                                Pilih Obat {activeSelection === 'A' ? 'Pertama' : 'Kedua'}
                            </Text>
                            <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.modalCloseBtn}>
                                <Ionicons name="close" size={24} color="#333" />
                            </TouchableOpacity>
                        </View>

                        {/* Modal Search Bar */}
                        <View style={styles.modalSearchBox}>
                            <Feather name="search" size={18} color="#999" style={{ marginRight: 8 }} />
                            <TextInput
                                style={[styles.modalSearchInput, { outline: 'none' } as any]}
                                placeholder="Cari nama obat..."
                                placeholderTextColor="#AAA"
                                value={searchQuery}
                                onChangeText={setSearchQuery}
                                underlineColorAndroid="transparent"
                            />
                            {searchQuery.length > 0 && (
                                <TouchableOpacity onPress={() => setSearchQuery('')}>
                                    <Feather name="x-circle" size={18} color="#999" />
                                </TouchableOpacity>
                            )}
                        </View>

                        {/* Modal List */}
                        {loadingMedicines ? (
                            <View style={styles.modalLoading}>
                                <ActivityIndicator size="large" color="#2E8B57" />
                                <Text style={{ marginTop: 10, color: '#777' }}>Memuat data obat...</Text>
                            </View>
                        ) : (
                            <FlatList
                                data={medicines.filter(item => 
                                    item.toLowerCase().includes(searchQuery.toLowerCase()) && 
                                    item !== (activeSelection === 'A' ? obatB : obatA)
                                )}
                                keyExtractor={(item) => item}
                                renderItem={({ item }) => (
                                    <TouchableOpacity 
                                        style={styles.modalItem}
                                        onPress={() => {
                                            if (activeSelection === 'A') {
                                                setObatA(item);
                                            } else {
                                                setObatB(item);
                                            }
                                            setModalVisible(false);
                                        }}
                                    >
                                        <View style={styles.modalItemIcon}>
                                            <Feather name="activity" size={16} color="#2E8B57" />
                                        </View>
                                        <Text style={styles.modalItemText}>{item}</Text>
                                    </TouchableOpacity>
                                )}
                                ListEmptyComponent={
                                    <View style={styles.modalEmpty}>
                                        <Feather name="info" size={32} color="#CCC" />
                                        <Text style={styles.modalEmptyText}>Obat tidak ditemukan</Text>
                                    </View>
                                }
                                contentContainerStyle={{ paddingBottom: 20 }}
                            />
                        )}
                    </View>
                </View>
            </Modal>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F8FBF8' },
    header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingTop: Platform.OS === 'ios' ? 0 : 40, paddingBottom: 16, backgroundColor: '#FFF', borderBottomWidth: 1, borderBottomColor: '#EEE' },
    backBtn: { width: 40, height: 40, justifyContent: 'center' },
    headerTitle: { fontSize: 18, fontWeight: 'bold', color: '#333' },
    scrollContent: { padding: 20 },
    infoBox: { alignItems: 'center', marginBottom: 24, paddingHorizontal: 10 },
    iconCircle: { width: 80, height: 80, borderRadius: 40, backgroundColor: '#E8F5E9', justifyContent: 'center', alignItems: 'center', marginBottom: 16 },
    infoTitle: { fontSize: 22, fontWeight: 'bold', color: '#333', marginBottom: 8 },
    infoSub: { fontSize: 13, color: '#777', textAlign: 'center', lineHeight: 20 },
    dataInfo: { fontSize: 12, color: '#2E8B57', marginTop: 10, fontWeight: '600' },
    errorBanner: { fontSize: 12, color: '#D32F2F', marginTop: 12, textAlign: 'center', backgroundColor: '#FFEBEE', padding: 10, borderRadius: 8 },
    inputCard: { backgroundColor: '#FFF', borderRadius: 24, padding: 20, borderWidth: 1, borderColor: '#EEE', elevation: 4, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.05, shadowRadius: 10 },
    label: { fontSize: 14, fontWeight: 'bold', color: '#555', marginBottom: 8 },
    dropdownTrigger: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: '#F5F5F5',
        borderRadius: 12,
        paddingHorizontal: 16,
        height: 52,
        borderWidth: 1,
        borderColor: '#E0E0E0',
    },
    dropdownTriggerText: {
        fontSize: 15,
        color: '#333'
    },
    placeholderText: {
        color: '#AAA'
    },
    plusWrapper: { flexDirection: 'row', alignItems: 'center', marginVertical: 15, gap: 10 },
    plusLine: { flex: 1, height: 1, backgroundColor: '#EEE' },
    plusIconBg: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#F0F4F0', justifyContent: 'center', alignItems: 'center' },
    checkBtn: { backgroundColor: '#2E8B57', paddingVertical: 16, borderRadius: 12, alignItems: 'center', marginTop: 20 },
    checkBtnText: { color: '#FFF', fontSize: 16, fontWeight: 'bold' },
    disabledBtn: { backgroundColor: '#CCC' },
    resultCard: { borderRadius: 20, padding: 20, marginTop: 24, borderWidth: 1 },
    resultAman: { backgroundColor: '#E8F5E9', borderColor: '#C8E6C9' },
    resultBahaya: { backgroundColor: '#FFEBEE', borderColor: '#FFCDD2' },
    resultPeringatan: { backgroundColor: '#FFF3E0', borderColor: '#FFE0B2' },
    resultHeader: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 12 },
    resultTitle: { fontSize: 16, fontWeight: 'bold' },
    resultDesc: { fontSize: 14, color: '#444', lineHeight: 22 },
    disclaimer: { marginTop: 30, paddingHorizontal: 10 },
    disclaimerText: { fontSize: 11, color: '#AAA', fontStyle: 'italic', textAlign: 'center', lineHeight: 16 },
    
    // Modal styles
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'flex-end',
    },
    modalContent: {
        backgroundColor: '#FFF',
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        height: '75%',
        paddingHorizontal: 20,
        paddingTop: 20,
    },
    modalHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 16,
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
    },
    modalCloseBtn: {
        padding: 4,
    },
    modalSearchBox: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F5F5F5',
        borderRadius: 12,
        paddingHorizontal: 14,
        height: 48,
        marginBottom: 16,
        borderWidth: 1,
        borderColor: '#E0E0E0',
    },
    modalSearchInput: {
        flex: 1,
        fontSize: 14,
        color: '#333',
        paddingVertical: 0,
    },
    modalLoading: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 14,
        borderBottomWidth: 1,
        borderBottomColor: '#F0F0F0',
    },
    modalItemIcon: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: '#E8F5E9',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    modalItemText: {
        fontSize: 15,
        color: '#333',
        fontWeight: '500',
    },
    modalEmpty: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 40,
        gap: 10,
    },
    modalEmptyText: {
        fontSize: 14,
        color: '#AAA',
    },
});