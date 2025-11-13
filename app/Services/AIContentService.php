<?php

namespace App\Services;

use Illuminate\Http\Client\ConnectionException;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;

class AIContentService
{
    public function generateVCardContent(array $payload): array
    {
        $config = config('ai');
        $provider = $config['provider'];
        $providerConfig = $config['providers'][$provider] ?? null;

        if (!$providerConfig || empty($providerConfig['api_key'])) {
            throw new \RuntimeException('AI provider not configured.');
        }

        $prompt = $payload['prompt'] ?? null;
        if (!$prompt) {
            $prompt = $this->buildPrompt($payload);
        }

        $model = $providerConfig['model'];
        $responseFormat = $config['defaults']['response_format'] ?? 'json';

        $maxTokens = $payload['max_tokens'] ?? 1500;
        $requestBody = [
            'model' => $model,
            'input' => $prompt,
        ];

        if ($responseFormat === 'json') {
            $requestBody['text'] = [
                'format' => [
                    'type' => 'json_object'
                ]
            ];
        }

        $endpoint = ($providerConfig['base_url'] ?? 'https://api.openai.com/v1') . '/responses';
        $maxAttempts = 3;
        $result = null;

        for ($attempt = 0; $attempt < $maxAttempts; $attempt++) {
            $requestBody['max_output_tokens'] = $maxTokens;

            try {
                $response = Http::withToken($providerConfig['api_key'])
                    ->acceptJson()
                    ->timeout($payload['timeout'] ?? 60)
                    ->post($endpoint, $requestBody);
            } catch (ConnectionException $exception) {
                Log::warning('AI generation request connection error', [
                    'attempt' => $attempt + 1,
                    'message' => $exception->getMessage(),
                ]);

                if ($attempt < $maxAttempts - 1) {
                    usleep(200000);
                    continue;
                }

                throw new \RuntimeException('AI provider timed out. Please try again shortly.');
            }

            if (!$response->successful()) {
                Log::error('AI generation failed', [
                    'attempt' => $attempt + 1,
                    'status' => $response->status(),
                    'body' => $response->body(),
                ]);

                throw new \RuntimeException('Unable to generate AI content.');
            }

            $result = $response->json();

            Log::info('AI chat raw response', [
                'attempt' => $attempt + 1,
                'requested_tokens' => $maxTokens,
                'result' => $result,
            ]);

            $status = $result['status'] ?? 'completed';
            $incompleteReason = $result['incomplete_details']['reason'] ?? null;

            if ($status === 'incomplete' && $incompleteReason === 'max_output_tokens') {
                if ($attempt < $maxAttempts - 1) {
                    $maxTokens = min($maxTokens + 600, 4096);
                    Log::warning('AI response truncated by token limit, retrying with higher max_output_tokens', [
                        'next_tokens' => $maxTokens,
                    ]);
                    continue;
                }

                throw new \RuntimeException('AI response exceeded the maximum length. Please try again with fewer details.');
            }

            break;
        }

        if ($result === null) {
            throw new \RuntimeException('AI response was empty.');
        }

        if (!isset($result['output']) || !is_array($result['output'])) {
            throw new \RuntimeException('AI response was empty.');
        }

        $parsed = $this->parseOutput($result['output']);

        if (empty($parsed)) {
            $parsed = $this->attemptAlternativeParse($result);
        }

        if (empty($parsed)) {
            throw new \RuntimeException('AI response did not include parsable JSON.');
        }

        return $this->formatOutput($parsed, $payload);
    }

