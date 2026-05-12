import { Image } from 'expo-image';

import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

export default function CartScreen() {
  const cartItems = [
  {
    id: 1,
    name: 'Paracetamol 500mg',
    price: 'Rp 15.000',
    qty: 2,
    image:
      'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?q=80&w=800',
  },

  {
    id: 2,
    name: 'Vitamin C 1000mg',
    price: 'Rp 35.000',
    qty: 1,
    image:
      'https://images.unsplash.com/photo-1584017911766-d451b3d0e843?q=80&w=800',
  },

  {
    id: 3,
    name: 'Ibuprofen 400mg',
    price: 'Rp 25.000',
    qty: 3,
    image:
      'https://images.unsplash.com/photo-1471864190281-a93a3070b6de?q=80&w=800',
  },
];

  return (
    <ScrollView style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <Text style={styles.logo}>Apotek Permata</Text>
        <Text style={styles.profile}>👤</Text>
      </View>

      <Text style={styles.title}>
        Keranjang Belanja
      </Text>

      {cartItems.map((item) => (
        <View key={item.id} style={styles.card}>
          <Image
            source={{ uri: item.image }}
            style={styles.image}
            contentFit="cover"
          />

          <View style={styles.content}>
            <Text style={styles.productName}>
              {item.name}
            </Text>

            <Text style={styles.price}>
              {item.price}
            </Text>

            <View style={styles.qtyContainer}>
              <TouchableOpacity style={styles.qtyButton}>
                <Text style={styles.qtyText}>−</Text>
              </TouchableOpacity>

              <Text style={styles.qtyNumber}>
                {item.qty}
              </Text>

              <TouchableOpacity style={styles.qtyButton}>
                <Text style={styles.qtyText}>+</Text>
              </TouchableOpacity>
            </View>
          </View>

          <TouchableOpacity>
            <Text style={styles.delete}>🗑️</Text>
          </TouchableOpacity>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F5F3',
    padding: 16,
  },

  header: {
    backgroundColor: '#1E8E5A',
    borderRadius: 16,
    padding: 18,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  logo: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 20,
  },

  profile: {
    fontSize: 20,
  },

  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginTop: 22,
    marginBottom: 18,
  },

  card: {
    backgroundColor: 'white',
    borderRadius: 18,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },

  image: {
    width: 75,
    height: 75,
    borderRadius: 14,
  },

  content: {
    flex: 1,
    marginLeft: 12,
  },

  productName: {
    fontSize: 18,
    fontWeight: '600',
  },

  price: {
    color: '#1E8E5A',
    fontWeight: 'bold',
    marginTop: 4,
    fontSize: 16,
  },

  qtyContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
    borderWidth: 1,
    borderColor: '#D8E3DB',
    borderRadius: 12,
    alignSelf: 'flex-start',
    overflow: 'hidden',
  },

  qtyButton: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    backgroundColor: '#F4F4F4',
  },

  qtyText: {
    fontSize: 18,
    fontWeight: 'bold',
  },

  qtyNumber: {
    paddingHorizontal: 16,
    fontWeight: '600',
  },

  delete: {
    fontSize: 20,
  },
});