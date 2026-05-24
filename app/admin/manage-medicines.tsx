import axiosClient from '@/api/axiosClient';
import { getMedicineCategories, getMedicineUnits } from '@/api/medicineService';
import AdminSidebar from '@/components/AdminSidebar';
import { AppAlertModal, AppAlertType } from '@/components/AppAlertModal';
import {
    MEDICINE_CATEGORIES,
    mergeUnitOptions,
    normalizeMedicineCategory,
    normalizeMedicineUnit,
    sanitizeIntegerInput,
} from '@/constants/medicineForm';
import {
    formatStockAlertSummary,
    getStockCounts,
    isStockHabis,
    isStockMenipis,
    matchesStockFilter,
    normalizeStock,
} from '@/utils/stockStatus';
import { Feather, Ionicons } from '@expo/vector-icons';
import { router, Stack } from 'expo-router';
import React, { useEffect, useMemo, useState } from 'react';
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
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';

type FormData = {
    name: string;
    category: string;
    price: string;
    stock: string;
    unit: string;
    indication: string;
    usage_rules: string;
    dosage: string;
    side_effects: string;
    composition: string;
    usage_duration: string;
    image_url: string;
};

const EMPTY_FORM: FormData = {
    name: '',
    category: '',
    price: '',
    stock: '',
    unit: 'Strip',
    indication: '',
    usage_rules: '',
    dosage: '',
    side_effects: '',
    composition: '',
    usage_duration: '',
    image_url: '',
};

type AlertConfig = {
    visible: boolean;
    type: AppAlertType;
    title: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
    onConfirm?: () => void;
};

const DEFAULT_ALERT: AlertConfig = {
    visible: false,
    type: 'info',
    title: '',
    message: '',
};

function OptionPicker({
    label,
    required,
    options,
    value,
    onChange,
}: {
    label: string;
    required?: boolean;
    options: string[];
    value: string;
    onChange: (val: string) => void;
}) {
    return (
        <View style={styles.pickerBlock}>
            <Text style={styles.inputLabel}>
                {label}{required ? ' *' : ''}
            </Text>
            <View style={styles.optionGrid}>
                {options.map((opt) => {
                    const active = value === opt;
                    return (
                        <TouchableOpacity
                            key={opt}
                            style={[styles.optionPill, active && styles.optionPillActive]}
                            onPress={() => onChange(opt)}
                            activeOpacity={0.75}
                        >
                            <Text style={[styles.optionPillText, active && styles.optionPillTextActive]}>
                                {opt}
                            </Text>
                        </TouchableOpacity>
                    );
                })}
            </View>
            {!value && required ? (
                <Text style={styles.pickerHint}>Pilih salah satu opsi di atas</Text>
            ) : null}
        </View>
    );
}

