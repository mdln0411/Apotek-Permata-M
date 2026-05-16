import { useAuth } from '@/context/AuthContext';
import { Feather, Ionicons } from '@expo/vector-icons';
import { router, Stack } from 'expo-router';
import React from 'react';
import { 
    SafeAreaView, 
    ScrollView, 
    StyleSheet, 
    Text, 
    TouchableOpacity, 
    View, 
    Platform,
    Alert
} from 'react-native';

export default function ApotekerProfile() {
    const { user, logout } = useAuth();

    const handleLogout = () => {
        Alert.alert(
            'Logout',
            'Apakah Anda yakin ingin keluar dari akun Apoteker?',
            [
                { text: 'Batal', style: 'cancel' },
                { 
                    text: 'Keluar', 
                    style: 'destructive',
                    onPress: async () => {
                        await logout();
                        router.replace('/login');
                    }
                }
            ]
        );
    };

    return (
        <SafeAreaView style={styles.container}>
            <Stack.Screen options={{ headerShown: false }} />

            <View style={styles.header}>
                <Text style={styles.headerTitle}>Profil Saya</Text>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
                
                {/* Profile Card */}
                <View style={styles.profileCard}>
                    <View style={styles.avatar}>
                        <Text style={styles.avatarText}>{user?.name?.charAt(0)}</Text>
                    </View>
                    <Text style={styles.userName}>{user?.name || 'Apoteker'}</Text>
                    <Text style={styles.userRole}>Apoteker Profesional</Text>
                </View>

                {/* Info List */}
                <View style={styles.infoSection}>
                    <View style={styles.infoItem}>
                        <Ionicons name="mail-outline" size={20} color="#666" />
                        <View style={styles.infoContent}>
                            <Text style={styles.infoLabel}>Email</Text>
                            <Text style={styles.infoValue}>{user?.email}</Text>
                        </View>
                    </View>
                    <View style={styles.infoItem}>
                        <Ionicons name="briefcase-outline" size={20} color="#666" />
                        <View style={styles.infoContent}>
                            <Text style={styles.infoLabel}>Role</Text>
                            <Text style={styles.infoValue}>Apoteker</Text>
                        </View>
                    </View>
                </View>

                {/* Settings Menu */}
                <Text style={styles.sectionTitle}>Pengaturan</Text>
                <View style={styles.menuContainer}>
                    <TouchableOpacity style={styles.menuItem}>
                        <Ionicons name="lock-closed-outline" size={20} color="#333" />
                        <Text style={styles.menuText}>Ubah Kata Sandi</Text>
                        <Feather name="chevron-right" size={18} color="#CCC" />
                    </TouchableOpacity>
                    
                    <TouchableOpacity style={styles.menuItem} onPress={() => router.push('/apoteker/dashboard')}>
                        <Ionicons name="grid-outline" size={20} color="#333" />
                        <Text style={styles.menuText}>Menu Dashboard (Grid View)</Text>
                        <Feather name="chevron-right" size={18} color="#CCC" />
                    </TouchableOpacity>

                    <TouchableOpacity style={[styles.menuItem, { marginTop: 10 }]} onPress={handleLogout}>
                        <Ionicons name="log-out-outline" size={20} color="#FF5252" />
                        <Text style={[styles.menuText, { color: '#FF5252' }]}>Keluar dari Akun</Text>
                        <Feather name="chevron-right" size={18} color="#FF5252" />
                    </TouchableOpacity>
                </View>

                <View style={styles.footer}>
                    <Text style={styles.versionText}>Apotek Permata v1.0.0</Text>
                </View>

            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F8FBF8' },
    header: { 
        backgroundColor: '#2E8B57', 
        paddingTop: Platform.OS === 'ios' ? 20 : 60, 
        paddingBottom: 25, 
        paddingHorizontal: 24
    },
    headerTitle: { fontSize: 22, fontWeight: 'bold', color: '#FFF' },
    scrollContent: { padding: 24 },
    profileCard: { backgroundColor: '#FFF', borderRadius: 24, padding: 30, alignItems: 'center', marginBottom: 25, elevation: 4, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.05, shadowRadius: 10 },
    avatar: { width: 80, height: 80, borderRadius: 40, backgroundColor: '#E8F5E9', justifyContent: 'center', alignItems: 'center', marginBottom: 15, borderWidth: 3, borderColor: '#FFF' },
    avatarText: { fontSize: 32, fontWeight: 'bold', color: '#2E8B57' },
    userName: { fontSize: 20, fontWeight: 'bold', color: '#333' },
    userRole: { fontSize: 13, color: '#2E8B57', marginTop: 4, fontWeight: '600' },
    infoSection: { backgroundColor: '#FFF', borderRadius: 20, padding: 20, marginBottom: 30 },
    infoItem: { flexDirection: 'row', alignItems: 'center', marginBottom: 15 },
    infoContent: { marginLeft: 15 },
    infoLabel: { fontSize: 11, color: '#999', textTransform: 'uppercase' },
    infoValue: { fontSize: 15, color: '#333', fontWeight: '500' },
    sectionTitle: { fontSize: 16, fontWeight: 'bold', color: '#333', marginBottom: 15, marginLeft: 5 },
    menuContainer: { backgroundColor: '#FFF', borderRadius: 20, overflow: 'hidden' },
    menuItem: { flexDirection: 'row', alignItems: 'center', padding: 18, borderBottomWidth: 1, borderBottomColor: '#F5F5F5' },
    menuText: { flex: 1, marginLeft: 15, fontSize: 15, color: '#333' },
    footer: { marginTop: 40, alignItems: 'center', paddingBottom: 20 },
    versionText: { fontSize: 12, color: '#CCC' }
});
