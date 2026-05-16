import { useAuth } from '@/context/AuthContext';
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
    Alert
} from 'react-native';

export default function ProfilScreen() {
    const { user, logout } = useAuth();

    const handleLogout = async () => {
        if (Platform.OS === 'web') {
            const confirmLogout = window.confirm('Apakah Anda yakin ingin keluar?');
            if (confirmLogout) {
                try {
                    await logout();
                    router.replace('/login');
                } catch (error) {
                    console.error('Logout error:', error);
                    router.replace('/login');
                }
            }
            return;
        }

        setTimeout(() => {
            Alert.alert(
                'Konfirmasi Keluar',
                'Apakah Anda yakin ingin keluar dari akun?',
                [
                    { text: 'Batal', style: 'cancel' },
                    { 
                        text: 'Keluar', 
                        style: 'destructive',
                        onPress: async () => {
                            try {
                                await logout();
                                router.replace('/login');
                            } catch (error) {
                                console.error('Logout error:', error);
                                router.replace('/login');
                            }
                        }
                    }
                ]
            );
        }, 100);
    };

    if (!user) {
        return (
            <SafeAreaView style={styles.container}>
                <View style={styles.centered}>
                    <Ionicons name="person-circle-outline" size={80} color="#CCC" />
                    <Text style={styles.emptyTitle}>Belum Login</Text>
                    <TouchableOpacity onPress={() => router.push('/login' as any)} style={styles.loginBtn}>
                        <Text style={styles.loginBtnText}>Masuk Sekarang</Text>
                    </TouchableOpacity>
                </View>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            <Stack.Screen options={{ headerShown: false }} />

            {/* Header Profil Premium */}
            <View style={styles.header}>
                <View style={styles.headerContent}>
                    <View style={styles.avatarLarge}>
                        <Ionicons name="person" size={40} color="#2E8B57" />
                    </View>
                    <Text style={styles.profileName}>{user.name}</Text>
                    <Text style={styles.profileEmail}>{user.email}</Text>
                    <TouchableOpacity style={styles.editBtn} onPress={() => router.push('/edit-profil' as any)}>
                        <Text style={styles.editBtnText}>Edit Profil</Text>
                    </TouchableOpacity>
                </View>
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                
                {/* Informasi Akun */}
                <Text style={styles.sectionTitle}>Informasi Akun</Text>
                <View style={styles.card}>
                    <View style={styles.infoRow}>
                        <Feather name="phone" size={18} color="#777" />
                        <View style={styles.infoText}>
                            <Text style={styles.infoLabel}>Nomor Telepon</Text>
                            <Text style={styles.infoValue}>{user.phone || '-'}</Text>
                        </View>
                    </View>
                    <View style={styles.divider} />
                    <View style={styles.infoRow}>
                        <Feather name="map-pin" size={18} color="#777" />
                        <View style={styles.infoText}>
                            <Text style={styles.infoLabel}>Alamat Utama</Text>
                            <Text style={styles.infoValue}>{user.address || '-'}</Text>
                        </View>
                    </View>
                </View>

                {/* Pengaturan & Lainnya */}
                <Text style={styles.sectionTitle}>Layanan & Keamanan</Text>
                <View style={styles.card}>
                    <TouchableOpacity style={styles.menuItem} onPress={() => router.push('/alergi-obat' as any)}>
                        <Feather name="shield" size={18} color="#D32F2F" />
                        <Text style={styles.menuText}>Riwayat Alergi Obat</Text>
                        <Feather name="chevron-right" size={18} color="#CCC" />
                    </TouchableOpacity>
                    <View style={styles.divider} />
                    <TouchableOpacity style={styles.menuItem} onPress={() => router.push('/pengingat' as any)}>
                        <Feather name="bell" size={18} color="#F57C00" />
                        <Text style={styles.menuText}>Pengingat Minum Obat</Text>
                        <Feather name="chevron-right" size={18} color="#CCC" />
                    </TouchableOpacity>
                    <View style={styles.divider} />
                    <TouchableOpacity style={styles.menuItem} onPress={() => router.push('/ubah-kata-sandi' as any)}>
                        <Feather name="lock" size={18} color="#555" />
                        <Text style={styles.menuText}>Ubah Kata Sandi</Text>
                        <Feather name="chevron-right" size={18} color="#CCC" />
                    </TouchableOpacity>
                </View>

                <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
                    <Feather name="log-out" size={18} color="#FF5252" />
                    <Text style={styles.logoutBtnText}>Keluar dari Akun</Text>
                </TouchableOpacity>

                <Text style={styles.versionText}>Apotek Permata v1.0.0</Text>

            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F8FBF8' },
    centered: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
    emptyTitle: { fontSize: 18, fontWeight: 'bold', color: '#999', marginTop: 12 },
    loginBtn: { marginTop: 24, backgroundColor: '#2E8B57', paddingHorizontal: 30, paddingVertical: 12, borderRadius: 12 },
    loginBtnText: { color: '#FFF', fontWeight: 'bold' },
    header: { 
        backgroundColor: '#2E8B57', 
        paddingTop: Platform.OS === 'ios' ? 40 : 60, 
        paddingBottom: 40,
        borderBottomLeftRadius: 30,
        borderBottomRightRadius: 30,
    },
    headerContent: { alignItems: 'center' },
    avatarLarge: { width: 80, height: 80, borderRadius: 40, backgroundColor: '#FFF', justifyContent: 'center', alignItems: 'center', marginBottom: 12, borderWidth: 3, borderColor: 'rgba(255,255,255,0.3)' },
    profileName: { fontSize: 20, fontWeight: 'bold', color: '#FFF', marginBottom: 4 },
    profileEmail: { fontSize: 14, color: 'rgba(255,255,255,0.8)', marginBottom: 16 },
    editBtn: { backgroundColor: 'rgba(255,255,255,0.2)', paddingHorizontal: 16, paddingVertical: 6, borderRadius: 20 },
    editBtnText: { color: '#FFF', fontSize: 12, fontWeight: 'bold' },
    scrollContent: { padding: 20, paddingBottom: 40 },
    sectionTitle: { fontSize: 15, fontWeight: 'bold', color: '#333', marginBottom: 12 },
    sectionHeaderRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 10, marginBottom: 12 },
    card: { backgroundColor: '#FFF', borderRadius: 20, padding: 16, marginBottom: 20, borderWidth: 1, borderColor: '#EEE', elevation: 2, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 5 },
    cardSubtitle: { fontSize: 12, color: '#888', marginBottom: 16, lineHeight: 18 },
    infoRow: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 4 },
    infoText: { flex: 1 },
    infoLabel: { fontSize: 12, color: '#999', marginBottom: 2 },
    infoValue: { fontSize: 14, color: '#333', fontWeight: '500' },
    divider: { height: 1, backgroundColor: '#F0F0F0', marginVertical: 12 },
    allergyList: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 16 },
    emptyAllergyText: { fontSize: 13, color: '#AAA', fontStyle: 'italic', paddingVertical: 10 },
    allergyTag: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: '#FFEBEE', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20, borderWidth: 1, borderColor: '#FFCDD2' },
    allergyTagText: { fontSize: 12, color: '#D32F2F', fontWeight: 'bold' },
    addAllergyRow: { flexDirection: 'row', gap: 10 },
    allergyInput: { flex: 1, backgroundColor: '#F5F5F5', borderRadius: 10, paddingHorizontal: 12, height: 44, fontSize: 14 },
    addBtn: { backgroundColor: '#2E8B57', width: 44, height: 44, borderRadius: 10, justifyContent: 'center', alignItems: 'center' },
    menuItem: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 4 },
    menuText: { flex: 1, fontSize: 14, color: '#333' },
    logoutBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10, marginTop: 10, paddingVertical: 15 },
    logoutBtnText: { color: '#FF5252', fontSize: 15, fontWeight: 'bold' },
    versionText: { textAlign: 'center', fontSize: 12, color: '#CCC', marginTop: 10 }
});