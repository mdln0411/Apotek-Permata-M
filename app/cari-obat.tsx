import React, { useRef, useState, useEffect } from 'react';
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { router, Stack } from 'expo-router';
import { Feather, Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { getMedicines, MedicineListItem } from '@/api/medicineService';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';
import { LoginPromptModal } from '@/components/LoginPromptModal';

const RECENT_SEARCHES_INITIAL = ['Paracetamol', 'Antasida', 'Vitamin C', 'Obat Batuk'];
const POPULAR_SEARCHES = ['Paracetamol', 'Antasida', 'Vitamin D', 'Obat Flu', 'Amoxicillin', 'Betadine'];

// Spelling Dictionary containing valid keywords
const SEARCH_DICTIONARY = [
  'paracetamol',
  'amoxicillin',
  'vitamin',
  'ibuprofen',
  'antasida',
  'betadine',
  'demam',
  'batuk',
  'flu',
  'lambung',
  'sakit kepala',
  'sakit perut',
  'pusing',
  'maag',
  'luka',
  'mual',
  'diare',
  'sesak',
  'alergi',
  'kembung',
  'perih',
  'nyeri'
];

export default function CariObatScreen() {
  const { user } = useAuth();
  const { addToCart } = useCart();
  
  const [query, setQuery] = useState('');
  const [recentSearches, setRecentSearches] = useState(RECENT_SEARCHES_INITIAL);
  const [products, setProducts] = useState<MedicineListItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [loginModalVisible, setLoginModalVisible] = useState(false);
  const inputRef = useRef<TextInput>(null);

  // Debounced API call when query changes
  useEffect(() => {
    if (query.trim().length === 0) {
      setProducts([]);
      return;
    }

    const delayDebounceFn = setTimeout(async () => {
      try {
        setLoading(true);
        // Call backend API which searches name, category, and indication
        const res = await getMedicines({ search: query.trim(), per_page: 50 });
        setProducts(res.data);
      } catch (e) {
        console.error('Gagal memproses pencarian obat:', e);
      } finally {
        setLoading(false);
      }
    }, 400); // 400ms debounce to prevent excessive database queries

    return () => clearTimeout(delayDebounceFn);
  }, [query]);

  // Levenshtein Distance for spell-checking
  const getLevenshteinDistance = (a: string, b: string): number => {
    const tmp: number[][] = [];
    let i, j;
    for (i = 0; i <= a.length; i++) {
      tmp[i] = [i];
    }
    for (j = 0; j <= b.length; j++) {
      tmp[0][j] = j;
    }
    for (i = 1; i <= a.length; i++) {
      for (j = 1; j <= b.length; j++) {
        tmp[i][j] = Math.min(
          tmp[i - 1][j] + 1,
          tmp[i][j - 1] + 1,
          tmp[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1)
        );
      }
    }
    return tmp[a.length][b.length];
  };

  // Google-style fuzzy "Did you mean" spelling suggestion generator
  const getDidYouMean = (q: string): string => {
    if (!q || q.length < 2) return '';
    const words = q.toLowerCase().trim().split(/\s+/);
    let corrected = false;

    const correctedWords = words.map(word => {
      if (word.length < 2) return word;
      
      // If word is already a perfect match or a substring of any word in dictionary, don't correct it
      const hasPerfectMatch = SEARCH_DICTIONARY.some(dictWord => 
        dictWord === word || dictWord.includes(word) || word.includes(dictWord)
      );
      if (hasPerfectMatch) return word;

      // Find closest dictionary word
      let bestMatch = word;
      let minDistance = 999;

      for (const dictWord of SEARCH_DICTIONARY) {
        const dist = getLevenshteinDistance(word, dictWord);
        if (dist < minDistance) {
          minDistance = dist;
          bestMatch = dictWord;
        }
      }

      // Only suggest if distance is low (1 or 2 edits depending on word length)
      const maxAllowedDist = word.length <= 4 ? 1 : 2;
      if (minDistance > 0 && minDistance <= maxAllowedDist) {
        corrected = true;
        return bestMatch;
      }

      return word;
    });

    return corrected ? correctedWords.join(' ') : '';
  };

  const didYouMeanQuery = getDidYouMean(query);

  const isSearching = query.length > 0;
  const hasResults = products.length > 0;

  const removeRecent = (item: string) => {
    setRecentSearches(prev => prev.filter(s => s !== item));
  };
  
  const clearAll = () => setRecentSearches([]);

  const handlePopularPress = (term: string) => {
    setQuery(term);
    inputRef.current?.focus();
  };

  const handleAddToCart = async (item: MedicineListItem) => {
    if (!user) {
      setLoginModalVisible(true);
      return;
    }
    try {
      if (item.stock === 0) {
        Alert.alert('Habis', 'Stok obat ini sedang kosong.');
        return;
      }
      await addToCart(item.id, 1);
      Alert.alert('Sukses', `${item.name} berhasil ditambahkan ke keranjang.`);
    } catch (e) {
      console.error('Gagal tambah keranjang:', e);
      Alert.alert('Error', 'Gagal menambahkan obat ke keranjang.');
    }
  };

  const getFallbackEmoji = (category: string) => {
    const cat = category?.toLowerCase() || '';
    if (cat.includes('vitamin') || cat.includes('suplemen')) return '🍊';
    if (cat.includes('keras')) return '🔴';
    return '💊';
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
            placeholder="Cari demam, lambung, sakit perut, mual..."
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
            {isSearching ? (loading ? 'Mencari...' : `${products.length} hasil`) : ''}
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

      {/* Google-style "Mungkin maksud Anda" suggestion */}
      {didYouMeanQuery ? (
        <TouchableOpacity 
          style={styles.didYouMeanContainer}
          onPress={() => {
            setQuery(didYouMeanQuery);
            inputRef.current?.focus();
          }}
          activeOpacity={0.8}
        >
          <Feather name="alert-circle" size={16} color="#E65100" />
          <Text style={styles.didYouMeanText}>
            Mungkin maksud Anda:{' '}
            <Text style={styles.didYouMeanLink}>
              {didYouMeanQuery}
            </Text>
          </Text>
        </TouchableOpacity>
      ) : null}

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Loading Spinner */}
        {loading && (
          <View style={styles.loaderContainer}>
            <ActivityIndicator size="large" color="#2E8B57" />
            <Text style={styles.loaderText}>Mencari obat terbaik untuk Anda...</Text>
          </View>
        )}

        {/* ── STATE: ADA HASIL ── */}
        {isSearching && !loading && hasResults && (
          <>
            {products.map(product => (
              <TouchableOpacity
                key={product.id}
                style={styles.resultCard}
                onPress={() => router.push({ pathname: '/detail-obat', params: { id: product.id } } as any)}
              >
                <View style={styles.resultEmojiBox}>
                  {product.image_url ? (
                    <Image 
                      source={{ uri: product.image_url }} 
                      style={styles.resultImage}
                      resizeMode="contain"
                    />
                  ) : (
                    <Text style={styles.resultEmoji}>{getFallbackEmoji(product.category)}</Text>
                  )}
                </View>
                <View style={styles.resultInfo}>
                  <Text style={styles.resultName} numberOfLines={2}>{product.name}</Text>
                  <View style={styles.resultMeta}>
                    <View style={styles.categoryBadge}>
                      <Text style={styles.categoryBadgeText}>{product.category}</Text>
                    </View>
                    <Text style={styles.ratingText}>⭐ 4.8</Text>
                  </View>
                  <Text style={styles.resultPrice}>{product.price_formatted}</Text>
                </View>
                <TouchableOpacity
                  style={[styles.addBtn, product.stock === 0 && styles.addBtnDisabled]}
                  onPress={() => handleAddToCart(product)}
                  disabled={product.stock === 0}
                >
                  <Text style={styles.addBtnText}>
                    {product.stock === 0 ? 'Habis' : '+ Keranjang'}
                  </Text>
                </TouchableOpacity>
              </TouchableOpacity>
            ))}

            {/* Pencarian Lain */}
            <View style={styles.pencLainCard}>
              <Text style={styles.pencLainTitle}>🔍 Rekomendasi Terkait:</Text>
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
        )}

        {/* ── STATE: TIDAK ADA HASIL ── */}
        {isSearching && !loading && !hasResults && (
          <>
            <View style={styles.notFoundContainer}>
              <View style={styles.notFoundIconBg}>
                <Feather name="search" size={40} color="#2E8B57" />
              </View>
              <Text style={styles.notFoundTitle}>Obat Tidak Ditemukan</Text>
              <Text style={styles.notFoundSubtitle}>
                Maaf, kami tidak dapat menemukan obat dengan indikasi atau nama "{query}".
              </Text>
            </View>

            <View style={styles.saranCard}>
              <Text style={styles.saranTitle}>💡 Tips Pencarian Apotek Permata:</Text>
              <Text style={styles.saranItem}>• Cari berdasarkan penyakit (contoh: "maag", "pusing", "pilek")</Text>
              <Text style={styles.saranItem}>• Cari gejala keluhan Anda (contoh: "sakit kepala", "mual", "sakit perut")</Text>
              <Text style={styles.saranItem}>• Coba nama kandungan obat (contoh: "Paracetamol", "Amoxicillin")</Text>
            </View>

            <TouchableOpacity style={styles.cariLagiBtn} onPress={() => setQuery('')}>
              <Feather name="search" size={16} color="#FFF" />
              <Text style={styles.cariLagiBtnText}>Bersihkan Pencarian</Text>
            </TouchableOpacity>
          </>
        )}

        {/* ── STATE: DEFAULT (query kosong) ── */}
        {!isSearching && (
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
                    <TouchableOpacity style={{ flex: 1 }} onPress={() => handlePopularPress(item)}>
                      <Text style={styles.recentText}>{item}</Text>
                    </TouchableOpacity>
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
              <Text style={styles.tipsTitle}>💡 Tips Pencarian Pintar</Text>
              <Text style={styles.tipItem}>• Ketik keluhan seperti "sakit kepala" atau "sakit perut".</Text>
              <Text style={styles.tipItem}>• Sistem kami mendeteksi typo dan memberikan rekomendasi otomatis.</Text>
              <Text style={styles.tipItem}>• Indikasi lengkap ditarik langsung dari database kami.</Text>
            </View>
          </>
        )}
      </ScrollView >

      {/* Guest Mode Modal Interceptor */}
      <LoginPromptModal 
        visible={loginModalVisible}
        onClose={() => setLoginModalVisible(false)}
        promptMessage="Silakan masuk akun terlebih dahulu untuk menambahkan produk obat ke keranjang belanja Anda."
      />
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

  /* Loader */
  loaderContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
    gap: 12,
  },
  loaderText: {
    fontSize: 14,
    color: '#666',
  },

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
    overflow: 'hidden',
  },
  resultEmoji: { fontSize: 24 },
  resultImage: {
    width: '100%',
    height: '100%',
  },
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
  addBtnDisabled: {
    backgroundColor: '#ECEFF1',
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
  notFoundSubtitle: { fontSize: 14, color: '#777', textAlign: 'center', lineHeight: 22, paddingHorizontal: 20 },

  saranCard: {
    backgroundColor: '#FFF',
    borderRadius: 14,
    padding: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#E8E8E8',
  },
  saranTitle: { fontSize: 14, fontWeight: 'bold', color: '#333', marginBottom: 8 },
  saranItem: { fontSize: 13, color: '#555', lineHeight: 22, marginBottom: 4 },

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

  /* Spelling Correction styles */
  didYouMeanContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFE0B2',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#FFD180',
    gap: 8,
  },
  didYouMeanText: {
    fontSize: 13,
    color: '#E65100',
    flex: 1,
  },
  didYouMeanLink: {
    fontWeight: 'bold',
    fontStyle: 'italic',
    textDecorationLine: 'underline',
    color: '#D84315',
  },
});
