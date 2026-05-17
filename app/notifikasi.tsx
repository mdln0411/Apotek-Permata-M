import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { Stack, router } from 'expo-router';
import React, { useState } from 'react';
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
    primary: '#2E8B57', // Hijau Apotek
    background: '#F0F4F7',
    white: '#FFFFFF',
    textDark: '#2C3E50',
    textMuted: '#7F8C8D',
    border: '#E0E6ED',
};

const INITIAL_NOTIFICATIONS = [
    {
        id: '1',
        title: 'Kategori Obat Baru!',
        desc: 'Sekarang tersedia kategori obat Demam, Vitamin, dan P3K di katalog kami.',
        time: 'Baru saja',
        icon: 'medical-bag',
        color: '#E8F5E9',
        iconColor: '#2E8B57',
        isRead: false
    },
    {
        id: '2',
        title: 'Artikel Kesehatan Baru',
        desc: 'Baca artikel: "Mengenal Jenis-Jenis Antibiotik" untuk wawasan kesehatan Anda.',
        time: '10 mnt yang lalu',
        icon: 'book-open-variant',
        color: '#E3F2FD',
        iconColor: '#1976D2',
        isRead: false
    },
    {
        id: '3',
        title: 'Pesanan Diproses',
        desc: 'Pesanan #ORD-1002 Anda sedang disiapkan oleh Apoteker Permata.',
        time: '1 jam yang lalu',
        icon: 'clock-outline',
        color: '#FFF3E0',
        iconColor: '#F57C00',
        isRead: false
    },
    {
        id: '4',
        title: 'Promo Vitamin',
        desc: 'Diskon 20% untuk semua jenis Vitamin hari ini!',
        time: '5 jam yang lalu',
        icon: 'sale',
        color: '#F3E5F5',
        iconColor: '#7B1FA2',
        isRead: true
    }
];

export default function NotificationScreen() {
    const [notifs, setNotifs] = useState(INITIAL_NOTIFICATIONS);

    const markAllAsRead = () => {
        setNotifs(prevNotifs => 
            prevNotifs.map(notif => ({ ...notif, isRead: true }))
        );
    };

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor={THEME.primary} />
            <Stack.Screen 
                options={{ 
                    headerTitle: 'Notifikasi',
                    headerTintColor: THEME.white,
                    headerTitleStyle: { fontWeight: 'bold' },
                    headerLeft: () => (
                        <TouchableOpacity onPress={() => router.replace('/(tabs)')} style={{ marginLeft: 10 }}>
                            <Ionicons name="close" size={28} color={THEME.white} />
                        </TouchableOpacity>
                    ),
                    headerRight: () => (
                        <TouchableOpacity onPress={markAllAsRead} style={{ marginRight: 15 }}>
                            <Text style={{ color: THEME.white, fontWeight: 'bold' }}>Baca Semua</Text>
                        </TouchableOpacity>
                    ),
                    headerShadowVisible: false,
                    headerStyle: { backgroundColor: THEME.primary }
                }} 
            />

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
                {notifs.map((item) => (
                    <TouchableOpacity 
                        key={item.id} 
                        style={[styles.notifItem, !item.isRead && styles.unreadItem]}
                        onPress={() => {
                            setNotifs(prev => prev.map(n => n.id === item.id ? {...n, isRead: true} : n))
                        }}
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