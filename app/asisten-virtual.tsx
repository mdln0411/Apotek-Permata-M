import { Feather, Ionicons } from '@expo/vector-icons';
import { router, Stack, useLocalSearchParams } from 'expo-router';
import React, { useState, useRef, useEffect } from 'react';
import { 
    KeyboardAvoidingView, 
    Platform, 
    SafeAreaView, 
    ScrollView, 
    StyleSheet, 
    Text, 
    TextInput, 
    TouchableOpacity, 
    View,
    ActivityIndicator
} from 'react-native';
import { GoogleGenerativeAI } from "@google/generative-ai";

// Konfigurasi Gemini AI
const API_KEY = "AIzaSyC6ntg_1CdA3wOhtqJt8CzkhDWBK4mInv0";
const genAI = new GoogleGenerativeAI(API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

interface Message {
    id: string;
    text: string;
    sender: 'bot' | 'user';
    time: string;
}

export default function AsistenVirtualScreen() {
    const { type } = useLocalSearchParams<{ type: 'ai' | 'human' }>();
    const isAi = type === 'ai';
    
    const [messages, setMessages] = useState<Message[]>([
        { 
            id: '1', 
            text: isAi ? 'Halo! Saya Asisten AI Apotek Permata. Saya siap membantu menjawab pertanyaan Anda seputar kesehatan dan obat-obatan. Ada yang bisa saya bantu?' : 'Halo, saya apt. Sarah. Ada yang bisa saya bantu terkait keluhan kesehatan atau resep Anda?', 
            sender: 'bot', 
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
    ]);
    const [inputText, setInputText] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const scrollViewRef = useRef<ScrollView>(null);

    const getGeminiResponse = async (userPrompt: string) => {
        try {
            const systemPrompt = "Anda adalah Asisten Virtual dari Apotek Permata. Jawablah pertanyaan pasien dengan ramah, profesional, dan informatif. Fokus pada saran penggunaan obat yang aman. Jika pertanyaan di luar konteks medis/obat, arahkan kembali dengan sopan. Gunakan Bahasa Indonesia yang santun.";
            const fullPrompt = `${systemPrompt}\n\nPasien: ${userPrompt}\nAsisten:`;
            
            const result = await model.generateContent(fullPrompt);
            const response = await result.response;
            return response.text();
        } catch (error) {
            console.error("Gemini Error:", error);
            return "Maaf, sistem saya sedang mengalami kendala teknis. Silakan coba sesaat lagi atau hubungi apoteker kami secara langsung.";
        }
    };

    const handleSend = async () => {
        if (!inputText.trim()) return;

        const userMsg: Message = {
            id: Date.now().toString(),
            text: inputText,
            sender: 'user',
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };

        setMessages(prev => [...prev, userMsg]);
        const currentInput = inputText;
        setInputText('');
        setIsTyping(true);

        // Jika mode AI, gunakan Gemini. Jika mode Manusia, gunakan balasan statis.
        let botResponseText = "";
        
        if (isAi) {
            botResponseText = await getGeminiResponse(currentInput);
        } else {
            // Simulasi balasan manusia (delay)
            await new Promise(resolve => setTimeout(resolve, 2000));
            botResponseText = "Baik, saya telah menerima pesan Anda. Mohon tunggu sebentar ya, saya sedang meninjau pertanyaan Anda.";
        }

        const botMsg: Message = {
            id: (Date.now() + 1).toString(),
            text: botResponseText,
            sender: 'bot',
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };

        setMessages(prev => [...prev, botMsg]);
        setIsTyping(false);
    };

    useEffect(() => {
        setTimeout(() => scrollViewRef.current?.scrollToEnd({ animated: true }), 100);
    }, [messages, isTyping]);

    return (
        <SafeAreaView style={styles.container}>
            <Stack.Screen options={{ headerShown: false }} />
            
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
                    <Ionicons name="chevron-back" size={24} color="#333" />
                </TouchableOpacity>
                <View style={styles.headerInfo}>
                    <View style={styles.avatarMini}>
                        {isAi ? <Ionicons name="sparkles" size={18} color="#FFF" /> : <Ionicons name="person" size={18} color="#FFF" />}
                        <View style={styles.dotOnline} />
                    </View>
                    <View>
                        <Text style={styles.headerName}>{isAi ? 'Asisten Virtual (AI Gemini)' : 'apt. Sarah Angelica'}</Text>
                        <Text style={styles.headerStatus}>{isTyping ? 'Sedang mengetik...' : 'Sedang Online'}</Text>
                    </View>
                </View>
            </View>

            <KeyboardAvoidingView 
                style={styles.keyboardContainer} 
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            >
                <ScrollView 
                    ref={scrollViewRef}
                    contentContainerStyle={styles.scrollContent} 
                    showsVerticalScrollIndicator={false}
                >
                    {messages.map((msg) => (
                        <View key={msg.id} style={[styles.messageRow, msg.sender === 'user' ? styles.rowUser : styles.rowBot]}>
                            <View style={[styles.bubble, msg.sender === 'user' ? styles.bubbleUser : styles.bubbleBot]}>
                                <Text style={[styles.messageText, msg.sender === 'user' ? styles.textUser : styles.textBot]}>
                                    {msg.text}
                                </Text>
                                <Text style={[styles.timeText, msg.sender === 'user' ? styles.timeUser : styles.timeBot]}>
                                    {msg.time}
                                </Text>
                            </View>
                        </View>
                    ))}
                    {isTyping && (
                        <View style={styles.messageRow}>
                            <View style={[styles.bubble, styles.bubbleBot, { paddingVertical: 8 }]}>
                                <ActivityIndicator size="small" color="#2E8B57" />
                            </View>
                        </View>
                    )}
                </ScrollView>

                <View style={styles.inputContainer}>
                    <View style={styles.inputWrapper}>
                        <TextInput 
                            style={styles.textInput}
                            placeholder="Tanya apa saja..."
                            placeholderTextColor="#999"
                            value={inputText}
                            onChangeText={setInputText}
                            multiline
                        />
                    </View>
                    <TouchableOpacity 
                        style={[styles.sendBtn, (!inputText.trim() || isTyping) && styles.sendBtnDisabled]} 
                        onPress={handleSend}
                        disabled={!inputText.trim() || isTyping}
                    >
                        <Ionicons name="send" size={20} color="#FFF" />
                    </TouchableOpacity>
                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F0F4F0' },
    keyboardContainer: { flex: 1 },
    header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingTop: Platform.OS === 'ios' ? 0 : 40, paddingBottom: 12, backgroundColor: '#FFF', borderBottomWidth: 1, borderBottomColor: '#EEE' },
    backBtn: { width: 40, height: 40, justifyContent: 'center' },
    headerInfo: { flex: 1, flexDirection: 'row', alignItems: 'center', marginLeft: 4 },
    avatarMini: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#2E8B57', justifyContent: 'center', alignItems: 'center', marginRight: 12 },
    dotOnline: { position: 'absolute', bottom: 0, right: 0, width: 12, height: 12, borderRadius: 6, backgroundColor: '#4CAF50', borderWidth: 2, borderColor: '#FFF' },
    headerName: { fontSize: 15, fontWeight: 'bold', color: '#333' },
    headerStatus: { fontSize: 11, color: '#4CAF50', fontWeight: '500' },
    scrollContent: { padding: 16, paddingBottom: 20 },
    messageRow: { flexDirection: 'row', marginBottom: 16, width: '100%' },
    rowBot: { justifyContent: 'flex-start' },
    rowUser: { justifyContent: 'flex-end' },
    bubble: { maxWidth: '80%', padding: 12, borderRadius: 20, elevation: 1, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 2 },
    bubbleBot: { backgroundColor: '#FFF', borderTopLeftRadius: 4 },
    bubbleUser: { backgroundColor: '#2E8B57', borderTopRightRadius: 4 },
    messageText: { fontSize: 15, lineHeight: 22 },
    textBot: { color: '#333' },
    textUser: { color: '#FFF' },
    timeText: { fontSize: 10, marginTop: 4, alignSelf: 'flex-end' },
    timeBot: { color: '#AAA' },
    timeUser: { color: 'rgba(255,255,255,0.7)' },
    inputContainer: { flexDirection: 'row', alignItems: 'flex-end', padding: 12, backgroundColor: '#FFF', borderTopWidth: 1, borderTopColor: '#EEE', paddingBottom: Platform.OS === 'ios' ? 30 : 12 },
    inputWrapper: { flex: 1, backgroundColor: '#F5F5F5', borderRadius: 24, paddingHorizontal: 16, paddingVertical: Platform.OS === 'ios' ? 10 : 8, marginHorizontal: 8, maxHeight: 100 },
    textInput: { fontSize: 15, color: '#333', textAlignVertical: 'center' },
    sendBtn: { width: 44, height: 44, borderRadius: 22, backgroundColor: '#2E8B57', justifyContent: 'center', alignItems: 'center', marginBottom: 2 },
    sendBtnDisabled: { backgroundColor: '#CCC' }
});