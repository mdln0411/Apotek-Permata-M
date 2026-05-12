import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, StatusBar } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

export default function UploadResepScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#2E8B57" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={24} color="#FFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Upload Resep</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        
        {/* Dropzone Area */}
        <TouchableOpacity style={styles.dropzoneCard}>
          <View style={styles.uploadIconCircle}>
            <Ionicons name="cloud-upload-outline" size={32} color="#2E8B57" />
          </View>
          <Text style={styles.uploadTitle}>Upload Resep</Text>
          <Text style={styles.uploadSub}>JPG, PNG, atau PDF (Maks 5MB)</Text>
        </TouchableOpacity>

        {/* Panduan Upload */}
        <View style={styles.guideCard}>
          <Text style={styles.guideTitle}>Panduan Upload:</Text>
          <View style={styles.guideItem}>
            <Ionicons name="checkmark" size={14} color="#2E8B57" style={{marginTop: 2, marginRight: 8}} />
            <Text style={styles.guideText}>Foto resep jelas dan terbaca</Text>
          </View>
          <View style={styles.guideItem}>
            <Ionicons name="checkmark" size={14} color="#2E8B57" style={{marginTop: 2, marginRight: 8}} />
            <Text style={styles.guideText}>Sertakan tanda tangan dokter</Text>
          </View>
          <View style={styles.guideItem}>
            <Ionicons name="checkmark" size={14} color="#2E8B57" style={{marginTop: 2, marginRight: 8}} />
            <Text style={styles.guideText}>Resep asli dibawa saat ambil obat</Text>
          </View>
          <View style={styles.guideItem}>
            <Ionicons name="checkmark" size={14} color="#2E8B57" style={{marginTop: 2, marginRight: 8}} />
            <Text style={styles.guideText}>Proses verifikasi 1-2 jam</Text>
          </View>
        </View>

        {/* Riwayat Resep */}
        <View style={styles.historyCard}>
          <Text style={styles.historyTitle}>Riwayat Resep</Text>
          
          <View style={styles.historyItem}>
            <View style={styles.historyTopRow}>
              <View style={styles.historyFile}>
                <Ionicons name="document-text-outline" size={16} color="#2E8B57" style={{marginRight: 6}} />
                <Text style={styles.fileName}>resep_dr_budi.jpg</Text>
              </View>
            </View>
            <View style={styles.historyBottomRow}>
              <Text style={styles.fileDate}>5 Mei 2026</Text>
              <View style={[styles.badge, styles.badgeOrange]}>
                <Text style={styles.badgeTextOrange}>Diproses</Text>
              </View>
            </View>
          </View>

          <View style={styles.historyItem}>
            <View style={styles.historyTopRow}>
              <View style={styles.historyFile}>
                <Ionicons name="document-text-outline" size={16} color="#2E8B57" style={{marginRight: 6}} />
                <Text style={styles.fileName}>resep_dr_ani.jpg</Text>
              </View>
            </View>
            <View style={styles.historyBottomRow}>
              <Text style={styles.fileDate}>25 Apr 2026</Text>
              <View style={[styles.badge, styles.badgeGreen]}>
                <Text style={styles.badgeTextGreen}>Selesai</Text>
              </View>
            </View>
          </View>

        </View>

        {/* Bottom spacing */}
        <View style={{height: 40}} />
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
  dropzoneCard: { backgroundColor: '#FFF', borderRadius: 16, padding: 30, marginBottom: 20, borderWidth: 2, borderColor: '#C8E6C9', borderStyle: 'dashed', alignItems: 'center', justifyContent: 'center' },
  uploadIconCircle: { width: 64, height: 64, borderRadius: 32, backgroundColor: '#E8F5E9', justifyContent: 'center', alignItems: 'center', marginBottom: 16 },
  uploadTitle: { fontSize: 16, fontWeight: 'bold', color: '#1A1A1A', marginBottom: 6 },
  uploadSub: { fontSize: 12, color: '#666' },
  guideCard: { backgroundColor: '#E8F5E9', borderRadius: 16, padding: 20, marginBottom: 20, borderLeftWidth: 4, borderLeftColor: '#2E8B57' },
  guideTitle: { fontSize: 14, fontWeight: 'bold', color: '#1A1A1A', marginBottom: 12 },
  guideItem: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 8 },
  guideText: { fontSize: 13, color: '#444', flex: 1 },
  historyCard: { backgroundColor: '#FFF', borderRadius: 16, padding: 20, borderWidth: 1, borderColor: '#E0EAE3' },
  historyTitle: { fontSize: 15, fontWeight: 'bold', color: '#1A1A1A', marginBottom: 16 },
  historyItem: { borderWidth: 1, borderColor: '#E0EAE3', borderRadius: 12, padding: 16, marginBottom: 12 },
  historyTopRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  historyFile: { flexDirection: 'row', alignItems: 'center' },
  fileName: { fontSize: 13, fontWeight: '500', color: '#1A1A1A' },
  historyBottomRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  fileDate: { fontSize: 12, color: '#888' },
  badge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 },
  badgeOrange: { backgroundColor: '#FFF3E0' },
  badgeTextOrange: { color: '#E65100', fontSize: 10, fontWeight: 'bold' },
  badgeGreen: { backgroundColor: '#E8F5E9' },
  badgeTextGreen: { color: '#2E8B57', fontSize: 10, fontWeight: 'bold' }
});
