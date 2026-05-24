import React from 'react';
import { Image, ImageStyle, StyleProp } from 'react-native';
import { APOTEK_LOGO } from '@/constants/brand';

type ApotekLogoProps = {
    size?: number;
    borderRadius?: number;
    style?: StyleProp<ImageStyle>;
};

export default function ApotekLogo({ size = 40, borderRadius = 12, style }: ApotekLogoProps) {
    return (
        <Image
            source={APOTEK_LOGO}
            style={[{ width: size, height: size, borderRadius }, style]}
            resizeMode="contain"
        />
    );
}
