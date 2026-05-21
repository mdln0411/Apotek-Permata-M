import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  Image,
  Dimensions,
  TextInput,
  Platform,
} from 'react-native';
import { Feather, Ionicons } from '@expo/vector-icons';

interface Medicine {
  id: number;
  name: string;
  price: number;
  price_formatted: string;
  image_url: string | null;
  stock: number;
  unit: string | null;
}

interface QuantityModalProps {
  visible: boolean;
  onClose: () => void;
  onConfirm: (quantity: number) => void;
  medicine: Medicine | null;
}

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

export const QuantityModal: React.FC<QuantityModalProps> = ({
  visible,
  onClose,
  onConfirm,
  medicine,
}) => {
  const [quantity, setQuantity] = useState(1);

  React.useEffect(() => {
    if (visible) {
      setQuantity(1);
    }
  }, [visible]);

  if (!medicine) return null;

  const handleConfirm = () => {
    const finalQty = quantity < 1 ? 1 : quantity;
    onConfirm(finalQty);
    setQuantity(1); // Reset
  };

  const increment = () => {
    if (quantity < medicine.stock) setQuantity(quantity + 1);
  };

  const decrement = () => {
    if (quantity > 1) setQuantity(quantity - 1);
  };

  const handleQtyChange = (text: string) => {
    const cleanText = text.replace(/[^0-9]/g, '');
    if (cleanText === '') {
      setQuantity(0);
      return;
    }
    const val = parseInt(cleanText, 10);
    if (val > medicine.stock) {
      setQuantity(medicine.stock);
    } else {
      setQuantity(val);
    }
  };

  const handleBlur = () => {
    if (quantity < 1) {
      setQuantity(1);
    }
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <TouchableOpacity style={styles.dismiss} onPress={onClose} activeOpacity={1} />
        <View style={styles.content}>
          {/* Header & Product Info */}
          <View style={styles.header}>
            <View style={styles.imageWrapper}>
              {medicine.image_url ? (
                <Image source={{ uri: medicine.image_url }} style={styles.image} resizeMode="contain" />
              ) : (
                <Ionicons name="medical" size={40} color="#C8E6C9" />
              )}
            </View>
            <View style={styles.info}>
              <Text style={styles.price}>{medicine.price_formatted}</Text>
              <Text style={styles.stock}>Stok: {medicine.stock}</Text>
              <Text style={styles.unit}>{medicine.unit}</Text>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <Feather name="x" size={24} color="#999" />
            </TouchableOpacity>
          </View>

          <View style={styles.divider} />

          {/* Quantity Selector */}
          <View style={styles.row}>
            <Text style={styles.label}>Jumlah</Text>
            <View style={styles.qtyControl}>
              <TouchableOpacity onPress={decrement} style={[styles.qtyBtn, quantity <= 1 && styles.disabled]}>
                <Feather name="minus" size={18} color={quantity <= 1 ? '#CCC' : '#333'} />
              </TouchableOpacity>
              <TextInput
                style={styles.qtyInput}
                value={quantity === 0 ? '' : quantity.toString()}
                onChangeText={handleQtyChange}
                onBlur={handleBlur}
                keyboardType="numeric"
                selectTextOnFocus
                underlineColorAndroid="transparent"
              />
              <TouchableOpacity onPress={increment} style={[styles.qtyBtn, quantity >= medicine.stock && styles.disabled]}>
                <Feather name="plus" size={18} color={quantity >= medicine.stock ? '#CCC' : '#2E8B57'} />
              </TouchableOpacity>
            </View>
          </View>

          {/* Confirm Button */}
          <TouchableOpacity style={styles.confirmBtn} onPress={handleConfirm}>
            <Text style={styles.confirmText}>Masukkan Keranjang</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  dismiss: {
    flex: 1,
  },
  content: {
    backgroundColor: '#FFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    paddingBottom: 40,
  },
  header: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  imageWrapper: {
    width: 100,
    height: 100,
    backgroundColor: '#F8F8F8',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: -40, // Floating effect like Shopee
    borderWidth: 3,
    borderColor: '#FFF',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  info: {
    flex: 1,
    marginLeft: 16,
    justifyContent: 'center',
  },
  price: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2E8B57',
  },
  stock: {
    fontSize: 13,
    color: '#888',
    marginTop: 4,
  },
  unit: {
    fontSize: 13,
    color: '#888',
  },
  closeBtn: {
    padding: 4,
  },
  divider: {
    height: 1,
    backgroundColor: '#F0F0F0',
    marginBottom: 20,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 30,
  },
  label: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
  },
  qtyControl: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
  },
  qtyBtn: {
    padding: 10,
  },
  qtyText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    minWidth: 40,
    textAlign: 'center',
  },
  qtyInput: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    minWidth: 50,
    textAlign: 'center',
    paddingVertical: Platform.OS === 'web' ? 4 : 2,
    ...Platform.select({
      web: {
        outlineStyle: 'none',
      } as any,
    }),
  },
  disabled: {
    opacity: 0.5,
  },
  confirmBtn: {
    backgroundColor: '#2E8B57',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  confirmText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