export default function ManageMedicines() {
    const [searchQuery, setSearchQuery] = useState('');
    const [sidebarVisible, setSidebarVisible] = useState(false);
    const [medicines, setMedicines] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
    const [statusFilter, setStatusFilter] = useState<'semua' | 'habis' | 'menipis' | 'tersedia'>('semua');
    
    // Modal State
    const [modalVisible, setModalVisible] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [currentId, setCurrentId] = useState<number | null>(null);
    
    const [formData, setFormData] = useState<FormData>(EMPTY_FORM);
    const [categoryOptions, setCategoryOptions] = useState<string[]>([...MEDICINE_CATEGORIES]);
    const [dbUnitOptions, setDbUnitOptions] = useState<string[]>([]);
    const [imageUri, setImageUri] = useState<string | null>(null);
    const [alertConfig, setAlertConfig] = useState<AlertConfig>(DEFAULT_ALERT);
    const [deletingId, setDeletingId] = useState<number | null>(null);

    const showAlert = (config: Omit<AlertConfig, 'visible'>) => {
        setAlertConfig({ ...config, visible: true });
    };

    const closeAlert = () => {
        setAlertConfig((prev) => ({ ...prev, visible: false, onConfirm: undefined }));
    };

    useEffect(() => {
        fetchMedicines();
        fetchCategoryOptions();
        fetchUnitOptions();
    }, []);

    const fetchUnitOptions = async () => {
        try {
            const res = await getMedicineUnits();
            const fromApi = Array.isArray(res.data) ? res.data : [];
            setDbUnitOptions(fromApi);
        } catch {
            setDbUnitOptions([]);
        }
    };

    const fetchCategoryOptions = async () => {
        try {
            const res = await getMedicineCategories();
            const fromApi = Array.isArray(res.data) ? res.data : [];
            setCategoryOptions(fromApi.length > 0 ? fromApi : [...MEDICINE_CATEGORIES]);
        } catch {
            setCategoryOptions([...MEDICINE_CATEGORIES]);
        }
    };

    const unitOptions = useMemo(
        () => mergeUnitOptions(dbUnitOptions, formData.unit),
        [dbUnitOptions, formData.unit]
    );

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
        setFormData({ ...EMPTY_FORM, unit: 'Strip' });
        setImageUri(null);
        setIsEditing(false);
        setModalVisible(true);
    };

    const handleEdit = (item: any) => {
        const normalizedCategory = normalizeMedicineCategory(item.category);
        const normalizedUnit = normalizeMedicineUnit(item.unit);
        setFormData({
            name: item.name || '',
            category: normalizedCategory,
            price: String(Math.max(0, Math.round(Number(item.price) || 0))),
            stock: String(Math.max(0, Math.round(Number(item.stock) || 0))),
            unit: normalizedUnit,
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
        if (!formData.name.trim() || !formData.category || !formData.unit) {
            alert('Mohon isi nama obat, pilih kategori, dan pilih satuan');
            return;
        }

        const price = parseInt(formData.price, 10);
        const stock = parseInt(formData.stock, 10);

        if (!formData.price || Number.isNaN(price) || price < 0) {
            alert('Harga harus berupa angka bulat (integer)');
            return;
        }
        if (!formData.stock || Number.isNaN(stock) || stock < 0) {
            alert('Stok harus berupa angka bulat (integer)');
            return;
        }

        try {
            const data = new FormData();
            const payload: Record<string, string | number> = {
                name: formData.name.trim(),
                category: normalizeMedicineCategory(formData.category),
                unit: normalizeMedicineUnit(formData.unit),
                price,
                stock,
                prescription_required: 0,
                indication: formData.indication,
                usage_rules: formData.usage_rules,
                dosage: formData.dosage,
                side_effects: formData.side_effects,
                composition: formData.composition,
                usage_duration: formData.usage_duration,
            };

            Object.entries(payload).forEach(([key, value]) => {
                if (value !== null && value !== undefined && String(value).trim() !== '') {
                    data.append(key, String(value));
                }
            });

            if (formData.image_url.trim()) {
                data.append('image_url', formData.image_url.trim());
            }
            
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

    const handleDelete = (item: { id: number; name: string }) => {
        showAlert({
            type: 'confirm',
            title: 'Buang Obat?',
            message: `Obat "${item.name}" akan dihapus dari katalog dan tidak tampil lagi untuk admin, apoteker, maupun pasien.`,
            confirmText: 'Ya, Buang',
            cancelText: 'Batal',
            onConfirm: () => {
                (async () => {
                    try {
                        setDeletingId(item.id);
                        await axiosClient.delete(`/api/medicines/${item.id}`);
                        setMedicines((prev) => prev.filter((m) => m.id !== item.id));
                        setTimeout(() => {
                            showAlert({
                                type: 'success',
                                title: 'Obat Dibuang',
                                message: `"${item.name}" telah dihapus dari katalog aplikasi.`,
                                confirmText: 'Selesai',
                            });
                        }, 250);
                    } catch (error: any) {
                        setTimeout(() => {
                            showAlert({
                                type: 'error',
                                title: 'Gagal Membuang',
                                message: error.response?.data?.message || 'Obat tidak dapat dihapus. Silakan coba lagi.',
                                confirmText: 'Tutup',
                            });
                        }, 250);
                    } finally {
                        setDeletingId(null);
                    }
                })();
            },
        });
    };

    const { habis: habisCount, menipis: menipisCount, tersedia: tersediaCount } = getStockCounts(medicines);
    const stockAlertSummary = formatStockAlertSummary(habisCount, menipisCount);

    const filteredMedicines = Array.isArray(medicines) ? medicines.filter(m => {
        const matchesSearch = (m.name || '').toLowerCase().includes(searchQuery.toLowerCase());
        if (!matchesSearch) return false;
        return matchesStockFilter(m.stock, statusFilter);
    }) : [];

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

            <AppAlertModal
                visible={alertConfig.visible}
                type={alertConfig.type}
                title={alertConfig.title}
                message={alertConfig.message}
                confirmText={alertConfig.confirmText}
                cancelText={alertConfig.cancelText}
                onClose={closeAlert}
                onConfirm={alertConfig.onConfirm}
            />

            {/* Modal Form */}
            {modalVisible && (
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
                                    placeholder="Contoh: Anakonidin 60 ml"
                                    value={formData.name}
                                    onChangeText={(text) => setFormData({ ...formData, name: text })}
                                />
                                <Text style={styles.fieldHint}>
                                    Cantumkan ukuran di nama jika produk sama beda kemasan (mis. 60 ml, 120 ml, 360 gr)
                                </Text>

                                <OptionPicker
                                    label="Kategori"
                                    required
                                    options={categoryOptions}
                                    value={formData.category}
                                    onChange={(category) => setFormData({ ...formData, category })}
                                />

                                <OptionPicker
                                    label="Satuan"
                                    required
                                    options={unitOptions}
                                    value={formData.unit}
                                    onChange={(unit) => setFormData({ ...formData, unit })}
                                />
                                <Text style={styles.fieldHint}>
                                    Pilih satuan kemasan — ukuran/varian tulis di nama obat di atas
                                </Text>

                                <View style={styles.rowInputs}>
                                    <View style={{ flex: 1, marginRight: 10 }}>
                                        <Text style={styles.inputLabel}>Harga (Rp) *</Text>
                                        <TextInput 
                                            style={styles.input}
                                            placeholder="Contoh: 15000"
                                            keyboardType="number-pad"
                                            value={formData.price}
                                            onChangeText={(text) => setFormData({ ...formData, price: sanitizeIntegerInput(text) })}
                                        />
                                        <Text style={styles.fieldHint}>Angka bulat, tanpa desimal</Text>
                                    </View>
                                    <View style={{ flex: 1 }}>
                                        <Text style={styles.inputLabel}>Stok *</Text>
                                        <TextInput 
                                            style={styles.input}
                                            placeholder="Jumlah stok"
                                            keyboardType="number-pad"
                                            value={formData.stock}
                                            onChangeText={(text) => setFormData({ ...formData, stock: sanitizeIntegerInput(text) })}
                                        />
                                        <Text style={styles.fieldHint}>Jumlah unit (integer)</Text>
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
            )}

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
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 20 }}>
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

                {stockAlertSummary ? (
                    <View style={styles.alertBar}>
                        <Ionicons name="alert-circle" size={18} color="#FF5252" />
                        <Text style={styles.alertText}>{stockAlertSummary}</Text>
                    </View>
                ) : null}

                {/* Filter Status Bar */}
                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.filterBar}
                    style={{ marginBottom: 20 }}
                >
                    {[
                        { key: 'semua', label: 'Semua', count: medicines.length },
                        { key: 'habis', label: 'Habis', count: habisCount },
                        { key: 'menipis', label: 'Menipis', count: menipisCount },
                        { key: 'tersedia', label: 'Tersedia', count: tersediaCount },
                    ].map(tab => (
                        <TouchableOpacity
                            key={tab.key}
                            style={[
                                styles.filterTab,
                                statusFilter === tab.key && styles.filterTabActive
                            ]}
                            onPress={() => setStatusFilter(tab.key as any)}
                        >
                            <Text style={[
                                styles.filterTabText,
                                statusFilter === tab.key && styles.filterTabTextActive
                            ]}>
                                {tab.label} ({tab.count})
                            </Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>

                {/* Medicine List */}
                <View style={styles.listContainer}>
                    {loading ? (
                        <ActivityIndicator size="large" color="#2E8B57" style={{ marginTop: 20 }} />
                    ) : sortedFilteredMedicines.map((item) => (
                        <View key={item.id} style={[
                            styles.medCard,
                            isStockHabis(item.stock) && styles.outOfStockCardBorder,
                            isStockMenipis(item.stock) && styles.lowStockCardBorder,
                        ]}>
                            <View style={{ flexDirection: 'row', alignItems: 'center', width: '100%' }}>
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
                                            <Text style={styles.catText}>
                                                {normalizeMedicineCategory(item.category)}
                                            </Text>
                                        </View>
                                        {item.unit ? (
                                            <View style={styles.unitBadge}>
                                                <Text style={styles.unitText}>
                                                    {normalizeMedicineUnit(item.unit)}
                                                </Text>
                                            </View>
                                        ) : null}
                                    </View>
                                    <Text style={styles.medPrice}>
                                        Rp {item.price.toLocaleString('id-ID')} •{' '}
                                        <Text style={[
                                            styles.medStock,
                                            isStockHabis(item.stock) && styles.outOfStockTextCard,
                                            isStockMenipis(item.stock) && styles.lowStockTextCard,
                                        ]}>
                                            {isStockHabis(item.stock)
                                                ? 'Habis'
                                                : `Stok: ${normalizeStock(item.stock)}`}
                                        </Text>
                                    </Text>
                                </View>

                                <View style={styles.actionBtns}>
                                    <TouchableOpacity style={styles.actionBtn} onPress={() => handleEdit(item)}>
                                        <Feather name="edit-3" size={18} color="#999" />
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        style={[styles.actionBtn, styles.discardBtn]}
                                        onPress={() => handleDelete(item)}
                                        disabled={deletingId === item.id}
                                        accessibilityLabel="Buang obat"
                                    >
                                        {deletingId === item.id ? (
                                            <ActivityIndicator size="small" color="#FF5252" />
                                        ) : (
                                            <>
                                                <Feather name="trash-2" size={16} color="#FF5252" />
                                                <Text style={styles.discardBtnText}>Buang</Text>
                                            </>
                                        )}
                                    </TouchableOpacity>
                                </View>
                            </View>
                            
                            {isStockHabis(item.stock) ? (
                                <View style={styles.outOfStockBanner}>
                                    <Ionicons name="close-circle" size={14} color="#B71C1C" />
                                    <Text style={styles.outOfStockText}>Stok habis</Text>
                                </View>
                            ) : isStockMenipis(item.stock) ? (
                                <View style={styles.lowStockBanner}>
                                    <Ionicons name="alert-circle" size={14} color="#FF5252" />
                                    <Text style={styles.lowStockText}>Stok menipis! Segera restok.</Text>
                                </View>
                            ) : null}
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
    medCard: { backgroundColor: '#FFF', borderRadius: 16, padding: 12, flexDirection: 'column', alignItems: 'stretch', borderWidth: 1, borderColor: '#EEE' },
    medImageBg: { width: 70, height: 70, borderRadius: 12, backgroundColor: '#F5F5F5', justifyContent: 'center', alignItems: 'center', marginRight: 16 },
    medInfo: { flex: 1 },
    medName: { fontSize: 15, fontWeight: 'bold', color: '#333', marginBottom: 4 },
    badgeRow: { flexDirection: 'row', gap: 6, marginBottom: 8 },
    catBadge: { backgroundColor: '#F0F4F0', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 },
    catText: { fontSize: 10, color: '#2E8B57', fontWeight: 'bold' },
    unitBadge: { backgroundColor: '#E3F2FD', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 },
    unitText: { fontSize: 10, color: '#1976D2', fontWeight: 'bold' },
    medPrice: { fontSize: 13, color: '#2E8B57', fontWeight: 'bold' },
    medStock: { color: '#999', fontWeight: 'normal' },
    actionBtns: { flexDirection: 'row', gap: 10, marginLeft: 10, alignItems: 'center' },
    actionBtn: { width: 36, height: 36, borderRadius: 18, backgroundColor: '#F9F9F9', justifyContent: 'center', alignItems: 'center' },
    discardBtn: {
        width: 'auto',
        minWidth: 72,
        height: 36,
        flexDirection: 'row',
        gap: 4,
        paddingHorizontal: 10,
        backgroundColor: '#FFF5F5',
        borderWidth: 1,
        borderColor: '#FFCDD2',
    },
    discardBtnText: { fontSize: 11, fontWeight: '700', color: '#FF5252' },
    
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
    pickerBlock: { marginTop: 4 },
    optionGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
    optionPill: {
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: '#E8F5E9',
        backgroundColor: '#F8FBF8',
    },
    optionPillActive: {
        backgroundColor: '#2E8B57',
        borderColor: '#2E8B57',
    },
    optionPillText: { fontSize: 12, color: '#555', fontWeight: '600' },
    optionPillTextActive: { color: '#FFF' },
    pickerHint: { fontSize: 11, color: '#999', marginTop: 6, fontStyle: 'italic' },
    fieldHint: { fontSize: 11, color: '#999', marginTop: 4 },
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

    // Stock Filters & Warnings
    alertBar: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFF5F5',
        borderWidth: 1,
        borderColor: '#FFE0E0',
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: 12,
        marginBottom: 16,
    },
    alertText: { 
        color: '#FF5252', 
        fontSize: 13, 
        fontWeight: 'bold', 
        marginLeft: 8 
    },
    filterBar: {
        flexDirection: 'row',
        gap: 8,
    },
    filterTab: {
        backgroundColor: '#FFF',
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: '#EEE',
    },
    filterTabActive: {
        backgroundColor: '#2E8B57',
        borderColor: '#2E8B57',
    },
    filterTabText: {
        fontSize: 13,
        fontWeight: 'bold',
        color: '#555',
    },
    filterTabTextActive: {
        color: '#FFF',
    },
    outOfStockCardBorder: {
        borderColor: '#FFCDD2',
    },
    lowStockCardBorder: {
        borderColor: '#FFE0B2',
    },
    outOfStockTextCard: {
        color: '#B71C1C',
        fontWeight: 'bold',
    },
    lowStockTextCard: {
        color: '#F57C00',
        fontWeight: 'bold',
    },
    outOfStockBanner: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFEBEE',
        paddingVertical: 6,
        paddingHorizontal: 10,
        borderRadius: 8,
        marginTop: 10,
        gap: 6,
    },
    outOfStockText: {
        fontSize: 11,
        color: '#B71C1C',
        fontWeight: '600',
    },
    lowStockBanner: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFF5F5',
        paddingVertical: 6,
        paddingHorizontal: 10,
        borderRadius: 8,
        marginTop: 10,
        gap: 6,
    },
    lowStockText: {
        fontSize: 11,
        color: '#FF5252',
        fontWeight: '600',
    },
});
