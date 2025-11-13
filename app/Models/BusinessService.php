<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class BusinessService extends Model
{
    use HasFactory;

    protected $fillable = [
        'business_id',
        'name',
        'slug',
        'summary',
        'description',
        'category',
        'price_type',
        'price_amount',
        'price_currency',
        'duration_label',
        'is_featured',
        'order_index',
        'meta',
    ];

    protected $casts = [
        'is_featured' => 'boolean',
        'price_amount' => 'decimal:2',
        'meta' => 'array',
    ];

    public function business()
    {
        return $this->belongsTo(Business::class);
    }

    public function media()
    {
        return $this->belongsToMany(MediaAsset::class, 'business_service_media', 'service_id', 'media_id')
            ->withPivot(['order_index', 'caption'])
            ->orderBy('business_service_media.order_index');
    }

    public function scopeOrdered($query)
    {
        return $query->orderBy('order_index');
    }
}
