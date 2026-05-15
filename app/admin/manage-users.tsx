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
    Switch
} from 'react-native';

export default function ManageUsers() {
    const [searchQuery, setSearchQuery] = useState('');
    const [sidebarVisible, setSidebarVisible] = useState(false);
    const [users, setUsers] = useState([
        { id: '1', name: 'Medelain', email: 'medling@mail.com', role: 'Member', joined: '15/3/2026', orders: 5, active: true },
        { id: '2', name: 'Yarlin Khun', email: 'yarlix@mail.com', role: 'Member', joined: '20/3/2026', orders: 3, active: true },
        { id: '3', name: 'HolsBam', email: 'holay@apotekPermata.com', role: 'Apoteker', joined: '10/1/2026', orders: 0, active: true },
        { id: '4', name: 'Hizkia Chan', email: 'hizfry@mail.com', role: 'Member', joined: '5/2/2026', orders: 1, active: false },
    ]);

    const toggleUserStatus = (id: string) => {
        setUsers(users.map(u => u.id === id ? { ...u, active: !u.active } : u));
    };

    return (
        <SafeAreaView style={styles.container}>
            <Stack.Screen options={{ headerShown: false }} />

            <AdminSidebar 
                visible={sidebarVisible} 
                onClose={() => setSidebarVisible(false)} 
                activePage="users" 
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
                    <Text style={styles.pageTitle}>Manajemen Pengguna</Text>
                    <Text style={styles.pageSub}>{users.length} pengguna terdaftar</Text>
                </View>

                {/* Search Bar */}
                <View style={styles.searchContainer}>
                    <Ionicons name="search-outline" size={20} color="#999" style={styles.searchIcon} />
                    <TextInput 
                        style={styles.searchInput}
                        placeholder="Cari pengguna..."
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                    />
                </View>

                {/* User List */}
                <View style={styles.listContainer}>
                    {users.map((user) => (
                        <View key={user.id} style={[styles.userCard, !user.active && styles.inactiveCard]}>
                            <View style={styles.avatarWrapper}>
                                <View style={styles.avatar}>
                                    <Ionicons name="person" size={24} color="#2E8B57" />
                                </View>
                            </View>

                            <View style={styles.userInfo}>
                                <View style={styles.nameRoleRow}>
                                    <Text style={styles.userName}>{user.name}</Text>
                                    <View style={[styles.roleBadge, { backgroundColor: user.role === 'Apoteker' ? '#1B5E20' : '#E8F5E9' }]}>
                                        <Text style={[styles.roleText, { color: user.role === 'Apoteker' ? '#FFF' : '#2E8B57' }]}>{user.role}</Text>
                                    </View>
                                </View>
                                <Text style={styles.userEmail}>{user.email}</Text>
                                <Text style={styles.userMeta}>Bergabung: {user.joined} • {user.orders} pesanan</Text>
                            </View>

                            <View style={styles.actionArea}>
                                <Text style={styles.statusLabel}>{user.active ? 'Aktif' : 'Nonaktif'}</Text>
                                <Switch 
                                    value={user.active} 
                                    onValueChange={() => toggleUserStatus(user.id)}
                                    trackColor={{ false: '#DDD', true: '#A5D6A7' }}
                                    thumbColor={user.active ? '#2E8B57' : '#FFF'}
                                />
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
    headerTitleRow: { marginBottom: 20 },
    pageTitle: { fontSize: 22, fontWeight: 'bold', color: '#333' },
    pageSub: { fontSize: 13, color: '#999', marginTop: 2 },
    searchContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFF', borderRadius: 12, paddingHorizontal: 16, height: 50, borderWidth: 1, borderColor: '#EEE', marginBottom: 24 },
    searchIcon: { marginRight: 12 },
    searchInput: { flex: 1, fontSize: 15, color: '#333' },
    listContainer: { gap: 16 },
    userCard: { backgroundColor: '#FFF', borderRadius: 16, padding: 16, flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: '#EEE' },
    inactiveCard: { opacity: 0.6 },
    avatarWrapper: { marginRight: 16 },
    avatar: { width: 50, height: 50, borderRadius: 25, backgroundColor: '#F0F4F0', justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: '#E8F5E9' },
    userInfo: { flex: 1 },
    nameRoleRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 2 },
    userName: { fontSize: 15, fontWeight: 'bold', color: '#333' },
    roleBadge: { paddingHorizontal: 8, paddingVertical: 2, borderRadius: 10 },
    roleText: { fontSize: 10, fontWeight: 'bold' },
    userEmail: { fontSize: 12, color: '#666', marginBottom: 4 },
    userMeta: { fontSize: 11, color: '#999' },
    actionArea: { alignItems: 'center', gap: 4 },
    statusLabel: { fontSize: 10, color: '#999', fontWeight: 'bold' }
});
