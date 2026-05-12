import React from 'react';
import { View, Image, Text, StyleSheet, Pressable, StyleProp, ViewStyle, ImageStyle } from 'react-native';

type Product = {
  id: string;
  name: string;
  category: string;
  price: string;
  stock: number;
  image: string;
  requiresPrescription: boolean;
};

type Props = {
  product: Product;
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
  imageStyle?: StyleProp<ImageStyle>;
};

const ProductCard: React.FC<Props> = ({ product, onPress, style, imageStyle }) => {
  return (
    <Pressable style={[styles.card, style]} onPress={onPress}>
      <Image source={{ uri: product.image }} style={[styles.image, imageStyle]} />
      <View style={styles.info}>
        <View style={styles.titleRow}>
          <Text style={styles.name} numberOfLines={2}>{product.name}</Text>
          {product.requiresPrescription && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>Resep</Text>
            </View>
          )}
        </View>
        <Text style={styles.category}>{product.category}</Text>
        <Text style={styles.price}>{product.price}</Text>
        <Text style={styles.stock}>Stok: {product.stock}</Text>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    overflow: 'hidden',
    width: '48%', 
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#E8EFE8',
  },
  image: {
    width: '100%',
    aspectRatio: 1,
    resizeMode: 'cover',
  },
  info: {
    padding: 12,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: 4,
  },
  name: {
    flex: 1,
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    lineHeight: 18,
  },
  badge: {
    backgroundColor: '#A5D6A7', // Light green
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  badgeText: {
    color: '#1B5E20', // Dark green
    fontSize: 10,
    fontWeight: '600',
  },
  category: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
    marginBottom: 8,
  },
  price: {
    fontSize: 15,
    fontWeight: '700',
    color: '#2F8F57',
    marginBottom: 4,
  },
  stock: {
    fontSize: 11,
    color: '#888',
  },
});

export default ProductCard;
