<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;
use Shetabit\Visitor\Models\Visit;

class Business extends Model
{
    use HasFactory;
    
    protected $fillable = [
        'name',
        'slug',
        'business_type',
        'config_sections',
        'created_by',
        'custom_domain',
        'url_prefix',
        'password',
        'password_enabled',
        'domain_type',
        'view_count',
        'favicon'
    ];
    
    protected $casts = [
        'config_sections' => 'array',
        'password_enabled' => 'boolean',
    ];
    
    protected static function boot()
    {
        parent::boot();
        
        static::creating(function ($business) {
            if (empty($business->slug)) {
                $business->slug = static::generateUniqueSlug($business->name);
            }
        });
        
        static::updating(function ($business) {
            if ($business->isDirty('name') && empty($business->slug)) {
                $business->slug = static::generateUniqueSlug($business->name);
            }
        });
    }
    
    public static function generateUniqueSlug($name, $excludeId = null, $urlPrefix = 'v')
    {
        $slug = Str::slug($name);
        $originalSlug = $slug;
        $counter = 1;
        
        $query = static::where('slug', $slug)->where('url_prefix', $urlPrefix);
        if ($excludeId) {
            $query->where('id', '!=', $excludeId);
        }
        
        while ($query->exists()) {
            $slug = $originalSlug . '-' . $counter;
            $counter++;
            $query = static::where('slug', $slug)->where('url_prefix', $urlPrefix);
            if ($excludeId) {
                $query->where('id', '!=', $excludeId);
            }
        }
        
        return $slug;
    }
    
    /**
     * Get the user that owns the business.
     */
    public function user()
    {
        return $this->belongsTo(User::class, 'created_by');
    }
    
    /**
     * Get the contacts for the business.
     */
    public function contacts()
    {
        return $this->hasMany(Contact::class);
    }
    
    /**
     * Get the appointments for the business.
     */
    public function appointments()
    {
        return $this->hasMany(Appointment::class);
    }
    
    /**
     * Get the campaigns for the business.
     */
    public function campaigns()
    {
        return $this->hasMany(Campaign::class);
    }
    
    public function services()
    {
        return $this->hasMany(BusinessService::class)->orderBy('order_index');
    }

    public function packages()
    {
        return $this->hasMany(BusinessPackage::class)->orderBy('order_index');
    }

    public function projects()
    {
        return $this->hasMany(BusinessProject::class)->orderBy('order_index');
    }

    public function projectGalleries()
    {
        return $this->hasMany(ProjectGallery::class)->orderBy('order_index');
    }

    public function projectGallery()
    {
        return $this->hasOne(ProjectGallery::class)->orderBy('order_index');
    }

    public function categories()
    {
        return $this->hasMany(ProductCategory::class)->orderBy('order_index');
    }

    public function products()
    {
        return $this->hasMany(Product::class)->orderBy('order_index');
    }

    public function orders()
    {
        return $this->hasMany(Order::class)->orderBy('created_at', 'desc');
    }

    /**
     * Get active campaigns for the business.
     */
    public function activeCampaigns()
    {
        return $this->hasMany(Campaign::class)->activeCampaigns();
    }
    
    public function visitLogs()
    {
        return $this->morphMany(Visit::class, 'visitable');
    }
}