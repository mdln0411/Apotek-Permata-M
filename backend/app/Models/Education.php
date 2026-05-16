<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Education extends Model
{
    protected $table = 'education';

    protected $fillable = [
        'title',
        'content',
        'category',
        'author',
        'image_url'
    ];
}
