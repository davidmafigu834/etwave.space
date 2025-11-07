<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class SuperAdminMiddleware
{
    public function handle(Request $request, Closure $next, string $permission = null)
    {
        $user = auth()->user();

        // If user is not authenticated, redirect to login
        if (!$user) {
            return redirect()->route('login');
        }

        // Superadmin bypass - allow access without permission checks
        if ($user->type === 'superadmin' || $user->type === 'super admin') {
            return $next($request);
        }

        // If no permission specified, just check authentication
        if (!$permission) {
            return $next($request);
        }

        // Check if user has the required permission for non-superadmin users
        if (!$user->hasPermissionTo($permission)) {
            if ($request->expectsJson()) {
                return response()->json(['message' => 'Forbidden'], 403);
            }

            // Redirect to first available page or dashboard
            return redirect()->route('dashboard');
        }

        return $next($request);
    }
}