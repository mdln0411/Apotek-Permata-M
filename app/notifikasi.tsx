import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { Stack, router } from 'expo-router';
import React from 'react';
import {
    SafeAreaView,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';

const THEME = {
    primary: '#2E8B57',
    background: '#F0F4F7',
    white: '#FFFFFF',
    textDark: '#2C3E50',
    textMuted: '#7F8C8D',
    border: '#E0E6ED',
};

const notifications = [
    {
        id: '1',
        title: 'Pesanan Dikirim',
        desc: 'Pesanan #ORD-9921 Anda sedang dalam perjalanan oleh kurir.',
        time: '5 mnt yang lalu',
        icon: 'truck-delivery-outline',
        color: '#E3F2FD',
        iconColor: '#1976D2',
        isRead: false
    },
    {
        id: '2',
        title: 'Promo Flash Sale!',
        desc: 'Dapatkan diskon hingga 50% untuk produk vitamin hari ini saja.',
        time: '2 jam yang lalu',
        icon: 'sale',
        color: '#FFF3E0',
        iconColor: '#F57C00',
        isRead: false
    },
    {
        id: '3',
        title: 'Pengingat Obat',
        desc: 'Waktunya minum Amoxicillin sesuai jadwal Anda.',
        time: '4 jam yang lalu',
        icon: 'bell-ring-outline',
        color: '#F3E5F5',
        iconColor: '#7B1FA2',
        isRead: true
    },
    {
        id: '4',
        title: 'Konsultasi Selesai',
        desc: 'Dokter telah memberikan resep digital untuk keluhan Anda.',
        time: '1 hari yang lalu',
        icon: 'message-check-outline',
        color: '#E8F5E9',
        iconColor: '#2E8B57',
        isRead: true
    }
];

export default function NotificationScreen() {
    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="dark-content" />
            <Stack.Screen 
                options={{ 
                    headerTitle: 'Notifikasi',
                    headerTitleStyle: { fontWeight: 'bold', color: THEME.textDark },
                    headerLeft: () => (
                        <TouchableOpacity onPress={() => router.replace('/(tabs)')} style={{ marginLeft: 10 }}>
                            <Ionicons name="close" size={28} color={THEME.textDark} />
                        </TouchableOpacity>
                    ),
                    headerRight: () => (
                        <TouchableOpacity style={{ marginRight: 15 }}>
                            <Text style={{ color: THEME.primary, fontWeight: 'bold' }}>Baca Semua</Text>
                        </TouchableOpacity>
                    ),
                    headerShadowVisible: true,
                    headerStyle: { backgroundColor: THEME.white }
                }} 
            />

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
                {notifications.map((item) => (
                    <TouchableOpacity 
                        key={item.id} 
                        style={[styles.notifItem, !item.isRead && styles.unreadItem]}
                    >
                        <View style={[styles.iconBox, { backgroundColor: item.color }]}>
                            <MaterialCommunityIcons name={item.icon as any} size={24} color={item.iconColor} />
                        </View>
                        <View style={styles.contentBox}>
                            <View style={styles.contentHeader}>
                                <Text style={styles.title}>{item.title}</Text>
                                <Text style={styles.time}>{item.time}</Text>
                            </View>
                            <Text style={styles.description} numberOfLines={2}>
                                {item.desc}
                            </Text>
                        </View>
                        {!item.isRead && <View style={styles.dot} />}
                    </TouchableOpacity>
                ))}
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: THEME.white },
    scrollContent: { paddingVertical: 10 },
    notifItem: {
        flexDirection: 'row',
        padding: 15,
        borderBottomWidth: 1,
        borderBottomColor: THEME.border,
        alignItems: 'center',
    },
    unreadItem: { backgroundColor: '#F9FCF9' },
    iconBox: {
        width: 48,
        height: 48,
        borderRadius: 24,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 15,
    },
    contentBox: { flex: 1 },
    contentHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 },
    title: { fontSize: 15, fontWeight: 'bold', color: THEME.textDark },
    time: { fontSize: 11, color: THEME.textMuted },
    description: { fontSize: 13, color: THEME.textMuted, lineHeight: 18 },
    dot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: THEME.primary,
        marginLeft: 10,
    }
});