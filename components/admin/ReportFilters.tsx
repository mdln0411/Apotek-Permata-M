import type { ReportFilters, ReportPeriod } from '@/api/reportService';
import { Feather } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import React, { useState } from 'react';
import {
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

type FilterOptions = {
  apotekers: Array<{ id: number; name: string }>;
  payment_methods: Array<{ value: string; label: string }>;
  statuses: Array<{ value: string; label: string }>;
  periods: Array<{ value: string; label: string }>;
};

type Props = {
  filters: ReportFilters;
  options: FilterOptions;
  onChange: (next: ReportFilters) => void;
};

const PERIOD_CHIPS: { value: ReportPeriod; label: string }[] = [
  { value: 'today', label: 'Hari Ini' },
  { value: 'week', label: 'Minggu Ini' },
  { value: 'month', label: 'Bulan Ini' },
  { value: 'year', label: 'Tahun Ini' },
  { value: 'custom', label: 'Custom' },
];

export default function ReportFiltersBar({ filters, options, onChange }: Props) {
  const [expanded, setExpanded] = useState(false);
  const [showFrom, setShowFrom] = useState(false);
  const [showTo, setShowTo] = useState(false);

  const dateFrom = filters.date_from ? new Date(filters.date_from) : new Date();
  const dateTo = filters.date_to ? new Date(filters.date_to) : new Date();

  const set = (patch: Partial<ReportFilters>) => onChange({ ...filters, ...patch, page: 1 });

  return (
    <View style={styles.wrap}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chips}>
        {PERIOD_CHIPS.map((p) => {
          const active = filters.period === p.value;
          return (
            <TouchableOpacity
              key={p.value}
              style={[styles.chip, active && styles.chipActive]}
              onPress={() => set({ period: p.value })}
            >
              <Text style={[styles.chipText, active && styles.chipTextActive]}>{p.label}</Text>
            </TouchableOpacity>
          );
        })}
        <TouchableOpacity style={styles.filterToggle} onPress={() => setExpanded((v) => !v)}>
          <Feather name="sliders" size={16} color="#2E8B57" />
          <Text style={styles.filterToggleText}>Filter</Text>
        </TouchableOpacity>
      </ScrollView>

      {filters.period === 'custom' && (
        <View style={styles.dateRow}>
          <TouchableOpacity style={styles.dateBtn} onPress={() => setShowFrom(true)}>
            <Feather name="calendar" size={14} color="#2E8B57" />
            <Text style={styles.dateText}>
              Dari: {filters.date_from ?? '—'}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.dateBtn} onPress={() => setShowTo(true)}>
            <Feather name="calendar" size={14} color="#2E8B57" />
            <Text style={styles.dateText}>
              Sampai: {filters.date_to ?? '—'}
            </Text>
          </TouchableOpacity>
        </View>
      )}

      {expanded && (
        <View style={styles.advanced}>
          <Text style={styles.advLabel}>Apoteker</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.advChips}>
            <TouchableOpacity
              style={[styles.miniChip, !filters.apoteker_id && styles.miniChipActive]}
              onPress={() => set({ apoteker_id: undefined })}
            >
              <Text style={styles.miniChipText}>Semua</Text>
            </TouchableOpacity>
            {options.apotekers.map((a) => (
              <TouchableOpacity
                key={a.id}
                style={[styles.miniChip, String(filters.apoteker_id) === String(a.id) && styles.miniChipActive]}
                onPress={() => set({ apoteker_id: a.id })}
              >
                <Text style={[styles.miniChipText, String(filters.apoteker_id) === String(a.id) && styles.miniChipTextActive]}>{a.name}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          <Text style={styles.advLabel}>Metode Pembayaran</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.advChips}>
            <TouchableOpacity
              style={[styles.miniChip, !filters.payment_method && styles.miniChipActive]}
              onPress={() => set({ payment_method: undefined })}
            >
              <Text style={styles.miniChipText}>Semua</Text>
            </TouchableOpacity>
            {options.payment_methods.map((m) => (
              <TouchableOpacity
                key={m.value}
                style={[styles.miniChip, filters.payment_method === m.value && styles.miniChipActive]}
                onPress={() => set({ payment_method: m.value })}
              >
                <Text style={[styles.miniChipText, filters.payment_method === m.value && styles.miniChipTextActive]}>{m.label}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          <Text style={styles.advLabel}>Status Transaksi</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.advChips}>
            <TouchableOpacity
              style={[styles.miniChip, !filters.status && styles.miniChipActive]}
              onPress={() => set({ status: undefined })}
            >
              <Text style={styles.miniChipText}>Semua</Text>
            </TouchableOpacity>
            {options.statuses.map((s) => (
              <TouchableOpacity
                key={s.value}
                style={[styles.miniChip, filters.status === s.value && styles.miniChipActive]}
                onPress={() => set({ status: s.value })}
              >
                <Text style={[styles.miniChipText, filters.status === s.value && styles.miniChipTextActive]}>{s.label}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      )}

      {(showFrom || showTo) && Platform.OS !== 'web' && (
        <DateTimePicker
          value={showFrom ? dateFrom : dateTo}
          mode="date"
          display="default"
          onChange={(_, date) => {
            if (showFrom) setShowFrom(false);
            if (showTo) setShowTo(false);
            if (date) {
              const iso = date.toISOString().split('T')[0];
              if (showFrom) set({ date_from: iso });
              else set({ date_to: iso });
            }
          }}
        />
      )}

      {Platform.OS === 'web' && (showFrom || showTo) && (
        <Modal transparent animationType="fade" visible onRequestClose={() => { setShowFrom(false); setShowTo(false); }}>
          <View style={styles.webDateOverlay}>
            <View style={styles.webDateBox}>
              <Text style={styles.webDateTitle}>{showFrom ? 'Tanggal Mulai' : 'Tanggal Akhir'}</Text>
              <TextInput
                style={styles.webDateInput}
                placeholder="YYYY-MM-DD"
                defaultValue={showFrom ? filters.date_from : filters.date_to}
                onSubmitEditing={(e) => {
                  const val = e.nativeEvent.text;
                  if (showFrom) set({ date_from: val });
                  else set({ date_to: val });
                  setShowFrom(false);
                  setShowTo(false);
                }}
              />
              <TouchableOpacity style={styles.webDateClose} onPress={() => { setShowFrom(false); setShowTo(false); }}>
                <Text style={styles.webDateCloseText}>Tutup</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { marginBottom: 16 },
  chips: { flexDirection: 'row', gap: 8, paddingVertical: 4 },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#FFF',
    borderWidth: 1,
    borderColor: '#E0E8E0',
  },
  chipActive: { backgroundColor: '#2E8B57', borderColor: '#2E8B57' },
  chipText: { fontSize: 12, fontWeight: '600', color: '#555' },
  chipTextActive: { color: '#FFF' },
  filterToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#E8F5E9',
  },
  filterToggleText: { fontSize: 12, fontWeight: '700', color: '#2E8B57' },
  dateRow: { flexDirection: 'row', gap: 10, marginTop: 10 },
  dateBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#FFF',
    borderRadius: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: '#E0E8E0',
  },
  dateText: { fontSize: 12, color: '#444' },
  advanced: {
    marginTop: 12,
    backgroundColor: '#FFF',
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: '#EEF2EE',
  },
  advLabel: { fontSize: 12, fontWeight: '700', color: '#555', marginBottom: 8, marginTop: 4 },
  advChips: { flexDirection: 'row', marginBottom: 8 },
  miniChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: '#F5F7F5',
    marginRight: 8,
  },
  miniChipActive: { backgroundColor: '#2E8B57' },
  miniChipText: { fontSize: 11, color: '#444', fontWeight: '600' },
  miniChipTextActive: { color: '#FFF' },
  webDateOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'center', alignItems: 'center' },
  webDateBox: { backgroundColor: '#FFF', borderRadius: 16, padding: 24, width: 300 },
  webDateTitle: { fontSize: 16, fontWeight: '700', marginBottom: 12 },
  webDateInput: { borderWidth: 1, borderColor: '#DDD', borderRadius: 8, padding: 10, marginBottom: 12 },
  webDateClose: { alignSelf: 'flex-end' },
  webDateCloseText: { color: '#2E8B57', fontWeight: '700' },
});
