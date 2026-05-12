import React from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, Image, StatusBar } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

export default function AdminDashboardScreen() {
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
          <View style={styles.searchBox}>
            <Ionicons name="search" size={20} color="#888" style={styles.searchIcon} />
            <TextInput 
              style={styles.searchInput} 
              placeholder="Cari pesanan, pelanggan, obat..." 
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
        {/* Stats Grid */}
        <View style={styles.statsGrid}>
          <View style={styles.statCard}>
            <Ionicons name="pricetag-outline" size={20} color="#2E8B57" />
            <Text style={styles.statLabel}>Pesanan Baru Today</Text>
            <Text style={styles.statValue}>38</Text>
          </View>
          <View style={styles.statCard}>
            <Ionicons name="cash-outline" size={20} color="#2E8B57" />
            <Text style={styles.statLabel}>Pendapatan Today</Text>
            <Text style={styles.statValue}>Rp 2.150.000</Text>
          </View>
          <View style={styles.statCard}>
            <Ionicons name="cube-outline" size={20} color="#2E8B57" />
            <Text style={styles.statLabel}>Stok Rendah (Item)</Text>
            <Text style={styles.statValue}>12</Text>
          </View>
          <View style={styles.statCard}>
            <Ionicons name="chatbubble-outline" size={20} color="#2E8B57" />
            <Text style={styles.statLabel}>Obrolan Aktif</Text>
            <Text style={styles.statValue}>5</Text>
          </View>
        </View>

        {/* Pesanan Terbaru */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Pesanan Terbaru</Text>
          <TouchableOpacity>
            <Text style={styles.linkText}>Lihat Semua</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.orderCard}>
          <View style={styles.orderTop}>
            <Text style={styles.orderId}>Order ID: AP-1025</Text>
            <View style={styles.statusBadge}>
              <View style={styles.statusDot} />
              <Text style={styles.statusTextBadge}>New</Text>
            </View>
          </View>
          <Text style={styles.orderUser}>Yari aliong maefu</Text>
          <View style={styles.orderBottom}>
            <Text style={styles.orderTotal}>Total: <Text style={{fontWeight: 'bold'}}>Rp 90.000</Text></Text>
            <Text style={styles.orderStatus}>Status: Baru</Text>
          </View>
        </View>

        <View style={styles.orderCard}>
          <View style={styles.orderTop}>
            <Text style={styles.orderId}>Order ID: AP-1026</Text>
            <View style={styles.statusBadge}>
              <View style={styles.statusDot} />
              <Text style={styles.statusTextBadge}>New</Text>
            </View>
          </View>
          <Text style={styles.orderUser}>Memed Samosir</Text>
          <View style={styles.orderBottom}>
            <Text style={styles.orderTotal}>Total: <Text style={{fontWeight: 'bold'}}>Rp 90.000</Text></Text>
            <Text style={styles.orderStatus}>Status: Baru</Text>
          </View>
        </View>

        {/* Inventaris Terpopuler */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Inventaris Terpopuler</Text>
          <TouchableOpacity>
            <Text style={styles.linkText}>Lihat Semua</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.inventoryCard}>
          <View style={styles.inventoryImgPlaceholder}>
            <Ionicons name="medkit" size={30} color="#2E8B57" />
          </View>
          <View style={styles.inventoryInfo}>
            <Text style={styles.inventoryName}>Amoxicillin 500mg</Text>
            <Text style={styles.inventoryStock}>Sisa Stok: 48 kotak</Text>
            <Text style={styles.inventoryStatus}>Tersedia</Text>
          </View>
        </View>
        
        {/* Extra space for FAB */}
        <View style={{height: 80}} />
      </ScrollView>

      {/* Floating Action Button */}
      <TouchableOpacity style={styles.fab}>
        <Ionicons name="chatbubbles" size={20} color="#FFF" style={{marginRight: 8}} />
        <Text style={styles.fabText}>Kelola Obrolan Masuk</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FAFAFA' },
  header: { backgroundColor: '#1A6237', paddingTop: 50, paddingBottom: 20, paddingHorizontal: 16 },
  headerTop: { flexDirection: 'row', alignItems: 'center' },
  backBtn: { marginRight: 12 },
  searchBox: { flex: 1, flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFF', borderRadius: 24, paddingHorizontal: 12, height: 40 },
  searchIcon: { marginRight: 8 },
  searchInput: { flex: 1, fontSize: 13 },
  cartBtn: { marginLeft: 16, position: 'relative' },
  badge: { position: 'absolute', top: -5, right: -5, backgroundColor: '#E53935', borderRadius: 10, width: 18, height: 18, justifyContent: 'center', alignItems: 'center' },
  badgeText: { color: '#FFF', fontSize: 10, fontWeight: 'bold' },
  scrollContent: { padding: 16 },
  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', marginBottom: 20 },
  statCard: { width: '48%', backgroundColor: '#FFF', borderRadius: 12, padding: 16, marginBottom: 12, borderWidth: 1, borderColor: '#F0F0F0', shadowColor: '#000', shadowOpacity: 0.02, shadowRadius: 4, elevation: 1 },
  statLabel: { fontSize: 11, color: '#666', marginTop: 8, marginBottom: 4 },
  statValue: { fontSize: 18, fontWeight: 'bold', color: '#1A1A1A' },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12, marginTop: 8 },
  sectionTitle: { fontSize: 15, fontWeight: 'bold', color: '#1A1A1A' },
  linkText: { fontSize: 13, color: '#2E8B57', fontWeight: '600' },
  orderCard: { backgroundColor: '#FFF', borderRadius: 12, padding: 16, marginBottom: 12, borderWidth: 1, borderColor: '#F0F0F0' },
  orderTop: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 },
  orderId: { fontSize: 14, fontWeight: 'bold', color: '#1A1A1A' },
  statusBadge: { flexDirection: 'row', alignItems: 'center' },
  statusDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: '#2E8B57', marginRight: 4 },
  statusTextBadge: { fontSize: 12, color: '#2E8B57', fontWeight: 'bold' },
  orderUser: { fontSize: 13, color: '#666', marginBottom: 12 },
  orderBottom: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  orderTotal: { fontSize: 13, color: '#1A1A1A' },
  orderStatus: { fontSize: 12, color: '#888' },
  inventoryCard: { flexDirection: 'row', backgroundColor: '#FFF', borderRadius: 12, padding: 16, borderWidth: 1, borderColor: '#F0F0F0', alignItems: 'center' },
  inventoryImgPlaceholder: { width: 50, height: 50, borderRadius: 8, backgroundColor: '#E8F5E9', justifyContent: 'center', alignItems: 'center', marginRight: 16 },
  inventoryInfo: { flex: 1 },
  inventoryName: { fontSize: 14, fontWeight: 'bold', color: '#1A1A1A', marginBottom: 4 },
  inventoryStock: { fontSize: 12, color: '#666', marginBottom: 2 },
  inventoryStatus: { fontSize: 12, color: '#2E8B57', fontWeight: 'bold' },
  fab: { position: 'absolute', bottom: 20, alignSelf: 'center', flexDirection: 'row', backgroundColor: '#1A6237', paddingVertical: 12, paddingHorizontal: 20, borderRadius: 24, elevation: 4, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 4, shadowOffset: {width: 0, height: 2}, alignItems: 'center' },
  fabText: { color: '#FFF', fontSize: 14, fontWeight: 'bold' }
});
