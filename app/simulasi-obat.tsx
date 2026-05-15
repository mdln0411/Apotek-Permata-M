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
    Platform,
    TextInput
} from 'react-native';

export default function SimulasiObatScreen() {
    const [obatA, setObatA] = useState('');
    const [obatB, setObatB] = useState('');
    const [result, setResult] = useState<null | 'aman' | 'bahaya' | 'peringatan'>(null);

    const handleCheck = () => {
        if (!obatA || !obatB) return;
        
        const combo = `${obatA.toLowerCase()} + ${obatB.toLowerCase()}`;
        if (combo.includes('amoxicillin') && combo.includes('alkohol')) {
            setResult('bahaya');
        } else if (combo.includes('paracetamol') && combo.includes('alkohol')) {
            setResult('peringatan');
        } else {
            setResult('aman');
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <Stack.Screen options={{ headerShown: false }} />

            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
                    <Ionicons name="chevron-back" size={24} color="#333" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Simulasi Interaksi</Text>
                <View style={{ width: 40 }} />
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                
                <View style={styles.infoBox}>
                    <View style={styles.iconCircle}>
                        <Ionicons name="shield-checkmark" size={40} color="#2E8B57" />
                    </View>
                    <Text style={styles.infoTitle}>Cek Keamanan Obat</Text>
                    <Text style={styles.infoSub}>Masukkan dua nama obat untuk melihat potensi interaksi kimianya saat dikonsumsi bersamaan.</Text>
                </View>

                {/* Input Area */}
                <View style={styles.inputCard}>
                    <Text style={styles.label}>Obat Pertama</Text>
                    <TextInput 
                        style={styles.input}
                        placeholder="Misal: Amoxicillin"
                        placeholderTextColor="#AAA"
                        value={obatA}
                        onChangeText={setObatA}
                    />

                    <View style={styles.plusWrapper}>
                        <View style={styles.plusLine} />
                        <View style={styles.plusIconBg}>
                            <Ionicons name="add" size={24} color="#2E8B57" />
                        </View>
                        <View style={styles.plusLine} />
                    </View>

                    <Text style={styles.label}>Obat Kedua</Text>
                    <TextInput 
                        style={styles.input}
                        placeholder="Misal: Paracetamol / Alkohol"
                        placeholderTextColor="#AAA"
                        value={obatB}
                        onChangeText={setObatB}
                    />

                    <TouchableOpacity 
                        style={[styles.checkBtn, (!obatA || !obatB) && styles.disabledBtn]} 
                        onPress={handleCheck}
                        disabled={!obatA || !obatB}
                    >
                        <Text style={styles.checkBtnText}>Cek Interaksi Sekarang</Text>
                    </TouchableOpacity>
                </View>

                {/* Result Area */}
                {result && (
                    <View style={[
                        styles.resultCard, 
                        result === 'aman' && styles.resultAman,
                        result === 'bahaya' && styles.resultBahaya,
                        result === 'peringatan' && styles.resultPeringatan
                    ]}>
                        <View style={styles.resultHeader}>
                            <Ionicons 
                                name={result === 'aman' ? 'checkmark-circle' : result === 'bahaya' ? 'alert-circle' : 'warning'} 
                                size={24} 
                                color={result === 'aman' ? '#2E8B57' : result === 'bahaya' ? '#D32F2F' : '#F57C00'} 
                            />
                            <Text style={[
                                styles.resultTitle,
                                { color: result === 'aman' ? '#2E8B57' : result === 'bahaya' ? '#D32F2F' : '#F57C00' }
                            ]}>
                                {result === 'aman' ? 'Aman Digunakan' : result === 'bahaya' ? 'Bahaya / Kontraindikasi' : 'Perlu Perhatian'}
                            </Text>
                        </View>
                        <Text style={styles.resultDesc}>
                            {result === 'aman' && `Kombinasi antara ${obatA} dan ${obatB} secara umum aman untuk dikonsumsi bersamaan sesuai dosis.`}
                            {result === 'bahaya' && `PERINGATAN: ${obatA} dan ${obatB} memiliki interaksi serius yang dapat membahayakan kesehatan.`}
                            {result === 'peringatan' && `Gunakan dengan hati-hati. Kombinasi ini mungkin dapat mempengaruhi efektivitas kerja obat.`}
                        </Text>
                    </View>
                )}

                <View style={styles.disclaimer}>
                    <Text style={styles.disclaimerText}>* Data simulasi ini hanya sebagai referensi awal. Selalu konsultasikan dengan Apoteker kami melalui fitur Chat untuk kepastian medis.</Text>
                </View>

            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F8FBF8' },
    header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingTop: Platform.OS === 'ios' ? 0 : 40, paddingBottom: 16, backgroundColor: '#FFF', borderBottomWidth: 1, borderBottomColor: '#EEE' },
    backBtn: { width: 40, height: 40, justifyContent: 'center' },
    headerTitle: { fontSize: 18, fontWeight: 'bold', color: '#333' },
    scrollContent: { padding: 20 },
    infoBox: { alignItems: 'center', marginBottom: 24, paddingHorizontal: 10 },
    iconCircle: { width: 80, height: 80, borderRadius: 40, backgroundColor: '#E8F5E9', justifyContent: 'center', alignItems: 'center', marginBottom: 16 },
    infoTitle: { fontSize: 22, fontWeight: 'bold', color: '#333', marginBottom: 8 },
    infoSub: { fontSize: 13, color: '#777', textAlign: 'center', lineHeight: 20 },
    inputCard: { backgroundColor: '#FFF', borderRadius: 24, padding: 20, borderWidth: 1, borderColor: '#EEE', elevation: 4, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.05, shadowRadius: 10 },
    label: { fontSize: 14, fontWeight: 'bold', color: '#555', marginBottom: 8 },
    input: { backgroundColor: '#F5F5F5', borderRadius: 12, paddingHorizontal: 16, height: 52, fontSize: 15, color: '#333', borderWidth: 1, borderColor: '#E0E0E0' },
    plusWrapper: { flexDirection: 'row', alignItems: 'center', marginVertical: 15, gap: 10 },
    plusLine: { flex: 1, height: 1, backgroundColor: '#EEE' },
    plusIconBg: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#F0F4F0', justifyContent: 'center', alignItems: 'center' },
    checkBtn: { backgroundColor: '#2E8B57', paddingVertical: 16, borderRadius: 12, alignItems: 'center', marginTop: 20 },
    checkBtnText: { color: '#FFF', fontSize: 16, fontWeight: 'bold' },
    disabledBtn: { backgroundColor: '#CCC' },
    resultCard: { borderRadius: 20, padding: 20, marginTop: 24, borderWidth: 1 },
    resultAman: { backgroundColor: '#E8F5E9', borderColor: '#C8E6C9' },
    resultBahaya: { backgroundColor: '#FFEBEE', borderColor: '#FFCDD2' },
    resultPeringatan: { backgroundColor: '#FFF3E0', borderColor: '#FFE0B2' },
    resultHeader: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 12 },
    resultTitle: { fontSize: 16, fontWeight: 'bold' },
    resultDesc: { fontSize: 14, color: '#444', lineHeight: 22 },
    disclaimer: { marginTop: 30, paddingHorizontal: 10 },
    disclaimerText: { fontSize: 11, color: '#AAA', fontStyle: 'italic', textAlign: 'center', lineHeight: 16 }
});