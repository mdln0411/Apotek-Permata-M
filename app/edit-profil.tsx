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
    ActivityIndicator
} from 'react-native';

export default function EditProfilScreen() {
    const { user, updateUser } = useAuth();
    const [name, setName] = useState(user?.name || '');
    const [email, setEmail] = useState(user?.email || '');
    const [phone, setPhone] = useState(user?.phone || '');
    const [address, setAddress] = useState(user?.address || '');
    const [loading, setLoading] = useState(false);

    const handleSave = async () => {
        if (!name) {
            Alert.alert('Error', 'Nama tidak boleh kosong');
            return;
        }

        setLoading(true);
        try {
            // Simulasi delay jaringan
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            // Update data di context (lokal)
            if (user) {
                await updateUser({
                    ...user,
                    name,
                    phone,
                    address
                });
            }
            
            Alert.alert('Berhasil', 'Profil Anda telah diperbarui.');
            router.back();
        } catch (e) {
            Alert.alert('Gagal', 'Terjadi kesalahan saat menyimpan profil.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <Stack.Screen options={{ headerShown: false }} />

            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
                    <Ionicons name="chevron-back" size={24} color="#FFF" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Edit Profil</Text>
                <View style={{ width: 40 }} />
            </View>

            <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
                <View style={styles.avatarSection}>
                    <View style={styles.avatarWrapper}>
                        <View style={styles.avatarPlaceholder}>
                            <Ionicons name="person" size={50} color="#2E8B57" />
                        </View>
                        <TouchableOpacity style={styles.cameraBtn}>
                            <Feather name="camera" size={16} color="#FFF" />
                        </TouchableOpacity>
                    </View>
                    <Text style={styles.changePhotoText}>Ganti Foto Profil</Text>
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
    avatarPlaceholder: { width: 100, height: 100, borderRadius: 50, backgroundColor: '#F0F4F0', justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: '#EEE' },
    cameraBtn: { position: 'absolute', bottom: 0, right: 0, backgroundColor: '#2E8B57', width: 32, height: 32, borderRadius: 16, justifyContent: 'center', alignItems: 'center', borderWidth: 2, borderColor: '#FFF' },
    changePhotoText: { marginTop: 12, color: '#2E8B57', fontWeight: 'bold', fontSize: 13 },
    formSection: { gap: 20 },
    inputGroup: { gap: 8 },
    label: { fontSize: 13, fontWeight: 'bold', color: '#555' },
    input: { paddingVertical: 12, paddingHorizontal: 16, fontSize: 15, color: '#333', backgroundColor: '#F9F9F9', borderRadius: 12, borderWidth: 1, borderColor: '#EEE' },
    inputAddress: { minHeight: 80, textAlignVertical: 'top' },
    saveBtn: { backgroundColor: '#2E8B57', paddingVertical: 16, borderRadius: 14, alignItems: 'center', marginTop: 40, marginBottom: 20 },
    saveBtnText: { color: '#FFF', fontSize: 16, fontWeight: 'bold' }
});