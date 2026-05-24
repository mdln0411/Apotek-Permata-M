import { login as apiLogin } from "@/api/authService";
import ApotekLogo from "@/components/ApotekLogo";
import { useAuth } from "@/context/AuthContext";
import { Ionicons, Feather } from "@expo/vector-icons";
import { router, Stack } from "expo-router";
import React, { useState, useRef } from "react";
import {
    ActivityIndicator,
    Alert,
    Animated,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
    KeyboardAvoidingView,
    Platform,
    Vibration
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function LoginScreen() {
    const { login } = useAuth();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);

    // Validation Errors
    const [errors, setErrors] = useState({
        email: '',
        password: '',
        server: ''
    });

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

        if (field === 'email') {
            setEmail(value);
            if (!value.trim()) newErrors.email = 'Email wajib diisi.';
            else if (!validateEmail(value)) newErrors.email = 'Format email tidak valid.';
            else newErrors.email = '';
        }

        if (field === 'password') {
            setPassword(value);
            if (!value) newErrors.password = 'Password wajib diisi.';
            else newErrors.password = '';
        }

        setErrors(newErrors);
    };

    const validateAll = () => {
        let isValid = true;
        let newErrors = { ...errors, server: '' };

        if (!email.trim()) { newErrors.email = 'Email wajib diisi.'; isValid = false; }
        else if (!validateEmail(email)) { newErrors.email = 'Format email tidak valid.'; isValid = false; }
        
        if (!password) { newErrors.password = 'Password wajib diisi.'; isValid = false; }

        setErrors(newErrors);
        return isValid;
    };

    const handleLogin = async () => {
        if (!validateAll()) {
            triggerShake();
            return;
        }

        try {
            setLoading(true);
            setErrors({ ...errors, server: '' });
            console.log("Mencoba login ke:", email);
            const res = await apiLogin({ email, password });
            console.log("Login Berhasil:", res.data.role);

            // Simpan ke context
            await login(res.data, res.access_token);

            const target =
                res.data.role === "admin"
                    ? "/admin/dashboard"
                    : res.data.role === "apoteker"
                        ? "/apoteker"
                        : "/(tabs)";

            router.replace({
                pathname: "/success-action",
                params: {
                    title: "Login Berhasil!",
                    message: `Selamat datang kembali, ${res.data.name}. Anda telah berhasil masuk sebagai ${res.data.role}.`,
                    target: target,
                    buttonText: "Masuk ke Dashboard",
                },
            } as any);
        } catch (e: any) {
            console.log("Error Login Detail:", e);
            console.log("Response Error:", e.response?.data);
            triggerShake();

            const errorMsg =
                e.response?.data?.message ||
                e.message ||
                "Terjadi kesalahan koneksi ke server";
            
            if (e.response?.status === 401 || errorMsg.toLowerCase().includes('invalid') || errorMsg.toLowerCase().includes('salah')) {
                setErrors({ ...errors, server: 'Email atau password yang Anda masukkan salah.' });
            } else {
                setErrors({ ...errors, server: errorMsg });
            }
        } finally {
            setLoading(false);
        }
    };

    const fillDemo = (e: string) => {
        setEmail(e);
        setPassword("password123");
        setErrors({ email: '', password: '', server: '' });
    };

    return (
        <SafeAreaView style={styles.container}>
            <Stack.Screen options={{ headerShown: false }} />

            {/* Header */}
            <View style={styles.header}>
                <View style={styles.headerLeft}>
                    <TouchableOpacity
                        onPress={() => router.replace("/(tabs)")}
                        style={styles.backButton}
                    >
                        <Ionicons name="arrow-back" size={24} color="#FFF" />
                    </TouchableOpacity>
                    <View style={styles.logoContainer}>
                        <ApotekLogo size={28} borderRadius={8} />
                        <Text style={styles.headerTitle}>Apotek Permata</Text>
                    </View>
                </View>
                <TouchableOpacity onPress={() => router.push("/register" as any)}>
                    <Text style={styles.headerLink}>Daftar</Text>
                </TouchableOpacity>
            </View>

            <KeyboardAvoidingView 
                behavior={Platform.OS === 'ios' ? 'padding' : undefined} 
                style={{ flex: 1 }}
            >
                <ScrollView
                    contentContainerStyle={styles.scrollContent}
                    showsVerticalScrollIndicator={false}
                >
                    {/* Logo & Title */}
                    <View style={styles.titleContainer}>
                        <View style={styles.iconWrapper}>
                            <ApotekLogo size={55} borderRadius={14} />
                        </View>
                        <Text style={styles.mainTitle}>Masuk ke Akun</Text>
                        <Text style={styles.subTitle}>Masuk untuk melanjutkan pembelian</Text>
                    </View>

                    {/* Form Card */}
                    <Animated.View style={[styles.card, { transform: [{ translateX: shakeAnimation }] }]}>
                        {/* Error Server Global */}
                        {errors.server ? (
                            <View style={styles.serverErrorBox}>
                                <Feather name="alert-circle" size={16} color="#D32F2F" />
                                <Text style={styles.serverErrorText}>{errors.server}</Text>
                            </View>
                        ) : null}

                        <Text style={styles.inputLabel}>Email</Text>
                        <View style={[styles.inputWrapper, errors.email ? styles.inputError : null]}>
                            <Feather name="mail" size={20} color={errors.email ? "#D32F2F" : "#999"} style={styles.inputIcon} />
                            <TextInput
                                style={styles.textInput}
                                placeholder="email@example.com"
                                placeholderTextColor="#999"
                                keyboardType="email-address"
                                value={email}
                                onChangeText={(val) => handleRealtimeValidation('email', val)}
                                autoCapitalize="none"
                            />
                        </View>
                        {errors.email ? <Text style={styles.errorText}>{errors.email}</Text> : null}

                        <Text style={styles.inputLabel}>Password</Text>
                        <View style={[styles.inputWrapper, errors.password ? styles.inputError : null]}>
                            <Feather name="lock" size={20} color={errors.password ? "#D32F2F" : "#999"} style={styles.inputIcon} />
                            <TextInput
                                style={styles.textInput}
                                placeholder="••••••••"
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

                        <TouchableOpacity
                            style={styles.forgotPasswordBtn}
                            onPress={() => router.push("/lupa-password" as any)}
                        >
                            <Text style={styles.forgotPasswordText}>Lupa kata sandi?</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={[styles.primaryButton, loading && styles.disabledButton]}
                            onPress={handleLogin}
                            disabled={loading}
                        >
                            {loading ? (
                                <ActivityIndicator color="#FFF" />
                            ) : (
                                <Text style={styles.primaryButtonText}>Masuk</Text>
                            )}
                        </TouchableOpacity>

                        <View style={styles.registerRow}>
                            <Text style={styles.registerText}>Belum punya akun? </Text>
                            <TouchableOpacity onPress={() => router.push("/register" as any)}>
                                <Text style={styles.registerLink}>Daftar sekarang</Text>
                            </TouchableOpacity>
                        </View>
                    </Animated.View>

                    {/* Divider */}
                    <View style={styles.dividerContainer}>
                        <View style={styles.dividerLine} />
                        <Text style={styles.dividerText}>Demo Akun</Text>
                        <View style={styles.dividerLine} />
                    </View>

                    {/* Demo Info Card */}
                    <View style={styles.card}>
                        <Text style={styles.demoTitle}>Coba login sebagai:</Text>
                        <TouchableOpacity
                            style={styles.demoBtn}
                            onPress={() => fillDemo("member@apotek.com")}
                        >
                            <Text style={styles.demoItem}>• Member: member@apotek.com</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.demoBtn}
                            onPress={() => fillDemo("apoteker@apotek.com")}
                        >
                            <Text style={styles.demoItem}>• Apoteker: apoteker@apotek.com</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.demoBtn}
                            onPress={() => fillDemo("admin@apotek.com")}
                        >
                            <Text style={styles.demoItem}>• Admin: admin@apotek.com</Text>
                        </TouchableOpacity>
                        <Text style={styles.demoNote}>Password: password123</Text>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: "#F4F9F4" },
    header: {
        backgroundColor: "#2E8B57",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: 20,
        paddingTop: 50,
        paddingBottom: 16,
    },
    headerLeft: { flexDirection: "row", alignItems: "center" },
    backButton: { marginRight: 12 },
    logoContainer: { flexDirection: "row", alignItems: "center" },
    headerTitle: {
        fontSize: 18,
        fontWeight: "bold",
        color: "#FFF",
        marginLeft: 8,
    },
    headerLink: { color: "#FFF", fontSize: 14, fontWeight: "bold" },
    scrollContent: { padding: 20, paddingBottom: 40 },
    titleContainer: { alignItems: "center", marginTop: 20, marginBottom: 24 },
    iconWrapper: {
        backgroundColor: "#FFF",
        width: 80,
        height: 80,
        borderRadius: 40,
        justifyContent: "center",
        alignItems: "center",
        marginBottom: 16,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    mainTitle: {
        fontSize: 24,
        fontWeight: "bold",
        color: "#333",
        marginBottom: 8,
    },
    subTitle: { fontSize: 14, color: "#555" },
    card: {
        backgroundColor: "#FFF",
        borderRadius: 16,
        padding: 20,
        borderWidth: 1,
        borderColor: "#DCEBDE",
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 5
    },
    serverErrorBox: { flexDirection: 'row', backgroundColor: '#FFEBEE', padding: 12, borderRadius: 8, alignItems: 'center', marginBottom: 15, borderWidth: 1, borderColor: '#FFCDD2' },
    serverErrorText: { color: '#D32F2F', fontSize: 13, fontWeight: '500', marginLeft: 8, flex: 1 },

    inputLabel: { fontSize: 13, fontWeight: '600', color: '#333', marginBottom: 6, marginTop: 12 },
    inputWrapper: { flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: '#E0E0E0', borderRadius: 10, backgroundColor: '#FAFAFA', height: 50 },
    inputError: { borderColor: '#D32F2F', backgroundColor: '#FFF5F5' },
    inputIcon: { paddingHorizontal: 12 },
    textInput: { flex: 1, fontSize: 15, color: '#333', height: '100%', outlineStyle: 'none' as any },
    eyeIcon: { paddingHorizontal: 12, height: '100%', justifyContent: 'center' },
    errorText: { color: '#D32F2F', fontSize: 11, marginTop: 4, marginLeft: 4, fontWeight: '500' },

    forgotPasswordBtn: { alignSelf: "flex-end", marginTop: 12, marginBottom: 20 },
    forgotPasswordText: { color: "#2E8B57", fontSize: 14, fontWeight: "500" },
    primaryButton: {
        backgroundColor: "#2E8B57",
        height: 48,
        borderRadius: 8,
        justifyContent: "center",
        alignItems: "center",
        elevation: 2, shadowColor: '#2E8B57', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.2, shadowRadius: 4
    },
    disabledButton: { backgroundColor: "#A5D6A7", elevation: 0, shadowOpacity: 0 },
    primaryButtonText: { color: "#FFF", fontSize: 16, fontWeight: "bold" },
    registerRow: {
        flexDirection: "row",
        justifyContent: "center",
        marginTop: 20,
    },
    registerText: { color: "#555", fontSize: 14 },
    registerLink: { color: "#2E8B57", fontSize: 14, fontWeight: "bold" },
    dividerContainer: {
        flexDirection: "row",
        alignItems: "center",
        marginVertical: 24,
    },
    dividerLine: { flex: 1, height: 1, backgroundColor: "#DCEBDE" },
    dividerText: { marginHorizontal: 12, color: "#555", fontSize: 14 },
    demoTitle: {
        fontSize: 14,
        fontWeight: "bold",
        color: "#333",
        marginBottom: 12,
    },
    demoBtn: { paddingVertical: 4 },
    demoItem: { fontSize: 14, color: "#444", marginBottom: 8 },
    demoNote: { fontSize: 12, color: "#777", marginTop: 12 },
});
