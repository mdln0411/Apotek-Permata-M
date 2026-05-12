import { router } from 'expo-router';

import {
  StyleSheet,
  ScrollView,
  View,
  Text,
  TouchableOpacity,
} from 'react-native';

export default function StatusScreen() {
  return (
    <ScrollView style={styles.container}>
      
      {/* HEADER */}
      <View style={styles.header}>
        <Text style={styles.logo}>Apotek Permata</Text>
        <Text style={styles.profile}>👤</Text>
      </View>

      {/* TITLE */}
      <View style={styles.topSection}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.backButton}>←</Text>
        </TouchableOpacity>

        <View>
          <Text style={styles.pageTitle}>
            Status Pesanan
          </Text>

          <Text style={styles.orderId}>
            ORD-003
          </Text>
        </View>
      </View>

      {/* TIMELINE */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>
          Timeline Pesanan
        </Text>

        {/* STEP 1 */}
        <View style={styles.timelineItem}>
          <View style={styles.timelineLeft}>
            <View style={styles.activeCircle}>
              <Text style={styles.circleIcon}>📦</Text>
            </View>

            <View style={styles.line} />
          </View>

          <View>
            <Text style={styles.activeTitle}>
              Pesanan Diterima
            </Text>

            <Text style={styles.time}>
              08 Apr 2026, 10:30
            </Text>
          </View>
        </View>

        {/* STEP 2 */}
        <View style={styles.timelineItem}>
          <View style={styles.timelineLeft}>
            <View style={styles.activeCircle}>
              <Text style={styles.circleIcon}>💊</Text>
            </View>

            <View style={styles.line} />
          </View>

          <View>
            <Text style={styles.activeTitle}>
              Diproses oleh Apoteker
            </Text>

            <Text style={styles.time}>
              08 Apr 2026, 11:00
            </Text>
          </View>
        </View>

        {/* STEP 3 */}
        <View style={styles.timelineItem}>
          <View style={styles.timelineLeft}>
            <View style={styles.pendingCircle}>
              <Text style={styles.circleIcon}>🚚</Text>
            </View>

            <View style={styles.lineLight} />
          </View>

          <View>
            <Text style={styles.pendingTitle}>
              Dalam Pengiriman
            </Text>
          </View>
        </View>

        {/* STEP 4 */}
        <View style={styles.timelineItem}>
          <View style={styles.timelineLeft}>
            <View style={styles.pendingCircle}>
              <Text style={styles.circleIcon}>✅</Text>
            </View>
          </View>

          <View>
            <Text style={styles.pendingTitle}>
              Pesanan Selesai
            </Text>
          </View>
        </View>
      </View>

      {/* ITEM PESANAN */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>
          Item Pesanan
        </Text>

        <View style={styles.itemRow}>
          <View>
            <Text style={styles.itemName}>
              Paracetamol 500mg
            </Text>

            <Text style={styles.itemQty}>
              2x
            </Text>
          </View>

          <Text style={styles.itemPrice}>
            Rp 30.000
          </Text>
        </View>

        <View style={styles.itemRow}>
          <View>
            <Text style={styles.itemName}>
              Vitamin C 1000mg
            </Text>

            <Text style={styles.itemQty}>
              1x
            </Text>
          </View>

          <Text style={styles.itemPrice}>
            Rp 35.000
          </Text>
        </View>

        <View style={styles.divider} />

        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>
            Subtotal
          </Text>

          <Text style={styles.summaryValue}>
            Rp 65.000
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

        <View style={styles.summaryRow}>
          <Text style={styles.totalLabel}>
            Total
          </Text>

          <Text style={styles.totalValue}>
            Rp 75.000
          </Text>
        </View>
      </View>

      {/* BUTTON */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.historyButton}>
          <Text style={styles.historyText}>
            Lihat Riwayat
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.buyAgainButton}>
          <Text style={styles.buyAgainText}>
            Belanja Lagi
          </Text>
        </TouchableOpacity>
      </View>

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
    color: 'white',
    fontSize: 18,
  },

  topSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 22,
    marginBottom: 18,
  },

  backButton: {
    fontSize: 24,
    marginRight: 14,
  },

  pageTitle: {
    fontSize: 28,
    fontWeight: 'bold',
  },

  orderId: {
    color: '#777',
    marginTop: 4,
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
    marginBottom: 20,
  },

  timelineItem: {
    flexDirection: 'row',
    marginBottom: 18,
  },

  timelineLeft: {
    alignItems: 'center',
    marginRight: 14,
  },

  activeCircle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#1E8E5A',
    justifyContent: 'center',
    alignItems: 'center',
  },

  pendingCircle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#DCE8DF',
    justifyContent: 'center',
    alignItems: 'center',
  },

  circleIcon: {
    fontSize: 16,
  },

  line: {
    width: 2,
    height: 45,
    backgroundColor: '#1E8E5A',
    marginTop: 4,
  },

  lineLight: {
    width: 2,
    height: 45,
    backgroundColor: '#DCE8DF',
    marginTop: 4,
  },

  activeTitle: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 4,
  },

  pendingTitle: {
    fontWeight: '500',
    fontSize: 16,
    marginTop: 6,
  },

  time: {
    color: '#777',
  },

  itemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 18,
  },

  itemName: {
    fontWeight: '600',
    marginBottom: 4,
  },

  itemQty: {
    color: '#777',
  },

  itemPrice: {
    fontWeight: '600',
  },

  divider: {
    height: 1,
    backgroundColor: '#E4E4E4',
    marginBottom: 14,
  },

  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },

  summaryLabel: {
    color: '#666',
  },

  summaryValue: {
    color: '#666',
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

  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },

  historyButton: {
    width: '48%',
    borderWidth: 1,
    borderColor: '#D7D7D7',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    backgroundColor: 'white',
  },

  historyText: {
    fontWeight: '500',
  },

  buyAgainButton: {
    width: '48%',
    backgroundColor: '#1E8E5A',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },

  buyAgainText: {
    color: 'white',
    fontWeight: 'bold',
  },
});