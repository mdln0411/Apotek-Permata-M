import { router } from 'expo-router';

import {
  StyleSheet,
  ScrollView,
  View,
  Text,
  TouchableOpacity,
} from 'react-native';

export default function HistoryScreen() {
  const orders = [
    {
      id: 'ORD-003',
      date: '8 April 2026',
      status: 'Diproses',
      total: 'Rp 75.000',
      items: '2 item',
      processing: true,
    },

    {
      id: 'ORD-002',
      date: '3 April 2026',
      status: 'Selesai',
      total: 'Rp 120.000',
      items: '3 item',
      processing: false,
    },

    {
      id: 'ORD-001',
      date: '28 Maret 2026',
      status: 'Selesai',
      total: 'Rp 45.000',
      items: '1 item',
      processing: false,
    },
  ];

  return (
    <ScrollView style={styles.container}>
      
      {/* HEADER */}
      <View style={styles.header}>
        <View style={styles.logoContainer}>
          <Text style={styles.logoIcon}>💊</Text>

          <Text style={styles.logoText}>
            Apotek Permata
          </Text>
        </View>

        <TouchableOpacity
          style={styles.cartButton}
          onPress={() => router.push('/cart')}>
          <Text style={styles.cartIcon}>🛒</Text>

          <View style={styles.badge}>
            <Text style={styles.badgeText}>3</Text>
          </View>
        </TouchableOpacity>
      </View>

      {/* TITLE */}
      <Text style={styles.pageTitle}>
        Riwayat Pesanan
      </Text>

      {/* ORDER LIST */}
      {orders.map((order, index) => (
        <TouchableOpacity
          key={index}
          style={styles.orderCard}
          onPress={() => router.push('/status-pemesanan')}>
          
          <View style={styles.topRow}>
            <View>
              <Text style={styles.orderId}>
                {order.id}
              </Text>

              <Text style={styles.orderDate}>
                {order.date}
              </Text>
            </View>

            <View
              style={
                order.processing
                  ? styles.processBadge
                  : styles.doneBadge
              }>
              <Text
                style={
                  order.processing
                    ? styles.processText
                    : styles.doneText
                }>
                {order.status}
              </Text>
            </View>
          </View>

          <View style={styles.divider} />

          <View style={styles.bottomRow}>
            <Text style={styles.itemCount}>
              {order.items}
            </Text>

            <Text style={styles.totalPrice}>
              {order.total}
            </Text>
          </View>
        </TouchableOpacity>
      ))}

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

  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  logoIcon: {
    fontSize: 22,
    marginRight: 10,
  },

  logoText: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },

  cartButton: {
    position: 'relative',
  },

  cartIcon: {
    fontSize: 22,
    color: 'white',
  },

  badge: {
    position: 'absolute',
    top: -8,
    right: -10,
    backgroundColor: '#D7F2C9',
    width: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },

  badgeText: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#1E8E5A',
  },

  pageTitle: {
    fontSize: 34,
    fontWeight: 'bold',
    marginTop: 24,
    marginBottom: 20,
  },

  orderCard: {
    backgroundColor: 'white',
    borderRadius: 18,
    padding: 16,
    marginBottom: 16,
  },

  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },

  orderId: {
    fontSize: 22,
    fontWeight: '600',
  },

  orderDate: {
    color: '#666',
    marginTop: 6,
  },

  processBadge: {
    backgroundColor: '#F6E7A7',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },

  doneBadge: {
    backgroundColor: '#BFE3B7',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },

  processText: {
    color: '#7B5D00',
    fontWeight: '600',
    fontSize: 12,
  },

  doneText: {
    color: '#1E6B2D',
    fontWeight: '600',
    fontSize: 12,
  },

  divider: {
    height: 1,
    backgroundColor: '#E4E4E4',
    marginVertical: 18,
  },

  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  itemCount: {
    color: '#666',
  },

  totalPrice: {
    color: '#1E8E5A',
    fontSize: 24,
    fontWeight: 'bold',
  },
});