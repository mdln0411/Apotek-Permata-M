import axiosClient from '@/api/axiosClient';
import { useAuth } from '@/context/AuthContext';
import { Feather, Ionicons } from '@expo/vector-icons';
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
    ActivityIndicator
} from 'react-native';

export default function ApotekerChatRoom() {
    const { id } = useLocalSearchParams();
    const { user } = useAuth();
    const [messages, setMessages] = useState<any[]>([]);
    const [patient, setPatient] = useState<any>(null);
    const [inputText, setInputText] = useState('');
    const [loading, setLoading] = useState(true);
    const flatListRef = useRef<FlatList>(null);

    useEffect(() => {
        fetchChatData();
        const interval = setInterval(fetchChatData, 3000);
        return () => clearInterval(interval);
    }, [id]);

    const fetchChatData = async () => {
        try {
            const response = await axiosClient.get(`/api/consultations/${id}`);
            setMessages(response.data.data.messages);
            setPatient(response.data.data.user);
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

    const renderMessage = ({ item }: { item: any }) => {
        const isMine = item.sender_id === user?.id;
        return (
            <View style={[styles.msgContainer, isMine ? styles.myMsg : styles.theirMsg]}>
                <View style={[styles.msgBubble, isMine ? styles.myBubble : styles.theirBubble]}>
                    <Text style={[styles.msgText, isMine ? styles.myText : styles.theirText]}>{item.message}</Text>
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
                    <View style={styles.avatar}>
                        <Text style={styles.avatarText}>{patient?.name?.charAt(0)}</Text>
                    </View>
                    <View>
                        <Text style={styles.headerName}>{patient?.name || 'Pasien'}</Text>
                        <Text style={styles.headerStatus}>Sedang Konsultasi</Text>
                    </View>
                </View>
                <TouchableOpacity style={styles.profileBtn}>
                    <Ionicons name="person-circle-outline" size={26} color="#2E8B57" />
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
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F0F4F0' },
    header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingTop: Platform.OS === 'ios' ? 0 : 40, paddingBottom: 15, backgroundColor: '#FFF', borderBottomWidth: 1, borderBottomColor: '#EEE' },
    backBtn: { width: 40, height: 40, justifyContent: 'center' },
    headerInfo: { flex: 1, flexDirection: 'row', alignItems: 'center', marginLeft: 5 },
    avatar: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#E3F2FD', justifyContent: 'center', alignItems: 'center', marginRight: 12 },
    avatarText: { color: '#1976D2', fontWeight: 'bold' },
    headerName: { fontSize: 16, fontWeight: 'bold', color: '#333' },
    headerStatus: { fontSize: 12, color: '#999' },
    profileBtn: { width: 40, height: 40, justifyContent: 'center', alignItems: 'center' },
    chatList: { padding: 20 },
    msgContainer: { flexDirection: 'row', marginBottom: 15, maxWidth: '80%' },
    myMsg: { alignSelf: 'flex-end' },
    theirMsg: { alignSelf: 'flex-start' },
    msgBubble: { padding: 12, borderRadius: 18 },
    myBubble: { backgroundColor: '#2E8B57', borderBottomRightRadius: 4 },
    theirBubble: { backgroundColor: '#FFF', borderBottomLeftRadius: 4, borderWidth: 1, borderColor: '#EEE' },
    msgText: { fontSize: 14, lineHeight: 20 },
    myText: { color: '#FFF' },
    theirText: { color: '#333' },
    msgTime: { fontSize: 10, alignSelf: 'flex-end', marginTop: 4, opacity: 0.6 },
    inputContainer: { flexDirection: 'row', alignItems: 'center', padding: 12, backgroundColor: '#FFF', borderTopWidth: 1, borderTopColor: '#EEE' },
    input: { flex: 1, backgroundColor: '#F5F5F5', borderRadius: 20, paddingHorizontal: 15, paddingVertical: 8, maxHeight: 100, marginRight: 10 },
    sendBtn: { width: 44, height: 44, borderRadius: 22, backgroundColor: '#2E8B57', justifyContent: 'center', alignItems: 'center' }
});
