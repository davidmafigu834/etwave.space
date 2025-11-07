<?php

namespace App\Http\Controllers;

use App\Http\Requests\StorePushSubscriptionRequest;
use App\Models\UserPushSubscription;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;

class NotificationPreferenceController extends Controller
{
    public function storeSubscription(StorePushSubscriptionRequest $request)
    {
        $user = $request->user();

        $subscription = UserPushSubscription::updateOrCreate(
            [
                'player_id' => $request->input('player_id'),
            ],
            [
                'user_id' => $user->id,
                'device_type' => $request->input('device_type'),
                'browser' => $request->input('browser'),
                'subscribed' => $request->boolean('subscribed', true),
                'last_seen_at' => now(),
            ]
        );

        return response()->json([
            'status' => 'ok',
            'subscription' => $subscription,
        ]);
    }

    public function updatePreferences(Request $request)
    {
        $user = $request->user();

        $validated = $request->validate([
            'web_push_subscribed' => ['nullable', 'boolean'],
            'frequency' => ['nullable', 'in:daily,weekly,monthly'],
            'send_time' => ['nullable', 'date_format:H:i'],
        ]);

        $user->updateNotificationPreferences($validated);

        if (array_key_exists('web_push_subscribed', $validated)) {
            $user->pushSubscriptions()->update([
                'subscribed' => (bool) $validated['web_push_subscribed'],
            ]);
        }

        return response()->json([
            'status' => 'ok',
            'preferences' => $user->notification_preferences,
        ]);
    }
}
