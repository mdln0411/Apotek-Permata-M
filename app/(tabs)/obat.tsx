import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Header from '../../components/header';

const INITIAL_DRUGS = [
  { id: '1', name: 'Paracetamol 500mg', category: 'Demam & Nyeri', stock: 150, price: 'Rp 15.000', location: 'Rak A-10' },
  { id: '2', name: 'Amoxicillin 500mg', category: 'Antibiotik', stock: 45, price: 'Rp 45.000', location: 'Rak A-11' },
  { id: '3', name: 'Vitamin C 1000mg', category: 'Suplemen', stock: 200, price: 'Rp 35.000', location: 'Rak B-02' },
];

export default function ObatScreen() {
  const [search, setSearch] = useState('');

  return (
    <View style={styles.container}>
      <Header title="Ketersediaan Obat" />

      <View style={styles.searchSection}>
        <View style={styles.searchBox}>
          <Ionicons name="search" size={20} color="#888" style={styles.searchIcon} />
          <TextInput style={styles.searchInput} placeholder="Cari obat..." value={search} onChangeText={setSearch} />
        </View>
        <View style={styles.indicatorContainer}>
          <View style={styles.dot} />
          <Text style={styles.indicatorText}>Update real-time</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.listContainer}>
        {INITIAL_DRUGS.map((drug) => (
          <View key={drug.id} style={styles.card}>
            <View style={styles.cardHeader}>
              <View>
                <Text style={styles.drugName}>{drug.name}</Text>
                <Text style={styles.drugCategory}>{drug.category}</Text>
              </View>
              <View style={styles.checkBadge}>
                <Ionicons name="checkmark" size={16} color="#2E8B57" />
              </View>
            </View>

            <View style={styles.infoRow}>
              <Text style={styles.label}>Stok</Text>
              <Text style={styles.stockValue}>{drug.stock} unit</Text>
            </View>

            <View style={styles.infoRow}>
              <Text style={styles.label}>Harga</Text>
              <Text style={styles.priceValue}>{drug.price}</Text>
            </View>

            <View style={styles.locationRow}>
              <Ionicons name="location-outline" size={16} color="#666" />
              <Text style={styles.locationText}>{drug.location}</Text>
            </View>

            <TouchableOpacity style={styles.cartButton}>
              <Ionicons name="cart-outline" size={18} color="#FFF" style={{ marginRight: 8 }} />
              <Text style={styles.cartButtonText}>Tambah ke Keranjang</Text>
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F4F9F5' },
  searchSection: { padding: 16 },
  searchBox: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFF', borderRadius: 12, paddingHorizontal: 12, height: 48, borderWidth: 1, borderColor: '#E0EAE3' },
  searchIcon: { marginRight: 10 },
  searchInput: { flex: 1, fontSize: 16 },
  indicatorContainer: { flexDirection: 'row', alignItems: 'center', marginTop: 12 },
  dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#2E8B57', marginRight: 6 },
  indicatorText: { fontSize: 12, color: '#555' },
  listContainer: { paddingHorizontal: 16, paddingBottom: 20 },
  card: { backgroundColor: '#FFF', borderRadius: 16, padding: 16, marginBottom: 16, borderWidth: 1, borderColor: '#E0EAE3' },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 },
  drugName: { fontSize: 18, fontWeight: 'bold', color: '#1A1A1A' },
  drugCategory: { fontSize: 14, color: '#666', marginTop: 2 },
  checkBadge: { width: 28, height: 28, borderRadius: 14, backgroundColor: '#E8F5E9', justifyContent: 'center', alignItems: 'center' },
  infoRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  label: { fontSize: 14, color: '#666' },
  stockValue: { fontSize: 14, fontWeight: 'bold', color: '#2E8B57' },
  priceValue: { fontSize: 14, fontWeight: 'bold', color: '#1A1A1A' },
  locationRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 16 },
  locationText: { fontSize: 12, color: '#666', marginLeft: 4 },
  cartButton: { backgroundColor: '#2E8B57', flexDirection: 'row', height: 44, borderRadius: 12, justifyContent: 'center', alignItems: 'center' },
  cartButtonText: { color: '#FFF', fontWeight: 'bold', fontSize: 14 }
});