import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, Platform } from 'react-native';
import { Feather } from '@expo/vector-icons';

interface SuccessToastProps {
    visible: boolean;
    message: string;
    onClose: () => void;
}

export const SuccessToast: React.FC<SuccessToastProps> = ({ visible, message, onClose }) => {
    const slideAnim = useRef(new Animated.Value(-120)).current;

    useEffect(() => {
        if (visible) {
            // Slide down
            Animated.spring(slideAnim, {
                toValue: Platform.OS === 'ios' ? 50 : 20,
                useNativeDriver: true,
                speed: 12,
                bounciness: 8,
            }).start();

            const timer = setTimeout(() => {
                // Slide up
                Animated.timing(slideAnim, {
                    toValue: -120,
                    duration: 250,
                    useNativeDriver: true,
                }).start(() => {
                    onClose();
                });
            }, 3000);

            return () => clearTimeout(timer);
        } else {
            slideAnim.setValue(-120);
        }
    }, [visible]);

    if (!visible) return null;

    return (
        <Animated.View style={[styles.toastContainer, { transform: [{ translateY: slideAnim }] }]}>
            <View style={styles.iconCircle}>
                <Feather name="check" size={16} color="#FFF" />
            </View>
            <Text style={styles.toastText} numberOfLines={2}>{message}</Text>
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    toastContainer: {
        position: 'absolute',
        top: 0,
        left: 20,
        right: 20,
        backgroundColor: '#E8F5E9',
        borderRadius: 16,
        paddingHorizontal: 16,
        paddingVertical: 14,
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1.5,
        borderColor: '#81C784',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.12,
        shadowRadius: 10,
        elevation: 8,
        zIndex: 9999,
    },
    iconCircle: {
        width: 28,
        height: 28,
        borderRadius: 14,
        backgroundColor: '#2E8B57',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    toastText: {
        flex: 1,
        color: '#1B5E20',
        fontSize: 14,
        fontWeight: 'bold',
    },
});
