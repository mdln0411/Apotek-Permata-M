import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, StatusBar } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

export default function SimulasiObatScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#2E8B57" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={24} color="#FFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Simulasi Obat</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        
        {/* Input Card */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Input Simulasi</Text>
          
          <Text style={styles.inputLabel}>Pilih Obat</Text>
          <View style={styles.inputBox} />

          <View style={styles.rowInputs}>
            <View style={styles.colInput}>
              <Text style={styles.inputLabel}>Dosis (mg)</Text>
              <TextInput style={styles.textInput} placeholder="500" placeholderTextColor="#888" keyboardType="numeric" value="500" />
            </View>
            <View style={styles.colInput}>
              <Text style={styles.inputLabel}>Frek/hari</Text>
              <TextInput style={styles.textInput} placeholder="3" placeholderTextColor="#888" keyboardType="numeric" value="3" />
            </View>
            <View style={styles.colInput}>
              <Text style={styles.inputLabel}>Hari</Text>
              <TextInput style={styles.textInput} placeholder="7" placeholderTextColor="#888" keyboardType="numeric" value="7" />
            </View>
          </View>

          <TouchableOpacity style={styles.runBtn}>
            <Ionicons name="play-outline" size={18} color="#FFF" style={{marginRight: 8}} />
            <Text style={styles.runBtnText}>Jalankan Simulasi</Text>
          </TouchableOpacity>
        </View>

        {/* Dosis Aman Banner */}
        <View style={styles.bannerSafe}>
          <Ionicons name="checkmark" size={20} color="#2E8B57" style={{marginTop: 2, marginRight: 12}} />
          <View>
            <Text style={styles.bannerSafeTitle}>Dosis Aman</Text>
            <Text style={styles.bannerSafeDesc}>Dosis berada dalam batas aman</Text>
          </View>
        </View>

        {/* Informasi Banner */}
        <View style={styles.bannerInfo}>
          <View style={styles.bannerInfoTop}>
            <Ionicons name="information-circle-outline" size={20} color="#1A6237" style={{marginRight: 10}} />
            <Text style={styles.bannerInfoTitle}>Informasi</Text>
          </View>
          <View style={styles.bannerInfoContent}>
            <View style={styles.infoRowSpace}>
              <Text style={styles.infoRowLabel}>Dosis harian:</Text>
              <Text style={styles.infoRowValue}>1500mg</Text>
            </View>
            <Text style={styles.bulletText}>• Total 21 tablet untuk 7 hari</Text>
            <Text style={styles.bulletText}>• Konsumsi setelah makan</Text>
          </View>
        </View>

        {/* Catatan Banner */}
        <View style={styles.bannerNote}>
          <Text style={styles.bannerNoteTitle}>Catatan</Text>
          <Text style={styles.bannerNoteText}>Simulasi ini hanya referensi. Selalu ikuti anjuran dokter untuk dosis dan durasi pengobatan.</Text>
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
  card: { backgroundColor: '#FFF', borderRadius: 16, padding: 20, marginBottom: 16, borderWidth: 1, borderColor: '#E0EAE3' },
  cardTitle: { fontSize: 15, fontWeight: 'bold', color: '#1A1A1A', marginBottom: 16 },
  inputLabel: { fontSize: 12, color: '#333', marginBottom: 8 },
  inputBox: { backgroundColor: '#E8F5E9', height: 48, borderRadius: 12, marginBottom: 16 },
  rowInputs: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 },
  colInput: { flex: 0.31 },
  textInput: { backgroundColor: '#E8F5E9', height: 48, borderRadius: 12, paddingHorizontal: 12, color: '#1A1A1A', fontSize: 15 },
  runBtn: { flexDirection: 'row', backgroundColor: '#2E8B57', height: 48, borderRadius: 12, justifyContent: 'center', alignItems: 'center' },
  runBtnText: { color: '#FFF', fontSize: 14, fontWeight: 'bold' },
  bannerSafe: { flexDirection: 'row', backgroundColor: '#E8F5E9', borderRadius: 16, padding: 20, marginBottom: 16, borderLeftWidth: 4, borderLeftColor: '#2E8B57' },
  bannerSafeTitle: { fontSize: 15, fontWeight: 'bold', color: '#2E8B57', marginBottom: 4 },
  bannerSafeDesc: { fontSize: 13, color: '#333' },
  bannerInfo: { backgroundColor: '#E8F5E9', borderRadius: 16, padding: 20, marginBottom: 16 },
  bannerInfoTop: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  bannerInfoTitle: { fontSize: 14, fontWeight: 'bold', color: '#1A1A1A' },
  bannerInfoContent: { paddingLeft: 30 },
  infoRowSpace: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 },
  infoRowLabel: { fontSize: 13, color: '#333' },
  infoRowValue: { fontSize: 14, fontWeight: 'bold', color: '#1A1A1A' },
  bulletText: { fontSize: 13, color: '#1A1A1A', marginBottom: 8 },
  bannerNote: { backgroundColor: '#E8F5E9', borderRadius: 16, padding: 20, marginBottom: 30 },
  bannerNoteTitle: { fontSize: 13, fontWeight: 'bold', color: '#1A1A1A', marginBottom: 8 },
  bannerNoteText: { fontSize: 12, color: '#444', lineHeight: 18 }
});
