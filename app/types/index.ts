export interface Medicine {
  id: number;
  name: string;
  dosage: string;
  category: string;
  stock: number;
  isPrescription: boolean;
}

export interface Prescription {
  id: string;
  doctor: string;
  date: string;
  time: string;
  medicine: string;
  quantity: number;
  status: 'Menunggu' | 'Divalidasi';
}

export interface PendingOrder {
  id: string;
  customer: string;
  items: number;
  date: string;
  time: string;
  status: 'Proses' | 'Resep' | 'Menunggu';
  type: 'order' | 'prescription';
}