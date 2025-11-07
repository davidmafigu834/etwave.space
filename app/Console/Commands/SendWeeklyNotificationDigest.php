<?php

namespace App\Console\Commands;

use App\Services\NotificationDigestService;
use Illuminate\Console\Command;

class SendWeeklyNotificationDigest extends Command
{
    protected $signature = 'notifications:send-weekly-digest';

    protected $description = 'Send the weekly OneSignal visitor digest to subscribed users.';

    public function __construct(private readonly NotificationDigestService $digestService)
    {
        parent::__construct();
    }

    public function handle(): int
    {
        if (!$this->digestService->isEnabled()) {
            $this->warn('OneSignal is not configured; skipping weekly digest dispatch.');
            return self::SUCCESS;
        }

        $sent = $this->digestService->sendWeeklyDigest();

        $this->info("Weekly digest sent to {$sent} user(s).");

        return self::SUCCESS;
    }
}
