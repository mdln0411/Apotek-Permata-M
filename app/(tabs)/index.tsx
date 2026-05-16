import axiosClient from '@/api/axiosClient';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';
import { Feather, Ionicons } from '@expo/vector-icons';
import { router, Stack } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { 
    Image, 
    SafeAreaView, 
    ScrollView, 
    StyleSheet, 
    Text, 
    TouchableOpacity, 
    View,
    Dimensions,
    Platform
} from 'react-native';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export default function HomeScreen() {
    const { user } = useAuth();
    const { itemCount } = useCart();
    const [medicines, setMedicines] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchMedicines();
    }, []);

    const fetchMedicines = async () => {
        try {
            const response = await axiosClient.get('/api/medicines');
            // Ambil 4 obat saja untuk rekomendasi di home
            if (response.data && response.data.data) {
                setMedicines(response.data.data);
            }
        } catch (error) {
            console.error('Error fetching medicines:', error);
        } finally {
            setLoading(false);
        }
    };

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
        }).format(price);
    };

    const menuIcons = [
        { id: '1', name: 'Konsultasi', icon: 'message-circle', color: '#E3F2FD', iconColor: '#1976D2', route: '/konsultasi' },
        { id: '2', name: 'Resep Obat', icon: 'file-text', color: '#FFF3E0', iconColor: '#F57C00', route: '/upload-resep' },
        { id: '3', name: 'Pengingat', icon: 'bell', color: '#F3E5F5', iconColor: '#7B1FA2', route: '/pengingat' },
        { id: '4', name: 'Alergi Saya', icon: 'shield', color: '#E8F5E9', iconColor: '#2E8B57', route: '/alergi-obat' },
    ];

    return (
        <SafeAreaView style={styles.container}>
            <Stack.Screen options={{ headerShown: false }} />

            {/* Header Modern */}
            <View style={styles.header}>
                <View style={styles.headerTop}>
                    <View>
                        <Text style={styles.greetingText}>Selamat Datang,</Text>
                        <Text style={styles.userName}>{user ? user.name : 'Tamu'}</Text>
                    </View>
                    <TouchableOpacity style={styles.cartBtn} onPress={() => router.push('/keranjang' as any)}>
                        <Feather name="shopping-cart" size={22} color="#FFF" />
                        {itemCount > 0 && (
                            <View style={styles.badge}>
                                <Text style={styles.badgeText}>{itemCount}</Text>
                            </View>
                        )}
                    </TouchableOpacity>
                </View>

                {/* Saldo/Poin Card */}
                <View style={styles.balanceCard}>
                    <View style={styles.balanceInfo}>
                        <Text style={styles.balanceLabel}>Poin Permata</Text>
                        <Text style={styles.balanceValue}>1.250 Poin</Text>
                    </View>
                    <View style={styles.dividerVertical} />
                    <TouchableOpacity style={styles.promoBtn}>
                        <Ionicons name="gift-outline" size={20} color="#2E8B57" />
                        <Text style={styles.promoText}>Cek Promo</Text>
                    </TouchableOpacity>
                </View>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
                
                {/* Menu Cepat */}
                <View style={styles.menuGrid}>
                    {menuIcons.map((menu) => (
                        <TouchableOpacity key={menu.id} style={styles.menuItem} onPress={() => router.push(menu.route as any)}>
                            <View style={[styles.menuIconWrapper, { backgroundColor: menu.color }]}>
                                <Feather name={menu.icon as any} size={24} color={menu.iconColor} />
                            </View>
                            <Text style={styles.menuLabel}>{menu.name}</Text>
                        </TouchableOpacity>
                    ))}
                </View>

                {/* Banner Promo */}
                <ScrollView horizontal showsHorizontalScrollIndicator={false} pagingEnabled style={styles.bannerContainer}>
                    <View style={[styles.banner, { backgroundColor: '#2E8B57' }]}>
                        <View style={styles.bannerContent}>
                            <Text style={styles.bannerTitle}>Gratis Ongkir!</Text>
                            <Text style={styles.bannerSub}>Khusus wilayah Tanjung Morawa dengan min. belanja Rp 50rb.</Text>
                        </View>
                        <Ionicons name="bicycle" size={60} color="rgba(255,255,255,0.2)" style={styles.bannerIcon} />
                    </View>
                </ScrollView>

                {/* Rekomendasi Obat (Requirement No. 6) */}
                <View style={styles.sectionHeader}>
                    <Text style={styles.sectionTitle}>Rekomendasi Untuk Anda</Text>
                    <TouchableOpacity onPress={() => router.push('/(tabs)/katalog-obat' as any)}>
                        <Text style={styles.seeAll}>Lihat Semua</Text>
                    </TouchableOpacity>
                </View>

                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.rekContainer}>
                    {medicines.slice(0, 4).map((item) => (
                        <TouchableOpacity 
                            key={item.id} 
                            style={styles.rekCard}
                            onPress={() => router.push({ pathname: '/detail-obat', params: { id: item.id } } as any)}
                        >
                            <View style={styles.rekImageBg}>
                                {item.image_url ? (
                                    <Image 
                                        source={{ 
                                            uri: item.image_url.startsWith('http') 
                                                ? item.image_url 
                                                : `http://10.0.2.2:8000/storage/${item.image_url}` 
                                        }} 
                                        style={styles.rekImage} 
                                    />
                                ) : (
                                    <Ionicons name="medical-outline" size={40} color="#2E8B57" />
                                )}
                            </View>
                            <Text style={styles.rekName} numberOfLines={1}>{item.name}</Text>
                            <Text style={styles.rekPrice}>{formatPrice(item.price)}</Text>
                        </TouchableOpacity>
                    ))}
                    {loading && <Text style={{ padding: 20, color: '#999' }}>Memuat rekomendasi...</Text>}
                </ScrollView>

                {/* Produk Terpopuler (Obat Favorit) */}
                <View style={styles.sectionHeader}>
                    <Text style={styles.sectionTitle}>Produk Terpopuler</Text>
                </View>

                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.rekContainer}>
                    {medicines.slice(4, 8).map((item) => (
                        <TouchableOpacity 
                            key={item.id} 
                            style={[styles.rekCard, { borderColor: '#A5D6A7' }]}
                            onPress={() => router.push({ pathname: '/detail-obat', params: { id: item.id } } as any)}
                        >
                            <View style={styles.rekImageBg}>
                                {item.image_url ? (
                                    <Image 
                                        source={{ 
                                            uri: item.image_url.startsWith('http') 
                                                ? item.image_url 
                                                : `http://10.0.2.2:8000/storage/${item.image_url}` 
                                        }} 
                                        style={styles.rekImage} 
                                    />
                                ) : (
                                    <Ionicons name="star" size={40} color="#FFB300" />
                                )}
                            </View>
                            <Text style={styles.rekName} numberOfLines={1}>{item.name}</Text>
                            <Text style={styles.rekPrice}>{formatPrice(item.price)}</Text>
                        </TouchableOpacity>
                    ))}
                    {medicines.length <= 4 && !loading && (
                        <Text style={{ padding: 20, color: '#CCC', fontSize: 12 }}>Belum ada data obat favorit lainnya.</Text>
                    )}
                </ScrollView>

                {/* Edukasi Kesehatan (Requirement No. 10) */}
                <View style={styles.sectionHeader}>
                    <Text style={styles.sectionTitle}>Edukasi Kesehatan</Text>
                </View>

                <TouchableOpacity style={styles.eduCard}>
                    <View style={styles.eduInfo}>
                        <View style={styles.eduBadge}><Text style={styles.eduBadgeText}>TIPS</Text></View>
                        <Text style={styles.eduTitle}>Pentingnya Minum Air Putih Saat Mengonsumsi Obat</Text>
                        <Text style={styles.eduDate}>2 jam yang lalu • 5 menit baca</Text>
                    </View>
                    <View style={styles.eduIcon}>
                        <Ionicons name="water-outline" size={40} color="#E3F2FD" />
                    </View>
                </TouchableOpacity>

                <TouchableOpacity style={[styles.eduCard, { backgroundColor: '#FFF3E0' }]}>
                    <View style={styles.eduInfo}>
                        <View style={[styles.eduBadge, { backgroundColor: '#F57C00' }]}><Text style={styles.eduBadgeText}>INFO</Text></View>
                        <Text style={styles.eduTitle}>Mengenal Jenis-Jenis Antibiotik dan Cara Kerjanya</Text>
                        <Text style={styles.eduDate}>1 hari yang lalu • 8 menit baca</Text>
                    </View>
                    <View style={styles.eduIcon}>
                        <Ionicons name="flask-outline" size={40} color="#FFE0B2" />
                    </View>
                </TouchableOpacity>

            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F8FBF8' },
    header: { 
        backgroundColor: '#2E8B57', 
        paddingTop: Platform.OS === 'ios' ? 20 : 50, 
        paddingBottom: 40, 
        paddingHorizontal: 20,
        borderBottomLeftRadius: 30,
        borderBottomRightRadius: 30,
    },
    headerTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
    greetingText: { color: '#E8F5E9', fontSize: 14 },
    userName: { color: '#FFF', fontSize: 20, fontWeight: 'bold' },
    cartBtn: { width: 44, height: 44, borderRadius: 12, backgroundColor: 'rgba(255,255,255,0.2)', justifyContent: 'center', alignItems: 'center' },
    badge: { position: 'absolute', top: -5, right: -5, backgroundColor: '#FF5252', borderRadius: 10, minWidth: 20, height: 20, justifyContent: 'center', alignItems: 'center', borderWidth: 2, borderColor: '#2E8B57' },
    badgeText: { color: '#FFF', fontSize: 10, fontWeight: 'bold' },
    balanceCard: { 
        backgroundColor: '#FFF', 
        borderRadius: 16, 
        padding: 16, 
        flexDirection: 'row', 
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 10,
        elevation: 5,
        position: 'absolute',
        bottom: -25,
        left: 20,
        right: 20,
    },
    balanceInfo: { flex: 1 },
    balanceLabel: { fontSize: 12, color: '#999', marginBottom: 2 },
    balanceValue: { fontSize: 18, fontWeight: 'bold', color: '#333' },
    dividerVertical: { width: 1, height: 30, backgroundColor: '#EEE', marginHorizontal: 15 },
    promoBtn: { flexDirection: 'row', alignItems: 'center', gap: 6 },
    promoText: { fontSize: 14, fontWeight: 'bold', color: '#2E8B57' },
    scrollContent: { paddingTop: 40, paddingBottom: 40 },
    menuGrid: { flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 20, marginBottom: 24 },
    menuItem: { alignItems: 'center', width: (SCREEN_WIDTH - 80) / 4 },
    menuIconWrapper: { width: 56, height: 56, borderRadius: 18, justifyContent: 'center', alignItems: 'center', marginBottom: 8 },
    menuLabel: { fontSize: 12, color: '#555', fontWeight: '500', textAlign: 'center' },
    bannerContainer: { paddingHorizontal: 20, marginBottom: 24 },
    banner: { width: SCREEN_WIDTH - 40, height: 120, borderRadius: 20, padding: 20, flexDirection: 'row', overflow: 'hidden' },
    bannerContent: { flex: 1, justifyContent: 'center' },
    bannerTitle: { color: '#FFF', fontSize: 20, fontWeight: 'bold', marginBottom: 4 },
    bannerSub: { color: 'rgba(255,255,255,0.8)', fontSize: 12, lineHeight: 18 },
    bannerIcon: { position: 'absolute', right: -10, bottom: -10 },
    sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, marginBottom: 16 },
    sectionTitle: { fontSize: 17, fontWeight: 'bold', color: '#333' },
    seeAll: { fontSize: 13, color: '#2E8B57', fontWeight: 'bold' },
    rekContainer: { paddingLeft: 20, marginBottom: 24 },
    rekCard: { width: 140, backgroundColor: '#FFF', borderRadius: 16, padding: 12, marginRight: 15, borderWidth: 1, borderColor: '#EEE' },
    rekImageBg: { width: '100%', height: 100, backgroundColor: '#F5F5F5', borderRadius: 12, justifyContent: 'center', alignItems: 'center', marginBottom: 10, overflow: 'hidden' },
    rekImage: { width: '100%', height: '100%', resizeMode: 'cover' },
    rekName: { fontSize: 14, fontWeight: '500', color: '#333', marginBottom: 4 },
    rekPrice: { fontSize: 14, fontWeight: 'bold', color: '#2E8B57' },
    eduCard: { backgroundColor: '#E3F2FD', marginHorizontal: 20, borderRadius: 20, padding: 20, flexDirection: 'row', alignItems: 'center', marginBottom: 15 },
    eduInfo: { flex: 1 },
    eduBadge: { backgroundColor: '#1976D2', alignSelf: 'flex-start', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 6, marginBottom: 8 },
    eduBadgeText: { color: '#FFF', fontSize: 10, fontWeight: 'bold' },
    eduTitle: { fontSize: 15, fontWeight: 'bold', color: '#333', marginBottom: 6 },
    eduDate: { fontSize: 12, color: '#777' },
    eduIcon: { marginLeft: 15 }
});