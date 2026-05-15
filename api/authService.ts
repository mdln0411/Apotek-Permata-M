import axiosClient from './axiosClient';

export interface User {
  id: number;
  name: string;
  email: string;
  role: 'member' | 'apoteker' | 'admin';
  phone?: string;
  address?: string;
}

export interface AuthResponse {
  status: string;
  message: string;
  data: User;
  access_token: string;
  token_type: string;
}

export const login = async (data: any): Promise<AuthResponse> => {
  const response = await axiosClient.post('/api/auth/login', data);
  return response.data;
};

export const register = async (data: any): Promise<AuthResponse> => {
  const response = await axiosClient.post('/api/auth/register', data);
  return response.data;
};

export const logout = async (): Promise<any> => {
  const response = await axiosClient.post('/api/auth/logout');
  return response.data;
};

export const getMe = async (): Promise<{ status: string; data: User }> => {
  const response = await axiosClient.get('/api/auth/me');
  return response.data;
};
