import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  FlatList,
  StatusBar,
  ImageBackground,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import ApotekLogo from '@/components/ApotekLogo';

// ── Tipe data ──────────────────────────────────────────────────────────────
interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  stock: number;
  image: string;
  requiresPrescription?: boolean;
}

// ── Data dummy produk ───────────────────────────────────────────────────────
const FEATURED_PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'Paracetamol 500mg',
    category: 'Pain Relief',
    price: 15000,
    stock: 150,
    image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400',
  },
  {
    id: '2',
    name: 'Amoxicillin 500mg',
    category: 'Antibiotics',
    price: 45000,
    stock: 80,
    image: 'https://images.unsplash.com/photo-1471864190281-a93a3070b6de?w=400',
    requiresPrescription: true,
  },
  {
    id: '3',
    name: 'Vitamin C 1000mg',
    category: 'Vitamins',
    price: 35000,
    stock: 200,
    image: 'https://images.unsplash.com/photo-1550572017-edd951b55104?w=400',
  },
  {
    id: '4',
    name: 'Ibuprofen 400mg',
    category: 'Pain Relief',
    price: 25000,
    stock: 120,
    image: 'https://images.unsplash.com/photo-1626716929369-8c7fccac7376?w=400',
  },
];

// ── Helper format harga ────────────────────────────────────────────────────
const formatRupiah = (amount: number): string =>
  `Rp ${Math.round(Number(amount)).toLocaleString('id-ID')}`;

// ── Komponen kartu produk ──────────────────────────────────────────────────
const ProductCard: React.FC<{ item: Product }> = ({ item }) => (
  <TouchableOpacity style={styles.productCard} activeOpacity={0.85}>
    <View style={styles.productImageWrapper}>
      <Image
        source={{ uri: item.image }}
        style={styles.productImage}
        resizeMode="cover"
      />
      {item.requiresPrescription && (
        <View style={styles.prescriptionBadge}>
          <Text style={styles.prescriptionText}>Resep</Text>
        </View>
      )}
    </View>
    <View style={styles.productInfo}>
      <Text style={styles.productName} numberOfLines={2}>
        {item.name}
      </Text>
      <Text style={styles.productCategory}>{item.category}</Text>
      <View style={styles.productFooter}>
        <Text style={styles.productPrice}>{formatRupiah(item.price)}</Text>
        <Text style={styles.productStock}>Stok: {item.stock}</Text>
      </View>
    </View>
  </TouchableOpacity>
);

