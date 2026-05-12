import React, { useState } from 'react';
import { 
  SafeAreaView, 
  ScrollView, 
  View, 
  Text, 
  Pressable, 
  StyleSheet, 
  StatusBar,
  TextInput,
  Dimensions
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import ProductCard from '@/components/ProductCard';
import { products } from '@/data/products';

export default function KatalogScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState((params.category as string) || 'All');

  const categories = ['All', 'Pain Relief', 'Antibiotics', 'Vitamins', 'Digestive'];

  const [filteredProducts, setFilteredProducts] = useState(products);

  React.useEffect(() => {
    // If param changes, update activeCategory
    if (params.category) {
      setActiveCategory(params.category as string);
    }
  }, [params.category]);

  React.useEffect(() => {
    const searchLower = searchQuery.toLowerCase();
    const filtered = products.filter(product => {
      const matchesSearch = 
        product.name.toLowerCase().includes(searchLower) ||
        product.category.toLowerCase().includes(searchLower);
      const matchesCategory = activeCategory === 'All' || product.category === activeCategory;
      return matchesSearch && matchesCategory;
    });
    setFilteredProducts(filtered);
  }, [searchQuery, activeCategory]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor="#2F8F57" />
      
      {/* Navbar */}
      <View style={styles.navbar}>
        <View style={styles.navLeft}>
          <Ionicons name="medical" size={24} color="#fff" />
          <Text style={styles.navTitle}>Apotek Permata</Text>
        </View>
        <Pressable onPress={() => {}}>
          <Text style={styles.navRightText}>Masuk</Text>
        </Pressable>
      </View>

      <ScrollView contentContainerStyle={styles.contentContainer} showsVerticalScrollIndicator={false}>
        <View style={styles.headerSection}>
          <Text style={styles.pageTitle}>Katalog Obat</Text>
          <Text style={styles.pageSubtitle}>Temukan obat yang Anda butuhkan</Text>

          {/* Search Bar */}
          <View style={styles.searchContainer}>
            <Ionicons name="search-outline" size={20} color="#888" style={styles.searchIcon} />
            <TextInput
              style={styles.searchInput}
              placeholder="Cari obat..."
              placeholderTextColor="#999"
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
            {searchQuery.length > 0 && (
              <Pressable onPress={() => setSearchQuery('')}>
                <Ionicons name="close-circle" size={20} color="#CCC" />
              </Pressable>
            )}
          </View>
        </View>

        {/* Category Chips */}
        <View>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false} 
            contentContainerStyle={styles.chipScrollContainer}
          >
            {categories.map((category) => (
              <Pressable
                key={category}
                style={[
                  styles.chip,
                  activeCategory === category && styles.chipActive
                ]}
                onPress={() => setActiveCategory(category)}
              >
                <Text
                  style={[
                    styles.chipText,
                    activeCategory === category && styles.chipTextActive
                  ]}
                >
                  {category}
                </Text>
              </Pressable>
            ))}
          </ScrollView>
        </View>

        {/* Product Grid */}
        <View style={styles.gridContainer}>
          <View style={styles.productList}>
            {filteredProducts.map(p => (
              <ProductCard 
                key={p.id} 
                product={p} 
              />
            ))}
          </View>
          {filteredProducts.length === 0 && (
            <View style={styles.errorSection}>
              <View style={styles.iconCircle}>
                <Ionicons name="search-outline" size={60} color="#A5D6A7" />
              </View>
              <Text style={styles.errorTitle}>Obat Tidak Ditemukan</Text>
              <Text style={styles.errorSubtitle}>
                Maaf, kami tidak dapat menemukan obat yang Anda cari.
              </Text>

              <View style={styles.suggestionCard}>
                <View style={styles.suggestionHeader}>
                  <Ionicons name="bulb-outline" size={16} color="#FFD54F" />
                  <Text style={styles.suggestionTitle}>Saran:</Text>
                </View>
                <View style={styles.suggestionList}>
                  <Text style={styles.suggestionItem}>• Periksa ejaan kata kunci</Text>
                  <Text style={styles.suggestionItem}>• Gunakan kata kunci lebih umum</Text>
                  <Text style={styles.suggestionItem}>• Coba nama generik obat</Text>
                </View>
              </View>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const { width } = Dimensions.get('window');
const cardWidth = (width - 40 - 12) / 2; // 40 for horizontal padding (20*2), 12 for gap

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F5F9F6', // Lighter greenish background matching screenshot
  },
  navbar: {
    height: 56,
    backgroundColor: '#358A55',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  navLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  navTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  navRightText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
  },
  contentContainer: {
    flexGrow: 1,
    paddingBottom: 40,
  },
  headerSection: {
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 20,
  },
  pageTitle: {
    fontSize: 26,
    fontWeight: '700',
    color: '#2C3E33',
    marginBottom: 6,
    letterSpacing: -0.5,
  },
  pageSubtitle: {
    fontSize: 15,
    color: '#5B7062',
    marginBottom: 20,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 14,
    paddingHorizontal: 16,
    height: 50,
    shadowColor: '#2F8F57',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#E8EFE8',
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    color: '#333',
    height: '100%',
  },
  chipScrollContainer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
    gap: 10,
  },
  chip: {
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 24,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#D8E5DB', // Subtle grey-green border
  },
  chipActive: {
    backgroundColor: '#2F8F57',
    borderColor: '#2F8F57',
    shadowColor: '#2F8F57',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2,
  },
  chipText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#4A5C50',
  },
  chipTextActive: {
    color: '#fff',
  },
  gridContainer: {
    paddingHorizontal: 20,
  },
  productList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  errorSection: {
    alignItems: 'center',
    paddingTop: 32,
    paddingHorizontal: 16,
  },
  iconCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#E8F5E9',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  errorTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1B3124',
    marginBottom: 8,
  },
  errorSubtitle: {
    fontSize: 14,
    color: '#556B5C',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 24,
  },
  suggestionCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    width: '100%',
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
    marginBottom: 10,
    gap: 6,
  },
  suggestionTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#333',
  },
  suggestionList: {
    gap: 6,
  },
  suggestionItem: {
    fontSize: 13,
    color: '#555',
  },
});
