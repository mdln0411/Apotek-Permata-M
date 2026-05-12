import {
  StyleSheet,
  ScrollView,
  View,
  Text,
  TouchableOpacity,
} from 'react-native';

export default function CheckoutScreen() {
  return (
    <ScrollView style={styles.container}>
      
      {/* HEADER */}
      <View style={styles.header}>
        <Text style={styles.logo}>Apotek Permata</Text>
        <Text style={styles.profile}>👤</Text>
      </View>

      <Text style={styles.pageTitle}>
        Checkout
      </Text>

      {/* INFORMASI PENGIRIMAN */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>
          Informasi Pengiriman
        </Text>

        <View style={styles.infoGroup}>
          <Text style={styles.label}>Nama Lengkap</Text>
          <Text style={styles.value}>Medelain</Text>
        </View>

        <View style={styles.infoGroup}>
          <Text style={styles.label}>No. HP</Text>
          <Text style={styles.value}>081234567890</Text>
        </View>

        <View style={styles.infoGroup}>
          <Text style={styles.label}>Alamat Lengkap</Text>
          <Text style={styles.value}>
            Jl. Gatot Subroto No. 12, Medan
          </Text>
        </View>
      </View>

      {/* METODE PEMBAYARAN */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>
          Metode Pembayaran
        </Text>

        <TouchableOpacity style={styles.paymentButton}>
          <Text style={styles.radio}>●</Text>
          <Text style={styles.paymentText}>
            Transfer Bank
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.paymentButton}>
          <Text style={styles.radioInactive}>○</Text>
          <Text style={styles.paymentText}>
            Cash on Delivery (COD)
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.paymentButton}>
          <Text style={styles.radioInactive}>○</Text>
          <Text style={styles.paymentText}>
            E-Wallet
          </Text>
        </TouchableOpacity>
      </View>

      {/* UPLOAD RESEP */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>
          Upload Resep (Opsional)
        </Text>

        <TouchableOpacity style={styles.uploadBox}>
          <Text style={styles.uploadIcon}>📤</Text>

          <Text style={styles.uploadText}>
            Klik untuk upload resep dokter
          </Text>

          <View style={styles.fileButton}>
            <Text style={styles.fileButtonText}>
              Pilih File
            </Text>
          </View>
        </TouchableOpacity>

        <Text style={styles.note}>
          * Wajib untuk obat yang memerlukan resep dokter
        </Text>
      </View>

      {/* RINGKASAN */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>
          Ringkasan Pesanan
        </Text>

        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>
            Subtotal
          </Text>

          <Text style={styles.summaryValue}>
            Rp 95.000
          </Text>
        </View>

        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>
            Ongkir
          </Text>

          <Text style={styles.summaryValue}>
            Rp 10.000
          </Text>
        </View>

        <View style={styles.divider} />

        <View style={styles.summaryRow}>
          <Text style={styles.totalLabel}>
            Total Pembayaran
          </Text>

          <Text style={styles.totalValue}>
            Rp 105.000
          </Text>
        </View>
      </View>

      {/* BUTTON */}
      <TouchableOpacity style={styles.checkoutButton}>
        <Text style={styles.checkoutText}>
          Buat Pesanan
        </Text>
      </TouchableOpacity>

      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F5F4',
    padding: 16,
  },

  header: {
    backgroundColor: '#1E8E5A',
    borderRadius: 18,
    padding: 18,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  logo: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },

  profile: {
    fontSize: 18,
    color: 'white',
  },

  pageTitle: {
    fontSize: 30,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 18,
  },

  card: {
    backgroundColor: 'white',
    borderRadius: 18,
    padding: 16,
    marginBottom: 16,
  },

  cardTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 16,
  },

  infoGroup: {
    marginBottom: 16,
  },

  label: {
    fontSize: 14,
    color: '#666',
    marginBottom: 6,
  },

  value: {
    fontSize: 16,
    fontWeight: '500',
  },

  paymentButton: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#D9E4DC',
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 14,
    marginBottom: 12,
  },

  radio: {
    color: '#1E8E5A',
    marginRight: 10,
    fontSize: 16,
  },

  radioInactive: {
    color: '#999',
    marginRight: 10,
    fontSize: 16,
  },

  paymentText: {
    fontSize: 15,
  },

  uploadBox: {
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: '#D4D4D4',
    borderRadius: 16,
    paddingVertical: 28,
    alignItems: 'center',
  },

  uploadIcon: {
    fontSize: 34,
    marginBottom: 10,
  },

  uploadText: {
    color: '#555',
    marginBottom: 12,
  },

  fileButton: {
    borderWidth: 1,
    borderColor: '#CFCFCF',
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 8,
    backgroundColor: '#F8F8F8',
  },

  fileButtonText: {
    fontWeight: '500',
  },

  note: {
    marginTop: 10,
    color: '#777',
    fontSize: 12,
  },

  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },

  summaryLabel: {
    color: '#555',
  },

  summaryValue: {
    color: '#555',
  },

  divider: {
    height: 1,
    backgroundColor: '#E3E3E3',
    marginBottom: 12,
  },

  totalLabel: {
    fontWeight: 'bold',
    fontSize: 16,
  },

  totalValue: {
    color: '#1E8E5A',
    fontWeight: 'bold',
    fontSize: 18,
  },

  checkoutButton: {
    backgroundColor: '#1E8E5A',
    paddingVertical: 18,
    borderRadius: 16,
    alignItems: 'center',
    marginTop: 10,
  },

  checkoutText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 17,
  },
});