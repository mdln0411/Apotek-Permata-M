import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform } from 'react-native';
import Header from '../components/header';

export default function CheckoutScreen() {
  const [selectedPayment, setSelectedPayment] = useState('Transfer Bank');

  const paymentMethods = ['Transfer Bank', 'E-Wallet', 'QRIS'];

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.container}>
      <Header title="Checkout" />

      <ScrollView contentContainerStyle={styles.content}>
        
        {/* Form Pengiriman */}
        <View style={styles.cardSection}>
          <Text style={styles.sectionTitle}>Informasi Pengiriman</Text>
          <TextInput style={styles.input} placeholder="Nama Lengkap" placeholderTextColor="#888" />
          <TextInput style={styles.input} placeholder="Nomor Telepon" keyboardType="phone-pad" placeholderTextColor="#888" />
          <TextInput style={[styles.input, styles.textArea]} placeholder="Alamat Lengkap" multiline numberOfLines={3} placeholderTextColor="#888" />
        </View>

        {/* Pilihan Metode Pembayaran */}
        <View style={styles.cardSection}>
          <Text style={styles.sectionTitle}>Metode Pembayaran</Text>
          {paymentMethods.map((method) => (
            <TouchableOpacity 
              key={method} 
              style={[styles.paymentOption, selectedPayment === method && styles.paymentSelected]}
              onPress={() => setSelectedPayment(method)}
            >
              <Text style={[styles.paymentText, selectedPayment === method && {fontWeight: 'bold', color: '#2E8B57'}]}>
                {method}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Ringkasan */}
        <View style={styles.cardSection}>
          <Text style={styles.sectionTitle}>Ringkasan Pesanan</Text>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Subtotal</Text>
            <Text style={styles.summaryValue}>Rp 55.000</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Pengiriman</Text>
            <Text style={styles.summaryValue}>Rp 15.000</Text>
          </View>
        </View>

      </ScrollView>

      {/* Tombol Bayar Bawah */}
      <View style={styles.footer}>
        <TouchableOpacity style={styles.payBtn}>
          <Text style={styles.payBtnText}>Bayar Sekarang</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F4F9F5' },
  content: { padding: 16 },
  cardSection: { backgroundColor: '#FFF', borderRadius: 16, padding: 16, marginBottom: 16, borderWidth: 1, borderColor: '#E0EAE3' },
  sectionTitle: { fontSize: 16, fontWeight: 'bold', color: '#1A1A1A', marginBottom: 12 },
  input: { backgroundColor: '#F4F9F5', borderRadius: 12, paddingHorizontal: 12, height: 44, fontSize: 14, marginBottom: 12, borderWidth: 1, borderColor: '#E0EAE3' },
  textArea: { height: 80, textAlignVertical: 'top', paddingTop: 10 },
  paymentOption: { height: 44, borderRadius: 12, borderWidth: 1, borderColor: '#E0EAE3', justifyContent: 'center', paddingHorizontal: 16, marginBottom: 8 },
  paymentSelected: { borderColor: '#2E8B57', backgroundColor: '#E8F5E9' },
  paymentText: { fontSize: 14, color: '#333' },
  summaryRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  summaryLabel: { color: '#666', fontSize: 14 },
  summaryValue: { color: '#1A1A1A', fontSize: 14, fontWeight: '500' },
  footer: { backgroundColor: '#FFF', padding: 16, borderTopWidth: 1, borderTopColor: '#E0EAE3' },
  payBtn: { backgroundColor: '#2E8B57', height: 48, borderRadius: 12, justifyContent: 'center', alignItems: 'center' },
  payBtnText: { color: '#FFF', fontSize: 16, fontWeight: 'bold' }
}); 