import { Feather } from '@expo/vector-icons';
import { router, Stack } from 'expo-router';
import React, { useState } from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const KATEGORI = ['Obat Bebas', 'Obat Bebas Terbatas', 'Vitamin & Suplemen'];
const HARGA = ['< Rp 25.000', 'Rp 25.000 - Rp 50.000', '> Rp 50.000'];
const RATING = ['4.5 - 5.0 ⭐', '4.0 - 4.4 ⭐', '< 4.0 ⭐'];

export default function FilterObatScreen() {
  const [selectedKategori, setSelectedKategori] = useState<string | null>(null);
  const [selectedHarga, setSelectedHarga] = useState<string | null>(null);
  const [selectedRating, setSelectedRating] = useState<string | null>(null);

  const reset = () => {
    setSelectedKategori(null);
    setSelectedHarga(null);
    setSelectedRating(null);
  };

  const renderOptions = (
    items: string[],
    selected: string | null,
    onSelect: (val: string) => void
  ) =>
    items.map((item) => (
      <TouchableOpacity
        key={item}
        style={[styles.optionRow, selected === item && styles.optionRowSelected]}
        onPress={() => onSelect(selected === item ? '' : item)}
        activeOpacity={0.8}
      >
        <Text style={[styles.optionText, selected === item && styles.optionTextSelected]}>
          {item}
        </Text>
        {selected === item && <Feather name="check" size={16} color="#2E8B57" />}
      </TouchableOpacity>
    ));

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.closeBtn}>
          <Feather name="x" size={22} color="#FFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Filter Obat</Text>
        <View style={{ width: 22 }} />
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Kategori Obat */}
        <Text style={styles.sectionTitle}>Kategori Obat</Text>
        {renderOptions(KATEGORI, selectedKategori, setSelectedKategori)}

        {/* Rentang Harga */}
        <Text style={[styles.sectionTitle, { marginTop: 24 }]}>Rentang Harga</Text>
        {renderOptions(HARGA, selectedHarga, setSelectedHarga)}

        {/* Rating */}
        <Text style={[styles.sectionTitle, { marginTop: 24 }]}>Rating</Text>
        {renderOptions(RATING, selectedRating, setSelectedRating)}
      </ScrollView>

      {/* Bottom Buttons */}
      <View style={styles.bottomContainer}>
        <TouchableOpacity style={styles.terapkanBtn} onPress={() => router.back()}>
          <Text style={styles.terapkanBtnText}>Terapkan Filter</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.resetBtn} onPress={reset}>
          <Text style={styles.resetBtnText}>Reset</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F2F7F2' },

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

  scrollContent: {
    padding: 20,
    paddingBottom: 120,
  },

  sectionTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#222',
    marginBottom: 10,
  },

  optionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FFF',
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 14,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#E8E8E8',
  },
  optionRowSelected: {
    borderColor: '#2E8B57',
    backgroundColor: '#F0FAF4',
  },
  optionText: {
    fontSize: 14,
    color: '#333',
  },
  optionTextSelected: {
    color: '#2E8B57',
    fontWeight: '600',
  },

  bottomContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#F2F7F2',
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 28,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
    gap: 10,
  },
  terapkanBtn: {
    backgroundColor: '#2E8B57',
    borderRadius: 14,
    paddingVertical: 15,
    alignItems: 'center',
  },
  terapkanBtnText: {
    color: '#FFF',
    fontSize: 15,
    fontWeight: 'bold',
  },
  resetBtn: {
    borderRadius: 14,
    paddingVertical: 13,
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#2E8B57',
    backgroundColor: '#FFF',
  },
  resetBtnText: {
    color: '#2E8B57',
    fontSize: 15,
    fontWeight: '600',
  },
});
