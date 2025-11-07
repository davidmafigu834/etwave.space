<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Mail\WaitlistEmail;
use App\Models\Newsletter;
use Illuminate\Support\Facades\Mail;

class SendWaitlistEmails extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'waitlist:send-emails {subject} {message} {--test : Send to first 5 emails only}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Send emails to all active waitlist subscribers';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $subject = $this->argument('subject');
        $message = $this->argument('message');
        $isTest = $this->option('test');

        $query = Newsletter::active();

        if ($isTest) {
            $query->limit(5);
            $this->info('Sending test emails to first 5 subscribers...');
        } else {
            $this->info('Sending emails to all active subscribers...');
        }

        $subscribers = $query->get();

        if ($subscribers->isEmpty()) {
            $this->error('No active subscribers found.');
            return;
        }

        $this->info("Found {$subscribers->count()} subscribers.");

        $bar = $this->output->createProgressBar($subscribers->count());
        $bar->start();

        $sent = 0;
        $failed = 0;

        foreach ($subscribers as $subscriber) {
            try {
                Mail::to($subscriber->email)->send(new WaitlistEmail($subject, $message));
                $sent++;
            } catch (\Exception $e) {
                $this->error("Failed to send to {$subscriber->email}: {$e->getMessage()}");
                $failed++;
            }

            $bar->advance();
        }

        $bar->finish();
        $this->newLine(2);

        $this->info("Emails sent: {$sent}");
        if ($failed > 0) {
            $this->error("Emails failed: {$failed}");
        }

        if ($isTest) {
            $this->info('Test completed. Use without --test flag to send to all subscribers.');
        }
    }
}
