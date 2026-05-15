import { Feather, Ionicons } from '@expo/vector-icons';
import { router, Stack } from 'expo-router';
import React, { useState } from 'react';
import { 
    SafeAreaView, 
    ScrollView, 
    StyleSheet, 
    Text, 
    TouchableOpacity, 
    View,
    Switch,
    Platform,
    Modal,
    TextInput,
    Alert
} from 'react-native';

interface Reminder {
    id: string;
    medicine: string;
    time: string;
    days: string;
    active: boolean;
}

export default function PengingatScreen() {
    const [reminders, setReminders] = useState<Reminder[]>([
        { id: '1', medicine: 'Amoxicillin', time: '08:00', days: 'Setiap Hari', active: true },
        { id: '2', medicine: 'Paracetamol', time: '13:00', days: 'Senin, Rabu, Jumat', active: false },
    ]);

    const [modalVisible, setModalVisible] = useState(false);
    const [newMed, setNewMed] = useState('');
    const [newTime, setNewTime] = useState('');

    const toggleReminder = (id: string) => {
        setReminders(prev => prev.map(r => r.id === id ? { ...r, active: !r.active } : r));
    };

    const handleAddReminder = () => {
        if (!newMed || !newTime) {
            Alert.alert('Error', 'Mohon isi nama obat dan waktu');
            return;
        }
        const newEntry: Reminder = {
            id: Date.now().toString(),
            medicine: newMed,
            time: newTime,
            days: 'Setiap Hari',
            active: true
        };
        setReminders([...reminders, newEntry]);
        setNewMed('');
        setNewTime('');
        setModalVisible(false);
    };

    const deleteReminder = (id: string) => {
        setReminders(prev => prev.filter(r => r.id !== id));
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

            <ScrollView contentContainerStyle={styles.scrollContent}>
                
                <View style={styles.infoBanner}>
                    <Feather name="clock" size={24} color="#2E8B57" />
                    <View style={styles.infoTextWrapper}>
                        <Text style={styles.infoTitle}>Jangan Sampai Terlewat!</Text>
                        <Text style={styles.infoSub}>Kami akan mengingatkan Anda tepat waktu agar pengobatan maksimal.</Text>
                    </View>
                </View>

                {reminders.map((item) => (
                    <View key={item.id} style={[styles.reminderCard, !item.active && styles.inactiveCard]}>
                        <View style={styles.cardMain}>
                            <View style={styles.timeCircle}>
                                <Text style={styles.timeText}>{item.time}</Text>
                            </View>
                            <View style={styles.medInfo}>
                                <Text style={styles.medName}>{item.medicine}</Text>
                                <Text style={styles.medDays}>{item.days}</Text>
                            </View>
                            <Switch 
                                value={item.active} 
                                onValueChange={() => toggleReminder(item.id)}
                                trackColor={{ false: '#DDD', true: '#A5D6A7' }}
                                thumbColor={item.active ? '#2E8B57' : '#FFF'}
                            />
                        </View>
                        <TouchableOpacity style={styles.deleteBtn} onPress={() => deleteReminder(item.id)}>
                            <Feather name="trash-2" size={16} color="#FF5252" />
                            <Text style={styles.deleteText}>Hapus</Text>
                        </TouchableOpacity>
                    </View>
                ))}

                {reminders.length === 0 && (
                    <View style={styles.emptyState}>
                        <Ionicons name="notifications-off-outline" size={60} color="#CCC" />
                        <Text style={styles.emptyText}>Belum ada pengingat</Text>
                    </View>
                )}

            </ScrollView>

            {/* Modal Tambah Pengingat */}
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Tambah Pengingat Baru</Text>
                        
                        <Text style={styles.inputLabel}>Nama Obat</Text>
                        <TextInput 
                            style={styles.input}
                            placeholder="Contoh: Vitamin C"
                            value={newMed}
                            onChangeText={setNewMed}
                        />

                        <Text style={styles.inputLabel}>Waktu (Jam:Menit)</Text>
                        <TextInput 
                            style={styles.input}
                            placeholder="Contoh: 08:30"
                            value={newTime}
                            onChangeText={setNewTime}
                        />

                        <View style={styles.modalButtons}>
                            <TouchableOpacity style={styles.cancelBtn} onPress={() => setModalVisible(false)}>
                                <Text style={styles.cancelBtnText}>Batal</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.confirmBtn} onPress={handleAddReminder}>
                                <Text style={styles.confirmBtnText}>Tambah</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F8FBF8' },
    header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingTop: Platform.OS === 'ios' ? 0 : 40, paddingBottom: 16, backgroundColor: '#FFF', borderBottomWidth: 1, borderBottomColor: '#EEE' },
    backBtn: { width: 40, height: 40, justifyContent: 'center' },
    addBtnHeader: { width: 40, height: 40, justifyContent: 'center', alignItems: 'center' },
    headerTitle: { fontSize: 18, fontWeight: 'bold', color: '#333' },
    scrollContent: { padding: 20 },
    infoBanner: { flexDirection: 'row', backgroundColor: '#E8F5E9', borderRadius: 20, padding: 16, alignItems: 'center', marginBottom: 24, gap: 15 },
    infoTextWrapper: { flex: 1 },
    infoTitle: { fontSize: 15, fontWeight: 'bold', color: '#2E8B57' },
    infoSub: { fontSize: 12, color: '#666', marginTop: 2 },
    reminderCard: { backgroundColor: '#FFF', borderRadius: 24, padding: 16, marginBottom: 16, borderWidth: 1, borderColor: '#EEE', elevation: 3, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 5 },
    inactiveCard: { opacity: 0.6 },
    cardMain: { flexDirection: 'row', alignItems: 'center', gap: 15 },
    timeCircle: { width: 60, height: 60, borderRadius: 30, backgroundColor: '#F0F4F0', justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: '#E8F5E9' },
    timeText: { fontSize: 16, fontWeight: 'bold', color: '#2E8B57' },
    medInfo: { flex: 1 },
    medName: { fontSize: 16, fontWeight: 'bold', color: '#333' },
    medDays: { fontSize: 12, color: '#888', marginTop: 2 },
    deleteBtn: { flexDirection: 'row', alignItems: 'center', alignSelf: 'flex-end', marginTop: 10, gap: 4 },
    deleteText: { fontSize: 12, color: '#FF5252', fontWeight: '500' },
    emptyState: { alignItems: 'center', marginTop: 60 },
    emptyText: { fontSize: 16, color: '#CCC', marginTop: 10, fontWeight: 'bold' },
    modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', padding: 20 },
    modalContent: { backgroundColor: '#FFF', borderRadius: 24, padding: 24 },
    modalTitle: { fontSize: 18, fontWeight: 'bold', color: '#333', marginBottom: 20 },
    inputLabel: { fontSize: 14, color: '#555', marginBottom: 8, fontWeight: '500' },
    input: { backgroundColor: '#F5F5F5', borderRadius: 12, paddingHorizontal: 16, height: 50, fontSize: 15, marginBottom: 20 },
    modalButtons: { flexDirection: 'row', gap: 12 },
    cancelBtn: { flex: 1, paddingVertical: 14, alignItems: 'center', borderRadius: 12, backgroundColor: '#F5F5F5' },
    confirmBtn: { flex: 1, paddingVertical: 14, alignItems: 'center', borderRadius: 12, backgroundColor: '#2E8B57' },
    cancelBtnText: { color: '#666', fontWeight: 'bold' },
    confirmBtnText: { color: '#FFF', fontWeight: 'bold' }
});
