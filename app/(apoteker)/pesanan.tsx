import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, StatusBar } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function PesananApotekerScreen() {
  const [activeTab, setActiveTab] = useState('Menunggu');
  const tabs = ['Menunggu', 'Diproses', 'Selesai'];

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#2E8B57" />
      
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Pesanan Masuk</Text>
      </View>

      {/* Filter Tabs */}
      <View style={styles.filterContainer}>
        {tabs.map((tab) => (
          <TouchableOpacity 
            key={tab} 
            style={[styles.filterTab, activeTab === tab && styles.filterTabActive]}
            onPress={() => setActiveTab(tab)}
          >
            <Text style={[styles.filterText, activeTab === tab && styles.filterTextActive]}>{tab}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        
        {/* Card 1 */}
        <View style={styles.orderCard}>
          <View style={styles.cardHeader}>
            <View>
              <Text style={styles.orderId}>APT-XYZ123</Text>
              <Text style={styles.orderUser}>Budi Santoso</Text>
            </View>
            <View style={[styles.badge, styles.badgeOrange]}>
              <Text style={styles.badgeTextOrange}>Menunggu</Text>
            </View>
          </View>

          <View style={styles.orderInfoArea}>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Item</Text>
              <Text style={styles.infoValue}>3 item</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Total</Text>
              <Text style={styles.totalValue}>Rp 55.000</Text>
            </View>
          </View>

          <View style={styles.actionRow}>
            <TouchableOpacity style={styles.acceptBtn}>
              <Ionicons name="checkmark" size={16} color="#FFF" style={{marginRight: 6}} />
              <Text style={styles.acceptBtnText}>Terima</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.detailBtn}>
              <Text style={styles.detailBtnText}>Detail</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Card 2 */}
        <View style={styles.orderCard}>
          <View style={styles.cardHeader}>
            <View>
              <Text style={styles.orderId}>APT-ABC456</Text>
              <Text style={styles.orderUser}>Siti Aminah</Text>
            </View>
            <View style={[styles.badge, styles.badgeOrange]}>
              <Text style={styles.badgeTextOrange}>Menunggu</Text>
            </View>
          </View>

          <View style={styles.orderInfoArea}>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Item</Text>
              <Text style={styles.infoValue}>2 item</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Total</Text>
              <Text style={styles.totalValue}>Rp 75.000</Text>
            </View>
          </View>

          <View style={styles.actionRow}>
            <TouchableOpacity style={styles.acceptBtn}>
              <Ionicons name="checkmark" size={16} color="#FFF" style={{marginRight: 6}} />
              <Text style={styles.acceptBtnText}>Terima</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.detailBtn}>
              <Text style={styles.detailBtnText}>Detail</Text>
            </TouchableOpacity>
          </View>
        </View>

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F4F9F5' },
  header: { backgroundColor: '#2E8B57', paddingTop: 50, paddingBottom: 20, paddingHorizontal: 20 },
  headerTitle: { color: '#FFF', fontSize: 20, fontWeight: 'bold' },
  filterContainer: { flexDirection: 'row', backgroundColor: '#FFF', paddingHorizontal: 16, paddingVertical: 12, justifyContent: 'space-between' },
  filterTab: { flex: 1, alignItems: 'center', paddingVertical: 8, borderRadius: 20, marginHorizontal: 4, backgroundColor: '#FFF' },
  filterTabActive: { backgroundColor: '#2E8B57' },
  filterText: { fontSize: 13, color: '#666', fontWeight: '500' },
  filterTextActive: { color: '#FFF', fontWeight: 'bold' },
  scrollContent: { padding: 16 },
  orderCard: { backgroundColor: '#FFF', borderRadius: 16, padding: 20, marginBottom: 16, borderWidth: 1, borderColor: '#E0EAE3' },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 },
  orderId: { fontSize: 15, fontWeight: 'bold', color: '#1A1A1A', marginBottom: 4 },
  orderUser: { fontSize: 13, color: '#666' },
  badge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 },
  badgeOrange: { backgroundColor: '#FFF3E0' },
  badgeTextOrange: { color: '#E65100', fontSize: 11, fontWeight: 'bold' },
  orderInfoArea: { backgroundColor: '#F4F9F5', borderRadius: 12, padding: 16, marginBottom: 16 },
  infoRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  infoLabel: { fontSize: 13, color: '#666' },
  infoValue: { fontSize: 13, fontWeight: 'bold', color: '#1A1A1A' },
  totalValue: { fontSize: 14, fontWeight: 'bold', color: '#2E8B57' },
  actionRow: { flexDirection: 'row', justifyContent: 'space-between' },
  acceptBtn: { flex: 0.75, flexDirection: 'row', backgroundColor: '#2E8B57', height: 40, borderRadius: 20, justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  acceptBtnText: { color: '#FFF', fontSize: 13, fontWeight: 'bold' },
  detailBtn: { flex: 0.25, backgroundColor: '#E8F5E9', height: 40, borderRadius: 20, justifyContent: 'center', alignItems: 'center' },
  detailBtnText: { color: '#1A6237', fontSize: 13, fontWeight: 'bold' }
});
