import Constants from 'expo-constants';
import * as Notifications from '@/utils/expo-notifications-stub';

/** Push remote tidak didukung di Expo Go; local schedule via stub (no crash). */
export function notificationsSupported(): boolean {
  return Constants.appOwnership !== 'expo';
}

let handlerInitialized = false;

export async function initNotificationHandler(): Promise<void> {
  if (handlerInitialized) return;
  handlerInitialized = true;
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: true,
      shouldSetBadge: false,
      shouldShowBanner: true,
      shouldShowList: true,
    }),
  });
}

export async function requestNotificationPermissions(): Promise<boolean> {
  if (!notificationsSupported()) return false;
  try {
    const { status: existing } = await Notifications.getPermissionsAsync();
    if (existing === 'granted') return true;
    const { status } = await Notifications.requestPermissionsAsync();
    return status === 'granted';
  } catch {
    return false;
  }
}

export async function scheduleLocalNotification(content: {
  title: string;
  body: string;
  sound?: boolean;
  data?: Record<string, unknown>;
}): Promise<void> {
  try {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: content.title,
        body: content.body,
        sound: content.sound ?? true,
        data: content.data,
      },
      trigger: null,
    });
  } catch {
    // no-op
  }
}

export async function scheduleDailyMedicineReminder(options: {
  medicineName: string;
  dosage?: string;
  hour: number;
  minute: number;
  data?: Record<string, unknown>;
}): Promise<string | null> {
  if (!notificationsSupported()) return null;
  try {
    return await Notifications.scheduleNotificationAsync({
      content: {
        title: 'Waktunya Minum Obat! 💊',
        body: `Jangan lupa minum ${options.medicineName}${options.dosage ? ` (${options.dosage})` : ''}`,
        sound: true,
        priority: Notifications.AndroidImportance.HIGH,
        data: options.data ?? {
          type: 'reminder',
          title: 'Waktunya Minum Obat! 💊',
          message: `Jangan lupa minum ${options.medicineName}`,
        },
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.CALENDAR,
        hour: options.hour,
        minute: options.minute,
        repeats: true,
      },
    });
  } catch {
    return null;
  }
}

export async function cancelAllScheduledNotifications(): Promise<void> {
  try {
    await Notifications.cancelAllScheduledNotificationsAsync();
  } catch {
    // no-op
  }
}

export async function cancelScheduledNotification(
  notificationId: string,
): Promise<void> {
  try {
    await Notifications.cancelScheduledNotificationAsync(notificationId);
  } catch {
    // no-op
  }
}

export type NotificationListener = (notification: {
  title: string;
  body: string;
  data: Record<string, unknown>;
}) => void;

export function addNotificationReceivedListener(
  listener: NotificationListener,
): { remove: () => void } {
  if (!notificationsSupported()) {
    return { remove: () => {} };
  }

  return Notifications.addNotificationReceivedListener((notification) => {
    const content = notification.request.content;
    listener({
      title: content.title ?? '',
      body: content.body ?? '',
      data: (content.data as Record<string, unknown>) ?? {},
    });
  });
}
