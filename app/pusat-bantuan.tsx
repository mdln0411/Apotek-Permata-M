import { Ionicons } from '@expo/vector-icons';
import { router, Stack } from 'expo-router';
import React, { useState } from 'react';
import {
    Platform,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';

interface FAQItem {
    question: string;
    answer: string;
}

const faqs: FAQItem[] = [
    {
        question: "Bagaimana cara masuk (login) ke aplikasi?",
        answer: "Buka aplikasi, klik menu 'Profil' atau tombol 'Masuk' di halaman utama. Masukkan email dan kata sandi yang telah Anda daftarkan, lalu klik tombol 'Login'."
    },
    {
        question: "Bagaimana jika saya lupa kata sandi?",
        answer: "Klik 'Lupa Password' pada halaman login. Masukkan email Anda, dan kami akan mengirimkan instruksi untuk mengatur ulang kata sandi Anda."
    },
    {
        question: "Bagaimana cara membuat akun baru?",
        answer: "Pilih 'Daftar Sekarang' di bawah tombol login. Isi nama lengkap, email, nomor telepon, dan buat kata sandi untuk akun Anda."
    },
    {
        question: "Apakah saya perlu login untuk melihat produk?",
        answer: "Tidak, Anda dapat menjelajahi Katalog Obat tanpa login. Namun, Anda harus masuk ke akun untuk dapat melakukan pemesanan (checkout)."
    },
    {
        question: "Bagaimana cara memesan obat di Apotek Permata?",
        answer: "Pilih produk yang Anda butuhkan di Katalog Obat, masukkan ke keranjang, lalu lakukan checkout dengan mengisi alamat pengiriman dan pilih metode pembayaran."
    },
    {
        question: "Apakah saya bisa memesan obat dengan resep dokter?",
        answer: "Ya, Anda bisa menggunakan fitur 'Upload Resep' di halaman utama. Apoteker kami akan memverifikasi resep Anda sebelum pesanan diproses."
    },
    {
        question: "Berapa lama waktu pengiriman pesanan?",
        answer: "Pengiriman reguler memakan waktu 1-3 hari kerja. Untuk pengiriman instan (jika tersedia), estimasi waktu adalah 1-3 jam setelah verifikasi pembayaran."
    },
    {
        question: "Bagaimana cara membatalkan pesanan?",
        answer: "Pembatalan hanya dapat dilakukan selama status pesanan masih 'Menunggu Pembayaran' atau 'Menunggu Verifikasi'. Jika sudah diproses apoteker, pesanan tidak dapat dibatalkan."
    },
    {
        question: "Apa yang harus dilakukan jika obat tidak sesuai?",
        answer: "Segera hubungi layanan pelanggan kami melalui fitur Chat dengan melampirkan foto label kemasan dan nota pembelian untuk proses retur atau penukaran."
    },
    {
        question: "Apakah data medis saya aman di aplikasi ini?",
        answer: "Keamanan data Anda adalah prioritas kami. Semua riwayat medis dan informasi profil dienkripsi dan hanya digunakan untuk keperluan layanan kesehatan Anda."
    }
];

export default function PusatBantuanScreen() {
    const [searchQuery, setSearchQuery] = useState('');
    const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

    const filteredFaqs = faqs.filter(faq => 
        faq.question.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const toggleExpand = (index: number) => {
        setExpandedIndex(expandedIndex === index ? null : index);
    };

    return (
        <SafeAreaView style={styles.container}>
            <Stack.Screen options={{ headerShown: false }} />
            
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
                    <Ionicons name="chevron-back" size={24} color="#333" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Butuh Bantuan?</Text>
                <View style={{ width: 40 }} />
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent}>
                <View style={styles.heroSection}>
                    <Text style={styles.heroTitle}>Halo, ada yang bisa kami bantu?</Text>
                    <View style={styles.searchContainer}>
                        <Ionicons name="search" size={20} color="#999" />
                        <TextInput 
                            style={[styles.searchInput, Platform.OS === 'web' && { outlineStyle: 'none' } as any]}
                            placeholder="Cari pertanyaan..."
                            value={searchQuery}
                            onChangeText={setSearchQuery}
                        />
                    </View>
                </View>

                {/* FAQ Section */}
                <View style={styles.faqSection}>
                    <Text style={styles.sectionTitle}>Pertanyaan Populer (FAQ)</Text>
                    {filteredFaqs.map((faq, index) => (
                        <TouchableOpacity 
                            key={index} 
                            style={styles.faqCard}
                            onPress={() => toggleExpand(index)}
                            activeOpacity={0.7}
                        >
                            <View style={styles.faqHeader}>
                                <Text style={styles.faqQuestion}>{faq.question}</Text>
                                <Ionicons 
                                    name={expandedIndex === index ? "chevron-up" : "chevron-down"} 
                                    size={20} 
                                    color="#2E8B57" 
                                />
                            </View>
                            {expandedIndex === index && (
                                <View style={styles.faqAnswerContainer}>
                                    <Text style={styles.faqAnswer}>{faq.answer}</Text>
                                </View>
                            )}
                        </TouchableOpacity>
                    ))}
                </View>

                {/* Contact Support Section */}
                <View style={styles.supportSection}>
                    <Text style={styles.sectionTitle}>Hubungi Kami</Text>
                    <View style={styles.supportCards}>
                        <TouchableOpacity style={styles.supportCard} onPress={() => router.push('/asisten-virtual')}>
                            <View style={[styles.supportIconBg, { backgroundColor: '#E8F5E9' }]}>
                                <Ionicons name="chatbubble-ellipses" size={24} color="#2E8B57" />
                            </View>
                            <Text style={styles.supportLabel}>Virtual Assistant</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.supportCard} onPress={() => router.push('/konsultasi')}>
                            <View style={[styles.supportIconBg, { backgroundColor: '#E3F2FD' }]}>
                                <Ionicons name="medical" size={24} color="#2196F3" />
                            </View>
                            <Text style={styles.supportLabel}>Konsultasi Ahli</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#FFF' },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingVertical: 12,
        paddingTop: Platform.OS === 'ios' ? 10 : 40,
        backgroundColor: '#FFF',
        borderBottomWidth: 1,
        borderBottomColor: '#F0F0F0',
    },
    backBtn: { padding: 4 },
    headerTitle: { fontSize: 18, fontWeight: 'bold', color: '#333' },
    scrollContent: { paddingBottom: 40 },
    heroSection: {
        backgroundColor: '#2E8B57',
        padding: 24,
        paddingBottom: 40,
    },
    heroTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#FFF',
        marginBottom: 20,
        textAlign: 'center',
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFF',
        borderRadius: 12,
        paddingHorizontal: 15,
        height: 50,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    searchInput: {
        flex: 1,
        marginLeft: 10,
        fontSize: 16,
    },
    faqSection: {
        marginTop: -20,
        paddingHorizontal: 20,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 16,
        marginTop: 24,
    },
    faqCard: {
        backgroundColor: '#FFF',
        borderRadius: 12,
        padding: 16,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: '#F0F0F0',
        elevation: 1,
    },
    faqHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    faqQuestion: {
        fontSize: 15,
        fontWeight: '600',
        color: '#444',
        flex: 1,
        marginRight: 15,
    },
    faqAnswerContainer: {
        marginTop: 12,
        paddingTop: 12,
        borderTopWidth: 1,
        borderTopColor: '#F5F5F5',
    },
    faqAnswer: {
        fontSize: 14,
        color: '#666',
        lineHeight: 20,
    },
    supportSection: {
        paddingHorizontal: 20,
        marginTop: 10,
    },
    supportCards: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    supportCard: {
        flex: 1,
        alignItems: 'center',
        backgroundColor: '#FFF',
        borderRadius: 16,
        padding: 16,
        marginHorizontal: 4,
        borderWidth: 1,
        borderColor: '#F0F0F0',
    },
    supportIconBg: {
        width: 48,
        height: 48,
        borderRadius: 24,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 8,
    },
    supportLabel: {
        fontSize: 11,
        fontWeight: 'bold',
        color: '#555',
        textAlign: 'center',
    },
});
