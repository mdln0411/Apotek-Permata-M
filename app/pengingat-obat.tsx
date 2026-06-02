import { TimePickerInput } from '@/components/TimePickerInput';
import { Feather, Ionicons } from '@expo/vector-icons';
import { router, Stack } from 'expo-router';
import {
  cancelScheduledNotification,
  initNotificationHandler,
  requestNotificationPermissions,
  scheduleDailyMedicineReminder,
} from '@/utils/localNotifications';
import React, { useEffect, useState } from 'react';
import {
  Alert,
  Modal,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';

interface Reminder {
  id: string;
  medicineName: string;
  times: string[];
  duration: string;
  isActive: boolean;
  notificationIds: string[];
}

export default function PengingatObatScreen() {
  const [reminders, setReminders] = useState<Reminder[]>([
    {
      id: '1',
      medicineName: 'Paracetamol 500mg',
      times: ['08:00', '14:00', '20:00'],
      duration: '7 hari',
      isActive: true,
      notificationIds: []
    },
    {
      id: '2',
      medicineName: 'Vitamin C 1000mg',
      times: ['09:00'],
      duration: '30 hari',
      isActive: true,
      notificationIds: []
    }
  ]);

  const [modalVisible, setModalVisible] = useState(false);
  const [newMedicineName, setNewMedicineName] = useState('');
  const [newDuration, setNewDuration] = useState('');
  const [tempTimes, setTempTimes] = useState<string[]>([]);
  const [pendingTime, setPendingTime] = useState('');
  const [showTimePickerSection, setShowTimePickerSection] = useState(false);

  useEffect(() => {
    void initNotificationHandler();
    void requestPermissions();
  }, []);

  const requestPermissions = async () => {
    const granted = await requestNotificationPermissions();
    if (!granted) {
      Alert.alert('Izin Notifikasi', 'Mohon izinkan notifikasi untuk menggunakan fitur pengingat.');
    }
  };

  const scheduleNotification = async (medicineName: string, timeStr: string) => {
    const [hours, minutes] = timeStr.split(':').map(Number);
    return scheduleDailyMedicineReminder({
      medicineName,
      hour: hours,
      minute: minutes,
    });
  };

  const handleAddReminder = async () => {
    if (!newMedicineName || !newDuration || tempTimes.length === 0) {
      Alert.alert('Eror', 'Mohon isi semua data pengingat.');
      return;
    }

    const notificationIds: string[] = [];
    for (const time of tempTimes) {
      const id = await scheduleNotification(newMedicineName, time);
      if (id) notificationIds.push(id);
    }

    const newReminder: Reminder = {
      id: Date.now().toString(),
      medicineName: newMedicineName,
      times: tempTimes,
      duration: `${newDuration} hari`,
      isActive: true,
      notificationIds
    };

    setReminders([...reminders, newReminder]);
    setModalVisible(false);
    resetForm();
    Alert.alert('Berhasil', 'Pengingat obat telah ditambahkan dan notifikasi dijadwalkan.');
  };

  const resetForm = () => {
    setNewMedicineName('');
    setNewDuration('');
    setTempTimes([]);
    setPendingTime('');
    setShowTimePickerSection(false);
  };

  const addPendingTime = () => {
    if (!pendingTime) {
      Alert.alert('Pilih Waktu', 'Silakan pilih jam pengingat terlebih dahulu.');
      return;
    }
    if (tempTimes.includes(pendingTime)) {
      Alert.alert('Duplikat', 'Waktu ini sudah ditambahkan.');
      return;
    }
    setTempTimes([...tempTimes, pendingTime].sort());
    setPendingTime('');
    setShowTimePickerSection(false);
  };

  const deleteReminder = async (id: string) => {
    const reminder = reminders.find(r => r.id === id);
    if (reminder) {
      // Cancel all notifications for this reminder
      for (const notifId of reminder.notificationIds) {
        await cancelScheduledNotification(notifId);
      }
    }
    setReminders(reminders.filter(r => r.id !== id));
  };

  const removeTempTime = (time: string) => {
    setTempTimes(tempTimes.filter(t => t !== time));
  };

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="chevron-back" size={24} color="#FFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Pengingat Obat</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        
        {/* Tombol Tambah Pengingat */}
        <TouchableOpacity 
          style={styles.addButton}
          onPress={() => setModalVisible(true)}
        >
          <Feather name="plus" size={20} color="#FFF" style={styles.addIcon} />
          <Text style={styles.addButtonText}>Tambah Pengingat</Text>
        </TouchableOpacity>

        {reminders.map((reminder) => (
          <View key={reminder.id} style={styles.card}>
            <View style={styles.cardTopRow}>
              <Text style={styles.medicineName}>{reminder.medicineName}</Text>
              <View style={styles.actionButtons}>
                <TouchableOpacity 
                  style={styles.deleteButton}
                  onPress={() => deleteReminder(reminder.id)}
                >
                  <Feather name="trash-2" size={18} color="#D32F2F" />
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.timeContainer}>
              {reminder.times.map((time, index) => (
                <View key={index} style={styles.timeBadge}>
                  <Feather name="clock" size={12} color="#2E8B57" style={styles.timeIcon} />
                  <Text style={styles.timeText}>{time}</Text>
                </View>
              ))}
            </View>

            <Text style={styles.durationText}>Durasi: {reminder.duration}</Text>

            <View style={styles.statusBox}>
              <Feather name="bell" size={14} color="#555" style={styles.statusIcon} />
              <Text style={styles.statusText}>Pengingat aktif</Text>
            </View>
          </View>
        ))}
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
            
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Nama Obat</Text>
              <TextInput
                style={styles.input}
                placeholder="Contoh: Paracetamol"
                value={newMedicineName}
                onChangeText={setNewMedicineName}
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Durasi (hari)</Text>
              <TextInput
                style={styles.input}
                placeholder="Contoh: 7"
                keyboardType="numeric"
                value={newDuration}
                onChangeText={setNewDuration}
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Jadwal Waktu</Text>
              <View style={styles.timeSelectionRow}>
                {tempTimes.map((time, index) => (
                  <TouchableOpacity 
                    key={index} 
                    style={styles.tempTimeBadge}
                    onPress={() => removeTempTime(time)}
                  >
                    <Text style={styles.tempTimeText}>{time}</Text>
                    <Ionicons name="close-circle" size={14} color="#FFF" />
                  </TouchableOpacity>
                ))}
              </View>

              {!showTimePickerSection ? (
                <TouchableOpacity
                  style={styles.addTimeLink}
                  onPress={() => setShowTimePickerSection(true)}
                >
                  <Ionicons name="add-circle-outline" size={20} color="#2E8B57" />
                  <Text style={styles.addTimeLinkText}>Tambah waktu pengingat</Text>
                </TouchableOpacity>
              ) : (
                <View style={styles.timePickerBlock}>
                  <TimePickerInput
                    value={pendingTime}
                    onChange={setPendingTime}
                    placeholder="Pilih jam & menit"
                  />
                  <TouchableOpacity style={styles.confirmTimeBtn} onPress={addPendingTime}>
                    <Text style={styles.confirmTimeBtnText}>Tambahkan ke jadwal</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>

            <View style={styles.modalButtons}>
              <TouchableOpacity 
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.cancelButtonText}>Batal</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.modalButton, styles.saveButton]}
                onPress={handleAddReminder}
              >
                <Text style={styles.saveButtonText}>Simpan</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
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
    paddingVertical: 16,
    paddingHorizontal: 16,
    paddingTop: 40,
  },
  backButton: {
    marginRight: 16,
  },
  headerTitle: {
    color: '#FFF',
    fontSize: 20,
    fontWeight: 'bold',
  },
  scrollContent: {
    padding: 20,
  },
  addButton: {
    backgroundColor: '#2E8B57',
    flexDirection: 'row',
    height: 50,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  addIcon: {
    marginRight: 8,
  },
  addButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  card: {
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderLeftWidth: 5,
    borderLeftColor: '#2E8B57',
    borderTopWidth: 1,
    borderRightWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#E0E0E0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  cardTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  medicineName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
  },
  actionButtons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkButton: {
    backgroundColor: '#E8F5E9',
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  deleteButton: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 32,
    height: 32,
  },
  timeContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 12,
  },
  timeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E8F5E9',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 20,
    marginRight: 8,
    marginBottom: 8,
  },
  timeIcon: {
    marginRight: 4,
  },
  timeText: {
    color: '#333',
    fontSize: 13,
    fontWeight: '500',
  },
  durationText: {
    fontSize: 14,
    color: '#555',
    marginBottom: 16,
  },
  statusBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 8,
  },
  statusIcon: {
    marginRight: 8,
  },
  statusText: {
    fontSize: 13,
    color: '#555',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: '#FFF',
    borderRadius: 20,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#333',
  },
  inputContainer: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#555',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  timeSelectionRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
  },
  tempTimeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2E8B57',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginRight: 8,
    marginBottom: 8,
  },
  tempTimeText: {
    color: '#FFF',
    fontSize: 14,
    marginRight: 4,
  },
  addTimeLink: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    paddingVertical: 8,
  },
  addTimeLinkText: {
    color: '#2E8B57',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 6,
  },
  timePickerBlock: {
    marginTop: 10,
    gap: 10,
  },
  confirmTimeBtn: {
    backgroundColor: '#E8F5E9',
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: 'center',
  },
  confirmTimeBtnText: {
    color: '#2E8B57',
    fontWeight: 'bold',
    fontSize: 14,
  },
  modalButtons: {
    flexDirection: 'row',
    marginTop: 24,
  },
  modalButton: {
    flex: 1,
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#F5F5F5',
    marginRight: 12,
  },
  saveButton: {
    backgroundColor: '#2E8B57',
  },
  cancelButtonText: {
    color: '#555',
    fontWeight: 'bold',
  },
  saveButtonText: {
    color: '#FFF',
    fontWeight: 'bold',
  },
});
