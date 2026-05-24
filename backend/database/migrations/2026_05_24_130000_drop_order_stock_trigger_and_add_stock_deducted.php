<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        \Illuminate\Support\Facades\DB::unprepared('DROP TRIGGER IF EXISTS tr_reduce_stock');

        Schema::table('orders', function (Blueprint $table) {
            $table->boolean('stock_deducted')->default(false)->after('processed_by');
        });

        // Pesanan selesai sebelumnya sudah pernah mengurangi stok (via trigger lama)
        \Illuminate\Support\Facades\DB::table('orders')
            ->whereIn('status', ['selesai', 'completed'])
            ->update(['stock_deducted' => true]);
    }

    public function down(): void
    {
        Schema::table('orders', function (Blueprint $table) {
            $table->dropColumn('stock_deducted');
        });

        \Illuminate\Support\Facades\DB::unprepared("
            CREATE TRIGGER tr_reduce_stock
            AFTER INSERT ON order_items
            FOR EACH ROW
            BEGIN
                UPDATE medicines SET stock = stock - NEW.quantity
                WHERE id = NEW.medicine_id;
            END
        ");
    }
};
