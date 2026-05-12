import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, StatusBar } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

export default function AdminUserDetailScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#1A6237" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#FFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Detail User</Text>
        <TouchableOpacity style={styles.bellBtn}>
          <Ionicons name="notifications-outline" size={24} color="#FFF" />
          <View style={styles.badge}>
            <Text style={styles.badgeText}></Text>
          </View>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Profile Card */}
        <View style={styles.profileCard}>
          <View style={styles.profileTop}>
            <View style={styles.avatar}>
              <Ionicons name="person" size={40} color="#CCC" />
            </View>
            <View style={styles.profileInfo}>
              <Text style={styles.profileName}>Ketua Samosir</Text>
              <Text style={styles.profileEmail}>Kabanjahecity@email.com</Text>
            </View>
          </View>

          <View style={styles.divider} />

          <View style={styles.profileBadges}>
            <View style={styles.badgeCol}>
              <View style={styles.badgeLabelContainer}><Text style={styles.badgeLabel}>Peran</Text></View>
              <Text style={styles.badgeValue}>PM</Text>
            </View>
            <View style={styles.verticalDivider} />
            <View style={styles.badgeCol}>
              <View style={styles.badgeLabelContainer}><Text style={styles.badgeLabel}>Status</Text></View>
              <View style={styles.statusRow}>
                <View style={styles.statusDot} />
                <Text style={styles.statusText}>Aktif</Text>
              </View>
            </View>
            <View style={styles.verticalDivider} />
            <View style={styles.badgeCol}>
              <View style={styles.badgeLabelContainer}><Text style={styles.badgeLabel}>User ID</Text></View>
              <Text style={styles.badgeValue}>#U-0012</Text>
            </View>
          </View>
        </View>

        {/* Riwayat Aktivitas */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Riwayat Aktivitas</Text>
          <TouchableOpacity>
            <Text style={styles.linkText}>Lihat Semua {'>'}</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.timelineCard}>
          {/* Timeline Item 1 */}
          <View style={styles.timelineItem}>
            <View style={styles.timelineIconWrapper}>
              <Ionicons name="key-outline" size={18} color="#2E8B57" />
            </View>
            <View style={styles.timelineContent}>
              <Text style={styles.timelineTime}>15 Oktober 2023, 14:30</Text>
              <Text style={styles.timelineTitle}>Login Berhasil</Text>
              <Text style={styles.timelineDesc}>Login melalui perangkat web (Chrome)</Text>
            </View>
          </View>

          {/* Timeline Item 2 */}
          <View style={styles.timelineItem}>
            <View style={styles.timelineIconWrapper}>
              <Ionicons name="cart-outline" size={18} color="#2E8B57" />
            </View>
            <View style={styles.timelineContent}>
              <Text style={styles.timelineTime}>14 Oktober 2023, 10:15</Text>
              <Text style={styles.timelineTitle}>Memproses Pesanan</Text>
              <Text style={styles.timelineDesc}>Memproses pesanan AP-1025 dari user Ketua samosir</Text>
            </View>
          </View>

          {/* Timeline Item 3 */}
          <View style={styles.timelineItem}>
            <View style={styles.timelineIconWrapper}>
              <Ionicons name="cube-outline" size={18} color="#2E8B57" />
            </View>
            <View style={styles.timelineContent}>
              <Text style={styles.timelineTime}>15 Oktober 2023, 14:30</Text>
              <Text style={styles.timelineTitle}>Memperbarui Stok</Text>
              <Text style={styles.timelineDesc}>Memperbarui stok Amokisillin 500mg (+50 kotak)</Text>
            </View>
          </View>

          {/* Timeline Item 4 */}
          <View style={styles.timelineItem}>
            <View style={[styles.timelineIconWrapper, { position: 'relative' }]}>
              <Ionicons name="chatbubble-ellipses-outline" size={18} color="#2E8B57" />
              <View style={styles.chatBadge}><Text style={styles.chatBadgeText}>1</Text></View>
            </View>
            <View style={styles.timelineContent}>
              <Text style={styles.timelineTime}>14 Oktober 2023, 10:15</Text>
              <Text style={styles.timelineTitle}>Menjawab Konsultasi</Text>
              <Text style={styles.timelineDesc}>Menjawab pertanyaan konsultasi mengenai dosis Amokisillin</Text>
            </View>
          </View>
        </View>

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FAFAFA' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#1A6237', paddingTop: 50, paddingBottom: 20, paddingHorizontal: 16 },
  backBtn: { padding: 4 },
  headerTitle: { color: '#FFF', fontSize: 18, fontWeight: 'bold' },
  bellBtn: { padding: 4, position: 'relative' },
  badge: { position: 'absolute', top: 4, right: 6, backgroundColor: '#E53935', borderRadius: 4, width: 8, height: 8 },
  badgeText: { display: 'none' },
  scrollContent: { padding: 16 },
  profileCard: { backgroundColor: '#FFF', borderRadius: 16, padding: 20, marginBottom: 20, borderWidth: 1, borderColor: '#F0F0F0', elevation: 2, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 8 },
  profileTop: { flexDirection: 'row', alignItems: 'center', marginBottom: 16 },
  avatar: { width: 64, height: 64, borderRadius: 32, backgroundColor: '#F0F0F0', justifyContent: 'center', alignItems: 'center', marginRight: 16, overflow: 'hidden' },
  profileInfo: { flex: 1 },
  profileName: { fontSize: 18, fontWeight: 'bold', color: '#1A1A1A', marginBottom: 4 },
  profileEmail: { fontSize: 13, color: '#666' },
  divider: { height: 1, backgroundColor: '#F0F0F0', marginVertical: 12 },
  profileBadges: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  badgeCol: { flex: 1, alignItems: 'center' },
  verticalDivider: { width: 1, height: 30, backgroundColor: '#F0F0F0' },
  badgeLabelContainer: { backgroundColor: '#1A6237', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12, marginBottom: 8 },
  badgeLabel: { fontSize: 10, color: '#FFF', fontWeight: 'bold' },
  badgeValue: { fontSize: 13, fontWeight: 'bold', color: '#1A1A1A' },
  statusRow: { flexDirection: 'row', alignItems: 'center' },
  statusDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#2E8B57', marginRight: 4 },
  statusText: { fontSize: 13, fontWeight: 'bold', color: '#2E8B57' },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  sectionTitle: { fontSize: 16, fontWeight: 'bold', color: '#1A1A1A' },
  linkText: { fontSize: 12, color: '#2E8B57', fontWeight: '600' },
  timelineCard: { backgroundColor: '#FFF', borderRadius: 16, padding: 20, borderWidth: 1, borderColor: '#F0F0F0', elevation: 2, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 8 },
  timelineItem: { flexDirection: 'row', marginBottom: 24 },
  timelineIconWrapper: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#E8F5E9', justifyContent: 'center', alignItems: 'center', marginRight: 16 },
  chatBadge: { position: 'absolute', top: -2, right: -2, backgroundColor: '#E53935', borderRadius: 8, width: 16, height: 16, justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: '#FFF' },
  chatBadgeText: { color: '#FFF', fontSize: 9, fontWeight: 'bold' },
  timelineContent: { flex: 1 },
  timelineTime: { fontSize: 10, color: '#888', marginBottom: 4 },
  timelineTitle: { fontSize: 14, fontWeight: 'bold', color: '#1A1A1A', marginBottom: 4 },
  timelineDesc: { fontSize: 12, color: '#666', lineHeight: 18 }
});
