import axiosClient from '@/api/axiosClient';
import { useAuth } from '@/context/AuthContext';
import { Feather, Ionicons } from '@expo/vector-icons';
import { router, Stack } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
    Platform,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';

export default function ApotekerDashboard() {
    const { user, logout } = useAuth();
    const [stats, setStats] = useState({
        pendingOrders: 0,
        lowStock: 0,
        totalConsultations: 0
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            setLoading(true);
            // Ambil data pesanan untuk dihitung statistiknya
            const orderRes = await axiosClient.get('/api/admin/orders');
            const medRes = await axiosClient.get('/api/medicines?per_page=500');

            const pending = orderRes.data.data.filter((o: any) => o.status === 'pending').length;
            const low = medRes.data.data.filter((m: any) => m.stock < 10).length;

            setStats({
                pendingOrders: pending,
                lowStock: low,
                totalConsultations: 0 // Fitur mendatang
            });
        } catch (error) {
            console.error('Error fetching dashboard data:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = async () => {
        await logout();
        router.replace('/login');
    };

    return (
        <SafeAreaView style={styles.container}>
            <Stack.Screen options={{ headerShown: false }} />

            {/* Header */}
            <View style={styles.header}>
                <View>
                    <Text style={styles.welcomeText}>Halo, Apoteker</Text>
                    <Text style={styles.adminName}>{user?.name || 'User'}</Text>
                </View>
                <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
                    <Feather name="log-out" size={20} color="#FF5252" />
                </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>

                {/* Stats Cards */}
                <View style={styles.statsGrid}>
                    <TouchableOpacity
                        style={[styles.statCard, { borderLeftColor: '#1976D2' }]}
                        onPress={() => router.push('/apoteker')}
                    >
                        <Text style={styles.statLabel}>Pesanan Baru</Text>
                        <Text style={[styles.statValue, { color: '#1976D2' }]}>{stats.pendingOrders}</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[styles.statCard, { borderLeftColor: '#F57C00' }]}
                        onPress={() => router.push('/apoteker/manage-stock')}
                    >
                        <Text style={styles.statLabel}>Stok Menipis</Text>
                        <Text style={[styles.statValue, { color: '#F57C00' }]}>{stats.lowStock}</Text>
                    </TouchableOpacity>
                </View>

                {/* Quick Actions */}
                <Text style={styles.sectionTitle}>Menu Utama Apoteker</Text>

                <View style={styles.menuContainer}>
                    <TouchableOpacity style={styles.menuItem} onPress={() => router.push('/apoteker')}>
                        <View style={[styles.iconBg, { backgroundColor: '#E3F2FD' }]}>
                            <Feather name="shopping-bag" size={24} color="#1976D2" />
                        </View>
                        <View style={styles.menuInfo}>
                            <Text style={styles.menuTitle}>Validasi Pesanan</Text>
                            <Text style={styles.menuDesc}>Proses pesanan obat dari pelanggan</Text>
                        </View>
                        <Feather name="chevron-right" size={20} color="#CCC" />
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.menuItem} onPress={() => router.push('/apoteker/manage-stock')}>
                        <View style={[styles.iconBg, { backgroundColor: '#E8F5E9' }]}>
                            <Feather name="package" size={24} color="#2E8B57" />
                        </View>
                        <View style={styles.menuInfo}>
                            <Text style={styles.menuTitle}>Manajemen Stok</Text>
                            <Text style={styles.menuDesc}>Cek dan update ketersediaan obat</Text>
                        </View>
                        <Feather name="chevron-right" size={20} color="#CCC" />
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.menuItem} onPress={() => router.push('/apoteker/prescriptions')}>
                        <View style={[styles.iconBg, { backgroundColor: '#FFF3E0' }]}>
                            <Feather name="file-text" size={24} color="#F57C00" />
                        </View>
                        <View style={styles.menuInfo}>
                            <Text style={styles.menuTitle}>Resep Digital</Text>
                            <Text style={styles.menuDesc}>Lihat resep yang diupload pengguna</Text>
                        </View>
                        <Feather name="chevron-right" size={20} color="#CCC" />
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.menuItem} onPress={() => router.push('/apoteker/consultation')}>
                        <View style={[styles.iconBg, { backgroundColor: '#F3E5F5' }]}>
                            <Ionicons name="chatbubbles-outline" size={24} color="#9C27B0" />
                        </View>
                        <View style={styles.menuInfo}>
                            <Text style={styles.menuTitle}>Konsultasi Online</Text>
                            <Text style={styles.menuDesc}>Tanya jawab dengan pasien</Text>
                        </View>
                        <Feather name="chevron-right" size={20} color="#CCC" />
                    </TouchableOpacity>
                </View>

            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F8FBF8' },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 24,
        paddingTop: Platform.OS === 'ios' ? 20 : 60,
        paddingBottom: 25,
        backgroundColor: '#FFF',
        borderBottomWidth: 1,
        borderBottomColor: '#EEE'
    },
    welcomeText: { fontSize: 14, color: '#999' },
    adminName: { fontSize: 20, fontWeight: 'bold', color: '#333' },
    logoutBtn: { width: 44, height: 44, borderRadius: 12, backgroundColor: '#FFF5F5', justifyContent: 'center', alignItems: 'center' },
    scrollContent: { padding: 24 },
    statsGrid: { flexDirection: 'row', gap: 16, marginBottom: 30 },
    statCard: { flex: 1, backgroundColor: '#FFF', borderRadius: 16, padding: 16, borderLeftWidth: 4, elevation: 2, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 5 },
    statLabel: { fontSize: 12, color: '#999', fontWeight: 'bold', marginBottom: 8 },
    statValue: { fontSize: 24, fontWeight: 'bold' },
    sectionTitle: { fontSize: 18, fontWeight: 'bold', color: '#333', marginBottom: 20 },
    menuContainer: { gap: 16 },
    menuItem: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFF', borderRadius: 18, padding: 16, elevation: 2, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 5 },
    iconBg: { width: 50, height: 50, borderRadius: 14, justifyContent: 'center', alignItems: 'center' },
    menuInfo: { flex: 1, marginLeft: 16 },
    menuTitle: { fontSize: 16, fontWeight: 'bold', color: '#333' },
    menuDesc: { fontSize: 12, color: '#999', marginTop: 2 },
});
