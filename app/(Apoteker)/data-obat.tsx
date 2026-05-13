import React, { useState, useMemo, useRef } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  Modal,
  Pressable,
  Keyboard,
} from 'react-native';
import { useRouter } from 'expo-router';
import Colors from '../constants/colors';
import { medicinesData as initialMedicines } from '../data/mockData';
import { Medicine } from '../types';

// Mapping warna per kategori
const categoryStyles: Record<string, { bg: string; text: string; emoji: string }> = {
  'Pain Relief':  { bg: Colors.categoryPainBg,      text: Colors.categoryPain,      emoji: '🩹' },
  'Antibiotics':  { bg: Colors.categoryAntibioticBg, text: Colors.categoryAntibiotic, emoji: '🦠' },
  'Vitamins':     { bg: Colors.categoryVitaminBg,    text: Colors.categoryVitamin,    emoji: '🍎' },
  'Digestive':    { bg: Colors.categoryDigestiveBg,  text: Colors.categoryDigestive,  emoji: '🫁' },
};

export default function DataObat() {
  const router = useRouter();
  const [medicines, setMedicines] = useState(initialMedicines);
  const [searchQuery, setSearchQuery] = useState('');
  const [updatingMedicine, setUpdatingMedicine] = useState<Medicine | null>(null);
  const [newStock, setNewStock] = useState('');
  const [toastVisible, setToastVisible] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const inputRef = useRef<TextInput>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setToastVisible(true);
    setTimeout(() => setToastVisible(false), 3000);
  };

  // Filter berdasarkan pencarian
  const filteredMedicines = useMemo(() => {
    if (!searchQuery.trim()) return medicines;
    const q = searchQuery.toLowerCase();
    return medicines.filter(
      m =>
        m.name.toLowerCase().includes(q) ||
        m.category.toLowerCase().includes(q) ||
        m.dosage.toLowerCase().includes(q)
    );
  }, [medicines, searchQuery]);

  // Buka modal update
  const openUpdateModal = (med: Medicine) => {
    setUpdatingMedicine(med);
    setNewStock(String(med.stock));
    setTimeout(() => inputRef.current?.focus(), 150);
  };

  // Simpan stok baru
  const handleSaveStock = () => {
    const val = parseInt(newStock);
    if (isNaN(val) || val < 0 || !updatingMedicine) return;
    setMedicines(prev =>
      prev.map(m => (m.id === updatingMedicine.id ? { ...m, stock: val } : m))
    );
    showToast(`Stok ${updatingMedicine.name} diperbarui menjadi ${val}`);
    setUpdatingMedicine(null);
    Keyboard.dismiss();
  };

  return (
    <View style={styles.container}>
      {/* ====== HEADER ====== */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()} activeOpacity={0.7}>
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Data Obat</Text>
      </View>

      {/* ====== SEARCH BAR ====== */}
      <View style={styles.searchSection}>
        <View style={styles.searchBox}>
          <Text style={styles.searchIcon}>🔍</Text>
          <TextInput
            style={styles.searchInput}
            placeholder="Cari nama obat, kategori..."
            placeholderTextColor={Colors.gray300}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Text style={styles.searchClear}>✕</Text>
            </TouchableOpacity>
          )}
        </View>
        <Text style={styles.resultCount}>
          Menampilkan {filteredMedicines.length} dari {medicines.length} obat
        </Text>
      </View>

      {/* ====== DAFTAR OBAT ====== */}
      <ScrollView style={styles.listSection} showsVerticalScrollIndicator={false}>
        {filteredMedicines.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={{ fontSize: 40 }}>🔍</Text>
            <Text style={styles.emptyTitle}>Obat tidak ditemukan</Text>
            <Text style={styles.emptyDesc}>Coba kata kunci lain</Text>
          </View>
        ) : (
          filteredMedicines.map(med => {
            const catStyle = categoryStyles[med.category] || { bg: Colors.gray50, text: Colors.gray600, emoji: '💊' };
            return (
              <View key={med.id} style={styles.medCard}>
                <View style={styles.medRow}>
                  {/* Ikon Kategori */}
                  <View style={[styles.medIconBox, { backgroundColor: catStyle.bg }]}>
                    <Text style={styles.medIcon}>{catStyle.emoji}</Text>
                  </View>

                  {/* Info Obat */}
                  <View style={styles.medInfo}>
                    <Text style={styles.medName}>
                      {med.name}
                      {med.dosage ? <Text style={styles.medDosage}> {med.dosage}</Text> : null}
                    </Text>
                    <View style={styles.medTags}>
                      <View style={[styles.medCategoryTag, { backgroundColor: catStyle.bg }]}>
                        <Text style={[styles.medCategoryText, { color: catStyle.text }]}>
                          {med.category}
                        </Text>
                      </View>
                      {med.isPrescription && (
                        <View style={styles.medResepTag}>
                          <Text style={styles.medResepText}>Resep</Text>
                        </View>
                      )}
                    </View>
                  </View>
                </View>

                {/* Stok & Tombol Update */}
                <View style={styles.medBottom}>
                  <Text style={styles.medStock}>
                    <Text style={styles.medStockValue}>{med.stock}</Text>
                    <Text style={styles.medStockUnit}> unit</Text>
                    {med.stock < 100 && <Text style={styles.medStockWarning}> ⚠️</Text>}
                  </Text>
                  <TouchableOpacity
                    style={styles.btnUpdate}
                    onPress={() => openUpdateModal(med)}
                    activeOpacity={0.7}
                  >
                    <Text style={styles.btnUpdateText}>✏️ Update</Text>
                  </TouchableOpacity>
                </View>
              </View>
            );
          })
        )}
        <View style={{ height: 30 }} />
      </ScrollView>

      {/* ====== MODAL UPDATE STOK ====== */}
      <Modal
        visible={!!updatingMedicine}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setUpdatingMedicine(null)}
      >
        <View style={styles.modalOverlay}>
          <Pressable style={styles.modalBackdrop} onPress={() => setUpdatingMedicine(null)} />
          <View style={styles.modalContent}>
            {/* Modal Header */}
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Update Stok Obat</Text>
              <TouchableOpacity onPress={() => setUpdatingMedicine(null)} style={styles.modalClose}>
                <Text style={styles.modalCloseIcon}>✕</Text>
              </TouchableOpacity>
            </View>

            {updatingMedicine && (() => {
              const catStyle = categoryStyles[updatingMedicine.category] || { bg: Colors.gray50, text: Colors.gray600, emoji: '💊' };
              return (
                <ScrollView>
                  {/* Info Obat di Modal */}
                  <View style={styles.modalMedInfo}>
                    <View style={[styles.modalMedIconBox, { backgroundColor: catStyle.bg }]}>
                      <Text style={{ fontSize: 24 }}>{catStyle.emoji}</Text>
                    </View>
                    <View>
                      <Text style={styles.modalMedName}>
                        {updatingMedicine.name}
                        {updatingMedicine.dosage ? ` ${updatingMedicine.dosage}` : ''}
                      </Text>
                      <Text style={styles.modalMedStock}>
                        Stok saat ini: <Text style={styles.modalMedStockValue}>{updatingMedicine.stock} unit</Text>
                      </Text>
                    </View>
                  </View>

                  {/* Input Stok Baru */}
                  <Text style={styles.inputLabel}>Stok Baru</Text>
                  <View style={styles.stepperRow}>
                    <TouchableOpacity
                      style={styles.stepperBtn}
                      onPress={() => setNewStock(p => String(Math.max(0, parseInt(p || '0') - 10)))}
                    >
                      <Text style={styles.stepperBtnText}>-10</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.stepperBtn}
                      onPress={() => setNewStock(p => String(Math.max(0, parseInt(p || '0') - 1)))}
                    >
                      <Text style={styles.stepperBtnText}>-</Text>
                    </TouchableOpacity>
                    <TextInput
                      ref={inputRef}
                      style={styles.stepperInput}
                      value={newStock}
                      onChangeText={setNewStock}
                      keyboardType="number-pad"
                      selectTextOnFocus
                    />
                    <TouchableOpacity
                      style={styles.stepperBtn}
                      onPress={() => setNewStock(p => String(parseInt(p || '0') + 1))}
                    >
                      <Text style={styles.stepperBtnText}>+</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.stepperBtn}
                      onPress={() => setNewStock(p => String(parseInt(p || '0') + 10))}
                    >
                      <Text style={styles.stepperBtnText}>+10</Text>
                    </TouchableOpacity>
                  </View>

                  {/* Tombol Aksi */}
                  <View style={styles.modalActions}>
                    <TouchableOpacity
                      style={styles.btnBatal}
                      onPress={() => setUpdatingMedicine(null)}
                      activeOpacity={0.7}
                    >
                      <Text style={styles.btnBatalText}>Batal</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.btnSimpan}
                      onPress={handleSaveStock}
                      activeOpacity={0.7}
                    >
                      <Text style={styles.btnSimpanText}>✓ Simpan</Text>
                    </TouchableOpacity>
                  </View>
                </ScrollView>
              );
            })()}
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

  // --- SEARCH ---
  searchSection: {
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: Colors.gray200,
    paddingHorizontal: 14,
    paddingVertical: 12,
    gap: 10,
  },
  searchIcon: { fontSize: 14 },
  searchInput: {
    flex: 1,
    fontSize: 14,
    fontWeight: '500',
    color: Colors.gray700,
    padding: 0,
  },
  searchClear: {
    fontSize: 14,
    color: Colors.gray400,
    fontWeight: '600',
  },
  resultCount: {
    fontSize: 12,
    color: Colors.gray400,
    marginTop: 10,
    marginBottom: 4,
    fontWeight: '500',
  },

  // --- MEDICINE LIST ---
  listSection: {
    paddingHorizontal: 20,
    paddingTop: 4,
  },
  medCard: {
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
  medRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  medIconBox: {
    width: 44,
    height: 44,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  medIcon: { fontSize: 20 },
  medInfo: {
    flex: 1,
  },
  medName: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.gray800,
    lineHeight: 20,
  },
  medDosage: {
    fontWeight: '500',
    color: Colors.gray400,
  },
  medTags: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 8,
    flexWrap: 'wrap',
  },
  medCategoryTag: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  medCategoryText: {
    fontSize: 11,
    fontWeight: '700',
  },
  medResepTag: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
    backgroundColor: Colors.errorBg,
  },
  medResepText: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.error,
  },
  medBottom: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: Colors.gray50,
  },
  medStock: {
    fontSize: 14,
    color: Colors.gray500,
  },
  medStockValue: {
    fontWeight: '800',
    color: Colors.gray700,
  },
  medStockUnit: {
    color: Colors.gray400,
  },
  medStockWarning: {
    fontSize: 10,
  },
  btnUpdate: {
    backgroundColor: Colors.primary50,
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 10,
  },
  btnUpdateText: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.primary600,
  },

  // --- EMPTY STATE ---
  emptyState: {
    alignItems: 'center',
    paddingTop: 60,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.gray600,
    marginTop: 12,
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
    top: 0, left: 0, right: 0, bottom: 0,
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
  modalMedInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginHorizontal: 20,
    marginTop: 16,
    marginBottom: 20,
    padding: 14,
    backgroundColor: Colors.gray50,
    borderRadius: 14,
  },
  modalMedIconBox: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalMedName: {
    fontSize: 16,
    fontWeight: '800',
    color: Colors.gray800,
  },
  modalMedStock: {
    fontSize: 12,
    color: Colors.gray400,
    marginTop: 2,
  },
  modalMedStockValue: {
    fontWeight: '700',
    color: Colors.gray600,
  },
  inputLabel: {
    marginHorizontal: 20,
    fontSize: 14,
    fontWeight: '600',
    color: Colors.gray700,
    marginBottom: 8,
  },
  stepperRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginHorizontal: 20,
    marginBottom: 24,
  },
  stepperBtn: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: Colors.gray100,
    justifyContent: 'center',
    alignItems: 'center',
  },
  stepperBtnText: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.gray600,
  },
  stepperInput: {
    flex: 1,
    textAlign: 'center',
    fontSize: 20,
    fontWeight: '800',
    color: Colors.gray800,
    borderWidth: 2,
    borderColor: Colors.gray200,
    borderRadius: 12,
    paddingVertical: 8,
  },
  modalActions: {
    flexDirection: 'row',
    gap: 10,
    marginHorizontal: 20,
  },
  btnBatal: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: Colors.gray200,
    alignItems: 'center',
  },
  btnBatalText: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.gray600,
  },
  btnSimpan: {
    flex: 1,
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
  btnSimpanText: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.white,
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