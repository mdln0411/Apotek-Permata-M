<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // 1. Create Trigger for Stock Reduction
        // Note: Using DB::unprepared for complex raw SQL
        \Illuminate\Support\Facades\DB::unprepared("
            CREATE TRIGGER tr_reduce_stock 
            AFTER INSERT ON order_items
            FOR EACH ROW 
            BEGIN
                UPDATE medicines SET stock = stock - NEW.quantity 
                WHERE id = NEW.medicine_id;
            END
        ");

        // 2. Create View for Sales Summary
        \Illuminate\Support\Facades\DB::statement("
            CREATE VIEW vw_sales_summary AS
            SELECT 
                m.id as medicine_id,
                m.name as medicine_name,
                SUM(oi.quantity) as total_sold,
                SUM(oi.subtotal) as total_revenue
            FROM order_items oi
            JOIN medicines m ON oi.medicine_id = m.id
            GROUP BY m.id, m.name
        ");
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        \Illuminate\Support\Facades\DB::unprepared("DROP TRIGGER IF EXISTS tr_reduce_stock");
        \Illuminate\Support\Facades\DB::statement("DROP VIEW IF EXISTS vw_sales_summary");
    }


};
