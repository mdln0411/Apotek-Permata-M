import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface LoginPromptModalProps {
  visible: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  message?: string;
}

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export const LoginPromptModal: React.FC<LoginPromptModalProps> = ({
  visible,
  onClose,
  onConfirm,
  title = 'Login Diperlukan',
  message = 'Silakan masuk ke akun Anda terlebih dahulu untuk menikmati akses penuh ke seluruh fitur kami.',
}) => {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <TouchableOpacity style={styles.dismiss} onPress={onClose} activeOpacity={1} />
        
        <View style={styles.contentCard}>
          {/* Top Decorative Icon */}
          <View style={styles.iconBg}>
            <View style={styles.iconCircle}>
              <Ionicons name="lock-closed" size={32} color="#FFF" />
            </View>
          </View>

          {/* Heading & Subtitle */}
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.message}>{message}</Text>

          {/* Buttons Stack */}
          <View style={styles.buttonStack}>
            <TouchableOpacity 
              style={styles.confirmBtn} 
              onPress={() => {
                onClose();
                onConfirm();
              }}
              activeOpacity={0.8}
            >
              <Text style={styles.confirmText}>Masuk Sekarang</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.cancelBtn} 
              onPress={onClose}
              activeOpacity={0.7}
            >
              <Text style={styles.cancelText}>Nanti Saja</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 28,
  },
  dismiss: {
    ...StyleSheet.absoluteFillObject,
  },
  contentCard: {
    width: '100%',
    maxWidth: 340,
    backgroundColor: '#FFF',
    borderRadius: 24,
    paddingHorizontal: 24,
    paddingTop: 32,
    paddingBottom: 24,
    alignItems: 'center',
    elevation: 10,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
  },
  iconBg: {
    marginBottom: 20,
  },
  iconCircle: {
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: '#2E8B57', // Premium green matching the theme
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#2E8B57',
    shadowOpacity: 0.3,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 10,
  },
  message: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 28,
    paddingHorizontal: 8,
  },
  buttonStack: {
    width: '100%',
    gap: 10,
  },
  confirmBtn: {
    backgroundColor: '#2E8B57',
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  confirmText: {
    color: '#FFF',
    fontSize: 15,
    fontWeight: 'bold',
  },
  cancelBtn: {
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  cancelText: {
    color: '#888',
    fontSize: 14,
    fontWeight: '600',
  },
});
