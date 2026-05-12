import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, ScrollView, TouchableOpacity, KeyboardAvoidingView, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Header from '../components/header';

export default function AsistenScreen() {
  const [inputMessage, setInputMessage] = useState('');

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.container}>
      <Header title="Asisten Virtual" />

      <ScrollView contentContainerStyle={styles.chatContainer}>
        
        <View style={styles.botBubble}>
          <Text style={styles.botText}>Halo! Ada yang bisa saya bantu?</Text>
        </View>

        <View style={styles.userBubble}>
          <Text style={styles.userText}>Saya demam dan sakit kepala</Text>
        </View>

        <View style={styles.recommendationBubble}>
          <Text style={styles.botText}>Untuk demam dan sakit kepala, saya merekomendasikan:</Text>
          
          <View style={styles.pillCard}>
            <Text style={styles.pillTitle}>Paracetamol 500mg</Text>
            <Text style={styles.pillPrice}>Rp 15.000</Text>
          </View>

          <View style={styles.pillCard}>
            <Text style={styles.pillTitle}>Ibuprofen 400mg</Text>
            <Text style={styles.pillPrice}>Rp 18.000</Text>
          </View>
        </View>

        <View style={styles.botBubble}>
          <Text style={styles.botText}>Apakah ada yang perlu ditanyakan lagi?</Text>
        </View>

      </ScrollView>

      <View style={styles.inputSection}>
        <TextInput style={styles.inputBox} placeholder="Ketik pesan..." value={inputMessage} onChangeText={setInputMessage} />
        <TouchableOpacity style={styles.sendButton}>
          <Ionicons name="chevron-forward" size={24} color="#FFF" />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F4F9F5' },
  chatContainer: { padding: 16 },
  botBubble: { backgroundColor: '#FFF', borderRadius: 16, borderTopLeftRadius: 4, padding: 16, maxWidth: '80%', marginBottom: 16, borderWidth: 1, borderColor: '#E0EAE3' },
  botText: { fontSize: 15, color: '#1A1A1A', lineHeight: 22 },
  userBubble: { backgroundColor: '#2E8B57', borderRadius: 16, borderTopRightRadius: 4, padding: 16, maxWidth: '80%', alignSelf: 'flex-end', marginBottom: 16 },
  userText: { fontSize: 15, color: '#FFF' },
  recommendationBubble: { backgroundColor: '#FFF', borderRadius: 16, borderTopLeftRadius: 4, padding: 16, maxWidth: '85%', marginBottom: 16, borderWidth: 1, borderColor: '#E0EAE3' },
  pillCard: { backgroundColor: '#E8F5E9', borderRadius: 12, padding: 12, marginTop: 10 },
  pillTitle: { fontSize: 14, fontWeight: 'bold', color: '#1A1A1A' },
  pillPrice: { fontSize: 14, color: '#555', marginTop: 2 },
  inputSection: { flexDirection: 'row', padding: 12, backgroundColor: '#FFF', alignItems: 'center', borderTopWidth: 1, borderTopColor: '#E0EAE3' },
  inputBox: { flex: 1, backgroundColor: '#E8F5E9', borderRadius: 24, paddingHorizontal: 16, paddingVertical: 10, fontSize: 15, maxHeight: 100 },
  sendButton: { width: 44, height: 44, borderRadius: 22, backgroundColor: '#2E8B57', justifyContent: 'center', alignItems: 'center', marginLeft: 10 }
});