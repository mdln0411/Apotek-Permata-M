import { products } from '@/data/products';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import {
  Image,
  Pressable,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  View
} from 'react-native';

export default function SearchScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const initialQuery = (params.q as string) || '';
  const [searchQuery, setSearchQuery] = useState(initialQuery);

  // Dynamic filtering based on search query
  const filteredResults = products.filter((p: any) => 
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSearch = (query: string) => {
    if (!query.trim()) return;

    const found = products.find((p: any) =>
      p.name.toLowerCase().includes(query.toLowerCase()) ||
      p.category.toLowerCase().includes(query.toLowerCase())
    );

    if (found) {
      setSearchQuery(query);
    } else {
      router.push({ pathname: '/search-results', params: { q: query } });
    }
  };

  const suggestions = ['Amoxicillin', 'Vitamin C', 'Obat Flu'];

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#358A55" />

      {/* Header & Search Bar Container */}
      <View style={styles.headerContainer}>
        <View style={styles.headerTop}>
          <Pressable onPress={() => router.back()} style={styles.closeButton}>
            <Ionicons name="close" size={28} color="#fff" />
          </Pressable>
          <Text style={styles.headerTitle}>Hasil Pencarian</Text>
        </View>

        <View style={styles.searchBarContainer}>
          <Ionicons name="search-outline" size={20} color="#888" style={styles.searchIcon} />
          <TextInput
            style={[styles.searchInput, { outlineStyle: 'none' } as any]}
            placeholder="Cari obat..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            onSubmitEditing={() => handleSearch(searchQuery)}
            underlineColorAndroid="transparent"
          />
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Search Results */}
        <View style={styles.resultsList}>
          {filteredResults.length > 0 ? (
            filteredResults.map((item: any) => (
              <View key={item.id} style={styles.resultCard}>
                <View style={styles.cardImageContainer}>
                  <Image source={{ uri: item.image }} style={styles.cardImage} />
                </View>

                <View style={styles.cardInfo}>
                  <Text style={styles.itemName}>{item.name}</Text>
                  <View style={styles.tagRow}>
                    <View style={styles.categoryBadge}>
                      <Text style={styles.categoryText}>{item.category}</Text>
                    </View>
                    <View style={styles.ratingContainer}>
                      <Ionicons name="star" size={14} color="#FFD700" />
                      <Text style={styles.ratingText}>4.8</Text>
                    </View>
                  </View>

                  <View style={styles.priceRow}>
                    <Text style={styles.priceText}>{item.price}</Text>
                    <Pressable style={styles.addButton}>
                      <Text style={styles.addButtonText}>+ Keranjang</Text>
                    </Pressable>
                  </View>
                </View>
              </View>
            ))
          ) : (
            <View style={styles.noResultsContainer}>
              <Text style={styles.noResultsText}>Tidak ada hasil untuk "{searchQuery}"</Text>
            </View>
          )}
        </View>

        {/* Other Searches Section */}
        <View style={styles.otherSearchesCard}>
          <View style={styles.sectionTitleRow}>
            <Ionicons name="search" size={18} color="#333" />
            <Text style={styles.sectionTitle}>Pencarian Lain:</Text>
          </View>
          <View style={styles.chipsContainer}>
            {suggestions.map((s) => (
              <Pressable key={s} style={styles.chip} onPress={() => setSearchQuery(s)}>
                <Text style={styles.chipText}>{s}</Text>
              </Pressable>
            ))}
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
  headerContainer: {
    backgroundColor: '#358A55',
    paddingBottom: 20,
    paddingHorizontal: 20,
  },
  headerTop: {
    height: 60,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
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
  searchBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingHorizontal: 15,
    height: 48,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
  scrollContent: {
    padding: 20,
  },
  resultsList: {
    gap: 16,
    marginBottom: 24,
  },
  resultCard: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 16,
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: '#E0EAE0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 10,
    elevation: 2,
  },
  cardImageContainer: {
    width: 80,
    height: 80,
    borderRadius: 12,
    backgroundColor: '#F5F9F6',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    marginRight: 16,
  },
  cardImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  cardInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  itemName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#222',
    marginBottom: 6,
  },
  tagRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    gap: 8,
  },
  categoryBadge: {
    backgroundColor: '#E8F5E9',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },
  categoryText: {
    fontSize: 12,
    color: '#2E7D32',
    fontWeight: '600',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  ratingText: {
    fontSize: 13,
    color: '#555',
    fontWeight: '500',
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  priceText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#2F8F57',
  },
  addButton: {
    backgroundColor: '#358A55',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  otherSearchesCard: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: '#E0EAE0',
  },
  sectionTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap: 8,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#333',
  },
  chipsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  chip: {
    backgroundColor: '#E8F5E9',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  chipText: {
    fontSize: 14,
    color: '#2E7D32',
    fontWeight: '500',
  },
  noResultsContainer: {
    padding: 30,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E0EAE0',
  },
  noResultsText: {
    fontSize: 16,
    color: '#555',
    fontWeight: '500',
    textAlign: 'center',
  },
});
