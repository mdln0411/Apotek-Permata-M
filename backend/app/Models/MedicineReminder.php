<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class MedicineReminder extends Model
{
    protected $fillable = [
        'user_id',
        'medicine_name',
        'reminder_time',
        'dosage',
        'is_active',
        'days',
    ];

    protected $casts = [
        'days' => 'array',
        'is_active' => 'boolean',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
