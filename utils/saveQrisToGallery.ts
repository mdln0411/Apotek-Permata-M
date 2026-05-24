import type { RefObject } from 'react';
import { Asset } from 'expo-asset';
import { Directory, File, Paths } from 'expo-file-system';
import * as FileSystem from 'expo-file-system/legacy';
import * as MediaLibrary from 'expo-media-library';
import { Platform } from 'react-native';

const PHOTO_PERMISSIONS: MediaLibrary.GranularPermission[] = ['photo'];

export type SaveQrisSource =
  | { kind: 'url'; uri: string; filename?: string }
  | { kind: 'asset'; moduleId: number; filename?: string }
  | { kind: 'base64'; data: string; filename?: string; extension?: 'png' | 'jpg' };

export type SaveQrisResult =
  | { ok: true; assetUri: string }
  | { ok: false; reason: 'permission_denied' | 'error'; message: string };

type QrSvgRef = {
  toDataURL: (callback: (dataUrl: string) => void, options?: { width?: number; height?: number }) => void;
};

export type { QrSvgRef };

function sanitizeFilename(name: string): string {
  return name.replace(/[^a-zA-Z0-9_-]/g, '_').slice(0, 64) || 'qris';
}

function isMediaPermissionGranted(response: MediaLibrary.PermissionResponse): boolean {
  if (response.granted || response.status === MediaLibrary.PermissionStatus.GRANTED) {
    return true;
  }

  // iOS dapat mengembalikan status "limited" saat izin galeri diberikan sebagian.
  return Platform.OS === 'ios' && String(response.status) === 'limited';
}

/** Minta izin simpan ke galeri — hanya foto, tanpa audio/video (Android 13+). */
export async function ensureGallerySavePermission(): Promise<boolean> {
  const current = await MediaLibrary.getPermissionsAsync(true, PHOTO_PERMISSIONS);
  if (isMediaPermissionGranted(current)) {
    return true;
  }

  const requested = await MediaLibrary.requestPermissionsAsync(true, PHOTO_PERMISSIONS);
  return isMediaPermissionGranted(requested);
}

function stripDataUrlPrefix(dataUrl: string): string {
  const commaIndex = dataUrl.indexOf(',');
  return commaIndex >= 0 ? dataUrl.slice(commaIndex + 1) : dataUrl;
}

function normalizeLocalUri(uri: string): string {
  if (Platform.OS !== 'android') {
    return uri;
  }

  if (uri.startsWith('file://')) {
    return uri;
  }

  return uri.startsWith('/') ? `file://${uri}` : `file:///${uri}`;
}

async function resolveLocalFileUri(source: SaveQrisSource): Promise<string> {
  const cacheDir = new Directory(Paths.cache, 'qris');
  if (!cacheDir.exists) {
    cacheDir.create();
  }

  if (source.kind === 'url') {
    const downloaded = await File.downloadFileAsync(source.uri, cacheDir);
    if (!downloaded.exists) {
      throw new Error('Gagal mengunduh gambar QRIS.');
    }
    return normalizeLocalUri(downloaded.uri);
  }

  if (source.kind === 'asset') {
    const asset = Asset.fromModule(source.moduleId);
    await asset.downloadAsync();

    if (!asset.localUri) {
      throw new Error('Asset QRIS lokal tidak ditemukan.');
    }

    const extension = asset.localUri.split('.').pop()?.split('?')[0] ?? 'png';
    const filename = `${sanitizeFilename(source.filename ?? `qris_${Date.now()}`)}.${extension}`;
    const target = new File(cacheDir, filename);

    if (target.exists) {
      target.delete();
    }

    const sourceFile = new File(asset.localUri);
    sourceFile.copy(target);

    return normalizeLocalUri(target.uri);
  }

  const extension = source.extension ?? 'png';
  const filename = `${sanitizeFilename(source.filename ?? `qris_${Date.now()}`)}.${extension}`;
  const target = new File(cacheDir, filename);

  if (target.exists) {
    target.delete();
  }

  const base64 = stripDataUrlPrefix(source.data);
  await FileSystem.writeAsStringAsync(target.uri, base64, {
    encoding: FileSystem.EncodingType.Base64,
  });

  return normalizeLocalUri(target.uri);
}

/** Simpan gambar QRIS ke galeri dari URL, asset lokal, atau data base64. */
export async function saveQrisToGallery(source: SaveQrisSource): Promise<SaveQrisResult> {
  try {
    const hasPermission = await ensureGallerySavePermission();
    if (!hasPermission) {
      return {
        ok: false,
        reason: 'permission_denied',
        message: 'Izin galeri diperlukan untuk menyimpan QR Code.',
      };
    }

    const localUri = await resolveLocalFileUri(source);
    await MediaLibrary.saveToLibraryAsync(localUri);

    return { ok: true, assetUri: localUri };
  } catch (error) {
    const message =
      error instanceof Error ? error.message : 'Gagal menyimpan QR Code ke galeri.';
    return { ok: false, reason: 'error', message };
  }
}

/** Simpan QR Code dari komponen react-native-qrcode-svg ke galeri. */
export async function saveQrCodeSvgToGallery(
  qrRef: RefObject<QrSvgRef | null>,
  filename: string,
): Promise<SaveQrisResult> {
  if (!qrRef.current?.toDataURL) {
    return {
      ok: false,
      reason: 'error',
      message: 'QR Code belum siap. Coba lagi sebentar.',
    };
  }

  const dataUrl = await new Promise<string>((resolve, reject) => {
    try {
      qrRef.current?.toDataURL((data) => {
        if (!data) {
          reject(new Error('QR Code kosong.'));
          return;
        }
        resolve(data);
      });
    } catch (error) {
      reject(error);
    }
  });

  return saveQrisToGallery({
    kind: 'base64',
    data: dataUrl,
    filename: sanitizeFilename(filename),
    extension: 'png',
  });
}
