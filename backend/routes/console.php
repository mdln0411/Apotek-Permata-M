<?php

use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\Artisan;
use App\Services\MedicineVariantService;

Artisan::command('medicines:split-variants', function () {
    $service = app(MedicineVariantService::class);
    $split = $service->splitAll();
    $repaired = $service->repairDoubleSizeNames();
    $this->info("Selesai. {$split} baris diproses, {$repaired} nama diperbaiki.");
})->purpose('Pisahkan obat multi-varian (mis. Cair 30 Ml & 60 Ml) menjadi baris terpisah');
