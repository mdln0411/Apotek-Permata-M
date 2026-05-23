import axiosClient from './axiosClient';

export interface User {
  id: number;
  name: string;
  email: string;
  role: 'member' | 'apoteker' | 'admin';
  phone?: string;
  address?: string;
  profile_photo?: string;
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

export const updateProfile = async (formData: FormData): Promise<{ status: string; message: string; data: User }> => {
  const response = await axiosClient.post('/api/auth/profile', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

export interface ChangePasswordPayload {
  old_password: string;
  new_password: string;
  new_password_confirmation: string;
}

export const changePassword = async (
  data: ChangePasswordPayload
): Promise<{ status: string; message: string }> => {
  const response = await axiosClient.post('/api/auth/change-password', data);
  return response.data;
};
