<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Order extends Model
{
    use HasFactory;

    protected $guarded = [];

    protected $casts = [
        'completed_at' => 'datetime',
        'payment_confirmed_at' => 'datetime',
    ];

    public function isCompleted(): bool
    {
        return in_array(strtolower((string) $this->status), ['selesai', 'completed'], true);
    }

    /** Waktu transaksi selesai — untuk laporan & riwayat. */
    public function transactionCompletedAt(): ?\Illuminate\Support\Carbon
    {
        if (!$this->isCompleted()) {
            return null;
        }

        return $this->completed_at ?? $this->updated_at;
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function processedBy()
    {
        return $this->belongsTo(User::class, 'processed_by');
    }

    public function items()
    {
        return $this->hasMany(OrderItem::class);
    }

    public function prescription()
    {
        return $this->belongsTo(Prescription::class);
    }

    public function isPickup(): bool
    {
        return $this->shipping_address === 'Ambil di Apotek';
    }

    public function isCod(): bool
    {
        return self::isCodPayment($this->payment_method, $this->notes);
    }

    public static function isCodPayment(?string $paymentMethod, ?string $notes): bool
    {
        $method = strtolower(trim((string) $paymentMethod));
        $notesLower = strtolower(trim((string) $notes));

        return str_contains($method, 'cod')
            || str_contains($method, 'bayar di apotek')
            || str_contains($notesLower, 'bayar di apotek (cod)')
            || str_contains($notesLower, 'pembayaran: bayar di apotek');
    }

    public static function isPickupAddress(?string $shippingAddress): bool
    {
        return $shippingAddress === 'Ambil di Apotek';
    }
}
