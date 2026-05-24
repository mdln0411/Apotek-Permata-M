<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Medicine extends Model
{
    /**
     * Kolom yang boleh diisi (mass assignment)
     */
    protected $fillable = [
        'name',
        'category',
        'indication',
        'unit',
        'price',
        'price_detail',
        'stock',
        'usage_rules',
        'dosage',
        'side_effects',
        'interactions',
        'usage_duration',
        'composition',
        'contraindications',
        'image_url',
        'prescription_required',
        'is_active',
    ];

    /**
     * Cast tipe data otomatis
     */
    protected $casts = [
        'price'                  => 'integer',
        'stock'                  => 'integer',
        'prescription_required'  => 'boolean',
        'is_active'              => 'boolean',
    ];

    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }
}
