import { Image } from 'expo-image';
import { router } from 'expo-router';

import {
  StyleSheet,
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  TextInput,
} from 'react-native';

export default function HomeScreen() {
  const products = [
  {
    id: 1,
    name: 'Paracetamol 500mg',
    category: 'Pain Relief',
    price: 'Rp 15.000',
    stock: 'Stok: 150',
    image:
      'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?q=80&w=800',
  },

  {
    id: 2,
    name: 'Amoxicillin 500mg',
    category: 'Antibiotics',
    price: 'Rp 45.000',
    stock: 'Stok: 80',
    image:
      'https://images.unsplash.com/photo-1587854692152-cbe660dbde88?q=80&w=800',
  },
];

  return (
    <ScrollView
      style={styles.container}
      showsVerticalScrollIndicator={false}>
      
      {/* HEADER */}
      <View style={styles.header}>
        <View>
          <Text style={styles.logo}>Apotek Permata</Text>
          <Text style={styles.subLogo}>
            Solusi kesehatan terpercaya
          </Text>
        </View>

        <View style={styles.headerIcons}>
          <TouchableOpacity
            style={styles.iconBox}
            onPress={() => router.push('/cart')}>
            <Text style={styles.icon}>🛒</Text>            
          </TouchableOpacity>

          <TouchableOpacity style={styles.iconBox}>
            <Text style={styles.icon}>👤</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* SEARCH */}
      <View style={styles.searchContainer}>
        <TextInput
          placeholder="Cari obat..."
          placeholderTextColor="#888"
          style={styles.searchInput}
        />

        <TouchableOpacity style={styles.searchButton}>
          <Text style={{ color: 'white', fontWeight: 'bold' }}>
            Cari
          </Text>
        </TouchableOpacity>
      </View>

      {/* WELCOME CARD */}
      <View style={styles.welcomeCard}>
        <View style={styles.avatarContainer}>
          <Text style={{ fontSize: 40 }}>👤</Text>
        </View>

        <View style={{ flex: 1 }}>
          <Text style={styles.welcomeTitle}>
            Selamat Datang!
          </Text>

          <Text style={styles.username}>
            Medelein
          </Text>

          <Text style={styles.welcomeDesc}>
            Semoga sehat selalu 🌿
          </Text>
        </View>
      </View>

      {/* MENU */}
<View style={styles.menuWrapper}>
  <TouchableOpacity style={styles.menuCard}>
    <Text style={styles.menuEmoji}>🛍️</Text>
    <Text style={styles.menuText}>Belanja</Text>
  </TouchableOpacity>

  <TouchableOpacity
    style={styles.menuCard}
    onPress={() => router.push('/cart')}>
    <Text style={styles.menuEmoji}>📦</Text>
    <Text style={styles.menuText}>Keranjang</Text>
  </TouchableOpacity>

  <TouchableOpacity style={styles.menuCard}>
    <Text style={styles.menuEmoji}>🕘</Text>
    <Text style={styles.menuText}>Riwayat</Text>
  </TouchableOpacity>

  <TouchableOpacity style={styles.menuCard}>
    <Text style={styles.menuEmoji}>💊</Text>
    <Text style={styles.menuText}>Kategori</Text>
  </TouchableOpacity>
</View>

      {/* PESANAN */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>
          Pesanan Terbaru
        </Text>

        <TouchableOpacity>
          <Text style={styles.seeAll}>
            Lihat Semua
          </Text>
        </TouchableOpacity>
      </View>

      {/* ORDER CARD */}
      <TouchableOpacity style={styles.orderCard}>
        <View>
          <Text style={styles.orderId}>
            ORD-001
          </Text>

          <Text style={styles.orderDate}>
            5 April 2026
          </Text>
        </View>

        <View style={{ alignItems: 'flex-end' }}>
          <View style={styles.doneBadge}>
            <Text style={styles.badgeText}>
              Selesai
            </Text>
          </View>

          <Text style={styles.orderPrice}>
            Rp 85.000
          </Text>
        </View>
      </TouchableOpacity>

      <TouchableOpacity style={styles.orderCard}>
        <View>
          <Text style={styles.orderId}>
            ORD-002
          </Text>

          <Text style={styles.orderDate}>
            3 April 2026
          </Text>
        </View>

        <View style={{ alignItems: 'flex-end' }}>
          <View style={styles.processBadge}>
            <Text style={styles.badgeText}>
              Diproses
            </Text>
          </View>

          <Text style={styles.orderPrice}>
            Rp 120.000
          </Text>
        </View>
      </TouchableOpacity>

      {/* REKOMENDASI */}
      <Text style={styles.sectionTitle}>
        Rekomendasi untuk Anda
      </Text>

      <View style={styles.productContainer}>
        {products.map((item) => (
          <TouchableOpacity
            key={item.id}
            style={styles.productCard}>

            <Image
              source={{ uri: item.image }}
              style={styles.productImage}
              contentFit="cover"/>

            <View style={styles.productContent}>
              <Text style={styles.productTitle}>
                {item.name}
              </Text>

              <Text style={styles.productCategory}>
                {item.category}
              </Text>

              <View style={styles.productFooter}>
                <View>
                  <Text style={styles.productPrice}>
                    {item.price}
                  </Text>

                  <Text style={styles.productStock}>
                    {item.stock}
                  </Text>
                </View>

                <TouchableOpacity style={styles.buyButton}>
                  <Text style={styles.buyText}>
                    Beli
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </View>

      {/* BOTTOM SPACE */}
      <View style={{ height: 30 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F4F7F8',
    paddingHorizontal: 16,
    paddingTop: 20,
  },

  header: {
    backgroundColor: '#1E8E5A',
    borderRadius: 20,
    padding: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  logo: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
  },

  subLogo: {
    color: '#D8F3E2',
    marginTop: 4,
  },

  headerIcons: {
    flexDirection: 'row',
    gap: 10,
  },

  iconBox: {
    width: 42,
    height: 42,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },

  icon: {
    fontSize: 20,
  },

  searchContainer: {
    flexDirection: 'row',
    marginTop: 18,
    gap: 10,
  },

  searchInput: {
    flex: 1,
    backgroundColor: 'white',
    borderRadius: 14,
    paddingHorizontal: 16,
    height: 50,
    fontSize: 15,
  },

  searchButton: {
    backgroundColor: '#1E8E5A',
    paddingHorizontal: 20,
    borderRadius: 14,
    justifyContent: 'center',
  },

  welcomeCard: {
    marginTop: 20,
    backgroundColor: '#53B67B',
    borderRadius: 22,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },

  avatarContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#81D4A1',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 18,
  },

  welcomeTitle: {
    color: 'white',
    fontSize: 26,
    fontWeight: 'bold',
  },

  username: {
    color: 'white',
    fontSize: 16,
    marginTop: 4,
  },

  welcomeDesc: {
    color: '#E8FFF0',
    marginTop: 6,
  },

  menuWrapper: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginTop: 22,
  },

  menuCard: {
    width: '48%',
    backgroundColor: 'white',
    borderRadius: 18,
    paddingVertical: 24,
    alignItems: 'center',
    marginBottom: 15,
  },

  menuEmoji: {
    fontSize: 32,
    marginBottom: 10,
  },

  menuText: {
    fontSize: 15,
    fontWeight: '600',
  },

  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 12,
    marginBottom: 12,
  },

  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginTop: 10,
  },

  seeAll: {
    color: '#1E8E5A',
    fontWeight: '600',
  },

  orderCard: {
    backgroundColor: 'white',
    borderRadius: 18,
    padding: 18,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },

  orderId: {
    fontWeight: 'bold',
    fontSize: 17,
  },

  orderDate: {
    color: '#666',
    marginTop: 5,
  },

  doneBadge: {
    backgroundColor: '#C9F1D7',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 5,
    marginBottom: 8,
  },

  processBadge: {
    backgroundColor: '#FFE5A3',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 5,
    marginBottom: 8,
  },

  badgeText: {
    fontWeight: '600',
    fontSize: 12,
  },

  orderPrice: {
    fontWeight: 'bold',
    fontSize: 16,
  },

  productContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    marginTop: 15,
  },

  productCard: {
    width: '48%',
    backgroundColor: 'white',
    borderRadius: 18,
    overflow: 'hidden',
    marginBottom: 18,
  },

  productImage: {
    width: '100%',
    height: 150,
  },

  productContent: {
    padding: 12,
  },

  productTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },

  productCategory: {
    color: '#777',
    marginTop: 4,
  },

  productFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 14,
  },

  productPrice: {
    color: '#1E8E5A',
    fontWeight: 'bold',
    fontSize: 16,
  },

  productStock: {
    color: '#777',
    marginTop: 2,
    fontSize: 12,
  },

  buyButton: {
    backgroundColor: '#1E8E5A',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 10,
  },

  buyText: {
    color: 'white',
    fontWeight: 'bold',
  },
});