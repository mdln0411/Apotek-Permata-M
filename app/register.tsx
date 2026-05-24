import axiosClient from '@/api/axiosClient';
import ApotekLogo from '@/components/ApotekLogo';
import { SuccessToast } from '@/components/SuccessToast';
import { Feather } from '@expo/vector-icons';
import { router, Stack } from 'expo-router';
import React, { useState, useRef } from 'react';
import {
    ActivityIndicator,
    Animated,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
    KeyboardAvoidingView,
    Platform,
    Vibration,
} from 'react-native';

export default function RegisterScreen() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    
    // Visibility toggles
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    // Validation Errors
    const [errors, setErrors] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        server: ''
    });

    const [loading, setLoading] = useState(false);
    const [toastVisible, setToastVisible] = useState(false);
    
    // Shake Animation
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

    const validateEmail = (emailText: string) => {
        const re = /\S+@\S+\.\S+/;
        return re.test(emailText);
    };

    const handleRealtimeValidation = (field: string, value: string) => {
        let newErrors = { ...errors, server: '' };

        if (field === 'name') {
            setName(value);
            if (!value.trim()) newErrors.name = 'Nama lengkap wajib diisi.';
            else newErrors.name = '';
        }
        
        if (field === 'email') {
            setEmail(value);
            if (!value.trim()) newErrors.email = 'Email wajib diisi.';
            else if (!validateEmail(value)) newErrors.email = 'Format email tidak valid.';
            else newErrors.email = '';
        }

        if (field === 'password') {
            setPassword(value);
            const hasLetter = /[a-zA-Z]/.test(value);
            const hasNumber = /[0-9]/.test(value);
            if (!value) newErrors.password = 'Password wajib diisi.';
            else if (value.length < 8) newErrors.password = 'Password minimal 8 karakter.';
            else if (!hasLetter || !hasNumber) newErrors.password = 'Password harus mengandung huruf dan angka.';
            else newErrors.password = '';

            // Check match if confirm is already typed
            if (confirmPassword && value !== confirmPassword) {
                newErrors.confirmPassword = 'Konfirmasi password tidak sama.';
            } else if (confirmPassword && value === confirmPassword) {
                newErrors.confirmPassword = '';
            }
        }

        if (field === 'confirmPassword') {
            setConfirmPassword(value);
            if (!value) newErrors.confirmPassword = 'Harap konfirmasi password.';
            else if (value !== password) newErrors.confirmPassword = 'Konfirmasi password tidak sama.';
            else newErrors.confirmPassword = '';
        }

        setErrors(newErrors);
    };

    const validateAll = () => {
        let isValid = true;
        let newErrors = { ...errors, server: '' };

        if (!name.trim()) { newErrors.name = 'Nama lengkap wajib diisi.'; isValid = false; }
        if (!email.trim()) { newErrors.email = 'Email wajib diisi.'; isValid = false; }
        else if (!validateEmail(email)) { newErrors.email = 'Format email tidak valid.'; isValid = false; }
        
        if (!password) { newErrors.password = 'Password wajib diisi.'; isValid = false; }
        else if (password.length < 8) { newErrors.password = 'Password minimal 8 karakter.'; isValid = false; }
        else if (!/[a-zA-Z]/.test(password) || !/[0-9]/.test(password)) { newErrors.password = 'Password harus mengandung huruf dan angka.'; isValid = false; }
        
        if (!confirmPassword) { newErrors.confirmPassword = 'Harap konfirmasi password.'; isValid = false; }
        else if (confirmPassword !== password) { newErrors.confirmPassword = 'Konfirmasi password tidak sama.'; isValid = false; }

        setErrors(newErrors);
        return isValid;
    };

    const handleRegister = async () => {
        if (!validateAll()) {
            triggerShake();
            return;
        }

        try {
            setLoading(true);
            setErrors({ ...errors, server: '' });
            
            await axiosClient.post('/api/auth/register', {
                name,
                email,
                password,
            });

            // Munculkan notifikasi sukses
            setToastVisible(true);
            
            // Tunggu sebentar lalu redirect ke login
            setTimeout(() => {
                setToastVisible(false);
                router.replace('/login');
            }, 2500);

        } catch (error: any) {
            console.error('Registration error:', error);
            triggerShake();
            const errorMsg = error.response?.data?.message || error.message || 'Terjadi kesalahan sistem.';
            
            // Cek jika error validasi backend (e.g. Email sudah terdaftar)
            if (error.response?.status === 422 || errorMsg.toLowerCase().includes('taken')) {
                setErrors({ ...errors, email: 'Email ini sudah terdaftar. Silakan gunakan email lain atau Login.', server: '' });
            } else {
                setErrors({ ...errors, server: errorMsg });
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <Stack.Screen options={{ headerShown: false }} />

            <View style={styles.header}>
                <View style={styles.logoContainer}>
                    <ApotekLogo size={28} borderRadius={8} />
                    <Text style={styles.headerTitle}>Apotek Permata</Text>
                </View>
            </View>

            <KeyboardAvoidingView 
                behavior={Platform.OS === 'ios' ? 'padding' : undefined} 
                style={{ flex: 1 }}
            >
                <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

                    <View style={styles.titleContainer}>
                        <Text style={styles.mainTitle}>Daftar Akun Baru</Text>
                        <Text style={styles.subTitle}>Buat akun untuk mulai berbelanja</Text>
                    </View>

                    <Animated.View style={[styles.card, { transform: [{ translateX: shakeAnimation }] }]}>
                        
                        {/* Error Server Global */}
                        {errors.server ? (
                            <View style={styles.serverErrorBox}>
                                <Feather name="alert-circle" size={16} color="#D32F2F" />
                                <Text style={styles.serverErrorText}>{errors.server}</Text>
                            </View>
                        ) : null}

                        {/* Nama */}
                        <Text style={styles.inputLabel}>Nama Lengkap</Text>
                        <View style={[styles.inputWrapper, errors.name ? styles.inputError : null]}>
                            <Feather name="user" size={20} color={errors.name ? "#D32F2F" : "#999"} style={styles.inputIcon} />
                            <TextInput 
                                style={styles.textInput} 
                                placeholder="Nama Lengkap Anda" 
                                placeholderTextColor="#999" 
                                value={name}
                                onChangeText={(val) => handleRealtimeValidation('name', val)}
                            />
                        </View>
                        {errors.name ? <Text style={styles.errorText}>{errors.name}</Text> : null}

                        {/* Email */}
                        <Text style={styles.inputLabel}>Email</Text>
                        <View style={[styles.inputWrapper, errors.email ? styles.inputError : null]}>
                            <Feather name="mail" size={20} color={errors.email ? "#D32F2F" : "#999"} style={styles.inputIcon} />
                            <TextInput 
                                style={styles.textInput} 
                                placeholder="email@example.com" 
                                placeholderTextColor="#999" 
                                keyboardType="email-address" 
                                autoCapitalize="none"
                                value={email}
                                onChangeText={(val) => handleRealtimeValidation('email', val)}
                            />
                        </View>
                        {errors.email ? <Text style={styles.errorText}>{errors.email}</Text> : null}

                        {/* Password */}
                        <Text style={styles.inputLabel}>Password</Text>
                        <View style={[styles.inputWrapper, errors.password ? styles.inputError : null]}>
                            <Feather name="lock" size={20} color={errors.password ? "#D32F2F" : "#999"} style={styles.inputIcon} />
                            <TextInput 
                                style={styles.textInput} 
                                placeholder="Minimal 8 karakter" 
                                placeholderTextColor="#999" 
                                secureTextEntry={!showPassword} 
                                value={password}
                                onChangeText={(val) => handleRealtimeValidation('password', val)}
                            />
                            <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.eyeIcon}>
                                <Feather name={showPassword ? "eye" : "eye-off"} size={20} color="#666" />
                            </TouchableOpacity>
                        </View>
                        {errors.password ? <Text style={styles.errorText}>{errors.password}</Text> : null}

                        {/* Confirm Password */}
                        <Text style={styles.inputLabel}>Konfirmasi Password</Text>
                        <View style={[styles.inputWrapper, errors.confirmPassword ? styles.inputError : null]}>
                            <Feather name="check-circle" size={20} color={errors.confirmPassword ? "#D32F2F" : "#999"} style={styles.inputIcon} />
                            <TextInput 
                                style={styles.textInput} 
                                placeholder="Ketik ulang password" 
                                placeholderTextColor="#999" 
                                secureTextEntry={!showConfirmPassword} 
                                value={confirmPassword}
                                onChangeText={(val) => handleRealtimeValidation('confirmPassword', val)}
                            />
                            <TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)} style={styles.eyeIcon}>
                                <Feather name={showConfirmPassword ? "eye" : "eye-off"} size={20} color="#666" />
                            </TouchableOpacity>
                        </View>
                        {errors.confirmPassword ? <Text style={styles.errorText}>{errors.confirmPassword}</Text> : null}

                        <TouchableOpacity 
                            style={[styles.primaryButton, loading && styles.disabledButton]}
                            onPress={handleRegister}
                            disabled={loading}
                        >
                            {loading ? (
                                <ActivityIndicator color="#FFF" />
                            ) : (
                                <Text style={styles.primaryButtonText}>Daftar Sekarang</Text>
                            )}
                        </TouchableOpacity>

                        <View style={styles.loginRow}>
                            <Text style={styles.loginText}>Sudah punya akun? </Text>
                            <TouchableOpacity onPress={() => router.push('/login' as any)}>
                                <Text style={styles.loginLink}>Masuk</Text>
                            </TouchableOpacity>
                        </View>
                    </Animated.View>

                </ScrollView>
            </KeyboardAvoidingView>

            {/* Success Toast / Notification */}
            <SuccessToast 
                visible={toastVisible}
                message="Akun berhasil dibuat! Mengalihkan ke login..."
                onClose={() => setToastVisible(false)}
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F4F9F4' },
    header: { backgroundColor: '#2E8B57', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingTop: 50, paddingBottom: 16 },
    logoContainer: { flexDirection: 'row', alignItems: 'center' },
    headerTitle: { fontSize: 18, fontWeight: 'bold', color: '#FFF', marginLeft: 8 },
    scrollContent: { padding: 20, paddingBottom: 40 },
    titleContainer: { alignItems: 'center', marginTop: 20, marginBottom: 24 },
    mainTitle: { fontSize: 24, fontWeight: 'bold', color: '#333', marginBottom: 8 },
    subTitle: { fontSize: 14, color: '#555' },
    card: { backgroundColor: '#FFF', borderRadius: 16, padding: 20, borderWidth: 1, borderColor: '#DCEBDE', elevation: 2, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 5 },
    
    serverErrorBox: { flexDirection: 'row', backgroundColor: '#FFEBEE', padding: 12, borderRadius: 8, alignItems: 'center', marginBottom: 15, borderWidth: 1, borderColor: '#FFCDD2' },
    serverErrorText: { color: '#D32F2F', fontSize: 13, fontWeight: '500', marginLeft: 8, flex: 1 },

    inputLabel: { fontSize: 13, fontWeight: '600', color: '#333', marginBottom: 6, marginTop: 12 },
    inputWrapper: { flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: '#E0E0E0', borderRadius: 10, backgroundColor: '#FAFAFA', height: 50 },
    inputError: { borderColor: '#D32F2F', backgroundColor: '#FFF5F5' },
    inputIcon: { paddingHorizontal: 12 },
    textInput: { flex: 1, fontSize: 15, color: '#333', height: '100%', outlineStyle: 'none' as any },
    eyeIcon: { paddingHorizontal: 12, height: '100%', justifyContent: 'center' },
    errorText: { color: '#D32F2F', fontSize: 11, marginTop: 4, marginLeft: 4, fontWeight: '500' },
    
    primaryButton: { backgroundColor: '#2E8B57', height: 50, borderRadius: 10, justifyContent: 'center', alignItems: 'center', marginTop: 24, elevation: 2, shadowColor: '#2E8B57', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.2, shadowRadius: 4 },
    disabledButton: { backgroundColor: '#A5D6A7', elevation: 0, shadowOpacity: 0 },
    primaryButtonText: { color: '#FFF', fontSize: 16, fontWeight: 'bold' },
    
    loginRow: { flexDirection: 'row', justifyContent: 'center', marginTop: 20 },
    loginText: { color: '#555', fontSize: 14 },
    loginLink: { color: '#2E8B57', fontSize: 14, fontWeight: 'bold' }
});