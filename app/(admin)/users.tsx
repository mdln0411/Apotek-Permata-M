import React from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, StatusBar } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

export default function AdminUsersScreen() {
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
          <Text style={styles.headerTitle}>Manajemen User</Text>
        </View>
        <View style={styles.headerBottom}>
          <View style={styles.searchBox}>
            <Ionicons name="search" size={20} color="#888" style={styles.searchIcon} />
            <TextInput 
              style={styles.searchInput} 
              placeholder="Cari user (nama, email, id)..." 
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
            <Ionicons name="people-outline" size={20} color="#2E8B57" />
            <Text style={styles.statLabel}>Total User</Text>
            <Text style={styles.statValue}>1.250</Text>
          </View>
          <View style={styles.statCard}>
            <Ionicons name="person-outline" size={20} color="#2E8B57" />
            <Text style={styles.statLabel}>User Aktif</Text>
            <Text style={styles.statValue}>780</Text>
          </View>
          <View style={styles.statCard}>
            <Ionicons name="person-add-outline" size={20} color="#2E8B57" />
            <Text style={styles.statLabel}>User Baru</Text>
            <Text style={styles.statValue}>12</Text>
          </View>
          <View style={styles.statCard}>
            <Ionicons name="person-remove-outline" size={20} color="#888" />
            <Text style={styles.statLabel}>User Diblokir</Text>
            <Text style={styles.statValue}>3</Text>
          </View>
        </View>

        {/* Daftar User */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Daftar User</Text>
          <TouchableOpacity>
            <Text style={styles.linkText}>Lihat Semua {'>'}</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.userCard} onPress={() => router.push('/user-detail')}>
          <View style={[styles.avatar, { backgroundColor: '#C8E6C9' }]}>
            <Text style={[styles.avatarText, { color: '#2E8B57' }]}>JH</Text>
          </View>
          <View style={styles.userInfo}>
            <Text style={styles.userName}>JM-Jordan Michael</Text>
            <Text style={styles.userEmail}>Jordanopung@email.com</Text>
            <View style={styles.userStatusRow}>
              <View style={styles.statusBadgeActive}>
                <View style={styles.statusDotActive} />
                <Text style={styles.statusTextActive}>Aktif</Text>
              </View>
              <Text style={styles.userDate}>Bergabung: 15 Okt 2023</Text>
            </View>
          </View>
        </TouchableOpacity>

        <TouchableOpacity style={styles.userCard} onPress={() => router.push('/user-detail')}>
          <View style={[styles.avatar, { backgroundColor: '#E3F2FD' }]}>
            <Text style={[styles.avatarText, { color: '#1E88E5' }]}>JK</Text>
          </View>
          <View style={styles.userInfo}>
            <Text style={styles.userName}>JK-Joy Kabanjahe</Text>
            <Text style={styles.userEmail}>Kabanjahecity@email.com</Text>
            <View style={styles.userStatusRow}>
              <View style={styles.statusBadgeActive}>
                <View style={styles.statusDotActive} />
                <Text style={styles.statusTextActive}>Aktif</Text>
              </View>
              <Text style={styles.userDate}>Bergabung: 20 Okt 2023</Text>
            </View>
          </View>
        </TouchableOpacity>

        {/* Log Aktivitas User Terbaru */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Log Aktivitas User Terbaru</Text>
          <TouchableOpacity>
            <Text style={styles.linkText}>Lihat Semua {'>'}</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.logCard}>
          <Text style={styles.logTime}>5 mnt yang lalu</Text>
          <View style={styles.logContent}>
            <View style={styles.logIconWrapper}>
              <Ionicons name="document-text-outline" size={18} color="#2E8B57" />
            </View>
            <View style={styles.logInfo}>
              <Text style={styles.logUserName}>Jordan Michael</Text>
              <Text style={styles.logAction}>Membuat pesanan AP-1025</Text>
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
  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', marginBottom: 16 },
  statCard: { width: '48%', backgroundColor: '#FFF', borderRadius: 12, padding: 16, marginBottom: 12, borderWidth: 1, borderColor: '#F0F0F0', shadowColor: '#000', shadowOpacity: 0.02, shadowRadius: 4, elevation: 1 },
  statLabel: { fontSize: 11, color: '#666', marginTop: 8, marginBottom: 4 },
  statValue: { fontSize: 18, fontWeight: 'bold', color: '#1A1A1A' },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12, marginTop: 8 },
  sectionTitle: { fontSize: 14, fontWeight: 'bold', color: '#1A1A1A' },
  linkText: { fontSize: 12, color: '#2E8B57', fontWeight: '600' },
  userCard: { flexDirection: 'row', backgroundColor: '#FFF', borderRadius: 12, padding: 16, marginBottom: 12, borderWidth: 1, borderColor: '#F0F0F0', alignItems: 'center' },
  avatar: { width: 40, height: 40, borderRadius: 20, justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  avatarText: { fontSize: 14, fontWeight: 'bold' },
  userInfo: { flex: 1 },
  userName: { fontSize: 14, fontWeight: 'bold', color: '#1A1A1A', marginBottom: 2 },
  userEmail: { fontSize: 12, color: '#888', marginBottom: 8 },
  userStatusRow: { flexDirection: 'row', alignItems: 'center' },
  statusBadgeActive: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#E8F5E9', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 10, marginRight: 8 },
  statusDotActive: { width: 6, height: 6, borderRadius: 3, backgroundColor: '#2E8B57', marginRight: 4 },
  statusTextActive: { fontSize: 10, color: '#2E8B57', fontWeight: 'bold' },
  userDate: { fontSize: 11, color: '#888' },
  logCard: { backgroundColor: '#FFF', borderRadius: 12, padding: 16, marginBottom: 12, borderWidth: 1, borderColor: '#F0F0F0' },
  logTime: { fontSize: 11, color: '#888', marginBottom: 8 },
  logContent: { flexDirection: 'row', alignItems: 'center' },
  logIconWrapper: { width: 32, height: 32, borderRadius: 8, backgroundColor: '#E8F5E9', justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  logInfo: { flex: 1 },
  logUserName: { fontSize: 13, fontWeight: 'bold', color: '#1A1A1A', marginBottom: 2 },
  logAction: { fontSize: 12, color: '#666' },
  fab: { position: 'absolute', bottom: 20, right: 20, width: 56, height: 56, borderRadius: 28, backgroundColor: '#1A6237', justifyContent: 'center', alignItems: 'center', elevation: 4, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 4, shadowOffset: {width: 0, height: 2} }
});
