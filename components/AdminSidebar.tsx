import React from 'react';
import { 
    View, 
    Text, 
    StyleSheet, 
    TouchableOpacity, 
    Modal, 
    Dimensions, 
    Animated, 
    TouchableWithoutFeedback 
} from 'react-native';
import { Feather, Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useAuth } from '@/context/AuthContext';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface AdminSidebarProps {
    visible: boolean;
    onClose: () => void;
    activePage: string;
}

export default function AdminSidebar({ visible, onClose, activePage }: AdminSidebarProps) {
    const { logout, user } = useAuth();
    const translateX = React.useRef(new Animated.Value(-SCREEN_WIDTH)).current;

    React.useEffect(() => {
        if (visible) {
            Animated.timing(translateX, {
                toValue: 0,
                duration: 300,
                useNativeDriver: true,
            }).start();
        } else {
            Animated.timing(translateX, {
                toValue: -SCREEN_WIDTH,
                duration: 300,
                useNativeDriver: true,
            }).start();
        }
    }, [visible]);

    const menuItems = [
        { name: 'Dashboard', icon: 'home', route: '/admin/dashboard', key: 'dashboard' },
        { name: 'Manajemen Obat', icon: 'box', route: '/admin/manage-medicines', key: 'medicines' },
        { name: 'Daftar Transaksi', icon: 'shopping-cart', route: '/admin/manage-transactions', key: 'transactions' },
        { name: 'Data Pengguna', icon: 'users', route: '/admin/manage-users', key: 'users' },
        { name: 'Laporan Penjualan', icon: 'bar-chart-2', route: '/admin/reports', key: 'reports' },
    ];

    const navigateTo = (route: string) => {
        onClose();
        router.push(route as any);
    };

    const handleLogout = async () => {
        await logout();
        router.replace('/login' as any);
    };

    return (
        <Modal
            transparent
            visible={visible}
            animationType="none"
            onRequestClose={onClose}
        >
            <View style={styles.overlay}>
                <TouchableWithoutFeedback onPress={onClose}>
                    <View style={styles.backdrop} />
                </TouchableWithoutFeedback>

                <Animated.View style={[styles.sidebarContainer, { transform: [{ translateX }] }]}>
                    {/* Sidebar Header */}
                    <View style={styles.sidebarHeader}>
                        <View style={styles.logoRow}>
                            <Ionicons name="medical" size={30} color="#FFF" />
                            <View>
                                <Text style={styles.logoTitle}>Permata</Text>
                                <Text style={styles.logoSub}>Admin Panel</Text>
                            </View>
                        </View>
                        
                        <View style={styles.adminProfile}>
                            <View style={styles.avatar}>
                                <Text style={styles.avatarText}>{user?.name?.charAt(0) || 'A'}</Text>
                            </View>
                            <View>
                                <Text style={styles.adminName}>{user?.name || 'Administrator'}</Text>
                                <Text style={styles.adminRole}>Super Admin</Text>
                            </View>
                        </View>
                    </View>

                    {/* Menu Items */}
                    <View style={styles.menuList}>
                        {menuItems.map((item) => (
                            <TouchableOpacity 
                                key={item.key} 
                                style={[styles.menuItem, activePage === item.key && styles.activeMenuItem]}
                                onPress={() => navigateTo(item.route)}
                            >
                                <Feather 
                                    name={item.icon as any} 
                                    size={20} 
                                    color={activePage === item.key ? '#2E8B57' : '#555'} 
                                />
                                <Text style={[styles.menuText, activePage === item.key && styles.activeMenuText]}>
                                    {item.name}
                                </Text>
                                {activePage === item.key && <View style={styles.activeIndicator} />}
                            </TouchableOpacity>
                        ))}
                    </View>

                    {/* Footer / Logout */}
                    <View style={styles.sidebarFooter}>
                        <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
                            <Feather name="log-out" size={20} color="#FF5252" />
                            <Text style={styles.logoutText}>Keluar Akun</Text>
                        </TouchableOpacity>
                    </View>
                </Animated.View>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    overlay: { flex: 1, flexDirection: 'row' },
    backdrop: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.5)' },
    sidebarContainer: { 
        width: SCREEN_WIDTH * 0.75, 
        backgroundColor: '#FFF', 
        height: '100%',
        shadowColor: '#000',
        shadowOffset: { width: 5, height: 0 },
        shadowOpacity: 0.1,
        shadowRadius: 10,
        elevation: 10
    },
    sidebarHeader: { backgroundColor: '#2E8B57', padding: 25, paddingTop: 60, gap: 20 },
    logoRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
    logoTitle: { color: '#FFF', fontSize: 18, fontWeight: 'bold' },
    logoSub: { color: 'rgba(255,255,255,0.7)', fontSize: 12 },
    adminProfile: { flexDirection: 'row', alignItems: 'center', gap: 12, marginTop: 10 },
    avatar: { width: 44, height: 44, borderRadius: 22, backgroundColor: '#4CA474', justifyContent: 'center', alignItems: 'center', borderWidth: 2, borderColor: '#FFF' },
    avatarText: { color: '#FFF', fontWeight: 'bold', fontSize: 18 },
    adminName: { color: '#FFF', fontSize: 15, fontWeight: 'bold' },
    adminRole: { color: 'rgba(255,255,255,0.8)', fontSize: 11 },
    menuList: { flex: 1, paddingVertical: 20 },
    menuItem: { 
        flexDirection: 'row', 
        alignItems: 'center', 
        paddingVertical: 15, 
        paddingHorizontal: 25, 
        gap: 15,
        position: 'relative'
    },
    activeMenuItem: { backgroundColor: '#F0F9F4' },
    menuText: { fontSize: 14, color: '#555', fontWeight: '500' },
    activeMenuText: { color: '#2E8B57', fontWeight: 'bold' },
    activeIndicator: { 
        position: 'absolute', 
        left: 0, 
        top: '25%', 
        bottom: '25%', 
        width: 4, 
        backgroundColor: '#2E8B57',
        borderTopRightRadius: 4,
        borderBottomRightRadius: 4
    },
    sidebarFooter: { padding: 20, borderTopWidth: 1, borderTopColor: '#EEE' },
    logoutBtn: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 10, paddingHorizontal: 10 },
    logoutText: { color: '#FF5252', fontWeight: 'bold', fontSize: 14 }
});
