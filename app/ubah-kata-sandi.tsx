import { Feather, Ionicons } from '@expo/vector-icons';
import { router, Stack } from 'expo-router';
import React, { useState } from 'react';
import { 
    SafeAreaView, 
    StyleSheet, 
    Text, 
    TouchableOpacity, 
    View,
    TextInput,
    Platform,
    Alert,
    ActivityIndicator
} from 'react-native';

export default function UbahKataSandiScreen() {
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [showOld, setShowOld] = useState(false);
    const [showNew, setShowNew] = useState(false);

    const handleUpdate = () => {
        if (!oldPassword || !newPassword || !confirmPassword) {
            Alert.alert('Error', 'Semua kolom wajib diisi');
            return;
        }
        if (newPassword !== confirmPassword) {
            Alert.alert('Error', 'Konfirmasi kata sandi baru tidak cocok');
            return;
        }

        setLoading(true);
        // Simulasi update
        setTimeout(() => {
            setLoading(false);
            Alert.alert('Berhasil', 'Kata sandi Anda telah diperbarui');
            router.back();
        }, 1500);
    };

    return (
        <SafeAreaView style={styles.container}>
            <Stack.Screen options={{ headerShown: false }} />
            
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
                    <Ionicons name="chevron-back" size={24} color="#333" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Ubah Kata Sandi</Text>
                <View style={{ width: 40 }} />
            </View>

            <View style={styles.content}>
                <View style={styles.infoBox}>
                    <Ionicons name="lock-closed-outline" size={30} color="#2E8B57" />
                    <Text style={styles.infoText}>Gunakan kata sandi yang kuat untuk menjaga keamanan akun Anda.</Text>
                </View>

                <View style={styles.form}>
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Kata Sandi Lama</Text>
                        <View style={styles.inputWrapper}>
                            <TextInput 
                                style={styles.input}
                                value={oldPassword}
                                onChangeText={setOldPassword}
                                secureTextEntry={!showOld}
                                placeholder="Masukkan kata sandi lama"
                            />
                            <TouchableOpacity onPress={() => setShowOld(!showOld)}>
                                <Feather name={showOld ? "eye" : "eye-off"} size={18} color="#999" />
                            </TouchableOpacity>
                        </View>
                    </View>

                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Kata Sandi Baru</Text>
                        <View style={styles.inputWrapper}>
                            <TextInput 
                                style={styles.input}
                                value={newPassword}
                                onChangeText={setNewPassword}
                                secureTextEntry={!showNew}
                                placeholder="Masukkan kata sandi baru"
                            />
                            <TouchableOpacity onPress={() => setShowNew(!showNew)}>
                                <Feather name={showNew ? "eye" : "eye-off"} size={18} color="#999" />
                            </TouchableOpacity>
                        </View>
                    </View>

                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Konfirmasi Kata Sandi Baru</Text>
                        <View style={styles.inputWrapper}>
                            <TextInput 
                                style={styles.input}
                                value={confirmPassword}
                                onChangeText={setConfirmPassword}
                                secureTextEntry={true}
                                placeholder="Ulangi kata sandi baru"
                            />
                        </View>
                    </View>

                    <TouchableOpacity 
                        style={[styles.updateBtn, loading && styles.disabledBtn]} 
                        onPress={handleUpdate}
                        disabled={loading}
                    >
                        {loading ? <ActivityIndicator color="#FFF" /> : <Text style={styles.updateBtnText}>Simpan Kata Sandi Baru</Text>}
                    </TouchableOpacity>
                </View>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#FFF' },
    header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingTop: Platform.OS === 'ios' ? 0 : 40, paddingBottom: 16, borderBottomWidth: 1, borderBottomColor: '#EEE' },
    backBtn: { width: 40, height: 40, justifyContent: 'center' },
    headerTitle: { fontSize: 18, fontWeight: 'bold', color: '#333' },
    content: { padding: 20 },
    infoBox: { flexDirection: 'row', backgroundColor: '#F0F4F0', padding: 16, borderRadius: 16, alignItems: 'center', gap: 12, marginBottom: 30 },
    infoText: { flex: 1, fontSize: 13, color: '#555', lineHeight: 18 },
    form: { gap: 20 },
    inputGroup: { gap: 8 },
    label: { fontSize: 14, fontWeight: 'bold', color: '#555' },
    inputWrapper: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F9F9F9', borderRadius: 12, paddingHorizontal: 16, height: 52, borderWidth: 1, borderColor: '#EEE' },
    input: { flex: 1, fontSize: 15, color: '#333' },
    updateBtn: { backgroundColor: '#2E8B57', paddingVertical: 16, borderRadius: 12, alignItems: 'center', marginTop: 20 },
    updateBtnText: { color: '#FFF', fontSize: 16, fontWeight: 'bold' },
    disabledBtn: { opacity: 0.7 }
});
