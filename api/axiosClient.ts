import axios from 'axios';
import { Platform } from 'react-native';

let BASE_URL = 'http://192.168.100.222:8000';
if (Platform.OS === 'android') {
  BASE_URL = 'http://192.168.100.222:8000';
}
// Note: Jika di HP fisik, ganti localhost dengan IP lokal komputer (misal: 192.168.1.x)
import AsyncStorage from '@react-native-async-storage/async-storage';

const axiosClient = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

// Tambahkan interceptor untuk menyisipkan token ke setiap request
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
  (error) => {
    return Promise.reject(error);
  }
);

export default axiosClient;
