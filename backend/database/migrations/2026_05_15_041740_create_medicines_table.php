<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('medicines', function (Blueprint $table) {
            $table->id();
            $table->string('name');                          // Nama obat
            $table->string('category');                      // Kategori penyakit (Lambung, Batuk, Flu, dll)
            $table->text('indication')->nullable();          // Indikasi / fungsi obat
            $table->string('unit')->nullable();              // Satuan tersedia (Strip, Box, Pcs, Cair, dll)
            $table->unsignedBigInteger('price')->default(0); // Harga mulai (dalam rupiah)
            $table->string('price_detail')->nullable();      // Detail harga per satuan
            $table->integer('stock')->default(0);            // Stok obat
            $table->text('usage_rules')->nullable();         // Aturan pemakaian
            $table->text('dosage')->nullable();              // Dosis
            $table->text('side_effects')->nullable();        // Efek samping
            $table->text('interactions')->nullable();        // Interaksi obat
            $table->text('usage_duration')->nullable();      // Jangka waktu penggunaan
            $table->text('composition')->nullable();         // Komposisi
            $table->text('contraindications')->nullable();   // Kontraindikasi
            $table->string('image_url')->nullable();         // URL gambar obat
            $table->boolean('prescription_required')->default(false); // Perlu resep?
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('medicines');
    }
};
