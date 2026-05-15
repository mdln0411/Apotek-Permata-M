import { Feather, Ionicons } from '@expo/vector-icons';
import { router, Tabs } from 'expo-router';
import React from 'react';
import { Image, ImageBackground, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function HomeScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <Tabs.Screen options={{ headerShown: false }} />

      {/* Top Header */}
      <View style={styles.header}>
        <View style={styles.logoContainer}>
          <Ionicons name="medical" size={20} color="#FFF" />
          <Text style={styles.headerTitle}>Apotek Permata</Text>
        </View>
        <TouchableOpacity onPress={() => router.push('/login' as any)}>
          <Text style={styles.loginText}>Masuk</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

        {/* Hero Section */}
        <ImageBackground
          source={{ uri: 'https://images.unsplash.com/photo-1585435557343-3b092031a831?q=80&w=800&auto=format&fit=crop' }}
          style={styles.heroBackground}
        >
          <View style={styles.heroOverlay}>
            <Text style={styles.heroTitle}>Solusi Obat Terpercaya untuk Kesehatan Anda</Text>
            <Text style={styles.heroSubtitle}>Apotek online terpercaya dengan berbagai pilihan obat berkualitas dan layanan profesional</Text>

            <View style={styles.heroButtonGroup}>
              <TouchableOpacity style={styles.btnGreen} onPress={() => router.push('/katalog-obat' as any)}>
                <Text style={styles.btnGreenText}>Lihat Obat</Text>
              </TouchableOpacity>
              {/* Tombol Konsultasi yang mengarah ke /konsultasi */}
              <TouchableOpacity style={styles.btnWhite} onPress={() => router.push('/konsultasi' as any)}>
                <Text style={styles.btnWhiteText}>Konsultasi</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ImageBackground>

        {/* Search Bar */}
        <TouchableOpacity
          style={styles.searchContainer}
          activeOpacity={0.8}
          onPress={() => router.push('/cari-obat' as any)}
        >
          <View style={styles.searchBox}>
            <Feather name="search" size={18} color="#888" style={styles.searchIcon} />
            <Text style={styles.searchPlaceholder}>Cari obat, vitamin, alat kesehatan...</Text>
          </View>
        </TouchableOpacity>

        {/* Produk Unggulan */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Produk Unggulan</Text>
          <TouchableOpacity style={styles.seeAllBtn} onPress={() => router.push('/katalog-obat' as any)}>
            <Text style={styles.seeAllText}>Lihat Semua</Text>
            <Feather name="arrow-right" size={16} color="#2E8B57" />
          </TouchableOpacity>
        </View>

        <View style={styles.productGrid}>
          {/* Produk 1 */}
          <TouchableOpacity style={styles.productCard} onPress={() => router.push('/detail-obat' as any)}>
            <Image source={{ uri: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?q=80&w=400' }} style={styles.productImage} />
            <View style={styles.productInfo}>
              <Text style={styles.productName} numberOfLines={1}>Paracetamol 500m</Text>
              <Text style={styles.productCategory}>Pain Relief</Text>
              <View style={styles.productPriceRow}>
                <Text style={styles.productPrice}>Rp 15.000</Text>
                <Text style={styles.productStock}>Stok: 150</Text>
              </View>
            </View>
          </TouchableOpacity>

          {/* Produk 2 */}
          <TouchableOpacity style={styles.productCard} onPress={() => router.push('/detail-obat' as any)}>
            <Image source={{ uri: 'https://images.unsplash.com/photo-1585435557343-3b092031a831?q=80&w=400' }} style={styles.productImage} />
            <View style={styles.badgeResep}>
              <Text style={styles.badgeResepText}>Resep</Text>
            </View>
            <View style={styles.productInfo}>
              <Text style={styles.productName} numberOfLines={1}>Amoxicillin 500mg</Text>
              <Text style={styles.productCategory}>Antibiotics</Text>
              <View style={styles.productPriceRow}>
                <Text style={styles.productPrice}>Rp 45.000</Text>
                <Text style={styles.productStock}>Stok: 80</Text>
              </View>
            </View>
          </TouchableOpacity>

          {/* Produk 3 */}
          <TouchableOpacity style={styles.productCard} onPress={() => router.push('/detail-obat' as any)}>
            <Image source={require('../../assets/images/obat1.jpg')} style={styles.productImage} />
            <View style={styles.productInfo}>
              <Text style={styles.productName} numberOfLines={1}>Vitamin C 1000m</Text>
              <Text style={styles.productCategory}>Vitamins</Text>
              <View style={styles.productPriceRow}>
                <Text style={styles.productPrice}>Rp 35.000</Text>
                <Text style={styles.productStock}>Stok: 200</Text>
              </View>
            </View>
          </TouchableOpacity>

          {/* Produk 4 */}
          <TouchableOpacity style={styles.productCard} onPress={() => router.push('/detail-obat' as any)}>
            <Image source={{ uri: 'https://images.unsplash.com/photo-1607619056574-7b8d3ee536b2?q=80&w=400' }} style={styles.productImage} />
            <View style={styles.productInfo}>
              <Text style={styles.productName} numberOfLines={1}>Ibuprofen 400mg</Text>
              <Text style={styles.productCategory}>Pain Relief</Text>
              <View style={styles.productPriceRow}>
                <Text style={styles.productPrice}>Rp 25.000</Text>
                <Text style={styles.productStock}>Stok: 120</Text>
              </View>
            </View>
          </TouchableOpacity>
        </View>

        {/* Tentang Apotek */}
        <View style={styles.aboutSection}>
          <Text style={styles.aboutTitle}>Tentang Apotek Permata</Text>
          <Text style={styles.aboutText}>
            Apotek Permata adalah apotek terpercaya yang telah melayani ribuan pelanggan dan berlokasi di Ujung Serdang, Kec. Tj. Morawa, Kabupaten Deli Serdang, Sumatera Utara 20362. Kami menyediakan berbagai macam obat-obatan berkualitas dengan harga terjangkau, menerima resep Dokter dan layanan apoteker profesional.
          </Text>

          <View style={styles.featureItem}>
            <View style={styles.checkCircle}>
              <Feather name="check" size={14} color="#333" />
            </View>
            <Text style={styles.featureText}>Produk Original & Terjamin</Text>
          </View>

          <View style={styles.featureItem}>
            <View style={styles.checkCircle}>
              <Feather name="check" size={14} color="#333" />
            </View>
            <Text style={styles.featureText}>Apoteker Berpengalaman</Text>
          </View>

          <View style={styles.featureItem}>
            <View style={styles.checkCircle}>
              <Feather name="check" size={14} color="#333" />
            </View>
            <Text style={styles.featureText}>Pengiriman Cepat & Aman</Text>
          </View>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFAFA',
  },
  header: {
    backgroundColor: '#2E8B57',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 50, // Sesuaikan dengan status bar
    paddingBottom: 16,
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFF',
    marginLeft: 8,
  },
  loginText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: 'bold',
  },
  scrollContent: {
    paddingBottom: 40,
  },
  heroBackground: {
    width: '100%',
    height: 300,
  },
  heroOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    padding: 20,
    justifyContent: 'flex-end', // Mengubah 'center' menjadi 'flex-end' agar turun ke bawah
    paddingBottom: 30, // Memberikan jarak agar tidak terlalu menempel ke batas bawah gambar
  },
  heroTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFF',
    lineHeight: 32,
    marginBottom: 8,

  },
  heroSubtitle: {
    fontSize: 13,
    color: '#EEE',
    lineHeight: 20,
    marginBottom: 24,
  },
  heroButtonGroup: {
    flexDirection: 'row',
  },
  btnGreen: {
    backgroundColor: '#2E8B57',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginRight: 12,
  },
  btnGreenText: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 14,
  },
  btnWhite: {
    backgroundColor: '#FFF',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  btnWhiteText: {
    color: '#333',
    fontWeight: 'bold',
    fontSize: 14,
  },
  searchContainer: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 4,
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#2E8B57',
    paddingHorizontal: 14,
    paddingVertical: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 3,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchPlaceholder: {
    flex: 1,
    fontSize: 14,
    color: '#AAA',
    paddingVertical: 0,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginTop: 24,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  seeAllBtn: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  seeAllText: {
    fontSize: 13,
    color: '#2E8B57',
    marginRight: 4,
  },
  productGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
  },
  productCard: {
    width: '48%',
    backgroundColor: '#FFF',
    borderRadius: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    overflow: 'hidden',
  },
  productImage: {
    width: '100%',
    height: 120,
    backgroundColor: '#F5F5F5',
  },
  badgeResep: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: '#A5D6A7',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  badgeResepText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#2E7D32',
  },
  productInfo: {
    padding: 12,
  },
  productName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 2,
  },
  productCategory: {
    fontSize: 12,
    color: '#777',
    marginBottom: 8,
  },
  productPriceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  productPrice: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#2E8B57',
  },
  productStock: {
    fontSize: 11,
    color: '#555',
  },
  aboutSection: {
    backgroundColor: '#F1F8E9',
    margin: 20,
    borderRadius: 16,
    padding: 20,
  },
  aboutTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
  },
  aboutText: {
    fontSize: 13,
    color: '#555',
    lineHeight: 20,
    marginBottom: 16,
    textAlign: 'justify',
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  checkCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#E8F5E9',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  featureText: {
    fontSize: 13,
    color: '#444',
  },
});