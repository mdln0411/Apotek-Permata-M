import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Alert,
  Modal,
  KeyboardAvoidingView,
  Platform,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Header from '../../components/Header';
import { Colors, FontSize, Spacing, Radius } from '../../constants/theme';

type Tag = 'Pain Relief' | 'Antibiotics' | 'Vitamins' | 'Digestive' | 'Other';

interface Medicine {
  id: string;
  name: string;
  category: Tag;
  requiresPrescription: boolean;
  price: string;
  stock: number;
  imageUri?: string;
}

const initialMedicines: Medicine[] = [
  { id: '1', name: 'Paracetamol 500mg', category: 'Pain Relief', requiresPrescription: false, price: 'Rp 15.000', stock: 150 },
  { id: '2', name: 'Amoxicillin 500mg', category: 'Antibiotics', requiresPrescription: true, price: 'Rp 45.000', stock: 80 },
  { id: '3', name: 'Vitamin C 1000mg', category: 'Vitamins', requiresPrescription: false, price: 'Rp 35.000', stock: 200 },
  { id: '4', name: 'Ibuprofen 400mg', category: 'Pain Relief', requiresPrescription: false, price: 'Rp 25.000', stock: 120 },
  { id: '5', name: 'Omeprazole 20mg', category: 'Digestive', requiresPrescription: true, price: 'Rp 55.000', stock: 90 },
  { id: '6', name: 'Cetirizine 10mg', category: 'Other', requiresPrescription: false, price: 'Rp 20.000', stock: 160 },
];

const categoryColors: Record<Tag, { bg: string; color: string }> = {
  'Pain Relief': { bg: '#FFF0F0', color: '#D63031' },
  Antibiotics: { bg: '#FFF8E1', color: '#F39C12' },
  Vitamins: { bg: '#E8F5E9', color: '#27AE60' },
  Digestive: { bg: '#E3F2FD', color: '#2980B9' },
  Other: { bg: '#F3E5F5', color: '#8E44AD' },
};

const categoryIcons: Record<Tag, string> = {
  'Pain Relief': '💊',
  Antibiotics: '🧪',
  Vitamins: '🍊',
  Digestive: '🌿',
  Other: '💉',
};

