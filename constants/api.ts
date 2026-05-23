import Constants from 'expo-constants';
import * as Device from 'expo-device';
import { Platform } from 'react-native';

const LARAVEL_PORT = 8000;

/** IP dari Expo (hostUri) — selalu sinkron dengan jaringan saat ini */
function getHostFromExpo(): string | null {
  const hostUri = Constants.expoConfig?.hostUri;
  if (!hostUri) return null;

  const host = hostUri.split(':')[0]?.trim();
  if (!host || host === 'localhost' || host === '127.0.0.1') return null;

  return host;
}

/**
 * Di Expo Go, hostUri = IP:8081 (sama dengan Metro).
 * Request API lewat port 8081 → di-proxy ke Laravel :8000 (metro.config.js).
 */
function getApiUrlViaMetroProxy(): string | null {
  const hostUri = Constants.expoConfig?.hostUri;
  if (!hostUri) return null;

  if (!getHostFromExpo()) return null;

  return `http://${hostUri}`;
}

function getConfiguredLanIp(): string {
  const fromExpo = getHostFromExpo();
  if (fromExpo) return fromExpo;

  const extra = Constants.expoConfig?.extra as { lanIp?: string } | undefined;
  if (extra?.lanIp?.trim()) return extra.lanIp.trim();

  return 'localhost';
}

function getConfiguredApiUrl(): string | null {
  const fromEnv = process.env.EXPO_PUBLIC_API_URL?.trim();
  if (fromEnv) return fromEnv.replace(/\/$/, '');

  const extra = Constants.expoConfig?.extra as { apiUrl?: string } | undefined;
  if (extra?.apiUrl?.trim()) return extra.apiUrl.trim().replace(/\/$/, '');

  return null;
}

function isAndroidEmulator(): boolean {
  if (Platform.OS !== 'android') return false;
  if (!Device.isDevice) return true;
  const model = (Device.modelName ?? '').toLowerCase();
  return (
    model.includes('sdk') ||
    model.includes('emulator') ||
    model.includes('virtual') ||
    model.includes('genymotion')
  );
}

function resolveDevApiUrl(): string {
  if (__DEV__) {
    const viaMetro = getApiUrlViaMetroProxy();
    if (viaMetro) return viaMetro;
  }

  const configured = getConfiguredApiUrl();
  if (configured) return configured;

  const lan = getConfiguredLanIp();

  if (Platform.OS === 'android') {
    return isAndroidEmulator()
      ? `http://10.0.2.2:${LARAVEL_PORT}`
      : `http://${lan}:${LARAVEL_PORT}`;
  }

  if (Platform.OS === 'ios') {
    return Device.isDevice
      ? `http://${lan}:${LARAVEL_PORT}`
      : `http://localhost:${LARAVEL_PORT}`;
  }

  // Web / platform lain: browser di PC yang sama → localhost
  if (Platform.OS === 'web') {
    return `http://localhost:${LARAVEL_PORT}`;
  }

  return `http://${lan}:${LARAVEL_PORT}`;
}

/** Base URL backend Laravel (tanpa trailing slash) */
export const API_BASE_URL = resolveDevApiUrl();

/**
 * URL dasar Laravel untuk file storage (selalu port 8000).
 * Gambar tidak boleh lewat Metro :8081 karena proxy hanya meneruskan /api.
 */
export function getLaravelBaseUrl(): string {
  const configured = getConfiguredApiUrl()?.replace(/\/$/, '');
  if (configured) {
    if (/:8081$/.test(configured)) {
      const host = configured.replace(/^https?:\/\//, '').split(':')[0];
      const protocol = configured.startsWith('https') ? 'https' : 'http';
      return `${protocol}://${host}:${LARAVEL_PORT}`;
    }
    return configured;
  }
  return `http://${getConfiguredLanIp()}:${LARAVEL_PORT}`;
}

/**
 * URL publik file di storage Laravel.
 * Menormalisasi URL lama (localhost / IP Wi-Fi lama) ke host yang bisa diakses perangkat.
 */
export function storageUrl(path: string): string {
  if (!path) return '';

  let relative = path.trim();

  if (relative.startsWith('http://') || relative.startsWith('https://')) {
    const storageMatch = relative.match(/\/storage\/(.+)$/i);
    if (storageMatch) {
      relative = storageMatch[1];
    } else {
      return relative;
    }
  }

  relative = relative.replace(/^\/+/, '').replace(/^storage\//, '');
  return `${getLaravelBaseUrl()}/storage/${relative}`;
}
