import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { useRouter } from 'expo-router';
import Colors from '../constants/colors';
import { pendingOrdersData } from '../data/mockData';

const { width } = Dimensions.get('window');

export default function DashboardApoteker() {
  const router = useRouter();
  const userName = 'Joy Christian Barus, S.Farm';

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* ====== HEADER GRADIENT ====== */}
      <View style={styles.headerGradient}>
        {/* Baris Atas */}
        <View style={styles.headerTop}>
          <View style={styles.headerLeft}>
            <View style={styles.logoBox}>
              <Text style={styles.logoIcon}>🏥</Text>
            </View>
            <View>
              <Text style={styles.headerTitle}>Apotek Permata</Text>
              <Text style={styles.headerSubtitle}>SISTEM MANAJEMEN</Text>
            </View>
          </View>
          <View style={styles.headerRight}>
            <TouchableOpacity style={styles.bellButton}>
              <Text style={styles.bellIcon}>🔔</Text>
              <View style={styles.bellBadge}>
                <Text style={styles.bellBadgeText}>2</Text>
              </View>
            </TouchableOpacity>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>JC</Text>
            </View>
          </View>
        </View>

        {/* Greeting */}
        <View style={styles.greetingSection}>
          <Text style={styles.greetingLabel}>Selamat datang,</Text>
          <Text style={styles.greetingName}>{userName}</Text>
          <Text style={styles.greetingRole}>Dashboard Apoteker</Text>
        </View>
      </View>

      {/* ====== STAT CARDS ====== */}
      <View style={styles.content}>
        <View style={styles.statsRow}>
          <TouchableOpacity
            style={styles.statCard}
            onPress={() => router.push('/validasi-resep')}
            activeOpacity={0.7}
          >
            <View style={[styles.statIconBox, { backgroundColor: Colors.accent50 }]}>
              <Text style={styles.statIcon}>📋</Text>
            </View>
            <Text style={styles.statValue}>2</Text>
            <Text style={styles.statLabel}>Validasi Resep</Text>
          </TouchableOpacity>

          <View style={styles.statCard}>
            <View style={[styles.statIconBox, { backgroundColor: Colors.primary50 }]}>
              <Text style={styles.statIcon}>📦</Text>
            </View>
            <Text style={styles.statValue}>12</Text>
            <Text style={styles.statLabel}>Pesanan Hari Ini</Text>
          </View>

          <View style={styles.statCard}>
            <View style={[styles.statIconBox, { backgroundColor: Colors.errorBg }]}>
              <Text style={styles.statIcon}>⚠️</Text>
            </View>
            <Text style={styles.statValue}>5</Text>
            <Text style={styles.statLabel}>Stok Rendah</Text>
          </View>
        </View>

        {/* ====== TOMBOL NAVIGASI UTAMA ====== */}
        <View style={styles.navRow}>
          <TouchableOpacity
            style={styles.navButtonAmber}
            onPress={() => router.push('/validasi-resep')}
            activeOpacity={0.8}
          >
            <View style={styles.navIconCircle}>
              <Text style={styles.navIcon}>📋</Text>
            </View>
            <Text style={styles.navTitle}>Validasi Resep</Text>
            <Text style={styles.navDesc}>2 menunggu validasi</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.navButtonTeal}
            onPress={() => router.push('/data-obat')}
            activeOpacity={0.8}
          >
            <View style={styles.navIconCircle}>
              <Text style={styles.navIcon}>💊</Text>
            </View>
            <Text style={styles.navTitle}>Data Obat</Text>
            <Text style={styles.navDesc}>Kelola inventaris</Text>
          </TouchableOpacity>
        </View>

        {/* ====== PESAN MENUNGGU ====== */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Pesan Menunggu</Text>
          <View style={styles.sectionBadge}>
            <Text style={styles.sectionBadgeText}>{pendingOrdersData.length} pesanan</Text>
          </View>
        </View>

        {pendingOrdersData.map((order) => (
          <View key={order.id} style={styles.orderCard}>
            <View style={styles.orderTop}>
              <View style={styles.orderLeft}>
                <View style={[
                  styles.orderIconBox,
                  { backgroundColor: order.type === 'prescription' ? Colors.accent50 : Colors.primary50 }
                ]}>
                  <Text style={styles.orderIcon}>
                    {order.type === 'prescription' ? '📋' : '🛍️'}
                  </Text>
                </View>
                <View>
                  <Text style={styles.orderId}>{order.id}</Text>
                  <Text style={styles.orderInfo}>{order.customer} · {order.items} item</Text>
                </View>
              </View>
              <View style={[
                styles.orderStatusBadge,
                {
                  backgroundColor: order.status === 'Proses' ? Colors.infoBg : Colors.accent50,
                }
              ]}>
                <Text style={[
                  styles.orderStatusText,
                  { color: order.status === 'Proses' ? Colors.info : Colors.accent500 }
                ]}>
                  {order.status}
                </Text>
              </View>
            </View>
            <View style={styles.orderBottom}>
              <Text style={styles.orderTime}>🕐 {order.date} · {order.time}</Text>
              <TouchableOpacity>
                <Text style={styles.orderDetailBtn}>Lihat Detail →</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}

        {/* Spacer bawah */}
        <View style={{ height: 30 }} />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.gray50,
  },

  // --- HEADER ---
  headerGradient: {
    backgroundColor: Colors.primary700,
    paddingTop: 48,
    paddingBottom: 36,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  logoBox: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.15)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoIcon: { fontSize: 20 },
  headerTitle: {
    color: Colors.white,
    fontWeight: '800',
    fontSize: 17,
  },
  headerSubtitle: {
    color: Colors.primary100,
    fontSize: 10,
    fontWeight: '600',
    letterSpacing: 1.5,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  bellButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  bellIcon: { fontSize: 16 },
  bellBadge: {
    position: 'absolute',
    top: -2,
    right: -2,
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#EF4444',
    justifyContent: 'center',
    alignItems: 'center',
  },
  bellBadgeText: {
    color: Colors.white,
    fontSize: 9,
    fontWeight: '700',
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.accent400,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    color: Colors.primary900,
    fontWeight: '800',
    fontSize: 12,
  },

  // --- GREETING ---
  greetingSection: {},
  greetingLabel: {
    color: Colors.primary100,
    fontSize: 14,
    fontWeight: '500',
  },
  greetingName: {
    color: Colors.white,
    fontSize: 22,
    fontWeight: '800',
    marginTop: 2,
  },
  greetingRole: {
    color: 'rgba(201,232,217,0.6)',
    fontSize: 12,
    marginTop: 4,
  },

  // --- CONTENT ---
  content: {
    paddingHorizontal: 20,
    marginTop: 16,
  },

  // --- STAT CARDS ---
  statsRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 20,
  },
  statCard: {
    flex: 1,
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  statIconBox: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  statIcon: { fontSize: 18 },
  statValue: {
    fontSize: 22,
    fontWeight: '800',
    color: Colors.gray800,
  },
  statLabel: {
    fontSize: 11,
    color: Colors.gray500,
    marginTop: 2,
    fontWeight: '500',
  },

  // --- NAV BUTTONS ---
  navRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 28,
  },
  navButtonAmber: {
    flex: 1,
    backgroundColor: Colors.accent500,
    borderRadius: 16,
    padding: 16,
    shadowColor: Colors.accent500,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  navButtonTeal: {
    flex: 1,
    backgroundColor: Colors.primary500,
    borderRadius: 16,
    padding: 16,
    shadowColor: Colors.primary500,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  navIconCircle: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.15)',
  },
  navIcon: { fontSize: 20 },
  navTitle: {
    color: Colors.white,
    fontWeight: '700',
    fontSize: 14,
  },
  navDesc: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 12,
    marginTop: 4,
    fontWeight: '500',
  },

  // --- SECTION ---
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.gray800,
  },
  sectionBadge: {
    backgroundColor: Colors.primary50,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },
  sectionBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.primary600,
  },

  // --- ORDER CARDS ---
  orderCard: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: 16,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  orderTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  orderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  orderIconBox: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  orderIcon: { fontSize: 16 },
  orderId: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.gray800,
  },
  orderInfo: {
    fontSize: 12,
    color: Colors.gray500,
    marginTop: 2,
  },
  orderStatusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },
  orderStatusText: {
    fontSize: 11,
    fontWeight: '700',
  },
  orderBottom: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: Colors.gray50,
  },
  orderTime: {
    fontSize: 11,
    color: Colors.gray400,
    fontWeight: '500',
  },
  orderDetailBtn: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.primary600,
  },
});