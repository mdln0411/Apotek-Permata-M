import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  SafeAreaView, 
  StatusBar, 
  Pressable, 
  ScrollView 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

export default function FilterScreen() {
  const router = useRouter();

  // State for selections
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedPrice, setSelectedPrice] = useState('');
  const [selectedRating, setSelectedRating] = useState('');

  const categories = ['Obat Bebas', 'Obat Bebas Terbatas', 'Vitamin & Suplemen'];
  const priceRanges = ['< Rp 25.000', 'Rp 25.000 - Rp 50.000', '> Rp 50.000'];
  const ratings = ['4.5 - 5.0 ⭐', '4.0 - 4.4 ⭐', '< 4.0 ⭐'];

  const handleReset = () => {
    setSelectedCategory('');
    setSelectedPrice('');
    setSelectedRating('');
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#358A55" />
      
      {/* Header */}
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.closeButton}>
          <Ionicons name="close" size={28} color="#fff" />
        </Pressable>
        <Text style={styles.headerTitle}>Filter Obat</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Kategori Obat */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Kategori Obat</Text>
          <View style={styles.optionsContainer}>
            {categories.map((cat) => (
              <Pressable 
                key={cat} 
                style={[styles.optionCard, selectedCategory === cat && styles.optionCardActive]}
                onPress={() => setSelectedCategory(cat)}
              >
                <Text style={[styles.optionText, selectedCategory === cat && styles.optionTextActive]}>
                  {cat}
                </Text>
              </Pressable>
            ))}
          </View>
        </View>

        {/* Rentang Harga */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Rentang Harga</Text>
          <View style={styles.optionsContainer}>
            {priceRanges.map((price) => (
              <Pressable 
                key={price} 
                style={[styles.optionCard, selectedPrice === price && styles.optionCardActive]}
                onPress={() => setSelectedPrice(price)}
              >
                <Text style={[styles.optionText, selectedPrice === price && styles.optionTextActive]}>
                  {price}
                </Text>
              </Pressable>
            ))}
          </View>
        </View>

        {/* Rating */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Rating</Text>
          <View style={styles.optionsContainer}>
            {ratings.map((rating) => (
              <Pressable 
                key={rating} 
                style={[styles.optionCard, selectedRating === rating && styles.optionCardActive]}
                onPress={() => setSelectedRating(rating)}
              >
                <Text style={[styles.optionText, selectedRating === rating && styles.optionTextActive]}>
                  {rating}
                </Text>
              </Pressable>
            ))}
          </View>
        </View>
      </ScrollView>

      {/* Footer Actions */}
      <View style={styles.footer}>
        <Pressable style={styles.applyButton} onPress={() => router.back()}>
          <Text style={styles.applyButtonText}>Terapkan Filter</Text>
        </Pressable>
        <Pressable style={styles.resetButton} onPress={handleReset}>
          <Text style={styles.resetButtonText}>Reset</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

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
  closeButton: {
    padding: 4,
    marginRight: 12,
  },
  headerTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '700',
  },
  scrollContent: {
    paddingTop: 20,
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#222',
    marginBottom: 12,
  },
  optionsContainer: {
    gap: 10,
  },
  optionCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: '#E0EAE0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 5,
    elevation: 2,
  },
  optionCardActive: {
    borderColor: '#358A55',
    backgroundColor: '#F0F7F0',
  },
  optionText: {
    fontSize: 15,
    color: '#333',
    fontWeight: '500',
  },
  optionTextActive: {
    color: '#358A55',
    fontWeight: '600',
  },
  footer: {
    padding: 20,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#EEE',
    gap: 12,
  },
  applyButton: {
    backgroundColor: '#358A55',
    height: 52,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#358A55',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  applyButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
  resetButton: {
    backgroundColor: '#358A55',
    height: 52,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#358A55',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  resetButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
});
