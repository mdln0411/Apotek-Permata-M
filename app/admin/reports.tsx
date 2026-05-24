import {
  getAdminReports,
  ReportData,
  ReportFilters,
  ReportTransaction,
} from '@/api/reportService';
import AdminSidebar from '@/components/AdminSidebar';
import { AppAlertModal } from '@/components/AppAlertModal';
import ReportCharts from '@/components/admin/ReportCharts';
import { ReportSkeleton } from '@/components/admin/ReportSkeleton';
import ReportStatCard from '@/components/admin/ReportStatCard';
import ApotekLogo from '@/components/ApotekLogo';
import { exportReportPdf, printReport } from '@/utils/reportPdf';
import { getOrderStatusColors, getOrderStatusLabel } from '@/utils/orderStatus';
import { Feather, Ionicons } from '@expo/vector-icons';
import { Stack, useFocusEffect } from 'expo-router';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Animated,
  Modal,
  Platform,
  RefreshControl,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

const DEFAULT_FILTERS: ReportFilters = {
  period: 'month',
  sort: 'desc',
  page: 1,
  per_page: 10,
};

export default function AdminReports() {
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const [page, setPage] = useState(1);
  const [reportData, setReportData] = useState<ReportData | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [selectedTx, setSelectedTx] = useState<ReportTransaction | null>(null);
  const [alert, setAlert] = useState<{ title: string; message: string; type: 'success' | 'error' | 'info' } | null>(null);
  const hasLoaded = useRef(false);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  const filters: ReportFilters = { ...DEFAULT_FILTERS, page };

  const fetchReports = useCallback(
    async (mode: 'initial' | 'refresh' | 'silent' = 'initial') => {
      if (mode === 'refresh') setRefreshing(true);
      else if (mode === 'initial' && !hasLoaded.current) setLoading(true);

      try {
        const res = await getAdminReports(filters);
        if (res.status === 'success') {
          setReportData(res.data);
          hasLoaded.current = true;
          Animated.timing(fadeAnim, { toValue: 1, duration: 400, useNativeDriver: true }).start();
        }
      } catch (e) {
        console.error('Error fetching reports:', e);
        if (mode !== 'silent') {
          setAlert({ title: 'Gagal Memuat', message: 'Tidak dapat memuat data laporan. Periksa koneksi Anda.', type: 'error' });
        }
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [filters, fadeAnim],
  );

  useFocusEffect(
    useCallback(() => {
      fetchReports(hasLoaded.current ? 'silent' : 'initial');
    }, [fetchReports]),
  );

  useEffect(() => {
    if (hasLoaded.current) {
      fetchReports('silent');
    }
  }, [page, fetchReports]);

  const handlePrint = async () => {
    if (!reportData) return;
    setExporting(true);
    try {
      await printReport(reportData);
    } catch {
      setAlert({ title: 'Gagal Cetak', message: 'Tidak dapat membuka dialog cetak.', type: 'error' });
    } finally {
      setExporting(false);
    }
  };

  const handleExportPdf = async () => {
    if (!reportData) return;
    setExporting(true);
    try {
      const { shared } = await exportReportPdf(reportData);
      setAlert({
        title: 'Export Berhasil',
        message: shared
          ? 'Laporan PDF siap disimpan ke perangkat Anda.'
          : 'Laporan PDF berhasil dibuat.',
        type: 'success',
      });
    } catch {
      setAlert({ title: 'Gagal Export', message: 'Tidak dapat membuat file PDF.', type: 'error' });
    } finally {
      setExporting(false);
    }
  };

  const changePage = (nextPage: number) => setPage(nextPage);

  const pagination = reportData?.transactions.pagination;

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />

      <AdminSidebar visible={sidebarVisible} onClose={() => setSidebarVisible(false)} activePage="reports" />

      <View style={styles.topBar}>
        <View style={styles.headerLeft}>
          <TouchableOpacity onPress={() => setSidebarVisible(true)} style={styles.menuIcon}>
            <Ionicons name="menu" size={28} color="#FFF" />
          </TouchableOpacity>
          <ApotekLogo size={32} borderRadius={8} />
          <View>
            <Text style={styles.headerTitleText}>Laporan Apotek</Text>
            {reportData && (
              <Text style={styles.headerSub}>
                {reportData.date_from} — {reportData.date_to}
              </Text>
            )}
          </View>
        </View>
        <View style={styles.headerActions}>
          {exporting ? (
            <ActivityIndicator color="#FFF" size="small" />
          ) : (
            <>
              <TouchableOpacity style={styles.printBtn} onPress={handleExportPdf} accessibilityLabel="Export PDF">
                <Feather name="download" size={18} color="#FFF" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.printBtn} onPress={handlePrint} accessibilityLabel="Cetak laporan">
                <Feather name="printer" size={18} color="#FFF" />
              </TouchableOpacity>
            </>
          )}
        </View>
      </View>

      {loading && !reportData ? (
        <ReportSkeleton />
      ) : (
        <Animated.ScrollView
          style={{ opacity: fadeAnim }}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={() => fetchReports('refresh')} colors={['#2E8B57']} />
          }
        >
          {/* Ringkasan Statistik */}
          <SectionTitle icon="pie-chart" title="Ringkasan Statistik" subtitle="Metrik utama apotek" />
          <View style={styles.statsGrid}>
            {(reportData?.summary ?? []).map((card) => (
              <ReportStatCard key={card.key} card={card} />
            ))}
          </View>

          {/* Grafik */}
          {reportData && (
            <>
              <SectionTitle icon="bar-chart-2" title="Grafik Penjualan & Analitik" subtitle="Visualisasi data interaktif" />
              <ReportCharts
                revenueLine={reportData.charts.revenue_line}
                bestSellersBar={reportData.charts.best_sellers_bar}
                orderStatusPie={reportData.charts.order_status_pie}
                weeklyArea={reportData.charts.weekly_transactions_area}
                monthlyRevenue={reportData.charts.monthly_revenue}
              />
            </>
          )}

          {/* Statistik Pesanan & Pembayaran */}
          {reportData && (
            <View style={styles.twoCol}>
              <View style={[styles.infoCard, styles.halfCard]}>
                <Text style={styles.infoCardTitle}>Statistik Pesanan</Text>
                {reportData.order_stats.length === 0 ? (
                  <Text style={styles.emptyText}>Belum ada data</Text>
                ) : (
                  reportData.order_stats.map((s) => (
                    <View key={s.status} style={styles.infoRow}>
                      <View style={[styles.dot, { backgroundColor: getOrderStatusColors(s.status).text }]} />
                      <Text style={styles.infoLabel}>{getOrderStatusLabel(s.status)}</Text>
                      <Text style={styles.infoValue}>{s.count}</Text>
                    </View>
                  ))
                )}
              </View>
              <View style={[styles.infoCard, styles.halfCard]}>
                <Text style={styles.infoCardTitle}>Statistik Pembayaran</Text>
                {reportData.payment_stats.by_method.map((p) => (
                  <View key={p.method} style={styles.infoRow}>
                    <Text style={styles.infoLabel}>{p.label ?? p.method}</Text>
                    <Text style={styles.infoValue}>{p.count}x</Text>
                  </View>
                ))}
              </View>
            </View>
          )}

          {/* Statistik Pengguna */}
          {reportData && (
            <View style={styles.infoCard}>
              <Text style={styles.infoCardTitle}>Statistik Pengguna</Text>
              <View style={styles.userStatsRow}>
                <UserStatBox label="Total Pasien" value={reportData.user_stats.total} color="#7B1FA2" />
                <UserStatBox label="Baru Bulan Ini" value={reportData.user_stats.new_this_month} color="#2E8B57" />
                <UserStatBox label="Apoteker Aktif" value={reportData.user_stats.active_pharmacists} color="#1976D2" />
              </View>
            </View>
          )}

          {/* Aktivitas Apoteker */}
          {reportData && (
            <>
              <SectionTitle icon="users" title="Aktivitas Apoteker" subtitle="Performa tim apotek" />
              <View style={styles.infoCard}>
                {reportData.pharmacist_activity.length === 0 ? (
                  <Text style={styles.emptyText}>Belum ada aktivitas apoteker</Text>
                ) : (
                  reportData.pharmacist_activity.map((a) => (
                    <View key={a.id} style={styles.apotekerRow}>
                      <View style={styles.apotekerAvatar}>
                        <Text style={styles.apotekerInitial}>{a.name.charAt(0)}</Text>
                      </View>
                      <View style={styles.apotekerInfo}>
                        <Text style={styles.apotekerName}>{a.name}</Text>
                        <Text style={styles.apotekerMeta}>
                          {a.orders_processed} pesanan · {a.payments_verified} verifikasi
                        </Text>
                      </View>
                      <View style={[styles.activeBadge, { backgroundColor: a.is_active ? '#E8F5E9' : '#F5F5F5' }]}>
                        <Text style={[styles.activeBadgeText, { color: a.is_active ? '#2E8B57' : '#999' }]}>
                          {a.is_active ? 'Aktif' : 'Nonaktif'}
                        </Text>
                      </View>
                    </View>
                  ))
                )}
              </View>
            </>
          )}

          {/* Riwayat Transaksi */}
          <SectionTitle icon="list" title="Riwayat Transaksi" subtitle="Detail lengkap semua transaksi" />

          <View style={styles.txCard}>
            {(reportData?.transactions.data ?? []).length === 0 ? (
              <View style={styles.emptyState}>
                <Feather name="inbox" size={40} color="#CCC" />
                <Text style={styles.emptyStateTitle}>Belum Ada Transaksi</Text>
                <Text style={styles.emptyStateSub}>Transaksi akan muncul di sini setelah ada pesanan</Text>
              </View>
            ) : (
              reportData?.transactions.data.map((tx) => (
                <TouchableOpacity key={tx.id} style={styles.txRow} onPress={() => setSelectedTx(tx)} activeOpacity={0.8}>
                  <View style={styles.txLeft}>
                    <Text style={styles.txNum}>{tx.order_number}</Text>
                    <Text style={styles.txMeta}>{tx.patient_name} · {tx.apoteker_name}</Text>
                    <Text style={styles.txDate}>{tx.created_at_formatted}</Text>
                  </View>
                  <View style={styles.txRight}>
                    <Text style={styles.txAmount}>{tx.total_formatted}</Text>
                    <View style={[styles.statusBadge, { backgroundColor: getOrderStatusColors(tx.order_status).bg }]}>
                      <Text style={[styles.statusText, { color: getOrderStatusColors(tx.order_status).text }]}>
                        {getOrderStatusLabel(tx.order_status)}
                      </Text>
                    </View>
                    <Text style={styles.txItems}>{tx.item_count} item · {tx.payment_method}</Text>
                  </View>
                  <Feather name="chevron-right" size={16} color="#CCC" style={styles.txChevron} />
                </TouchableOpacity>
              ))
            )}
          </View>

          {pagination && pagination.last_page > 1 && (
            <View style={styles.pagination}>
              <TouchableOpacity
                style={[styles.pageBtn, pagination.current_page <= 1 && styles.pageBtnDisabled]}
                disabled={pagination.current_page <= 1}
                onPress={() => changePage(pagination.current_page - 1)}
              >
                <Feather name="chevron-left" size={18} color={pagination.current_page <= 1 ? '#CCC' : '#2E8B57'} />
              </TouchableOpacity>
              <Text style={styles.pageInfo}>
                Halaman {pagination.current_page} / {pagination.last_page} ({pagination.total} transaksi)
              </Text>
              <TouchableOpacity
                style={[styles.pageBtn, pagination.current_page >= pagination.last_page && styles.pageBtnDisabled]}
                disabled={pagination.current_page >= pagination.last_page}
                onPress={() => changePage(pagination.current_page + 1)}
              >
                <Feather name="chevron-right" size={18} color={pagination.current_page >= pagination.last_page ? '#CCC' : '#2E8B57'} />
              </TouchableOpacity>
            </View>
          )}

          <View style={{ height: 40 }} />
        </Animated.ScrollView>
      )}

      {/* Detail Transaksi Modal */}
      <Modal visible={!!selectedTx} animationType="slide" transparent onRequestClose={() => setSelectedTx(null)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Detail Transaksi</Text>
              <TouchableOpacity onPress={() => setSelectedTx(null)}>
                <Ionicons name="close" size={24} color="#333" />
              </TouchableOpacity>
            </View>
            {selectedTx && (
              <ScrollView showsVerticalScrollIndicator={false}>
                <DetailRow label="No. Transaksi" value={selectedTx.order_number} />
                <DetailRow label="Pasien" value={selectedTx.patient_name} />
                <DetailRow label="Apoteker" value={selectedTx.apoteker_name} />
                <DetailRow label="Tanggal" value={selectedTx.created_at_formatted} />
                <DetailRow label="Metode Bayar" value={selectedTx.payment_method} />
                <DetailRow label="Status Bayar" value={selectedTx.payment_status.toUpperCase()} />
                <DetailRow label="Status Pesanan" value={getOrderStatusLabel(selectedTx.order_status)} />
                <DetailRow label="Total" value={selectedTx.total_formatted} bold />

                <Text style={styles.itemsTitle}>Produk Dibeli ({selectedTx.item_count})</Text>
                {selectedTx.items.map((item, i) => (
                  <View key={i} style={styles.itemRow}>
                    <Text style={styles.itemName}>{item.name} × {item.quantity}</Text>
                    <Text style={styles.itemPrice}>Rp {Math.round(item.subtotal).toLocaleString('id-ID')}</Text>
                  </View>
                ))}
              </ScrollView>
            )}
          </View>
        </View>
      </Modal>

      <AppAlertModal
        visible={!!alert}
        type={alert?.type ?? 'info'}
        title={alert?.title ?? ''}
        message={alert?.message ?? ''}
        onClose={() => setAlert(null)}
      />
    </SafeAreaView>
  );
}

