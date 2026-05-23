<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // Add new columns
        Schema::table('orders', function (Blueprint $table) {
            $table->enum('payment_status', ['pending', 'waiting_confirmation', 'paid'])->default('pending')->after('total_price');
            $table->string('payment_method')->nullable()->after('payment_status');
            $table->timestamp('payment_confirmed_at')->nullable()->after('payment_method');
        });

        // Expand status enum to include new values
        DB::statement("ALTER TABLE orders MODIFY COLUMN status ENUM('menunggu_pembayaran', 'menunggu_konfirmasi', 'perlu_diproses', 'sedang_diproses', 'dikirim', 'selesai', 'dibatalkan', 'dilaporkan', 'pending', 'diproses') DEFAULT 'menunggu_pembayaran'");

        // Migrate existing data to new statuses
        DB::table('orders')->where('status', 'pending')->update(['status' => 'menunggu_pembayaran']);
        DB::table('orders')->where('status', 'diproses')->update(['status' => 'sedang_diproses']);
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('orders', function (Blueprint $table) {
            $table->dropColumn(['payment_status', 'payment_method', 'payment_confirmed_at']);
        });

        // Revert data
        DB::table('orders')->where('status', 'menunggu_pembayaran')->update(['status' => 'pending']);
        DB::table('orders')->where('status', 'sedang_diproses')->update(['status' => 'diproses']);
        DB::table('orders')->where('status', 'perlu_diproses')->update(['status' => 'pending']);

        // Revert status enum
        DB::statement("ALTER TABLE orders MODIFY COLUMN status ENUM('pending', 'menunggu_konfirmasi', 'diproses', 'dikirim', 'selesai', 'dibatalkan', 'dilaporkan') DEFAULT 'pending'");
    }
};
