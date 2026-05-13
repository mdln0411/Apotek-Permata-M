import { Medicine, Prescription, PendingOrder } from '../types';

export const medicinesData: Medicine[] = [
  { id: 1, name: 'Paracetamol', dosage: '500mg', category: 'Pain Relief', stock: 150, isPrescription: false },
  { id: 2, name: 'Amoxicillin', dosage: '500mg', category: 'Antibiotics', stock: 80, isPrescription: true },
  { id: 3, name: 'Vitamin C', dosage: '1000mg', category: 'Vitamins', stock: 200, isPrescription: false },
  { id: 4, name: 'Ibuprofen', dosage: '400mg', category: 'Pain Relief', stock: 120, isPrescription: false },
  { id: 5, name: 'Omeprazole', dosage: '20mg', category: 'Digestive', stock: 90, isPrescription: true },
  { id: 6, name: 'Multivitamin Complete', dosage: '', category: 'Vitamins', stock: 180, isPrescription: false },
];

export const prescriptionsData: Prescription[] = [
  { id: 'ORD-004', doctor: 'Medelain', date: '2026-04-08', time: '11:15', medicine: 'Amoxicillin 500mg', quantity: 1, status: 'Menunggu' },
  { id: 'ORD-006', doctor: 'HolsBam', date: '2026-04-08', time: '13:30', medicine: 'Omeprazole 20mg', quantity: 2, status: 'Menunggu' },
];

export const pendingOrdersData: PendingOrder[] = [
  { id: 'ORD-003', customer: 'Medelain', items: 2, date: '2026-04-08', time: '10:30', status: 'Proses', type: 'order' },
  { id: 'ORD-004', customer: 'Yarlin Kun', items: 1, date: '2026-04-08', time: '11:15', status: 'Resep', type: 'prescription' },
  { id: 'ORD-005', customer: 'Sitorus', items: 3, date: '2026-04-08', time: '12:00', status: 'Proses', type: 'order' },
];