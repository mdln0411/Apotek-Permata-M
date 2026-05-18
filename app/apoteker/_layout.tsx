import { Feather, Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import React from 'react';

export default function ApotekerLayout() {
    return (
        <Tabs screenOptions={{
            tabBarActiveTintColor: '#2E8B57',
            tabBarInactiveTintColor: '#9DA8B5',
            tabBarLabelStyle: {
                fontSize: 11,
                fontWeight: '600',
            },
            tabBarStyle: {
                backgroundColor: '#FFFFFF',
                borderTopWidth: 1,
                borderTopColor: '#E8ECEF',
                height: 110,
                paddingBottom: 40,
                paddingTop: 10,
                elevation: 20,
                shadowColor: '#000',
                shadowOffset: { width: 0, height: -4 },
                shadowOpacity: 0.05,
                shadowRadius: 8
            },
            headerShown: false,
        }}>
            <Tabs.Screen
                name="index"
                options={{
                    title: 'Pesanan',
                    tabBarIcon: ({ color, size }) => (
                        <Feather name="shopping-bag" size={size} color={color} />
                    ),
                }}
            />
            <Tabs.Screen
                name="consultation"
                options={{
                    title: 'Konsultasi',
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name="chatbubbles-outline" size={size} color={color} />
                    ),
                }}
            />
            <Tabs.Screen
                name="finance"
                options={{
                    title: 'Keuangan',
                    tabBarIcon: ({ color, size }) => (
                        <Feather name="pie-chart" size={size} color={color} />
                    ),
                }}
            />
            <Tabs.Screen
                name="profile"
                options={{
                    title: 'Profil',
                    tabBarIcon: ({ color, size }) => (
                        <Feather name="user" size={size} color={color} />
                    ),
                }}
            />

            {/* Sembunyikan halaman yang bukan merupakan Tab utama */}
            <Tabs.Screen name="chat-room" options={{ href: null }} />
            <Tabs.Screen name="dashboard" options={{ href: null }} />
            <Tabs.Screen name="orders" options={{ href: null }} />
            <Tabs.Screen name="manage-stock" options={{ href: null }} />
            <Tabs.Screen name="prescriptions" options={{ href: null }} />
            <Tabs.Screen name="keamanan" options={{ href: null }} />
        </Tabs>
    );
}
