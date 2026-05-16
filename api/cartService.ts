import axiosClient from './axiosClient';

export interface CartItem {
  id: number;
  medicine_id: number;
  name: string;
  price: number;
  price_formatted: string;
  quantity: number;
  subtotal: number;
  subtotal_formatted: string;
  image_url: string | null;
  category: string;
  unit: string | null;
  stock: number;
}

export interface CartResponse {
  status: string;
  data: CartItem[];
  total_price: number;
  total_price_formatted: string;
}

export const getCart = async (): Promise<CartResponse> => {
  const response = await axiosClient.get('/api/cart');
  return response.data;
};

export const addToCart = async (medicine_id: number, quantity: number = 1): Promise<any> => {
  const response = await axiosClient.post('/api/cart', { medicine_id, quantity });
  return response.data;
};

export const updateCartQty = async (id: number, quantity: number): Promise<any> => {
  const response = await axiosClient.put(`/api/cart/${id}`, { quantity });
  return response.data;
};

export const removeFromCart = async (id: number): Promise<any> => {
  const response = await axiosClient.delete(`/api/cart/${id}`);
  return response.data;
};
