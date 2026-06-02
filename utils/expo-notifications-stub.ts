/**
 * Pengganti aman untuk expo-notifications di Expo Go (SDK 53+).
 * Metro mengarahkan semua import "expo-notifications" ke file ini.
 */

export const SchedulableTriggerInputTypes = {
  CALENDAR: 'calendar',
  DAILY: 'daily',
  DATE: 'date',
  TIME_INTERVAL: 'timeInterval',
} as const;

export const AndroidImportance = {
  DEFAULT: 3,
  HIGH: 4,
  LOW: 2,
  MAX: 5,
  MIN: 1,
  NONE: 0,
} as const;

export function setNotificationHandler(_handler: unknown): void {
  // no-op
}

export async function getPermissionsAsync(): Promise<{ status: string }> {
  return { status: 'denied' };
}

export async function requestPermissionsAsync(): Promise<{ status: string }> {
  return { status: 'denied' };
}

export async function scheduleNotificationAsync(
  _request: unknown,
): Promise<string> {
  return 'stub-notification-id';
}

export async function cancelAllScheduledNotificationsAsync(): Promise<void> {
  // no-op
}

export async function cancelScheduledNotificationAsync(
  _identifier: string,
): Promise<void> {
  // no-op
}

export function addNotificationReceivedListener(
  _listener: (notification: unknown) => void,
): { remove: () => void } {
  return { remove: () => {} };
}

export function addNotificationResponseReceivedListener(
  _listener: (response: unknown) => void,
): { remove: () => void } {
  return { remove: () => {} };
}
