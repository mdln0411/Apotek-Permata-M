import { Feather, Ionicons } from '@expo/vector-icons';
import { router, Stack, useLocalSearchParams } from 'expo-router';
import React from 'react';
import { 
    Platform, 
    SafeAreaView, 
    StyleSheet, 
    Text, 
    TouchableOpacity, 
    View,
    Animated
} from 'react-native';

export default function SuccessActionScreen() {
    const { title, message, target, buttonText, secondaryTarget, secondaryButtonText } = useLocalSearchParams();
    const scaleAnim = React.useRef(new Animated.Value(0)).current;

    React.useEffect(() => {
        Animated.spring(scaleAnim, {
            toValue: 1,
            friction: 5,
            useNativeDriver: true,
        }).start();
    }, []);

    return (
        <SafeAreaView style={styles.container}>
            <Stack.Screen options={{ headerShown: false }} />

            <View style={styles.content}>
                <Animated.View style={[styles.iconContainer, { transform: [{ scale: scaleAnim }] }]}>
                    <View style={styles.circle}>
                        <Ionicons name="checkmark-sharp" size={60} color="#FFF" />
                    </View>
                </Animated.View>

                <Text style={styles.title}>{title || 'Berhasil!'}</Text>
                <Text style={styles.message}>
                    {message || 'Aksi Anda telah berhasil diproses oleh sistem.'}
                </Text>

                <View style={styles.buttonWrapper}>
                    <TouchableOpacity 
                        style={styles.primaryButton}
                        onPress={() => router.replace((target as any) || '/(tabs)')}
                    >
                        <Text style={styles.buttonText}>{buttonText || 'Kembali ke Beranda'}</Text>
                        <Feather name="arrow-right" size={18} color="#FFF" style={{ marginLeft: 8 }} />
                    </TouchableOpacity>

                    {secondaryTarget && (
                        <TouchableOpacity 
                            style={styles.secondaryButton}
                            onPress={() => router.replace((secondaryTarget as any))}
                        >
                            <Text style={styles.secondaryButtonText}>{secondaryButtonText || 'Lihat Detail'}</Text>
                        </TouchableOpacity>
                    )}
                </View>

            </View>

            <View style={styles.footer}>
                <Text style={styles.footerText}>Apotek Permata - Melayani dengan Hati</Text>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { 
        flex: 1, 
        backgroundColor: '#FFF' 
    },
    content: { 
        flex: 1, 
        justifyContent: 'center', 
        alignItems: 'center', 
        paddingHorizontal: 40 
    },
    iconContainer: {
        marginBottom: 30,
    },
    circle: {
        width: 120,
        height: 120,
        borderRadius: 60,
        backgroundColor: '#2E8B57',
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#2E8B57',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.3,
        shadowRadius: 20,
        elevation: 10,
    },
    title: { 
        fontSize: 26, 
        fontWeight: 'bold', 
        color: '#333', 
        marginBottom: 16,
        textAlign: 'center'
    },
    message: { 
        fontSize: 15, 
        color: '#777', 
        textAlign: 'center', 
        lineHeight: 24,
        marginBottom: 40
    },
    buttonWrapper: {
        width: '100%',
    },
    primaryButton: { 
        backgroundColor: '#2E8B57', 
        flexDirection: 'row',
        height: 56, 
        borderRadius: 16, 
        alignItems: 'center', 
        justifyContent: 'center',
        shadowColor: '#2E8B57',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 5,
        marginBottom: 12,
    },
    buttonText: { 
        color: '#FFF', 
        fontSize: 16, 
        fontWeight: 'bold' 
    },
    secondaryButton: {
        height: 56,
        borderRadius: 16,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: '#E0E0E0',
    },
    secondaryButtonText: {
        color: '#666',
        fontSize: 16,
        fontWeight: '600',
    },

    footer: {
        paddingBottom: 30,
        alignItems: 'center'
    },
    footerText: {
        fontSize: 12,
        color: '#CCC',
        fontWeight: '500'
    }
});
