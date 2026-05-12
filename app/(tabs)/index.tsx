import React from 'react';
import { 
  SafeAreaView, 
  ScrollView, 
  View, 
  Text, 
  Pressable, 
  Image, 
  StyleSheet, 
  StatusBar, 
  TextInput,
  Dimensions,
  Platform
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import ProductCard from '@/components/ProductCard';

const { width } = Dimensions.get('window');
const isDesktop = width > 768;

export default function HomeScreen() {
  const router = useRouter();

  const categories = [
    { id: '1', name: 'Pain Relief', display: 'Obat Nyeri', icon: 'pill', color: '#E8F5E9', iconColor: '#2F8F57' },
    { id: '2', name: 'Vitamins', display: 'Vitamin', icon: 'bottle-tonic-plus', color: '#FFF3E0', iconColor: '#FB8C00' },
    { id: '3', name: 'Antibiotics', display: 'Antibiotik', icon: 'stethoscope', color: '#E3F2FD', iconColor: '#1E88E5' },
    { id: '4', name: 'Digestive', display: 'Pencernaan', icon: 'briefcase-med', color: '#F3E5F5', iconColor: '#8E24AA' },
    { id: '5', name: 'All', display: 'Lainnya', icon: 'dots-horizontal', color: '#F5F5F5', iconColor: '#757575' },
  ];

  const featuredProducts = [
    {
      id: '1',
      name: 'Paracetamol 500mg',
      category: 'Pain Relief',
      price: 'Rp 15.000',
      stock: 150,
      image: 'https://images.unsplash.com/photo-1584308666744-24d5e4a8334e?q=80&w=400&auto=format&fit=crop',
      requiresPrescription: false,
    },
    {
      id: '2',
      name: 'Amoxicillin 500mg',
      category: 'Antibiotics',
      price: 'Rp 45.000',
      stock: 80,
      image: 'https://images.unsplash.com/photo-1587840170866-5c5c78e6b5a1?q=80&w=400&auto=format&fit=crop',
      requiresPrescription: true,
    },
    {
      id: '3',
      name: 'Vitamin C 1000mg',
      category: 'Vitamins',
      price: 'Rp 35.000',
      stock: 200,
      image: 'https://images.unsplash.com/photo-1611102637744-2d89c4f0a3c8?q=80&w=400&auto=format&fit=crop',
      requiresPrescription: false,
    },
    {
      id: '4',
      name: 'Ibuprofen 400mg',
      category: 'Pain Relief',
      price: 'Rp 25.000',
      stock: 120,
      image: 'https://images.unsplash.com/photo-1587732637614-4b3e2a0e5f5e?q=80&w=400&auto=format&fit=crop',
      requiresPrescription: false,
    },
  ];

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor="#2F8F57" />
      
      {/* Navbar with Logo */}
      <View style={styles.navbar}>
        <View style={styles.navLeft}>
          <View style={styles.logoContainer}>
            <Ionicons name="medical" size={24} color="#fff" />
            <View style={styles.logoLeaf}>
              <Ionicons name="leaf" size={12} color="#2F8F57" />
            </View>
          </View>
          <Text style={styles.navTitle}>Apotek Permata</Text>
        </View>
        <Pressable onPress={() => router.push('/login')}>
          <Text style={styles.navLink}>Masuk</Text>
        </Pressable>
      </View>

      <ScrollView 
        contentContainerStyle={styles.scrollContent} 
        showsVerticalScrollIndicator={false}
      >
        {/* Hero Section matching reference */}
        <View style={styles.heroContainer}>
          <Image
            source={{
              uri: 'https://images.unsplash.com/photo-1587854692152-cbe660dbde88?q=80&w=1200&auto=format&fit=crop'
            }}
            style={styles.heroImage}
          />
          <View style={styles.heroOverlay} />
          <View style={styles.heroContent}>
            <Text style={styles.heroTitle}>Solusi Obat Terpercaya untuk KePermataan Anda</Text>
            <Text style={styles.heroSubtitle}>Apotek online terpercaya dengan berbagai pilihan obat berkualitas dan layanan profesional</Text>
            <View style={styles.heroButtonRow}>
              <Pressable style={styles.heroBtnGreen} onPress={() => router.push('/katalog')}>
                <Text style={styles.heroBtnGreenText}>Lihat Obat</Text>
              </Pressable>
              <Pressable style={styles.heroBtnWhite} onPress={() => router.push('/katalog')}>
                <Text style={styles.heroBtnWhiteText}>Pesan Sekarang</Text>
              </Pressable>
            </View>
          </View>
        </View>

        <View style={styles.mainWrapper}>
          
          {/* Search Bar - Keeping it for better UX although not in screenshot */}
          <View style={styles.searchWrapper}>
            <Pressable 
              style={styles.searchBar}
              onPress={() => router.push('/search-main')}
            >
              <Ionicons name="search-outline" size={20} color="#888" />
              <Text style={styles.searchPlaceholder}>Cari Obat, Vitamin, Alat Kesehatan...</Text>
            </Pressable>
          </View>

          {/* Categories Section */}
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Kategori Populer</Text>
          </View>
          <View style={styles.categoryGrid}>
            {categories.map((cat) => (
              <Pressable 
                key={cat.id} 
                style={styles.categoryItem} 
                onPress={() => router.push({ 
                  pathname: '/katalog', 
                  params: { category: cat.name } 
                })}
              >
                <View style={[styles.categoryIcon, { backgroundColor: cat.color }]}>
                  <MaterialCommunityIcons name={cat.icon as any} size={28} color={cat.iconColor} />
                </View>
                <Text style={styles.categoryName}>{cat.display}</Text>
              </Pressable>
            ))}
          </View>

          {/* Featured Products */}
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Produk Unggulan</Text>
            <Pressable onPress={() => router.push('/katalog')}>
              <Text style={styles.seeAllLink}>Lihat Semua →</Text>
            </Pressable>
          </View>
          <View style={styles.productGrid}>
            {featuredProducts.map((p) => (
              <ProductCard 
                key={p.id} 
                product={p} 
                style={styles.productCardOverride} 
              />
            ))}
          </View>

        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F7FAF7',
  },
  navbar: {
    height: 60,
    backgroundColor: '#2D7D46',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  navLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  logoContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    borderWidth: 1.5,
    borderColor: '#fff',
  },
  logoLeaf: {
    position: 'absolute',
    bottom: 8,
    right: 8,
    backgroundColor: '#fff',
    borderRadius: 6,
    padding: 1,
  },
  navTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
  },
  navLink: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '500',
  },
  scrollContent: {
    paddingBottom: 40,
  },
  heroContainer: {
    height: 400,
    width: '100%',
    position: 'relative',
  },
  heroImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  heroOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0,0,0,0.55)',
  },
  heroContent: {
    position: 'absolute',
    bottom: 40,
    left: 24,
    right: 24,
  },
  heroTitle: {
    color: '#fff',
    fontSize: 30,
    fontWeight: '800',
    lineHeight: 40,
    marginBottom: 12,
  },
  heroSubtitle: {
    color: '#E8F5E9',
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 24,
    opacity: 0.9,
  },
  heroButtonRow: {
    flexDirection: 'row',
    gap: 12,
  },
  heroBtnGreen: {
    backgroundColor: '#2F8F57',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 12,
    flex: 1,
    alignItems: 'center',
  },
  heroBtnGreenText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
  heroBtnWhite: {
    backgroundColor: '#fff',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 12,
    flex: 1,
    alignItems: 'center',
  },
  heroBtnWhiteText: {
    color: '#1B3124',
    fontSize: 16,
    fontWeight: '700',
  },
  mainWrapper: {
    maxWidth: isDesktop ? 1000 : '100%',
    alignSelf: 'center',
    width: '100%',
  },
  searchWrapper: {
    paddingHorizontal: 20,
    marginTop: -26, // Float search bar
    zIndex: 10,
  },
  searchBar: {
    backgroundColor: '#fff',
    height: 52,
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    gap: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 8,
    borderWidth: 1,
    borderColor: '#E8EFE8',
  },
  searchPlaceholder: {
    color: '#999',
    fontSize: 14,
    flex: 1,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginTop: 30,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1B3124',
  },
  seeAllLink: {
    color: '#2F8F57',
    fontSize: 14,
    fontWeight: '600',
  },
  categoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 10,
    justifyContent: 'space-around',
  },
  categoryItem: {
    width: (width - 40) / 5,
    alignItems: 'center',
    marginBottom: 10,
  },
  categoryIcon: {
    width: 52,
    height: 52,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  categoryName: {
    fontSize: 11,
    color: '#555',
    fontWeight: '600',
    textAlign: 'center',
  },
  productGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 20,
    justifyContent: 'space-between',
  },
  productCardOverride: {
    width: '48%',
    marginBottom: 16,
  },
});