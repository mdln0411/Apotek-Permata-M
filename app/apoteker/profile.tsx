import { useAuth } from '@/context/AuthContext';
import { Feather, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { router, Stack } from 'expo-router';
import React from 'react';
import {
    Alert,
    Platform,
    SafeAreaView,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
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
    border: '#E8ECEF',
    cardShadow: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 4
    }
};

export default function ApotekerProfile() {
    const { user, logout } = useAuth();

    const handleLogout = () => {
        Alert.alert(
            'Konfirmasi Keluar',
            'Apakah Anda yakin ingin keluar dari akun Apoteker?',
            [
                { text: 'Batal', style: 'cancel' },
                { 
                    text: 'Keluar', 
                    style: 'destructive',
                    onPress: () => {
                        // Skenario Keluar Paksa (Bypass Async)
                        router.replace('/login');
                        
                        // Pembersihan dilakukan setelah navigasi dimulai
                        setTimeout(() => {
                            logout().catch(e => console.log('Logout silent fail', e));
                        }, 500);
                    }
                }
            ]
        );
    };

    const handleLogoutDirect = () => {
        router.replace('/login');
        setTimeout(() => {
            logout().catch(() => {});
        }, 500);
    };

    const MenuButton = ({ icon, title, onPress, color = THEME.textDark, showChevron = true }: any) => (
        <TouchableOpacity style={styles.menuItem} onPress={onPress}>
            <View style={[styles.menuIconContainer, { backgroundColor: color + '15' }]}>
                <Ionicons name={icon} size={20} color={color} />
            </View>
            <Text style={[styles.menuText, { color }]}>{title}</Text>
            {showChevron && <Feather name="chevron-right" size={18} color={THEME.border} />}
        </TouchableOpacity>
    );

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor={THEME.primary} />
            <Stack.Screen options={{ headerShown: false }} />

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
                
                {/* Profile Header/Cover */}
                <View style={styles.profileHeader}>
                    <View style={styles.headerTop}>
                        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
                            <Ionicons name="chevron-back" size={24} color={THEME.white} />
                        </TouchableOpacity>
                        <Text style={styles.headerTitle}>Profil Apoteker</Text>
                        <View style={{ width: 40 }} />
                    </View>

                    <View style={styles.profileInfo}>
                        <View style={styles.avatarWrapper}>
                            <View style={styles.avatar}>
                                <Text style={styles.avatarText}>{user?.name?.charAt(0).toUpperCase()}</Text>
                            </View>
                            <TouchableOpacity style={styles.editAvatarBtn}>
                                <Ionicons name="camera" size={16} color={THEME.white} />
                            </TouchableOpacity>
                        </View>
                        <Text style={styles.userName}>{user?.name || 'Apoteker'}</Text>
                        <View style={styles.roleBadge}>
                            <MaterialCommunityIcons name="shield-check" size={14} color={THEME.white} />
                            <Text style={styles.roleText}>Verified Pharmacist</Text>
                        </View>
                    </View>
                </View>

                {/* Account Settings */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Akun & Informasi</Text>
                    <View style={styles.card}>
                        <View style={styles.infoRow}>
                            <Ionicons name="mail" size={18} color={THEME.primary} />
                            <View style={styles.infoText}>
                                <Text style={styles.infoLabel}>Email</Text>
                                <Text style={styles.infoValue}>{user?.email}</Text>
                            </View>
                        </View>
                        <View style={styles.divider} />
                        <View style={styles.infoRow}>
                            <Ionicons name="briefcase" size={18} color={THEME.primary} />
                            <View style={styles.infoText}>
                                <Text style={styles.infoLabel}>Role Pekerjaan</Text>
                                <Text style={styles.infoValue}>Apoteker (Pharmacist)</Text>
                            </View>
                        </View>
                    </View>
                </View>

                {/* Dashboard Options */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Dashboard</Text>
                    <View style={styles.card}>
                        <MenuButton 
                            icon="grid-outline" 
                            title="Dashboard Overview" 
                            onPress={() => router.push('/apoteker/dashboard')} 
                        />
                        <View style={styles.divider} />
                        <MenuButton 
                            icon="lock-closed-outline" 
                            title="Keamanan & Sandi" 
                            onPress={() => router.push('/apoteker/keamanan')} 
                        />
                    </View>
                </View>

                {/* Logout Button */}
                <TouchableOpacity 
                    style={styles.logoutBtn} 
                    onPress={handleLogoutDirect}
                    activeOpacity={0.5}
                >
                    <Ionicons name="log-out-outline" size={22} color={THEME.danger} />
                    <Text style={styles.logoutText}>Keluar dari Aplikasi</Text>
                </TouchableOpacity>

                <View style={styles.footer}>
                    <Text style={styles.footerText}>Apotek Permata Mobile</Text>
                    <Text style={styles.versionText}>Version 1.0.0 (Production)</Text>
                </View>

            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F8F9FA' },
    scrollContent: { paddingBottom: 40 },
    profileHeader: {
        backgroundColor: THEME.primary,
        paddingTop: Platform.OS === 'android' ? 60 : 40,
        paddingBottom: 40,
        borderBottomLeftRadius: 40,
        borderBottomRightRadius: 40,
        alignItems: 'center',
    },
    headerTop: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '100%',
        paddingHorizontal: 20,
        marginBottom: 30
    },
    backBtn: { padding: 5 },
    headerTitle: { fontSize: 20, fontWeight: 'bold', color: THEME.white },
    profileInfo: { alignItems: 'center' },
    avatarWrapper: { position: 'relative', marginBottom: 15 },
    avatar: { 
        width: 100, 
        height: 100, 
        borderRadius: 35, 
        backgroundColor: THEME.white,
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 5 },
        shadowOpacity: 0.2,
        shadowRadius: 10
    },
    avatarText: { fontSize: 40, fontWeight: 'bold', color: THEME.primary },
    editAvatarBtn: {
        position: 'absolute',
        bottom: -5,
        right: -5,
        backgroundColor: THEME.warning,
        width: 32,
        height: 32,
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 3,
        borderColor: THEME.primary
    },
    userName: { fontSize: 24, fontWeight: 'bold', color: THEME.white, marginBottom: 8 },
    roleBadge: { 
        flexDirection: 'row', 
        alignItems: 'center', 
        backgroundColor: 'rgba(255,255,255,0.2)', 
        paddingHorizontal: 12, 
        paddingVertical: 6, 
        borderRadius: 20 
    },
    roleText: { color: THEME.white, fontSize: 12, fontWeight: '600', marginLeft: 6 },
    section: { paddingHorizontal: 20, marginTop: 25 },
    sectionTitle: { fontSize: 14, fontWeight: '800', color: THEME.textMuted, marginBottom: 12, marginLeft: 5, textTransform: 'uppercase', letterSpacing: 1 },
    card: { 
        backgroundColor: THEME.white, 
        borderRadius: 20, 
        padding: 5,
        borderWidth: 1,
        borderColor: THEME.border,
        ...THEME.cardShadow
    },
    infoRow: { flexDirection: 'row', alignItems: 'center', padding: 15 },
    infoText: { marginLeft: 15 },
    infoLabel: { fontSize: 12, color: THEME.textMuted, marginBottom: 2 },
    infoValue: { fontSize: 15, fontWeight: '600', color: THEME.textDark },
    divider: { height: 1, backgroundColor: THEME.border, marginHorizontal: 15 },
    menuItem: { 
        flexDirection: 'row', 
        alignItems: 'center', 
        padding: 15,
    },
    menuIconContainer: {
        width: 40,
        height: 40,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
    },
    menuText: { flex: 1, marginLeft: 15, fontSize: 15, fontWeight: '600' },
    logoutBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: THEME.white,
        marginHorizontal: 20,
        marginTop: 30,
        paddingVertical: 18,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: THEME.danger + '30',
        gap: 10
    },
    logoutText: { color: THEME.danger, fontSize: 16, fontWeight: 'bold' },
    footer: { alignItems: 'center', marginTop: 40 },
    footerText: { fontSize: 14, fontWeight: '700', color: THEME.textMuted },
    versionText: { fontSize: 12, color: THEME.border, marginTop: 4 }
});