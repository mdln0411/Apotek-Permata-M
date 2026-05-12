import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, StatusBar } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

export default function PengingatScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#2E8B57" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={24} color="#FFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Pengingat Obat</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Tambah Pengingat Button */}
        <TouchableOpacity style={styles.addBtn}>
          <Ionicons name="add" size={20} color="#FFF" style={{marginRight: 8}} />
          <Text style={styles.addBtnText}>Tambah Pengingat</Text>
        </TouchableOpacity>

        {/* Card 1: Paracetamol */}
        <View style={styles.reminderCard}>
          <View style={styles.cardHeader}>
            <Text style={styles.medicineName}>Paracetamol 500mg</Text>
            <View style={styles.cardActions}>
              <TouchableOpacity style={[styles.actionBtn, styles.actionBtnGreen]}>
                <Ionicons name="checkmark" size={16} color="#2E8B57" />
              </TouchableOpacity>
              <TouchableOpacity style={[styles.actionBtn, styles.actionBtnRed]}>
                <Ionicons name="trash-outline" size={16} color="#E53935" />
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.timeRow}>
            <View style={styles.timePill}>
              <Ionicons name="time-outline" size={14} color="#2E8B57" style={{marginRight: 4}} />
              <Text style={styles.timeText}>08:00</Text>
            </View>
            <View style={styles.timePill}>
              <Ionicons name="time-outline" size={14} color="#2E8B57" style={{marginRight: 4}} />
              <Text style={styles.timeText}>14:00</Text>
            </View>
            <View style={styles.timePill}>
              <Ionicons name="time-outline" size={14} color="#2E8B57" style={{marginRight: 4}} />
              <Text style={styles.timeText}>20:00</Text>
            </View>
          </View>

          <Text style={styles.durationText}>Durasi: 7 hari</Text>

          <View style={styles.activeBanner}>
            <Ionicons name="notifications-outline" size={14} color="#2E8B57" style={{marginRight: 8}} />
            <Text style={styles.activeText}>Pengingat aktif</Text>
          </View>
        </View>

        {/* Card 2: Vitamin C */}
        <View style={styles.reminderCard}>
          <View style={styles.cardHeader}>
            <Text style={styles.medicineName}>Vitamin C 1000mg</Text>
            <View style={styles.cardActions}>
              <TouchableOpacity style={[styles.actionBtn, styles.actionBtnGreen]}>
                <Ionicons name="checkmark" size={16} color="#2E8B57" />
              </TouchableOpacity>
              <TouchableOpacity style={[styles.actionBtn, styles.actionBtnRed]}>
                <Ionicons name="trash-outline" size={16} color="#E53935" />
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.timeRow}>
            <View style={styles.timePill}>
              <Ionicons name="time-outline" size={14} color="#2E8B57" style={{marginRight: 4}} />
              <Text style={styles.timeText}>09:00</Text>
            </View>
          </View>

          <Text style={styles.durationText}>Durasi: 30 hari</Text>

          <View style={styles.activeBanner}>
            <Ionicons name="notifications-outline" size={14} color="#2E8B57" style={{marginRight: 8}} />
            <Text style={styles.activeText}>Pengingat aktif</Text>
          </View>
        </View>

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F4F9F5' },
  header: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#2E8B57', paddingTop: 50, paddingBottom: 20, paddingHorizontal: 16 },
  backBtn: { marginRight: 12 },
  headerTitle: { color: '#FFF', fontSize: 18, fontWeight: 'bold' },
  scrollContent: { padding: 16 },
  addBtn: { flexDirection: 'row', backgroundColor: '#2E8B57', borderRadius: 12, height: 48, justifyContent: 'center', alignItems: 'center', marginBottom: 20 },
  addBtnText: { color: '#FFF', fontSize: 16, fontWeight: 'bold' },
  reminderCard: { backgroundColor: '#FFF', borderRadius: 16, padding: 16, marginBottom: 16, borderWidth: 1, borderColor: '#E0EAE3', borderLeftWidth: 4, borderLeftColor: '#2E8B57' },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  medicineName: { fontSize: 15, fontWeight: 'bold', color: '#1A1A1A' },
  cardActions: { flexDirection: 'row' },
  actionBtn: { width: 32, height: 32, borderRadius: 16, justifyContent: 'center', alignItems: 'center', marginLeft: 8 },
  actionBtnGreen: { backgroundColor: '#E8F5E9' },
  actionBtnRed: { backgroundColor: '#FFEBEE' },
  timeRow: { flexDirection: 'row', flexWrap: 'wrap', marginBottom: 12 },
  timePill: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#E8F5E9', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 16, marginRight: 8, marginBottom: 8 },
  timeText: { fontSize: 12, fontWeight: 'bold', color: '#2E8B57' },
  durationText: { fontSize: 13, color: '#666', marginBottom: 16 },
  activeBanner: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F4F9F5', padding: 12, borderRadius: 12 },
  activeText: { fontSize: 12, color: '#1A1A1A', fontWeight: '500' }
});
