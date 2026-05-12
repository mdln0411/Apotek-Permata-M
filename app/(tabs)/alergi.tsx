import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, StatusBar } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

export default function AlergiScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#2E8B57" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={24} color="#FFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Alergi Obat</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Tambah Alergi Baru Button */}
        <TouchableOpacity style={styles.addBtn}>
          <Ionicons name="add" size={20} color="#FFF" style={{marginRight: 8}} />
          <Text style={styles.addBtnText}>Tambah Alergi Baru</Text>
        </TouchableOpacity>

        {/* Card 1: Penisilin */}
        <View style={styles.alergiCard}>
          <View style={styles.cardHeader}>
            <Text style={styles.alergiName}>Penisilin</Text>
            <TouchableOpacity>
              <Ionicons name="trash-outline" size={20} color="#E53935" />
            </TouchableOpacity>
          </View>
          <Text style={styles.alergiDesc}>Ruam kulit</Text>
          <View style={styles.badgeContainer}>
            <View style={[styles.badge, styles.badgeOrange]}>
              <Text style={styles.badgeTextOrange}>Sedang</Text>
            </View>
          </View>
        </View>

        {/* Card 2: Aspirin */}
        <View style={styles.alergiCard}>
          <View style={styles.cardHeader}>
            <Text style={styles.alergiName}>Aspirin</Text>
            <TouchableOpacity>
              <Ionicons name="trash-outline" size={20} color="#E53935" />
            </TouchableOpacity>
          </View>
          <Text style={styles.alergiDesc}>Sesak napas</Text>
          <View style={styles.badgeContainer}>
            <View style={[styles.badge, styles.badgeRed]}>
              <Text style={styles.badgeTextRed}>Berat</Text>
            </View>
          </View>
          <View style={styles.warningBox}>
            <Ionicons name="warning-outline" size={14} color="#E53935" style={{marginRight: 6}} />
            <Text style={styles.warningText}>Alergi berat - Segera hubungi medis jika terpapar</Text>
          </View>
        </View>

        {/* Mengapa Penting Card */}
        <View style={styles.infoCard}>
          <Text style={styles.infoTitle}>Mengapa Penting?</Text>
          <View style={styles.infoItem}>
            <Ionicons name="checkmark" size={16} color="#2E8B57" style={{marginRight: 8}} />
            <Text style={styles.infoText}>Data dicek otomatis saat pesan obat</Text>
          </View>
          <View style={styles.infoItem}>
            <Ionicons name="checkmark" size={16} color="#2E8B57" style={{marginRight: 8}} />
            <Text style={styles.infoText}>Sistem akan peringatkan jika ada risiko</Text>
          </View>
          <View style={styles.infoItem}>
            <Ionicons name="checkmark" size={16} color="#2E8B57" style={{marginRight: 8}} />
            <Text style={styles.infoText}>Apoteker bisa beri alternatif aman</Text>
          </View>
        </View>

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F4F9F5' },
  header: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#2E8B57', paddingTop: 50, paddingBottom: 20, paddingHorizontal: 16 },
  backBtn: { marginRight: 12 },
  headerTitle: { color: '#FFF', fontSize: 18, fontWeight: 'bold' },
  scrollContent: { padding: 16 },
  addBtn: { flexDirection: 'row', backgroundColor: '#2E8B57', borderRadius: 12, height: 48, justifyContent: 'center', alignItems: 'center', marginBottom: 20 },
  addBtnText: { color: '#FFF', fontSize: 16, fontWeight: 'bold' },
  alergiCard: { backgroundColor: '#FFF', borderRadius: 16, padding: 16, marginBottom: 16, borderWidth: 1, borderColor: '#E0EAE3', borderLeftWidth: 4, borderLeftColor: '#E53935' },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 },
  alergiName: { fontSize: 16, fontWeight: 'bold', color: '#1A1A1A' },
  alergiDesc: { fontSize: 13, color: '#666', marginBottom: 12 },
  badgeContainer: { flexDirection: 'row', marginBottom: 8 },
  badge: { paddingHorizontal: 12, paddingVertical: 4, borderRadius: 12 },
  badgeOrange: { backgroundColor: '#FFF3E0' },
  badgeTextOrange: { color: '#E65100', fontSize: 11, fontWeight: 'bold' },
  badgeRed: { backgroundColor: '#FFEBEE' },
  badgeTextRed: { color: '#D32F2F', fontSize: 11, fontWeight: 'bold' },
  warningBox: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFEBEE', padding: 10, borderRadius: 8, marginTop: 8 },
  warningText: { color: '#D32F2F', fontSize: 11, flex: 1 },
  infoCard: { backgroundColor: '#E8F5E9', borderRadius: 16, padding: 16, marginTop: 8 },
  infoTitle: { fontSize: 14, fontWeight: 'bold', color: '#1A1A1A', marginBottom: 12 },
  infoItem: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  infoText: { fontSize: 12, color: '#444', flex: 1 }
});
