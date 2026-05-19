import { useAuth } from '@/context/AuthContext';
import { Feather, Ionicons } from '@expo/vector-icons';
import { router, Stack } from 'expo-router';
import React, { useState } from 'react';
import { 
    Platform, 
    SafeAreaView, 
    ScrollView, 
    StyleSheet, 
    Text, 
    TextInput, 
    TouchableOpacity, 
    View,
    Alert,
    ActivityIndicator,
    Modal
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Image } from 'expo-image';
import { updateProfile } from '@/api/authService';

export default function EditProfilScreen() {
    const { user, updateUser } = useAuth();
    const [name, setName] = useState(user?.name || '');
    const [email, setEmail] = useState(user?.email || '');
    const [phone, setPhone] = useState(user?.phone || '');
    const [address, setAddress] = useState(user?.address || '');
    const [imageUri, setImageUri] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [successModalVisible, setSuccessModalVisible] = useState(false);

    const getProfilePhotoUrl = (url?: string) => {
        if (!url) return null;
        if (url.startsWith('http://') || url.startsWith('https://')) return url;
        const host = Platform.OS === 'android' ? 'http://10.0.2.2:8000' : 'http://localhost:8000';
        return `${host}/storage/${url}`;
    };

    const pickImage = async () => {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
            Alert.alert('Izin Ditolak', 'Mohon izinkan akses galeri untuk mengganti foto profil.');
            return;
        }

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.8,
        });

        if (!result.canceled && result.assets && result.assets.length > 0) {
            setImageUri(result.assets[0].uri);
        }
    };

    const handleSave = async () => {
        if (!name) {
            Alert.alert('Error', 'Nama tidak boleh kosong');
            return;
        }

        setLoading(true);
        try {
            const formData = new FormData();
            formData.append('name', name);
            formData.append('phone', phone || '');
            formData.append('address', address || '');

            if (imageUri) {
                const filename = imageUri.split('/').pop() || 'avatar.jpg';
                const match = /\.(\w+)$/.exec(filename);
                const type = match ? `image/${match[1]}` : `image/jpeg`;

                if (Platform.OS === 'web') {
                    const response = await fetch(imageUri);
                    const blob = await response.blob();
                    formData.append('profile_photo', blob, filename);
                } else {
                    formData.append('profile_photo', {
                        uri: imageUri,
                        name: filename,
                        type: type,
                    } as any);
                }
            }

            const response = await updateProfile(formData);
            if (response.status === 'success' && response.data) {
                await updateUser(response.data);
                setSuccessModalVisible(true);
            } else {
                throw new Error('Response status is not success');
            }
        } catch (e: any) {
            console.error('Error saving profile:', e.response?.data || e.message);
            Alert.alert('Gagal', 'Terjadi kesalahan saat menyimpan profil.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <Stack.Screen options={{ headerShown: false }} />

            <View style={styles.header}>
                <TouchableOpacity 
                    onPress={() => {
                        if (router.canGoBack()) {
                            router.back();
                        } else {
                            router.replace('/(tabs)/profil' as any);
                        }
                    }} 
                    style={styles.backBtn}
                >
                    <Ionicons name="chevron-back" size={24} color="#FFF" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Edit Profil</Text>
                <View style={{ width: 40 }} />
            </View>

            <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
                <View style={styles.avatarSection}>
                    <TouchableOpacity onPress={pickImage} style={styles.avatarWrapper} activeOpacity={0.8}>
                        <View style={styles.avatarPlaceholder}>
                            {imageUri ? (
                                <Image source={{ uri: imageUri }} style={styles.avatarImage} />
                            ) : user?.profile_photo ? (
                                <Image source={{ uri: getProfilePhotoUrl(user.profile_photo) || undefined }} style={styles.avatarImage} />
                            ) : (
                                <Ionicons name="person" size={50} color="#2E8B57" />
                            )}
                        </View>
                        <View style={styles.cameraBtn}>
                            <Feather name="camera" size={16} color="#FFF" />
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={pickImage} activeOpacity={0.7}>
                        <Text style={styles.changePhotoText}>Ganti Foto Profil</Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.formSection}>
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Nama Lengkap</Text>
                        <TextInput
                            style={styles.input}
                            value={name}
                            onChangeText={setName}
                            placeholder="Nama Lengkap"
                        />
                    </View>

                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Email</Text>
                        <TextInput
                            style={styles.input}
                            value={email}
                            onChangeText={setEmail}
                            keyboardType="email-address"
                            editable={false} // Email biasanya tidak bisa diubah langsung
                        />
                    </View>

                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Nomor Telepon</Text>
                        <TextInput
                            style={styles.input}
                            value={phone}
                            onChangeText={setPhone}
                            keyboardType="phone-pad"
                            placeholder="0812..."
                        />
                    </View>

                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Alamat Lengkap</Text>
                        <TextInput
                            style={[styles.input, styles.inputAddress]}
                            value={address}
                            onChangeText={setAddress}
                            placeholder="Jl. Merdeka No. 123..."
                            multiline
                        />
                    </View>
                </View>

                <TouchableOpacity style={styles.saveBtn} onPress={handleSave} disabled={loading}>
                    {loading ? <ActivityIndicator color="#FFF" /> : <Text style={styles.saveBtnText}>Simpan Perubahan</Text>}
                </TouchableOpacity>
            </ScrollView>

            <Modal
                visible={successModalVisible}
                transparent
                animationType="fade"
                onRequestClose={() => {
                    setSuccessModalVisible(false);
                    if (router.canGoBack()) {
                        router.back();
                    } else {
                        router.replace('/(tabs)/profil' as any);
                    }
                }}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <View style={styles.successIconCircle}>
                            <Ionicons name="checkmark-circle" size={48} color="#2E8B57" />
                        </View>
                        <Text style={styles.modalTitle}>Berhasil</Text>
                        <Text style={styles.modalDesc}>Profil Anda telah berhasil diperbarui.</Text>
                        <TouchableOpacity 
                            style={styles.modalOkBtn} 
                            onPress={() => {
                                setSuccessModalVisible(false);
                                if (router.canGoBack()) {
                                    router.back();
                                } else {
                                    router.replace('/(tabs)/profil' as any);
                                }
                            }}
                        >
                            <Text style={styles.modalOkBtnText}>OK</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#FFF' },
    header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingTop: Platform.OS === 'ios' ? 20 : 50, paddingBottom: 20, backgroundColor: '#2E8B57', borderBottomLeftRadius: 20, borderBottomRightRadius: 20 },
    backBtn: { width: 40, height: 40, justifyContent: 'center' },
    headerTitle: { fontSize: 18, fontWeight: 'bold', color: '#FFF' },
    content: { padding: 20 },
    avatarSection: { alignItems: 'center', marginBottom: 30 },
    avatarWrapper: { position: 'relative' },
    avatarPlaceholder: { width: 100, height: 100, borderRadius: 50, backgroundColor: '#F0F4F0', justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: '#EEE', overflow: 'hidden' },
    avatarImage: { width: 98, height: 98, borderRadius: 49 },
    cameraBtn: { position: 'absolute', bottom: 0, right: 0, backgroundColor: '#2E8B57', width: 32, height: 32, borderRadius: 16, justifyContent: 'center', alignItems: 'center', borderWidth: 2, borderColor: '#FFF' },
    changePhotoText: { marginTop: 12, color: '#2E8B57', fontWeight: 'bold', fontSize: 13 },
    formSection: { gap: 20 },
    inputGroup: { gap: 8 },
    label: { fontSize: 13, fontWeight: 'bold', color: '#555' },
    input: { paddingVertical: 12, paddingHorizontal: 16, fontSize: 15, color: '#333', backgroundColor: '#F9F9F9', borderRadius: 12, borderWidth: 1, borderColor: '#EEE' },
    inputAddress: { minHeight: 80, textAlignVertical: 'top' },
    saveBtn: { backgroundColor: '#2E8B57', paddingVertical: 16, borderRadius: 14, alignItems: 'center', marginTop: 40, marginBottom: 20 },
    saveBtnText: { color: '#FFF', fontSize: 16, fontWeight: 'bold' },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    modalContent: {
        backgroundColor: '#FFF',
        borderRadius: 24,
        padding: 24,
        width: 300,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 12,
        elevation: 5,
    },
    successIconCircle: {
        width: 72,
        height: 72,
        borderRadius: 36,
        backgroundColor: '#E8F5E9',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 16,
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 8,
        textAlign: 'center',
    },
    modalDesc: {
        fontSize: 14,
        color: '#666',
        textAlign: 'center',
        marginBottom: 24,
        lineHeight: 20,
    },
    modalOkBtn: {
        backgroundColor: '#2E8B57',
        paddingVertical: 12,
        paddingHorizontal: 32,
        borderRadius: 12,
        width: '100%',
        alignItems: 'center',
    },
    modalOkBtnText: {
        color: '#FFF',
        fontSize: 15,
        fontWeight: 'bold',
    },
});