<?php

namespace Database\Seeders;

use App\Models\Medicine;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\File;

class MedicineSeeder extends Seeder
{
    /**
     * Import data obat dari file CSV ke tabel medicines.
     *
     * Mapping kolom CSV (separator ;) :
     * [0] id_obat | [1] nama_obat | [2] kategori_penyakit | [3] indikasi
     * [4] satuan_tersedia | [5] harga_mulai | [6] harga_detail
     * [7] aturan_pemakaian | [8] dosis | [9] efek_samping
     * [10] interaksi_obat | [11] jangka_waktu_penggunaan
     * [12] komposisi | [13] kontra_indikasi | [14] stok | [15] image
     */
    public function run(): void
    {
        // Kosongkan tabel dulu agar tidak duplikat saat re-seed
        \Illuminate\Support\Facades\DB::statement('SET FOREIGN_KEY_CHECKS=0;');
        Medicine::truncate();
        \Illuminate\Support\Facades\DB::statement('SET FOREIGN_KEY_CHECKS=1;');

        // Path file CSV (berada di root project, satu level di atas folder backend)
        $csvPath = base_path('../data obat final.csv');

        if (!File::exists($csvPath)) {
            $this->command->error("❌ File CSV tidak ditemukan di: $csvPath");
            $this->command->info("Pastikan file 'data obat final.csv' ada di: " . dirname($csvPath));
            return;
        }

        $handle = fopen($csvPath, 'r');
        if (!$handle) {
            $this->command->error("❌ Gagal membuka file CSV.");
            return;
        }

        $isHeader    = true;
        $importCount = 0;
        $skipCount   = 0;

        while (($row = fgetcsv($handle, 5000, ';')) !== false) {
            // Lewati baris header
            if ($isHeader) {
                $isHeader = false;
                continue;
            }

            // Pastikan row punya minimal 14 kolom
            if (count($row) < 14) {
                $skipCount++;
                continue;
            }

            // Bersihkan dan ambil nilai tiap kolom
            $namaObat    = trim($row[1] ?? '');
            $kategori    = trim($row[2] ?? '');
            $hargaMulai  = (int) preg_replace('/[^0-9]/', '', trim($row[5] ?? '0'));
            $stok        = (int) trim($row[14] ?? '0');

            // Skip jika tidak ada nama obat
            if (empty($namaObat)) {
                $skipCount++;
                continue;
            }

            // Tentukan apakah perlu resep
            $perluResep = $this->determinesPrescription($namaObat, $kategori);

            // Split satuan_tersedia (kolom 4) dan harga_detail (kolom 6)
            $satuanRaw = $this->cleanText($row[4] ?? '');
            $units = array_map('trim', explode(',', $satuanRaw ?? ''));
            $units = array_filter($units);

            // Parse pemetaan harga detail
            $priceMap = [];
            $priceDetailStr = $this->cleanText($row[6] ?? '');
            if (!empty($priceDetailStr)) {
                $parts = explode(';', $priceDetailStr);
                foreach ($parts as $part) {
                    $kv = explode(':', $part);
                    if (count($kv) === 2) {
                        $u = trim($kv[0]);
                        $p = (int) preg_replace('/[^0-9]/', '', $kv[1]);
                        $priceMap[strtolower($u)] = $p;
                    }
                }
            }

            // Cek apakah produk merupakan sirup atau cairan
            $isLiquid = false;
            $nameLower = strtolower($namaObat);
            $liquidKeywords = ['cair', 'sirup', 'suspensi', 'elixir', 'drop', 'ml', 'syrup', 'liquid'];
            foreach ($liquidKeywords as $keyword) {
                if (str_contains($nameLower, $keyword)) {
                    $isLiquid = true;
                    break;
                }
            }
            if (!$isLiquid) {
                foreach ($units as $u) {
                    if (str_contains(strtolower($u), 'ml') || str_contains(strtolower($u), 'cair')) {
                        $isLiquid = true;
                        break;
                    }
                }
            }

            if ($isLiquid && count($units) > 1) {
                // Split cairan/sirup menjadi baris obat terpisah!
                foreach ($units as $u) {
                    $unitPrice = $priceMap[strtolower($u)] ?? $hargaMulai;
                    
                    // Bersihkan nama unit agar tidak duplikat di nama obat
                    $cleanUnit = trim(str_replace('Cair', '', $u));
                    $newName = $namaObat;
                    if (!str_contains(strtolower($namaObat), strtolower($cleanUnit))) {
                        $newName = $namaObat . ' ' . $cleanUnit;
                    }

                    $baseUnit = \App\Services\MedicineUnitService::displayUnit($u);

                    Medicine::create([
                        'name'                  => trim($newName),
                        'category'              => $kategori ?: 'Umum',
                        'indication'            => $this->cleanText($row[3] ?? null),
                        'unit'                  => $baseUnit,
                        'price'                 => $unitPrice,
                        'price_detail'          => $baseUnit . ': Rp ' . number_format($unitPrice, 0, ',', '.'),
                        'stock'                 => $stok > 0 ? $stok : rand(10, 100),
                        'usage_rules'           => $this->cleanText($row[7] ?? null),
                        'dosage'                => $this->cleanText($row[8] ?? null),
                        'side_effects'          => $this->cleanText($row[9] ?? null),
                        'interactions'          => $this->cleanText($row[10] ?? null),
                        'usage_duration'        => $this->cleanText($row[11] ?? null),
                        'composition'           => $this->cleanText($row[12] ?? null),
                        'contraindications'     => $this->cleanText($row[13] ?? null),
                        'image_url'             => $this->cleanText($row[15] ?? null),
                        'prescription_required' => $perluResep,
                    ]);
                    $importCount++;
                }
            } else {
                // Obat padat atau cairan dengan kemasan tunggal - Simpan kemasan pertama saja
                $primaryUnit = $units[0] ?? 'Pcs';
                $unitPrice = $priceMap[strtolower($primaryUnit)] ?? $hargaMulai;
                $baseUnit = \App\Services\MedicineUnitService::displayUnit($primaryUnit);
                $displayName = \App\Services\MedicineUnitService::displayName($namaObat, $primaryUnit);

                Medicine::create([
                    'name'                  => $displayName,
                    'category'              => $kategori ?: 'Umum',
                    'indication'            => $this->cleanText($row[3] ?? null),
                    'unit'                  => $baseUnit,
                    'price'                 => $unitPrice,
                    'price_detail'          => $baseUnit . ': Rp ' . number_format($unitPrice, 0, ',', '.'),
                    'stock'                 => $stok > 0 ? $stok : rand(10, 100),
                    'usage_rules'           => $this->cleanText($row[7] ?? null),
                    'dosage'                => $this->cleanText($row[8] ?? null),
                    'side_effects'          => $this->cleanText($row[9] ?? null),
                    'interactions'          => $this->cleanText($row[10] ?? null),
                    'usage_duration'        => $this->cleanText($row[11] ?? null),
                    'composition'           => $this->cleanText($row[12] ?? null),
                    'contraindications'     => $this->cleanText($row[13] ?? null),
                    'image_url'             => $this->cleanText($row[15] ?? null),
                    'prescription_required' => $perluResep,
                ]);
                $importCount++;
            }
        }

        fclose($handle);

        $this->command->info("✅ Berhasil import $importCount data obat.");
        if ($skipCount > 0) {
            $this->command->warn("⚠️  $skipCount baris dilewati (kosong/tidak valid).");
        }
    }

