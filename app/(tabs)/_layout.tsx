import { Feather, Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { useAuth } from '../../context/AuthContext';

export default function TabLayout() {
  const { unreadChatCount } = useAuth();

  return (



    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#2E8B57',
        tabBarInactiveTintColor: '#888',
        headerShown: false,
        tabBarStyle: {
          height: 70,
          paddingBottom: 10,
          paddingTop: 10,
          backgroundColor: '#FFF',
          borderTopWidth: 1,
          borderTopColor: '#F0F0F0',
        },
      }}

    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Beranda',
          tabBarIcon: ({ color }) => (
            <View>
              <Ionicons name="home-outline" size={24} color={color} />
            </View>
          ),
        }}
      />

      <Tabs.Screen
        name="katalog-obat"
        options={{
          title: 'Katalog',
          tabBarIcon: ({ color }) => <Ionicons name="grid-outline" size={24} color={color} />,
        }}
      />
      {/* Tombol Tengah: Keranjang */}
      <Tabs.Screen
        name="keranjang"
        options={{
          title: 'Keranjang',
          tabBarIcon: ({ focused }) => (
            <View style={styles.centerButton}>
              <Ionicons name="cart" size={28} color="#FFF" />
            </View>
          ),
          tabBarLabel: 'Keranjang',
        }}
      />
      <Tabs.Screen
        name="pesanan"
        options={{
          title: 'Pesanan',
          tabBarIcon: ({ color }) => <Feather name="clipboard" size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="profil"
        options={{
          title: 'Akun',
          tabBarIcon: ({ color }) => (
            <View>
              <Ionicons name="person-outline" size={24} color={color} />
            </View>
          ),
        }}
      />


    </Tabs>
  );
}

const styles = StyleSheet.create({
  centerButton: {
    width: 54,
    height: 54,
    backgroundColor: '#2E8B57',
    borderRadius: 27,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: -30, // Membuatnya menonjol ke atas
    borderWidth: 4,
    borderColor: '#FFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
  },
  tabBadge: {
    position: 'absolute',
    right: -6,
    top: -3,
    backgroundColor: '#FF5252',
    borderRadius: 9,
    width: 18,
    height: 18,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#FFF',
  },
  tabBadgeText: {
    color: '#FFF',
    fontSize: 9,
    fontWeight: 'bold',
  }
});