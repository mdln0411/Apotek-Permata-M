import axiosClient from '@/api/axiosClient';
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
    Modal
} from 'react-native';

export default function ChatRoom() {
    const { id } = useLocalSearchParams();
    const { user, refreshUnreadCount } = useAuth();

    const [messages, setMessages] = useState<any[]>([]);
    const [inputText, setInputText] = useState('');
    const [loading, setLoading] = useState(true);
    const [selectedImageUri, setSelectedImageUri] = useState<string | null>(null);
    const [captionText, setCaptionText] = useState('');
    const flatListRef = useRef<FlatList>(null);

    useEffect(() => {
        markAsRead();
        fetchMessages();
        const interval = setInterval(fetchMessages, 3000); // Polling setiap 3 detik
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


    const fetchMessages = async () => {
        try {
            const response = await axiosClient.get(`/api/consultations/${id}`);
            setMessages(response.data.data.messages);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching messages:', error);
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
            setTimeout(() => flatListRef.current?.scrollToEnd(), 100);
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
                            source={{ uri: item.image_url.startsWith('http') ? item.image_url : `${axiosClient.defaults.baseURL}/storage/${item.image_url}` }} 
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
                <View style={styles.headerInfo}>
                    <View style={styles.avatar}>
                        <Ionicons name="person" size={20} color="#2E8B57" />
                    </View>
                    <View>
                        <Text style={styles.headerName}>Apoteker Permata</Text>
                        <Text style={styles.headerStatus}>Online</Text>
                    </View>
                </View>
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
                        placeholder="Ketik pesan..."
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
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F0F4F0' },
    header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingTop: Platform.OS === 'ios' ? 0 : 40, paddingBottom: 15, backgroundColor: '#FFF', borderBottomWidth: 1, borderBottomColor: '#EEE' },
    backBtn: { width: 40, height: 40, justifyContent: 'center' },
    headerInfo: { flex: 1, flexDirection: 'row', alignItems: 'center', marginLeft: 5 },
    avatar: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#E8F5E9', justifyContent: 'center', alignItems: 'center', marginRight: 12 },
    headerName: { fontSize: 16, fontWeight: 'bold', color: '#333' },
    headerStatus: { fontSize: 12, color: '#4CAF50' },
    callBtn: { width: 40, height: 40, justifyContent: 'center', alignItems: 'center' },
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
    previewSendBtn: { width: 44, height: 44, borderRadius: 22, backgroundColor: '#00A884', justifyContent: 'center', alignItems: 'center', marginLeft: 10 }
});
