<?php

namespace App\Services;

use App\Models\Medicine;
use App\Models\Order;

class OrderStockService
{
    private const COMPLETED = ['selesai', 'completed'];

    public function isCompletedStatus(?string $status): bool
    {
        return in_array(strtolower(trim((string) $status)), self::COMPLETED, true);
    }

    /** Kurangi stok saat pesanan selesai — idempotent per order. */
    public function deductForOrder(Order $order): void
    {
        if ($order->stock_deducted) {
            return;
        }

        $order->loadMissing('items');

        foreach ($order->items as $item) {
            if (!$item->medicine_id) {
                continue;
            }

            $medicine = Medicine::find($item->medicine_id);
            if (!$medicine) {
                continue;
            }

            $qty = (int) $item->quantity;
            $medicine->update([
                'stock' => max(0, (int) $medicine->stock - $qty),
            ]);
        }

        $order->update(['stock_deducted' => true]);
    }

    /** Kembalikan stok jika pesanan dibatalkan setelah stok sudah dikurangi. */
    public function restoreForOrder(Order $order): void
    {
        if (!$order->stock_deducted) {
            return;
        }

        $order->loadMissing('items');

        foreach ($order->items as $item) {
            if (!$item->medicine_id) {
                continue;
            }

            $medicine = Medicine::find($item->medicine_id);
            if ($medicine) {
                $medicine->increment('stock', (int) $item->quantity);
            }
        }

        $order->update(['stock_deducted' => false]);
    }

    /** Validasi ketersediaan stok sebelum checkout. */
    public function assertCartItemsInStock(iterable $cartItems): ?string
    {
        foreach ($cartItems as $item) {
            $medicine = $item->medicine ?? Medicine::find($item->medicine_id);
            if (!$medicine) {
                return 'Salah satu obat tidak ditemukan.';
            }

            $available = max(0, (int) $medicine->stock);
            if ($available < (int) $item->quantity) {
                return "Stok \"{$medicine->name}\" tidak mencukupi. Tersedia: {$available}, diminta: {$item->quantity}.";
            }
        }

        return null;
    }
}
