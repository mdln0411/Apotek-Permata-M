import { Alert, Platform } from 'react-native';

/** Alert yang berfungsi di native dan web */
export function showAppAlert(
  title: string,
  message: string,
  onOk?: () => void,
) {
  if (Platform.OS === 'web') {
    window.alert(`${title}\n\n${message}`);
    onOk?.();
    return;
  }
  Alert.alert(title, message, onOk ? [{ text: 'OK', onPress: onOk }] : undefined);
}
