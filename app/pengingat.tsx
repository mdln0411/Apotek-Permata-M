import axiosClient from '@/api/axiosClient';
import { Feather, Ionicons } from '@expo/vector-icons';
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import { router, Stack } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    Dimensions,
    Modal,
    Platform,
    RefreshControl,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Switch,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

// Konfigurasi Notifikasi
Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldBadge: false,
    }),
});

interface Reminder {
    id: number;
    medicine_name: string;
    reminder_time: string;
    dosage: string;
    is_active: boolean;
    days: string[];
}

export default function PengingatScreen() {
    const [reminders, setReminders] = useState<Reminder[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [newMed, setNewMed] = useState('');
    const [newTime, setNewTime] = useState('');
    const [newDosage, setNewDosage] = useState('');

    useEffect(() => {
        fetchReminders();
        setupNotifications();
    }, []);

    const setupNotifications = async () => {
        if (Device.isDevice || Platform.OS === 'web') {
            const { status: existingStatus } = await Notifications.getPermissionsAsync();
            let finalStatus = existingStatus;
            if (existingStatus !== 'granted') {
                const { status } = await Notifications.requestPermissionsAsync();
                finalStatus = status;
            }
        }
    };

    const fetchReminders = async () => {
        try {
            const response = await axiosClient.get('/api/medicine-reminders');
            if (response.data && response.data.data) {
                const data = response.data.data;
                setReminders(data);
                
                // Menjadwalkan ulang notifikasi setiap kali data diambil
                await scheduleAllNotifications(data);
            }
        } catch (error) {
            console.error('Gagal ambil pengingat:', error);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    const scheduleAllNotifications = async (items: Reminder[]) => {
        // Jangan jalankan di Web karena Expo Notifications butuh Native Device
        if (Platform.OS === 'web') {
            console.log('Notifikasi tidak didukung di platform Web');
            return;
        }

        try {
            // Hapus semua jadwal lama agar tidak duplikat
            await Notifications.cancelAllScheduledNotificationsAsync();
            
            for (const item of items) {
                if (item.is_active) {
                    const [hours, minutes] = item.reminder_time.split(':').map(Number);
                    
                    await Notifications.scheduleNotificationAsync({
                        content: {
                            title: "Waktunya Minum Obat! 💊",
                            body: `Jangan lupa minum ${item.medicine_name} (${item.dosage || 'Dosis Sesuai Petunjuk'})`,
                            sound: true,
                            priority: Notifications.AndroidImportance.HIGH,
                            data: {
                                type: 'reminder',
                                title: "Waktunya Minum Obat! 💊",
                                message: `Jangan lupa minum ${item.medicine_name} (${item.dosage || 'Dosis Sesuai Petunjuk'})`
                            }
                        },
                        trigger: {
                            hour: hours,
                            minute: minutes,
                            repeats: true,
                        },
                    });
                }
            }
            console.log('Semua notifikasi berhasil dijadwalkan ulang');
        } catch (error) {
            console.error('Gagal menjadwalkan notifikasi:', error);
        }
    };

    const toggleReminder = async (item: Reminder) => {
        try {
            const updatedActive = !item.is_active;
            await axiosClient.put(`/api/medicine-reminders/${item.id}`, { is_active: updatedActive });
            setReminders(prev => prev.map(r => r.id === item.id ? { ...r, is_active: updatedActive } : r));
            // Trigger refresh schedule
            const updatedData = reminders.map(r => r.id === item.id ? { ...r, is_active: updatedActive } : r);
            scheduleAllNotifications(updatedData);
        } catch (error) {
            Alert.alert('Gagal', 'Gagal memperbarui status pengingat');
        }
    };

    const handleAddReminder = async () => {
        if (!newMed || !newTime) {
            Alert.alert('Error', 'Mohon isi nama obat dan waktu (HH:MM)');
            return;
        }

        const timeRegex = /^([01]?[0-9]|2[0-3])[:.][0-5][0-9]$/;
        if (!timeRegex.test(newTime)) {
            Alert.alert('Error', 'Format waktu salah. Gunakan HH:MM atau HH.MM (contoh: 08:30 atau 08.00)');
            return;
        }

        // Normalisasi format waktu ke HH:MM untuk backend
        const formattedTime = newTime.replace('.', ':');

        try {
            setLoading(true);
            const response = await axiosClient.post('/api/medicine-reminders', {
                medicine_name: newMed,
                reminder_time: formattedTime,
                dosage: newDosage,
                is_active: true,
                days: ['Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab', 'Min']
            });

            console.log('Reminder added:', response.data);
            
            setNewMed('');
            setNewTime('');
            setNewDosage('');
            setModalVisible(false);
            fetchReminders();
            Alert.alert('Berhasil', 'Pengingat berhasil ditambahkan');
        } catch (error: any) {
            console.error('Error adding reminder:', error.response?.data || error.message);
            Alert.alert('Gagal', error.response?.data?.message || 'Terjadi kesalahan saat menambah pengingat');
        } finally {
            setLoading(false);
        }
    };

    const deleteReminder = async (id: number) => {
        Alert.alert(
            "Hapus Pengingat",
            "Apakah Anda yakin ingin menghapus jadwal ini?",
            [
                { text: "Batal", style: "cancel" },
                { 
                    text: "Hapus", 
                    style: "destructive", 
                    onPress: async () => {
                        try {
                            await axiosClient.delete(`/api/medicine-reminders/${id}`);
                            setReminders(prev => prev.filter(r => r.id !== id));
                        } catch (error) {
                            Alert.alert('Gagal', 'Gagal menghapus pengingat');
                        }
                    }
                }
            ]
        );
    };

    const onRefresh = () => {
        setRefreshing(true);
        fetchReminders();
    };

    return (
        <SafeAreaView style={styles.container}>
            <Stack.Screen options={{ headerShown: false }} />

            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
                    <Ionicons name="chevron-back" size={24} color="#333" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Pengingat Obat</Text>
                <TouchableOpacity style={styles.addBtnHeader} onPress={() => setModalVisible(true)}>
                    <Ionicons name="add" size={28} color="#2E8B57" />
                </TouchableOpacity>
            </View>

            <ScrollView 
                contentContainerStyle={styles.scrollContent}
                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#2E8B57']} />}
            >
                <View style={styles.infoBanner}>
                    <Feather name="clock" size={24} color="#2E8B57" />
                    <View style={styles.infoTextWrapper}>
                        <Text style={styles.infoTitle}>Jangan Sampai Terlewat!</Text>
                        <Text style={styles.infoSub}>Data disimpan permanen dan notifikasi akan muncul sesuai jadwal.</Text>
                    </View>
                </View>

                {loading && !refreshing ? (
                    <ActivityIndicator size="large" color="#2E8B57" style={{ marginTop: 50 }} />
                ) : reminders.length === 0 ? (
                    <View style={styles.emptyState}>
                        <Ionicons name="notifications-off-outline" size={60} color="#CCC" />
                        <Text style={styles.emptyText}>Belum ada pengingat</Text>
                    </View>
                ) : (
                    reminders.map((item) => (
                        <View key={item.id} style={[styles.reminderCard, !item.is_active && styles.inactiveCard]}>
                            <View style={styles.cardMain}>
                                <View style={styles.timeCircle}>
                                    <Text style={styles.timeText}>{item.reminder_time.substring(0, 5)}</Text>
                                </View>
                                <View style={styles.medInfo}>
                                    <Text style={styles.medName}>{item.medicine_name}</Text>
                                    <View style={styles.medDetailsRow}>
                                        <Text style={styles.medDosage}>{item.dosage || 'Sesuai Resep'}</Text>
                                        <View style={styles.dotSeparator} />
                                        <Text style={styles.everyDayText}>Setiap Hari</Text>
                                    </View>
                                </View>
                                <Switch 
                                    value={item.is_active} 
                                    onValueChange={() => toggleReminder(item)}
                                    trackColor={{ false: '#DDD', true: '#A5D6A7' }}
                                    thumbColor={item.is_active ? '#2E8B57' : '#FFF'}
                                />
                            </View>
                            <TouchableOpacity style={styles.deleteBtn} onPress={() => deleteReminder(item.id)}>
                                <Feather name="trash-2" size={16} color="#FF5252" />
                                <Text style={styles.deleteText}>Hapus</Text>
                            </TouchableOpacity>
                        </View>
                    ))
                )}
            </ScrollView>

            <Modal animationType="fade" transparent={true} visible={modalVisible} onRequestClose={() => setModalVisible(false)}>
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Tambah Pengingat Baru</Text>
                        
                        <Text style={styles.inputLabel}>Nama Obat</Text>
                        <TextInput 
                            style={[styles.input, { outlineStyle: 'none' } as any]}
                            placeholder="Contoh: Amoxicillin"
                            value={newMed}
                            onChangeText={setNewMed}
                        />

                        <Text style={styles.inputLabel}>Waktu (HH:MM)</Text>
                        <TextInput 
                            style={[styles.input, { outlineStyle: 'none' } as any]}
                            placeholder="Contoh: 08:00"
                            value={newTime}
                            onChangeText={setNewTime}
                            keyboardType="numbers-and-punctuation"
                        />

                        <Text style={styles.inputLabel}>Dosis (Opsional)</Text>
                        <TextInput 
                            style={[styles.input, { outlineStyle: 'none' } as any]}
                            placeholder="Contoh: 1 Tablet"
                            value={newDosage}
                            onChangeText={setNewDosage}
                        />

                        <View style={styles.modalButtons}>
                            <TouchableOpacity style={styles.cancelBtn} onPress={() => setModalVisible(false)}>
                                <Text style={styles.cancelBtnText}>Batal</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.confirmBtn} onPress={handleAddReminder}>
                                <Text style={styles.confirmBtnText}>Simpan</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F8F9FA' },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingTop: Platform.OS === 'ios' ? 10 : 40,
        paddingBottom: 20,
        backgroundColor: '#FFF',
    },
    backBtn: { padding: 5 },
    headerTitle: { fontSize: 20, fontWeight: 'bold', color: '#333' },
    addBtnHeader: { padding: 5 },
    scrollContent: { padding: 20 },
    infoBanner: {
        flexDirection: 'row',
        backgroundColor: '#E8F5E9',
        padding: 15,
        borderRadius: 15,
        alignItems: 'center',
        marginBottom: 25,
    },
    infoTextWrapper: { marginLeft: 15, flex: 1 },
    infoTitle: { fontSize: 16, fontWeight: 'bold', color: '#2E8B57' },
    infoSub: { fontSize: 12, color: '#666', marginTop: 2 },
    reminderCard: {
        backgroundColor: '#FFF',
        borderRadius: 20,
        padding: 20,
        marginBottom: 15,
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
    },
    inactiveCard: { opacity: 0.6 },
    cardMain: { flexDirection: 'row', alignItems: 'center' },
    timeCircle: {
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: '#F0F4F7',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#E0E6ED',
    },
    timeText: { fontSize: 16, fontWeight: 'bold', color: '#2E8B57' },
    medInfo: { flex: 1, marginLeft: 15 },
    medName: { fontSize: 18, fontWeight: 'bold', color: '#333' },
    medDetailsRow: { flexDirection: 'row', alignItems: 'center', marginTop: 4 },
    medDosage: { fontSize: 13, color: '#666' },
    dotSeparator: { 
        width: 4, 
        height: 4, 
        borderRadius: 2, 
        backgroundColor: '#CCC', 
        marginHorizontal: 8 
    },
    everyDayText: { fontSize: 13, color: '#2E8B57', fontWeight: '600' },
    deleteBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-end',
        marginTop: 15,
        paddingTop: 10,
        borderTopWidth: 1,
        borderTopColor: '#F5F5F5',
    },
    deleteText: { fontSize: 12, color: '#FF5252', marginLeft: 5, fontWeight: 'bold' },
    emptyState: { alignItems: 'center', marginTop: 80 },
    emptyText: { marginTop: 15, color: '#999', fontSize: 16 },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    modalContent: {
        backgroundColor: '#FFF',
        borderRadius: 25,
        padding: 25,
        width: SCREEN_WIDTH - 40,
    },
    modalTitle: { fontSize: 20, fontWeight: 'bold', color: '#333', marginBottom: 20, textAlign: 'center' },
    inputLabel: { fontSize: 14, fontWeight: 'bold', color: '#666', marginBottom: 8 },
    input: {
        backgroundColor: '#F5F7FA',
        borderRadius: 12,
        padding: 15,
        fontSize: 16,
        marginBottom: 20,
        borderWidth: 1,
        borderColor: '#E0E6ED',
    },
    modalButtons: { flexDirection: 'row', justifyContent: 'space-between' },
    cancelBtn: { flex: 1, paddingVertical: 15, marginRight: 10, alignItems: 'center' },
    cancelBtnText: { fontSize: 16, color: '#999', fontWeight: 'bold' },
    confirmBtn: { flex: 1, backgroundColor: '#2E8B57', paddingVertical: 15, borderRadius: 12, alignItems: 'center' },
    confirmBtnText: { fontSize: 16, color: '#FFF', fontWeight: 'bold' },
});