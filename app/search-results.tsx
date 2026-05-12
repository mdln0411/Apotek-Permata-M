import ProductCard from '@/components/ProductCard';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import React from 'react';
import {
  Dimensions,
  Pressable,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View
} from 'react-native';

export default function SearchResultsScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const query = (params.q as string) || '';

  // Mock data for "Produk Populer"
  const popularProducts = [
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
      id: '3',
      name: 'Vitamin C 1000mg',
      category: 'Vitamins',
      price: 'Rp 45.000',
      stock: 200,
      image: 'https://images.unsplash.com/photo-1611102637744-2d89c4f0a3c8?q=80&w=400&auto=format&fit=crop',
      requiresPrescription: false,
    }
  ];

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#358A55" />

      {/* Header */}
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </Pressable>
        <Text style={styles.headerTitle}>Hasil Pencarian</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Error State: Icon & Main Message */}
        <View style={styles.errorSection}>
          <View style={styles.iconCircle}>
            <Ionicons name="search-outline" size={80} color="#A5D6A7" />
          </View>
          <Text style={styles.errorTitle}>Obat Tidak Ditemukan</Text>
          <Text style={styles.errorSubtitle}>
            Maaf, kami tidak dapat menemukan obat "{query}" yang Anda cari.
          </Text>
        </View>

        {/* Saran Section */}
        <View style={styles.suggestionCard}>
          <View style={styles.suggestionHeader}>
            <Ionicons name="bulb-outline" size={18} color="#FFD54F" />
            <Text style={styles.suggestionTitle}>Saran:</Text>
          </View>
          <View style={styles.suggestionList}>
            <Text style={styles.suggestionItem}>• Periksa ejaan kata kunci</Text>
            <Text style={styles.suggestionItem}>• Gunakan kata kunci lebih umum</Text>
            <Text style={styles.suggestionItem}>• Coba nama generik obat</Text>
          </View>
        </View>

        {/* Produk Populer Section */}
        <View style={styles.popularSection}>
          <View style={styles.sectionHeader}>
            <Ionicons name="flame" size={20} color="#FF7043" />
            <Text style={styles.sectionTitle}>Produk Populer:</Text>
          </View>
          <View style={styles.popularGrid}>
            {popularProducts.map(p => (
              <ProductCard key={p.id} product={p} style={styles.cardOverride} />
            ))}
          </View>
        </View>

        {/* Bottom Actions */}
        <View style={styles.actionSection}>
          <Pressable style={styles.primaryButton} onPress={() => router.back()}>
            <Ionicons name="search" size={20} color="#fff" style={styles.buttonIcon} />
            <Text style={styles.primaryButtonText}>Cari Lagi</Text>
          </Pressable>
          <Pressable style={styles.secondaryButton} onPress={() => router.push('/katalog')}>
            <Ionicons name="briefcase-outline" size={20} color="#fff" style={styles.buttonIcon} />
            <Text style={styles.secondaryButtonText}>Lihat Semua</Text>
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7FAF7',
  },
  header: {
    height: 60,
    backgroundColor: '#358A55',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  backButton: {
    padding: 8,
    marginRight: 8,
  },
  headerTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '700',
  },
  scrollContent: {
    paddingBottom: 40,
  },
  errorSection: {
    alignItems: 'center',
    paddingTop: 40,
    paddingHorizontal: 24,
    marginBottom: 24,
  },
  iconCircle: {
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: '#E8F5E9',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  errorTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#1B3124',
    marginBottom: 12,
  },
  errorSubtitle: {
    fontSize: 15,
    color: '#556B5C',
    textAlign: 'center',
    lineHeight: 22,
  },
  suggestionCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    marginHorizontal: 24,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#E0EAE0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 10,
    elevation: 2,
  },
  suggestionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 8,
  },
  suggestionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#333',
  },
  suggestionList: {
    gap: 6,
  },
  suggestionItem: {
    fontSize: 14,
    color: '#555',
    marginLeft: 4,
  },
  popularSection: {
    paddingHorizontal: 24,
    marginBottom: 32,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap: 8,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1B3124',
  },
  popularGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  cardOverride: {
    width: (width - 48 - 12) / 2,
    marginBottom: 0,
  },
  actionSection: {
    paddingHorizontal: 24,
    gap: 12,
  },
  primaryButton: {
    backgroundColor: '#358A55',
    height: 52,
    borderRadius: 26,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#358A55',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  primaryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
  secondaryButton: {
    backgroundColor: '#358A55',
    height: 52,
    borderRadius: 26,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#358A55',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  secondaryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
  buttonIcon: {
    marginRight: 8,
  },
});
