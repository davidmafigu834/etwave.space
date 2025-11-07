<?php

namespace App\Services;

use App\Models\Contact;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;

class NotificationDigestService
{
    public function __construct(
        private readonly OneSignalService $oneSignal,
    ) {
    }

    public function isEnabled(): bool
    {
        return $this->oneSignal->isConfigured();
    }

    public function sendDailyDigest(): int
    {
        $end = now()->startOfMinute();
        $start = (clone $end)->subDay();

        return $this->sendDigest('daily', $start->copy()->startOfDay(), $end->copy()->endOfDay());
    }

    public function sendWeeklyDigest(): int
    {
        $end = now()->startOfMinute();
        $start = (clone $end)->subWeek();

        return $this->sendDigest('weekly', $start->copy()->startOfDay(), $end->copy()->endOfDay());
    }

    public function sendMonthlyDigest(): int
    {
        $end = now()->startOfMinute();
        $start = (clone $end)->subMonth();

        return $this->sendDigest('monthly', $start->copy()->startOfDay(), $end->copy()->endOfDay());
    }

    private function sendDigest(string $frequency, Carbon $start, Carbon $end): int
    {
        if (!$this->isEnabled()) {
            return 0;
        }

        $nowLabel = now()->format('H:i');
        $sent = 0;
        $periodLabel = $this->periodLabel($frequency);

        $this->eligibleUsersQuery()
            ->with([
                'pushSubscriptions' => function ($query) {
                    $query->where('subscribed', true);
                },
                'businesses:id,created_by',
            ])
            ->chunkById(100, function ($users) use (&$sent, $frequency, $nowLabel, $periodLabel, $start, $end) {
                foreach ($users as $user) {
                    $preferences = $user->notification_preferences ?? [];
                    $desiredFrequency = $preferences['frequency'] ?? 'daily';
                    $sendTime = $preferences['send_time'] ?? '08:00';
                    $subscribed = $preferences['web_push_subscribed'] ?? true;

                    if (!$subscribed || $desiredFrequency !== $frequency || $sendTime !== $nowLabel) {
                        continue;
                    }

                    $playerIds = $user->pushSubscriptions->pluck('player_id')->filter()->unique()->values();

                    if ($playerIds->isEmpty()) {
                        continue;
                    }

                    $businessIds = $user->businesses->pluck('id');

                    if ($businessIds->isEmpty()) {
                        continue;
                    }

                    $metrics = $this->compileMetrics($businessIds, $start, $end);

                    $title = match ($frequency) {
                        'weekly' => 'Weekly visitor digest',
                        'monthly' => 'Monthly visitor digest',
                        default => 'Daily visitor digest',
                    };

                    $message = sprintf(
                        '%s: %s visits (%s unique), %s new contacts. Top source: %s.',
                        $periodLabel,
                        number_format($metrics['visits']),
                        number_format($metrics['unique_visitors']),
                        number_format($metrics['new_contacts']),
                        $metrics['top_referrer']
                    );

                    if ($this->oneSignal->sendToPlayerIds(
                        $playerIds->all(),
                        $title,
                        $message,
                        [
                            'frequency' => $frequency,
                            'period' => [$start->toIso8601String(), $end->toIso8601String()],
                            'metrics' => $metrics,
                        ]
                    )) {
                        $sent++;
                    }
                }
            });

        return $sent;
    }

    private function compileMetrics(Collection $businessIds, Carbon $start, Carbon $end): array
    {
        $visitQuery = DB::table('shetabit_visits')
            ->whereIn('business_id', $businessIds)
            ->whereBetween('created_at', [$start, $end]);

        $visits = (clone $visitQuery)->count();
        $uniqueVisitors = (clone $visitQuery)->distinct('ip')->count('ip');

        $referrerRow = (clone $visitQuery)
            ->selectRaw('COALESCE(NULLIF(referer, ""), "Direct") as referrer, COUNT(*) as total')
            ->groupBy('referrer')
            ->orderByDesc('total')
            ->first();

        $topReferrer = $referrerRow?->referrer ?? 'Direct';

        $newContacts = Contact::query()
            ->whereIn('business_id', $businessIds)
            ->whereBetween('created_at', [$start, $end])
            ->count();

        return [
            'visits' => $visits,
            'unique_visitors' => $uniqueVisitors,
            'new_contacts' => $newContacts,
            'top_referrer' => $topReferrer,
        ];
    }

    private function periodLabel(string $frequency): string
    {
        return match ($frequency) {
            'weekly' => 'Last 7 days',
            'monthly' => 'Last 30 days',
            default => 'Yesterday',
        };
    }

    private function eligibleUsersQuery()
    {
        return User::query()
            ->whereHas('pushSubscriptions', function ($query) {
                $query->where('subscribed', true);
            })
            ->where(function ($query) {
                $query->whereNull('notification_preferences')
                    ->orWhere('notification_preferences->web_push_subscribed', true);
            })
            ->orderBy('id');
    }
}