    /**
     * Bersihkan teks dari whitespace berlebih dan karakter tidak valid.
     * Konversi encoding ke UTF-8 yang valid untuk MySQL.
     */
    private function cleanText(?string $text): ?string
    {
        if ($text === null || trim($text) === '') {
            return null;
        }

        // Deteksi dan konversi encoding ke UTF-8
        $encoding = mb_detect_encoding($text, ['UTF-8', 'ISO-8859-1', 'Windows-1252'], true);
        if ($encoding && $encoding !== 'UTF-8') {
            $text = mb_convert_encoding($text, 'UTF-8', $encoding);
        }

        // Ganti karakter ½ (pecahan) dengan "1/2" agar aman di MySQL
        $text = str_replace(["\xBD", "\xBC", "\xBE"], ['1/2', '1/4', '3/4'], $text);

        // Buang karakter non-UTF-8 yang tersisa
        $text = mb_convert_encoding($text, 'UTF-8', 'UTF-8');

        // Hapus spasi berlebih dan newline
        return preg_replace('/\s+/', ' ', trim($text));
    }

    /**
     * Tentukan apakah obat perlu resep berdasarkan nama / kategori.
     * Ini hanya estimasi sederhana, bisa diupdate manual.
     */
    private function determinesPrescription(string $nama, string $kategori): bool
    {
        $namaLower = strtolower($nama);

        // Antibiotik biasanya perlu resep
        $keywordsResep = ['amoxicillin', 'amoksisilin', 'antibiotic', 'antibiotik', 'ciprofloxacin', 'azithromycin'];

        foreach ($keywordsResep as $keyword) {
            if (str_contains($namaLower, $keyword)) {
                return true;
            }
        }

        return false;
    }
}
