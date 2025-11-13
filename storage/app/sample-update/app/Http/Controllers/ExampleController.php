<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\SystemUpdate;

class ExampleController extends Controller
{
    public function index()
    {
        // Enhanced example controller with update tracking
        $updates = SystemUpdate::applied()
            ->orderBy('applied_at', 'desc')
            ->take(5)
            ->get();

        return view('example', compact('updates'));
    }

    public function updateSystemInfo()
    {
        // Example method showing system update integration
        $currentVersion = setting('system_version', '1.0.0');
        $latestUpdate = SystemUpdate::applied()
            ->orderBy('applied_at', 'desc')
            ->first();

        return [
            'current_version' => $currentVersion,
            'last_update' => $latestUpdate?->applied_at,
            'update_count' => SystemUpdate::applied()->count()
        ];
    }
}
