import { Feather, Ionicons } from '@expo/vector-icons';
import { router, Stack } from 'expo-router';
import React, { useState } from 'react';
import { 
    SafeAreaView, 
    ScrollView, 
    StyleSheet, 
    Text, 
    TouchableOpacity, 
    View,
    Platform,
    Alert
} from 'react-native';

export default function UploadResepScreen() {
    const handleUpload = () => {
        Alert.alert('Upload Berhasil', 'Resep Anda telah terkirim ke sistem kami. Apoteker akan segera memverifikasi dan menghubungi Anda.');
        router.back();
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
                
                {/* Info Card */}
                <View style={styles.infoBanner}>
                    <View style={styles.infoTextWrapper}>
                        <Text style={styles.infoTitle}>Beli Obat Jadi Lebih Mudah!</Text>
                        <Text style={styles.infoSub}>Punya resep dokter? Upload di sini dan kami akan menyiapkan obatnya untuk Anda.</Text>
                    </View>
                    <Ionicons name="document-text-outline" size={50} color="#FFF" style={styles.infoIcon} />
                </View>

                {/* Upload Area */}
                <TouchableOpacity style={styles.uploadArea}>
                    <View style={styles.uploadCircle}>
                        <Feather name="camera" size={30} color="#2E8B57" />
                    </View>
                    <Text style={styles.uploadTitle}>Ambil Foto Resep</Text>
                    <Text style={styles.uploadSub}>Atau pilih dari galeri ponsel Anda</Text>
                </TouchableOpacity>

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
                    <View style={styles.guideItem}>
                        <View style={styles.numCircle}><Text style={styles.numText}>3</Text></View>
                        <Text style={styles.guideText}>Resep asli wajib dibawa saat pengambilan obat.</Text>
                    </View>
                </View>

                {/* Submit Button */}
                <TouchableOpacity style={styles.submitBtn} onPress={handleUpload}>
                    <Text style={styles.submitBtnText}>Kirim Resep Sekarang</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.cancelBtn} onPress={() => router.back()}>
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
    uploadArea: { backgroundColor: '#FFF', borderRadius: 24, padding: 40, alignItems: 'center', borderStyle: 'dashed', borderWidth: 2, borderColor: '#2E8B57', marginBottom: 24, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.05, shadowRadius: 10, elevation: 2 },
    uploadCircle: { width: 70, height: 70, borderRadius: 35, backgroundColor: '#E8F5E9', justifyContent: 'center', alignItems: 'center', marginBottom: 16 },
    uploadTitle: { fontSize: 16, fontWeight: 'bold', color: '#333', marginBottom: 4 },
    uploadSub: { fontSize: 13, color: '#888' },
    guideSection: { marginBottom: 30, backgroundColor: '#FFF', padding: 20, borderRadius: 20, borderWidth: 1, borderColor: '#EEE' },
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