<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class MediaAsset extends Model
{
    use HasFactory;

    protected $fillable = [
        'business_id',
        'owner_type',
        'owner_id',
        'kind',
        'url',
        'title',
        'alt_text',
        'meta',
    ];

    protected $casts = [
        'meta' => 'array',
    ];

    public function business()
    {
        return $this->belongsTo(Business::class);
    }
}
