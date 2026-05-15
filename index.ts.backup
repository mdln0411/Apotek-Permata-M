import { registerRootComponent } from 'expo';
import { Platform } from 'react-native';
import App from './App';

// On web, force the root element to be full width
if (Platform.OS === 'web') {
  const style = document.createElement('style');
  style.textContent = `
    html, body { width: 100%; height: 100%; margin: 0; padding: 0; overflow: hidden; }
    #root { width: 100% !important; max-width: 100% !important; height: 100vh; display: flex; flex-direction: column; }
    /* Remove Expo's default mobile frame on web */
    #root > div { width: 100% !important; max-width: none !important; }
  `;
  document.head.appendChild(style);
}

// registerRootComponent calls AppRegistry.registerComponent('main', () => App);
// It also ensures that whether you load the app in Expo Go or in a native build,
// the environment is set up appropriately
registerRootComponent(App);