    public function generateVCardChatTurn(array $payload): array
    {
        $config = config('ai');
        $provider = $config['provider'];
        $providerConfig = $config['providers'][$provider] ?? null;

        if (!$providerConfig || empty($providerConfig['api_key'])) {
            throw new \RuntimeException('AI provider not configured.');
        }

        $prompt = $this->buildChatPrompt($payload);

        $model = $providerConfig['model'];
        $responseFormat = $config['defaults']['response_format'] ?? 'json';

        $maxTokens = $payload['max_tokens'] ?? 1200;
        $requestBody = [
            'model' => $model,
            'input' => $prompt,
        ];

        if ($responseFormat === 'json') {
            $requestBody['text'] = [
                'format' => [
                    'type' => 'json_object',
                ],
            ];
        }

        $endpoint = ($providerConfig['base_url'] ?? 'https://api.openai.com/v1') . '/responses';
        $maxAttempts = 3;
        $result = null;

        for ($attempt = 0; $attempt < $maxAttempts; $attempt++) {
            $requestBody['max_output_tokens'] = $maxTokens;

            try {
                $response = Http::withToken($providerConfig['api_key'])
                    ->acceptJson()
                    ->timeout($payload['timeout'] ?? 60)
                    ->post($endpoint, $requestBody);
            } catch (ConnectionException $exception) {
                Log::warning('AI chat request connection error', [
                    'attempt' => $attempt + 1,
                    'message' => $exception->getMessage(),
                ]);

                if ($attempt < $maxAttempts - 1) {
                    usleep(200000);
                    continue;
                }

                throw new \RuntimeException('AI provider timed out. Please try again shortly.');
            }

            if (!$response->successful()) {
                Log::error('AI chat generation failed', [
                    'attempt' => $attempt + 1,
                    'status' => $response->status(),
                    'body' => $response->body(),
                ]);

                throw new \RuntimeException('Unable to generate AI chat response.');
            }

            $result = $response->json();

            Log::info('AI chat turn raw response', [
                'attempt' => $attempt + 1,
                'requested_tokens' => $maxTokens,
                'result' => $result,
            ]);

            $status = $result['status'] ?? 'completed';
            $incompleteReason = $result['incomplete_details']['reason'] ?? null;

            if ($status === 'incomplete' && $incompleteReason === 'max_output_tokens') {
                if ($attempt < $maxAttempts - 1) {
                    $maxTokens = min($maxTokens + 600, 4096);
                    Log::warning('AI chat response truncated by token limit, retrying with higher max_output_tokens', [
                        'next_tokens' => $maxTokens,
                    ]);
                    continue;
                }

                throw new \RuntimeException('AI response exceeded the maximum length. Please provide fewer details or try again.');
            }

            break;
        }

        if ($result === null) {
            throw new \RuntimeException('AI response was empty.');
        }

        if (!isset($result['output']) || !is_array($result['output'])) {
            throw new \RuntimeException('AI response was empty.');
        }

        $parsed = $this->parseOutput($result['output']);

        if (empty($parsed)) {
            $parsed = $this->attemptAlternativeParse($result);
        }

        if (empty($parsed)) {
            throw new \RuntimeException('AI response did not include parsable JSON.');
        }

        return $this->formatChatOutput($parsed);
    }

    protected function buildPrompt(array $payload): string
    {
        $businessName = $payload['business_name'] ?? 'Business';
        $tone = $payload['tone'] ?? config('ai.defaults.tone');
        $language = $payload['language'] ?? config('ai.defaults.language');
        $sections = $payload['sections'] ?? [];
        $forceFull = !empty($payload['force_full']);
        $requestedSections = [];
        if (!$forceFull && isset($payload['requested_sections']) && is_array($payload['requested_sections'])) {
            foreach ($payload['requested_sections'] as $sectionKey) {
                if (!is_string($sectionKey) || trim($sectionKey) === '') {
                    continue;
                }

                $normalizedKey = $this->normalizeKey($sectionKey);
                if (in_array($normalizedKey, ['service_highlights', 'packages', 'projects', 'contact'], true)) {
                    continue;
                }

                $requestedSections[] = $normalizedKey;
            }
        }

        $requestedSections = array_values(array_unique($requestedSections));

        $targetSections = $sections;
        if (!$forceFull && !empty($requestedSections)) {
            $targetSections = array_intersect_key($sections, array_flip($requestedSections));
        }

        $sectionInstructions = collect($targetSections)->map(function ($details, $sectionKey) {
            $title = Str::headline(str_replace('_', ' ', $sectionKey));
            $content = is_array($details)
                ? json_encode($details, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE)
                : (string) $details;

            return "$title: $content";
        })->implode("\n\n");

        $scope = $payload['scope'] ?? 'Generate tailored copy for each section. Return json keyed by section identifiers.';

        return <<<PROMPT
You are an AI copywriter helping to build a digital business card.
Business Name: {$businessName}
Tone: {$tone}
Language: {$language}

Sections:
{$sectionInstructions}

{$scope}
Ensure the response is valid json.
PROMPT;
    }

