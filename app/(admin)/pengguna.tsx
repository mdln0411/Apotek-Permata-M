import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Switch,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Header from '../../components/Header';
import { Colors, FontSize, Spacing, Radius } from '../../constants/theme';

type Role = 'Member' | 'Apoteker' | 'Admin';

interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  joinDate: string;
  orders?: number;
  isActive: boolean;
}

const initialUsers: User[] = [
  {
    id: '1',
    name: 'Medelain',
    email: 'medling@mail.com',
    role: 'Member',
    joinDate: '15/3/2026',
    orders: 5,
    isActive: true,
  },
  {
    id: '2',
    name: 'Yarlin Khun',
    email: 'Yarix@mail.com',
    role: 'Member',
    joinDate: '20/3/2026',
    orders: 3,
    isActive: true,
  },
  {
    id: '3',
    name: 'HolsBam',
    email: 'Holay@apotekPermata.com',
    role: 'Apoteker',
    joinDate: '10/1/2026',
    orders: undefined,
    isActive: true,
  },
  {
    id: '4',
    name: 'Hizkia Chan',
    email: 'hizfry@mail.com',
    role: 'Member',
    joinDate: '5/2/2026',
    orders: 1,
    isActive: false,
  },
];

const roleColors: Record<Role, { bg: string; color: string }> = {
  Member: { bg: Colors.primaryLight, color: Colors.primary },
  Apoteker: { bg: '#E8F5EE', color: '#1F5C3A' },
  Admin: { bg: '#FFF8ED', color: '#F39C12' },
};

export default function PenggunaScreen() {
  const [users, setUsers] = useState<User[]>(initialUsers);
  const [search, setSearch] = useState('');

  const filtered = users.filter(
    (u) =>
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase())
  );

  const toggleActive = (id: string) => {
    setUsers((prev) =>
      prev.map((u) => (u.id === id ? { ...u, isActive: !u.isActive } : u))
    );
  };

  const handleDelete = (id: string, name: string) => {
    Alert.alert('Hapus Pengguna', `Hapus akun "${name}"?`, [
      { text: 'Batal', style: 'cancel' },
      {
        text: 'Hapus',
        style: 'destructive',
        onPress: () => setUsers((prev) => prev.filter((u) => u.id !== id)),
      },
    ]);
  };

  return (
    <View style={styles.root}>
      <Header title="Pengguna" showBack />
      <View style={styles.topBar}>
        <Text style={styles.pageTitle}>Manajemen Pengguna</Text>
        <Text style={styles.pageSub}>{users.length} pengguna terdaftar</Text>

        <View style={styles.searchBar}>
          <Ionicons name="search-outline" size={18} color={Colors.textMuted} />
          <TextInput
            style={styles.searchInput}
            placeholder="Cari pengguna..."
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
        {filtered.map((user) => {
          const rc = roleColors[user.role];
          return (
            <View key={user.id} style={styles.userCard}>
              {/* Top row: avatar + name/email + role badge */}
              <View style={styles.userTop}>
                <View style={styles.avatar}>
                  <Ionicons name="person-outline" size={22} color={Colors.primary} />
                </View>
                <View style={styles.userMeta}>
                  <View style={styles.nameRow}>
                    <Text style={styles.userName}>{user.name}</Text>
                    <View style={[styles.roleBadge, { backgroundColor: rc.bg }]}>
                      <Text style={[styles.roleText, { color: rc.color }]}>{user.role}</Text>
                    </View>
                  </View>
                  <Text style={styles.userEmail}>{user.email}</Text>
                </View>
              </View>

              {/* Divider */}
              <View style={styles.divider} />

              {/* Bottom row: join date + orders + active toggle */}
              <View style={styles.userBottom}>
                <View style={styles.userDetails}>
                  <Text style={styles.detailText}>
                    Bergabung: {user.joinDate}
                    {user.orders !== undefined ? (
                      <Text style={styles.detailDot}> • {user.orders} pesanan</Text>
                    ) : null}
                  </Text>
                </View>
                <View style={styles.activeRow}>
                  <Text style={[styles.activeLabel, { color: user.isActive ? Colors.primary : Colors.textMuted }]}>
                    {user.isActive ? 'Aktif' : 'Nonaktif'}
                  </Text>
                  <Switch
                    value={user.isActive}
                    onValueChange={() => toggleActive(user.id)}
                    trackColor={{ false: Colors.border, true: Colors.primaryMuted }}
                    thumbColor={user.isActive ? Colors.primary : Colors.white}
                    ios_backgroundColor={Colors.border}
                  />
                </View>
              </View>
            </View>
          );
        })}

        {filtered.length === 0 && (
          <View style={styles.emptyState}>
            <Ionicons name="people-outline" size={48} color={Colors.textMuted} />
            <Text style={styles.emptyText}>Tidak ada pengguna ditemukan</Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.background },
  topBar: {
    paddingHorizontal: Spacing.md,
    paddingTop: Spacing.md,
    paddingBottom: Spacing.sm,
    backgroundColor: Colors.background,
  },
  pageTitle: { fontSize: FontSize.xxl, fontWeight: '800', color: Colors.textPrimary, marginBottom: 2 },
  pageSub: { fontSize: FontSize.sm, color: Colors.textSecondary, marginBottom: Spacing.md },

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
  content: { paddingHorizontal: Spacing.md, paddingTop: Spacing.sm, paddingBottom: Spacing.xl },

  userCard: {
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

  userTop: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.sm,
  },
  userMeta: { flex: 1 },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 3,
  },
  userName: { fontSize: FontSize.md, fontWeight: '700', color: Colors.textPrimary },
  userEmail: { fontSize: FontSize.xs, color: Colors.textSecondary },

  roleBadge: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: 3,
    borderRadius: Radius.full,
  },
  roleText: { fontSize: FontSize.xs, fontWeight: '700' },

  divider: { height: 1, backgroundColor: Colors.border, marginBottom: Spacing.sm },

  userBottom: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  userDetails: { flex: 1 },
  detailText: { fontSize: FontSize.xs, color: Colors.textSecondary },
  detailDot: { color: Colors.textMuted },

  activeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  activeLabel: { fontSize: FontSize.xs, fontWeight: '600' },

  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.xl * 2,
    gap: Spacing.sm,
  },
  emptyText: { fontSize: FontSize.md, color: Colors.textMuted },
});
