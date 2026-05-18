import axiosClient from '@/api/axiosClient';
import { Feather, Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { router, Stack } from 'expo-router';
import React, { useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    Image,
    Platform,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';

export default function UploadResepScreen() {
    const [image, setImage] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const pickImage = async () => {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
            alert('Maaf, kami butuh izin galeri untuk mengunggah resep.');
            return;
        }

        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            quality: 1,
        });

        if (!result.canceled) {
            setImage(result.assets[0].uri);
        }
    };

    const takePhoto = async () => {
        const { status } = await ImagePicker.requestCameraPermissionsAsync();
        if (status !== 'granted') {
            alert('Maaf, kami butuh izin kamera untuk mengambil foto resep.');
            return;
        }

        let result = await ImagePicker.launchCameraAsync({
            allowsEditing: true,
            quality: 1,
        });

        if (!result.canceled) {
            setImage(result.assets[0].uri);
        }
    };

    const handleUpload = async () => {
        if (!image) {
            Alert.alert('Peringatan', 'Silakan pilih atau ambil foto resep terlebih dahulu.');
            return;
        }

        try {
            setLoading(true);
            const formData = new FormData();

            if (Platform.OS === 'web') {
                const response = await fetch(image);
                const blob = await response.blob();
                
                // Get original file type from blob
                const fileType = blob.type || 'image/jpeg';
                const extension = fileType.split('/')[1] || 'jpg';
                
                formData.append('image', blob, `prescription.${extension}`);
            } else {
                const uriParts = image.split('.');
                const fileType = uriParts[uriParts.length - 1];
                formData.append('image', {
                    uri: image,
                    name: `prescription.${fileType}`,
                    type: `image/${fileType}`,
                } as any);
            }

            console.log('Attempting upload to:', axiosClient.defaults.baseURL + '/api/prescriptions');

            const uploadResponse = await axiosClient.post('/api/prescriptions', formData, {
                headers: { 
                    'Content-Type': 'multipart/form-data',
                    'Accept': 'application/json'
                }
            });

            console.log('Server Response:', uploadResponse.data);

            Alert.alert(
                'Berhasil!', 
                'Resep Anda telah terkirim. Apoteker akan segera memverifikasi resep Anda.',
                [
                    { 
                        text: 'Lihat Riwayat', 
                        onPress: () => router.replace('/(tabs)/pesanan') 
                    },
                    { 
                        text: 'OK', 
                        onPress: () => router.replace('/(tabs)') 
                    }
                ]
            );
        } catch (error) {
            console.error('Upload error:', error);
            Alert.alert('Gagal', 'Terjadi kesalahan saat mengunggah resep. Silakan coba lagi.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <Stack.Screen options={{ headerShown: false }} />

            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
                    <Ionicons name="chevron-back" size={24} color="#333" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Upload Resep</Text>
                <View style={{ width: 40 }} />
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

                <View style={styles.infoBanner}>
                    <View style={styles.infoTextWrapper}>
                        <Text style={styles.infoTitle}>Beli Obat Jadi Lebih Mudah!</Text>
                        <Text style={styles.infoSub}>Punya resep dokter? Upload di sini dan kami akan menyiapkan obatnya untuk Anda.</Text>
                    </View>
                    <Ionicons name="document-text-outline" size={50} color="#FFF" style={styles.infoIcon} />
                </View>

                {/* Upload Area */}
                <TouchableOpacity style={styles.uploadArea} onPress={() => {
                    Alert.alert(
                        'Pilih Sumber',
                        'Ambil foto resep atau pilih dari galeri?',
                        [
                            { text: 'Kamera', onPress: takePhoto },
                            { text: 'Galeri', onPress: pickImage },
                            { text: 'Batal', style: 'cancel' }
                        ]
                    );
                }}>
                    {image ? (
                        <Image source={{ uri: image }} style={styles.previewImg} />
                    ) : (
                        <>
                            <View style={styles.uploadCircle}>
                                <Feather name="camera" size={30} color="#2E8B57" />
                            </View>
                            <Text style={styles.uploadTitle}>Ambil Foto Resep</Text>
                            <Text style={styles.uploadSub}>Klik di sini untuk memilih gambar</Text>
                        </>
                    )}
                </TouchableOpacity>

                {image && (
                    <TouchableOpacity style={styles.changeBtn} onPress={() => setImage(null)}>
                        <Text style={styles.changeBtnText}>Hapus & Pilih Ulang</Text>
                    </TouchableOpacity>
                )}

                {/* Guidelines */}
                <View style={styles.guideSection}>
                    <Text style={styles.guideTitle}>Panduan Upload Resep:</Text>
                    <View style={styles.guideItem}>
                        <View style={styles.numCircle}><Text style={styles.numText}>1</Text></View>
                        <Text style={styles.guideText}>Pastikan seluruh bagian resep terlihat jelas.</Text>
                    </View>
                    <View style={styles.guideItem}>
                        <View style={styles.numCircle}><Text style={styles.numText}>2</Text></View>
                        <Text style={styles.guideText}>Nama dokter dan tanggal resep terbaca.</Text>
                    </View>
                </View>

                {/* Submit Button */}
                <TouchableOpacity
                    style={[styles.submitBtn, loading && { opacity: 0.7 }]}
                    onPress={handleUpload}
                    disabled={loading}
                >
                    {loading ? (
                        <ActivityIndicator color="#FFF" />
                    ) : (
                        <Text style={styles.submitBtnText}>Kirim Resep Sekarang</Text>
                    )}
                </TouchableOpacity>

                <TouchableOpacity style={styles.cancelBtn} onPress={() => router.back()} disabled={loading}>
                    <Text style={styles.cancelBtnText}>Batal</Text>
                </TouchableOpacity>

            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F8FBF8' },
    header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingTop: Platform.OS === 'ios' ? 0 : 40, paddingBottom: 16, backgroundColor: '#FFF', borderBottomWidth: 1, borderBottomColor: '#EEE' },
    backBtn: { width: 40, height: 40, justifyContent: 'center' },
    headerTitle: { fontSize: 18, fontWeight: 'bold', color: '#333' },
    scrollContent: { padding: 20 },
    infoBanner: { backgroundColor: '#2E8B57', borderRadius: 20, padding: 20, flexDirection: 'row', alignItems: 'center', marginBottom: 24, overflow: 'hidden' },
    infoIcon: { opacity: 0.3, position: 'absolute', right: -5, bottom: -5 },
    infoTextWrapper: { flex: 1, marginRight: 10 },
    infoTitle: { color: '#FFF', fontSize: 18, fontWeight: 'bold', marginBottom: 6 },
    infoSub: { color: 'rgba(255,255,255,0.8)', fontSize: 12, lineHeight: 18 },
    uploadArea: { backgroundColor: '#FFF', borderRadius: 24, padding: 20, alignItems: 'center', borderStyle: 'dashed', borderWidth: 2, borderColor: '#2E8B57', marginBottom: 12, minHeight: 200, justifyContent: 'center', overflow: 'hidden' },
    previewImg: { width: '100%', height: 250, borderRadius: 15 },
    uploadCircle: { width: 70, height: 70, borderRadius: 35, backgroundColor: '#E8F5E9', justifyContent: 'center', alignItems: 'center', marginBottom: 16 },
    uploadTitle: { fontSize: 16, fontWeight: 'bold', color: '#333', marginBottom: 4 },
    uploadSub: { fontSize: 13, color: '#888' },
    changeBtn: { alignSelf: 'center', marginBottom: 20 },
    changeBtnText: { color: '#FF5252', fontWeight: 'bold', fontSize: 13 },
    guideSection: { marginBottom: 30, backgroundColor: '#FFF', padding: 20, borderRadius: 20, borderColor: '#EEE', borderWidth: 1 },
    guideTitle: { fontSize: 15, fontWeight: 'bold', color: '#333', marginBottom: 16 },
    guideItem: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
    numCircle: { width: 22, height: 22, borderRadius: 11, backgroundColor: '#2E8B57', justifyContent: 'center', alignItems: 'center', marginRight: 12 },
    numText: { color: '#FFF', fontSize: 11, fontWeight: 'bold' },
    guideText: { fontSize: 13, color: '#555', flex: 1 },
    submitBtn: { backgroundColor: '#2E8B57', paddingVertical: 16, borderRadius: 12, alignItems: 'center', marginBottom: 12 },
    submitBtnText: { color: '#FFF', fontSize: 16, fontWeight: 'bold' },
    cancelBtn: { paddingVertical: 12, alignItems: 'center' },
    cancelBtnText: { color: '#999', fontSize: 14, fontWeight: '500' }
});