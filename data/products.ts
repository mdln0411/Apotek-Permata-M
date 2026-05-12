export type Product = {
  id: string;
  name: string;
  category: string;
  price: string;
  stock: number;
  image: string;
  requiresPrescription: boolean;
};

export const products: Product[] = [
  {
    id: '1',
    name: 'Paracetamol 500m',
    category: 'Pain Relief',
    price: 'Rp 15.000',
    stock: 150,
    image: 'https://images.unsplash.com/photo-1584308666744-24d5e4a8334e?q=80&w=400&auto=format&fit=crop',
    requiresPrescription: false,
  },
  {
    id: '2',
    name: 'Amoxicillin 500mg',
    category: 'Antibiotics',
    price: 'Rp 45.000',
    stock: 80,
    image: 'https://images.unsplash.com/photo-1587840170866-5c5c78e6b5a1?q=80&w=400&auto=format&fit=crop',
    requiresPrescription: true,
  },
  {
    id: '3',
    name: 'Vitamin C 1000m',
    category: 'Vitamins',
    price: 'Rp 35.000',
    stock: 200,
    image: 'https://images.unsplash.com/photo-1611102637744-2d89c4f0a3c8?q=80&w=400&auto=format&fit=crop',
    requiresPrescription: false,
  },
  {
    id: '4',
    name: 'Ibuprofen 400mg',
    category: 'Pain Relief',
    price: 'Rp 25.000',
    stock: 120,
    image: 'https://images.unsplash.com/photo-1587732637614-4b3e2a0e5f5e?q=80&w=400&auto=format&fit=crop',
    requiresPrescription: false,
  },
  {
    id: '5',
    name: 'Omeprazole 20mg',
    category: 'Digestive',
    price: 'Rp 55.000',
    stock: 90,
    image: 'https://images.unsplash.com/photo-1628771065518-0d82f1938462?q=80&w=400&auto=format&fit=crop',
    requiresPrescription: true,
  },
  {
    id: '6',
    name: 'Multivitamin Complete',
    category: 'Vitamins',
    price: 'Rp 65.000',
    stock: 180,
    image: 'https://images.unsplash.com/photo-1550572017-edb4cbdbf170?q=80&w=400&auto=format&fit=crop',
    requiresPrescription: false,
  },
];
