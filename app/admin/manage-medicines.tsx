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
    TextInput,
    Platform,
    Image,
    ActivityIndicator,
    Modal,
    Switch
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';

export default function ManageMedicines() {
    const [searchQuery, setSearchQuery] = useState('');
    const [sidebarVisible, setSidebarVisible] = useState(false);
    const [medicines, setMedicines] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
    
    // Modal State
    const [modalVisible, setModalVisible] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [currentId, setCurrentId] = useState<number | null>(null);
    
    // Form State
    const [formData, setFormData] = useState({
        name: '',
        category: '',
        price: '',
        stock: '',
        unit: 'Pcs',
        prescription_required: false,
        indication: '',
        usage_rules: '',
        dosage: '',
        side_effects: '',
        composition: '',
        usage_duration: '',
        image_url: '',
    });
    const [imageUri, setImageUri] = useState<string | null>(null);

    useEffect(() => {
        fetchMedicines();
    }, []);

    const fetchMedicines = async () => {
        try {
            setLoading(true);
            const response = await axiosClient.get('/api/medicines?per_page=500');
            setMedicines(Array.isArray(response.data.data) ? response.data.data : []);
        } catch (error) {
            console.error('Error fetching medicines:', error);
            setMedicines([]);
        } finally {
            setLoading(false);
        }
    };

    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 1,
        });

        if (!result.canceled) {
            setImageUri(result.assets[0].uri);
            setFormData({ ...formData, image_url: '' }); // Reset URL if file picked
        }
    };

    const handleAdd = () => {
        setFormData({
            name: '', category: '', price: '', stock: '', unit: 'Pcs',
            prescription_required: false, indication: '', usage_rules: '',
            dosage: '', side_effects: '', composition: '', usage_duration: '', image_url: ''
        });
        setImageUri(null);
        setIsEditing(false);
        setModalVisible(true);
    };

    const handleEdit = (item: any) => {
        setFormData({
            name: item.name,
            category: item.category,
            price: item.price.toString(),
            stock: item.stock.toString(),
            unit: item.unit || 'Pcs',
            prescription_required: item.prescription_required === 1,
            indication: item.indication || '',
            usage_rules: item.usage_rules || '',
            dosage: item.dosage || '',
            side_effects: item.side_effects || '',
            composition: item.composition || '',
            usage_duration: item.usage_duration || '',
            image_url: item.image_url && item.image_url.startsWith('http') ? item.image_url : '',
        });
        setImageUri(null);
        setCurrentId(item.id);
        setIsEditing(true);
        setModalVisible(true);
    };

    const handleSave = async () => {
        if (!formData.name || !formData.category || !formData.price || !formData.stock) {
            alert('Mohon isi semua field wajib (Nama, Kategori, Harga, Stok)');
            return;
        }

        try {
            const data = new FormData();
            
            // Tambahkan field teks
            Object.keys(formData).forEach(key => {
                const value = (formData as any)[key];
                if (key === 'prescription_required') {
                    data.append(key, value ? '1' : '0');
                } else if (value !== null && value !== undefined && value !== '') {
                    data.append(key, value);
                }
            });
            
            if (imageUri) {
                // Proses Gambar untuk Web vs Mobile
                if (Platform.OS === 'web') {
                    const response = await fetch(imageUri);
                    const blob = await response.blob();
                    data.append('image', blob, 'medicine.jpg');
                } else {
                    const filename = imageUri.split('/').pop();
                    const match = /\.(\w+)$/.exec(filename || '');
                    const type = match ? `image/${match[1]}` : `image`;
                    // @ts-ignore
                    data.append('image', { uri: imageUri, name: filename, type });
                }
            }

            if (isEditing && currentId) {
                data.append('_method', 'PUT');
                await axiosClient.post(`/api/medicines/${currentId}`, data, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
                
                router.push({
                    pathname: '/success-action',
                    params: {
                        title: 'Berhasil Diperbarui',
                        message: `Data obat "${formData.name}" telah berhasil diperbarui di sistem.`,
                        target: '/admin/manage-medicines'
                    }
                } as any);
            } else {
                await axiosClient.post('/api/medicines', data, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
                
                router.push({
                    pathname: '/success-action',
                    params: {
                        title: 'Berhasil Ditambahkan',
                        message: `Obat baru "${formData.name}" telah berhasil diterbitkan ke katalog.`,
                        target: '/admin/manage-medicines'
                    }
                } as any);
            }

            
            setModalVisible(false);
            fetchMedicines();
        } catch (error) {
            console.error('Error saving medicine:', error);
            alert('Gagal menyimpan data obat');
        }
    };

    const handleDelete = (id: number) => {
        if (confirm('Apakah Anda yakin ingin menghapus obat ini?')) {
            (async () => {
                try {
                    await axiosClient.delete(`/api/medicines/${id}`);
                    fetchMedicines();
                } catch (error) {
                    alert('Gagal menghapus obat');
                }
            })();
        }
    };

    const filteredMedicines = Array.isArray(medicines) ? medicines.filter(m => 
        m.name?.toLowerCase().includes(searchQuery.toLowerCase())
    ) : [];

    const sortedFilteredMedicines = [...filteredMedicines].sort((a, b) => {
        const nameA = (a.name || '').toLowerCase();
        const nameB = (b.name || '').toLowerCase();
        if (sortOrder === 'asc') {
            return nameA.localeCompare(nameB);
        } else {
            return nameB.localeCompare(nameA);
        }
    });

    return (
        <SafeAreaView style={styles.container}>
            <Stack.Screen options={{ headerShown: false }} />

            <AdminSidebar 
                visible={sidebarVisible} 
                onClose={() => setSidebarVisible(false)} 
                activePage="medicines" 
            />

            {/* Modal Form */}
            <Modal
                visible={modalVisible}
                animationType="slide"
                transparent={true}
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>{isEditing ? 'Edit Obat' : 'Tambah Obat Baru'}</Text>
                            <TouchableOpacity onPress={() => setModalVisible(false)}>
                                <Ionicons name="close" size={24} color="#333" />
                            </TouchableOpacity>
                        </View>

                        <ScrollView showsVerticalScrollIndicator={false} style={styles.formScroll}>
                            <Text style={styles.inputLabel}>Nama Obat *</Text>
                            <TextInput 
                                style={styles.input}
                                placeholder="Masukkan nama obat"
                                value={formData.name}
                                onChangeText={(text) => setFormData({...formData, name: text})}
                            />

                            <View style={styles.rowInputs}>
                                <View style={{ flex: 1, marginRight: 10 }}>
                                    <Text style={styles.inputLabel}>Kategori *</Text>
                                    <TextInput 
                                        style={styles.input}
                                        placeholder="Kategori"
                                        value={formData.category}
                                        onChangeText={(text) => setFormData({...formData, category: text})}
                                    />
                                </View>
                                <View style={{ flex: 1 }}>
                                    <Text style={styles.inputLabel}>Satuan (Pcs/Strip)</Text>
                                    <TextInput 
                                        style={styles.input}
                                        placeholder="Pcs/Strip/Box"
                                        value={formData.unit}
                                        onChangeText={(text) => setFormData({...formData, unit: text})}
                                    />
                                </View>
                            </View>

                            <View style={styles.rowInputs}>
                                <View style={{ flex: 1, marginRight: 10 }}>
                                    <Text style={styles.inputLabel}>Harga (Rp) *</Text>
                                    <TextInput 
                                        style={styles.input}
                                        placeholder="Contoh: 15000"
                                        keyboardType="numeric"
                                        value={formData.price}
                                        onChangeText={(text) => setFormData({...formData, price: text})}
                                    />
                                </View>
                                <View style={{ flex: 1 }}>
                                    <Text style={styles.inputLabel}>Stok *</Text>
                                    <TextInput 
                                        style={styles.input}
                                        placeholder="Jumlah stok"
                                        keyboardType="numeric"
                                        value={formData.stock}
                                        onChangeText={(text) => setFormData({...formData, stock: text})}
                                    />
                                </View>
                            </View>

                            <Text style={styles.inputLabel}>Gambar Obat</Text>
                            <View style={{ flexDirection: 'row', gap: 10, alignItems: 'center' }}>
                                <TouchableOpacity style={[styles.input, { flex: 1, justifyContent: 'center' }]} onPress={pickImage}>
                                    <Text style={{ color: imageUri ? '#2E8B57' : '#999' }}>
                                        {imageUri ? 'Gambar Terpilih ✓' : 'Pilih dari Galeri'}
                                    </Text>
                                </TouchableOpacity>
                                <Text>atau</Text>
                                <TextInput 
                                    style={[styles.input, { flex: 1 }]}
                                    placeholder="Link URL Gambar"
                                    value={formData.image_url}
                                    onChangeText={(text) => {
                                        setFormData({...formData, image_url: text});
                                        setImageUri(null);
                                    }}
                                />
                            </View>

                            <View style={styles.switchRow}>
                                <Text style={styles.inputLabel}>Perlu Resep Dokter?</Text>
                                <Switch 
                                    value={formData.prescription_required}
                                    onValueChange={(val) => setFormData({...formData, prescription_required: val})}
                                    trackColor={{ false: '#DDD', true: '#A5D6A7' }}
                                    thumbColor={formData.prescription_required ? '#2E8B57' : '#FFF'}
                                />
                            </View>

                            <Text style={styles.inputLabel}>Indikasi / Kegunaan</Text>
                            <TextInput 
                                style={[styles.input, styles.textArea]}
                                placeholder="Jelaskan kegunaan obat..."
                                multiline
                                numberOfLines={3}
                                value={formData.indication}
                                onChangeText={(text) => setFormData({...formData, indication: text})}
                            />

                            <Text style={styles.inputLabel}>Aturan Pakai</Text>
                            <TextInput 
                                style={[styles.input, styles.textArea]}
                                placeholder="Contoh: Sesudah makan..."
                                multiline
                                numberOfLines={2}
                                value={formData.usage_rules}
                                onChangeText={(text) => setFormData({...formData, usage_rules: text})}
                            />

                            <View style={styles.rowInputs}>
                                <View style={{ flex: 1, marginRight: 10 }}>
                                    <Text style={styles.inputLabel}>Dosis</Text>
                                    <TextInput 
                                        style={styles.input}
                                        placeholder="Contoh: 3 x 1"
                                        value={formData.dosage}
                                        onChangeText={(text) => setFormData({...formData, dosage: text})}
                                    />
                                </View>
                                <View style={{ flex: 1 }}>
                                    <Text style={styles.inputLabel}>Lama Penggunaan</Text>
                                    <TextInput 
                                        style={styles.input}
                                        placeholder="Contoh: 3-5 hari"
                                        value={formData.usage_duration}
                                        onChangeText={(text) => setFormData({...formData, usage_duration: text})}
                                    />
                                </View>
                            </View>

                            <Text style={styles.inputLabel}>Efek Samping</Text>
                            <TextInput 
                                style={[styles.input, styles.textArea]}
                                placeholder="Jelaskan efek samping jika ada..."
                                multiline
                                numberOfLines={2}
                                value={formData.side_effects}
                                onChangeText={(text) => setFormData({...formData, side_effects: text})}
                            />

                            <Text style={styles.inputLabel}>Komposisi</Text>
                            <TextInput 
                                style={styles.input}
                                placeholder="Kandungan obat"
                                value={formData.composition}
                                onChangeText={(text) => setFormData({...formData, composition: text})}
                            />
                        </ScrollView>

                        <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
                            <Text style={styles.saveBtnText}>{isEditing ? 'Simpan Perubahan' : 'Terbitkan Obat'}</Text>
                        </TouchableOpacity>
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
                <TouchableOpacity style={styles.profileCircle}>
                    <Ionicons name="person-outline" size={20} color="#FFF" />
                </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
                
                {/* Title & Add Button */}
                <View style={styles.headerRow}>
                    <View>
                        <Text style={styles.pageTitle}>Manajemen Obat</Text>
                        <Text style={styles.pageSub}>{medicines.length} obat terdaftar</Text>
                    </View>
                    <TouchableOpacity style={styles.addBtn} onPress={handleAdd}>
                        <Ionicons name="add" size={20} color="#FFF" />
                        <Text style={styles.addBtnText}>Tambah</Text>
                    </TouchableOpacity>
                </View>

                {/* Search Bar */}
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 24 }}>
                    <View style={[styles.searchContainer, { flex: 1, marginBottom: 0 }]}>
                        <Ionicons name="search-outline" size={20} color="#999" style={styles.searchIcon} />
                        <TextInput 
                            style={styles.searchInput}
                            placeholder="Cari obat..."
                            value={searchQuery}
                            onChangeText={setSearchQuery}
                        />
                    </View>
                    <TouchableOpacity 
                        style={styles.sortBtn} 
                        onPress={() => setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc')}
                        activeOpacity={0.7}
                    >
                        <Ionicons 
                            name={sortOrder === 'asc' ? 'arrow-down-circle-outline' : 'arrow-up-circle-outline'} 
                            size={22} 
                            color="#2E8B57" 
                        />
                        <Text style={styles.sortBtnText}>{sortOrder === 'asc' ? 'A-Z' : 'Z-A'}</Text>
                    </TouchableOpacity>
                </View>

                {/* Medicine List */}
                <View style={styles.listContainer}>
                    {loading ? (
                        <ActivityIndicator size="large" color="#2E8B57" style={{ marginTop: 20 }} />
                    ) : sortedFilteredMedicines.map((item) => (
                        <View key={item.id} style={styles.medCard}>
                            <View style={styles.medImageBg}>
                                {item.image_url ? (
                                    <Image 
                                        source={{ 
                                            uri: item.image_url.startsWith('http') 
                                                ? item.image_url 
                                                : `http://127.0.0.1:8000/storage/${item.image_url}` 
                                        }} 
                                        style={{ width: '100%', height: '100%', borderRadius: 12 }} 
                                    />
                                ) : (
                                    <Ionicons name="medical-outline" size={30} color="#2E8B57" />
                                )}
                            </View>
                            
                            <View style={styles.medInfo}>
                                <Text style={styles.medName}>{item.name}</Text>
                                <View style={styles.badgeRow}>
                                    <View style={styles.catBadge}>
                                        <Text style={styles.catText}>{item.category}</Text>
                                    </View>
                                    {item.prescription_required === 1 && (
                                        <View style={styles.resepBadge}>
                                            <Text style={styles.resepText}>Resep</Text>
                                        </View>
                                    )}
                                </View>
                                <Text style={styles.medPrice}>Rp {Math.round(Number(item.price)).toLocaleString('id-ID')} • <Text style={styles.medStock}>Stok: {item.stock}</Text></Text>
                            </View>

                            <View style={styles.actionBtns}>
                                <TouchableOpacity style={styles.actionBtn} onPress={() => handleEdit(item)}>
                                    <Feather name="edit-3" size={18} color="#999" />
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.actionBtn} onPress={() => handleDelete(item.id)}>
                                    <Feather name="trash-2" size={18} color="#FF5252" />
                                </TouchableOpacity>
                            </View>
                        </View>
                    ))}
                </View>

            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F8FBF8' },
    topBar: { 
        flexDirection: 'row', 
        justifyContent: 'space-between', 
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
    profileCircle: { width: 36, height: 36, borderRadius: 18, backgroundColor: 'rgba(255,255,255,0.2)', justifyContent: 'center', alignItems: 'center' },
    scrollContent: { padding: 20 },
    headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 },
    pageTitle: { fontSize: 22, fontWeight: 'bold', color: '#333' },
    pageSub: { fontSize: 13, color: '#999', marginTop: 2 },
    addBtn: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#2E8B57', paddingHorizontal: 16, paddingVertical: 10, borderRadius: 10, gap: 6 },
    addBtnText: { color: '#FFF', fontSize: 14, fontWeight: 'bold' },
    searchContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFF', borderRadius: 12, paddingHorizontal: 16, height: 50, borderWidth: 1, borderColor: '#EEE', marginBottom: 24 },
    searchIcon: { marginRight: 12 },
    searchInput: { flex: 1, fontSize: 15, color: '#333' },
    listContainer: { gap: 16 },
    medCard: { backgroundColor: '#FFF', borderRadius: 16, padding: 12, flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: '#EEE' },
    medImageBg: { width: 70, height: 70, borderRadius: 12, backgroundColor: '#F5F5F5', justifyContent: 'center', alignItems: 'center', marginRight: 16 },
    medInfo: { flex: 1 },
    medName: { fontSize: 15, fontWeight: 'bold', color: '#333', marginBottom: 4 },
    badgeRow: { flexDirection: 'row', gap: 6, marginBottom: 8 },
    catBadge: { backgroundColor: '#F0F4F0', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 },
    catText: { fontSize: 10, color: '#2E8B57', fontWeight: 'bold' },
    resepBadge: { backgroundColor: '#E8F5E9', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6, borderWidth: 1, borderColor: '#2E8B57' },
    resepText: { fontSize: 10, color: '#2E8B57', fontWeight: 'bold' },
    medPrice: { fontSize: 13, color: '#2E8B57', fontWeight: 'bold' },
    medStock: { color: '#999', fontWeight: 'normal' },
    actionBtns: { flexDirection: 'row', gap: 10, marginLeft: 10 },
    actionBtn: { width: 36, height: 36, borderRadius: 18, backgroundColor: '#F9F9F9', justifyContent: 'center', alignItems: 'center' },
    
    // Modal Styles
    modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
    modalContent: { backgroundColor: '#FFF', borderTopLeftRadius: 30, borderTopRightRadius: 30, padding: 24, height: '85%' },
    modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
    modalTitle: { fontSize: 20, fontWeight: 'bold', color: '#333' },
    formScroll: { flex: 1 },
    inputLabel: { fontSize: 14, fontWeight: '600', color: '#555', marginBottom: 8, marginTop: 16 },
    input: { backgroundColor: '#F8FBF8', borderWidth: 1, borderColor: '#E8F5E9', borderRadius: 12, padding: 14, fontSize: 15, color: '#333' },
    textArea: { height: 80, textAlignVertical: 'top' },
    rowInputs: { flexDirection: 'row', justifyContent: 'space-between' },
    switchRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 20, paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: '#F0F0F0' },
    saveBtn: { backgroundColor: '#2E8B57', borderRadius: 14, padding: 16, alignItems: 'center', marginTop: 20, shadowColor: '#2E8B57', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8, elevation: 5 },
    saveBtnText: { color: '#FFF', fontSize: 16, fontWeight: 'bold' },
    sortBtn: {
        width: 60,
        height: 50,
        backgroundColor: '#FFF',
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#EEE',
        gap: 2,
    },
    sortBtnText: {
        fontSize: 9,
        fontWeight: 'bold',
        color: '#2E8B57',
    },
});
