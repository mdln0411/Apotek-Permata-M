import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import Header from '../components/header'; 

export default function DetailObatScreen() {
  return (
    <View style={styles.container}>
      <Header title="Detail Obat" />

      <ScrollView contentContainerStyle={styles.content}>
        
        {/* Area Gambar Visualisasi */}
        <View style={styles.imagePlaceholder}>
          <Text style={styles.emojiArt}>💊</Text>
        </View>

        {/* Judul & Kategori */}
        <Text style={styles.title}>Paracetamol 500mg</Text>
        <Text style={styles.category}>Demam & Nyeri</Text>

        {/* Kotak Harga & Stok */}
        <View style={styles.rowCards}>
          <View style={styles.miniCard}>
            <Text style={styles.cardLabel}>Harga</Text>
            <Text style={styles.priceText}>Rp 15.000</Text>
          </View>
          <View style={styles.miniCard}>
            <Text style={styles.cardLabel}>Stok</Text>
            <Text style={styles.stockText}>150 unit</Text>
          </View>
        </View>

        {/* Deskripsi */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Deskripsi</Text>
          <Text style={styles.bodyText}>
            Paracetamol digunakan untuk meredakan demam dan nyeri ringan hingga sedang. Bekerja dengan cara mengurangi produksi prostaglandin di otak yang menyebabkan demam dan nyeri.
          </Text>
        </View>

        {/* Dosis */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Dosis</Text>
          <Text style={styles.bodyText}>
            Dewasa: 1-2 tablet setiap 4-6 jam. Maksimal 8 tablet per hari (4000mg).
          </Text>
        </View>

        {/* Peringatan */}
        <View style={styles.warningCard}>
          <Text style={styles.warningTitle}>⚠️ Peringatan</Text>
          <Text style={styles.warningPoint}>• Jangan melebihi dosis yang dianjurkan</Text>
          <Text style={styles.warningPoint}>• Hati-hati pada gangguan hati</Text>
        </View>

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F4F9F5' },
  content: { padding: 16 },
  imagePlaceholder: { height: 180, backgroundColor: '#81C784', borderRadius: 16, justifyContent: 'center', alignItems: 'center', marginBottom: 16 },
  emojiArt: { fontSize: 70 },
  title: { fontSize: 22, fontWeight: 'bold', color: '#1A1A1A' },
  category: { fontSize: 14, color: '#666', marginTop: 4, marginBottom: 16 },
  rowCards: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 16 },
  miniCard: { flex: 1, backgroundColor: '#FFF', borderRadius: 16, padding: 16, marginHorizontal: 4, borderWidth: 1, borderColor: '#E0EAE3' },
  cardLabel: { fontSize: 12, color: '#666', marginBottom: 4 },
  priceText: { fontSize: 18, fontWeight: 'bold', color: '#2E8B57' },
  stockText: { fontSize: 18, fontWeight: 'bold', color: '#2E8B57' },
  sectionCard: { backgroundColor: '#FFF', borderRadius: 16, padding: 16, marginBottom: 16, borderWidth: 1, borderColor: '#E0EAE3' },
  sectionTitle: { fontSize: 16, fontWeight: 'bold', color: '#1A1A1A', marginBottom: 8 },
  bodyText: { fontSize: 14, color: '#444', lineHeight: 22 },
  warningCard: { backgroundColor: '#FFF3E0', borderRadius: 16, padding: 16, borderWidth: 1, borderColor: '#FFE0B2', marginBottom: 20 },
  warningTitle: { fontSize: 16, fontWeight: 'bold', color: '#E65100', marginBottom: 8 },
  warningPoint: { fontSize: 14, color: '#D84315', marginTop: 4 }
});