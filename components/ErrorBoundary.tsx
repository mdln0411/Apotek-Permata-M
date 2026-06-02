import React, { Component, type ReactNode } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

type Props = {
  children: ReactNode;
};

type State = {
  error: Error | null;
};

export class ErrorBoundary extends Component<Props, State> {
  state: State = { error: null };

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  componentDidCatch(error: Error) {
    console.error('[ErrorBoundary]', error);
  }

  render() {
    if (this.state.error) {
      return (
        <View style={styles.container}>
          <Text style={styles.title}>Terjadi kesalahan</Text>
          <Text style={styles.message}>
            Tutup Expo Go sepenuhnya, lalu jalankan ulang dengan cache bersih:
          </Text>
          <Text style={styles.code}>npx expo start -c</Text>
          <Text style={styles.hint}>
            Pastikan backend Laravel juga berjalan (npm run backend).
          </Text>
          <TouchableOpacity
            style={styles.button}
            onPress={() => this.setState({ error: null })}
          >
            <Text style={styles.buttonText}>Coba lagi</Text>
          </TouchableOpacity>
        </View>
      );
    }

    return this.props.children;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
    backgroundColor: '#F0F4F7',
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#2C3E50',
    marginBottom: 12,
  },
  message: {
    fontSize: 14,
    color: '#7F8C8D',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 8,
  },
  code: {
    fontFamily: 'monospace',
    fontSize: 13,
    color: '#2E8B57',
    backgroundColor: '#E8F5E9',
    padding: 10,
    borderRadius: 8,
    marginVertical: 12,
    overflow: 'hidden',
  },
  hint: {
    fontSize: 13,
    color: '#95A5A6',
    textAlign: 'center',
    marginBottom: 24,
  },
  button: {
    backgroundColor: '#2E8B57',
    paddingHorizontal: 28,
    paddingVertical: 14,
    borderRadius: 10,
  },
  buttonText: {
    color: '#FFF',
    fontWeight: '600',
    fontSize: 16,
  },
});
