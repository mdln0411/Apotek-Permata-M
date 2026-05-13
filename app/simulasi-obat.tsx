import { Feather, Ionicons } from '@expo/vector-icons';
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

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* Input Obat Pertama */}
        <Text style={styles.inputLabel}>Obat Pertama:</Text>
        <View style={styles.inputContainer}>
          <TextInput 
            style={styles.textInput}
            placeholder="Masukkan nama obat pertama"
            placeholderTextColor="#999"
          />
          <Feather name="search" size={20} color="#888" style={styles.searchIcon} />
        </View>

        {/* Input Obat Kedua */}
        <Text style={styles.inputLabel}>Obat Kedua:</Text>
        <View style={styles.inputContainer}>
          <TextInput 
            style={styles.textInput}
            placeholder="Masukkan nama obat kedua"
            placeholderTextColor="#999"
          />
          <Feather name="search" size={20} color="#888" style={styles.searchIcon} />
        </View>

        {/* Tombol Cek Interaksi */}
        <TouchableOpacity style={styles.primaryButton}>
          <Text style={styles.primaryButtonText}>Cek Interaksi</Text>
        </TouchableOpacity>

        {/* Box Catatan */}
        <View style={styles.noteBox}>
          <Text style={styles.noteTitle}>Catatan</Text>
          <Text style={styles.noteText}>
            Simulasi ini hanya referensi, Selalu ikuti anjuran Dokter.
          </Text>
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
    paddingTop: 40, // Disesuaikan untuk status bar
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
  inputLabel: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#2C3E50',
    marginBottom: 8,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    borderRadius: 12,
    paddingHorizontal: 16,
    height: 52,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  textInput: {
    flex: 1,
    fontSize: 15,
    color: '#333',
  },
  searchIcon: {
    marginLeft: 10,
  },
  primaryButton: {
    backgroundColor: '#2E8B57',
    height: 52,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  primaryButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  noteBox: {
    backgroundColor: '#E8F5E9',
    borderLeftWidth: 4,
    borderLeftColor: '#2E8B57',
    borderRadius: 12,
    padding: 16,
  },
  noteTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  noteText: {
    fontSize: 13,
    color: '#555',
    lineHeight: 20,
  },
});