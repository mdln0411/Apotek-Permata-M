import { Feather } from '@expo/vector-icons';
import { router, Stack } from 'expo-router';
import React, { useRef, useState } from 'react';
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

const RECENT_SEARCHES_INITIAL = ['Paracetamol', 'Amoxicillin', 'Vitamin C', 'Obat Batuk'];
const POPULAR_SEARCHES = ['Paracetamol 500mg', 'Amoxicillin', 'Vitamin D', 'Obat Flu', 'Antasida', 'Betadine'];

const MOCK_PRODUCTS = [
  { id: 1, name: 'Paracetamol 500mg', category: 'Obat Bebas', price: 'Rp 15.000', rating: 4.8, emoji: '💊' },
  { id: 2, name: 'Paracetamol Syrup 60ml', category: 'Obat Bebas', price: 'Rp 25.000', rating: 4.7, emoji: '🧴' },
  { id: 3, name: 'Amoxicillin 500mg', category: 'Obat Keras', price: 'Rp 45.000', rating: 4.6, emoji: '💊' },
  { id: 4, name: 'Vitamin C 1000mg', category: 'Vitamin & Suplemen', price: 'Rp 35.000', rating: 4.9, emoji: '🍊' },
  { id: 5, name: 'Ibuprofen 400mg', category: 'Obat Bebas', price: 'Rp 20.000', rating: 4.5, emoji: '💊' },
  { id: 6, name: 'Vitamin D 1000IU', category: 'Vitamin & Suplemen', price: 'Rp 55.000', rating: 4.8, emoji: '🌟' },
  { id: 7, name: 'Antasida Tablet', category: 'Obat Bebas', price: 'Rp 12.000', rating: 4.3, emoji: '💊' },
  { id: 8, name: 'Betadine 30ml', category: 'Obat Bebas', price: 'Rp 18.000', rating: 4.6, emoji: '🧴' },
  { id: 9, name: 'Obat Flu Tablet', category: 'Obat Bebas', price: 'Rp 15.000', rating: 4.4, emoji: '💊' },
  { id: 10, name: 'Obat Batuk Sirup', category: 'Obat Bebas', price: 'Rp 22.000', rating: 4.5, emoji: '🧴' },
];

