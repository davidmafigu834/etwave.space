<?php

return [
    'provider' => env('AI_PROVIDER', 'openai'),

    'providers' => [
        'openai' => [
            'api_key' => env('OPENAI_API_KEY'),
            'model' => env('OPENAI_MODEL', 'gpt-4o-mini'),
            'base_url' => env('OPENAI_BASE_URL'),
        ],
    ],

    'defaults' => [
        'tone' => 'professional',
        'language' => env('APP_LOCALE', 'en'),
        'response_format' => 'json',
    ],
];
