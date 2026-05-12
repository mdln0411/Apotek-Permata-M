import { Feather, Ionicons } from '@expo/vector-icons';
import { router, Stack } from 'expo-router';
import React from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function AlergiObatScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="chevron-back" size={24} color="#FFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Alergi Obat</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        
        {/* Tombol Tambah Alergi */}
        <TouchableOpacity style={styles.addButton}>
          <Feather name="plus" size={20} color="#FFF" style={styles.addIcon} />
          <Text style={styles.addButtonText}>Tambah Alergi Baru</Text>
        </TouchableOpacity>

        {/* Card Alergi 1: Sedang */}
        <View style={styles.card}>
          <View style={styles.cardTopRow}>
            <View>
              <Text style={styles.allergyName}>Penisilin</Text>
              <Text style={styles.symptomText}>Ruam kulit</Text>
            </View>
            <TouchableOpacity style={styles.deleteButton}>
              <Feather name="trash-2" size={20} color="#D32F2F" />
            </TouchableOpacity>
          </View>
          <View style={styles.badgeContainer}>
            <View style={[styles.badge, styles.badgeSedang]}>
              <Text style={styles.badgeTextSedang}>Sedang</Text>
            </View>
          </View>
        </View>

        {/* Card Alergi 2: Berat */}
        <View style={styles.card}>
          <View style={styles.cardTopRow}>
            <View>
              <Text style={styles.allergyName}>Aspirin</Text>
              <Text style={styles.symptomText}>Sesak napas</Text>
            </View>
            <TouchableOpacity style={styles.deleteButton}>
              <Feather name="trash-2" size={20} color="#D32F2F" />
            </TouchableOpacity>
          </View>
          <View style={styles.badgeContainer}>
            <View style={[styles.badge, styles.badgeBerat]}>
              <Text style={styles.badgeTextBerat}>Berat</Text>
            </View>
          </View>

          {/* Warning Box */}
          <View style={styles.warningBox}>
            <Feather name="alert-triangle" size={14} color="#D32F2F" style={styles.warningIcon} />
            <Text style={styles.warningText}>Alergi berat - Segera hubungi medis jika terpapar</Text>
          </View>
        </View>

        {/* Info Box: Mengapa Penting? */}
        <View style={styles.infoContainer}>
          <Text style={styles.infoTitle}>Mengapa Penting?</Text>
          <View style={styles.infoItem}>
            <Ionicons name="checkmark" size={16} color="#333" />
            <Text style={styles.infoText}>Data dicek otomatis saat pesan obat</Text>
          </View>
          <View style={styles.infoItem}>
            <Ionicons name="checkmark" size={16} color="#333" />
            <Text style={styles.infoText}>Sistem akan peringatkan jika ada risiko</Text>
          </View>
          <View style={styles.infoItem}>
            <Ionicons name="checkmark" size={16} color="#333" />
            <Text style={styles.infoText}>Apoteker bisa beri alternatif aman</Text>
          </View>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFAFA',
  },
  header: {
    backgroundColor: '#2E8B57',
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 16,
    paddingTop: 40,
  },
  backButton: {
    marginRight: 16,
  },
  headerTitle: {
    color: '#FFF',
    fontSize: 20,
    fontWeight: 'bold',
  },
  scrollContent: {
    padding: 20,
  },
  addButton: {
    backgroundColor: '#2E8B57',
    flexDirection: 'row',
    height: 50,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  addIcon: {
    marginRight: 8,
  },
  addButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  card: {
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderLeftWidth: 5,
    borderLeftColor: '#D32F2F', // Warna merah untuk border kiri
    borderTopWidth: 1,
    borderRightWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#E0E0E0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  cardTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  allergyName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  symptomText: {
    fontSize: 14,
    color: '#555',
    marginBottom: 8,
  },
  deleteButton: {
    padding: 4,
  },
  badgeContainer: {
    alignItems: 'flex-start',
  },
  badge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  badgeSedang: {
    backgroundColor: '#FFF3E0',
  },
  badgeTextSedang: {
    color: '#E65100',
    fontSize: 12,
    fontWeight: 'bold',
  },
  badgeBerat: {
    backgroundColor: '#FFEBEE',
  },
  badgeTextBerat: {
    color: '#D32F2F',
    fontSize: 12,
    fontWeight: 'bold',
  },
  warningBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFEBEE',
    padding: 12,
    borderRadius: 8,
    marginTop: 12,
  },
  warningIcon: {
    marginRight: 8,
  },
  warningText: {
    fontSize: 12,
    color: '#D32F2F',
    flex: 1,
  },
  infoContainer: {
    backgroundColor: '#E8F5E9',
    borderRadius: 16,
    padding: 20,
    marginTop: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#2E8B57',
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  infoText: {
    marginLeft: 8,
    fontSize: 13,
    color: '#444',
  },
});