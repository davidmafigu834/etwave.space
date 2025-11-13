<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Support\Facades\Auth;

class Announcement extends Model
{
    protected $fillable = [
        'title',
        'message',
        'type',
        'start_date',
        'end_date',
        'target_roles',
        'is_active'
    ];

    protected $casts = [
        'target_roles' => 'array',
        'start_date' => 'datetime',
        'end_date' => 'datetime',
        'is_active' => 'boolean',
    ];

    public function users(): BelongsToMany
    {
        return $this->belongsToMany(User::class)
            ->withPivot('is_read', 'read_at')
            ->withTimestamps();
    }

    public function markAsRead(?User $user = null): void
    {
        $user = $user ?? Auth::user();
        
        if ($this->users()->where('user_id', $user->id)->exists()) {
            $this->users()->updateExistingPivot($user->id, [
                'is_read' => true,
                'read_at' => now(),
            ]);
        } else {
            $this->users()->attach($user->id, [
                'is_read' => true,
                'read_at' => now(),
            ]);
        }
    }

    public function scopeActive($query)
    {
        return $query->where('is_active', true)
            ->where(function ($q) {
                $q->whereNull('start_date')
                    ->orWhere('start_date', '<=', now());
            })
            ->where(function ($q) {
                $q->whereNull('end_date')
                    ->orWhere('end_date', '>=', now());
            });
    }

    public function scopeForUser($query, ?User $user = null)
    {
        $user = $user ?? Auth::user();
        
        if (! $user) {
            return $query->whereNull('target_roles')->orWhereJsonLength('target_roles', 0);
        }

        $roleNames = collect($user->roles ?? [])->pluck('name')->filter()->values();
        $type = $user->type ?? null;

        return $query->where(function ($q) use ($roleNames, $type) {
            $q->whereNull('target_roles')
                ->orWhereJsonLength('target_roles', 0);

            if ($roleNames->isNotEmpty()) {
                $q->orWhere(function ($inner) use ($roleNames) {
                    foreach ($roleNames as $roleName) {
                        $inner->orWhereJsonContains('target_roles', $roleName);
                    }
                });
            }

            if ($type) {
                $q->orWhereJsonContains('target_roles', $type);
            }
        });
    }
}
