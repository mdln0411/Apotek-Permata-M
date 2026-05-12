import { Feather, Ionicons } from '@expo/vector-icons';
import { router, Stack } from 'expo-router'; // Tambahkan ini di deretan import atas
import React from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function UploadResepScreen() {
 return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="chevron-back" size={24} color="#FFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Upload Resep</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Upload Area */}
        <TouchableOpacity style={styles.uploadBox}>
          <View style={styles.iconCircle}>
            <Feather name="upload" size={28} color="#2E8B57" />
          </View>
          <Text style={styles.uploadTitle}>Upload Resep</Text>
          <Text style={styles.uploadSubtitle}>JPG, PNG, atau PDF (Maks 5MB)</Text>
        </TouchableOpacity>

        {/* Panduan Upload */}
        <View style={styles.guideContainer}>
          <Text style={styles.sectionTitle}>Panduan Upload:</Text>
          <View style={styles.guideItem}>
            <Ionicons name="checkmark" size={16} color="#333" />
            <Text style={styles.guideText}>Foto resep jelas dan terbaca</Text>
          </View>
          <View style={styles.guideItem}>
            <Ionicons name="checkmark" size={16} color="#333" />
            <Text style={styles.guideText}>Sertakan tanda tangan dokter</Text>
          </View>
          <View style={styles.guideItem}>
            <Ionicons name="checkmark" size={16} color="#333" />
            <Text style={styles.guideText}>Resep asli dibawa saat ambil obat</Text>
          </View>
          <View style={styles.guideItem}>
            <Ionicons name="checkmark" size={16} color="#333" />
            <Text style={styles.guideText}>Proses verifikasi 1-2 jam</Text>
          </View>
        </View>

        {/* Riwayat Resep */}
        <View style={styles.historyContainer}>
          <Text style={styles.sectionTitle}>Riwayat Resep</Text>
          
          {/* Item 1 */}
          <View style={styles.historyCard}>
            <View style={styles.historyInfo}>
              <View style={styles.historyRow}>
                <Ionicons name="document-text-outline" size={20} color="#2E8B57" />
                <Text style={styles.fileName}>resep_dr_budi.jpg</Text>
              </View>
              <Text style={styles.fileDate}>5 Mei 2026</Text>
            </View>
            <View style={[styles.badge, styles.badgeWarning]}>
              <Text style={styles.badgeTextWarning}>Diproses</Text>
            </View>
          </View>

          {/* Item 2 */}
          <View style={styles.historyCard}>
            <View style={styles.historyInfo}>
              <View style={styles.historyRow}>
                <Ionicons name="document-text-outline" size={20} color="#2E8B57" />
                <Text style={styles.fileName}>resep_dr_ani.jpg</Text>
              </View>
              <Text style={styles.fileDate}>25 Apr 2026</Text>
            </View>
            <View style={[styles.badge, styles.badgeSuccess]}>
              <Text style={styles.badgeTextSuccess}>Selesai</Text>
            </View>
          </View>

        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  header: {
    backgroundColor: '#2E8B57', // Warna hijau header
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 16,
    paddingTop: 40, // Sesuaikan untuk status bar jika tidak pakai SafeAreaView penuh
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
  uploadBox: {
    backgroundColor: '#FFF',
    borderWidth: 1.5,
    borderColor: '#C8E6C9',
    borderStyle: 'dashed',
    borderRadius: 16,
    padding: 30,
    alignItems: 'center',
    marginBottom: 20,
  },
  iconCircle: {
    backgroundColor: '#E8F5E9',
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  uploadTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 6,
  },
  uploadSubtitle: {
    fontSize: 12,
    color: '#666',
  },
  guideContainer: {
    backgroundColor: '#E8F5E9',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    borderLeftWidth: 4,
    borderLeftColor: '#2E8B57',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
  },
  guideItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  guideText: {
    marginLeft: 8,
    fontSize: 13,
    color: '#444',
  },
  historyContainer: {
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  historyCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  historyInfo: {
    flex: 1,
  },
  historyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  fileName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginLeft: 8,
  },
  fileDate: {
    fontSize: 12,
    color: '#888',
    marginLeft: 28,
  },
  badge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  badgeWarning: {
    backgroundColor: '#FFF3E0',
  },
  badgeTextWarning: {
    color: '#E65100',
    fontSize: 12,
    fontWeight: 'bold',
  },
  badgeSuccess: {
    backgroundColor: '#E8F5E9',
  },
  badgeTextSuccess: {
    color: '#2E8B57',
    fontSize: 12,
    fontWeight: 'bold',
  },
});