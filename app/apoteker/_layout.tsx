import React from 'react';
import { Tabs } from 'expo-router';
import { Feather, Ionicons } from '@expo/vector-icons';

export default function ApotekerLayout() {
    return (
        <Tabs screenOptions={{
            tabBarActiveTintColor: '#2E8B57',
            tabBarInactiveTintColor: '#999',
            tabBarStyle: {
                backgroundColor: '#FFF',
                borderTopWidth: 1,
                borderTopColor: '#EEE',
                height: 60,
                paddingBottom: 8,
                paddingTop: 8,
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
            <Tabs.Screen name="manage-stock" options={{ href: null }} />
            <Tabs.Screen name="prescriptions" options={{ href: null }} />
        </Tabs>
    );
}