    protected function buildChatPrompt(array $payload): string
    {
        $businessName = $payload['business_name'] ?? 'Business';
        $businessType = $payload['business_type'] ?? 'business';
        $tone = $payload['tone'] ?? config('ai.defaults.tone');
        $language = $payload['language'] ?? config('ai.defaults.language');
        $sections = $payload['sections'] ?? [];
        $forceFull = !empty($payload['force_full']);
        $requestedSections = [];
        if (!$forceFull && isset($payload['requested_sections']) && is_array($payload['requested_sections'])) {
            foreach ($payload['requested_sections'] as $sectionKey) {
                if (!is_string($sectionKey) || trim($sectionKey) === '') {
                    continue;
                }

                $normalizedKey = $this->normalizeKey($sectionKey);
                if (in_array($normalizedKey, ['service_highlights', 'packages', 'projects', 'contact'], true)) {
                    continue;
                }

                $requestedSections[] = $normalizedKey;
            }
        }

        $requestedSections = array_values(array_unique($requestedSections));
        $chat = $payload['chat'] ?? [];
        $templateSections = $payload['template_sections'] ?? [];

        $knownSectionsData = $sections;
        if (!$forceFull && !empty($requestedSections)) {
            $knownSectionsData = array_intersect_key($sections, array_flip($requestedSections));
        }

        $knownSections = json_encode($knownSectionsData, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);

        $resolvedTemplateSections = [];
        if (is_array($templateSections)) {
            foreach ($templateSections as $sectionKey) {
                if (is_string($sectionKey) && trim($sectionKey) !== '') {
                    $resolvedTemplateSections[] = trim($sectionKey);
                }
            }
        }

        if ($forceFull) {
            $resolvedTemplateSections = [];
        }

        if (!$forceFull && !empty($requestedSections)) {
            $resolvedTemplateSections = $requestedSections;
        }

        if (empty($resolvedTemplateSections) && is_array($sections)) {
            $resolvedTemplateSections = array_keys($sections);
        }

        if (empty($resolvedTemplateSections)) {
            $resolvedTemplateSections = [
                'hero',
                'service_highlights',
                'why_choose_us',
                'about',
                'projects',
                'testimonials',
                'process',
                'packages',
                'cta_banner',
                'appointments',
                'contact_form',
                'contact',
                'business_hours',
                'social',
                'language',
                'seo',
                'pixels',
                'footer',
                'copyright'
            ];
        }

        $requiredSectionList = implode(', ', $resolvedTemplateSections);
        $requestedSectionList = $forceFull
            ? 'hero, why_choose_us, about, testimonials, process, cta_banner, appointments, contact_form, business_hours, social, language, seo, pixels, footer, copyright'
            : $requiredSectionList;
        $sectionDirective = $forceFull
            ? 'Return polished content for each narrative section listed above. Do not include catalog-managed sections such as service_highlights, packages, projects, or contact.'
            : 'Return polished content for every requested section listed below. Only include those keys inside the "sections" object.';

        if (empty($resolvedTemplateSections)) {
            $sectionDirective = 'Return polished content for every required template section listed below.';
        }

        $conversation = collect($chat)
            ->map(function ($message) {
                $role = strtoupper($message['role'] ?? 'USER');
                $content = trim((string) ($message['content'] ?? ''));

                return sprintf('%s: %s', $role, $content);
            })
            ->implode("\n");

        return <<<PROMPT
You are an AI onboarding specialist helping a client craft content for a digital business card.
Business Name: {$businessName}
Business Type: {$businessType}
Tone: {$tone}
Language: {$language}

You receive a running chat conversation with the user. Analyse new details, update any structured sections, and respond conversationally.

Always respond with valid JSON using this schema:
{
  "reply": "Assistant message displayed to the user in {$language} with a {$tone} tone.",
  "sections": {
    /* Only include the Requested Sections listed below. Do not return other keys. */
  },
  "follow_up_questions": ["Short follow-up questions (if more information is needed)", ""],
  "suggested_fields": {"field": "Additional tips or content suggestions"},
  "done": false
}

Requested Sections: {$requestedSectionList}
{$sectionDirective}
When information is missing, infer professional, on-brand copy that fits the business type. Maintain previously confirmed details unless the user updates them.
Populate list-based sections (services, project_list, reviews, package_list, steps, trust_badges, metrics, social_links) with at least 3 rich, varied items where reasonable. Provide actionable CTAs and URLs when relevant.

Merge new insights with Known Sections so far, ensuring the output remains consistent with prior user inputs. Only update the sections you return.

Known Sections:
{$knownSections}

Conversation History:
{$conversation}

Return JSON output only with no additional commentary.
PROMPT;
    }

