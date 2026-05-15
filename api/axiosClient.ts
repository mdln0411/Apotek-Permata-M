import axios from 'axios';
import { Platform } from 'react-native';

// Port 8000 = Laravel API
// Emulator Android pakai 10.0.2.2, iOS/Web pakai localhost
const BASE_URL =
  Platform.OS === 'android'
    ? 'http://10.0.2.2:8000'
    : 'http://localhost:8000';

const axiosClient = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

export default axiosClient;
