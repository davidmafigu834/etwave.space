<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ProjectGalleryItem extends Model
{
    use HasFactory;

    protected $fillable = [
        'gallery_id',
        'media_id',
        'media_type',
        'media_url',
        'thumbnail_url',
        'title',
        'description',
        'order_index',
        'meta',
    ];

    protected $casts = [
        'order_index' => 'integer',
        'meta' => 'array',
    ];

    public function gallery()
    {
        return $this->belongsTo(ProjectGallery::class, 'gallery_id');
    }
}