    protected function formatOutput(array $output, array $payload): array
    {
        $sections = $payload['sections'] ?? [];
        $formatted = [];

        $source = $output;
        if (isset($output['sections']) && is_array($output['sections'])) {
            $source = $output['sections'];
        }

        $normalizedSource = [];
        foreach ($source as $sourceKey => $value) {
            $normalizedSource[$this->normalizeKey($sourceKey)] = $value;
        }

        foreach ($sections as $key => $details) {
            $normalizedKey = $this->normalizeKey($key);
            if (array_key_exists($normalizedKey, $normalizedSource)) {
                $formatted[$key] = $normalizedSource[$normalizedKey];
                continue;
            }

            $formatted[$key] = $source[$key] ?? null;
        }

        return $formatted;
    }

    protected function formatChatOutput(array $output): array
    {
        $reply = isset($output['reply']) ? (string) $output['reply'] : '';
        $sections = isset($output['sections']) && is_array($output['sections']) ? $output['sections'] : [];
        $followUps = $output['follow_up_questions'] ?? $output['followups'] ?? $output['questions'] ?? [];
        if (!is_array($followUps)) {
            $followUps = (array) $followUps;
        }

        $suggestedFields = $output['suggested_fields'] ?? [];
        if (!is_array($suggestedFields)) {
            $suggestedFields = [];
        }

        return [
            'reply' => $reply,
            'sections' => $sections,
            'follow_up_questions' => array_values(array_filter($followUps, fn ($value) => is_string($value) && trim($value) !== '')),
            'suggested_fields' => $suggestedFields,
            'done' => (bool) ($output['done'] ?? false),
        ];
    }

    protected function parseOutput(array $output): array
    {
        foreach ($output as $item) {
            if (in_array($item['type'] ?? null, ['output_text', 'text'], true)) {
                $decoded = $this->decodeJsonText($item['text'] ?? '');
                if (!empty($decoded)) {
                    return $decoded;
                }
            }

            if (($item['type'] ?? null) === 'message' && isset($item['content']) && is_array($item['content'])) {
                foreach ($item['content'] as $content) {
                    if (in_array($content['type'] ?? null, ['output_text', 'text'], true)) {
                        $decoded = $this->decodeJsonText($content['text'] ?? '');
                        if (!empty($decoded)) {
                            return $decoded;
                        }
                    }
                }
            }

            if (($item['type'] ?? null) === 'message' && isset($item['content']) && is_string($item['content'])) {
                $decoded = $this->decodeJsonText($item['content']);
                if (!empty($decoded)) {
                    return $decoded;
                }
            }
        }

        return [];
    }

