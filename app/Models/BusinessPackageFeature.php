<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class BusinessPackageFeature extends Model
{
    use HasFactory;

    public $timestamps = false;

    protected $fillable = [
        'package_id',
        'feature',
        'order_index',
    ];

    public function package()
    {
        return $this->belongsTo(BusinessPackage::class, 'package_id');
    }
}
