<?php

namespace App\Http\Controllers;

use App\Models\OnboardingProfile;
use App\Models\OnboardingProfileDetail;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Validator;

class OnboardingProfileController extends Controller
{
    public function show(Request $request): JsonResponse
    {
        $profile = $request->user()->onboardingProfile;

        return response()->json([
            'data' => $profile,
        ]);
    }

    public function store(Request $request): JsonResponse
    {
        $user = $request->user();

        $data = $this->validatePayload($request);

        $detailPayload = $data['details'] ?? [];
        unset($data['details']);

        $profile = OnboardingProfile::updateOrCreate(
            ['user_id' => $user->id],
            array_merge($data, [
                'completed_at' => now(),
            ])
        );

        $this->storeOrUpdateDetails($profile, $detailPayload);

        return response()->json([
            'message' => __('Onboarding profile saved successfully.'),
            'data' => $profile->fresh(),
        ]);
    }

    public function update(Request $request): JsonResponse
    {
        $user = $request->user();

        $profile = $user->onboardingProfile;

        if (!$profile) {
            abort(404, __('Onboarding profile not found.'));
        }

        $data = $this->validatePayload($request, false);

        $detailPayload = $data['details'] ?? [];
        unset($data['details']);

        $profile->fill($data);

        if (!empty($data['business_category'])) {
            $profile->completed_at = $profile->completed_at ?? now();
        }

        $profile->save();

        $this->storeOrUpdateDetails($profile, $detailPayload);

        return response()->json([
            'message' => __('Onboarding profile updated successfully.'),
            'data' => $profile->fresh(),
        ]);
    }

    protected function validatePayload(Request $request, bool $requireCategory = true): array
    {
        $rules = [
            'business_name' => ['nullable', 'string', 'max:255'],
            'business_description' => ['nullable', 'string'],
            'business_category' => [$requireCategory ? 'required' : 'nullable', 'string', 'max:255'],
            'business_subcategory' => ['nullable', 'string', 'max:255'],
            'contact_name' => ['nullable', 'string', 'max:255'],
            'contact_email' => ['nullable', 'email', 'max:255'],
            'contact_phone' => ['nullable', 'string', 'max:255'],
            'whatsapp' => ['nullable', 'string', 'max:255'],
            'website' => ['nullable', 'url', 'max:255'],
            'country' => ['nullable', 'string', 'max:255'],
            'city' => ['nullable', 'string', 'max:255'],
            'address_line1' => ['nullable', 'string', 'max:255'],
            'address_line2' => ['nullable', 'string', 'max:255'],
            'social_links' => ['nullable', 'array'],
            'social_links.*.platform' => ['required_with:social_links', 'string', 'max:100'],
            'social_links.*.url' => ['required_with:social_links', 'url', 'max:255'],
            'social_links.*.username' => ['nullable', 'string', 'max:255'],
            'details' => ['nullable', 'array'],
            'details.company_overview' => ['nullable', 'string'],
            'details.mission_statement' => ['nullable', 'string'],
            'details.vision_statement' => ['nullable', 'string'],
            'details.unique_value_proposition' => ['nullable', 'string'],
            'details.target_audience' => ['nullable', 'string'],
            'details.service_highlights' => ['nullable', 'string'],
            'details.notable_projects' => ['nullable', 'string'],
            'details.testimonials' => ['nullable', 'string'],
            'details.brand_voice' => ['nullable', 'string'],
            'details.call_to_action' => ['nullable', 'string'],
            'details.keywords' => ['nullable', 'array'],
            'details.keywords.*' => ['nullable', 'string', 'max:255'],
            'details.metadata' => ['nullable', 'array'],
        ];

        return Validator::make($request->all(), $rules)->validate();
    }

    protected function storeOrUpdateDetails(OnboardingProfile $profile, array $payload): void
    {
        if (empty(array_filter($payload, fn ($value) => $value !== null && $value !== ''))) {
            return;
        }

        $detailData = $payload;

        if (isset($detailData['keywords']) && is_array($detailData['keywords'])) {
            $detailData['keywords'] = array_values(array_filter($detailData['keywords'], fn ($value) => is_string($value) && trim($value) !== ''));
            if (empty($detailData['keywords'])) {
                $detailData['keywords'] = null;
            }
        }

        OnboardingProfileDetail::updateOrCreate(
            ['onboarding_profile_id' => $profile->id],
            $detailData
        );
    }
}
