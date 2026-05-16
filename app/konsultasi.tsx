import axiosClient from '@/api/axiosClient';
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
    ActivityIndicator,
    Alert
} from 'react-native';

export default function KonsultasiScreen() {
    const [loading, setLoading] = useState(false);

    const startConsultation = async () => {
        try {
            setLoading(true);
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
            setLoading(false);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <Stack.Screen options={{ headerShown: false }} />

            {/* Header Modern */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
                    <Ionicons name="chevron-back" size={24} color="#333" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Konsultasi Online</Text>
                <View style={{ width: 40 }} />
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                
                <Text style={styles.sectionTitle}>Pilih Metode Konsultasi</Text>

                {/* Opsi 1: Asisten Virtual (AI) */}
                <TouchableOpacity 
                    style={styles.aiCard} 
                    onPress={() => alert('Fitur AI sedang dalam pemeliharaan. Silakan hubungi Apoteker kami.')}
                >
                    <View style={styles.aiIconWrapper}>
                        <Ionicons name="sparkles" size={30} color="#FFF" />
                    </View>
                    <View style={styles.cardInfo}>
                        <View style={styles.badgeAi}>
                            <Text style={styles.badgeAiText}>24/7 ONLINE</Text>
                        </View>
                        <Text style={styles.cardTitle}>Asisten Virtual (AI)</Text>
                        <Text style={styles.cardSub}>Jawaban instan untuk pertanyaan umum seputar dosis & jenis obat.</Text>
                    </View>
                    <Feather name="chevron-right" size={20} color="#2E8B57" />
                </TouchableOpacity>

                <View style={styles.dividerLabel}>
                    <View style={styles.line} />
                    <Text style={styles.lineText}>ATAU</Text>
                    <View style={styles.line} />
                </View>

                {/* Opsi 2: Apoteker Bertugas (Manusia) */}
                <Text style={styles.sectionTitleSmall}>Apoteker Bertugas</Text>
                
                <TouchableOpacity 
                    style={styles.aptCard}
                    onPress={startConsultation}
                    disabled={loading}
                >
                    <View style={styles.avatarWrapper}>
                        <View style={styles.avatar}>
                            <Ionicons name="person" size={32} color="#2E8B57" />
                        </View>
                        <View style={styles.onlineDot} />
                    </View>
                    <View style={styles.cardInfo}>
                        <Text style={styles.aptName}>Apoteker Permata</Text>
                        <Text style={styles.aptSpecialized}>Obat Umum & Penyakit Dalam</Text>
                        <View style={styles.metaRow}>
                            <Ionicons name="star" size={14} color="#FFB300" />
                            <Text style={styles.metaText}>5.0 (1000+ Konsultasi)</Text>
                        </View>
                    </View>
                    <View style={styles.chatAction}>
                        {loading ? (
                            <ActivityIndicator color="#2E8B57" />
                        ) : (
                            <>
                                <Ionicons name="chatbubble-ellipses" size={24} color="#2E8B57" />
                                <Text style={styles.chatActionText}>Hubungi</Text>
                            </>
                        )}
                    </View>
                </TouchableOpacity>

                {/* Info Penting */}
                <View style={styles.infoBox}>
                    <Ionicons name="information-circle-outline" size={20} color="#1976D2" />
                    <Text style={styles.infoBoxText}>
                        Konsultasi dengan apoteker kami bersifat rahasia dan aman. Jangan ragu untuk menanyakan dosis atau efek samping obat.
                    </Text>
                </View>

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
    sectionTitle: { fontSize: 18, fontWeight: 'bold', color: '#333', marginBottom: 20 },
    sectionTitleSmall: { fontSize: 15, fontWeight: 'bold', color: '#777', marginBottom: 12 },
    aiCard: { backgroundColor: '#E8F5E9', borderRadius: 24, padding: 20, flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: '#C8E6C9', marginBottom: 20 },
    aiIconWrapper: { width: 60, height: 60, borderRadius: 20, backgroundColor: '#2E8B57', justifyContent: 'center', alignItems: 'center', shadowColor: '#2E8B57', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8, elevation: 5 },
    cardInfo: { flex: 1, marginLeft: 16 },
    badgeAi: { backgroundColor: 'rgba(46, 139, 87, 0.1)', alignSelf: 'flex-start', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 6, marginBottom: 6 },
    badgeAiText: { fontSize: 10, fontWeight: 'bold', color: '#2E8B57' },
    cardTitle: { fontSize: 16, fontWeight: 'bold', color: '#333', marginBottom: 4 },
    cardSub: { fontSize: 12, color: '#666', lineHeight: 18 },
    dividerLabel: { flexDirection: 'row', alignItems: 'center', marginVertical: 20, gap: 10 },
    line: { flex: 1, height: 1, backgroundColor: '#EEE' },
    lineText: { fontSize: 11, fontWeight: 'bold', color: '#BBB' },
    aptCard: { backgroundColor: '#FFF', borderRadius: 24, padding: 16, flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: '#EEE', elevation: 4, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.05, shadowRadius: 10 },
    avatarWrapper: { position: 'relative' },
    avatar: { width: 64, height: 64, borderRadius: 32, backgroundColor: '#F0F4F0', justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: '#E8F5E9' },
    onlineDot: { position: 'absolute', bottom: 4, right: 4, width: 14, height: 14, borderRadius: 7, backgroundColor: '#4CAF50', borderWidth: 2, borderColor: '#FFF' },
    aptName: { fontSize: 15, fontWeight: 'bold', color: '#333', marginBottom: 2 },
    aptSpecialized: { fontSize: 12, color: '#777', marginBottom: 6 },
    metaRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
    metaText: { fontSize: 11, color: '#555', fontWeight: '500' },
    chatAction: { alignItems: 'center', justifyContent: 'center', borderLeftWidth: 1, borderLeftColor: '#F0F0F0', paddingLeft: 16, marginLeft: 10, minWidth: 60 },
    chatActionText: { fontSize: 11, fontWeight: 'bold', color: '#2E8B57', marginTop: 4 },
    infoBox: { backgroundColor: '#E3F2FD', borderRadius: 16, padding: 16, flexDirection: 'row', gap: 12, marginTop: 30 },
    infoBoxText: { flex: 1, fontSize: 12, color: '#1976D2', lineHeight: 18 }
});