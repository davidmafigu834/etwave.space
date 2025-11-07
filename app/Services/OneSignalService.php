<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class OneSignalService
{
    private ?string $appId;
    private ?string $restApiKey;

    public function __construct()
    {
        $this->appId = config('services.onesignal.app_id');
        $this->restApiKey = config('services.onesignal.rest_api_key');
    }

    public function isConfigured(): bool
    {
        return !empty($this->appId) && !empty($this->restApiKey);
    }

    /**
     * @param  array<int, string>  $playerIds
     */
    public function sendToPlayerIds(array $playerIds, string $title, string $message, array $data = []): bool
    {
        if (!$this->isConfigured()) {
            Log::warning('Attempted to send OneSignal notification without configuration.');
            return false;
        }

        $recipients = array_values(array_unique(array_filter($playerIds)));

        if (empty($recipients)) {
            return false;
        }

        $payload = [
            'app_id' => $this->appId,
            'include_player_ids' => $recipients,
            'headings' => ['en' => $title],
            'contents' => ['en' => $message],
            'target_channel' => 'push',
        ];

        if (!empty($data)) {
            $payload['data'] = $data;
        }

        $response = Http::timeout(10)
            ->withHeaders([
                'Authorization' => 'Basic ' . $this->restApiKey,
                'Content-Type' => 'application/json',
            ])
            ->post("https://api.onesignal.com/apps/{$this->appId}/notifications", $payload);

        if ($response->failed()) {
            Log::warning('OneSignal notification failed', [
                'status' => $response->status(),
                'body' => $response->json(),
            ]);

            return false;
        }

        return true;
    }
}
