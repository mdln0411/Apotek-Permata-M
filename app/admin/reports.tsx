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
    Platform,
    Dimensions
} from 'react-native';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export default function AdminReports() {
    const [sidebarVisible, setSidebarVisible] = useState(false);
    const bestSellers = [
        { id: '1', name: 'Paracetamol 500mg', units: '245 unit terjual', total: 'Rp 3675k' },
        { id: '2', name: 'Vitamin C 1000mg', units: '180 unit terjual', total: 'Rp 6300k' },
        { id: '3', name: 'Ibuprofen 400mg', units: '156 unit terjual', total: 'Rp 3900k' },
        { id: '4', name: 'Amoxicillin 500mg', units: '89 unit terjual', total: 'Rp 4005k' },
    ];

    return (
        <SafeAreaView style={styles.container}>
            <Stack.Screen options={{ headerShown: false }} />

            <AdminSidebar 
                visible={sidebarVisible} 
                onClose={() => setSidebarVisible(false)} 
                activePage="reports" 
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
                    <Text style={styles.pageTitle}>Laporan</Text>
                    <Text style={styles.pageSub}>Ringkasan dan analisis data</Text>
                </View>

                {/* Tabs */}
                <View style={styles.tabsContainer}>
                    <TouchableOpacity style={[styles.tab, styles.activeTab]}>
                        <Text style={[styles.tabText, styles.activeTabText]}>Penjualan</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.tab}>
                        <Text style={styles.tabText}>Stok</Text>
                    </TouchableOpacity>
                </View>

                {/* Sales Trend Chart */}
                <View style={styles.reportCard}>
                    <View style={styles.cardHeader}>
                        <Text style={styles.cardTitle}>Tren Penjualan</Text>
                        <TouchableOpacity style={styles.exportBtn}>
                            <Feather name="download" size={14} color="#555" />
                            <Text style={styles.exportText}>Export</Text>
                        </TouchableOpacity>
                    </View>

                    <View style={styles.chartContainer}>
                        {/* Simulasi Line Chart */}
                        <View style={styles.chartArea}>
                            <View style={styles.yAxis}>
                                <Text style={styles.yAxisText}>16M</Text>
                                <Text style={styles.yAxisText}>12M</Text>
                                <Text style={styles.yAxisText}>8M</Text>
                                <Text style={styles.yAxisText}>4M</Text>
                                <Text style={styles.yAxisText}>0</Text>
                            </View>
                            <View style={styles.chartRight}>
                                <View style={styles.chartLines}>
                                    <View style={styles.chartLine} /><View style={styles.chartLine} /><View style={styles.chartLine} /><View style={styles.chartLine} />
                                </View>
                                {/* Simulasi Titik & Garis Tren */}
                                <View style={styles.trendPlot}>
                                    <View style={[styles.plotDot, { bottom: '40%', left: '10%' }]} />
                                    <View style={[styles.plotDot, { bottom: '70%', left: '40%' }]} />
                                    <View style={[styles.plotDot, { bottom: '65%', left: '70%' }]} />
                                    <View style={[styles.plotDot, { bottom: '90%', left: '90%' }]} />
                                </View>
                            </View>
                        </View>
                        <View style={styles.xAxis}>
                            <Text style={styles.xAxisText}>Jan</Text>
                            <Text style={styles.xAxisText}>Feb</Text>
                            <Text style={styles.xAxisText}>Mar</Text>
                            <Text style={styles.xAxisText}>Apr</Text>
                        </View>
                    </View>
                </View>

                {/* Best Selling Products */}
                <View style={styles.reportCard}>
                    <Text style={styles.cardTitle}>Produk Terlaris</Text>
                    {bestSellers.map((item) => (
                        <View key={item.id} style={styles.productRow}>
                            <View style={styles.rankBadge}>
                                <Text style={styles.rankText}>{item.id}</Text>
                            </View>
                            <View style={styles.productInfo}>
                                <Text style={styles.productName}>{item.name}</Text>
                                <Text style={styles.productUnits}>{item.units}</Text>
                            </View>
                            <Text style={styles.productTotal}>{item.total}</Text>
                        </View>
                    ))}
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
    tabsContainer: { flexDirection: 'row', backgroundColor: '#E8F5E9', borderRadius: 10, padding: 4, marginBottom: 24 },
    tab: { flex: 1, paddingVertical: 8, alignItems: 'center', borderRadius: 8 },
    activeTab: { backgroundColor: '#FFF' },
    tabText: { fontSize: 13, color: '#2E8B57', fontWeight: '500' },
    activeTabText: { color: '#2E8B57', fontWeight: 'bold' },
    reportCard: { backgroundColor: '#FFF', borderRadius: 16, padding: 16, marginBottom: 20, borderWidth: 1, borderColor: '#EEE' },
    cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 },
    cardTitle: { fontSize: 15, fontWeight: 'bold', color: '#333' },
    exportBtn: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: '#F5F5F5', paddingHorizontal: 10, paddingVertical: 6, borderRadius: 6 },
    exportText: { fontSize: 11, color: '#555', fontWeight: 'bold' },
    chartContainer: { height: 220 },
    chartArea: { flex: 1, flexDirection: 'row' },
    yAxis: { width: 30, justifyContent: 'space-between', paddingBottom: 10 },
    yAxisText: { fontSize: 9, color: '#999', textAlign: 'right' },
    chartRight: { flex: 1, marginLeft: 10, position: 'relative' },
    chartLines: { flex: 1, justifyContent: 'space-between', paddingBottom: 10 },
    chartLine: { height: 1, backgroundColor: '#F0F0F0' },
    trendPlot: { ...StyleSheet.absoluteFillObject, paddingBottom: 10 },
    plotDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#2E8B57', position: 'absolute', borderWidth: 2, borderColor: '#FFF' },
    xAxis: { flexDirection: 'row', justifyContent: 'space-around', marginLeft: 40, marginTop: 10 },
    xAxisText: { fontSize: 10, color: '#999' },
    productRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: '#F5F5F5' },
    rankBadge: { width: 26, height: 26, borderRadius: 13, backgroundColor: '#F0F4F0', justifyContent: 'center', alignItems: 'center', marginRight: 12 },
    rankText: { fontSize: 11, fontWeight: 'bold', color: '#2E8B57' },
    productInfo: { flex: 1 },
    productName: { fontSize: 14, color: '#333', fontWeight: '500' },
    productUnits: { fontSize: 11, color: '#999', marginTop: 2 },
    productTotal: { fontSize: 13, fontWeight: 'bold', color: '#2E8B57' }
});
