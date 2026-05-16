/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

import { Platform } from 'react-native';

const tintColorLight = '#0a7ea4';
const tintColorDark = '#fff';

// Centralized palette for stable colors across the app
export const Palette = {
  primary: '#2E8B57', // main green
  primaryVariant: '#276644',
  accent: '#1976D2', // blue accent
  promo: '#F57C00', // orange for promos
  background: '#F8FBF8', // soft off-white background
  surface: '#FFFFFF',
  muted: '#A5AAB0',
  success: '#4CAF50',
  warning: '#FFB300',
  error: '#FF5252',
  info: '#E3F2FD',
  onPrimary: '#E8F5E9',
};

export const Colors = {
  light: {
    text: '#11181C',
    background: Palette.background,
    surface: Palette.surface,
    primary: Palette.primary,
    primaryVariant: Palette.primaryVariant,
    accent: Palette.accent,
    promo: Palette.promo,
    muted: Palette.muted,
    success: Palette.success,
    warning: Palette.warning,
    error: Palette.error,
    info: Palette.info,
    onPrimary: Palette.onPrimary,
    tint: tintColorLight,
    icon: '#687076',
    tabIconDefault: '#687076',
    tabIconSelected: tintColorLight,
  },
  dark: {
    text: '#ECEDEE',
    background: '#151718',
    tint: tintColorDark,
    icon: '#9BA1A6',
    tabIconDefault: '#9BA1A6',
    tabIconSelected: tintColorDark,
  },
};

export const Fonts = Platform.select({
  ios: {
    /** iOS `UIFontDescriptorSystemDesignDefault` */
    sans: 'system-ui',
    /** iOS `UIFontDescriptorSystemDesignSerif` */
    serif: 'ui-serif',
    /** iOS `UIFontDescriptorSystemDesignRounded` */
    rounded: 'ui-rounded',
    /** iOS `UIFontDescriptorSystemDesignMonospaced` */
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded: "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
});