export default function ObatScreen() {
  const [medicines, setMedicines] = useState<Medicine[]>(initialMedicines);
  const [search, setSearch] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [editTarget, setEditTarget] = useState<Medicine | null>(null);

  // Form state
  const [formName, setFormName] = useState('');
  const [formCategory, setFormCategory] = useState<Tag>('Pain Relief');
  const [formPrescription, setFormPrescription] = useState(false);
  const [formPrice, setFormPrice] = useState('');
  const [formStock, setFormStock] = useState('');

  const filtered = medicines.filter((m) =>
    m.name.toLowerCase().includes(search.toLowerCase())
  );

  const openAddModal = () => {
    setEditTarget(null);
    setFormName('');
    setFormCategory('Pain Relief');
    setFormPrescription(false);
    setFormPrice('');
    setFormStock('');
    setModalVisible(true);
  };

  const openEditModal = (med: Medicine) => {
    setEditTarget(med);
    setFormName(med.name);
    setFormCategory(med.category);
    setFormPrescription(med.requiresPrescription);
    setFormPrice(med.price);
    setFormStock(med.stock.toString());
    setModalVisible(true);
  };

  const handleSave = () => {
    if (!formName.trim() || !formPrice.trim() || !formStock.trim()) {
      Alert.alert('Error', 'Semua field harus diisi');
      return;
    }
    if (editTarget) {
      setMedicines((prev) =>
        prev.map((m) =>
          m.id === editTarget.id
            ? { ...m, name: formName, category: formCategory, requiresPrescription: formPrescription, price: formPrice, stock: parseInt(formStock) }
            : m
        )
      );
    } else {
      setMedicines((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          name: formName,
          category: formCategory,
          requiresPrescription: formPrescription,
          price: formPrice,
          stock: parseInt(formStock),
        },
      ]);
    }
    setModalVisible(false);
  };

  const handleDelete = (id: string) => {
    Alert.alert('Hapus Obat', 'Apakah Anda yakin ingin menghapus obat ini?', [
      { text: 'Batal', style: 'cancel' },
      {
        text: 'Hapus',
        style: 'destructive',
        onPress: () => setMedicines((prev) => prev.filter((m) => m.id !== id)),
      },
    ]);
  };

  const categories: Tag[] = ['Pain Relief', 'Antibiotics', 'Vitamins', 'Digestive', 'Other'];

  return (
    <View style={styles.root}>
      <Header title="Obat" showBack />
      <View style={styles.topBar}>
        <View style={styles.titleRow}>
          <View>
            <Text style={styles.pageTitle}>Manajemen Obat</Text>
            <Text style={styles.pageSubtitle}>{medicines.length} obat terdaftar</Text>
          </View>
          <TouchableOpacity style={styles.addBtn} onPress={openAddModal} activeOpacity={0.85}>
            <Ionicons name="add" size={18} color={Colors.white} />
            <Text style={styles.addBtnText}>Tambah</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.searchBar}>
          <Ionicons name="search-outline" size={18} color={Colors.textMuted} />
          <TextInput
            style={styles.searchInput}
            placeholder="Cari obat..."
            placeholderTextColor={Colors.textMuted}
            value={search}
            onChangeText={setSearch}
          />
          {search.length > 0 && (
            <TouchableOpacity onPress={() => setSearch('')}>
              <Ionicons name="close-circle" size={18} color={Colors.textMuted} />
            </TouchableOpacity>
          )}
        </View>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {filtered.map((med) => {
          const catStyle = categoryColors[med.category];
          return (
            <View key={med.id} style={styles.medCard}>
              <View style={styles.medImageBox}>
                <Text style={styles.medEmoji}>{categoryIcons[med.category]}</Text>
              </View>
              <View style={styles.medInfo}>
                <Text style={styles.medName}>{med.name}</Text>
                <View style={styles.tagsRow}>
                  <View style={[styles.tag, { backgroundColor: catStyle.bg }]}>
                    <Text style={[styles.tagText, { color: catStyle.color }]}>{med.category}</Text>
                  </View>
                  {med.requiresPrescription && (
                    <View style={styles.tagResep}>
                      <Text style={styles.tagResepText}>Resep</Text>
                    </View>
                  )}
                </View>
                <Text style={styles.medPriceStock}>
                  <Text style={styles.medPrice}>{med.price}</Text>
                  <Text style={styles.medDot}> • </Text>
                  <Text style={styles.medStock}>Stok: {med.stock}</Text>
                </Text>
              </View>
              <View style={styles.actions}>
                <TouchableOpacity style={styles.editBtn} onPress={() => openEditModal(med)}>
                  <Ionicons name="pencil-outline" size={18} color={Colors.textSecondary} />
                </TouchableOpacity>
                <TouchableOpacity style={styles.deleteBtn} onPress={() => handleDelete(med.id)}>
                  <Ionicons name="trash-outline" size={18} color={Colors.danger} />
                </TouchableOpacity>
              </View>
            </View>
          );
        })}
      </ScrollView>

      {/* Add/Edit Modal */}
      <Modal visible={modalVisible} animationType="slide" transparent>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.modalOverlay}
        >
          <View style={styles.modalSheet}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                {editTarget ? 'Edit Obat' : 'Tambah Obat'}
              </Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Ionicons name="close" size={24} color={Colors.textPrimary} />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              <Text style={styles.fieldLabel}>Nama Obat</Text>
              <TextInput
                style={styles.fieldInput}
                value={formName}
                onChangeText={setFormName}
                placeholder="Contoh: Paracetamol 500mg"
                placeholderTextColor={Colors.textMuted}
              />

              <Text style={styles.fieldLabel}>Kategori</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: Spacing.md }}>
                <View style={{ flexDirection: 'row', gap: Spacing.xs }}>
                  {categories.map((cat) => (
                    <TouchableOpacity
                      key={cat}
                      style={[
                        styles.catChip,
                        formCategory === cat && styles.catChipActive,
                      ]}
                      onPress={() => setFormCategory(cat)}
                    >
                      <Text style={[styles.catChipText, formCategory === cat && styles.catChipTextActive]}>
                        {cat}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </ScrollView>

              <Text style={styles.fieldLabel}>Harga</Text>
              <TextInput
                style={styles.fieldInput}
                value={formPrice}
                onChangeText={setFormPrice}
                placeholder="Rp 0"
                placeholderTextColor={Colors.textMuted}
              />

              <Text style={styles.fieldLabel}>Stok</Text>
              <TextInput
                style={styles.fieldInput}
                value={formStock}
                onChangeText={setFormStock}
                placeholder="0"
                keyboardType="number-pad"
                placeholderTextColor={Colors.textMuted}
              />

              <TouchableOpacity
                style={styles.prescriptionToggle}
                onPress={() => setFormPrescription(!formPrescription)}
                activeOpacity={0.8}
              >
                <View style={[styles.checkbox, formPrescription && styles.checkboxActive]}>
                  {formPrescription && <Ionicons name="checkmark" size={14} color={Colors.white} />}
                </View>
                <Text style={styles.prescriptionLabel}>Memerlukan Resep Dokter</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.saveBtn} onPress={handleSave} activeOpacity={0.85}>
                <Text style={styles.saveBtnText}>{editTarget ? 'Simpan Perubahan' : 'Tambah Obat'}</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.background },
  topBar: {
    backgroundColor: Colors.background,
    paddingHorizontal: Spacing.md,
    paddingTop: Spacing.md,
    paddingBottom: Spacing.sm,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Spacing.md,
  },
  pageTitle: { fontSize: FontSize.xxl, fontWeight: '800', color: Colors.textPrimary },
  pageSubtitle: { fontSize: FontSize.sm, color: Colors.textSecondary, marginTop: 2 },
  addBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.primary,
    borderRadius: Radius.sm,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    gap: 4,
  },
  addBtnText: { color: Colors.white, fontWeight: '700', fontSize: FontSize.sm },

  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.cardBg,
    borderRadius: Radius.md,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm + 2,
    gap: Spacing.sm,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  searchInput: { flex: 1, fontSize: FontSize.sm, color: Colors.textPrimary },

  scroll: { flex: 1 },
  content: { paddingHorizontal: Spacing.md, paddingBottom: Spacing.xl, paddingTop: Spacing.sm },

  medCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.cardBg,
    borderRadius: Radius.md,
    padding: Spacing.md,
    marginBottom: Spacing.sm,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  medImageBox: {
    width: 52,
    height: 52,
    borderRadius: Radius.sm,
    backgroundColor: Colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.sm,
  },
  medEmoji: { fontSize: 24 },
  medInfo: { flex: 1 },
  medName: { fontSize: FontSize.sm, fontWeight: '700', color: Colors.textPrimary, marginBottom: 4 },
  tagsRow: { flexDirection: 'row', gap: 4, marginBottom: 4, flexWrap: 'wrap' },
  tag: { paddingHorizontal: 8, paddingVertical: 2, borderRadius: Radius.full },
  tagText: { fontSize: FontSize.xs, fontWeight: '600' },
  tagResep: {
    backgroundColor: Colors.primaryLight,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: Radius.full,
  },
  tagResepText: { fontSize: FontSize.xs, fontWeight: '600', color: Colors.primary },
  medPriceStock: { flexDirection: 'row' },
  medPrice: { fontSize: FontSize.sm, fontWeight: '700', color: Colors.primary },
  medDot: { color: Colors.textMuted, fontSize: FontSize.sm },
  medStock: { fontSize: FontSize.sm, color: Colors.textSecondary },
  actions: { flexDirection: 'row', gap: Spacing.xs },
  editBtn: { padding: Spacing.xs },
  deleteBtn: { padding: Spacing.xs },

  // Modal
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  modalSheet: {
    backgroundColor: Colors.white,
    borderTopLeftRadius: Radius.xl,
    borderTopRightRadius: Radius.xl,
    padding: Spacing.lg,
    maxHeight: '90%',
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Spacing.lg,
  },
  modalTitle: { fontSize: FontSize.xl, fontWeight: '800', color: Colors.textPrimary },

  fieldLabel: {
    fontSize: FontSize.sm,
    fontWeight: '600',
    color: Colors.textSecondary,
    marginBottom: Spacing.xs,
  },
  fieldInput: {
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: Radius.sm,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm + 2,
    fontSize: FontSize.sm,
    color: Colors.textPrimary,
    marginBottom: Spacing.md,
  },

  catChip: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs + 2,
    borderRadius: Radius.full,
    backgroundColor: Colors.border,
  },
  catChipActive: { backgroundColor: Colors.primary },
  catChipText: { fontSize: FontSize.xs, fontWeight: '600', color: Colors.textSecondary },
  catChipTextActive: { color: Colors.white },

  prescriptionToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    marginBottom: Spacing.lg,
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: Colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  prescriptionLabel: { fontSize: FontSize.sm, color: Colors.textPrimary, fontWeight: '500' },

  saveBtn: {
    backgroundColor: Colors.primary,
    borderRadius: Radius.md,
    paddingVertical: Spacing.md,
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  saveBtnText: { color: Colors.white, fontSize: FontSize.md, fontWeight: '700' },
});
