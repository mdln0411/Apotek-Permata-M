import axiosClient from '@/api/axiosClient';
import { TimePickerInput } from '@/components/TimePickerInput';
import { SuccessToast } from '@/components/SuccessToast';
import { Feather, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import * as Device from 'expo-device';
import { router, Stack } from 'expo-router';
import {
    cancelAllScheduledNotifications,
    initNotificationHandler,
    requestNotificationPermissions,
    scheduleDailyMedicineReminder,
} from '@/utils/localNotifications';
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
    const [toastVisible, setToastVisible] = useState(false);
    const [toastMessage, setToastMessage] = useState('');
    const [deleteModalVisible, setDeleteModalVisible] = useState(false);
    const [reminderIdToDelete, setReminderIdToDelete] = useState<number | null>(null);

    const openAddModal = () => {
        setNewMed('');
        setNewTime('');
        setNewDosage('');
        setModalVisible(true);
    };

    const showAlert = (title: string, message: string) => {
        if (Platform.OS === 'web') {
            window.alert(`${title}: ${message}`);
        } else {
            Alert.alert(title, message);
        }
    };

    useEffect(() => {
        fetchReminders();
        setupNotifications();
    }, []);

    const setupNotifications = async () => {
        if (Device.isDevice || Platform.OS === 'web') {
            await initNotificationHandler();
            await requestNotificationPermissions();
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
            await cancelAllScheduledNotifications();

            for (const item of items) {
                if (item.is_active) {
                    const [hours, minutes] = item.reminder_time.split(':').map(Number);
                    await scheduleDailyMedicineReminder({
                        medicineName: item.medicine_name,
                        dosage: item.dosage || 'Dosis Sesuai Petunjuk',
                        hour: hours,
                        minute: minutes,
                        data: {
                            type: 'reminder',
                            title: 'Waktunya Minum Obat! 💊',
                            message: `Jangan lupa minum ${item.medicine_name} (${item.dosage || 'Dosis Sesuai Petunjuk'})`,
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
            showAlert('Gagal', 'Gagal memperbarui status pengingat');
        }
    };

    const handleAddReminder = async () => {
        if (!newMed.trim()) {
            showAlert('Error', 'Mohon isi nama obat.');
            return;
        }
        if (!newTime) {
            showAlert('Error', 'Mohon pilih waktu pengingat.');
            return;
        }

        const formattedTime = newTime;

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
            setToastMessage('Jadwal pengingat minum obat berhasil disimpan!');
            setToastVisible(true);
        } catch (error: any) {
            console.error('Error adding reminder:', error.response?.data || error.message);
            showAlert('Gagal', error.response?.data?.message || 'Terjadi kesalahan saat menambah pengingat');
        } finally {
            setLoading(false);
        }
    };

    const deleteReminder = (id: number) => {
        setReminderIdToDelete(id);
        setDeleteModalVisible(true);
    };

    const confirmDeleteReminder = async () => {
        if (!reminderIdToDelete) return;
        try {
            await axiosClient.delete(`/api/medicine-reminders/${reminderIdToDelete}`);
            setReminders(prev => prev.filter(r => r.id !== reminderIdToDelete));
            setToastMessage('Jadwal pengingat berhasil dihapus!');
            setToastVisible(true);
        } catch (error) {
            showAlert('Gagal', 'Gagal menghapus pengingat');
        } finally {
            setDeleteModalVisible(false);
            setReminderIdToDelete(null);
        }
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
                <TouchableOpacity 
                    onPress={() => {
                        if (router.canGoBack()) {
                            router.back();
                        } else {
                            router.replace('/(tabs)');
                        }
                    }} 
                    style={styles.backBtn}
                >
                    <Ionicons name="chevron-back" size={24} color="#333" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Pengingat Obat</Text>
                <TouchableOpacity style={styles.addBtnHeader} onPress={openAddModal}>
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
                            <View style={styles.cardHeader}>
                                <View style={styles.iconNameRow}>
                                    <View style={styles.medIconBg}>
                                        <MaterialCommunityIcons name="pill" size={20} color="#2E8B57" />
                                    </View>
                                    <Text style={styles.medName} numberOfLines={1}>{item.medicine_name}</Text>
                                </View>
                                <TouchableOpacity style={styles.trashBtn} onPress={() => deleteReminder(item.id)}>
                                    <Feather name="trash-2" size={18} color="#FF5252" />
                                </TouchableOpacity>
                            </View>
                            
                            <View style={styles.cardBody}>
                                <View style={styles.timeBadge}>
                                    <Feather name="clock" size={14} color="#2E8B57" style={{ marginRight: 6 }} />
                                    <Text style={styles.timeText}>{item.reminder_time.substring(0, 5)}</Text>
                                </View>
                                <View style={styles.dosageBadge}>
                                    <Text style={styles.dosageText}>{item.dosage || 'Sesuai Resep'}</Text>
                                </View>
                            </View>

                            <View style={styles.cardFooter}>
                                <Text style={styles.repeatText}>Ulangi: Setiap Hari</Text>
                                <View style={styles.switchContainer}>
                                    <Text style={[styles.statusTextLabel, item.is_active ? styles.statusActiveLabel : styles.statusInactiveLabel]}>
                                        {item.is_active ? 'Aktif' : 'Nonaktif'}
                                    </Text>
                                    <Switch 
                                        value={item.is_active} 
                                        onValueChange={() => toggleReminder(item)}
                                        trackColor={{ false: '#DDD', true: '#A5D6A7' }}
                                        thumbColor={item.is_active ? '#2E8B57' : '#FFF'}
                                        style={{ transform: [{ scaleX: 0.9 }, { scaleY: 0.9 }] }}
                                    />
                                </View>
                            </View>
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

                        <Text style={styles.inputLabel}>Waktu Pengingat</Text>
                        <TimePickerInput
                            value={newTime}
                            onChange={setNewTime}
                            placeholder="Pilih jam & menit"
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

            {/* Modal Konfirmasi Hapus Pengingat */}
            <Modal
                animationType="fade"
                transparent={true}
                visible={deleteModalVisible}
                onRequestClose={() => setDeleteModalVisible(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.confirmModalContent}>
                        <View style={styles.alertIconCircle}>
                            <Feather name="trash-2" size={28} color="#FF5252" />
                        </View>
                        <Text style={styles.confirmModalTitle}>Hapus Pengingat?</Text>
                        <Text style={styles.confirmModalDesc}>
                            Apakah Anda yakin ingin menghapus jadwal pengingat obat ini? Tindakan ini tidak dapat dibatalkan.
                        </Text>
                        <View style={styles.confirmModalButtons}>
                            <TouchableOpacity 
                                style={styles.confirmCancelBtn} 
                                onPress={() => setDeleteModalVisible(false)}
                            >
                                <Text style={styles.confirmCancelBtnText}>Batal</Text>
                            </TouchableOpacity>
                            <TouchableOpacity 
                                style={styles.confirmDeleteBtn} 
                                onPress={confirmDeleteReminder}
                            >
                                <Text style={styles.confirmDeleteBtnText}>Hapus</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>

            <SuccessToast 
                visible={toastVisible} 
                message={toastMessage} 
                onClose={() => setToastVisible(false)} 
            />
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
        padding: 18,
        marginBottom: 16,
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 6,
        borderWidth: 1,
        borderColor: '#EFEFEF',
    },
    inactiveCard: { opacity: 0.6 },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 14,
    },
    iconNameRow: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
        marginRight: 10,
    },
    medIconBg: {
        width: 38,
        height: 38,
        borderRadius: 19,
        backgroundColor: '#E8F5E9',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    medName: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#2C3E50',
        flex: 1,
    },
    trashBtn: {
        padding: 6,
    },
    cardBody: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 14,
    },
    timeBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#E8F5E9',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 16,
        marginRight: 8,
    },
    timeText: {
        fontSize: 13,
        fontWeight: 'bold',
        color: '#2E8B57',
    },
    dosageBadge: {
        backgroundColor: '#F0F4F7',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 16,
    },
    dosageText: {
        fontSize: 12,
        color: '#555',
        fontWeight: '500',
    },
    cardFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingTop: 12,
        borderTopWidth: 1,
        borderTopColor: '#F5F7FA',
    },
    repeatText: {
        fontSize: 12,
        color: '#888',
    },
    switchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    statusTextLabel: {
        fontSize: 12,
        fontWeight: '600',
        marginRight: 6,
    },
    statusActiveLabel: {
        color: '#2E8B57',
    },
    statusInactiveLabel: {
        color: '#888',
    },
    timeSelectButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F5F7FA',
        padding: 15,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#E0E6ED',
        marginBottom: 20,
    },
    timeSelectButtonText: {
        fontSize: 15,
        color: '#333',
        fontWeight: '500',
    },
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
    confirmModalContent: {
        backgroundColor: '#FFF',
        borderRadius: 24,
        padding: 24,
        width: Math.min(SCREEN_WIDTH - 40, 320),
        alignItems: 'center',
    },
    alertIconCircle: {
        width: 64,
        height: 64,
        borderRadius: 32,
        backgroundColor: '#FFEBEE',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 16,
    },
    confirmModalTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 8,
        textAlign: 'center',
    },
    confirmModalDesc: {
        fontSize: 14,
        color: '#666',
        textAlign: 'center',
        lineHeight: 20,
        marginBottom: 24,
    },
    confirmModalButtons: {
        flexDirection: 'row',
        width: '100%',
    },
    confirmCancelBtn: {
        flex: 1,
        height: 48,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#E0E6ED',
        marginRight: 10,
        backgroundColor: '#FFF',
    },
    confirmCancelBtnText: {
        fontSize: 15,
        fontWeight: 'bold',
        color: '#666',
    },
    confirmDeleteBtn: {
        flex: 1,
        height: 48,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 12,
        backgroundColor: '#FF5252',
    },
    confirmDeleteBtnText: {
        fontSize: 15,
        fontWeight: 'bold',
        color: '#FFF',
    },
});