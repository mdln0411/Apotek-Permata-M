import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Header from '../../components/Header';
import { Colors, FontSize, Spacing } from '../../constants/theme';

export default function LaporanScreen() {
  return (
    <View style={styles.root}>
      <Header title="Laporan" showBack />
      <View style={styles.center}>
        <Ionicons name="bar-chart-outline" size={64} color={Colors.textMuted} />
        <Text style={styles.label}>Laporan & Analitik</Text>
        <Text style={styles.sub}>Halaman ini akan segera hadir</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.background },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: Spacing.sm },
  label: { fontSize: FontSize.xl, fontWeight: '700', color: Colors.textPrimary },
  sub: { fontSize: FontSize.sm, color: Colors.textSecondary },
});
