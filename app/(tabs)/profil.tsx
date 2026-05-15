import { Feather } from '@expo/vector-icons';
import { router } from 'expo-router';
import React from 'react';
import { Image, Platform, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function ProfilScreen() {
    const menus = [
        {
            icon: 'shield',
            label: 'Keamanan Akun',
            onPress: () => router.push('/keamanan' as any)
        },
        {
            icon: 'help-circle',
            label: 'Pusat Bantuan',
            onPress: () => console.log('Bantuan')
        },
        {
            icon: 'log-out',
            label: 'Keluar',
            color: '#D32F2F',
            onPress: () => console.log('Keluar')
        },
    ];

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView showsVerticalScrollIndicator={false}>

                {/* Profile Header */}
                <View style={styles.profileHeader}>
                    <View style={styles.avatarContainer}>
                        <Image
                            source={{ uri: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=200' }}
                            style={styles.avatar}
                        />
                    </View>

                    <Text style={styles.userName}>Holy Sola Fide Sianipar</Text>
                    <Text style={styles.userEmail}>holy.sianipar@example.com</Text>

                    <TouchableOpacity
                        style={styles.editProfileBtn}
                        onPress={() => router.push('/edit-profil' as any)}
                        activeOpacity={0.7}
                    >
                        <Feather name="edit-3" size={14} color="#2E8B57" />
                        <Text style={styles.editProfileText}>Edit Profil</Text>
                    </TouchableOpacity>
                </View>

                {/* Profile Menu */}
                <View style={styles.menuContainer}>
                    <Text style={styles.sectionTitle}>Pengaturan Akun</Text>

                    {menus.map((menu, index) => (
                        <TouchableOpacity
                            key={index}
                            style={styles.menuItem}
                            onPress={menu.onPress}
                            activeOpacity={0.6}
                        >
                            <View style={styles.menuLeft}>
                                <View style={[
                                    styles.menuIconBg,
                                    { backgroundColor: menu.color ? '#FFEBEE' : '#F0F4F0' }
                                ]}>
                                    <Feather
                                        name={menu.icon as any}
                                        size={18}
                                        color={menu.color || '#2E8B57'}
                                    />
                                </View>
                                <Text style={[
                                    styles.menuLabel,
                                    menu.color && { color: menu.color }
                                ]}>
                                    {menu.label}
                                </Text>
                            </View>
                            <Feather name="chevron-right" size={18} color="#CCC" />
                        </TouchableOpacity>
                    ))}
                </View>

                <View style={styles.versionContainer}>
                    <Text style={styles.versionText}>Apotek Permata v1.0.0</Text>
                </View>

            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F8FBF8'
    },
    profileHeader: {
        backgroundColor: '#FFF',
        alignItems: 'center',
        paddingVertical: 40,
        borderBottomWidth: 1,
        borderBottomColor: '#EEE',
        paddingTop: Platform.OS === 'ios' ? 40 : 60
    },
    avatarContainer: {
        marginBottom: 16,
        // Semua shadow & elevation sudah dihapus sehingga kotak belakangnya hilang
    },
    avatar: {
        width: 100,
        height: 100,
        borderRadius: 50,
        borderWidth: 3,
        borderColor: '#2E8B57'
    },
    userName: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#333'
    },
    userEmail: {
        fontSize: 14,
        color: '#888',
        marginTop: 4
    },
    editProfileBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        marginTop: 20,
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 25,
        borderWidth: 1.5,
        borderColor: '#2E8B57',
        backgroundColor: '#FFF'
    },
    editProfileText: {
        color: '#2E8B57',
        fontSize: 14,
        fontWeight: 'bold'
    },
    menuContainer: {
        marginTop: 20,
        backgroundColor: '#FFF',
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderTopWidth: 1,
        borderBottomWidth: 1,
        borderColor: '#F0F0F0'
    },
    sectionTitle: {
        fontSize: 12,
        fontWeight: 'bold',
        color: '#AAA',
        textTransform: 'uppercase',
        letterSpacing: 1,
        marginBottom: 10,
        marginTop: 10
    },
    menuItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#FAFAFA'
    },
    menuLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 15
    },
    menuIconBg: {
        width: 40,
        height: 40,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center'
    },
    menuLabel: {
        fontSize: 15,
        fontWeight: '500',
        color: '#444'
    },
    versionContainer: {
        alignItems: 'center',
        paddingVertical: 30
    },
    versionText: {
        fontSize: 12,
        color: '#CCC'
    }
});