import axiosClient from '@/api/axiosClient';
import AdminSidebar from '@/components/AdminSidebar';
import { AppAlertModal, AppAlertType } from '@/components/AppAlertModal';
import { storageUrl } from '@/constants/api';
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
    Modal
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';

const EDUCATION_CATEGORIES = [
    'Tips Kesehatan',
    'Nutrisi',
    'Info Penyakit',
    'Edukasi Obat',
    'Tips',
] as const;

function OptionPicker({
    label,
    options,
    value,
    onChange,
}: {
    label: string;
    options: readonly string[];
    value: string;
    onChange: (val: string) => void;
}) {
    return (
        <View style={styles.pickerBlock}>
            <Text style={styles.inputLabel}>{label}</Text>
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
        </View>
    );
}

function resolveEducationImageUri(imageUrl?: string | null): string | null {
    if (!imageUrl?.trim()) return null;
    const trimmed = imageUrl.trim();
    if (trimmed.startsWith('http://') || trimmed.startsWith('https://') || trimmed.startsWith('blob:') || trimmed.startsWith('file:')) {
        return trimmed;
    }
    return storageUrl(trimmed);
}

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

export default function ManageEducation() {
    const [searchQuery, setSearchQuery] = useState('');
    const [sidebarVisible, setSidebarVisible] = useState(false);
    const [articles, setArticles] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    
    // Modal State
    const [modalVisible, setModalVisible] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [currentId, setCurrentId] = useState<number | null>(null);
    
    // Form State
    const [formData, setFormData] = useState({
        title: '',
        category: 'Tips Kesehatan',
        content: '',
        author: 'Admin Apotek',
        image_url: '',
    });
    const [imageUri, setImageUri] = useState<string | null>(null);
    const [existingImagePath, setExistingImagePath] = useState<string | null>(null);
    const [alertConfig, setAlertConfig] = useState<AlertConfig>(DEFAULT_ALERT);

    const showAlert = (config: Omit<AlertConfig, 'visible'>) => {
        setAlertConfig({ ...config, visible: true });
    };

    const closeAlert = () => {
        setAlertConfig((prev) => ({ ...prev, visible: false, onConfirm: undefined }));
    };

    const formPreviewUri =
        imageUri ||
        (formData.image_url.trim() ? resolveEducationImageUri(formData.image_url) : null) ||
        (existingImagePath ? resolveEducationImageUri(existingImagePath) : null);

    useEffect(() => {
        fetchArticles();
    }, []);

    const fetchArticles = async () => {
        try {
            setLoading(true);
            const response = await axiosClient.get('/api/education');
            setArticles(response.data.data);
        } catch (error) {
            console.error('Error fetching articles:', error);
        } finally {
            setLoading(false);
        }
    };

    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [16, 9],
            quality: 1,
        });

        if (!result.canceled) {
            setImageUri(result.assets[0].uri);
            setExistingImagePath(null);
            setFormData({ ...formData, image_url: '' });
        }
    };

    const handleAdd = () => {
        setFormData({
            title: '',
            category: 'Tips Kesehatan',
            content: '',
            author: 'Admin Apotek',
            image_url: '',
        });
        setImageUri(null);
        setExistingImagePath(null);
        setIsEditing(false);
        setModalVisible(true);
    };

    const handleEdit = (item: any) => {
        const isExternalUrl = item.image_url?.startsWith('http');
        setFormData({
            title: item.title,
            category: item.category,
            content: item.content,
            author: item.author || 'Admin Apotek',
            image_url: isExternalUrl ? item.image_url : '',
        });
        setImageUri(null);
        setExistingImagePath(item.image_url && !isExternalUrl ? item.image_url : null);
        setCurrentId(item.id);
        setIsEditing(true);
        setModalVisible(true);
    };

    const handleSave = async () => {
        if (!formData.title || !formData.content) {
            showAlert({
                type: 'warning',
                title: 'Data Belum Lengkap',
                message: 'Judul dan konten artikel wajib diisi sebelum disimpan.',
                confirmText: 'Mengerti',
            });
            return;
        }

        try {
            let response;
            if (imageUri) {
                // Gunakan FormData jika ada upload file
                const data = new FormData();
                
                // Tambahkan field teks
                Object.keys(formData).forEach(key => {
                    const value = (formData as any)[key];
                    if (value !== null && value !== undefined && value !== '') {
                        data.append(key, value);
                    }
                });
                
                // Proses Gambar untuk Web vs Mobile
                if (Platform.OS === 'web') {
                    const response = await fetch(imageUri);
                    const blob = await response.blob();
                    const ext = blob.type === 'image/png' ? 'png' : blob.type === 'image/webp' ? 'webp' : 'jpg';
                    data.append('image', blob, `upload.${ext}`);
                } else {
                    // Di Mobile (Android/iOS)
                    const filename = imageUri.split('/').pop();
                    const match = /\.(\w+)$/.exec(filename || '');
                    const type = match ? `image/${match[1]}` : `image`;
                    // @ts-ignore
                    data.append('image', { uri: imageUri, name: filename, type });
                }

                if (isEditing && currentId) {
                    data.append('_method', 'PUT');
                    response = await axiosClient.post(`/api/education/${currentId}`, data, {
                        headers: { 'Content-Type': 'multipart/form-data' }
                    });
                } else {
                    response = await axiosClient.post('/api/education', data, {
                        headers: { 'Content-Type': 'multipart/form-data' }
                    });
                }
            } else {
                // Gunakan JSON biasa jika tidak ada file (hanya teks/link)
                if (isEditing && currentId) {
                    response = await axiosClient.put(`/api/education/${currentId}`, formData);
                } else {
                    response = await axiosClient.post('/api/education', formData);
                }
            }
            
            console.log('Save response:', response.data);
            setModalVisible(false);
            fetchArticles();
            showAlert(
                isEditing
                    ? {
                          type: 'success',
                          title: 'Berhasil Diperbarui!',
                          message: 'Perubahan artikel edukasi telah disimpan dan sudah tampil untuk pengguna.',
                          confirmText: 'Selesai',
                      }
                    : {
                          type: 'success',
                          title: 'Artikel Diterbitkan!',
                          message: 'Artikel edukasi baru berhasil ditambahkan dan siap dibaca pengguna.',
                          confirmText: 'Selesai',
                      },
            );
        } catch (error: any) {
            console.error('Full Error details:', error.response?.data || error.message);
            const errMsg = error.response?.data?.message || 'Gagal menyimpan artikel';
            showAlert({
                type: 'error',
                title: 'Gagal Menyimpan',
                message: errMsg,
                confirmText: 'Coba Lagi',
            });
        }
    };

    const handleDelete = (id: number) => {
        showAlert({
            type: 'confirm',
            title: 'Hapus Artikel?',
            message: 'Artikel yang dihapus tidak dapat dikembalikan. Lanjutkan?',
            confirmText: 'Ya, Hapus',
            cancelText: 'Batal',
            onConfirm: () => {
                (async () => {
                    try {
                        await axiosClient.delete(`/api/education/${id}`);
                        fetchArticles();
                        setTimeout(() => {
                            showAlert({
                                type: 'success',
                                title: 'Artikel Dihapus',
                                message: 'Artikel edukasi berhasil dihapus dari daftar.',
                                confirmText: 'Selesai',
                            });
                        }, 250);
                    } catch {
                        setTimeout(() => {
                            showAlert({
                                type: 'error',
                                title: 'Gagal Menghapus',
                                message: 'Artikel tidak dapat dihapus. Silakan coba lagi.',
                                confirmText: 'Tutup',
                            });
                        }, 250);
                    }
                })();
            },
        });
    };

    const filteredArticles = articles.filter(a => 
        a.title.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <SafeAreaView style={styles.container}>
            <Stack.Screen options={{ headerShown: false }} />

            <AdminSidebar 
                visible={sidebarVisible} 
                onClose={() => setSidebarVisible(false)} 
                activePage="education" 
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
                                <Text style={styles.modalTitle}>{isEditing ? 'Edit Artikel' : 'Tulis Edukasi Baru'}</Text>
                                <TouchableOpacity onPress={() => setModalVisible(false)}>
                                    <Ionicons name="close" size={24} color="#333" />
                                </TouchableOpacity>
                            </View>

                            <ScrollView showsVerticalScrollIndicator={false} style={styles.formScroll}>
                                <Text style={styles.inputLabel}>Judul Artikel *</Text>
                                <TextInput 
                                    style={styles.input}
                                    placeholder="Masukkan judul"
                                    value={formData.title}
                                    onChangeText={(text) => setFormData({...formData, title: text})}
                                />

                                <OptionPicker
                                    label="Kategori"
                                    options={EDUCATION_CATEGORIES}
                                    value={formData.category}
                                    onChange={(category) => setFormData({ ...formData, category })}
                                />

                                <Text style={styles.inputLabel}>Gambar Sampul</Text>
                                {formPreviewUri ? (
                                    <View style={styles.previewWrap}>
                                        <Image
                                            source={{ uri: formPreviewUri }}
                                            style={styles.previewImage}
                                            resizeMode="cover"
                                        />
                                        <TouchableOpacity
                                            style={styles.previewRemoveBtn}
                                            onPress={() => {
                                                setImageUri(null);
                                                setExistingImagePath(null);
                                                setFormData({ ...formData, image_url: '' });
                                            }}
                                        >
                                            <Ionicons name="close-circle" size={22} color="#FF5252" />
                                        </TouchableOpacity>
                                    </View>
                                ) : null}
                                <View style={{ flexDirection: 'row', gap: 10, alignItems: 'center' }}>
                                    <TouchableOpacity style={[styles.input, { flex: 1, justifyContent: 'center' }]} onPress={pickImage}>
                                        <Text style={{ color: imageUri ? '#2E8B57' : '#999' }}>
                                            {imageUri ? 'Ganti Gambar' : 'Pilih dari Galeri'}
                                        </Text>
                                    </TouchableOpacity>
                                    <Text>atau</Text>
                                    <TextInput 
                                        style={[styles.input, { flex: 1 }]}
                                        placeholder="Link URL"
                                        value={formData.image_url}
                                        onChangeText={(text) => {
                                            setFormData({...formData, image_url: text});
                                            setImageUri(null);
                                            setExistingImagePath(null);
                                        }}
                                    />
                                </View>

                                <Text style={styles.inputLabel}>Konten Artikel *</Text>
                                <TextInput 
                                    style={[styles.input, styles.textArea]}
                                    placeholder="Tulis isi edukasi di sini..."
                                    multiline
                                    numberOfLines={10}
                                    value={formData.content}
                                    onChangeText={(text) => setFormData({...formData, content: text})}
                                />

                                <Text style={styles.inputLabel}>Penulis</Text>
                                <TextInput 
                                    style={styles.input}
                                    placeholder="Nama penulis"
                                    value={formData.author}
                                    onChangeText={(text) => setFormData({...formData, author: text})}
                                />
                            </ScrollView>

                            <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
                                <Text style={styles.saveBtnText}>{isEditing ? 'Simpan Perubahan' : 'Terbitkan Sekarang'}</Text>
                            </TouchableOpacity>
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
                <View style={styles.headerRow}>
                    <View>
                        <Text style={styles.pageTitle}>Kelola Edukasi</Text>
                        <Text style={styles.pageSub}>{articles.length} artikel tersedia</Text>
                    </View>
                    <TouchableOpacity style={styles.addBtn} onPress={handleAdd}>
                        <Ionicons name="add" size={20} color="#FFF" />
                        <Text style={styles.addBtnText}>Baru</Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.searchContainer}>
                    <Ionicons name="search-outline" size={20} color="#999" style={styles.searchIcon} />
                    <TextInput 
                        style={styles.searchInput}
                        placeholder="Cari artikel..."
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                    />
                </View>

                <View style={styles.listContainer}>
                    {loading ? (
                        <ActivityIndicator size="large" color="#2E8B57" style={{ marginTop: 20 }} />
                    ) : filteredArticles.map((item) => {
                        const cardImageUri = resolveEducationImageUri(item.image_url);
                        return (
                        <View key={item.id} style={styles.articleCard}>
                            {cardImageUri ? (
                                <Image source={{ uri: cardImageUri }} style={styles.articleImg} resizeMode="cover" />
                            ) : (
                                <View style={[styles.articleImg, styles.articleImgPlaceholder]}>
                                    <Ionicons name="image-outline" size={24} color="#CCC" />
                                </View>
                            )}
                            <View style={styles.articleInfo}>
                                <Text style={styles.articleCat}>{item.category}</Text>
                                <Text style={styles.articleTitle} numberOfLines={2}>{item.title}</Text>
                                <Text style={styles.articleMeta}>Oleh: {item.author}</Text>
                            </View>
                            <View style={styles.actionBtns}>
                                <TouchableOpacity style={styles.actionBtn} onPress={() => handleEdit(item)}>
                                    <Feather name="edit-3" size={18} color="#2E8B57" />
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.actionBtn} onPress={() => handleDelete(item.id)}>
                                    <Feather name="trash-2" size={18} color="#FF5252" />
                                </TouchableOpacity>
                            </View>
                        </View>
                        );
                    })}
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
        backgroundColor: '#2E8B57' 
    },
    headerLeft: { flexDirection: 'row', alignItems: 'center', gap: 5 },
    menuIcon: { width: 40, height: 40, justifyContent: 'center', alignItems: 'center' },
    backRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
    backText: { color: '#FFF', fontSize: 14, fontWeight: '500' },
    scrollContent: { padding: 20 },
    headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 },
    pageTitle: { fontSize: 22, fontWeight: 'bold', color: '#333' },
    pageSub: { fontSize: 13, color: '#999' },
    addBtn: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#2E8B57', paddingHorizontal: 16, paddingVertical: 10, borderRadius: 10, gap: 6 },
    addBtnText: { color: '#FFF', fontSize: 14, fontWeight: 'bold' },
    searchContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFF', borderRadius: 12, paddingHorizontal: 16, height: 50, borderWidth: 1, borderColor: '#EEE', marginBottom: 24 },
    searchIcon: { marginRight: 12 },
    searchInput: { flex: 1, fontSize: 15, color: '#333' },
    listContainer: { gap: 16 },
    articleCard: { backgroundColor: '#FFF', borderRadius: 16, padding: 12, flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: '#EEE' },
    articleImg: { width: 60, height: 60, borderRadius: 10, backgroundColor: '#F5F5F5' },
    articleImgPlaceholder: { justifyContent: 'center', alignItems: 'center' },
    previewWrap: { position: 'relative', marginBottom: 12, borderRadius: 12, overflow: 'hidden' },
    previewImage: { width: '100%', height: 160, borderRadius: 12, backgroundColor: '#F5F5F5' },
    previewRemoveBtn: { position: 'absolute', top: 8, right: 8, backgroundColor: '#FFF', borderRadius: 12 },
    articleInfo: { flex: 1, marginLeft: 12 },
    articleCat: { fontSize: 10, color: '#2E8B57', fontWeight: 'bold', textTransform: 'uppercase', marginBottom: 2 },
    articleTitle: { fontSize: 14, fontWeight: 'bold', color: '#333', marginBottom: 4 },
    articleMeta: { fontSize: 11, color: '#999' },
    actionBtns: { flexDirection: 'row', gap: 8 },
    actionBtn: { width: 34, height: 34, borderRadius: 17, backgroundColor: '#F5F5F5', justifyContent: 'center', alignItems: 'center' },
    modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
    modalContent: { backgroundColor: '#FFF', borderTopLeftRadius: 30, borderTopRightRadius: 30, padding: 24, height: '85%' },
    modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
    modalTitle: { fontSize: 20, fontWeight: 'bold', color: '#333' },
    formScroll: { flex: 1 },
    inputLabel: { fontSize: 14, fontWeight: '600', color: '#555', marginBottom: 8, marginTop: 16 },
    input: { backgroundColor: '#F8FBF8', borderWidth: 1, borderColor: '#E8F5E9', borderRadius: 12, padding: 14, fontSize: 15, color: '#333' },
    textArea: { height: 120, textAlignVertical: 'top' },
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
    saveBtn: { backgroundColor: '#2E8B57', borderRadius: 14, padding: 16, alignItems: 'center', marginTop: 20 },
    saveBtnText: { color: '#FFF', fontSize: 16, fontWeight: 'bold' }
});
