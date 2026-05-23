import axiosClient from '@/api/axiosClient';
import { storageUrl } from '@/constants/api';
import { useAuth } from '@/context/AuthContext';
import { Feather, Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { router, Stack, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState, useRef } from 'react';
import { 
    SafeAreaView, 
    StyleSheet, 
    Text, 
    TouchableOpacity, 
    View, 
    TextInput, 
    FlatList, 
    KeyboardAvoidingView, 
    Platform,
    ActivityIndicator,
    Image,
    Alert,
    Modal,
    ScrollView,
} from 'react-native';

const PatientAvatar = ({
    patient,
    size = 40,
    textSize = 16,
}: {
    patient: { name?: string; profile_photo?: string | null } | null;
    size?: number;
    textSize?: number;
}) => (
    <View style={[styles.avatar, { width: size, height: size, borderRadius: size / 2 }]}>
        {patient?.profile_photo ? (
            <Image
                source={{ uri: storageUrl(patient.profile_photo) }}
                style={{ width: size, height: size, borderRadius: size / 2 }}
            />
        ) : (
            <Text style={[styles.avatarText, { fontSize: textSize }]}>
                {patient?.name?.charAt(0)?.toUpperCase() || '?'}
            </Text>
        )}
    </View>
);

export default function ApotekerChatRoom() {
    const { id } = useLocalSearchParams();
    const { user, refreshUnreadCount } = useAuth();

    const [messages, setMessages] = useState<any[]>([]);
    const [patient, setPatient] = useState<any>(null);
    const [inputText, setInputText] = useState('');
    const [loading, setLoading] = useState(true);
    const [selectedImageUri, setSelectedImageUri] = useState<string | null>(null);
    const [captionText, setCaptionText] = useState('');
    const [profileModalVisible, setProfileModalVisible] = useState(false);
    const [patientAllergies, setPatientAllergies] = useState<any[]>([]);
    const [loadingProfile, setLoadingProfile] = useState(false);
    const flatListRef = useRef<FlatList>(null);

    const fetchPatientAllergies = async (userId: number | string) => {
        const allergyResp = await axiosClient.get(`/api/allergies/by-user`, {
            params: { user_id: userId },
        });
        const list = allergyResp.data?.data;
        setPatientAllergies(Array.isArray(list) ? list : []);
    };

    const openPatientProfile = async () => {
        if (!patient?.id) return;
        setProfileModalVisible(true);
        setLoadingProfile(true);
        try {
            await fetchPatientAllergies(patient.id);
        } catch (e) {
            console.warn('Failed to fetch patient allergies', e);
            setPatientAllergies([]);
        } finally {
            setLoadingProfile(false);
        }
    };

    useEffect(() => {
        markAsRead();
        fetchChatData();
        const interval = setInterval(fetchChatData, 3000);
        return () => clearInterval(interval);
    }, [id]);

    const markAsRead = async () => {
        try {
            await axiosClient.post(`/api/consultations/${id}/read`);
            refreshUnreadCount();
        } catch (e) {
            console.error('Failed to mark as read', e);
        }
    };


    const fetchChatData = async () => {
        try {
            const response = await axiosClient.get(`/api/consultations/${id}`);
            setMessages(response.data.data.messages);
            const userData = response.data.data.user;
            setPatient(userData);
            if (userData?.id) {
                try {
                    await fetchPatientAllergies(userData.id);
                } catch (e) {
                    console.warn('Failed to fetch patient allergies', e);
                }
            }
            setLoading(false);
        } catch (error) {
            console.error('Error fetching chat data:', error);
        }
    };

    const sendMessage = async () => {
        if (!inputText.trim()) return;

        const textToSend = inputText;
        setInputText('');

        try {
            const response = await axiosClient.post(`/api/consultations/${id}/messages`, {
                message: textToSend
            });
            setMessages([...messages, response.data.data]);
        } catch (error) {
            alert('Gagal mengirim pesan');
        }
    };

    const pickImage = async () => {
        if (Platform.OS !== 'web') {
            const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
            if (status !== 'granted') {
                alert('Maaf, kami butuh izin galeri untuk mengirim gambar.');
                return;
            }
        }

        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            quality: 0.1, // High compression (10%) for lightweight, instant uploads!
        });

        if (!result.canceled) {
            setSelectedImageUri(result.assets[0].uri);
            setCaptionText('');
        }
    };

    const takePhoto = async () => {
        if (Platform.OS !== 'web') {
            const { status } = await ImagePicker.requestCameraPermissionsAsync();
            if (status !== 'granted') {
                alert('Maaf, kami butuh izin kamera untuk mengambil foto.');
                return;
            }
        }

        let result = await ImagePicker.launchCameraAsync({
            allowsEditing: true,
            quality: 0.1, // High compression (10%) for lightweight, instant uploads!
        });

        if (!result.canceled) {
            setSelectedImageUri(result.assets[0].uri);
            setCaptionText('');
        }
    };

    const uploadImage = async (uri: string, caption: string = '') => {
        // Reset states FIRST to close the WhatsApp overlay immediately so the user never gets stuck!
        setSelectedImageUri(null);
        setCaptionText('');

        try {
            const formData = new FormData();
            
            if (Platform.OS === 'web') {
                const response = await fetch(uri);
                const blob = await response.blob();
                const fileType = blob.type || 'image/jpeg';
                const extension = fileType.split('/')[1] || 'jpg';
                formData.append('image', blob, `chat_${Date.now()}.${extension}`);
            } else {
                // Match the exact working format in upload-resep.tsx
                const uriParts = uri.split('.');
                const fileType = uriParts[uriParts.length - 1];
                formData.append('image', {
                    uri: uri,
                    name: `chat_${Date.now()}.${fileType}`,
                    type: `image/${fileType}`,
                } as any);
            }

            if (caption.trim()) {
                formData.append('message', caption);
            }

            const response = await axiosClient.post(`/api/consultations/${id}/messages`, formData, {
                headers: { 
                    'Content-Type': 'multipart/form-data',
                    'Accept': 'application/json'
                },
                timeout: 120000 // 120 seconds timeout to allow PC/Web browser uncompressed high-res uploads!
            });
            
            if (response.data && response.data.data) {
                setMessages(prev => [...(Array.isArray(prev) ? prev : []), response.data.data]);
                setTimeout(() => {
                    try {
                        flatListRef.current?.scrollToEnd({ animated: true });
                    } catch (scrollErr) {
                        console.warn('Scroll error:', scrollErr);
                    }
                }, 100);
            }
        } catch (error: any) {
            console.error('Failed to send image message:', error);
            const errMsg = error.response?.data?.message || error.message || 'Gagal mengirim gambar';
            alert(`Gagal mengirim gambar: ${errMsg}`);
        }
    };

    const renderMessage = ({ item }: { item: any }) => {
        const isMine = item.sender_id === user?.id;
        return (
            <View style={[styles.msgContainer, isMine ? styles.myMsg : styles.theirMsg]}>
                <View style={[styles.msgBubble, isMine ? styles.myBubble : styles.theirBubble]}>
                    {item.image_url && (
                        <Image 
                            source={{ uri: storageUrl(item.image_url) }} 
                            style={styles.msgImage} 
                            resizeMode="cover"
                        />
                    )}
                    {item.message !== '[Gambar]' && (
                        <Text style={[styles.msgText, isMine ? styles.myText : styles.theirText]}>{item.message}</Text>
                    )}
                    <Text style={styles.msgTime}>
                        {new Date(item.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </Text>
                </View>
            </View>
        );
    };

    return (
        <SafeAreaView style={styles.container}>
            <Stack.Screen options={{ headerShown: false }} />

            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
                    <Ionicons name="chevron-back" size={24} color="#333" />
                </TouchableOpacity>
                <View style={styles.headerInfo}>
                    <PatientAvatar patient={patient} size={40} textSize={16} />
                    <View style={styles.headerTextWrap}>
                        <Text style={styles.headerName} numberOfLines={1}>{patient?.name || 'Pasien'}</Text>
                        <Text style={styles.headerStatus}>Sedang Konsultasi</Text>
                    </View>
                </View>
                <TouchableOpacity
                    style={styles.profileBtn}
                    onPress={openPatientProfile}
                    accessibilityLabel="Lihat profil pasien"
                >
                    <PatientAvatar patient={patient} size={40} textSize={16} />
                </TouchableOpacity>
            </View>

            {loading ? (
                <View style={{ flex: 1, justifyContent: 'center' }}>
                    <ActivityIndicator size="large" color="#2E8B57" />
                </View>
            ) : (
                <FlatList
                    ref={flatListRef}
                    data={messages}
                    renderItem={renderMessage}
                    keyExtractor={(item) => item.id.toString()}
                    contentContainerStyle={styles.chatList}
                    onContentSizeChange={() => flatListRef.current?.scrollToEnd()}
                />
            )}

            <KeyboardAvoidingView 
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
            >
                <View style={styles.inputContainer}>
                    <TouchableOpacity 
                        style={styles.attachBtn}
                        onPress={() => {
                            if (Platform.OS === 'web') {
                                pickImage();
                            } else {
                                Alert.alert(
                                    'Kirim Gambar',
                                    'Pilih sumber gambar:',
                                    [
                                        { text: 'Kamera', onPress: takePhoto },
                                        { text: 'Galeri', onPress: pickImage },
                                        { text: 'Batal', style: 'cancel' }
                                    ]
                                );
                            }
                        }}
                    >
                        <Ionicons name="add" size={24} color="#666" />
                    </TouchableOpacity>
                    <TextInput
                        style={styles.input}
                        placeholder="Ketik saran medis..."
                        value={inputText}
                        onChangeText={setInputText}
                        multiline
                    />
                    <TouchableOpacity style={styles.sendBtn} onPress={sendMessage}>
                        <Ionicons name="send" size={20} color="#FFF" />
                    </TouchableOpacity>
                </View>
            </KeyboardAvoidingView>

            {/* WhatsApp-style Image Preview Modal */}
            <Modal
                visible={selectedImageUri !== null}
                transparent={false}
                animationType="slide"
                onRequestClose={() => setSelectedImageUri(null)}
            >
                <SafeAreaView style={styles.previewModalContainer}>
                    {/* Header */}
                    <View style={styles.previewHeader}>
                        <TouchableOpacity 
                            onPress={() => setSelectedImageUri(null)}
                            style={styles.previewBackBtn}
                            hitSlop={{ top: 15, bottom: 15, left: 15, right: 15 }}
                        >
                            <Ionicons name="arrow-back" size={24} color="#FFF" />
                        </TouchableOpacity>
                        <Text style={styles.previewTitle}>Kirim Gambar</Text>
                    </View>

                    {/* Image View */}
                    <View style={styles.previewImageContainer}>
                        {selectedImageUri && (
                            <Image 
                                source={{ uri: selectedImageUri }} 
                                style={styles.previewImage} 
                                resizeMode="contain"
                            />
                        )}
                    </View>

                    {/* Footer Input for Caption */}
                    <KeyboardAvoidingView
                        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                        style={styles.previewFooter}
                    >
                        <View style={styles.previewInputRow}>
                            <TextInput
                                style={styles.previewInput}
                                placeholder="Tambahkan keterangan..."
                                placeholderTextColor="#AAA"
                                value={captionText}
                                onChangeText={setCaptionText}
                                multiline
                            />
                            <TouchableOpacity 
                                style={styles.previewSendBtn}
                                onPress={() => {
                                    if (selectedImageUri) {
                                        uploadImage(selectedImageUri, captionText);
                                    }
                                }}
                            >
                                <Ionicons name="send" size={20} color="#FFF" />
                            </TouchableOpacity>
                        </View>
                    </KeyboardAvoidingView>
                </SafeAreaView>
            </Modal>

            {/* Patient Profile Modal */}
            <Modal
                visible={profileModalVisible}
                transparent={true}
                animationType="fade"
                onRequestClose={() => setProfileModalVisible(false)}
            >
                <View style={styles.profileModalOverlay}>
                    <View style={styles.profileModalContent}>
                        <ScrollView
                            showsVerticalScrollIndicator={false}
                            style={styles.profileScroll}
                            contentContainerStyle={styles.profileScrollContent}
                        >
                            <View style={styles.profileAvatarLarge}>
                                {patient?.profile_photo ? (
                                    <Image
                                        source={{ uri: storageUrl(patient.profile_photo) }}
                                        style={styles.profileImageLarge}
                                    />
                                ) : (
                                    <Text style={styles.profileAvatarTextLarge}>
                                        {patient?.name?.charAt(0)?.toUpperCase()}
                                    </Text>
                                )}
                            </View>
                            <Text style={styles.profileName}>{patient?.name}</Text>
                            <Text style={styles.profileRole}>Pasien</Text>

                            <View style={styles.profileInfoBox}>
                                <Text style={styles.profileSectionTitle}>Informasi Kontak</Text>
                                <View style={styles.profileInfoRow}>
                                    <Ionicons name="mail-outline" size={20} color="#666" />
                                    <Text style={styles.profileInfoText}>{patient?.email || 'Belum diisi'}</Text>
                                </View>
                                <View style={styles.profileInfoRow}>
                                    <Ionicons name="call-outline" size={20} color="#666" />
                                    <Text style={styles.profileInfoText}>{patient?.phone || 'Belum diisi'}</Text>
                                </View>
                                <View style={styles.profileInfoRow}>
                                    <Ionicons name="location-outline" size={20} color="#666" />
                                    <Text style={styles.profileInfoText}>{patient?.address || 'Belum diisi'}</Text>
                                </View>
                            </View>

                            <View style={styles.profileInfoBox}>
                                <Text style={styles.profileSectionTitle}>Alergi Obat Pasien</Text>
                                {loadingProfile ? (
                                    <ActivityIndicator color="#2E8B57" style={{ marginVertical: 12 }} />
                                ) : patientAllergies.length > 0 ? (
                                    patientAllergies.map((a, idx) => (
                                        <View key={a.id}>
                                            {idx > 0 && <View style={styles.profileDivider} />}
                                            <View style={styles.profileAllergyItem}>
                                                <View style={styles.profileAllergyHeader}>
                                                    <Ionicons name="alert-circle" size={18} color="#D32F2F" />
                                                    <Text style={styles.profileAllergyName}>{a.allergen_name}</Text>
                                                    <View style={[
                                                        styles.severityBadge,
                                                        a.severity === 'berat' ? styles.severityBerat : styles.severitySedang,
                                                    ]}>
                                                        <Text style={[
                                                            styles.severityText,
                                                            a.severity === 'berat' ? styles.severityTextBerat : styles.severityTextSedang,
                                                        ]}>
                                                            {(a.severity || 'sedang').toUpperCase()}
                                                        </Text>
                                                    </View>
                                                </View>
                                                {a.symptom ? (
                                                    <Text style={styles.profileAllergyDetail}>
                                                        Gejala: {a.symptom}
                                                    </Text>
                                                ) : null}
                                                {a.description ? (
                                                    <Text style={styles.profileAllergyDetail}>
                                                        Deskripsi: {a.description}
                                                    </Text>
                                                ) : null}
                                            </View>
                                        </View>
                                    ))
                                ) : (
                                    <View style={styles.profileAllergyEmpty}>
                                        <Feather name="shield" size={16} color="#2E8B57" />
                                        <Text style={styles.profileAllergyEmptyText}>
                                            Pasien belum mencatat alergi obat di akunnya.
                                        </Text>
                                    </View>
                                )}
                            </View>
                        </ScrollView>

                        <TouchableOpacity
                            style={styles.profileCloseBtn}
                            onPress={() => setProfileModalVisible(false)}
                        >
                            <Text style={styles.profileCloseBtnText}>Tutup</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F0F4F0' },
    header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingTop: Platform.OS === 'ios' ? 0 : 40, paddingBottom: 15, backgroundColor: '#FFF', borderBottomWidth: 1, borderBottomColor: '#EEE' },
    backBtn: { width: 40, height: 40, justifyContent: 'center' },
    headerInfo: { flex: 1, flexDirection: 'row', alignItems: 'center', marginLeft: 5, minWidth: 0 },
    headerTextWrap: { flex: 1, marginLeft: 12, minWidth: 0 },
    avatar: { backgroundColor: '#E3F2FD', justifyContent: 'center', alignItems: 'center', marginRight: 0, overflow: 'hidden' },
    avatarText: { color: '#1976D2', fontWeight: 'bold' },
    headerName: { fontSize: 16, fontWeight: 'bold', color: '#333' },
    headerStatus: { fontSize: 12, color: '#999' },
    profileBtn: { width: 44, height: 44, justifyContent: 'center', alignItems: 'center', borderWidth: 2, borderColor: '#2E8B57', borderRadius: 22 },
    chatList: { padding: 20 },
    msgContainer: { flexDirection: 'row', marginBottom: 15, maxWidth: '80%' },
    myMsg: { alignSelf: 'flex-end' },
    theirMsg: { alignSelf: 'flex-start' },
    msgBubble: { padding: 12, borderRadius: 18 },
    myBubble: { backgroundColor: '#2E8B57', borderBottomRightRadius: 4 },
    theirBubble: { backgroundColor: '#FFF', borderBottomLeftRadius: 4, borderWidth: 1, borderColor: '#EEE' },
    msgImage: { width: 220, height: 160, borderRadius: 12, marginBottom: 6 },
    msgText: { fontSize: 14, lineHeight: 20 },
    myText: { color: '#FFF' },
    theirText: { color: '#333' },
    msgTime: { fontSize: 10, alignSelf: 'flex-end', marginTop: 4, opacity: 0.6 },
    inputContainer: { flexDirection: 'row', alignItems: 'center', padding: 12, backgroundColor: '#FFF', borderTopWidth: 1, borderTopColor: '#EEE' },
    attachBtn: { width: 40, height: 40, justifyContent: 'center', alignItems: 'center' },
    input: { flex: 1, backgroundColor: '#F5F5F5', borderRadius: 20, paddingHorizontal: 15, paddingVertical: 8, maxHeight: 100, marginHorizontal: 10 },
    sendBtn: { width: 44, height: 44, borderRadius: 22, backgroundColor: '#2E8B57', justifyContent: 'center', alignItems: 'center' },
    
    // WhatsApp style preview styles
    previewModalContainer: { flex: 1, backgroundColor: '#0B141A' },
    previewHeader: { flexDirection: 'row', alignItems: 'center', padding: 16, backgroundColor: '#0B141A' },
    previewBackBtn: { padding: 8, marginRight: 10 },
    previewTitle: { fontSize: 18, fontWeight: 'bold', color: '#FFF' },
    previewImageContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#000' },
    previewImage: { width: '100%', height: '100%' },
    previewFooter: { backgroundColor: '#0B141A', padding: 15 },
    previewInputRow: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#1F2C34', borderRadius: 25, paddingHorizontal: 15, paddingVertical: 8 },
    previewInput: { flex: 1, color: '#FFF', fontSize: 16, maxHeight: 100 },
    previewSendBtn: { width: 44, height: 44, borderRadius: 22, backgroundColor: '#00A884', justifyContent: 'center', alignItems: 'center', marginLeft: 10 },

    profileSectionTitle: { fontSize: 15, fontWeight: '600', color: '#2E8B57', marginBottom: 12 },
    profileAllergyItem: { marginBottom: 4 },
    profileAllergyHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, flexWrap: 'wrap' },
    profileAllergyName: { flex: 1, fontSize: 15, fontWeight: 'bold', color: '#333', minWidth: 100 },
    profileAllergyDetail: { fontSize: 13, color: '#666', marginTop: 6, marginLeft: 26, lineHeight: 18 },
    profileAllergyEmpty: { flexDirection: 'row', alignItems: 'center', gap: 8 },
    profileAllergyEmptyText: { flex: 1, fontSize: 13, color: '#888', fontStyle: 'italic' },
    profileDivider: { height: 1, backgroundColor: '#EEE', marginVertical: 12 },
    severityBadge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6 },
    severityBerat: { backgroundColor: '#FFEBEE' },
    severitySedang: { backgroundColor: '#FFF3E0' },
    severityText: { fontSize: 10, fontWeight: 'bold' },
    severityTextBerat: { color: '#D32F2F' },
    severityTextSedang: { color: '#F57C00' },

    profileModalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center', padding: 20 },
    profileModalContent: { width: '100%', maxHeight: '85%', backgroundColor: '#FFF', borderRadius: 20, padding: 24, elevation: 5, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.25, shadowRadius: 4 },
    profileScroll: { width: '100%' },
    profileScrollContent: { alignItems: 'center', paddingBottom: 8 },
    profileAvatarLarge: { width: 80, height: 80, borderRadius: 40, backgroundColor: '#E3F2FD', justifyContent: 'center', alignItems: 'center', marginBottom: 16, overflow: 'hidden', alignSelf: 'center' },
    profileImageLarge: { width: '100%', height: '100%' },
    profileAvatarTextLarge: { fontSize: 32, color: '#1976D2', fontWeight: 'bold' },
    profileName: { fontSize: 20, fontWeight: 'bold', color: '#333', marginBottom: 4, textAlign: 'center' },
    profileRole: { fontSize: 14, color: '#2E8B57', fontWeight: '600', marginBottom: 20, textAlign: 'center' },
    profileInfoBox: { width: '100%', alignSelf: 'stretch', backgroundColor: '#F8F9FA', borderRadius: 12, padding: 16, gap: 16, marginBottom: 16 },
    profileInfoRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
    profileInfoText: { flex: 1, fontSize: 14, color: '#555' },
    profileCloseBtn: { width: '100%', backgroundColor: '#2E8B57', paddingVertical: 14, borderRadius: 12, alignItems: 'center', marginTop: 8 },
    profileCloseBtnText: { color: '#FFF', fontSize: 16, fontWeight: 'bold' }
});
