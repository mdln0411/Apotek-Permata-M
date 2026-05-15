import { Feather, Ionicons } from '@expo/vector-icons';
import { router, Stack } from 'expo-router';
import React from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function HomeScreen() {
    return (
        <SafeAreaView style={styles.container}>
            <Stack.Screen options={{ headerShown: false }} />

            {/* Header Konsultasi */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <Ionicons name="chevron-back" size={24} color="#FFF" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Konsultasi</Text>
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

                {/* Banner Selamat Datang */}
                <View style={styles.welcomeCard}>
                    <Text style={styles.welcomeTitle}>Selamat Datang!</Text>
                    <Text style={styles.welcomeSubtitle}>Kesehatan Anda, Prioritas Kami</Text>
                </View>

                {/* Search Bar */}
                <TouchableOpacity
                    style={styles.searchContainer}
                    activeOpacity={0.8}
                    onPress={() => router.push('/cari-obat' as any)}
                >
                    <Feather name="search" size={20} color="#888" style={styles.searchIcon} />
                    <Text style={styles.searchPlaceholder}>Cari obat atau gejala...</Text>
                </TouchableOpacity>

                {/* Chat Apoteker */}
                <TouchableOpacity style={styles.assistantCard} onPress={() => router.push('/asisten-virtual' as any)}>
                    <View style={styles.assistantIconBg}>
                        <Ionicons name="chatbubble-ellipses" size={24} color="#FFF" />
                    </View>
                    <View style={styles.assistantTextContainer}>
                        <Text style={styles.assistantTitle}>Chat Apoteker</Text>
                        <Text style={styles.assistantSubtitle}>Tanya tentang obat</Text>
                    </View>
                    <Feather name="chevron-right" size={24} color="#888" />
                </TouchableOpacity>

                {/* Layanan Kami */}
                <Text style={styles.sectionTitle}>Layanan Kami</Text>

                <View style={styles.gridContainer}>
                    {/* Menu 1: Simulasi Obat */}
                    <TouchableOpacity style={styles.gridItem} onPress={() => router.push('/simulasi-obat' as any)}>
                        <View style={[styles.iconWrapper, { backgroundColor: '#E3F2FD' }]}>
                            <Ionicons name="sparkles-outline" size={28} color="#1976D2" />
                        </View>
                        <Text style={styles.gridText}>Simulasi Obat</Text>
                    </TouchableOpacity>

                    {/* Menu 2: Alergi Saya */}
                    <TouchableOpacity style={styles.gridItem} onPress={() => router.push('/alergi-obat' as any)}>
                        <View style={[styles.iconWrapper, { backgroundColor: '#FFEBEE' }]}>
                            <Ionicons name="heart-outline" size={28} color="#D32F2F" />
                        </View>
                        <Text style={styles.gridText}>Alergi Saya</Text>
                    </TouchableOpacity>

                    {/* Menu 3: Upload Resep */}
                    <TouchableOpacity style={styles.gridItem} onPress={() => router.push('/upload-resep' as any)}>
                        <View style={[styles.iconWrapper, { backgroundColor: '#F1F8E9' }]}>
                            <Feather name="upload" size={28} color="#689F38" />
                        </View>
                        <Text style={styles.gridText}>Upload Resep</Text>
                    </TouchableOpacity>

                    {/* Menu 4: Pengingat */}
                    <TouchableOpacity style={styles.gridItem} onPress={() => router.push('/pengingat-obat' as any)}>
                        <View style={[styles.iconWrapper, { backgroundColor: '#F3E5F5' }]}>
                            <Ionicons name="time-outline" size={28} color="#7B1FA2" />
                        </View>
                        <Text style={styles.gridText}>Pengingat</Text>
                    </TouchableOpacity>
                </View>

            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FAFAFA',
    },
    header: {
        backgroundColor: '#2E8B57',
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingTop: 50,
        paddingBottom: 20,
    },
    backButton: {
        marginRight: 16,
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#FFF',
    },
    scrollContent: {
        padding: 20,
        paddingBottom: 40,
    },
    welcomeCard: {
        backgroundColor: '#66BB6A',
        borderRadius: 16,
        padding: 20,
        marginBottom: 20,
    },
    welcomeTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#FFF',
        marginBottom: 4,
    },
    welcomeSubtitle: {
        fontSize: 14,
        color: '#E8F5E9',
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFF',
        borderRadius: 12,
        paddingHorizontal: 16,
        height: 50,
        marginBottom: 20,
        borderWidth: 1,
        borderColor: '#E0E0E0',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 2,
    },
    searchIcon: {
        marginRight: 10,
    },
    searchPlaceholder: {
        flex: 1,
        fontSize: 15,
        color: '#999',
    },
    assistantCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFF',
        borderRadius: 16,
        padding: 16,
        marginBottom: 24,
        borderWidth: 1,
        borderColor: '#E0E0E0',
    },
    assistantIconBg: {
        backgroundColor: '#2E8B57',
        width: 48,
        height: 48,
        borderRadius: 24,
        justifyContent: 'center',
        alignItems: 'center',
    },
    assistantTextContainer: {
        flex: 1,
        marginLeft: 16,
    },
    assistantTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
    },
    assistantSubtitle: {
        fontSize: 13,
        color: '#666',
        marginTop: 2,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 16,
    },
    gridContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },
    gridItem: {
        width: '47%',
        backgroundColor: '#FFF',
        borderRadius: 16,
        paddingVertical: 16,
        paddingHorizontal: 8,
        alignItems: 'center',
        marginBottom: 16,
        borderWidth: 1,
        borderColor: '#E0E0E0',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 1,
    },
    iconWrapper: {
        width: 52,
        height: 52,
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 12,
    },
    gridText: {
        fontSize: 12,
        color: '#333',
        textAlign: 'center',
        fontWeight: '500',
        lineHeight: 16,
    },
});