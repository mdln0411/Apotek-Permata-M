import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Colors, FontSize, Spacing } from '../constants/theme';

interface HeaderProps {
  title: string;
  showBack?: boolean;
  showProfile?: boolean;
}

export default function Header({ title, showBack = false, showProfile = true }: HeaderProps) {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.left}>
          {showBack ? (
            <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
              <Ionicons name="arrow-back" size={22} color={Colors.white} />
              <Text style={styles.backText}>Kembali</Text>
            </TouchableOpacity>
          ) : (
            <View style={styles.logoRow}>
              <View style={styles.logoCircle}>
                <Ionicons name="medical" size={18} color={Colors.white} />
              </View>
              <Text style={styles.logoText}>Apotek Permata</Text>
            </View>
          )}
        </View>
        {showProfile && (
          <TouchableOpacity style={styles.profileBtn}>
            <Ionicons name="person-outline" size={22} color={Colors.white} />
          </TouchableOpacity>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: Colors.primary,
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm + 4,
    backgroundColor: Colors.primary,
  },
  left: {
    flex: 1,
  },
  logoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  logoCircle: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: 'rgba(255,255,255,0.25)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoText: {
    color: Colors.white,
    fontSize: FontSize.lg,
    fontWeight: '700',
    letterSpacing: 0.2,
  },
  backBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  backText: {
    color: Colors.white,
    fontSize: FontSize.md,
    fontWeight: '600',
  },
  profileBtn: {
    padding: Spacing.xs,
  },
});
