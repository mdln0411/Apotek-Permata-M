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
    TextInput,
    Platform,
    Image
} from 'react-native';

export default function ManageMedicines() {
    const [searchQuery, setSearchQuery] = useState('');
    const [sidebarVisible, setSidebarVisible] = useState(false);

    const medicines = [
        { id: '1', name: 'Paracetamol 500mg', category: 'Pain Relief', price: 'Rp 15.000', stock: 150, needsResep: false },
        { id: '2', name: 'Amoxicillin 500mg', category: 'Antibiotics', price: 'Rp 45.000', stock: 80, needsResep: true },
        { id: '3', name: 'Vitamin C 1000mg', category: 'Vitamins', price: 'Rp 35.000', stock: 200, needsResep: false },
        { id: '4', name: 'Ibuprofen 400mg', category: 'Pain Relief', price: 'Rp 25.000', stock: 120, needsResep: false },
        { id: '5', name: 'Omeprazole 20mg', category: 'Digestive', price: 'Rp 55.000', stock: 90, needsResep: true },
    ];

    return (
        <SafeAreaView style={styles.container}>
            <Stack.Screen options={{ headerShown: false }} />

            <AdminSidebar 
                visible={sidebarVisible} 
                onClose={() => setSidebarVisible(false)} 
                activePage="medicines" 
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
                
                {/* Title & Add Button */}
                <View style={styles.headerRow}>
                    <View>
                        <Text style={styles.pageTitle}>Manajemen Obat</Text>
                        <Text style={styles.pageSub}>{medicines.length} obat terdaftar</Text>
                    </View>
                    <TouchableOpacity style={styles.addBtn}>
                        <Ionicons name="add" size={20} color="#FFF" />
                        <Text style={styles.addBtnText}>Tambah</Text>
                    </TouchableOpacity>
                </View>

                {/* Search Bar */}
                <View style={styles.searchContainer}>
                    <Ionicons name="search-outline" size={20} color="#999" style={styles.searchIcon} />
                    <TextInput 
                        style={styles.searchInput}
                        placeholder="Cari obat..."
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                    />
                </View>

                {/* Medicine List */}
                <View style={styles.listContainer}>
                    {medicines.map((item) => (
                        <View key={item.id} style={styles.medCard}>
                            <View style={styles.medImageBg}>
                                <Ionicons name="medical-outline" size={30} color="#2E8B57" />
                            </View>
                            
                            <View style={styles.medInfo}>
                                <Text style={styles.medName}>{item.name}</Text>
                                <View style={styles.badgeRow}>
                                    <View style={styles.catBadge}>
                                        <Text style={styles.catText}>{item.category}</Text>
                                    </View>
                                    {item.needsResep && (
                                        <View style={styles.resepBadge}>
                                            <Text style={styles.resepText}>Resep</Text>
                                        </View>
                                    )}
                                </View>
                                <Text style={styles.medPrice}>{item.price} • <Text style={styles.medStock}>Stok: {item.stock}</Text></Text>
                            </View>

                            <View style={styles.actionBtns}>
                                <TouchableOpacity style={styles.actionBtn}>
                                    <Feather name="edit-3" size={18} color="#999" />
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.actionBtn}>
                                    <Feather name="trash-2" size={18} color="#FF5252" />
                                </TouchableOpacity>
                            </View>
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
    headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 },
    pageTitle: { fontSize: 22, fontWeight: 'bold', color: '#333' },
    pageSub: { fontSize: 13, color: '#999', marginTop: 2 },
    addBtn: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#2E8B57', paddingHorizontal: 16, paddingVertical: 10, borderRadius: 10, gap: 6 },
    addBtnText: { color: '#FFF', fontSize: 14, fontWeight: 'bold' },
    searchContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFF', borderRadius: 12, paddingHorizontal: 16, height: 50, borderWidth: 1, borderColor: '#EEE', marginBottom: 24 },
    searchIcon: { marginRight: 12 },
    searchInput: { flex: 1, fontSize: 15, color: '#333' },
    listContainer: { gap: 16 },
    medCard: { backgroundColor: '#FFF', borderRadius: 16, padding: 12, flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: '#EEE' },
    medImageBg: { width: 70, height: 70, borderRadius: 12, backgroundColor: '#F5F5F5', justifyContent: 'center', alignItems: 'center', marginRight: 16 },
    medInfo: { flex: 1 },
    medName: { fontSize: 15, fontWeight: 'bold', color: '#333', marginBottom: 4 },
    badgeRow: { flexDirection: 'row', gap: 6, marginBottom: 8 },
    catBadge: { backgroundColor: '#F0F4F0', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 },
    catText: { fontSize: 10, color: '#2E8B57', fontWeight: 'bold' },
    resepBadge: { backgroundColor: '#E8F5E9', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6, borderWidth: 1, borderColor: '#2E8B57' },
    resepText: { fontSize: 10, color: '#2E8B57', fontWeight: 'bold' },
    medPrice: { fontSize: 13, color: '#2E8B57', fontWeight: 'bold' },
    medStock: { color: '#999', fontWeight: 'normal' },
    actionBtns: { flexDirection: 'row', gap: 10, marginLeft: 10 },
    actionBtn: { width: 36, height: 36, borderRadius: 18, backgroundColor: '#F9F9F9', justifyContent: 'center', alignItems: 'center' }
});