function SectionTitle({ icon, title, subtitle }: { icon: keyof typeof Feather.glyphMap; title: string; subtitle: string }) {
  return (
    <View style={styles.sectionHeader}>
      <View style={styles.sectionIcon}>
        <Feather name={icon} size={16} color="#2E8B57" />
      </View>
      <View>
        <Text style={styles.sectionTitle}>{title}</Text>
        <Text style={styles.sectionSub}>{subtitle}</Text>
      </View>
    </View>
  );
}

function UserStatBox({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <View style={styles.userStatBox}>
      <Text style={[styles.userStatValue, { color }]}>{value}</Text>
      <Text style={styles.userStatLabel}>{label}</Text>
    </View>
  );
}

function DetailRow({ label, value, bold }: { label: string; value: string; bold?: boolean }) {
  return (
    <View style={styles.detailRow}>
      <Text style={styles.detailLabel}>{label}</Text>
      <Text style={[styles.detailValue, bold && styles.detailValueBold]}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F4F8F4' },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: Platform.OS === 'ios' ? 20 : 50,
    paddingBottom: 16,
    backgroundColor: '#2E8B57',
  },
  headerLeft: { flexDirection: 'row', alignItems: 'center', gap: 10, flex: 1 },
  headerTitleText: { fontSize: 17, fontWeight: '800', color: '#FFF' },
  headerSub: { fontSize: 11, color: 'rgba(255,255,255,0.75)', marginTop: 1 },
  menuIcon: { width: 40, height: 40, justifyContent: 'center', alignItems: 'center' },
  headerActions: { flexDirection: 'row', gap: 8 },
  printBtn: {
    width: 40,
    height: 40,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollContent: { padding: 16 },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 14, marginTop: 8 },
  sectionIcon: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: '#E8F5E9',
    justifyContent: 'center',
    alignItems: 'center',
  },
  sectionTitle: { fontSize: 16, fontWeight: '800', color: '#1A2E1A' },
  sectionSub: { fontSize: 12, color: '#7A8A7A', marginTop: 1 },
  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', marginBottom: 8 },
  twoCol: { flexDirection: 'row', gap: 12, marginBottom: 16 },
  halfCard: { flex: 1 },
  infoCard: {
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#EEF2EE',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  infoCardTitle: { fontSize: 14, fontWeight: '700', color: '#333', marginBottom: 12 },
  infoRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 6, borderBottomWidth: 1, borderBottomColor: '#F5F5F5' },
  dot: { width: 8, height: 8, borderRadius: 4, marginRight: 8 },
  infoLabel: { flex: 1, fontSize: 12, color: '#555' },
  infoValue: { fontSize: 13, fontWeight: '700', color: '#333' },
  userStatsRow: { flexDirection: 'row', justifyContent: 'space-around' },
  userStatBox: { alignItems: 'center' },
  userStatValue: { fontSize: 22, fontWeight: '800' },
  userStatLabel: { fontSize: 11, color: '#777', marginTop: 4, textAlign: 'center' },
  apotekerRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: '#F5F5F5' },
  apotekerAvatar: { width: 36, height: 36, borderRadius: 18, backgroundColor: '#E8F5E9', justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  apotekerInitial: { fontSize: 14, fontWeight: '800', color: '#2E8B57' },
  apotekerInfo: { flex: 1 },
  apotekerName: { fontSize: 14, fontWeight: '700', color: '#333' },
  apotekerMeta: { fontSize: 11, color: '#999', marginTop: 2 },
  activeBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 },
  activeBadgeText: { fontSize: 10, fontWeight: '700' },
  txCard: {
    backgroundColor: '#FFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#EEF2EE',
    overflow: 'hidden',
    marginBottom: 12,
  },
  txRow: { flexDirection: 'row', alignItems: 'center', padding: 14, borderBottomWidth: 1, borderBottomColor: '#F5F5F5' },
  txLeft: { flex: 1 },
  txNum: { fontSize: 13, fontWeight: '800', color: '#333' },
  txMeta: { fontSize: 11, color: '#777', marginTop: 2 },
  txDate: { fontSize: 10, color: '#AAA', marginTop: 2 },
  txRight: { alignItems: 'flex-end', marginRight: 8 },
  txAmount: { fontSize: 13, fontWeight: '800', color: '#2E8B57' },
  statusBadge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6, marginTop: 4 },
  statusText: { fontSize: 9, fontWeight: '800' },
  txItems: { fontSize: 10, color: '#AAA', marginTop: 3 },
  txChevron: { marginLeft: 4 },
  pagination: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 16, paddingVertical: 8 },
  pageBtn: { width: 36, height: 36, borderRadius: 18, backgroundColor: '#E8F5E9', justifyContent: 'center', alignItems: 'center' },
  pageBtnDisabled: { backgroundColor: '#F5F5F5' },
  pageInfo: { fontSize: 12, color: '#666' },
  emptyText: { textAlign: 'center', color: '#999', padding: 16, fontSize: 13 },
  emptyState: { alignItems: 'center', padding: 40 },
  emptyStateTitle: { fontSize: 15, fontWeight: '700', color: '#555', marginTop: 12 },
  emptyStateSub: { fontSize: 12, color: '#999', marginTop: 4, textAlign: 'center' },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  modalContent: { backgroundColor: '#FFF', borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 24, maxHeight: '85%' },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  modalTitle: { fontSize: 18, fontWeight: '800', color: '#333' },
  detailRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: '#F5F5F5' },
  detailLabel: { fontSize: 13, color: '#777' },
  detailValue: { fontSize: 13, color: '#333', fontWeight: '600', maxWidth: '60%', textAlign: 'right' },
  detailValueBold: { fontSize: 15, fontWeight: '800', color: '#2E8B57' },
  itemsTitle: { fontSize: 14, fontWeight: '700', color: '#333', marginTop: 16, marginBottom: 8 },
  itemRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: '#F9F9F9' },
  itemName: { fontSize: 13, color: '#444', flex: 1 },
  itemPrice: { fontSize: 13, fontWeight: '700', color: '#2E8B57' },
});
