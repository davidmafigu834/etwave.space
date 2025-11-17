<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Lab404\Impersonate\Impersonate;

class ImpersonateController extends Controller
{
    public function start(Request $request, $userId)
    {
        $user = User::findOrFail($userId);

        // Log impersonation event
        Log::info('Impersonation started', [
            'acting_user_id' => auth()->id(),
            'impersonated_user_id' => $userId,
            'ip_address' => $request->ip(),
            'timestamp' => now()
        ]);

        $originalUserId = auth()->id();

        // Store impersonation data BEFORE logout
        $impersonationData = [
            'impersonating_as' => $userId,
            'original_user_id' => $originalUserId,
            'impersonation_started_at' => now()
        ];

        // Fully log out the current user
        auth()->logout();

        // Clear session and regenerate completely
        session()->flush();
        session()->regenerate(true);

        // Restore impersonation data in the new session
        session()->put('impersonating_as', $impersonationData['impersonating_as']);
        session()->put('original_user_id', $impersonationData['original_user_id']);
        session()->put('impersonation_started_at', $impersonationData['impersonation_started_at']);

        // Log in as the target user
        auth()->loginUsingId($userId, true); // true for "remember me"

        // Regenerate CSRF token to prevent token mismatch
        session()->regenerateToken();

        session()->save();

        // Redirect with cache-busting parameter to ensure fresh page load
        return redirect('/dashboard?t=' . time());
    }

    public function leave(Request $request)
    {
        Log::info('Impersonation ended', [
            'timestamp' => now()
        ]);

        $originalUserId = session('original_user_id');
        if ($originalUserId) {
            // Log out current impersonated user
            auth()->logout();

            // Clear session and regenerate completely
            session()->flush();
            session()->regenerate(true);

            // Log back in as the original user (superadmin)
            auth()->loginUsingId($originalUserId, true);

            // Regenerate CSRF token
            session()->regenerateToken();

            session()->save();
        }

        // Force full page reload to clear cache
        return redirect('/companies?t=' . time());
    }
}