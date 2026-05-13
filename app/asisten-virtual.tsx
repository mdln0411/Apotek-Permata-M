import { Feather, Ionicons } from '@expo/vector-icons';
import { router, Stack } from 'expo-router';
import React from 'react';
import { KeyboardAvoidingView, Platform, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function AsistenVirtualScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />
      
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="chevron-back" size={24} color="#FFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Chat Apoteker</Text>
      </View>

      <KeyboardAvoidingView 
        style={styles.keyboardContainer} 
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          
          <View style={styles.messageRowBot}>
            <View style={styles.botBubble}>
              <Text style={styles.botText}>Halo! Ada yang bisa saya bantu?</Text>
            </View>
          </View>

          <View style={styles.messageRowUser}>
            <View style={styles.userBubble}>
              <Text style={styles.userText}>Saya demam dan sakit kepala</Text>
            </View>
          </View>

          <View style={styles.messageRowBot}>
            <View style={styles.botBubble}>
              <Text style={styles.botText}>Untuk demam dan sakit kepala, saya merekomendasikan:</Text>
              
              <TouchableOpacity style={styles.medicineCard}>
                <Text style={styles.medicineName}>Paracetamol 500mg</Text>
                <Text style={styles.medicinePrice}>Rp 15.000</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.medicineCard}>
                <Text style={styles.medicineName}>Ibuprofen 400mg</Text>
                <Text style={styles.medicinePrice}>Rp 18.000</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.messageRowBot}>
            <View style={styles.botBubble}>
              <Text style={styles.botText}>Apakah ada yang perlu ditanyakan lagi?</Text>
            </View>
          </View>

        </ScrollView>

        <View style={styles.inputContainer}>
          <View style={styles.inputWrapper}>
            <TextInput 
              style={styles.textInput}
              placeholder="Ketik pesan..."
              placeholderTextColor="#999"
            />
          </View>
          <TouchableOpacity style={styles.sendButton}>
            <Feather name="chevron-right" size={24} color="#FFF" />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFAFA',
  },
  keyboardContainer: {
    flex: 1,
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
    paddingBottom: 20,
  },
  messageRowBot: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    marginBottom: 16,
  },
  messageRowUser: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginBottom: 16,
  },
  botBubble: {
    backgroundColor: '#FFF',
    padding: 16,
    borderRadius: 16,
    borderTopLeftRadius: 4, 
    borderWidth: 1,
    borderColor: '#E0E0E0',
    maxWidth: '85%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  userBubble: {
    backgroundColor: '#2E8B57',
    padding: 16,
    borderRadius: 16,
    borderTopRightRadius: 4, 
    maxWidth: '80%',
  },
  botText: {
    fontSize: 15,
    color: '#333',
    lineHeight: 22,
  },
  userText: {
    fontSize: 15,
    color: '#FFF',
    lineHeight: 22,
  },
  medicineCard: {
    backgroundColor: '#E8F5E9',
    borderRadius: 12,
    padding: 12,
    marginTop: 12,
  },
  medicineName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  medicinePrice: {
    fontSize: 13,
    color: '#555',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#FFF',
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
  inputWrapper: {
    flex: 1,
    backgroundColor: '#E8F5E9',
    borderRadius: 24,
    paddingHorizontal: 16,
    height: 48,
    justifyContent: 'center',
    marginRight: 12,
  },
  textInput: {
    fontSize: 15,
    color: '#333',
    height: '100%',
  },
  sendButton: {
    backgroundColor: '#2E8B57',
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
});