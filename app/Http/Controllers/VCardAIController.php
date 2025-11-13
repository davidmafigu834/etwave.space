<?php

namespace App\Http\Controllers;

use App\Services\AIContentService;
use App\Services\PlanFeatureService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class VCardAIController extends Controller
{
    public function __construct(private readonly AIContentService $aiContentService)
    {
    }

    public function generate(Request $request): JsonResponse
    {
        $user = $request->user();

        if (!$user) {
            abort(401);
        }

        if ($user->type !== 'superadmin' && !PlanFeatureService::hasFeature($user, 'ai_integration')) {
            return response()->json([
                'success' => false,
                'message' => __('Your current plan does not include AI content generation.'),
            ], 403);
        }

        $validated = $request->validate([
            'business_name' => 'nullable|string|max:255',
            'business_type' => 'nullable|string|max:100',
            'tone' => 'nullable|string|max:50',
            'language' => 'nullable|string|max:10',
            'max_tokens' => 'nullable|integer|min:100|max:4000',
            'sections' => 'required|array|min:1',
            'sections.*' => 'nullable',
            'prompt' => 'nullable|string|max:6000',
            'scope' => 'nullable|string|max:1000',
            'force_full' => 'sometimes|boolean',
            'onboarding_context' => 'nullable|array',
        ]);

        try {
            $content = $this->aiContentService->generateVCardContent($validated);

            return response()->json([
                'success' => true,
                'data' => $content,
            ]);
        } catch (\Throwable $throwable) {
            Log::warning('AI content generation error', [
                'message' => $throwable->getMessage(),
                'user_id' => $user->id,
            ]);

            $message = config('app.debug')
                ? $throwable->getMessage()
                : __('Unable to generate AI content at this time. Please try again later.');

            return response()->json([
                'success' => false,
                'message' => $message,
            ], 422);
        }
    }

    public function chat(Request $request): JsonResponse
    {
        $user = $request->user();

        if (!$user) {
            abort(401);
        }

        if ($user->type !== 'superadmin' && !PlanFeatureService::hasFeature($user, 'ai_integration')) {
            return response()->json([
                'success' => false,
                'message' => __('Your current plan does not include AI content generation.'),
            ], 403);
        }

        $validated = $request->validate([
            'business_name' => 'nullable|string|max:255',
            'business_type' => 'nullable|string|max:100',
            'tone' => 'nullable|string|max:50',
            'language' => 'nullable|string|max:10',
            'max_tokens' => 'nullable|integer|min:100|max:4000',
            'sections' => 'nullable|array',
            'active_section' => 'nullable|string|max:100',
            'section_label' => 'nullable|string|max:150',
            'template_sections' => 'nullable|array',
            'template_sections.*' => 'nullable|string|max:100',
            'pending_sections' => 'nullable|array',
            'pending_sections.*' => 'nullable|string|max:100',
            'completed_sections' => 'nullable|array',
            'completed_sections.*' => 'nullable|string|max:100',
            'chat' => 'required|array|min:1',
            'chat.*.role' => 'required|string|in:user,assistant,system',
            'chat.*.content' => 'required|string|max:2000',
            'force_full' => 'sometimes|boolean',
            'onboarding_context' => 'nullable|array',
        ]);

        try {
            $content = $this->aiContentService->generateVCardChatTurn($validated);

            return response()->json([
                'success' => true,
                'data' => $content,
            ]);
        } catch (\Throwable $throwable) {
            Log::warning('AI chat generation error', [
                'message' => $throwable->getMessage(),
                'user_id' => $user->id,
            ]);

            $message = config('app.debug')
                ? $throwable->getMessage()
                : __('Unable to generate AI content at this time. Please try again later.');

            return response()->json([
                'success' => false,
                'message' => $message,
            ], 422);
        }
    }
}
