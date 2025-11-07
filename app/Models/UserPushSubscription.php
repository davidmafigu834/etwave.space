<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class UserPushSubscription extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'player_id',
        'device_type',
        'browser',
        'subscribed',
        'last_seen_at',
    ];

    protected $casts = [
        'subscribed' => 'boolean',
        'last_seen_at' => 'datetime',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
