<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('simulasi_interaksi_obat', function (Blueprint $table) {
            $table->id();
            $table->string('obat1', 100);
            $table->string('obat2', 100);
            $table->text('simulasi');
            $table->timestamps();

            $table->index(['obat1', 'obat2']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('simulasi_interaksi_obat');
    }
};
