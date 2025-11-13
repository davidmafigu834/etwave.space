<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Announcement;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class AnnouncementController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth:sanctum');
    }

    public function index()
    {
        $announcements = Announcement::query()
            ->active()
            ->forUser()
            ->with(['users' => function ($query) {
                $query->where('user_id', Auth::id());
            }])
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(function ($announcement) {
                $announcement->is_read = $announcement->users->isNotEmpty() 
                    ? (bool) $announcement->users[0]->pivot->is_read 
                    : false;
                unset($announcement->users);
                return $announcement;
            });

        return response()->json($announcements);
    }

    public function markAsRead(Announcement $announcement)
    {
        $announcement->markAsRead();
        
        return response()->json([
            'message' => 'Announcement marked as read',
            'announcement' => $announcement->load(['users' => function ($query) {
                $query->where('user_id', Auth::id());
            }])
        ]);
    }

    public function markAllAsRead()
    {
        $announcements = Announcement::query()
            ->active()
            ->forUser()
            ->whereDoesntHave('users', function ($query) {
                $query->where('user_id', Auth::id())
                    ->where('is_read', true);
            })
            ->get();

        foreach ($announcements as $announcement) {
            $announcement->markAsRead();
        }

        return response()->json([
            'message' => 'All announcements marked as read',
            'count' => $announcements->count()
        ]);
    }
}
