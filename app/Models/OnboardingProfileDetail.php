<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class OnboardingProfileDetail extends Model
{
    use HasFactory;

    protected $fillable = [
        'onboarding_profile_id',
        'company_overview',
        'mission_statement',
        'vision_statement',
        'unique_value_proposition',
        'target_audience',
        'service_highlights',
        'notable_projects',
        'testimonials',
        'brand_voice',
        'call_to_action',
        'keywords',
        'metadata',
    ];

    protected $casts = [
        'keywords' => 'array',
        'metadata' => 'array',
    ];

    public function onboardingProfile()
    {
        return $this->belongsTo(OnboardingProfile::class);
    }
}
