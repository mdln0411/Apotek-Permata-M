<?php

use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\Artisan;
use App\Services\MedicineVariantService;
use App\Services\MedicineDedupService;

Artisan::command('medicines:split-variants', function () {
    $service = app(MedicineVariantService::class);
    $split = $service->splitAll();
    $repaired = $service->repairDoubleSizeNames();
    $dedup = app(MedicineDedupService::class)->deduplicate();
    $this->info("Selesai. {$split} baris diproses, {$repaired} nama diperbaiki, {$dedup['removed']} duplikat dihapus.");
})->purpose('Pisahkan obat multi-varian (mis. Cair 30 Ml & 60 Ml) menjadi baris terpisah');

Artisan::command('medicines:deduplicate', function () {
    $result = app(MedicineDedupService::class)->deduplicate();
    $this->info("Selesai. {$result['groups']} grup duplikat, {$result['removed']} obat dinonaktifkan.");
})->purpose('Hapus obat duplikat (nama tampilan + satuan + kategori sama)');
