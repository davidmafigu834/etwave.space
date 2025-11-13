<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasOne;

class OnboardingProfile extends Model
{
    use HasFactory;

    protected $with = ['detail'];

    protected $fillable = [
        'user_id',
        'business_name',
        'business_category',
        'business_subcategory',
        'business_description',
        'contact_name',
        'contact_email',
        'contact_phone',
        'whatsapp',
        'website',
        'country',
        'city',
        'address_line1',
        'address_line2',
        'social_links',
        'completed_at',
    ];

    protected $casts = [
        'social_links' => 'array',
        'completed_at' => 'datetime',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function detail(): HasOne
    {
        return $this->hasOne(OnboardingProfileDetail::class);
    }
}
