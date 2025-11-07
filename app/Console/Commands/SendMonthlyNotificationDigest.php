<?php

namespace App\Console\Commands;

use App\Services\NotificationDigestService;
use Illuminate\Console\Command;

class SendMonthlyNotificationDigest extends Command
{
    protected $signature = 'notifications:send-monthly-digest';

    protected $description = 'Send the monthly OneSignal visitor digest to subscribed users.';

    public function __construct(private readonly NotificationDigestService $digestService)
    {
        parent::__construct();
    }

    public function handle(): int
    {
        if (!$this->digestService->isEnabled()) {
            $this->warn('OneSignal is not configured; skipping monthly digest dispatch.');
            return self::SUCCESS;
        }

        $sent = $this->digestService->sendMonthlyDigest();

        $this->info("Monthly digest sent to {$sent} user(s).");

        return self::SUCCESS;
    }
}
