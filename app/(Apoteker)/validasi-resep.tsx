import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Modal,
  Pressable,
} from 'react-native';
import { useRouter } from 'expo-router';
import Colors from '../constants/colors';
import { prescriptionsData as initialPrescriptions } from '../data/mockData';
import { Prescription } from '../types';

export default function ValidasiResep() {
  const router = useRouter();
  const [prescriptions, setPrescriptions] = useState(initialPrescriptions);
  const [viewingPrescription, setViewingPrescription] = useState<Prescription | null>(null);
  const [toastVisible, setToastVisible] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setToastVisible(true);
    setTimeout(() => setToastVisible(false), 3000);
  };

  const handleValidate = (id: string) => {
    setPrescriptions(prev =>
      prev.map(p => (p.id === id ? { ...p, status: 'Divalidasi' as const } : p))
    );
    showToast('Resep berhasil divalidasi');
  };

  return (
    <View style={styles.container}>
      {/* ====== CUSTOM HEADER ====== */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
          activeOpacity={0.7}
        >
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
        <View>
          <Text style={styles.headerTitle}>Validasi Resep</Text>
          <Text style={styles.headerSubtitle}>Periksa dan validasi resep dokter</Text>
        </View>
      </View>

      {/* ====== DAFTAR RESEP ====== */}
      <ScrollView style={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {prescriptions.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyIcon}>✅</Text>
            <Text style={styles.emptyTitle}>Semua resep sudah divalidasi</Text>
            <Text style={styles.emptyDesc}>Tidak ada resep yang menunggu</Text>
          </View>
        ) : (
          prescriptions.map(presc => (
            <View key={presc.id} style={styles.prescCard}>
              {/* Info Utama */}
              <View style={styles.prescTop}>
                <View style={styles.prescLeft}>
                  <View style={[
                    styles.prescIconBox,
                    { backgroundColor: presc.status === 'Divalidasi' ? Colors.successBg : Colors.accent50 }
                  ]}>
                    <Text style={styles.prescIcon}>📋</Text>
                  </View>
                  <View>
                    <Text style={styles.prescId}>{presc.id}</Text>
                    <Text style={styles.prescDoctor}>Dr. {presc.doctor}</Text>
                  </View>
                </View>
                <View style={[
                  styles.prescStatusBadge,
                  { backgroundColor: presc.status === 'Divalidasi' ? Colors.successBg : Colors.accent50 }
                ]}>
                  <Text style={[
                    styles.prescStatusText,
                    { color: presc.status === 'Divalidasi' ? Colors.success : Colors.accent500 }
                  ]}>
                    {presc.status}
                  </Text>
                </View>
              </View>

              {/* Detail Obat */}
              <View style={styles.prescDetail}>
                <View>
                  <Text style={styles.prescMedicine}>{presc.medicine}</Text>
                  <Text style={styles.prescQty}>{presc.quantity} item</Text>
                </View>
                <Text style={styles.prescTime}>{presc.date} · {presc.time}</Text>
              </View>

              {/* Tombol Aksi */}
              <View style={styles.prescActions}>
                <TouchableOpacity
                  style={styles.btnLihat}
                  onPress={() => setViewingPrescription(presc)}
                  activeOpacity={0.7}
                >
                  <Text style={styles.btnLihatText}>👁 Lihat Resep</Text>
                </TouchableOpacity>

                {presc.status === 'Menunggu' ? (
                  <TouchableOpacity
                    style={styles.btnValidasi}
                    onPress={() => handleValidate(presc.id)}
                    activeOpacity={0.7}
                  >
                    <Text style={styles.btnValidasiText}>✓ Validasi</Text>
                  </TouchableOpacity>
                ) : (
                  <View style={styles.btnDone}>
                    <Text style={styles.btnDoneText}>✓✓ Tervalidasi</Text>
                  </View>
                )}
              </View>
            </View>
          ))
        )}
        <View style={{ height: 30 }} />
      </ScrollView>

      {/* ====== MODAL LIHAT RESEP ====== */}
      <Modal
        visible={!!viewingPrescription}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setViewingPrescription(null)}
      >
        <View style={styles.modalOverlay}>
          <Pressable style={styles.modalBackdrop} onPress={() => setViewingPrescription(null)} />
          <View style={styles.modalContent}>
            {/* Modal Header */}
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Detail Resep</Text>
              <TouchableOpacity onPress={() => setViewingPrescription(null)} style={styles.modalClose}>
                <Text style={styles.modalCloseIcon}>✕</Text>
              </TouchableOpacity>
            </View>

            {viewingPrescription && (
              <ScrollView showsVerticalScrollIndicator={false}>
                {/* Info Utama */}
                <View style={styles.modalPrescInfo}>
                  <View style={styles.modalPrescIconBox}>
                    <Text style={{ fontSize: 24 }}>📋</Text>
                  </View>
                  <View>
                    <Text style={styles.modalPrescId}>{viewingPrescription.id}</Text>
                    <Text style={styles.modalPrescDoctor}>Dr. {viewingPrescription.doctor}</Text>
                  </View>
                </View>

                {/* Placeholder Gambar Resep */}
                <View style={styles.modalImageBox}>
                  <Text style={styles.modalImagePlaceholder}>🖼️</Text>
                  <Text style={styles.modalImageText}>Foto resep dari dokter</Text>
                </View>

                {/* Detail Rows */}
                <View style={styles.modalDetailSection}>
                  {[
                    ['Tanggal', viewingPrescription.date],
                    ['Waktu', viewingPrescription.time],
                    ['Obat', viewingPrescription.medicine],
                    ['Jumlah', `${viewingPrescription.quantity}`],
                    ['Status', viewingPrescription.status],
                  ].map(([label, value], i) => (
                    <View key={i} style={styles.modalDetailRow}>
                      <Text style={styles.modalDetailLabel}>{label}</Text>
                      <Text style={[
                        styles.modalDetailValue,
                        label === 'Status' && {
                          color: value === 'Divalidasi' ? Colors.success : Colors.accent500,
                          fontWeight: '700',
                        }
                      ]}>
                        {value}
                      </Text>
                    </View>
                  ))}
                </View>

                {/* Tombol Validasi di Modal */}
                {viewingPrescription.status === 'Menunggu' && (
                  <TouchableOpacity
                    style={styles.modalValidateBtn}
                    onPress={() => {
                      handleValidate(viewingPrescription.id);
                      setViewingPrescription(null);
                    }}
                    activeOpacity={0.7}
                  >
                    <Text style={styles.modalValidateText}>Validasi Resep Ini</Text>
                  </TouchableOpacity>
                )}
              </ScrollView>
            )}
          </View>
        </View>
      </Modal>

      {/* ====== TOAST ====== */}
      {toastVisible && (
        <View style={styles.toast}>
          <Text style={styles.toastText}>✅ {toastMessage}</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.gray50,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: Colors.white,
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray100,
  },
  backButton: {
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: Colors.gray50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backIcon: {
    fontSize: 18,
    color: Colors.gray600,
    fontWeight: '700',
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.gray800,
  },
  headerSubtitle: {
    fontSize: 12,
    color: Colors.gray400,
    fontWeight: '500',
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 16,
  },

  // --- PRESCRIPTION CARDS ---
  prescCard: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  prescTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  prescLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  prescIconBox: {
    width: 44,
    height: 44,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  prescIcon: { fontSize: 18 },
  prescId: {
    fontSize: 14,
    fontWeight: '800',
    color: Colors.gray800,
  },
  prescDoctor: {
    fontSize: 12,
    color: Colors.gray400,
    marginTop: 2,
  },
  prescStatusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },
  prescStatusText: {
    fontSize: 11,
    fontWeight: '700',
  },
  prescDetail: {
    backgroundColor: Colors.gray50,
    borderRadius: 12,
    padding: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  prescMedicine: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.gray700,
  },
  prescQty: {
    fontSize: 12,
    color: Colors.gray400,
    marginTop: 2,
  },
  prescTime: {
    fontSize: 11,
    color: Colors.gray400,
    fontWeight: '500',
  },
  prescActions: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 12,
  },
  btnLihat: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: Colors.gray200,
    alignItems: 'center',
  },
  btnLihatText: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.gray600,
  },
  btnValidasi: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 12,
    backgroundColor: Colors.primary500,
    alignItems: 'center',
    shadowColor: Colors.primary500,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  btnValidasiText: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.white,
  },
  btnDone: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 12,
    backgroundColor: Colors.successBg,
    alignItems: 'center',
  },
  btnDoneText: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.success,
  },

  // --- EMPTY STATE ---
  emptyState: {
    alignItems: 'center',
    paddingTop: 80,
  },
  emptyIcon: { fontSize: 48, marginBottom: 12 },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.gray700,
  },
  emptyDesc: {
    fontSize: 14,
    color: Colors.gray400,
    marginTop: 4,
  },

  // --- MODAL ---
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  modalBackdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  modalContent: {
    backgroundColor: Colors.white,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '85%',
    paddingBottom: 30,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray100,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.gray800,
  },
  modalClose: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.gray100,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalCloseIcon: {
    fontSize: 14,
    color: Colors.gray500,
    fontWeight: '700',
  },
  modalPrescInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 20,
    paddingTop: 16,
    marginBottom: 16,
  },
  modalPrescIconBox: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: Colors.accent50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalPrescId: {
    fontSize: 18,
    fontWeight: '800',
    color: Colors.gray800,
  },
  modalPrescDoctor: {
    fontSize: 14,
    color: Colors.gray400,
    marginTop: 2,
  },
  modalImageBox: {
    marginHorizontal: 20,
    backgroundColor: Colors.gray50,
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: Colors.gray200,
    borderStyle: 'dashed',
    marginBottom: 16,
  },
  modalImagePlaceholder: { fontSize: 40, marginBottom: 8 },
  modalImageText: {
    fontSize: 12,
    color: Colors.gray400,
    fontWeight: '500',
  },
  modalDetailSection: {
    marginHorizontal: 20,
  },
  modalDetailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray50,
  },
  modalDetailLabel: {
    fontSize: 14,
    color: Colors.gray400,
  },
  modalDetailValue: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.gray700,
  },
  modalValidateBtn: {
    marginHorizontal: 20,
    marginTop: 20,
    paddingVertical: 14,
    borderRadius: 14,
    backgroundColor: Colors.primary500,
    alignItems: 'center',
    shadowColor: Colors.primary500,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  modalValidateText: {
    color: Colors.white,
    fontWeight: '700',
    fontSize: 14,
  },

  // --- TOAST ---
  toast: {
    position: 'absolute',
    top: 60,
    left: 20,
    right: 20,
    backgroundColor: Colors.success,
    paddingVertical: 14,
    paddingHorizontal: 18,
    borderRadius: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 6,
  },
  toastText: {
    color: Colors.white,
    fontWeight: '700',
    fontSize: 13,
    textAlign: 'center',
  },
});