import React, { useEffect, useRef } from 'react';
import {
    Animated,
    Modal,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export type AppAlertType = 'success' | 'error' | 'warning' | 'info' | 'confirm';

interface AppAlertModalProps {
    visible: boolean;
    type?: AppAlertType;
    title: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
    onClose: () => void;
    onConfirm?: () => void;
}

const ALERT_THEME: Record<
    AppAlertType,
    { icon: keyof typeof Ionicons.glyphMap; color: string; bg: string; ring: string }
> = {
    success: {
        icon: 'checkmark-circle',
        color: '#2E8B57',
        bg: '#E8F5E9',
        ring: '#C8E6C9',
    },
    error: {
        icon: 'close-circle',
        color: '#E53935',
        bg: '#FFEBEE',
        ring: '#FFCDD2',
    },
    warning: {
        icon: 'alert-circle',
        color: '#F57C00',
        bg: '#FFF3E0',
        ring: '#FFE0B2',
    },
    info: {
        icon: 'information-circle',
        color: '#1976D2',
        bg: '#E3F2FD',
        ring: '#BBDEFB',
    },
    confirm: {
        icon: 'trash-outline',
        color: '#E53935',
        bg: '#FFEBEE',
        ring: '#FFCDD2',
    },
};

export const AppAlertModal: React.FC<AppAlertModalProps> = ({
    visible,
    type = 'info',
    title,
    message,
    confirmText = 'OK',
    cancelText = 'Batal',
    onClose,
    onConfirm,
}) => {
    const scaleAnim = useRef(new Animated.Value(0.85)).current;
    const opacityAnim = useRef(new Animated.Value(0)).current;
    const theme = ALERT_THEME[type];
    const isConfirm = type === 'confirm';

    useEffect(() => {
        if (visible) {
            Animated.parallel([
                Animated.spring(scaleAnim, {
                    toValue: 1,
                    useNativeDriver: true,
                    speed: 18,
                    bounciness: 6,
                }),
                Animated.timing(opacityAnim, {
                    toValue: 1,
                    duration: 180,
                    useNativeDriver: true,
                }),
            ]).start();
        } else {
            scaleAnim.setValue(0.85);
            opacityAnim.setValue(0);
        }
    }, [visible, opacityAnim, scaleAnim]);

    const handleConfirm = () => {
        onConfirm?.();
        onClose();
    };

    return (
        <Modal
            visible={visible}
            transparent
            animationType="fade"
            onRequestClose={onClose}
        >
            <View style={styles.overlay}>
                <TouchableOpacity style={styles.backdrop} onPress={onClose} activeOpacity={1} />

                <Animated.View
                    style={[
                        styles.card,
                        {
                            opacity: opacityAnim,
                            transform: [{ scale: scaleAnim }],
                        },
                    ]}
                >
                    <View style={[styles.iconRing, { borderColor: theme.ring }]}>
                        <View style={[styles.iconCircle, { backgroundColor: theme.bg }]}>
                            <Ionicons name={theme.icon} size={42} color={theme.color} />
                        </View>
                    </View>

                    <Text style={styles.title}>{title}</Text>
                    <Text style={styles.message}>{message}</Text>

                    <View style={[styles.actions, isConfirm && styles.actionsRow]}>
                        {isConfirm ? (
                            <>
                                <TouchableOpacity
                                    style={[styles.button, styles.cancelButton]}
                                    onPress={onClose}
                                    activeOpacity={0.8}
                                >
                                    <Text style={styles.cancelButtonText}>{cancelText}</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={[styles.button, styles.dangerButton]}
                                    onPress={handleConfirm}
                                    activeOpacity={0.8}
                                >
                                    <Text style={styles.primaryButtonText}>{confirmText}</Text>
                                </TouchableOpacity>
                            </>
                        ) : (
                            <TouchableOpacity
                                style={[
                                    styles.button,
                                    styles.primaryButton,
                                    type === 'error' && styles.errorButton,
                                ]}
                                onPress={onClose}
                                activeOpacity={0.8}
                            >
                                <Text style={styles.primaryButtonText}>{confirmText}</Text>
                            </TouchableOpacity>
                        )}
                    </View>
                </Animated.View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.45)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 24,
    },
    backdrop: {
        ...StyleSheet.absoluteFillObject,
    },
    card: {
        backgroundColor: '#FFF',
        borderRadius: 28,
        paddingHorizontal: 24,
        paddingTop: 28,
        paddingBottom: 22,
        width: '100%',
        maxWidth: 360,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#E8F5E9',
        shadowColor: '#2E8B57',
        shadowOffset: { width: 0, height: 12 },
        shadowOpacity: 0.12,
        shadowRadius: 24,
        elevation: 12,
    },
    iconRing: {
        width: 96,
        height: 96,
        borderRadius: 48,
        borderWidth: 2,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 18,
    },
    iconCircle: {
        width: 76,
        height: 76,
        borderRadius: 38,
        justifyContent: 'center',
        alignItems: 'center',
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 8,
        textAlign: 'center',
    },
    message: {
        fontSize: 14,
        color: '#666',
        textAlign: 'center',
        lineHeight: 22,
        marginBottom: 24,
        paddingHorizontal: 4,
    },
    actions: {
        width: '100%',
    },
    actionsRow: {
        flexDirection: 'row',
        gap: 10,
    },
    button: {
        height: 48,
        borderRadius: 14,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 16,
    },
    primaryButton: {
        backgroundColor: '#2E8B57',
    },
    errorButton: {
        backgroundColor: '#E53935',
    },
    dangerButton: {
        backgroundColor: '#E53935',
        flex: 1,
    },
    cancelButton: {
        backgroundColor: '#F5F5F5',
        borderWidth: 1,
        borderColor: '#E0E0E0',
        flex: 1,
    },
    primaryButtonText: {
        color: '#FFF',
        fontSize: 15,
        fontWeight: 'bold',
    },
    cancelButtonText: {
        color: '#666',
        fontSize: 15,
        fontWeight: '600',
    },
});
