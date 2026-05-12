import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function KeuanganApotekerScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Halaman Keuangan (Dalam Pengembangan)</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#FAFAFA' },
  text: { fontSize: 16, color: '#666' }
});
