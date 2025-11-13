<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class BusinessPackage extends Model
{
    use HasFactory;

    protected $fillable = [
        'business_id',
        'name',
        'slug',
        'headline',
        'description',
        'price_display',
        'price_amount',
        'price_currency',
        'duration_label',
        'cta_label',
        'cta_link',
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

    public function features()
    {
        return $this->hasMany(BusinessPackageFeature::class, 'package_id')->orderBy('order_index');
    }

    public function media()
    {
        return $this->belongsToMany(MediaAsset::class, 'business_package_media', 'package_id', 'media_id')
            ->withPivot(['order_index', 'caption'])
            ->orderBy('business_package_media.order_index');
    }

    public function scopeOrdered($query)
    {
        return $query->orderBy('order_index');
    }
}
