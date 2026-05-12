import { Feather, Ionicons } from '@expo/vector-icons';
import { router, Stack } from 'expo-router';
import React from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function PengingatObatScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="chevron-back" size={24} color="#FFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Pengingat Obat</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        
        {/* Tombol Tambah Pengingat */}
        <TouchableOpacity style={styles.addButton}>
          <Feather name="plus" size={20} color="#FFF" style={styles.addIcon} />
          <Text style={styles.addButtonText}>Tambah Pengingat</Text>
        </TouchableOpacity>

        {/* Card Pengingat 1 */}
        <View style={styles.card}>
          <View style={styles.cardTopRow}>
            <Text style={styles.medicineName}>Paracetamol 500mg</Text>
            <View style={styles.actionButtons}>
              <TouchableOpacity style={styles.checkButton}>
                <Ionicons name="checkmark" size={18} color="#2E8B57" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.deleteButton}>
                <Feather name="trash-2" size={18} color="#D32F2F" />
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.timeContainer}>
            <View style={styles.timeBadge}>
              <Feather name="clock" size={12} color="#2E8B57" style={styles.timeIcon} />
              <Text style={styles.timeText}>08:00</Text>
            </View>
            <View style={styles.timeBadge}>
              <Feather name="clock" size={12} color="#2E8B57" style={styles.timeIcon} />
              <Text style={styles.timeText}>14:00</Text>
            </View>
            <View style={styles.timeBadge}>
              <Feather name="clock" size={12} color="#2E8B57" style={styles.timeIcon} />
              <Text style={styles.timeText}>20:00</Text>
            </View>
          </View>

          <Text style={styles.durationText}>Durasi: 7 hari</Text>

          <View style={styles.statusBox}>
            <Feather name="bell" size={14} color="#555" style={styles.statusIcon} />
            <Text style={styles.statusText}>Pengingat aktif</Text>
          </View>
        </View>

        {/* Card Pengingat 2 */}
        <View style={styles.card}>
          <View style={styles.cardTopRow}>
            <Text style={styles.medicineName}>Vitamin C 1000mg</Text>
            <View style={styles.actionButtons}>
              <TouchableOpacity style={styles.checkButton}>
                <Ionicons name="checkmark" size={18} color="#2E8B57" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.deleteButton}>
                <Feather name="trash-2" size={18} color="#D32F2F" />
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.timeContainer}>
            <View style={styles.timeBadge}>
              <Feather name="clock" size={12} color="#2E8B57" style={styles.timeIcon} />
              <Text style={styles.timeText}>09:00</Text>
            </View>
          </View>

          <Text style={styles.durationText}>Durasi: 30 hari</Text>

          <View style={styles.statusBox}>
            <Feather name="bell" size={14} color="#555" style={styles.statusIcon} />
            <Text style={styles.statusText}>Pengingat aktif</Text>
          </View>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFAFA',
  },
  header: {
    backgroundColor: '#2E8B57',
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 16,
    paddingTop: 40,
  },
  backButton: {
    marginRight: 16,
  },
  headerTitle: {
    color: '#FFF',
    fontSize: 20,
    fontWeight: 'bold',
  },
  scrollContent: {
    padding: 20,
  },
  addButton: {
    backgroundColor: '#2E8B57',
    flexDirection: 'row',
    height: 50,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  addIcon: {
    marginRight: 8,
  },
  addButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  card: {
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderLeftWidth: 5,
    borderLeftColor: '#2E8B57',
    borderTopWidth: 1,
    borderRightWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#E0E0E0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  cardTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  medicineName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
  },
  actionButtons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkButton: {
    backgroundColor: '#E8F5E9',
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  deleteButton: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 32,
    height: 32,
  },
  timeContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 12,
  },
  timeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E8F5E9',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 20,
    marginRight: 8,
    marginBottom: 8,
  },
  timeIcon: {
    marginRight: 4,
  },
  timeText: {
    color: '#333',
    fontSize: 13,
    fontWeight: '500',
  },
  durationText: {
    fontSize: 14,
    color: '#555',
    marginBottom: 16,
  },
  statusBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 8,
  },
  statusIcon: {
    marginRight: 8,
  },
  statusText: {
    fontSize: 13,
    color: '#555',
  },
});