export default function CariObatScreen() {
  const [query, setQuery] = useState('');
  const [recentSearches, setRecentSearches] = useState(RECENT_SEARCHES_INITIAL);
  const inputRef = useRef<TextInput>(null);

  const isSearching = query.length > 0;
  const filteredProducts = isSearching
    ? MOCK_PRODUCTS.filter(p => p.name.toLowerCase().includes(query.toLowerCase()))
    : [];
  const hasResults = filteredProducts.length > 0;

  const removeRecent = (item: string) => {
    setRecentSearches(prev => prev.filter(s => s !== item));
  };
  const clearAll = () => setRecentSearches([]);
  const handlePopularPress = (term: string) => {
    setQuery(term);
    inputRef.current?.focus();
  };

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />

      {/* Green Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.closeBtn}>
          <Feather name="x" size={22} color="#FFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Cari Obat</Text>
        <View style={{ width: 22 }} />
      </View>

      {/* Search Bar */}
      <View style={styles.searchWrapper}>
        <View style={styles.searchBox}>
          <Feather name="search" size={18} color="#999" style={styles.searchIcon} />
          <TextInput
            ref={inputRef}
            style={[styles.searchInput, { outline: 'none' } as any]}
            placeholder="Cari obat, vitamin, suplemen..."
            placeholderTextColor="#BBB"
            value={query}
            onChangeText={setQuery}
            returnKeyType="search"
            autoFocus
            underlineColorAndroid="transparent"
            selectionColor="#2E8B57"
          />
          {isSearching && (
            <TouchableOpacity onPress={() => setQuery('')}>
              <Feather name="x-circle" size={18} color="#999" />
            </TouchableOpacity>
          )}
        </View>

        {/* Result count + Filter */}
        <View style={styles.resultRow}>
          <Text style={styles.resultCount}>
            {isSearching ? `${filteredProducts.length} hasil` : ''}
          </Text>
          <TouchableOpacity
            style={styles.filterBtn}
            onPress={() => router.push('/filter-obat' as any)}
          >
            <Feather name="sliders" size={14} color="#2E8B57" />
            <Text style={styles.filterText}>Filter</Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* ── STATE: ADA HASIL ── */}
        {isSearching && hasResults && (
          <>
            {filteredProducts.map(product => (
              <TouchableOpacity
                key={product.id}
                style={styles.resultCard}
                onPress={() => router.push('/detail-obat' as any)}
              >
                <View style={styles.resultEmojiBox}>
                  <Text style={styles.resultEmoji}>{product.emoji}</Text>
                </View>
                <View style={styles.resultInfo}>
                  <Text style={styles.resultName}>{product.name}</Text>
                  <View style={styles.resultMeta}>
                    <View style={styles.categoryBadge}>
                      <Text style={styles.categoryBadgeText}>{product.category}</Text>
                    </View>
                    <Text style={styles.ratingText}>⭐ {product.rating}</Text>
                  </View>
                  <Text style={styles.resultPrice}>{product.price}</Text>
                </View>
                <TouchableOpacity
                  style={styles.addBtn}
                  onPress={() => router.push('/keranjang' as any)}
                >
                  <Text style={styles.addBtnText}>+ Keranjang</Text>
                </TouchableOpacity>
              </TouchableOpacity>
            ))}


            {/* Pencarian Lain */}
            <View style={styles.pencLainCard}>
              <Text style={styles.pencLainTitle}>🔍 Pencarian Lain:</Text>
              <View style={styles.pencLainTags}>
                {POPULAR_SEARCHES
                  .filter(s => !s.toLowerCase().includes(query.toLowerCase()))
                  .slice(0, 3)
                  .map(term => (
                    <TouchableOpacity
                      key={term}
                      style={styles.pencLainTag}
                      onPress={() => handlePopularPress(term)}
                    >
                      <Text style={styles.pencLainTagText}>{term}</Text>
                    </TouchableOpacity>
                  ))}
              </View>
            </View>
          </>
        )
        }

        {/* ── STATE: TIDAK ADA HASIL ── */}
        {
          isSearching && !hasResults && (
            <>
              <View style={styles.notFoundContainer}>
                <View style={styles.notFoundIconBg}>
                  <Feather name="search" size={40} color="#2E8B57" />
                </View>
                <Text style={styles.notFoundTitle}>Obat Tidak Ditemukan</Text>
                <Text style={styles.notFoundSubtitle}>
                  Maaf, kami tidak dapat menemukan obat{'\n'}yang Anda cari.
                </Text>
              </View>

              <View style={styles.saranCard}>
                <Text style={styles.saranTitle}>💡 Saran:</Text>
                <Text style={styles.saranItem}>• Periksa ejaan kata kunci</Text>
                <Text style={styles.saranItem}>• Gunakan kata kunci lebih umum</Text>
                <Text style={styles.saranItem}>• Coba nama generik obat</Text>
              </View>

              <Text style={styles.produkPopulerTitle}>🔥 Produk Populer:</Text>
              <View style={styles.produkPopulerGrid}>
                {MOCK_PRODUCTS.slice(0, 2).map(p => (
                  <View key={p.id} style={styles.produkPopulerCard}>
                    <Text style={styles.produkPopulerEmoji}>{p.emoji}</Text>
                    <Text style={styles.produkPopulerName}>{p.name}</Text>
                    <Text style={styles.produkPopulerPrice}>{p.price}</Text>
                  </View>
                ))}
              </View>

              <TouchableOpacity style={styles.cariLagiBtn} onPress={() => setQuery('')}>
                <Feather name="search" size={16} color="#FFF" />
                <Text style={styles.cariLagiBtnText}>Cari Lagi</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.lihatSemuaBtn}
                onPress={() => router.push('/katalog-obat' as any)}
              >
                <Feather name="grid" size={16} color="#2E8B57" />
                <Text style={styles.lihatSemuaBtnText}>Lihat Semua</Text>
              </TouchableOpacity>
            </>
          )
        }

        {/* ── STATE: DEFAULT (query kosong) ── */}
        {
          !isSearching && (
            <>
              {recentSearches.length > 0 && (
                <View style={styles.section}>
                  <View style={styles.sectionHeader}>
                    <View style={styles.sectionTitleRow}>
                      <Feather name="clock" size={16} color="#2E8B57" />
                      <Text style={styles.sectionTitle}>Pencarian Terakhir</Text>
                    </View>
                    <TouchableOpacity onPress={clearAll}>
                      <Text style={styles.hapusText}>Hapus Semua</Text>
                    </TouchableOpacity>
                  </View>
                  {recentSearches.map(item => (
                    <View key={item} style={styles.recentItem}>
                      <Text style={styles.recentText}>{item}</Text>
                      <TouchableOpacity onPress={() => removeRecent(item)}>
                        <Feather name="x" size={16} color="#AAA" />
                      </TouchableOpacity>
                    </View>
                  ))}
                </View>
              )}

              <View style={styles.section}>
                <View style={styles.sectionHeader}>
                  <View style={styles.sectionTitleRow}>
                    <Feather name="trending-up" size={16} color="#2E8B57" />
                    <Text style={styles.sectionTitle}>Pencarian Populer</Text>
                  </View>
                </View>
                <View style={styles.tagsContainer}>
                  {POPULAR_SEARCHES.map(term => (
                    <TouchableOpacity
                      key={term}
                      style={styles.tag}
                      onPress={() => handlePopularPress(term)}
                    >
                      <Text style={styles.tagText}>{term}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              <View style={styles.tipsCard}>
                <Text style={styles.tipsTitle}>💡 Tips Pencarian</Text>
                <Text style={styles.tipItem}>• Gunakan nama obat yang spesifik</Text>
                <Text style={styles.tipItem}>• Coba cari berdasarkan gejala atau penyakit</Text>
                <Text style={styles.tipItem}>• Gunakan kata kunci seperti "obat sakit kepala"</Text>
              </View>
            </>
          )
        }
      </ScrollView >
    </SafeAreaView >
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F7FAF7' },

  /* Header */
  header: {
    backgroundColor: '#2E8B57',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 16,
  },
  closeBtn: { padding: 2 },
  headerTitle: { fontSize: 18, fontWeight: 'bold', color: '#FFF' },

  /* Search */
  searchWrapper: {
    backgroundColor: '#2E8B57',
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 11,
  },
  searchIcon: { marginRight: 10 },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: '#333',
    paddingVertical: 0,
    // @ts-ignore
    outline: 'none',
  },
  resultRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
  },
  resultCount: { fontSize: 13, color: '#D0EDD8', fontWeight: '600' },
  filterBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  filterText: { fontSize: 13, color: '#2E8B57', fontWeight: '600', marginLeft: 4 },

  /* Scroll */
  scroll: { flex: 1 },
  scrollContent: { paddingTop: 16, paddingBottom: 40, paddingHorizontal: 16 },

  /* ── HASIL DITEMUKAN ── */
  resultCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    borderRadius: 14,
    padding: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E8E8E8',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  resultEmojiBox: {
    width: 54,
    height: 54,
    borderRadius: 12,
    backgroundColor: '#F0FAF4',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  resultEmoji: { fontSize: 28 },
  resultInfo: { flex: 1 },
  resultName: { fontSize: 14, fontWeight: 'bold', color: '#222', marginBottom: 4 },
  resultMeta: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 4 },
  categoryBadge: {
    backgroundColor: '#E8F5E9',
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  categoryBadgeText: { fontSize: 11, color: '#2E7D32', fontWeight: '600' },
  ratingText: { fontSize: 12, color: '#666' },
  resultPrice: { fontSize: 15, fontWeight: 'bold', color: '#2E8B57' },
  addBtn: {
    backgroundColor: '#2E8B57',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  addBtnText: { color: '#FFF', fontSize: 12, fontWeight: 'bold' },

  pencLainCard: {
    backgroundColor: '#FFF',
    borderRadius: 14,
    padding: 16,
    marginTop: 4,
    borderWidth: 1,
    borderColor: '#E8E8E8',
  },
  pencLainTitle: { fontSize: 14, fontWeight: 'bold', color: '#333', marginBottom: 10 },
  pencLainTags: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  pencLainTag: {
    borderWidth: 1,
    borderColor: '#2E8B57',
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 6,
    backgroundColor: '#F0FAF4',
  },
  pencLainTagText: { fontSize: 13, color: '#2E8B57', fontWeight: '500' },

  /* ── TIDAK DITEMUKAN ── */
  notFoundContainer: { alignItems: 'center', paddingTop: 20, paddingBottom: 24 },
  notFoundIconBg: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: '#E8F5E9',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  notFoundTitle: { fontSize: 20, fontWeight: 'bold', color: '#222', marginBottom: 8 },
  notFoundSubtitle: { fontSize: 14, color: '#777', textAlign: 'center', lineHeight: 22 },

  saranCard: {
    backgroundColor: '#FFF',
    borderRadius: 14,
    padding: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#E8E8E8',
  },
  saranTitle: { fontSize: 14, fontWeight: 'bold', color: '#333', marginBottom: 8 },
  saranItem: { fontSize: 13, color: '#555', lineHeight: 22 },

  produkPopulerTitle: { fontSize: 15, fontWeight: 'bold', color: '#222', marginBottom: 12 },
  produkPopulerGrid: { flexDirection: 'row', gap: 12, marginBottom: 24 },
  produkPopulerCard: {
    flex: 1,
    backgroundColor: '#FFF',
    borderRadius: 14,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E8E8E8',
  },
  produkPopulerEmoji: { fontSize: 36, marginBottom: 10 },
  produkPopulerName: { fontSize: 13, fontWeight: 'bold', color: '#333', textAlign: 'center', marginBottom: 4 },
  produkPopulerPrice: { fontSize: 13, color: '#2E8B57', fontWeight: '600' },

  cariLagiBtn: {
    backgroundColor: '#2E8B57',
    borderRadius: 14,
    paddingVertical: 15,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    marginBottom: 10,
  },
  cariLagiBtnText: { color: '#FFF', fontSize: 15, fontWeight: 'bold' },
  lihatSemuaBtn: {
    borderRadius: 14,
    paddingVertical: 13,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    borderWidth: 1.5,
    borderColor: '#2E8B57',
    backgroundColor: '#FFF',
  },
  lihatSemuaBtnText: { color: '#2E8B57', fontSize: 15, fontWeight: '600' },

  /* ── DEFAULT STATE ── */
  section: { marginBottom: 24 },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitleRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  sectionTitle: { fontSize: 16, fontWeight: 'bold', color: '#222', marginLeft: 4 },
  hapusText: { fontSize: 13, color: '#2E8B57', fontWeight: '600' },

  recentItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FFF',
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 14,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#EFEFEF',
    elevation: 1,
  },
  recentText: { fontSize: 14, color: '#333' },

  tagsContainer: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  tag: {
    borderWidth: 1.5,
    borderColor: '#2E8B57',
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 7,
    backgroundColor: '#FFF',
  },
  tagText: { fontSize: 13, color: '#2E8B57', fontWeight: '500' },

  tipsCard: {
    backgroundColor: '#FFF',
    borderRadius: 14,
    padding: 18,
    borderWidth: 1,
    borderColor: '#E8F5E9',
    elevation: 2,
  },
  tipsTitle: { fontSize: 14, fontWeight: 'bold', color: '#333', marginBottom: 10 },
  tipItem: { fontSize: 13, color: '#555', lineHeight: 22 },
});
