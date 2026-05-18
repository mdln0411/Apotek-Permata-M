<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Allergy extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'allergen_name',
        'symptom',
        'severity',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
