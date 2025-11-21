<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class CheckOnboarding
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $user = $request->user();

        if (!$user) {
            return $next($request);
        }

        // Skip for super admin
        if ($user->isSuperAdmin()) {
            return $next($request);
        }

        // Skip if user is being impersonated (check session)
        if (session()->has('impersonate')) {
            return $next($request);
        }

        // Skip if user is not a company (e.g. if you have other user types that don't need onboarding)
        if ($user->type !== 'company') {
            return $next($request);
        }

        // Check if onboarding is completed
        if (!$user->hasCompletedOnboarding()) {
            // Allow access to onboarding routes and logout
            if ($request->routeIs('dashboard') || $request->routeIs('logout') || $request->routeIs('profile.*')) {
                return $next($request);
            }

            return redirect()->route('dashboard');
        }

        return $next($request);
    }
}
