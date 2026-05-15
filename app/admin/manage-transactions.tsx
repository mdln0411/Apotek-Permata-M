import AdminSidebar from '@/components/AdminSidebar';
import { Feather, Ionicons } from '@expo/vector-icons';
import { router, Stack } from 'expo-router';
import React, { useState } from 'react';
import { 
    SafeAreaView, 
    ScrollView, 
    StyleSheet, 
    Text, 
    TouchableOpacity, 
    View, 
    Platform
} from 'react-native';

export default function ManageTransactions() {
    const [sidebarVisible, setSidebarVisible] = useState(false);
    const transactions = [
        { id: 'ORD-003', user: 'Medelain', date: '8/4/2026', items: '2 Item', payment: 'Transfer Bank', amount: 'Rp 75.000', status: 'Diproses' },
        { id: 'ORD-002', user: 'Yarlin Khun', date: '7/4/2026', items: '1 Item', payment: 'COD', amount: 'Rp 45.000', status: 'Selesai' },
        { id: 'ORD-001', user: 'Hizkia Chan', date: '6/4/2026', items: '3 Item', payment: 'E-Wallet', amount: 'Rp 120.000', status: 'Menunggu' },
    ];

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'Diproses': return { bg: '#FFF9C4', text: '#F57C00' };
            case 'Selesai': return { bg: '#E8F5E9', text: '#2E8B57' };
            case 'Menunggu': return { bg: '#E3F2FD', text: '#1976D2' };
            default: return { bg: '#F5F5F5', text: '#999' };
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <Stack.Screen options={{ headerShown: false }} />

            <AdminSidebar 
                visible={sidebarVisible} 
                onClose={() => setSidebarVisible(false)} 
                activePage="transactions" 
            />

            {/* Header */}
            <View style={styles.topBar}>
                <View style={styles.headerLeft}>
                    <TouchableOpacity onPress={() => setSidebarVisible(true)} style={styles.menuIcon}>
                        <Ionicons name="menu" size={28} color="#FFF" />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => router.back()} style={styles.backRow}>
                        <Ionicons name="arrow-back" size={20} color="#FFF" />
                        <Text style={styles.backText}>Kembali</Text>
                    </TouchableOpacity>
                </View>
                <TouchableOpacity style={styles.profileCircle}>
                    <Ionicons name="person-outline" size={20} color="#FFF" />
                </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
                
                <View style={styles.headerTitleRow}>
                    <Text style={styles.pageTitle}>Manajemen Transaksi</Text>
                    <Text style={styles.pageSub}>{transactions.length} transaksi</Text>
                </View>

                {/* Filter Status */}
                <View style={styles.filterCard}>
                    <Text style={styles.filterLabel}>Filter Status</Text>
                    <TouchableOpacity style={styles.dropdown}>
                        <Text style={styles.dropdownText}>Semua Status</Text>
                        <Ionicons name="chevron-down" size={18} color="#999" />
                    </TouchableOpacity>
                </View>

                {/* Transaction List */}
                <View style={styles.listContainer}>
                    {transactions.map((item) => {
                        const statusColor = getStatusColor(item.status);
                        return (
                            <View key={item.id} style={styles.transCard}>
                                <View style={styles.cardHeader}>
                                    <View>
                                        <Text style={styles.orderId}>{item.id}</Text>
                                        <Text style={styles.customerName}>{item.user}</Text>
                                        <Text style={styles.orderDate}>{item.date}</Text>
                                    </View>
                                    <View style={[styles.statusBadge, { backgroundColor: statusColor.bg }]}>
                                        <Text style={[styles.statusText, { color: statusColor.text }]}>{item.status}</Text>
                                    </View>
                                </View>
                                
                                <View style={styles.divider} />
                                
                                <View style={styles.cardFooter}>
                                    <Text style={styles.itemDetail}>{item.items} • {item.payment}</Text>
                                    <Text style={styles.totalAmount}>{item.amount}</Text>
                                </View>
                            </View>
                        );
                    })}
                </View>

            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F8FBF8' },
    topBar: { 
        flexDirection: 'row', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        paddingHorizontal: 16, 
        paddingTop: Platform.OS === 'ios' ? 20 : 50, 
        paddingBottom: 20, 
        backgroundColor: '#2E8B57' 
    },
    headerLeft: { flexDirection: 'row', alignItems: 'center', gap: 5 },
    menuIcon: { width: 40, height: 40, justifyContent: 'center', alignItems: 'center' },
    backRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
    backText: { color: '#FFF', fontSize: 14, fontWeight: '500' },
    profileCircle: { width: 36, height: 36, borderRadius: 18, backgroundColor: 'rgba(255,255,255,0.2)', justifyContent: 'center', alignItems: 'center' },
    scrollContent: { padding: 20 },
    headerTitleRow: { marginBottom: 20 },
    pageTitle: { fontSize: 22, fontWeight: 'bold', color: '#333' },
    pageSub: { fontSize: 13, color: '#999', marginTop: 2 },
    filterCard: { backgroundColor: '#FFF', borderRadius: 12, padding: 16, marginBottom: 24, borderWidth: 1, borderColor: '#EEE' },
    filterLabel: { fontSize: 12, color: '#999', fontWeight: 'bold', marginBottom: 10, textTransform: 'uppercase' },
    dropdown: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#F9F9F9', borderRadius: 8, paddingHorizontal: 12, height: 44, borderWidth: 1, borderColor: '#EEE' },
    dropdownText: { fontSize: 14, color: '#333' },
    listContainer: { gap: 16 },
    transCard: { backgroundColor: '#FFF', borderRadius: 16, padding: 16, borderWidth: 1, borderColor: '#EEE' },
    cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 },
    orderId: { fontSize: 15, fontWeight: 'bold', color: '#333', marginBottom: 2 },
    customerName: { fontSize: 13, color: '#555' },
    orderDate: { fontSize: 11, color: '#999', marginTop: 2 },
    statusBadge: { paddingHorizontal: 12, paddingVertical: 4, borderRadius: 20 },
    statusText: { fontSize: 12, fontWeight: 'bold' },
    divider: { height: 1, backgroundColor: '#F5F5F5', marginBottom: 16 },
    cardFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    itemDetail: { fontSize: 12, color: '#777' },
    totalAmount: { fontSize: 15, fontWeight: 'bold', color: '#2E8B57' }
});