    protected function decodeJsonText(?string $text): array
    {
        if (!$text) {
            return [];
        }

        $clean = trim($text);

        if (str_starts_with($clean, '```')) {
            $clean = preg_replace('/^```[a-zA-Z0-9]*\s*/', '', $clean);
            $clean = preg_replace('/```$/', '', $clean);
        }

        $clean = trim($clean);

        $decoded = json_decode($clean, true);
        if (json_last_error() === JSON_ERROR_NONE && is_array($decoded)) {
            return $decoded;
        }

        $snippet = $this->extractFirstJsonStructure($clean);
        if ($snippet !== null && $snippet !== $clean) {
            $snippetDecoded = json_decode($snippet, true);
            if (json_last_error() === JSON_ERROR_NONE && is_array($snippetDecoded)) {
                return $snippetDecoded;
            }
        }

        return [];
    }

    protected function attemptAlternativeParse(array $result): array
    {
        $candidates = [];

        if (!empty($result['output_text'])) {
            $candidates[] = $result['output_text'];
        }

        if (!empty($result['content'])) {
            $candidates[] = $result['content'];
        }

        if (isset($result['choices']) && is_array($result['choices'])) {
            foreach ($result['choices'] as $choice) {
                if (isset($choice['text']) && is_string($choice['text'])) {
                    $candidates[] = $choice['text'];
                }

                if (isset($choice['message'])) {
                    $message = $choice['message'];
                    if (is_string($message)) {
                        $candidates[] = $message;
                    }

                    if (is_array($message)) {
                        if (isset($message['content'])) {
                            $candidates[] = $message['content'];
                        }

                        if (isset($message['text']) && is_string($message['text'])) {
                            $candidates[] = $message['text'];
                        }
                    }
                }
            }
        }

        if (isset($result['data']) && is_array($result['data'])) {
            foreach ($result['data'] as $dataItem) {
                if (isset($dataItem['content'])) {
                    $candidates[] = $dataItem['content'];
                }

                if (isset($dataItem['text']) && is_string($dataItem['text'])) {
                    $candidates[] = $dataItem['text'];
                }

                if (isset($dataItem['output']) && is_array($dataItem['output'])) {
                    $candidates[] = $dataItem['output'];
                }
            }
        }

        foreach ($candidates as $candidate) {
            if (is_string($candidate)) {
                $decoded = $this->decodeJsonText($candidate);
                if (!empty($decoded)) {
                    return $decoded;
                }
            }

            if (is_array($candidate)) {
                foreach ($candidate as $entry) {
                    if (is_string($entry)) {
                        $decoded = $this->decodeJsonText($entry);
                        if (!empty($decoded)) {
                            return $decoded;
                        }
                    }

                    if (is_array($entry) && isset($entry['text']) && is_string($entry['text'])) {
                        $decoded = $this->decodeJsonText($entry['text']);
                        if (!empty($decoded)) {
                            return $decoded;
                        }
                    }
                }
            }
        }

        return [];
    }

    protected function extractFirstJsonStructure(string $text): ?string
    {
        $length = strlen($text);
        $depthStack = [];
        $startIndex = null;
        $inString = false;
        $escaped = false;

        for ($index = 0; $index < $length; $index++) {
            $char = $text[$index];

            if ($inString) {
                if ($escaped) {
                    $escaped = false;
                    continue;
                }

                if ($char === '\\') {
                    $escaped = true;
                    continue;
                }

                if ($char === '"') {
                    $inString = false;
                }

                continue;
            }

            if ($char === '"') {
                $inString = true;
                continue;
            }

            if ($char === '{' || $char === '[') {
                if ($startIndex === null) {
                    $startIndex = $index;
                }
                $depthStack[] = $char;
                continue;
            }

            if ($char === '}' || $char === ']') {
                if (empty($depthStack)) {
                    continue;
                }

                $expected = array_pop($depthStack);
                if (($expected === '{' && $char !== '}') || ($expected === '[' && $char !== ']')) {
                    $depthStack = [];
                    $startIndex = null;
                    continue;
                }

                if (empty($depthStack) && $startIndex !== null) {
                    return substr($text, $startIndex, $index - $startIndex + 1);
                }
            }
        }

        return null;
    }

    protected function normalizeKey(string $key): string
    {
        return preg_replace('/[^a-z0-9]/', '', strtolower($key));
    }
}
