import axiosClient from './axiosClient';

/** Tipe data untuk list katalog (ringkas) */
export interface MedicineListItem {
  id: number;
  name: string;
  category: string;
  unit: string | null;
  price: number;
  price_formatted: string;
  stock: number;
  image_url: string | null;
  prescription_required: boolean;
}

/** Tipe data untuk detail lengkap */
export interface MedicineDetail extends MedicineListItem {
  indication: string | null;
  price_detail: string | null;
  usage_rules: string | null;
  dosage: string | null;
  side_effects: string | null;
  interactions: string | null;
  usage_duration: string | null;
  composition: string | null;
  contraindications: string | null;
  created_at: string;
  updated_at: string;
}

export interface MedicineListResponse {
  status: string;
  message: string;
  data: MedicineListItem[];
  pagination: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    has_more: boolean;
  };
}

/** Ambil list katalog obat dengan opsi search, filter, dan pagination */
export const getMedicines = async (params?: {
  search?: string;
  category?: string;
  page?: number;
  per_page?: number;
}): Promise<MedicineListResponse> => {
  const response = await axiosClient.get('/api/medicines', { params });
  return response.data;
};

/** Ambil detail satu obat berdasarkan ID */
export const getMedicineDetail = async (id: number): Promise<{ status: string; data: MedicineDetail }> => {
  const response = await axiosClient.get(`/api/medicines/${id}`);
  return response.data;
};

/** Ambil semua kategori unik */
export const getMedicineCategories = async (): Promise<{ status: string; data: string[] }> => {
  const response = await axiosClient.get('/api/medicines/categories');
  return response.data;
};

/** Hapus obat dari katalog (soft delete di backend) */
export const deleteMedicine = async (id: number): Promise<{ status: string; message: string }> => {
  const response = await axiosClient.delete(`/api/medicines/${id}`);
  return response.data;
};

/** Ambil daftar satuan unik dari database */
export const getMedicineUnits = async (): Promise<{ status: string; data: string[] }> => {
  const response = await axiosClient.get('/api/medicines/units');
  return response.data;
};

/** Ambil daftar nama obat unik untuk simulasi */
export const getSimulationMedicines = async (): Promise<{ status: string; data: string[] }> => {
  const response = await axiosClient.get('/api/simulasi-obat/list');
  return response.data;
};

/** Tipe data hasil cek interaksi obat */
export interface SimulationCheckResult {
  status: string;
  found: boolean;
  data: {
    obat1: string;
    obat2: string;
    simulasi: string;
  };
}

/** Cek interaksi antara dua obat */
export const checkSimulationInteraction = async (obat1: string, obat2: string): Promise<SimulationCheckResult> => {
  const response = await axiosClient.get('/api/simulasi-obat/check', {
    params: { obat1, obat2 }
  });
  return response.data;
};

