<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class BusinessServiceMedia extends Model
{
    use HasFactory;

    public $timestamps = false;

    protected $fillable = [
        'service_id',
        'media_id',
        'order_index',
        'caption',
    ];

    public function service()
    {
        return $this->belongsTo(BusinessService::class, 'service_id');
    }

    public function media()
    {
        return $this->belongsTo(MediaAsset::class, 'media_id');
    }
}
