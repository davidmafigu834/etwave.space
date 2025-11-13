<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class BusinessProject extends Model
{
    use HasFactory;

    protected $fillable = [
        'business_id',
        'title',
        'slug',
        'category',
        'location',
        'summary',
        'description',
        'cta_label',
        'cta_link',
        'is_featured',
        'order_index',
        'meta',
    ];

    protected $casts = [
        'is_featured' => 'boolean',
        'meta' => 'array',
    ];

    public function business()
    {
        return $this->belongsTo(Business::class);
    }

    public function media()
    {
        return $this->belongsToMany(MediaAsset::class, 'business_project_media', 'project_id', 'media_id')
            ->withPivot(['order_index', 'caption'])
            ->orderBy('business_project_media.order_index');
    }

    public function scopeOrdered($query)
    {
        return $query->orderBy('order_index')->orderBy('id');
    }
}
