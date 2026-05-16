import axiosClient from '@/api/axiosClient';
import { Feather, Ionicons } from '@expo/vector-icons';
import { Stack } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { 
    SafeAreaView, 
    ScrollView, 
    StyleSheet, 
    Text, 
    TouchableOpacity, 
    View, 
    TextInput,
    ActivityIndicator,
    Alert
} from 'react-native';

export default function ManageStock() {
    const [medicines, setMedicines] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');

    useEffect(() => {
        fetchMedicines();
    }, []);

    const fetchMedicines = async () => {
        try {
            setLoading(true);
            const response = await axiosClient.get('/api/medicines?per_page=500');
            setMedicines(response.data.data);
        } catch (error) {
            console.error('Error fetching medicines:', error);
        } finally {
            setLoading(false);
        }
    };

    const updateStock = async (id: number, currentStock: number, delta: number) => {
        const newStock = currentStock + delta;
        if (newStock < 0) return;

        try {
            // Kita gunakan API yang sudah ada, kirim data stock baru
            await axiosClient.put(`/api/medicines/${id}`, { 
                _method: 'PUT',
                stock: newStock 
            });
            
            // Update local state agar real-time terasa cepat
            setMedicines(prev => prev.map(m => m.id === id ? { ...m, stock: newStock } : m));
        } catch (error) {
            alert('Gagal update stok');
            fetchMedicines(); // Refresh jika gagal
        }
    };

    const filteredMedicines = medicines.filter(m => 
        m.name.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <SafeAreaView style={styles.container}>
            <Stack.Screen options={{ 
                headerShown: true, 
                title: 'Stok Obat Real-Time', 
                headerTintColor: '#FFF', 
                headerStyle: { backgroundColor: '#2E8B57' } 
            }} />

            <View style={styles.searchBar}>
                <Ionicons name="search" size={20} color="#999" style={{ marginRight: 10 }} />
                <TextInput 
                    placeholder="Cari obat untuk update stok..." 
                    style={styles.input} 
                    value={search}
                    onChangeText={setSearch}
                />
            </View>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
                {loading ? (
                    <ActivityIndicator size="large" color="#2E8B57" style={{ marginTop: 50 }} />
                ) : filteredMedicines.map((item) => (
                    <View key={item.id} style={styles.stockCard}>
                        <View style={styles.medInfo}>
                            <Text style={styles.medName}>{item.name}</Text>
                            <Text style={styles.medCat}>{item.category} • {item.unit || 'Pcs'}</Text>
                        </View>
                        
                        <View style={styles.stockAction}>
                            <TouchableOpacity 
                                style={styles.circleBtn} 
                                onPress={() => updateStock(item.id, item.stock, -1)}
                            >
                                <Feather name="minus" size={20} color="#666" />
                            </TouchableOpacity>
                            
                            <View style={styles.stockDisplay}>
                                <Text style={[styles.stockValue, item.stock < 10 && { color: '#FF5252' }]}>
                                    {item.stock}
                                </Text>
                                <Text style={styles.stockLabel}>Sisa</Text>
                            </View>

                            <TouchableOpacity 
                                style={[styles.circleBtn, { backgroundColor: '#E8F5E9' }]} 
                                onPress={() => updateStock(item.id, item.stock, 1)}
                            >
                                <Feather name="plus" size={20} color="#2E8B57" />
                            </TouchableOpacity>
                        </View>
                    </View>
                ))}
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F8FBF8' },
    searchBar: { 
        flexDirection: 'row', 
        alignItems: 'center', 
        backgroundColor: '#FFF', 
        margin: 20, 
        borderRadius: 12, 
        paddingHorizontal: 15, 
        height: 50,
        borderWidth: 1,
        borderColor: '#EEE'
    },
    input: { flex: 1, fontSize: 14 },
    scrollContent: { paddingHorizontal: 20, paddingBottom: 30 },
    stockCard: { 
        flexDirection: 'row', 
        backgroundColor: '#FFF', 
        padding: 16, 
        borderRadius: 18, 
        alignItems: 'center', 
        marginBottom: 12,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 5
    },
    medInfo: { flex: 1 },
    medName: { fontSize: 16, fontWeight: 'bold', color: '#333' },
    medCat: { fontSize: 12, color: '#999', marginTop: 2 },
    stockAction: { flexDirection: 'row', alignItems: 'center', gap: 15 },
    circleBtn: { width: 36, height: 36, borderRadius: 18, backgroundColor: '#F5F5F5', justifyContent: 'center', alignItems: 'center' },
    stockDisplay: { alignItems: 'center', minWidth: 40 },
    stockValue: { fontSize: 20, fontWeight: 'bold', color: '#333' },
    stockLabel: { fontSize: 10, color: '#999' }
});
