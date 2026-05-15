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
        Schema::create('obats', function (Blueprint $table) {
            $table->id();
            $table->string('id_obat')->nullable();
            $table->string('nama_obat')->nullable();
            $table->string('kategori_penyakit')->nullable();
            $table->text('indikasi')->nullable();
            $table->string('satuan_tersedia')->nullable();
            $table->string('harga_mulai')->nullable();
            $table->text('harga_detail')->nullable();
            $table->text('aturan_pemakaian')->nullable();
            $table->text('dosis')->nullable();
            $table->text('efek_samping')->nullable();
            $table->text('interaksi_obat')->nullable();
            $table->text('jangka_waktu_penggunaan')->nullable();
            $table->text('komposisi')->nullable();
            $table->text('kontra_indikasi')->nullable();
            $table->integer('stok')->default(0);
            $table->string('image')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('obats');
    }
};
