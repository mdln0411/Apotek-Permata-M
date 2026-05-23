import { API_BASE_URL } from '@/constants/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import Constants from 'expo-constants';

const axiosClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

axiosClient.interceptors.request.use(
  async (config) => {
    try {
      const token = await AsyncStorage.getItem('auth_token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (e) {
      console.error('Interceptor error:', e);
    }
    return config;
  },
  (error) => Promise.reject(error),
);

axiosClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.message === 'Network Error' && __DEV__) {
      console.error(
        `[API] Network Error → ${API_BASE_URL}\n` +
          `Expo hostUri: ${Constants.expoConfig?.hostUri ?? '?'}\n` +
          'Pastikan: (1) npm start / expo running\n' +
          '         (2) cd backend && php artisan serve --host=0.0.0.0 --port=8000\n' +
          '         (3) MySQL/XAMPP Start',
      );
    }
    return Promise.reject(error);
  },
);

if (__DEV__) {
  console.log('[API] Base URL:', API_BASE_URL);
  console.log('[API] Expo hostUri:', Constants.expoConfig?.hostUri ?? '?');
}

export default axiosClient;
