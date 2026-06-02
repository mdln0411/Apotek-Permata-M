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

/** Expo Go: hostUri = IP:8081 (Metro). /api & /storage di-proxy ke Laravel :8000 */
function getApiUrlViaMetroProxy(): string | null {
  const hostUri = Constants.expoConfig?.hostUri;
  if (!hostUri || !getHostFromExpo()) return null;
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

/** Kandidat base URL (urutan prioritas) — dipakai axios dengan failover */
export function getApiBaseUrlCandidates(): string[] {
  const configured = getConfiguredApiUrl();
  if (configured) return [configured];

  const host = getHostFromExpo();
  const candidates: string[] = [];

  if (__DEV__ && host) {
    const viaMetro = getApiUrlViaMetroProxy();
    if (viaMetro) candidates.push(viaMetro);
    candidates.push(`http://${host}:${LARAVEL_PORT}`);
  }

  if (Platform.OS === 'android') {
    candidates.push(
      isAndroidEmulator()
        ? `http://10.0.2.2:${LARAVEL_PORT}`
        : `http://${getConfiguredLanIp()}:${LARAVEL_PORT}`,
    );
  } else if (Platform.OS === 'ios') {
    candidates.push(
      Device.isDevice
        ? `http://${getConfiguredLanIp()}:${LARAVEL_PORT}`
        : `http://localhost:${LARAVEL_PORT}`,
    );
  } else if (Platform.OS === 'web') {
    candidates.push(`http://localhost:${LARAVEL_PORT}`);
  } else {
    candidates.push(`http://${getConfiguredLanIp()}:${LARAVEL_PORT}`);
  }

  return [...new Set(candidates)];
}

let cachedPrimaryUrl: string | null = null;
let cachedHostUri: string | undefined;

/** Base URL utama — di-resolve ulang jika hostUri Expo berubah */
export function getApiBaseUrl(): string {
  const hostUri = Constants.expoConfig?.hostUri;
  if (cachedPrimaryUrl && cachedHostUri === hostUri) {
    return cachedPrimaryUrl;
  }
  cachedHostUri = hostUri;
  cachedPrimaryUrl = getApiBaseUrlCandidates()[0] ?? `http://localhost:${LARAVEL_PORT}`;
  return cachedPrimaryUrl;
}

/** @deprecated Pakai getApiBaseUrl() — tetap diekspor untuk kompatibilitas */
export const API_BASE_URL = getApiBaseUrl();

export function getLaravelBaseUrl(): string {
  const configured = getConfiguredApiUrl()?.replace(/\/$/, '');
  if (configured) {
    if (/:8081$/.test(configured)) return configured;
    return configured;
  }

  if (__DEV__) {
    const viaMetro = getApiUrlViaMetroProxy();
    if (viaMetro) return viaMetro;
  }

  const host = getHostFromExpo();
  if (host) return `http://${host}:${LARAVEL_PORT}`;

  return `http://${getConfiguredLanIp()}:${LARAVEL_PORT}`;
}

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
