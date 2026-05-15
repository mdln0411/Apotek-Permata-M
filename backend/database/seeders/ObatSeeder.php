<?php

namespace Database\Seeders;

use App\Models\Obat;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\File;

class ObatSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Path ke file CSV di luar folder backend
        $csvFile = base_path('../data obat final.csv');
        
        if (!File::exists($csvFile)) {
            $this->command->error("File tidak ditemukan di: $csvFile");
            return;
        }

        $file = fopen($csvFile, "r");
        $header = true;

        while (($data = fgetcsv($file, 2000, ";")) !== FALSE) {
            if ($header) {
                $header = false;
                continue;
            }

            // Map data sesuai dengan header:
            // id_obat;nama_obat;kategori_penyakit;indikasi;satuan_tersedia;harga_mulai;harga_detail;aturan_pemakaian;dosis;efek_samping;interaksi_obat;jangka_waktu_penggunaan;komposisi;kontra_indikasi;stok;image
            
            Obat::create([
                'id_obat' => $data[0] ?? null,
                'nama_obat' => $data[1] ?? null,
                'kategori_penyakit' => $data[2] ?? null,
                'indikasi' => $data[3] ?? null,
                'satuan_tersedia' => $data[4] ?? null,
                'harga_mulai' => $data[5] ?? null,
                'harga_detail' => $data[6] ?? null,
                'aturan_pemakaian' => $data[7] ?? null,
                'dosis' => $data[8] ?? null,
                'efek_samping' => $data[9] ?? null,
                'interaksi_obat' => $data[10] ?? null,
                'jangka_waktu_penggunaan' => $data[11] ?? null,
                'komposisi' => $data[12] ?? null,
                'kontra_indikasi' => $data[13] ?? null,
                'stok' => (int)($data[14] ?? 0),
                'image' => $data[15] ?? null,
            ]);
        }

        fclose($file);
        
        $this->command->info("Data obat berhasil di-import!");
    }
}
