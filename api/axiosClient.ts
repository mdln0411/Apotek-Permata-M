import { getApiBaseUrl, getApiBaseUrlCandidates } from '@/constants/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios, { type AxiosError, type InternalAxiosRequestConfig } from 'axios';
import Constants from 'expo-constants';

type RetryConfig = InternalAxiosRequestConfig & {
  _apiUrlRetryIndex?: number;
};

const axiosClient = axios.create({
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

axiosClient.interceptors.request.use(
  async (config: RetryConfig) => {
    const candidates = getApiBaseUrlCandidates();
    const retryIndex = config._apiUrlRetryIndex ?? 0;
    config.baseURL = candidates[retryIndex] ?? getApiBaseUrl();

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
  async (error: AxiosError) => {
    const config = error.config as RetryConfig | undefined;
    const candidates = getApiBaseUrlCandidates();

    if (
      config &&
      !error.response &&
      error.message === 'Network Error' &&
      __DEV__ &&
      candidates.length > 1
    ) {
      const nextIndex = (config._apiUrlRetryIndex ?? 0) + 1;
      if (nextIndex < candidates.length) {
        console.warn(
          `[API] Gagal ke ${config.baseURL}, mencoba ${candidates[nextIndex]} ...`,
        );
        return axiosClient.request({
          ...config,
          _apiUrlRetryIndex: nextIndex,
        });
      }
    }

    if (error.message === 'Network Error' && __DEV__) {
      console.error(
        `[API] Network Error — sudah dicoba: ${candidates.join(' → ')}\n` +
          `Expo hostUri: ${Constants.expoConfig?.hostUri ?? '?'}\n` +
          'Pastikan: (1) npm start / expo running\n' +
          '         (2) cd backend; php artisan serve --host=0.0.0.0 --port=8000\n' +
          '         (3) MySQL/XAMPP Start\n' +
          '         (4) HP & laptop satu Wi-Fi',
      );
    }
    return Promise.reject(error);
  },
);

if (__DEV__) {
  console.log('[API] Kandidat URL:', getApiBaseUrlCandidates().join(' | '));
  console.log('[API] Expo hostUri:', Constants.expoConfig?.hostUri ?? '?');
}

export default axiosClient;
