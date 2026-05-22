<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration {
    public function up() {
        DB::statement("ALTER TABLE orders MODIFY COLUMN status ENUM('pending', 'processing', 'completed', 'cancelled', 'diproses', 'selesai', 'dibatalkan', 'dikirim', 'dilaporkan', 'menunggu_konfirmasi') DEFAULT 'pending'");
    }
    public function down() {
        DB::statement("ALTER TABLE orders MODIFY COLUMN status ENUM('pending', 'processing', 'completed', 'cancelled', 'diproses', 'selesai', 'dibatalkan', 'dikirim', 'dilaporkan') DEFAULT 'pending'");
    }
};
