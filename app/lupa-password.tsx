import { Feather, Ionicons } from '@expo/vector-icons';
import { router, Stack } from 'expo-router';
import React, { useState, useRef } from 'react';
import { 
    SafeAreaView, 
    ScrollView, 
    StyleSheet, 
    Text, 
    TextInput, 
    TouchableOpacity, 
    View, 
    Alert, 
    ActivityIndicator,
    Animated,
    Vibration,
    KeyboardAvoidingView,
    Platform
} from 'react-native';
import axiosClient from '../api/axiosClient';
import { SuccessToast } from '@/components/SuccessToast';

export default function LupaPasswordScreen() {
    const [step, setStep] = useState(1);
    
    // Form States
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState('');
    const [resetToken, setResetToken] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    
    const [loading, setLoading] = useState(false);
    const [toastVisible, setToastVisible] = useState(false);

    // Errors
    const [errors, setErrors] = useState({
        email: '',
        otp: '',
        password: '',
        server: ''
    });

    const shakeAnimation = useRef(new Animated.Value(0)).current;

    const triggerShake = () => {
        Vibration.vibrate(100);
        shakeAnimation.setValue(0);
        Animated.sequence([
            Animated.timing(shakeAnimation, { toValue: 10, duration: 50, useNativeDriver: true }),
            Animated.timing(shakeAnimation, { toValue: -10, duration: 50, useNativeDriver: true }),
            Animated.timing(shakeAnimation, { toValue: 10, duration: 50, useNativeDriver: true }),
            Animated.timing(shakeAnimation, { toValue: 0, duration: 50, useNativeDriver: true })
        ]).start();
    };

    const validateEmail = (val: string) => {
        const re = /\S+@\S+\.\S+/;
        return re.test(val);
    };

    const handleRealtimeValidation = (field: string, value: string) => {
        let newErrors = { ...errors, server: '' };

        if (field === 'email') {
            setEmail(value);
            if (!value.trim()) newErrors.email = 'Email wajib diisi.';
            else if (!validateEmail(value)) newErrors.email = 'Format email tidak valid.';
            else newErrors.email = '';
        }
        if (field === 'otp') {
            setOtp(value);
            if (!value.trim()) newErrors.otp = 'OTP wajib diisi.';
            else newErrors.otp = '';
        }
        if (field === 'password') {
            setPassword(value);
            if (!value) newErrors.password = 'Password baru wajib diisi.';
            else if (value.length < 8) newErrors.password = 'Password minimal 8 karakter.';
            else newErrors.password = '';
        }
        setErrors(newErrors);
    };

    const handleSendOtp = async () => {
        if (!email.trim() || !validateEmail(email)) {
            setErrors({ ...errors, email: 'Masukkan email yang valid terlebih dahulu.' });
            triggerShake();
            return;
        }
        setLoading(true);
        setErrors({ ...errors, server: '' });
        try {
            const response = await axiosClient.post('/api/auth/forgot-password', { email });
            setStep(2);
        } catch (error: any) {
            triggerShake();
            setErrors({ ...errors, server: error.response?.data?.message || 'Gagal mengirim OTP' });
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyOtp = async () => {
        if (!otp.trim()) {
            setErrors({ ...errors, otp: 'Kode OTP tidak boleh kosong.' });
            triggerShake();
            return;
        }
        setLoading(true);
        setErrors({ ...errors, server: '' });
        try {
            const response = await axiosClient.post('/api/auth/verify-otp', { email, otp });
            setResetToken(response.data.reset_token);
            setStep(3);
        } catch (error: any) {
            triggerShake();
            setErrors({ ...errors, server: error.response?.data?.message || 'OTP tidak valid' });
        } finally {
            setLoading(false);
        }
    };

    const handleResetPassword = async () => {
        if (!password || password.length < 8) {
            setErrors({ ...errors, password: 'Password baru minimal 8 karakter.' });
            triggerShake();
            return;
        }
        setLoading(true);
        setErrors({ ...errors, server: '' });
        try {
            await axiosClient.post('/api/auth/reset-password', {
                email,
                reset_token: resetToken,
                password
            });
            setToastVisible(true);
            setTimeout(() => {
                setToastVisible(false);
                router.replace('/login' as any);
            }, 2500);
        } catch (error: any) {
            triggerShake();
            setErrors({ ...errors, server: error.response?.data?.message || 'Gagal mereset password' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <Stack.Screen options={{ headerShown: false }} />
            
            <SuccessToast visible={toastVisible} message="Password berhasil direset! Silakan login kembali." />

            <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
                <View style={styles.header}>
                    <View style={styles.logoContainer}>
                        <Ionicons name="medical" size={24} color="#FFF" />
                        <Text style={styles.headerTitle}>Apotek Permata</Text>
                    </View>
                    <TouchableOpacity onPress={() => router.push('/register' as any)}>
                        <Text style={styles.headerLink}>Daftar</Text>
                    </TouchableOpacity>
                </View>

                <ScrollView contentContainerStyle={styles.scrollContent}>
                    <TouchableOpacity style={styles.backBtn} onPress={() => {
                        if (step > 1) setStep(step - 1);
                        else router.back();
                    }}>
                        <Feather name="arrow-left" size={20} color="#333" />
                        <Text style={styles.backText}>Kembali</Text>
                    </TouchableOpacity>

                    <Text style={styles.mainTitle}>Lupa Password</Text>
                    
                    <Animated.View style={{ transform: [{ translateX: shakeAnimation }] }}>
                        {errors.server ? (
                            <View style={styles.errorBox}>
                                <Feather name="alert-circle" size={20} color="#FF5252" />
                                <Text style={styles.errorBoxText}>{errors.server}</Text>
                            </View>
                        ) : null}

                        {step === 1 && (
                            <>
                                <Text style={styles.subTitle}>Masukkan email terdaftar Anda untuk menerima kode OTP (silakan cek log server untuk simulasi).</Text>
                                
                                <View style={styles.inputGroup}>
                                    <View style={[styles.inputWrapper, errors.email ? styles.inputError : null]}>
                                        <Feather name="mail" size={20} color={errors.email ? '#FF5252' : '#999'} style={styles.inputIcon} />
                                        <TextInput
                                            style={styles.input}
                                            placeholder="Email Terdaftar"
                                            value={email}
                                            onChangeText={(val) => handleRealtimeValidation('email', val)}
                                            keyboardType="email-address"
                                            autoCapitalize="none"
                                        />
                                    </View>
                                    {errors.email ? <Text style={styles.errorText}>{errors.email}</Text> : null}
                                </View>

                                <TouchableOpacity style={styles.submitBtn} onPress={handleSendOtp} disabled={loading}>
                                    {loading ? <ActivityIndicator color="#FFF" /> : <Text style={styles.submitBtnText}>Kirim OTP</Text>}
                                </TouchableOpacity>
                            </>
                        )}

                        {step === 2 && (
                            <>
                                <Text style={styles.subTitle}>Masukkan 6 digit kode OTP yang telah dikirimkan ke email Anda.</Text>
                                
                                <View style={styles.inputGroup}>
                                    <View style={[styles.inputWrapper, errors.otp ? styles.inputError : null]}>
                                        <Feather name="key" size={20} color={errors.otp ? '#FF5252' : '#999'} style={styles.inputIcon} />
                                        <TextInput
                                            style={styles.input}
                                            placeholder="Kode OTP"
                                            value={otp}
                                            onChangeText={(val) => handleRealtimeValidation('otp', val)}
                                            keyboardType="numeric"
                                            maxLength={6}
                                        />
                                    </View>
                                    {errors.otp ? <Text style={styles.errorText}>{errors.otp}</Text> : null}
                                </View>

                                <TouchableOpacity style={styles.submitBtn} onPress={handleVerifyOtp} disabled={loading}>
                                    {loading ? <ActivityIndicator color="#FFF" /> : <Text style={styles.submitBtnText}>Verifikasi OTP</Text>}
                                </TouchableOpacity>
                            </>
                        )}

                        {step === 3 && (
                            <>
                                <Text style={styles.subTitle}>Masukkan password baru Anda yang kuat dan mudah diingat.</Text>
                                
                                <View style={styles.inputGroup}>
                                    <View style={[styles.inputWrapper, errors.password ? styles.inputError : null]}>
                                        <Feather name="lock" size={20} color={errors.password ? '#FF5252' : '#999'} style={styles.inputIcon} />
                                        <TextInput
                                            style={styles.input}
                                            placeholder="Password Baru"
                                            value={password}
                                            onChangeText={(val) => handleRealtimeValidation('password', val)}
                                            secureTextEntry={!showPassword}
                                        />
                                        <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={{ padding: 10 }}>
                                            <Feather name={showPassword ? 'eye' : 'eye-off'} size={20} color="#999" />
                                        </TouchableOpacity>
                                    </View>
                                    {errors.password ? <Text style={styles.errorText}>{errors.password}</Text> : null}
                                </View>

                                <TouchableOpacity style={styles.submitBtn} onPress={handleResetPassword} disabled={loading}>
                                    {loading ? <ActivityIndicator color="#FFF" /> : <Text style={styles.submitBtnText}>Simpan Password</Text>}
                                </TouchableOpacity>
                            </>
                        )}
                    </Animated.View>

                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F4F9F4' },
    header: { backgroundColor: '#2E8B57', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingTop: Platform.OS === 'android' ? 50 : 20, paddingBottom: 16 },
    logoContainer: { flexDirection: 'row', alignItems: 'center' },
    headerTitle: { fontSize: 18, fontWeight: 'bold', color: '#FFF', marginLeft: 8 },
    headerLink: { color: '#FFF', fontSize: 14, fontWeight: 'bold' },
    scrollContent: { padding: 20 },
    backBtn: { flexDirection: 'row', alignItems: 'center', marginBottom: 24, marginTop: 10 },
    backText: { fontSize: 14, color: '#333', marginLeft: 8, fontWeight: '500' },
    mainTitle: { fontSize: 24, fontWeight: 'bold', color: '#333', marginBottom: 8 },
    subTitle: { fontSize: 14, color: '#555', marginBottom: 24, lineHeight: 20 },
    
    inputGroup: { marginBottom: 20 },
    inputWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFF',
        borderWidth: 1.5,
        borderColor: '#E0E0E0',
        borderRadius: 12,
        paddingHorizontal: 16,
        height: 56
    },
    inputError: { borderColor: '#FF5252', backgroundColor: '#FFFAFA' },
    inputIcon: { marginRight: 12 },
    input: { flex: 1, fontSize: 16, color: '#333' },
    errorText: { color: '#FF5252', fontSize: 12, marginTop: 6, marginLeft: 4, fontWeight: '500' },
    
    errorBox: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFEAEA', padding: 12, borderRadius: 12, marginBottom: 20, borderWidth: 1, borderColor: '#FFD1D1' },
    errorBoxText: { color: '#FF5252', fontSize: 14, fontWeight: 'bold', marginLeft: 8, flex: 1 },
    
    submitBtn: { backgroundColor: '#2E8B57', paddingVertical: 16, borderRadius: 12, alignItems: 'center', elevation: 2, shadowColor: '#2E8B57', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.2, shadowRadius: 8 },
    submitBtnText: { color: '#FFF', fontSize: 16, fontWeight: 'bold' },
});