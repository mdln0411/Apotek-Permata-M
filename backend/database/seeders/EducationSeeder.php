<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class EducationSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        \App\Models\Education::create([
            'title' => 'Cara Menjaga Kesehatan Jantung',
            'content' => 'Menjaga kesehatan jantung sangat penting dengan cara berolahraga secara teratur dan makan makanan bergizi...',
            'category' => 'Tips Kesehatan',
            'author' => 'Dr. Budi Santoso',
            'image_url' => 'https://images.unsplash.com/photo-1505751172107-429697a73ec0?q=80&w=400'
        ]);

        \App\Models\Education::create([
            'title' => 'Pentingnya Vitamin C untuk Imunitas',
            'content' => 'Vitamin C membantu tubuh melawan infeksi dan mempercepat penyembuhan luka. Sumber terbaik adalah buah-buahan...',
            'category' => 'Nutrisi',
            'author' => 'Admin Apotek',
            'image_url' => 'https://images.unsplash.com/photo-1512069772995-ec65ed45afd6?q=80&w=400'
        ]);

        \App\Models\Education::create([
            'title' => 'Tips Menghadapi Gejala Flu',
            'content' => 'Saat flu menyerang, istirahat cukup dan hidrasi adalah kunci utama. Hindari kontak langsung dengan orang lain agar tidak menularkan. Gunakan masker dan konsumsi vitamin C.',
            'category' => 'Info Penyakit',
            'author' => 'Apotek Permata',
            'image_url' => 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?q=80&w=400'
        ]);

        \App\Models\Education::create([
            'title' => 'Mengenal Jenis-Jenis Antibiotik',
            'content' => 'Antibiotik adalah obat untuk melawan infeksi bakteri. Penting untuk menghabiskan dosis yang diberikan dokter agar bakteri tidak menjadi kebal (resistensi).',
            'category' => 'Edukasi Obat',
            'author' => 'Apoteker Sari',
            'image_url' => 'https://images.unsplash.com/photo-1587854692152-cbe660dbbb88?q=80&w=400'
        ]);

        \App\Models\Education::create([
            'title' => 'Cara Simpan Obat yang Benar',
            'content' => 'Simpan obat di tempat yang sejuk, kering, dan jauh dari sinar matahari langsung. Jangan mencampur obat dalam satu wadah dan jauhkan dari jangkauan anak-anak.',
            'category' => 'Tips',
            'author' => 'Admin Apotek',
            'image_url' => 'https://images.unsplash.com/photo-1471864190281-ad5f9f8162e6?q=80&w=400'
        ]);

        \App\Models\Education::create([
            'title' => 'Bahaya Konsumsi Obat Tanpa Resep',
            'content' => 'Beberapa obat keras memiliki efek samping serius jika dosisnya tidak tepat. Selalu konsultasikan dengan apoteker atau dokter sebelum membeli obat keras.',
            'category' => 'Peringatan',
            'author' => 'Dr. Andi',
            'image_url' => 'https://images.unsplash.com/photo-1550572017-ed200155735e?q=80&w=400'
        ]);
    }
}
