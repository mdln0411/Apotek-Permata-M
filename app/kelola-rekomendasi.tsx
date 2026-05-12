import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, StatusBar } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function KelolaRekomendasiScreen() {
  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#2E8B57" />
      
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Kelola Rekomendasi</Text>
      </View>

      {/* Search & Add */}
      <View style={styles.searchAddRow}>
        <View style={styles.searchBox}>
          <TextInput 
            style={styles.searchInput} 
            placeholder="Cari obat..." 
            placeholderTextColor="#888"
          />
        </View>
        <TouchableOpacity style={styles.addBtn}>
          <Ionicons name="add" size={24} color="#FFF" />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        
        {/* Card 1 */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.medicineName}>Paracetamol 500mg</Text>
            <View style={[styles.badge, styles.badgeRed]}>
              <Text style={styles.badgeTextRed}>Tinggi</Text>
            </View>
          </View>
          
          <View style={styles.tagsRow}>
            <View style={styles.tag}><Text style={styles.tagText}>demam</Text></View>
            <View style={styles.tag}><Text style={styles.tagText}>sakit kepala</Text></View>
          </View>

          <View style={styles.infoRow}>
            <View style={styles.infoCol}>
              <Text style={styles.infoLabel}>Stok</Text>
              <Text style={styles.infoValue}>150 unit</Text>
            </View>
            <View style={styles.infoCol}>
              <Text style={styles.infoLabel}>Prioritas</Text>
              <Text style={styles.infoValue}>Tinggi</Text>
            </View>
          </View>

          <View style={styles.actionsRow}>
            <TouchableOpacity style={styles.editBtn}>
              <Ionicons name="pencil-outline" size={14} color="#1A6237" style={{marginRight: 6}} />
              <Text style={styles.editBtnText}>Edit</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.deleteBtn}>
              <Ionicons name="trash-outline" size={16} color="#E53935" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Card 2 */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.medicineName}>Amoxicillin 500mg</Text>
            <View style={[styles.badge, styles.badgeOrange]}>
              <Text style={styles.badgeTextOrange}>Sedang</Text>
            </View>
          </View>
          
          <View style={styles.tagsRow}>
            <View style={styles.tag}><Text style={styles.tagText}>infeksi</Text></View>
            <View style={styles.tag}><Text style={styles.tagText}>batuk</Text></View>
          </View>

          <View style={styles.infoRow}>
            <View style={styles.infoCol}>
              <Text style={styles.infoLabel}>Stok</Text>
              <Text style={styles.infoValue}>45 unit</Text>
            </View>
            <View style={styles.infoCol}>
              <Text style={styles.infoLabel}>Prioritas</Text>
              <Text style={styles.infoValue}>Sedang</Text>
            </View>
          </View>

          <View style={styles.actionsRow}>
            <TouchableOpacity style={styles.editBtn}>
              <Ionicons name="pencil-outline" size={14} color="#1A6237" style={{marginRight: 6}} />
              <Text style={styles.editBtnText}>Edit</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.deleteBtn}>
              <Ionicons name="trash-outline" size={16} color="#E53935" />
            </TouchableOpacity>
          </View>
        </View>

        <View style={{height: 20}} />
      </ScrollView>

      {/* Static Bottom Navigation */}
      <View style={styles.bottomNav}>
        <View style={styles.navItem}>
          <Ionicons name="settings-outline" size={24} color="#2E8B57" />
          <Text style={styles.navText}>Admin</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F4F9F5' },
  header: { backgroundColor: '#2E8B57', paddingTop: 50, paddingBottom: 20, paddingHorizontal: 20 },
  headerTitle: { color: '#FFF', fontSize: 20, fontWeight: 'bold' },
  searchAddRow: { flexDirection: 'row', paddingHorizontal: 16, paddingVertical: 12 },
  searchBox: { flex: 1, backgroundColor: '#FFF', borderRadius: 12, height: 48, justifyContent: 'center', paddingHorizontal: 16, marginRight: 12, borderWidth: 1, borderColor: '#E0EAE3' },
  searchInput: { fontSize: 14, color: '#1A1A1A' },
  addBtn: { width: 48, height: 48, backgroundColor: '#2E8B57', borderRadius: 12, justifyContent: 'center', alignItems: 'center' },
  scrollContent: { padding: 16 },
  card: { backgroundColor: '#FFF', borderRadius: 16, padding: 20, marginBottom: 16, borderWidth: 1, borderColor: '#E0EAE3' },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 },
  medicineName: { fontSize: 16, fontWeight: 'bold', color: '#1A1A1A' },
  badge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 },
  badgeRed: { backgroundColor: '#FFEBEE' },
  badgeTextRed: { color: '#D32F2F', fontSize: 10, fontWeight: 'bold' },
  badgeOrange: { backgroundColor: '#FFF3E0' },
  badgeTextOrange: { color: '#E65100', fontSize: 10, fontWeight: 'bold' },
  tagsRow: { flexDirection: 'row', marginBottom: 16 },
  tag: { backgroundColor: '#E8F5E9', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8, marginRight: 8 },
  tagText: { color: '#2E8B57', fontSize: 10, fontWeight: 'bold' },
  infoRow: { flexDirection: 'row', backgroundColor: '#F4F9F5', borderRadius: 12, padding: 12, marginBottom: 16 },
  infoCol: { flex: 1 },
  infoLabel: { fontSize: 11, color: '#666', marginBottom: 4 },
  infoValue: { fontSize: 13, fontWeight: 'bold', color: '#1A1A1A' },
  actionsRow: { flexDirection: 'row' },
  editBtn: { flex: 1, flexDirection: 'row', backgroundColor: '#E8F5E9', height: 40, borderRadius: 20, justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  editBtnText: { color: '#1A6237', fontSize: 13, fontWeight: 'bold' },
  deleteBtn: { width: 40, height: 40, backgroundColor: '#FFEBEE', borderRadius: 20, justifyContent: 'center', alignItems: 'center' },
  bottomNav: { flexDirection: 'row', backgroundColor: '#FFF', height: 60, justifyContent: 'center', alignItems: 'center', borderTopWidth: 1, borderTopColor: '#E0EAE3' },
  navItem: { alignItems: 'center' },
  navText: { color: '#2E8B57', fontSize: 10, marginTop: 4, fontWeight: 'bold' }
});
