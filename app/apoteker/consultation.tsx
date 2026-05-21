import axiosClient from '@/api/axiosClient';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { Stack, useFocusEffect, useRouter } from 'expo-router';
import React, { useCallback, useState } from 'react';
import {
    ActivityIndicator,
    Platform,
    RefreshControl,
    SafeAreaView,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';

const THEME = {
    primary: '#2E8B57',
    secondary: '#F0F9F4',
    white: '#FFFFFF',
    textDark: '#2C3E50',
    textMuted: '#7F8C8D',
    danger: '#FF5252',
    warning: '#FFA000',
    info: '#1976D2',
    border: '#E8ECEF',
    success: '#4CAF50'
};

export default function KonsultasiApoteker() {
    const router = useRouter();
    const [search, setSearch] = useState('');
    const [consultations, setConsultations] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    const fetchConsultations = async () => {
        try {
            setLoading(true);
            const response = await axiosClient.get('/api/consultations');
            setConsultations(response.data.data || []);
        } catch (error) {
            console.error('Error fetching consultations:', error);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useFocusEffect(
        useCallback(() => {
            fetchConsultations();
        }, [])
    );

    const filteredConsultations = consultations.filter(c => 
        c.user?.name?.toLowerCase().includes(search.toLowerCase())
    );

    const getStatusColor = (status: string) => {
        switch(status?.toLowerCase()) {
            case 'active': return THEME.success;
            case 'closed': return THEME.textMuted;
            default: return THEME.warning;
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor={THEME.primary} />
            <Stack.Screen options={{ headerShown: false }} />

            {/* Header Section */}
            <View style={styles.header}>
                <View style={styles.headerTop}>
                    <TouchableOpacity style={styles.backBtn} onPress={() => router.push('/apoteker/dashboard')}>
                        <Ionicons name="chevron-back" size={24} color={THEME.white} />
                    </TouchableOpacity>
                    <View>
                        <Text style={styles.headerTitle}>Konsultasi Pasien</Text>
                        <Text style={styles.headerSub}>Kelola sesi tanya jawab kesehatan</Text>
                    </View>
                </View>
                
                {/* Search Bar Attached to Header */}
                <View style={styles.searchContainer}>
                    <View style={styles.searchBox}>
                        <Ionicons name="search-outline" size={20} color={THEME.textMuted} />
                        <TextInput 
                            placeholder="Cari nama pasien..." 
                            style={styles.searchInput} 
                            placeholderTextColor={THEME.textMuted}
                            value={search}
                            onChangeText={setSearch}
                            underlineColorAndroid="transparent"
                        />
                        {search.length > 0 && (
                            <TouchableOpacity onPress={() => setSearch('')}>
                                <Ionicons name="close-circle" size={18} color={THEME.textMuted} />
                            </TouchableOpacity>
                        )}
                    </View>
                </View>
            </View>

            <ScrollView 
                showsVerticalScrollIndicator={false} 
                contentContainerStyle={styles.scrollContent}
                refreshControl={
                    <RefreshControl 
                        refreshing={refreshing} 
                        onRefresh={() => { setRefreshing(true); fetchConsultations(); }} 
                        colors={[THEME.primary]} 
                    />
                }
            >
                {loading && !refreshing ? (
                    <View style={styles.centerBox}>
                        <ActivityIndicator size="large" color={THEME.primary} />
                    </View>
                ) : (
                    <View style={styles.chatList}>
                        {filteredConsultations.length === 0 ? (
                            <View style={styles.emptyContainer}>
                                <MaterialCommunityIcons name="message-off-outline" size={80} color={THEME.border} />
                                <Text style={styles.emptyText}>Tidak ada sesi konsultasi ditemukan</Text>
                            </View>
                        ) : (
                            filteredConsultations.map((chat) => (
                                <TouchableOpacity 
                                    key={chat.id} 
                                    style={styles.chatItem}
                                    onPress={() => router.push(`/apoteker/chat-room?id=${chat.id}`)}
                                    activeOpacity={0.7}
                                >
                                    <View style={styles.avatarContainer}>
                                        <View style={[styles.avatar, { backgroundColor: THEME.secondary }]}>
                                            <Text style={styles.avatarText}>{chat.user?.name?.charAt(0).toUpperCase()}</Text>
                                        </View>
                                        {chat.status === 'active' && <View style={styles.onlineIndicator} />}
                                    </View>
                                    
                                    <View style={styles.chatContent}>
                                        <View style={styles.chatHeader}>
                                            <Text style={styles.patientName} numberOfLines={1}>{chat.user?.name}</Text>
                                            <Text style={styles.chatTime}>
                                                {new Date(chat.updated_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </Text>
                                        </View>
                                        
                                        <View style={styles.messageRow}>
                                            <Text style={styles.lastMessage} numberOfLines={1}>
                                                {chat.messages && chat.messages.length > 0 
                                                    ? chat.messages[0].message 
                                                    : 'Mulai sesi konsultasi...'}
                                            </Text>
                                            <View style={[styles.statusTag, { backgroundColor: getStatusColor(chat.status) + '20' }]}>
                                                <Text style={[styles.statusText, { color: getStatusColor(chat.status) }]}>
                                                    {chat.status === 'active' ? 'Aktif' : 'Selesai'}
                                                </Text>
                                            </View>
                                        </View>
                                    </View>
                                    <Ionicons name="chevron-forward" size={20} color={THEME.border} />
                                </TouchableOpacity>
                            ))
                        )}
                    </View>
                )}
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F8F9FA' },
    header: { 
        backgroundColor: THEME.primary, 
        paddingTop: Platform.OS === 'android' ? 60 : 40, 
        paddingBottom: 25, 
        paddingHorizontal: 20,
        borderBottomLeftRadius: 30,
        borderBottomRightRadius: 30,
        elevation: 8,
        shadowColor: THEME.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 10
    },
    headerTop: { flexDirection: 'row', alignItems: 'center', marginBottom: 20 },
    backBtn: { marginRight: 15, padding: 5 },
    headerTitle: { fontSize: 24, fontWeight: 'bold', color: THEME.white },
    headerSub: { fontSize: 13, color: 'rgba(255,255,255,0.8)', marginTop: 2 },
    searchContainer: {
        marginTop: 5
    },
    searchBox: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: THEME.white,
        borderRadius: 15,
        paddingHorizontal: 15,
        height: 50,
        elevation: 2,
    },
    searchInput: {
        flex: 1,
        marginLeft: 10,
        fontSize: 15,
        color: THEME.textDark,
        fontFamily: Platform.OS === 'ios' ? 'System' : 'sans-serif',
        outlineStyle: 'none' as any,
    },
    scrollContent: { padding: 20, paddingTop: 10 },
    centerBox: { marginTop: 100, alignItems: 'center' },
    chatList: { gap: 12 },
    chatItem: { 
        flexDirection: 'row', 
        alignItems: 'center', 
        backgroundColor: THEME.white, 
        padding: 15, 
        borderRadius: 20,
        borderWidth: 1,
        borderColor: THEME.border,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 3
    },
    avatarContainer: { position: 'relative' },
    avatar: { 
        width: 55, 
        height: 55, 
        borderRadius: 20, 
        justifyContent: 'center', 
        alignItems: 'center',
        borderWidth: 1,
        borderColor: THEME.border
    },
    avatarText: { fontSize: 22, fontWeight: 'bold', color: THEME.primary },
    onlineIndicator: { 
        position: 'absolute', 
        bottom: 0, 
        right: 0, 
        width: 14, 
        height: 14, 
        borderRadius: 7, 
        backgroundColor: THEME.success,
        borderWidth: 2,
        borderColor: THEME.white
    },
    chatContent: { flex: 1, marginLeft: 15, marginRight: 5 },
    chatHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 },
    patientName: { fontSize: 16, fontWeight: '700', color: THEME.textDark, flex: 1 },
    chatTime: { fontSize: 12, color: THEME.textMuted },
    messageRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    lastMessage: { fontSize: 14, color: THEME.textMuted, flex: 1, marginRight: 10 },
    statusTag: { paddingHorizontal: 8, paddingVertical: 2, borderRadius: 6 },
    statusText: { fontSize: 10, fontWeight: '800' },
    emptyContainer: { alignItems: 'center', marginTop: 80 },
    emptyText: { color: THEME.textMuted, marginTop: 15, fontSize: 15, fontWeight: '500', textAlign: 'center' }
});