// ── Komponen utama ─────────────────────────────────────────────────────────
export default function HomeScreen() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar backgroundColor="#2E7D32" barStyle="light-content" />

      {/* ── Header / Navbar ── */}
      <View style={styles.navbar}>
        <View style={styles.navBrand}>
          <ApotekLogo size={36} borderRadius={10} />
          <Text style={styles.navTitle}>Apotek Permata</Text>
        </View>
        <TouchableOpacity onPress={() => router.push('/login' as any)}>
          <Text style={styles.navLogin}>Masuk</Text>
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} style={styles.scroll}>
        {/* ── Hero Banner ── */}
        <ImageBackground
          source={{
            uri: 'https://images.unsplash.com/photo-1471864190281-a93a3070b6de?w=800',
          }}
          style={styles.heroBanner}
          imageStyle={styles.heroImage}
        >
          <View style={styles.heroOverlay} />
          <View style={styles.heroContent}>
            <Text style={styles.heroTitle}>
              Solusi Obat Terpercaya{'\n'}untuk KePermataan Anda
            </Text>
            <Text style={styles.heroSubtitle}>
              Apotek online terpercaya dengan berbagai pilihan obat berkualitas
              dan layanan profesional
            </Text>
            <View style={styles.heroButtons}>
              <TouchableOpacity style={styles.btnPrimary} activeOpacity={0.85}>
                <Text style={styles.btnPrimaryText}>Lihat Obat</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.btnOutline} activeOpacity={0.85}>
                <Text style={styles.btnOutlineText}>Pesan Sekarang</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ImageBackground>

        {/* ── Produk Unggulan ── */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Produk Unggulan</Text>
            <TouchableOpacity>
              <Text style={styles.sectionLink}>Lihat Semua →</Text>
            </TouchableOpacity>
          </View>

          {/* Grid 2 kolom */}
          <View style={styles.productGrid}>
            {FEATURED_PRODUCTS.map((item) => (
              <ProductCard key={item.id} item={item} />
            ))}
          </View>
        </View>

        {/* ── Tentang Apotek ── */}
        <View style={styles.aboutSection}>
          <Text style={styles.aboutTitle}>Tentang Apotek Permata</Text>
          <Text style={styles.aboutDesc}>
            Apotek Permata adalah apotek online terpercaya yang telah melayani
            ribuan pelanggan di seluruh Indonesia. Kami menyediakan berbagai
            macam obat-obatan berkualitas dengan harga terjangkau dan layanan
            apoteker profesional.
          </Text>

          {[
            'Produk Original & Terjamin',
            'Apoteker Berpengalaman',
            'Pengiriman Cepat & Aman',
          ].map((feature) => (
            <View key={feature} style={styles.featureRow}>
              <View style={styles.featureIcon}>
                <Text style={styles.featureCheck}>✓</Text>
              </View>
              <Text style={styles.featureText}>{feature}</Text>
            </View>
          ))}
        </View>

        {/* Spacer bawah */}
        <View style={{ height: 32 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

// ── Styles ─────────────────────────────────────────────────────────────────
const GREEN = '#2E7D32';
const GREEN_LIGHT = '#4CAF50';
const WHITE = '#FFFFFF';
const GRAY_BG = '#F5F5F5';
const GRAY_TEXT = '#757575';
const DARK = '#1A1A1A';

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: WHITE,
  },
  scroll: {
    flex: 1,
  },

  // ── Navbar ──
  navbar: {
    backgroundColor: GREEN,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  navBrand: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  navIcon: {
    backgroundColor: WHITE,
    borderRadius: 20,
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  navIconText: {
    color: GREEN,
    fontSize: 16,
    fontWeight: '700',
  },
  navTitle: {
    color: WHITE,
    fontSize: 17,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  navLogin: {
    color: WHITE,
    fontSize: 15,
    fontWeight: '600',
  },

  // ── Hero ──
  heroBanner: {
    height: 280,
    justifyContent: 'flex-end',
  },
  heroImage: {
    opacity: 0.75,
  },
  heroOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.45)',
  },
  heroContent: {
    padding: 20,
    paddingBottom: 28,
  },
  heroTitle: {
    color: WHITE,
    fontSize: 24,
    fontWeight: '800',
    lineHeight: 32,
    marginBottom: 10,
  },
  heroSubtitle: {
    color: 'rgba(255,255,255,0.85)',
    fontSize: 13,
    lineHeight: 20,
    marginBottom: 20,
  },
  heroButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  btnPrimary: {
    backgroundColor: GREEN_LIGHT,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  btnPrimaryText: {
    color: WHITE,
    fontWeight: '700',
    fontSize: 14,
  },
  btnOutline: {
    borderWidth: 1.5,
    borderColor: WHITE,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  btnOutlineText: {
    color: WHITE,
    fontWeight: '700',
    fontSize: 14,
  },

  // ── Section ──
  section: {
    paddingHorizontal: 16,
    paddingTop: 24,
    paddingBottom: 8,
    backgroundColor: WHITE,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: DARK,
  },
  sectionLink: {
    fontSize: 14,
    color: GREEN_LIGHT,
    fontWeight: '600',
  },

  // ── Product Grid ──
  productGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  productCard: {
    width: '47.5%',
    backgroundColor: WHITE,
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  productImageWrapper: {
    position: 'relative',
  },
  productImage: {
    width: '100%',
    height: 120,
    backgroundColor: GRAY_BG,
  },
  prescriptionBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: GREEN_LIGHT,
    borderRadius: 20,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  prescriptionText: {
    color: WHITE,
    fontSize: 11,
    fontWeight: '700',
  },
  productInfo: {
    padding: 10,
  },
  productName: {
    fontSize: 13,
    fontWeight: '700',
    color: DARK,
    marginBottom: 2,
  },
  productCategory: {
    fontSize: 12,
    color: GRAY_TEXT,
    marginBottom: 8,
  },
  productFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  productPrice: {
    fontSize: 13,
    fontWeight: '700',
    color: GREEN_LIGHT,
  },
  productStock: {
    fontSize: 11,
    color: GRAY_TEXT,
  },

  // ── About ──
  aboutSection: {
    margin: 16,
    marginTop: 20,
    backgroundColor: GRAY_BG,
    borderRadius: 16,
    padding: 20,
  },
  aboutTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: DARK,
    marginBottom: 12,
  },
  aboutDesc: {
    fontSize: 13,
    color: '#555',
    lineHeight: 20,
    marginBottom: 16,
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 10,
  },
  featureIcon: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: GREEN_LIGHT,
    alignItems: 'center',
    justifyContent: 'center',
  },
  featureCheck: {
    color: WHITE,
    fontSize: 12,
    fontWeight: '700',
  },
  featureText: {
    fontSize: 14,
    color: DARK,
    fontWeight: '500',
  },
});
