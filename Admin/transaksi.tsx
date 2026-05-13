import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Header from '../../components/Header';
import { Colors, FontSize, Spacing, Radius } from '../../constants/theme';

type StatusType = 'Diproses' | 'Selesai' | 'Menunggu';

interface Transaction {
  id: string;
  customer: string;
  date: string;
  items: number;
  payment: string;
  amount: string;
  status: StatusType;
}

const transactions: Transaction[] = [
  {
    id: 'ORD-003',
    customer: 'Medelain',
    date: '8/4/2026',
    items: 2,
    payment: 'Transfer Bank',
    amount: 'Rp 75.000',
    status: 'Diproses',
  },
  {
    id: 'ORD-002',
    customer: 'Yarlin Kun',
    date: '7/4/2026',
    items: 1,
    payment: 'COD',
    amount: 'Rp 45.000',
    status: 'Selesai',
  },
  {
    id: 'ORD-001',
    customer: 'Hizkia Chan',
    date: '6/4/2026',
    items: 3,
    payment: 'E-Wallet',
    amount: 'Rp 120.000',
    status: 'Menunggu',
  },
];

const statusConfig: Record<StatusType, { bg: string; color: string }> = {
  Diproses: { bg: Colors.statusProcessingBg, color: Colors.statusProcessing },
  Selesai: { bg: Colors.statusDoneBg, color: Colors.statusDone },
  Menunggu: { bg: Colors.statusWaitingBg, color: Colors.statusWaiting },
};

const filterOptions: Array<'Semua Status' | StatusType> = [
  'Semua Status',
  'Menunggu',
  'Diproses',
  'Selesai',
];

export default function TransaksiScreen() {
  const [selectedFilter, setSelectedFilter] = useState<'Semua Status' | StatusType>('Semua Status');
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const filtered =
    selectedFilter === 'Semua Status'
      ? transactions
      : transactions.filter((t) => t.status === selectedFilter);

  return (
    <View style={styles.root}>
      <Header title="Transaksi" showBack />
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.pageTitle}>Manajemen Transaksi</Text>
        <Text style={styles.pageSubtitle}>{transactions.length} transaksi</Text>

        {/* Filter */}
        <View style={styles.filterCard}>
          <Text style={styles.filterLabel}>Filter Status</Text>
          <TouchableOpacity
            style={styles.dropdown}
            onPress={() => setDropdownOpen(!dropdownOpen)}
            activeOpacity={0.8}
          >
            <Text style={styles.dropdownText}>{selectedFilter}</Text>
            <Ionicons
              name={dropdownOpen ? 'chevron-up' : 'chevron-down'}
              size={16}
              color={Colors.textSecondary}
            />
          </TouchableOpacity>
          {dropdownOpen && (
            <View style={styles.dropdownMenu}>
              {filterOptions.map((opt) => (
                <TouchableOpacity
                  key={opt}
                  style={[
                    styles.dropdownItem,
                    selectedFilter === opt && styles.dropdownItemActive,
                  ]}
                  onPress={() => {
                    setSelectedFilter(opt);
                    setDropdownOpen(false);
                  }}
                >
                  <Text
                    style={[
                      styles.dropdownItemText,
                      selectedFilter === opt && styles.dropdownItemTextActive,
                    ]}
                  >
                    {opt}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>

        {/* Transaction Cards */}
        {filtered.map((tx) => {
          const sc = statusConfig[tx.status];
          return (
            <TouchableOpacity key={tx.id} style={styles.txCard} activeOpacity={0.85}>
              {/* Card Header */}
              <View style={styles.txHeader}>
                <Text style={styles.txId}>{tx.id}</Text>
                <View style={[styles.statusBadge, { backgroundColor: sc.bg }]}>
                  <Text style={[styles.statusText, { color: sc.color }]}>{tx.status}</Text>
                </View>
              </View>
              <Text style={styles.txCustomer}>{tx.customer}</Text>
              <Text style={styles.txDate}>{tx.date}</Text>
              <View style={styles.txDivider} />
              <View style={styles.txFooter}>
                <Text style={styles.txMeta}>
                  {tx.items} item • {tx.payment}
                </Text>
                <Text style={styles.txAmount}>{tx.amount}</Text>
              </View>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.background },
  scroll: { flex: 1 },
  content: { padding: Spacing.md, paddingBottom: Spacing.xl },

  pageTitle: {
    fontSize: FontSize.xxl,
    fontWeight: '800',
    color: Colors.textPrimary,
    marginBottom: 2,
  },
  pageSubtitle: {
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
    marginBottom: Spacing.md,
  },

  filterCard: {
    backgroundColor: Colors.cardBg,
    borderRadius: Radius.md,
    padding: Spacing.md,
    marginBottom: Spacing.md,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
    zIndex: 10,
  },
  filterLabel: {
    fontSize: FontSize.sm,
    fontWeight: '600',
    color: Colors.textSecondary,
    marginBottom: Spacing.sm,
  },
  dropdown: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: Radius.sm,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm + 2,
  },
  dropdownText: {
    fontSize: FontSize.md,
    color: Colors.textPrimary,
    fontWeight: '500',
  },
  dropdownMenu: {
    marginTop: Spacing.xs,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: Radius.sm,
    overflow: 'hidden',
  },
  dropdownItem: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm + 2,
    backgroundColor: Colors.white,
  },
  dropdownItemActive: {
    backgroundColor: Colors.primaryLight,
  },
  dropdownItemText: {
    fontSize: FontSize.sm,
    color: Colors.textPrimary,
  },
  dropdownItemTextActive: {
    color: Colors.primary,
    fontWeight: '600',
  },

  txCard: {
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
  txHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  txId: {
    fontSize: FontSize.md,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  statusBadge: {
    paddingHorizontal: Spacing.sm + 2,
    paddingVertical: 3,
    borderRadius: Radius.full,
  },
  statusText: {
    fontSize: FontSize.xs,
    fontWeight: '700',
  },
  txCustomer: {
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
    marginBottom: 2,
  },
  txDate: {
    fontSize: FontSize.xs,
    color: Colors.textMuted,
    marginBottom: Spacing.sm,
  },
  txDivider: {
    height: 1,
    backgroundColor: Colors.border,
    marginBottom: Spacing.sm,
  },
  txFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  txMeta: {
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
  },
  txAmount: {
    fontSize: FontSize.sm,
    fontWeight: '700',
    color: Colors.primary,
  },
});
