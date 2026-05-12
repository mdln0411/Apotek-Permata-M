import { Ionicons } from '@expo/vector-icons';
import { router, Stack } from 'expo-router';
import React from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function SimulasiObatScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="chevron-back" size={24} color="#FFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Simulasi Obat</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        
        {/* Input Simulasi */}
        <View style={styles.cardContainer}>
          <Text style={styles.sectionTitle}>Input Simulasi</Text>
          
          <Text style={styles.inputLabel}>Pilih Obat</Text>
          <View style={styles.inputBox}></View>

          <View style={styles.rowInputs}>
            <View style={styles.flex1}>
              <Text style={styles.inputLabel}>Dosis (mg)</Text>
              <TextInput style={styles.inputField} placeholder="500" placeholderTextColor="#999" />
            </View>
            <View style={styles.spacing} />
            <View style={styles.flex1}>
              <Text style={styles.inputLabel}>Frek/hari</Text>
              <TextInput style={styles.inputField} placeholder="3" placeholderTextColor="#999" />
            </View>
            <View style={styles.spacing} />
            <View style={styles.flex1}>
              <Text style={styles.inputLabel}>Hari</Text>
              <TextInput style={styles.inputField} placeholder="7" placeholderTextColor="#999" />
            </View>
          </View>

          <TouchableOpacity style={styles.primaryButton}>
            <Ionicons name="play-outline" size={20} color="#FFF" style={{ marginRight: 8 }} />
            <Text style={styles.primaryButtonText}>Jalankan Simulasi</Text>
          </TouchableOpacity>
        </View>

        {/* Dosis Aman */}
        <View style={[styles.infoCard, styles.borderLeftSuccess]}>
          <View style={styles.cardHeaderRow}>
            <Ionicons name="checkmark" size={20} color="#2E8B57" />
            <Text style={styles.cardTitleSuccess}>Dosis Aman</Text>
          </View>
          <Text style={styles.cardText}>Dosis berada dalam batas aman</Text>
        </View>

        {/* Informasi */}
        <View style={styles.infoCard}>
          <View style={styles.cardHeaderRow}>
            <Ionicons name="information-circle-outline" size={20} color="#2E8B57" />
            <Text style={styles.cardTitle}>Informasi</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.cardText}>Dosis harian:</Text>
            <Text style={styles.boldText}>1500mg</Text>
          </View>
          <Text style={styles.bulletText}>• Total 21 tablet untuk 7 hari</Text>
          <Text style={styles.bulletText}>• Konsumsi setelah makan</Text>
        </View>

        {/* Catatan */}
        <View style={[styles.infoCard, styles.borderLeftWarning]}>
          <Text style={styles.cardTitle}>Catatan</Text>
          <Text style={styles.cardTextSmall}>
            Simulasi ini hanya referensi. Selalu ikuti anjuran dokter untuk dosis dan durasi pengobatan.
          </Text>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
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
  cardContainer: {
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 13,
    color: '#555',
    marginBottom: 8,
  },
  inputBox: {
    backgroundColor: '#E8F5E9',
    height: 48,
    borderRadius: 8,
    marginBottom: 16,
  },
  rowInputs: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  flex1: {
    flex: 1,
  },
  spacing: {
    width: 12,
  },
  inputField: {
    backgroundColor: '#E8F5E9',
    height: 48,
    borderRadius: 8,
    paddingHorizontal: 12,
    fontSize: 16,
    color: '#333',
  },
  primaryButton: {
    backgroundColor: '#2E8B57',
    flexDirection: 'row',
    height: 48,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  primaryButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  infoCard: {
    backgroundColor: '#E8F5E9',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
  },
  borderLeftSuccess: {
    borderLeftWidth: 4,
    borderLeftColor: '#2E8B57',
  },
  borderLeftWarning: {
    borderLeftWidth: 4,
    borderLeftColor: '#2E8B57', 
  },
  cardHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#333',
    marginLeft: 6,
  },
  cardTitleSuccess: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#2E8B57',
    marginLeft: 6,
  },
  cardText: {
    fontSize: 14,
    color: '#444',
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
    marginTop: 4,
  },
  boldText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
  },
  bulletText: {
    fontSize: 14,
    color: '#444',
    marginBottom: 4,
    paddingLeft: 4,
  },
  cardTextSmall: {
    fontSize: 13,
    color: '#555',
    lineHeight: 20,
    marginTop: 8,
  },
});