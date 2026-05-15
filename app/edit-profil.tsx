import { Feather, Ionicons } from '@expo/vector-icons';
import { router, Stack } from 'expo-router';
import React, { useState } from 'react';
import { Platform, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function EditProfilScreen() {
    const [name, setName] = useState('Holy Sola Fide Sianipar');
    const [email, setEmail] = useState('holy.sianipar@example.com');
    const [phone, setPhone] = useState('081234567890');

    return (
        <SafeAreaView style={styles.container}>
            <Stack.Screen options={{ headerShown: false }} />

            {/* Header Hijau */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
                    <Ionicons name="chevron-back" size={24} color="#FFF" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Edit Profil</Text>
                <View style={{ width: 40 }} />
            </View>

            <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
                {/* Avatar Section */}
                <View style={styles.avatarSection}>
                    <View style={styles.avatarWrapper}>
                        <View style={styles.avatarPlaceholder}>
                            <Feather name="user" size={50} color="#2E8B57" />
                        </View>
                        <TouchableOpacity style={styles.cameraBtn}>
                            <Feather name="camera" size={16} color="#FFF" />
                        </TouchableOpacity>
                    </View>
                    <Text style={styles.changePhotoText}>Ganti Foto Profil</Text>
                </View>

                {/* Form Informasi Pribadi */}
                <View style={styles.formSection}>
                    <Text style={styles.sectionLabel}>Informasi Pribadi</Text>

                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Nama Lengkap</Text>
                        <TextInput
                            style={styles.input}
                            value={name}
                            onChangeText={setName}
                            placeholder="Masukkan nama"
                        />
                    </View>

                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Email</Text>
                        <TextInput
                            style={styles.input}
                            value={email}
                            onChangeText={setEmail}
                            keyboardType="email-address"
                        />
                    </View>

                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Nomor Telepon</Text>
                        <TextInput
                            style={styles.input}
                            value={phone}
                            onChangeText={setPhone}
                            keyboardType="phone-pad"
                        />
                    </View>
                </View>

                <TouchableOpacity style={styles.saveBtn} onPress={() => router.back()}>
                    <Text style={styles.saveBtnText}>Simpan Perubahan</Text>
                </TouchableOpacity>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFF'
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingTop: Platform.OS === 'ios' ? 20 : 50,
        paddingBottom: 20,
        backgroundColor: '#2E8B57', // Latar belakang hijau sesuai permintaan
        borderBottomLeftRadius: 20,
        borderBottomRightRadius: 20,
    },
    backBtn: {
        width: 40,
        height: 40,
        justifyContent: 'center'
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#FFF' // Teks putih agar kontras
    },
    content: {
        padding: 20
    },
    avatarSection: {
        alignItems: 'center',
        marginBottom: 30
    },
    avatarWrapper: {
        position: 'relative'
    },
    avatarPlaceholder: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: '#F0F4F0',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#EEE'
    },
    cameraBtn: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        backgroundColor: '#2E8B57',
        width: 32,
        height: 32,
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: '#FFF'
    },
    changePhotoText: {
        marginTop: 12,
        color: '#2E8B57',
        fontWeight: 'bold',
        fontSize: 13
    },
    formSection: {
        gap: 20
    },
    sectionLabel: {
        fontSize: 13,
        fontWeight: 'bold',
        color: '#2E8B57',
        textTransform: 'uppercase',
        letterSpacing: 1
    },
    inputGroup: {
        gap: 4
    },
    label: {
        fontSize: 12,
        color: '#888',
        fontWeight: '500'
    },
    input: {
        paddingVertical: 8,
        fontSize: 15,
        color: '#333',
        borderBottomWidth: 1,
        borderBottomColor: '#EEE'
    },
    saveBtn: {
        backgroundColor: '#2E8B57',
        paddingVertical: 16,
        borderRadius: 14,
        alignItems: 'center',
        marginTop: 50,
        marginBottom: 20
    },
    saveBtnText: {
        color: '#FFF',
        fontSize: 16,
        fontWeight: 'bold'
    }
});