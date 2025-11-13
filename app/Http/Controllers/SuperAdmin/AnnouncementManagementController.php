<?php

namespace App\Http\Controllers\SuperAdmin;

use App\Http\Controllers\Controller;
use App\Models\Announcement;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AnnouncementManagementController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth');
        $this->middleware('App\Http\Middleware\SuperAdminMiddleware');
    }
    
    public function index(Request $request)
    {
        $announcements = Announcement::latest()->paginate(15);

        return Inertia::render('superadmin/announcements/index', [
            'announcements' => $announcements,
        ]);
    }
}
