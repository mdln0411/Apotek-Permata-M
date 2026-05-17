<?php

namespace Database\Seeders;

use App\Models\Medicine;
use Illuminate\Database\Seeder;

class ManualMedicineSeeder extends Seeder
{
    public function run(): void
    {
        $medicines = [
            // --- DEMAM ---
            [
                'name' => 'Sanmol Tablet',
                'category' => 'Demam',
                'indication' => 'Meredakan demam dan nyeri ringan sampai sedang',
                'unit' => 'Strip',
                'price' => 15000,
                'price_detail' => 'Rp 15.000 / Strip',
                'stock' => 100,
                'usage_rules' => 'Sesudah makan',
                'dosage' => 'Dewasa: 1-2 tablet, 3-4 kali sehari',
                'composition' => 'Paracetamol 500mg',
                'image_url' => 'https://images.tokopedia.net/img/cache/700/VqbcmM/2021/6/15/8e0b1d3a-6f4e-4f7f-8e5a-1b4d3e8f8e5a.jpg',
                'prescription_required' => false
            ],
            [
                'name' => 'Proris Sirup',
                'category' => 'Demam',
                'indication' => 'Menurunkan demam dan meredakan nyeri pada anak',
                'unit' => 'Botol',
                'price' => 35000,
                'price_detail' => 'Rp 35.000 / Botol',
                'stock' => 50,
                'usage_rules' => 'Sesudah makan',
                'dosage' => 'Anak 1-12 tahun sesuai anjuran berat badan',
                'composition' => 'Ibuprofen 100mg/5ml',
                'image_url' => 'https://images.tokopedia.net/img/cache/700/VqbcmM/2022/9/15/8e0b1d3a-6f4e-4f7f-8e5a-1b4d3e8f8e5a.jpg',
                'prescription_required' => false
            ],
            [
                'name' => 'Panadol Extra',
                'category' => 'Demam',
                'indication' => 'Meredakan sakit kepala dan demam yang disertai nyeri otot',
                'unit' => 'Strip',
                'price' => 12500,
                'price_detail' => 'Rp 12.500 / Strip',
                'stock' => 80,
                'usage_rules' => 'Sesudah makan',
                'dosage' => 'Dewasa: 1 tablet, 3-4 kali sehari',
                'composition' => 'Paracetamol 500mg, Caffeine 65mg',
                'image_url' => 'https://images.tokopedia.net/img/cache/700/VqbcmM/2021/3/15/8e0b1d3a-6f4e-4f7f-8e5a-1b4d3e8f8e5a.jpg',
                'prescription_required' => false
            ],

            // --- VITAMIN ---
            [
                'name' => 'Enervon-C',
                'category' => 'Vitamin',
                'indication' => 'Membantu menjaga daya tahan tubuh',
                'unit' => 'Strip',
                'price' => 8000,
                'price_detail' => 'Rp 8.000 / Strip',
                'stock' => 200,
                'usage_rules' => 'Sesudah makan',
                'dosage' => '1 tablet sehari',
                'composition' => 'Vitamin C 500mg, Vitamin B Kompleks',
                'image_url' => 'https://images.tokopedia.net/img/cache/700/VqbcmM/2021/2/15/8e0b1d3a-6f4e-4f7f-8e5a-1b4d3e8f8e5a.jpg',
                'prescription_required' => false
            ],
            [
                'name' => 'Imboost Force',
                'category' => 'Vitamin',
                'indication' => 'Membantu memelihara daya tahan tubuh dan mempercepat penyembuhan',
                'unit' => 'Strip',
                'price' => 75000,
                'price_detail' => 'Rp 75.000 / Strip',
                'stock' => 40,
                'usage_rules' => 'Sesudah makan',
                'dosage' => '1 tablet, 3 kali sehari',
                'composition' => 'Echinacea purpurea 250mg, Black Elderberry 400mg, Zinc Picolinate 10mg',
                'image_url' => 'https://images.tokopedia.net/img/cache/700/VqbcmM/2021/1/15/8e0b1d3a-6f4e-4f7f-8e5a-1b4d3e8f8e5a.jpg',
                'prescription_required' => false
            ],
            [
                'name' => 'Vitamin C IPI',
                'category' => 'Vitamin',
                'indication' => 'Memenuhi kebutuhan vitamin C harian',
                'unit' => 'Pot',
                'price' => 6000,
                'price_detail' => 'Rp 6.000 / Pot',
                'stock' => 150,
                'usage_rules' => 'Sesudah makan',
                'dosage' => '1-2 tablet sehari',
                'composition' => 'Vitamin C 50mg',
                'image_url' => 'https://images.tokopedia.net/img/cache/700/VqbcmM/2021/5/15/8e0b1d3a-6f4e-4f7f-8e5a-1b4d3e8f8e5a.jpg',
                'prescription_required' => false
            ],

            // --- P3K ---
            [
                'name' => 'Betadine Antiseptic Solution',
                'category' => 'P3K',
                'indication' => 'Cairan antiseptik untuk luka luar',
                'unit' => 'Botol',
                'price' => 15000,
                'price_detail' => 'Rp 15.000 / Botol',
                'stock' => 60,
                'usage_rules' => 'Oleskan pada bagian yang luka',
                'dosage' => 'Sesuai kebutuhan',
                'composition' => 'Povidone-Iodine 10%',
                'image_url' => 'https://images.tokopedia.net/img/cache/700/VqbcmM/2021/7/15/8e0b1d3a-6f4e-4f7f-8e5a-1b4d3e8f8e5a.jpg',
                'prescription_required' => false
            ],
            [
                'name' => 'Hansaplast Kain Elastis',
                'category' => 'P3K',
                'indication' => 'Plester luka untuk melindungi dari kuman',
                'unit' => 'Sachet',
                'price' => 5000,
                'price_detail' => 'Rp 5.000 / Sachet',
                'stock' => 300,
                'usage_rules' => 'Tutup luka yang sudah dibersihkan',
                'dosage' => 'Sesuai kebutuhan',
                'composition' => 'Kain elastis, antiseptik',
                'image_url' => 'https://images.tokopedia.net/img/cache/700/VqbcmM/2021/8/15/8e0b1d3a-6f4e-4f7f-8e5a-1b4d3e8f8e5a.jpg',
                'prescription_required' => false
            ],
            [
                'name' => 'Alkohol 70% 100ml',
                'category' => 'P3K',
                'indication' => 'Antiseptik dan disinfektan luar',
                'unit' => 'Botol',
                'price' => 10000,
                'price_detail' => 'Rp 10.000 / Botol',
                'stock' => 100,
                'usage_rules' => 'Gunakan dengan kapas untuk membersihkan area',
                'dosage' => 'Sesuai kebutuhan',
                'composition' => 'Ethyl Alcohol 70%',
                'image_url' => 'https://images.tokopedia.net/img/cache/700/VqbcmM/2021/9/15/8e0b1d3a-6f4e-4f7f-8e5a-1b4d3e8f8e5a.jpg',
                'prescription_required' => false
            ],
        ];

        foreach ($medicines as $med) {
            Medicine::updateOrCreate(
                ['name' => $med['name']],
                $med
            );
        }
    }
}
