<?php

namespace App\Models;

use App\Traits\HasTree;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ProductCategory extends Model
{
    use HasFactory, HasTree;

    protected $fillable = [
        'business_id',
        'name',
        'slug',
        'description',
        'parent_id',
        'is_active',
        'order_index',
        'meta',
    ];

    protected $casts = [
        'is_active' => 'boolean',
        'parent_id' => 'integer',
        'order_index' => 'integer',
        'meta' => 'array',
    ];

    public function business()
    {
        return $this->belongsTo(Business::class);
    }

    public function parent()
    {
        return $this->belongsTo(ProductCategory::class, 'parent_id');
    }

    public function children()
    {
        return $this->hasMany(ProductCategory::class, 'parent_id');
    }

    public function products()
    {
        return $this->hasMany(Product::class, 'category_id');
    }

    public function media()
    {
        return $this->belongsToMany(MediaAsset::class, 'product_category_media', 'category_id', 'media_id')
            ->withPivot(['order_index', 'caption'])
            ->orderBy('product_category_media.order_index');
    }

    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    public function scopeOrdered($query)
    {
        return $query->orderBy('order_index');
    }

    public function scopeRoot($query)
    {
        return $query->whereNull('parent_id');
    }
}
