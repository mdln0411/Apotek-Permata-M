import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { User, getMe } from '../api/authService';
import axiosClient from '../api/axiosClient';

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (user: User, token: string) => Promise<void>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
  updateUser: (userData: User) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStoredAuth();
  }, []);

  const loadStoredAuth = async () => {
    try {
      const storedToken = await AsyncStorage.getItem('auth_token');
      const storedUser = await AsyncStorage.getItem('auth_user');

      if (storedToken && storedUser) {
        setToken(storedToken);
        setUser(JSON.parse(storedUser));
        
        axiosClient.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`;
        
        try {
          const res = await getMe();
          setUser(res.data);
          await AsyncStorage.setItem('auth_user', JSON.stringify(res.data));
        } catch (e) {
          // Token expired, logout instan
          setToken(null);
          setUser(null);
          await AsyncStorage.removeItem('auth_token');
          await AsyncStorage.removeItem('auth_user');
        }
      }
    } catch (e) {
      console.error('Failed to load auth', e);
    } finally {
      setLoading(false);
    }
  };

  const login = async (userData: User, userToken: string) => {
    setToken(userToken);
    setUser(userData);
    axiosClient.defaults.headers.common['Authorization'] = `Bearer ${userToken}`;
    
    await AsyncStorage.setItem('auth_token', userToken);
    await AsyncStorage.setItem('auth_user', JSON.stringify(userData));
  };

  const logout = async () => {
    // 1. Simpan token sementara untuk API call
    const currentToken = token;

    // 2. Hapus data lokal secara INSTAN (UI langsung berubah)
    setToken(null);
    setUser(null);
    delete axiosClient.defaults.headers.common['Authorization'];
    await AsyncStorage.removeItem('auth_token');
    await AsyncStorage.removeItem('auth_user');

    // 3. Beritahu server di latar belakang (tidak ditunggu/await agar tidak hang)
    if (currentToken) {
      axiosClient.post('/api/logout').catch(err => {
        console.log('Server logout failed, but local session is cleared', err);
      });
    }
  };

  const checkAuth = async () => {
    await loadStoredAuth();
  };

  const updateUser = async (userData: User) => {
    setUser(userData);
    await AsyncStorage.setItem('auth_user', JSON.stringify(userData));
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, logout, checkAuth, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
