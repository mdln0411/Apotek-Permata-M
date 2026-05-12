import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import Header from '../../components/header';

export default function KeranjangScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Header title="Keranjang" />

      <ScrollView contentContainerStyle={styles.itemList}>
        
        {/* Item 1 */}
        <View style={styles.cartItem}>
          <View style={styles.itemIconBg}><Text style={{fontSize: 24}}>💊</Text></View>
          <View style={styles.itemDetails}>
            <Text style={styles.itemName}>Paracetamol 500mg</Text>
            <View style={styles.qtyController}>
              <TouchableOpacity style={styles.qtyBtn}><Ionicons name="remove" size={16} /></TouchableOpacity>
              <Text style={styles.qtyText}>2</Text>
              <TouchableOpacity style={[styles.qtyBtn, {backgroundColor: '#2E8B57'}]}><Ionicons name="add" size={16} color="#FFF" /></TouchableOpacity>
            </View>
          </View>
          <View style={styles.priceAction}>
            <TouchableOpacity><Ionicons name="trash-outline" size={20} color="#D32F2F" /></TouchableOpacity>
            <Text style={styles.itemTotal}>Rp 30.000</Text>
          </View>
        </View>

        {/* Item 2 */}
        <View style={styles.cartItem}>
          <View style={styles.itemIconBg}><Text style={{fontSize: 24}}>💊</Text></View>
          <View style={styles.itemDetails}>
            <Text style={styles.itemName}>Vitamin C 1000mg</Text>
            <View style={styles.qtyController}>
              <TouchableOpacity style={styles.qtyBtn}><Ionicons name="remove" size={16} /></TouchableOpacity>
              <Text style={styles.qtyText}>1</Text>
              <TouchableOpacity style={[styles.qtyBtn, {backgroundColor: '#2E8B57'}]}><Ionicons name="add" size={16} color="#FFF" /></TouchableOpacity>
            </View>
          </View>
          <View style={styles.priceAction}>
            <TouchableOpacity><Ionicons name="trash-outline" size={20} color="#D32F2F" /></TouchableOpacity>
            <Text style={styles.itemTotal}>Rp 25.000</Text>
          </View>
        </View>

      </ScrollView>

      {/* Rincian Biaya Bawah */}
      <View style={styles.summaryBox}>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Subtotal</Text>
          <Text style={styles.summaryValue}>Rp 55.000</Text>
        </View>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Pengiriman</Text>
          <Text style={styles.summaryValue}>Rp 15.000</Text>
        </View>
        <View style={[styles.summaryRow, styles.totalRow]}>
          <Text style={styles.totalLabel}>Total</Text>
          <Text style={styles.totalValue}>Rp 70.000</Text>
        </View>

        {/* Navigasi di-bypass menggunakan 'as any' agar bebas error TypeScript */}
        <TouchableOpacity style={styles.checkoutBtn} onPress={() => router.push('/checkout' as any)}>
          <Text style={styles.checkoutBtnText}>Lanjut Pembayaran</Text>
          <Ionicons name="arrow-forward" size={18} color="#FFF" style={{marginLeft: 8}} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F4F9F5' },
  itemList: { padding: 16 },
  cartItem: { flexDirection: 'row', backgroundColor: '#FFF', borderRadius: 16, padding: 12, marginBottom: 12, borderWidth: 1, borderColor: '#E0EAE3', alignItems: 'center' },
  itemIconBg: { width: 50, height: 50, borderRadius: 12, backgroundColor: '#E8F5E9', justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  itemDetails: { flex: 1 },
  itemName: { fontSize: 15, fontWeight: 'bold', color: '#1A1A1A', marginBottom: 8 },
  qtyController: { flexDirection: 'row', alignItems: 'center' },
  qtyBtn: { width: 28, height: 28, borderRadius: 14, backgroundColor: '#E0EAE3', justifyContent: 'center', alignItems: 'center' },
  qtyText: { marginHorizontal: 12, fontSize: 15, fontWeight: 'bold' },
  priceAction: { alignItems: 'flex-end', justifyContent: 'space-between', height: 60 },
  itemTotal: { fontSize: 14, fontWeight: 'bold', color: '#2E8B57' },
  summaryBox: { backgroundColor: '#FFF', borderTopWidth: 1, borderTopColor: '#E0EAE3', padding: 16 },
  summaryRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  summaryLabel: { color: '#666', fontSize: 14 },
  summaryValue: { color: '#1A1A1A', fontSize: 14, fontWeight: '500' },
  totalRow: { borderTopWidth: 1, borderTopColor: '#E0EAE3', paddingTop: 12, marginTop: 4, marginBottom: 16 },
  totalLabel: { fontSize: 16, fontWeight: 'bold', color: '#1A1A1A' },
  totalValue: { fontSize: 18, fontWeight: 'bold', color: '#2E8B57' },
  checkoutBtn: { backgroundColor: '#2E8B57', height: 48, borderRadius: 12, flexDirection: 'row', justifyContent: 'center', alignItems: 'center' },
  checkoutBtnText: { color: '#FFF', fontSize: 16, fontWeight: 'bold' }
});