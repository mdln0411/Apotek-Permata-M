import axiosClient from '@/api/axiosClient';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';
import { Feather, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { router, Stack } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
    Dimensions,
    Image,
    Platform,
    SafeAreaView,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

// Colors Palette based on typical pharmacy apps (Halodoc/Alodokter style)
const THEME = {
    primary: '#2E8B57', // Sea Green / Pharmacy Green
    primaryLight: '#E8F5E9',
    secondary: '#1976D2', // Trust Blue
    accent: '#FF7043', // Modern Orange for focus
    background: '#F0F4F7', // Soft background
    white: '#FFFFFF',
    textDark: '#2C3E50',
    textMuted: '#7F8C8D',
    border: '#E0E6ED',
    success: '#4CAF50',
    warning: '#FFC107',
    error: '#E74C3C',
};

export default function HomeScreen() {
    const { user, unreadChatCount } = useAuth();
    const { itemCount } = useCart();
    const [medicines, setMedicines] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        fetchMedicines();
    }, []);

    const fetchMedicines = async () => {
        try {
            const response = await axiosClient.get('/api/medicines');
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

    const mainMenus = [
        { id: '1', name: 'Konsultasi', icon: 'chat-processing-outline', color: '#E3F2FD', iconColor: '#1976D2', route: '/konsultasi' },
        { id: '2', name: 'Unggah Resep', icon: 'camera-outline', color: '#FFF3E0', iconColor: '#F57C00', route: '/upload-resep' },
        { id: '3', name: 'Pengingat', icon: 'bell-outline', color: '#F3E5F5', iconColor: '#7B1FA2', route: '/pengingat' },
        { id: '4', name: 'Cek Alergi', icon: 'shield-check-outline', color: '#E8F5E9', iconColor: '#2E8B57', route: '/alergi-obat' },
    ];

    const categories = [
        { id: 'c1', name: 'Flu & Batuk', icon: 'weather-windy' },
        { id: 'c2', name: 'Demam', icon: 'thermometer' },
        { id: 'c3', name: 'Vitamin', icon: 'pill' },
        { id: 'c4', name: 'P3K', icon: 'medical-bag' },
        { id: 'c5', name: 'Lainnya', icon: 'dots-grid' },
    ];

    const handleSearch = () => {
        if (searchQuery.trim()) {
            router.push({
                pathname: '/(tabs)/katalog-obat',
                params: { search: searchQuery.trim() }
            } as any);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor={THEME.primary} />
            <Stack.Screen options={{ headerShown: false }} />

            {/* Sticky Header Top */}
            <View style={styles.topHeader}>
                <View style={styles.userInfoSide}>
                    <View style={styles.logoCircle}>
                        <MaterialCommunityIcons name="plus-box" size={28} color={THEME.white} />
                    </View>
                    <View style={styles.nameSection}>
                        <Text style={styles.appName}>APOTEK PERMATA</Text>
                        <Text style={styles.tagline}>Solusi Sehat Keluarga</Text>
                    </View>
                </View>
                <View style={styles.headerIcons}>
                    <TouchableOpacity style={styles.iconButton} onPress={() => router.push('/notifikasi' as any)}>
                        <Ionicons name="notifications-outline" size={24} color={THEME.white} />
                        <View style={styles.badge}>
                            <Text style={styles.badgeText}>3</Text>
                        </View>
                    </TouchableOpacity>
                </View>
            </View>

            <ScrollView 
                showsVerticalScrollIndicator={false} 
                contentContainerStyle={styles.scrollContent}
            >
                {/* Hero Section */}
                <View style={styles.heroBackground}>
                    <View style={styles.searchBarWrapper}>
                        <View style={styles.searchBar}>
                            <Feather name="search" size={20} color={THEME.textMuted} />
                            <TextInput 
                                placeholder="Cari obat, vitamin, atau gejala..."
                                style={styles.searchInput}
                                value={searchQuery}
                                onChangeText={setSearchQuery}
                                onSubmitEditing={handleSearch}
                                returnKeyType="search"
                            />
                            {searchQuery.length > 0 && (
                                <TouchableOpacity onPress={() => setSearchQuery('')}>
                                    <Feather name="x" size={18} color={THEME.textMuted} />
                                </TouchableOpacity>
                            )}
                        </View>
                    </View>
                </View>

                {/* Floating Member Welcome & Quote */}
                <View style={styles.statsContainer}>
                    <View style={styles.welcomeMemberCard}>
                        <View style={styles.welcomeTop}>
                            <MaterialCommunityIcons name="account-star" size={24} color={THEME.primary} />
                            <View style={styles.welcomeInfo}>
                                <Text style={styles.welcomeMemberText}>Selamat Datang, Member!</Text>
                                <Text style={styles.memberUserName}>{user?.name || 'Tamu Setia'}</Text>
                            </View>
                        </View>
                        <View style={styles.memberDivider} />
                        <View style={styles.quoteBox}>
                            <Text style={styles.healthQuote}>"Kesehatan bukanlah segalanya, tapi tanpa kesehatan, segalanya bukanlah apa-apa."</Text>
                            <Text style={styles.quoteAuthor}>- Arthur Schopenhauer</Text>
                        </View>
                    </View>
                </View>

                {/* Main Action Menus */}
                <View style={styles.mainMenuGrid}>
                    {mainMenus.map((menu) => (
                        <TouchableOpacity 
                            key={menu.id} 
                            style={styles.mainMenuItem} 
                            onPress={() => router.push(menu.route as any)}
                        >
                            <View style={[styles.mainMenuIcon, { backgroundColor: menu.color }]}>
                                <MaterialCommunityIcons name={menu.icon as any} size={28} color={menu.iconColor} />
                                {menu.name === 'Konsultasi' && (unreadChatCount ?? 0) > 0 && (
                                    <View style={styles.notifBadge}>
                                        <Text style={styles.notifBadgeText}>{unreadChatCount}</Text>
                                    </View>
                                )}
                            </View>
                            <Text style={styles.mainMenuLabel}>{menu.name}</Text>
                        </TouchableOpacity>
                    ))}
                </View>

                {/* Banners */}
                <View style={styles.sectionPadding}>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} snapToInterval={SCREEN_WIDTH - 40} decelerationRate="fast">
                        <View style={[styles.promoBanner, { backgroundColor: '#81C784' }]}>
                            <View style={styles.bannerTextSide}>
                                <Text style={styles.bannerTitle}>Gratis Ongkir</Text>
                                <Text style={styles.bannerDesc}>Tanpa minimum belanja untuk pesanan pertama Anda!</Text>
                                <TouchableOpacity style={styles.bannerBtn}>
                                    <Text style={styles.bannerBtnText}>Klaim Sekarang</Text>
                                </TouchableOpacity>
                            </View>
                            <Image 
                                source={{ uri: 'https://cdn-icons-png.flaticon.com/512/2969/2969131.png' }} 
                                style={styles.bannerImage} 
                            />
                        </View>
                        <View style={[styles.promoBanner, { backgroundColor: '#64B5F6', marginLeft: 15 }]}>
                            <View style={styles.bannerTextSide}>
                                <Text style={styles.bannerTitle}>Tebus Resep</Text>
                                <Text style={styles.bannerDesc}>Kirim foto resep Anda, kami siapkan obatnya.</Text>
                                <TouchableOpacity style={[styles.bannerBtn, { backgroundColor: '#1976D2' }]}>
                                    <Text style={styles.bannerBtnText}>Unggah Foto</Text>
                                </TouchableOpacity>
                            </View>
                            <Image 
                                source={{ uri: 'https://cdn-icons-png.flaticon.com/512/3028/3028573.png' }} 
                                style={styles.bannerImage} 
                            />
                        </View>
                    </ScrollView>
                </View>

                {/* Categories */}
                <View style={styles.sectionHeader}>
                    <Text style={styles.sectionTitle}>Kategori Populer</Text>
                </View>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.categoryScroll}>
                    {categories.map((cat) => (
                        <TouchableOpacity 
                            key={cat.id} 
                            style={styles.categoryItem}
                            onPress={() => {
                                if (cat.name === 'Lainnya') {
                                    router.push('/(tabs)/katalog-obat' as any);
                                } else {
                                    router.push({
                                        pathname: '/(tabs)/katalog-obat',
                                        params: { category: cat.name }
                                    } as any);
                                }
                            }}
                        >
                            <View style={styles.categoryIconCircle}>
                                <MaterialCommunityIcons name={cat.icon as any} size={24} color={THEME.primary} />
                            </View>
                            <Text style={styles.categoryLabel}>{cat.name}</Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>

                {/* Recommendations */}
                <View style={styles.sectionHeader}>
                    <Text style={styles.sectionTitle}>Rekomendasi Untukmu</Text>
                    <TouchableOpacity onPress={() => router.push('/(tabs)/katalog-obat' as any)}>
                        <Text style={styles.seeMore}>Lihat Semua</Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.productGrid}>
                    {medicines.slice(0, 4).map((item) => (
                        <TouchableOpacity 
                            key={item.id} 
                            style={styles.productCard}
                            onPress={() => router.push({ pathname: '/detail-obat', params: { id: item.id } } as any)}
                        >
                            <View style={styles.productImageWrapper}>
                                {item.image_url ? (
                                    <Image 
                                        source={{ 
                                            uri: item.image_url.startsWith('http') 
                                                ? item.image_url 
                                                : `http://10.0.2.2:8000/storage/${item.image_url}` 
                                        }} 
                                        style={styles.productImage} 
                                    />
                                ) : (
                                    <MaterialCommunityIcons name="pill" size={40} color="#BDC3C7" />
                                )}
                                {item.stock < 5 && (
                                    <View style={styles.stockLabel}>
                                        <Text style={styles.stockText}>Sisa {item.stock}</Text>
                                    </View>
                                )}
                            </View>
                            <View style={styles.productInfo}>
                                <Text style={styles.productName} numberOfLines={2}>{item.name}</Text>
                                <Text style={styles.productPrice}>{formatPrice(item.price)}</Text>
                                <TouchableOpacity style={styles.addBtnSmall}>
                                    <Feather name="plus" size={16} color={THEME.white} />
                                    <Text style={styles.addBtnText}>Beli</Text>
                                </TouchableOpacity>
                            </View>
                        </TouchableOpacity>
                    ))}
                    {loading && <Text style={styles.loadingText}>Memuat rekomendasi...</Text>}
                </View>

                {/* Edukasi / Artikel */}
                <View style={[styles.sectionHeader, { marginTop: 10 }]}>
                    <Text style={styles.sectionTitle}>Edukasi Kesehatan</Text>
                </View>
                <View style={styles.articleList}>
                    <TouchableOpacity style={styles.articleCard}>
                        <Image 
                            source={{ uri: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?q=80&w=200&auto=format&fit=crop' }} 
                            style={styles.articleImage} 
                        />
                        <View style={styles.articleContent}>
                            <Text style={styles.articleTag}>TIPS KESEHATAN</Text>
                            <Text style={styles.articleTitle}>Cara Alami Atasi Batuk Berdahak Tanpa Obat Kimia</Text>
                            <Text style={styles.articleMeta}>Admin • 12 Mei 2026</Text>
                        </View>
                    </TouchableOpacity>
                </View>

                <View style={{ height: 40 }} />
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: THEME.background },
    topHeader: {
        backgroundColor: THEME.primary,
        paddingHorizontal: 20,
        paddingTop: Platform.OS === 'ios' ? 10 : 40,
        paddingBottom: 20,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    userInfoSide: { flexDirection: 'row', alignItems: 'center' },
    logoCircle: {
        width: 40,
        height: 40,
        borderRadius: 12,
        backgroundColor: 'rgba(255,255,255,0.2)',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.4)',
    },
    nameSection: { marginLeft: 12 },
    appName: { color: THEME.white, fontSize: 16, fontWeight: '900', letterSpacing: 1 },
    tagline: { color: 'rgba(255,255,255,0.8)', fontSize: 10, fontWeight: '500' },
    headerIcons: { flexDirection: 'row' },
    iconButton: { width: 40, height: 40, justifyContent: 'center', alignItems: 'center' },
    badge: { 
        position: 'absolute', 
        top: 2, 
        right: 2, 
        backgroundColor: THEME.accent, 
        borderRadius: 10, 
        minWidth: 18, 
        height: 18, 
        justifyContent: 'center', 
        alignItems: 'center',
        borderWidth: 1.5,
        borderColor: THEME.primary
    },
    badgeText: { color: THEME.white, fontSize: 10, fontWeight: 'bold' },
    
    scrollContent: { flexGrow: 1 },
    heroBackground: {
        backgroundColor: THEME.primary,
        height: 80,
        paddingHorizontal: 20,
        borderBottomLeftRadius: 25,
        borderBottomRightRadius: 25,
        marginBottom: 30,
    },
    searchBarWrapper: {
        position: 'absolute',
        bottom: -25,
        left: 20,
        right: 20,
        zIndex: 10,
    },
    searchBar: {
        backgroundColor: THEME.white,
        borderRadius: 15,
        paddingHorizontal: 15,
        height: 50,
        flexDirection: 'row',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 5 },
        shadowOpacity: 0.1,
        shadowRadius: 10,
        elevation: 8,
    },
    searchInput: { flex: 1, marginLeft: 10, fontSize: 14, color: THEME.textDark },
    
    statsContainer: { paddingHorizontal: 20, marginTop: 10 },
    welcomeMemberCard: {
        backgroundColor: THEME.white,
        borderRadius: 20,
        padding: 16,
        borderWidth: 1,
        borderColor: THEME.border,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 3,
    },
    welcomeTop: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
    welcomeInfo: { marginLeft: 12 },
    welcomeMemberText: { fontSize: 12, color: THEME.textMuted, fontWeight: '500' },
    memberUserName: { fontSize: 16, fontWeight: 'bold', color: THEME.textDark },
    memberDivider: { height: 1, backgroundColor: '#F0F0F0', marginBottom: 12 },
    quoteBox: { fontStyle: 'italic' },
    healthQuote: { fontSize: 12, color: THEME.textDark, lineHeight: 18, textAlign: 'center', fontWeight: '500' },
    quoteAuthor: { fontSize: 10, color: THEME.primary, textAlign: 'right', marginTop: 4, fontWeight: 'bold' },

    mainMenuGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        marginTop: 25,
    },
    mainMenuItem: {
        width: (SCREEN_WIDTH - 60) / 4,
        alignItems: 'center',
        marginBottom: 20,
    },
    mainMenuIcon: {
        width: 55,
        height: 55,
        borderRadius: 18,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 5,
        elevation: 2,
    },
    mainMenuLabel: { fontSize: 12, color: THEME.textDark, textAlign: 'center', fontWeight: '500' },
    notifBadge: {
        position: 'absolute',
        top: -5,
        right: -5,
        backgroundColor: THEME.error,
        borderRadius: 10,
        width: 20,
        height: 20,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: THEME.white,
    },
    notifBadgeText: { color: THEME.white, fontSize: 10, fontWeight: 'bold' },

    sectionPadding: { paddingHorizontal: 20, marginVertical: 10 },
    promoBanner: {
        width: SCREEN_WIDTH - 40,
        height: 110,
        borderRadius: 20,
        padding: 15,
        flexDirection: 'row',
        alignItems: 'center',
        overflow: 'hidden',
    },
    bannerTextSide: { flex: 1, zIndex: 1 },
    bannerTitle: { color: THEME.white, fontSize: 18, fontWeight: 'bold' },
    bannerDesc: { color: 'rgba(255,255,255,0.9)', fontSize: 11, marginVertical: 5 },
    bannerBtn: {
        backgroundColor: THEME.white,
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 8,
        alignSelf: 'flex-start',
    },
    bannerBtnText: { color: '#81C784', fontSize: 11, fontWeight: 'bold' },
    bannerImage: { width: 80, height: 80, position: 'absolute', right: -5, bottom: -5, opacity: 0.6 },

    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        marginTop: 20,
        marginBottom: 15,
    },
    sectionTitle: { fontSize: 18, fontWeight: '700', color: THEME.textDark },
    seeMore: { fontSize: 13, color: THEME.primary, fontWeight: 'bold' },

    categoryScroll: { paddingLeft: 20, marginBottom: 10 },
    categoryItem: { alignItems: 'center', marginRight: 20 },
    categoryIconCircle: {
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: THEME.white,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: THEME.border,
    },
    categoryLabel: { fontSize: 12, color: THEME.textDark, marginTop: 8 },

    productGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        paddingHorizontal: 15,
        justifyContent: 'space-between',
    },
    productCard: {
        width: (SCREEN_WIDTH - 45) / 2,
        backgroundColor: THEME.white,
        borderRadius: 15,
        marginBottom: 15,
        padding: 10,
        borderWidth: 1,
        borderColor: THEME.border,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.03,
        shadowRadius: 5,
        elevation: 2,
    },
    productImageWrapper: {
        width: '100%',
        height: 120,
        backgroundColor: '#F9FAFB',
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        overflow: 'hidden',
    },
    productImage: { width: '100%', height: '100%', resizeMode: 'contain' },
    stockLabel: {
        position: 'absolute',
        top: 0,
        left: 0,
        backgroundColor: 'rgba(0,0,0,0.6)',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderBottomRightRadius: 10,
    },
    stockText: { color: THEME.white, fontSize: 10, fontWeight: 'bold' },
    productInfo: { marginTop: 10 },
    productName: { fontSize: 14, fontWeight: '500', color: THEME.textDark, height: 40 },
    productPrice: { fontSize: 15, fontWeight: 'bold', color: THEME.primary, marginVertical: 5 },
    addBtnSmall: {
        backgroundColor: THEME.primary,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 8,
        paddingVertical: 6,
        marginTop: 5,
    },
    addBtnText: { color: THEME.white, fontSize: 12, fontWeight: 'bold', marginLeft: 4 },
    
    loadingText: { padding: 20, color: THEME.textMuted, textAlign: 'center', width: '100%' },

    articleList: { paddingHorizontal: 20 },
    articleCard: {
        flexDirection: 'row',
        backgroundColor: THEME.white,
        borderRadius: 15,
        padding: 12,
        borderWidth: 1,
        borderColor: THEME.border,
    },
    articleImage: { width: 80, height: 80, borderRadius: 12 },
    articleContent: { flex: 1, marginLeft: 15, justifyContent: 'center' },
    articleTag: { fontSize: 10, fontWeight: 'bold', color: THEME.secondary, marginBottom: 4 },
    articleTitle: { fontSize: 14, fontWeight: 'bold', color: THEME.textDark, lineHeight: 20 },
    articleMeta: { fontSize: 10, color: THEME.textMuted, marginTop: 6 },
});