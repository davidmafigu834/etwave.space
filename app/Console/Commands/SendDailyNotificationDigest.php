<?php

namespace App\Console\Commands;

use App\Services\NotificationDigestService;
use Illuminate\Console\Command;

class SendDailyNotificationDigest extends Command
{
    protected $signature = 'notifications:send-daily-digest';

    protected $description = 'Send the daily OneSignal visitor digest to subscribed users.';

    public function __construct(private readonly NotificationDigestService $digestService)
    {
        parent::__construct();
    }

    public function handle(): int
    {
        if (!$this->digestService->isEnabled()) {
            $this->warn('OneSignal is not configured; skipping daily digest dispatch.');
            return self::SUCCESS;
        }

        $sent = $this->digestService->sendDailyDigest();

        $this->info("Daily digest sent to {$sent} user(s).");

        return self::SUCCESS;
    }
}
