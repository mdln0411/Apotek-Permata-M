import React from 'react';
import { View, Text, StyleSheet, TextInput, ScrollView, TouchableOpacity, StatusBar } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, Href } from 'expo-router';

export default function HomeScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#2E8B57" />
      
      <View style={styles.header}>
        <Text style={styles.headerTitle}>ApotekKu</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        
        <View style={styles.banner}>
          <Text style={styles.bannerTitle}>Selamat Datang!</Text>
          <Text style={styles.bannerSub}>Kesehatan Anda, Prioritas Kami</Text>
        </View>

        <View style={styles.searchBox}>
          <Ionicons name="search" size={20} color="#888" style={styles.searchIcon} />
          <TextInput 
            style={styles.searchInput} 
            placeholder="Cari obat atau gejala..." 
            placeholderTextColor="#888"
          />
        </View>

        {/* Perbaikan Tipe Navigasi Asisten */}
        <TouchableOpacity style={styles.assistantCard} onPress={() => router.push('/asisten' as Href)}>
          <View style={styles.assistantIconBg}>
            <Ionicons name="chatbubble-ellipses" size={20} color="#FFF" />
          </View>
          <View style={styles.assistantTextContainer}>
            <Text style={styles.assistantTitle}>Asisten Virtual</Text>
            <Text style={styles.assistantSub}>Tanya tentang obat</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color="#1A1A1A" />
        </TouchableOpacity>

        <Text style={styles.sectionTitle}>Layanan Kami</Text>

        <View style={styles.gridContainer}>
          {/* Perbaikan Tipe Navigasi Obat */}
          <TouchableOpacity style={styles.gridItem} onPress={() => router.push('/obat' as Href)}>
            <View style={[styles.iconWrapper, { backgroundColor: '#E8F5E9' }]}>
              <Ionicons name="medkit-outline" size={24} color="#2E8B57" />
            </View>
            <Text style={styles.gridText}>Ketersediaan Obat</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.gridItem}>
            <View style={[styles.iconWrapper, { backgroundColor: '#E3F2FD' }]}>
              <Ionicons name="color-wand-outline" size={24} color="#1E88E5" />
            </View>
            <Text style={styles.gridText}>Simulasi Obat</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.gridItem}>
            <View style={[styles.iconWrapper, { backgroundColor: '#FFEBEE' }]}>
              <Ionicons name="heart-outline" size={24} color="#E53935" />
            </View>
            <Text style={styles.gridText}>Alergi Saya</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.gridItem}>
            <View style={[styles.iconWrapper, { backgroundColor: '#F3E5F5' }]}>
              <Ionicons name="time-outline" size={24} color="#8E24AA" />
            </View>
            <Text style={styles.gridText}>Pengingat</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.gridItem}>
            <View style={[styles.iconWrapper, { backgroundColor: '#FFF8E1' }]}>
              <Ionicons name="book-outline" size={24} color="#FFA000" />
            </View>
            <Text style={styles.gridText}>Panduan Obat</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.gridItem}>
            <View style={[styles.iconWrapper, { backgroundColor: '#F0F4C3' }]}>
              <Ionicons name="cloud-upload-outline" size={24} color="#9E9D24" />
            </View>
            <Text style={styles.gridText}>Upload Resep</Text>
          </TouchableOpacity>
        </View>

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F4F9F5' },
  header: { backgroundColor: '#2E8B57', paddingTop: 50, paddingBottom: 20, paddingHorizontal: 16 },
  headerTitle: { color: '#FFF', fontSize: 22, fontWeight: 'bold' },
  scrollContent: { padding: 16 },
  banner: { backgroundColor: '#66BB6A', borderRadius: 16, padding: 20, marginBottom: 16 },
  bannerTitle: { color: '#FFF', fontSize: 20, fontWeight: 'bold' },
  bannerSub: { color: '#FFF', fontSize: 14, marginTop: 4 },
  searchBox: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFF', borderRadius: 12, paddingHorizontal: 12, height: 48, borderWidth: 1, borderColor: '#E0EAE3', marginBottom: 16 },
  searchIcon: { marginRight: 10 },
  searchInput: { flex: 1, fontSize: 15 },
  assistantCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFF', borderRadius: 16, padding: 16, borderWidth: 1, borderColor: '#E0EAE3', marginBottom: 24 },
  assistantIconBg: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#2E8B57', justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  assistantTextContainer: { flex: 1 },
  assistantTitle: { fontSize: 16, fontWeight: 'bold', color: '#1A1A1A' },
  assistantSub: { fontSize: 12, color: '#666', marginTop: 2 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', color: '#1A1A1A', marginBottom: 16 },
  gridContainer: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  gridItem: { width: '31%', backgroundColor: '#FFF', borderRadius: 16, padding: 16, alignItems: 'center', marginBottom: 16, borderWidth: 1, borderColor: '#E0EAE3' },
  iconWrapper: { width: 48, height: 48, borderRadius: 24, justifyContent: 'center', alignItems: 'center', marginBottom: 8 },
  gridText: { fontSize: 12, color: '#1A1A1A', textAlign: 'center', fontWeight: '500' }
}); 