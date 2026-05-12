import React from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, StatusBar } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

export default function AdminEdukasiScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#1A6237" />
      
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color="#FFF" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Konten Edukasi</Text>
        </View>
        <View style={styles.headerBottom}>
          <View style={styles.searchBox}>
            <Ionicons name="search" size={20} color="#888" style={styles.searchIcon} />
            <TextInput 
              style={styles.searchInput} 
              placeholder="Cari konten edukasi (artikel, video, kategori)..." 
              placeholderTextColor="#888"
            />
          </View>
          <TouchableOpacity style={styles.cartBtn}>
            <Ionicons name="cart-outline" size={26} color="#FFF" />
            <View style={styles.badge}>
              <Text style={styles.badgeText}>1</Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Kategori */}
        <View style={styles.categoryContainer}>
          <TouchableOpacity style={styles.categoryItem}>
            <View style={styles.categoryIconCircle}>
              <Ionicons name="document-text-outline" size={24} color="#1A6237" />
            </View>
            <Text style={styles.categoryText}>Artikel</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.categoryItem}>
            <View style={styles.categoryIconCircle}>
              <Ionicons name="play-circle-outline" size={28} color="#1A6237" />
            </View>
            <Text style={styles.categoryText}>Video</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.categoryItem}>
            <View style={styles.categoryIconCircle}>
              <Ionicons name="stats-chart-outline" size={24} color="#1A6237" />
            </View>
            <Text style={styles.categoryText}>Infografis</Text>
          </TouchableOpacity>
        </View>

        {/* Daftar Konten Header */}
        <View style={styles.sectionHeaderRow}>
          <Text style={styles.mainSectionTitle}>Daftar Konten</Text>
          <TouchableOpacity style={styles.addContentBtn}>
            <Ionicons name="add" size={16} color="#FFF" style={{marginRight: 4}} />
            <Text style={styles.addContentText}>Tambah Konten Baru</Text>
          </TouchableOpacity>
        </View>

        {/* Konten Baru Belum Dipublikasikan */}
        <View style={styles.subSectionHeader}>
          <Text style={styles.subSectionTitle}>Konten Baru Belum Dipublikasikan</Text>
          <TouchableOpacity>
            <Text style={styles.linkText}>Lihat Semua {'>'}</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.gridContainer}>
          <View style={styles.contentCard}>
            <View style={styles.imagePlaceholderLight}>
              <Ionicons name="image-outline" size={32} color="#81C784" />
              <View style={styles.actionPill}>
                <Ionicons name="pencil" size={12} color="#666" style={{marginRight: 8}} />
                <Ionicons name="trash-outline" size={12} color="#E53935" />
              </View>
            </View>
            <Text style={styles.contentTitle} numberOfLines={2}>Edukasi Diabetes: Gaya Hidup Sehat</Text>
            <View style={styles.contentMeta}>
              <View style={styles.draftBadge}>
                <Text style={styles.draftText}>Draft</Text>
              </View>
              <View>
                <Text style={styles.metaLabel}>Terakhir diedit:</Text>
                <Text style={styles.metaValue}>5 mnt lalu</Text>
              </View>
            </View>
          </View>

          <View style={styles.contentCard}>
            <View style={styles.imagePlaceholderDark}>
              <Ionicons name="play-circle" size={40} color="#FFF" />
              <View style={styles.actionPill}>
                <Ionicons name="pencil" size={12} color="#666" style={{marginRight: 8}} />
                <Ionicons name="trash-outline" size={12} color="#E53935" />
              </View>
            </View>
            <Text style={styles.contentTitle} numberOfLines={2}>Tutorial Penggunaan Inhaler</Text>
            <View style={styles.contentMeta}>
              <View style={styles.draftBadge}>
                <Text style={styles.draftText}>Draft</Text>
              </View>
              <View>
                <Text style={styles.metaLabel}>Terakhir diedit:</Text>
                <Text style={styles.metaValue}>1 jam lalu</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Video Terbanyak Ditonton */}
        <View style={styles.subSectionHeader}>
          <Text style={styles.subSectionTitle}>Video Terbanyak Ditonton</Text>
          <TouchableOpacity>
            <Text style={styles.linkText}>Lihat Semua {'>'}</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.gridContainer}>
          <View style={styles.contentCard}>
            <View style={styles.imagePlaceholderDark}>
              <Ionicons name="play-circle" size={40} color="#FFF" />
              <View style={styles.actionPill}>
                <Ionicons name="pencil" size={12} color="#666" style={{marginRight: 8}} />
                <Ionicons name="trash-outline" size={12} color="#E53935" />
              </View>
            </View>
            <Text style={styles.contentTitle} numberOfLines={2}>Tutorial Penggunaan Inhaler</Text>
            <View style={styles.contentMetaSimple}>
              <Text style={styles.metaLabelInline}>Kategori: <Text style={styles.metaValueInline}>Vaksin</Text></Text>
              <Text style={styles.metaLabelInline}>👁 Dilihat: <Text style={styles.metaValueInline}>1.250 kali</Text></Text>
            </View>
          </View>

          <View style={styles.contentCard}>
            <View style={styles.imagePlaceholderDark}>
              <Ionicons name="play-circle" size={40} color="#FFF" />
              <View style={styles.actionPill}>
                <Ionicons name="pencil" size={12} color="#666" style={{marginRight: 8}} />
                <Ionicons name="trash-outline" size={12} color="#E53935" />
              </View>
            </View>
            <Text style={styles.contentTitle} numberOfLines={2}>Edukasi Vaksin untuk Anak</Text>
            <View style={styles.contentMetaSimple}>
              <Text style={styles.metaLabelInline}>Kategori: <Text style={styles.metaValueInline}>Vaksin</Text></Text>
              <Text style={styles.metaLabelInline}>👁 Dilihat: <Text style={styles.metaValueInline}>980 kali</Text></Text>
            </View>
          </View>
        </View>

        {/* Extra space for FAB */}
        <View style={{height: 80}} />
      </ScrollView>

      {/* Floating Action Button */}
      <TouchableOpacity style={styles.fab}>
        <Ionicons name="add" size={28} color="#FFF" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FAFAFA' },
  header: { backgroundColor: '#1A6237', paddingTop: 50, paddingBottom: 20, paddingHorizontal: 16 },
  headerTop: { flexDirection: 'row', alignItems: 'center', marginBottom: 16 },
  backBtn: { marginRight: 12 },
  headerTitle: { color: '#FFF', fontSize: 18, fontWeight: 'bold' },
  headerBottom: { flexDirection: 'row', alignItems: 'center' },
  searchBox: { flex: 1, flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFF', borderRadius: 24, paddingHorizontal: 12, height: 40 },
  searchIcon: { marginRight: 8 },
  searchInput: { flex: 1, fontSize: 13 },
  cartBtn: { marginLeft: 16, position: 'relative' },
  badge: { position: 'absolute', top: -5, right: -5, backgroundColor: '#E53935', borderRadius: 10, width: 18, height: 18, justifyContent: 'center', alignItems: 'center' },
  badgeText: { color: '#FFF', fontSize: 10, fontWeight: 'bold' },
  scrollContent: { padding: 16 },
  categoryContainer: { flexDirection: 'row', justifyContent: 'space-around', backgroundColor: '#FFF', paddingVertical: 20, borderRadius: 12, marginBottom: 20, borderWidth: 1, borderColor: '#F0F0F0' },
  categoryItem: { alignItems: 'center' },
  categoryIconCircle: { width: 60, height: 60, borderRadius: 30, borderWidth: 1, borderColor: '#1A6237', justifyContent: 'center', alignItems: 'center', marginBottom: 8 },
  categoryText: { fontSize: 12, fontWeight: 'bold', color: '#1A6237' },
  sectionHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  mainSectionTitle: { fontSize: 16, fontWeight: 'bold', color: '#1A1A1A' },
  addContentBtn: { flexDirection: 'row', backgroundColor: '#1A6237', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 20, alignItems: 'center' },
  addContentText: { color: '#FFF', fontSize: 12, fontWeight: 'bold' },
  subSectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  subSectionTitle: { fontSize: 13, fontWeight: 'bold', color: '#333' },
  linkText: { fontSize: 11, color: '#2E8B57', fontWeight: '600' },
  gridContainer: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 },
  contentCard: { width: '48%', backgroundColor: '#FFF', borderRadius: 12, overflow: 'hidden', borderWidth: 1, borderColor: '#F0F0F0' },
  imagePlaceholderLight: { height: 100, backgroundColor: '#E8F5E9', justifyContent: 'center', alignItems: 'center', position: 'relative' },
  imagePlaceholderDark: { height: 100, backgroundColor: '#81C784', justifyContent: 'center', alignItems: 'center', position: 'relative' },
  actionPill: { position: 'absolute', top: 8, right: 8, flexDirection: 'row', backgroundColor: '#FFF', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 12, elevation: 2 },
  contentTitle: { fontSize: 12, fontWeight: 'bold', color: '#1A1A1A', margin: 12, height: 32 },
  contentMeta: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12, paddingBottom: 12 },
  draftBadge: { backgroundColor: '#FFF3E0', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 4, marginRight: 8 },
  draftText: { color: '#E65100', fontSize: 10, fontWeight: 'bold' },
  metaLabel: { fontSize: 9, color: '#888' },
  metaValue: { fontSize: 9, color: '#333', fontWeight: 'bold' },
  contentMetaSimple: { paddingHorizontal: 12, paddingBottom: 12 },
  metaLabelInline: { fontSize: 10, color: '#888', marginBottom: 2 },
  metaValueInline: { color: '#333', fontWeight: 'bold' },
  fab: { position: 'absolute', bottom: 20, right: 20, width: 56, height: 56, borderRadius: 28, backgroundColor: '#1A6237', justifyContent: 'center', alignItems: 'center', elevation: 4, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 4, shadowOffset: {width: 0, height: 2} }
});
