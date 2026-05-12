import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  StyleSheet, 
  SafeAreaView, 
  StatusBar, 
  Pressable, 
  ScrollView,
  Dimensions
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { products } from '@/data/products';

export default function SearchMainScreen() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');

  const recentSearches = ['Paracetamol', 'Amoxicillin', 'Vitamin C', 'Obat Batuk'];
  const popularSearches = [
    'Paracetamol 500mg', 
    'Amoxicillin', 
    'Vitamin D', 
    'Obat Flu', 
    'Antasida', 
    'Betadine'
  ];

  const handleSearch = (query: string) => {
    if (!query.trim()) return;

    const found = products.find(p => 
      p.name.toLowerCase().includes(query.toLowerCase()) || 
      p.category.toLowerCase().includes(query.toLowerCase())
    );

    if (found) {
      router.push({ pathname: '/search', params: { q: query } });
    } else {
      router.push({ pathname: '/search-results', params: { q: query } });
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#358A55" />
      
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Pressable onPress={() => router.back()} style={styles.closeButton}>
            <Ionicons name="close" size={28} color="#fff" />
          </Pressable>
          <Text style={styles.headerTitle}>Cari Obat</Text>
        </View>
      </View>

      {/* Search Bar & Filter */}
      <View style={styles.searchSection}>
        <View style={styles.searchBarContainer}>
          <Ionicons name="search-outline" size={20} color="#888" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Cari Obat, Vitamin, Suplemen..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            onSubmitEditing={() => handleSearch(searchQuery)}
            autoFocus={true}
          />
        </View>
        <Pressable style={styles.filterButton} onPress={() => router.push('/filter')}>
          <Ionicons name="options-outline" size={24} color="#358A55" />
        </Pressable>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Pencarian Terakhir */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Pencarian Terakhir</Text>
            <Pressable>
              <Text style={styles.clearAllText}>Hapus Semua</Text>
            </Pressable>
          </View>
          <View style={styles.chipsContainer}>
            {recentSearches.map((s) => (
              <Pressable key={s} style={styles.chip} onPress={() => handleSearch(s)}>
                <Text style={styles.chipText}>{s}</Text>
                <Ionicons name="close-circle" size={16} color="#358A55" style={styles.chipIcon} />
              </Pressable>
            ))}
          </View>
        </View>

        {/* Pencarian Populer */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Pencarian Populer</Text>
          <View style={styles.chipsContainer}>
            {popularSearches.map((s) => (
              <Pressable key={s} style={styles.chip} onPress={() => handleSearch(s)}>
                <Text style={styles.chipText}>{s}</Text>
                <Ionicons name="fire" size={16} color="#FF7043" style={styles.chipIcon} />
              </Pressable>
            ))}
          </View>
        </View>

        {/* Tips Pencarian */}
        <View style={styles.tipsCard}>
          <View style={styles.tipsHeader}>
            <Ionicons name="bulb-outline" size={24} color="#FFD54F" />
            <Text style={styles.tipsTitle}>Tips Pencarian:</Text>
          </View>
          <View style={styles.tipsContent}>
            <Text style={styles.tipText}>• Gunakan nama obat yang spesifik</Text>
            <Text style={styles.tipText}>• Coba cari berdasarkan gejala atau penyakit</Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7FAF7',
  },
  header: {
    height: 64,
    backgroundColor: '#358A55',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  closeButton: {
    padding: 4,
    marginRight: 12,
  },
  headerTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '700',
  },
  headerRight: {
    color: '#E8F5E9',
    fontSize: 14,
    fontWeight: '500',
  },
  searchSection: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    gap: 12,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#EEE',
  },
  searchBarContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F9F6',
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 48,
    borderWidth: 1,
    borderColor: '#E8EFE8',
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: '#333',
  },
  filterButton: {
    width: 48,
    height: 48,
    backgroundColor: '#F5F9F6',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E8EFE8',
  },
  scrollContent: {
    padding: 20,
  },
  section: {
    marginBottom: 32,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#2C3E33',
    marginBottom: 12,
  },
  clearAllText: {
    fontSize: 13,
    color: '#FF5252',
    fontWeight: '600',
  },
  chipsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  chip: {
    backgroundColor: '#fff',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E8EFE8',
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  chipText: {
    fontSize: 14,
    color: '#358A55',
    fontWeight: '600',
    marginRight: 6,
  },
  chipIcon: {
    marginLeft: 2,
  },
  tipsCard: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: '#E0EAE0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 10,
    elevation: 2,
  },
  tipsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 10,
  },
  tipsTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#333',
  },
  tipsContent: {
    gap: 6,
  },
  tipText: {
    fontSize: 14,
    color: '#5B7062',
    lineHeight: 20,
  },
});
