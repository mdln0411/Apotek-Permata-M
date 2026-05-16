import axiosClient from '@/api/axiosClient';
import { Feather, Ionicons } from '@expo/vector-icons';
import { Stack, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { 
    SafeAreaView, 
    ScrollView, 
    StyleSheet, 
    Text, 
    TouchableOpacity, 
    View, 
    Platform,
    TextInput,
    ActivityIndicator,
    RefreshControl
} from 'react-native';

export default function KonsultasiApoteker() {
    const router = useRouter();
    const [search, setSearch] = useState('');
    const [consultations, setConsultations] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    useEffect(() => {
        fetchConsultations();
    }, []);

    const fetchConsultations = async () => {
        try {
            setLoading(true);
            const response = await axiosClient.get('/api/consultations');
            setConsultations(response.data.data);
        } catch (error) {
            console.error('Error fetching consultations:', error);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    const filteredConsultations = consultations.filter(c => 
        c.user?.name?.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <SafeAreaView style={styles.container}>
            <Stack.Screen options={{ headerShown: false }} />

            <View style={styles.header}>
                <Text style={styles.headerTitle}>Konsultasi Pasien</Text>
                <Text style={styles.headerSub}>Layani tanya jawab obat secara online</Text>
            </View>

            <View style={styles.searchBar}>
                <Ionicons name="search" size={20} color="#999" style={{ marginRight: 10 }} />
                <TextInput 
                    placeholder="Cari nama pasien..." 
                    style={styles.input} 
                    value={search}
                    onChangeText={setSearch}
                />
            </View>

            <ScrollView 
                showsVerticalScrollIndicator={false} 
                contentContainerStyle={styles.scrollContent}
                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); fetchConsultations(); }} />}
            >
                {loading && !refreshing ? (
                    <ActivityIndicator size="large" color="#2E8B57" style={{ marginTop: 50 }} />
                ) : (
                    <View style={styles.chatList}>
                        {filteredConsultations.length === 0 ? (
                            <Text style={{ textAlign: 'center', color: '#999', marginTop: 50 }}>Belum ada sesi konsultasi.</Text>
                        ) : filteredConsultations.map((chat) => (
                            <TouchableOpacity 
                                key={chat.id} 
                                style={styles.chatItem}
                                onPress={() => router.push(`/apoteker/chat-room?id=${chat.id}`)}
                            >
                                <View style={styles.avatar}>
                                    <Text style={styles.avatarText}>{chat.user?.name?.charAt(0)}</Text>
                                    {chat.status === 'active' && <View style={styles.onlineBadge} />}
                                </View>
                                
                                <View style={styles.chatInfo}>
                                    <View style={styles.chatHeader}>
                                        <Text style={styles.patientName}>{chat.user?.name}</Text>
                                        <Text style={styles.chatTime}>
                                            {new Date(chat.updated_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </Text>
                                    </View>
                                    <View style={styles.msgRow}>
                                        <Text style={styles.lastMsg} numberOfLines={1}>
                                            {chat.messages && chat.messages.length > 0 
                                                ? chat.messages[0].message 
                                                : 'Mulai sesi konsultasi...'}
                                        </Text>
                                        {chat.status === 'active' && <View style={styles.unreadBadge} />}
                                    </View>
                                </View>
                            </TouchableOpacity>
                        ))}
                    </View>
                )}
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F8FBF8' },
    header: { 
        backgroundColor: '#2E8B57', 
        paddingTop: Platform.OS === 'ios' ? 20 : 60, 
        paddingBottom: 30, 
        paddingHorizontal: 24
    },
    headerTitle: { fontSize: 22, fontWeight: 'bold', color: '#FFF' },
    headerSub: { fontSize: 13, color: 'rgba(255,255,255,0.8)', marginTop: 4 },
    searchBar: { 
        flexDirection: 'row', 
        alignItems: 'center', 
        backgroundColor: '#FFF', 
        marginHorizontal: 20, 
        marginTop: -20, 
        borderRadius: 12, 
        paddingHorizontal: 15, 
        height: 50,
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4
    },
    input: { flex: 1, fontSize: 14 },
    scrollContent: { padding: 20, paddingTop: 10 },
    chatList: { gap: 12 },
    chatItem: { flexDirection: 'row', backgroundColor: '#FFF', padding: 16, borderRadius: 18, alignItems: 'center', borderWidth: 1, borderColor: '#F0F0F0' },
    avatar: { width: 50, height: 50, borderRadius: 25, backgroundColor: '#E8F5E9', justifyContent: 'center', alignItems: 'center', position: 'relative' },
    avatarText: { color: '#2E8B57', fontWeight: 'bold', fontSize: 18 },
    onlineBadge: { position: 'absolute', right: 2, bottom: 2, width: 12, height: 12, borderRadius: 6, backgroundColor: '#4CAF50', borderWidth: 2, borderColor: '#FFF' },
    chatInfo: { flex: 1, marginLeft: 15 },
    chatHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 },
    patientName: { fontSize: 15, fontWeight: 'bold', color: '#333' },
    chatTime: { fontSize: 11, color: '#999' },
    msgRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    lastMsg: { fontSize: 13, color: '#777', flex: 1, marginRight: 10 },
    unreadBadge: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#2E8B57' }
});
