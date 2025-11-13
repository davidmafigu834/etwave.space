<?php
namespace App\Http\Middleware;

use Illuminate\Foundation\Inspiring;
use Illuminate\Http\Request;
use Inertia\Middleware;
use Tighten\Ziggy\Ziggy;
use App\Models\Currency;
use App\Models\PaymentSetting;
use App\Models\ReferralSetting;
use App\Models\User;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that's loaded on the first page visit.
     *
     * @see https://inertiajs.com/server-side-setup#root-template
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determines the current asset version.
     *
     * @see https://inertiajs.com/asset-versioning
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @see https://inertiajs.com/shared-data
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        [$message, $author] = str(Inspiring::quotes()->random())->explode('-');
        
        // Skip database queries during installation
        if ($request->is('install/*') || $request->is('update/*') || ! file_exists(storage_path('installed'))) {
            $globalSettings = [
                'currencySymbol' => '$',
                'currencyNname' => 'US Dollar',
                'base_url' => config('app.url'),
                'image_url' => config('app.url'),
                'paymentSettings' => [
                    'is_paynow_enabled' => false,
                    'paynow_mode' => 'test',
                    'paynow_test_email' => null,
                ],
            ];
        } else {
            $settings = settings();
            $currencyCode = $settings['defaultCurrency'] ?? 'USD';
            $currency = Currency::where('code', $currencyCode)->first();

            $currencySettings = $currency
                ? [
                    'currencySymbol' => $currency->symbol,
                    'currencyNname' => $currency->name,
                ]
                : [
                    'currencySymbol' => '$',
                    'currencyNname' => 'US Dollar',
                ];

            $globalSettings = array_merge($settings, $currencySettings);
            $globalSettings['base_url'] = config('app.url');
            $globalSettings['image_url'] = config('app.url');
            $globalSettings['paymentSettings'] = $this->getPaymentSettingsForFrontend();
            $globalSettings = $this->filterSensitiveSettings($globalSettings);
        }

        return array_merge(parent::share($request), [
            'name' => config('app.name'),
            'base_url' => config('app.url'),
            'image_url' => config('app.url'),
            'quote' => [
                'message' => trim($message),
                'author' => trim($author),
            ],
            'csrf_token' => csrf_token(),
            'globalSettings' => $globalSettings,
            'auth' => function () use ($request) {
                $user = $request->user();

                if ($user) {
                    $user->load(['businesses', 'plan', 'onboardingProfile']);

                    if (config('app.is_demo') && $request->cookie('demo_business_id')) {
                        $businessId = (int) $request->cookie('demo_business_id');

                        if ($user->businesses->contains('id', $businessId)) {
                            $user->current_business = $businessId;
                            $user->load('businesses');
                        }
                    }

                    if (! in_array($user->type, ['company', 'superadmin'])) {
                        $user->plan = optional($user->creator)->plan;
                    }
                }

                if (! $user) {
                    return [
                        'user' => null,
                        'roles' => [],
                        'permissions' => [],
                        'plan' => null,
                        'notification_preferences' => [],
                        'enabled_addons' => [],
                    ];
                }

                $roles = $user->getRoleNames();
                $permissions = $user->getAllPermissions()->pluck('name')->values();

                $enabledAddons = [];
                if ($user->type === 'superadmin') {
                    $enabledAddons = \App\Models\Addon::where('is_enabled', true)
                        ->select('name', 'package_name')
                        ->get()
                        ->toArray();
                } else {
                    $userPlan = $user->plan;
                    if ($userPlan && ! empty($userPlan->getAllowedAddons())) {
                        $allowedPackageNames = $userPlan->getAllowedAddons();
                        $enabledAddons = \App\Models\Addon::whereIn('package_name', $allowedPackageNames)
                            ->where('is_enabled', true)
                            ->select('name', 'package_name')
                            ->get()
                            ->toArray();
                    }
                }

                return [
                    'user' => [
                        'id' => $user->id,
                        'name' => $user->name,
                        'email' => $user->email,
                        'avatar' => $user->avatar,
                        'lang' => $user->lang,
                        'type' => $user->type,
                        'is_super_admin' => $user->isSuperAdmin(),
                        'is_admin' => $user->isAdmin(),
                        'current_business' => $user->current_business,
                        'plan_id' => $user->plan_id,
                        'plan_is_active' => $user->plan_is_active,
                        'storage_limit' => $user->storage_limit,
                        'notification_preferences' => $user->notification_preferences,
                        'onboardingProfile' => $user->onboardingProfile,
                        'businesses' => $user->businesses,
                    ],
                    'roles' => $roles,
                    'permissions' => $permissions,
                    'plan' => $user->plan,
                    'notification_preferences' => $user->notification_preferences,
                    'enabled_addons' => $enabledAddons,
                ];
            },
            'lang' => function () use ($request) {
                $user = $request->user();
                return optional($user)->lang ?? $this->getSuperAdminLang();
            },
            'isImpersonating' => session('impersonated_by') ? true : false,
            'is_demo' => env('IS_DEMO', false),
        ]);
    }
    
    /**
     * Filter out sensitive configuration keys that should not be shared with frontend
     *
     * @param array $settings
     * @return array
     */
    private function filterSensitiveSettings(array $settings): array
    {
        $sensitiveKeys = config('sensitive-keys');
        
        return array_diff_key($settings, array_flip($sensitiveKeys));
    }

    /**
     * Expose non-sensitive payment settings required by frontend components
     */
    private function getPaymentSettingsForFrontend(): array
    {
        $superAdmin = User::where('type', 'superadmin')->first();

        if (!$superAdmin) {
            return [
                'is_paynow_enabled' => false,
                'paynow_mode' => 'test',
                'paynow_test_email' => null,
            ];
        }

        $settings = PaymentSetting::getUserSettings($superAdmin->id);

        return [
            'is_paynow_enabled' => (bool) ($settings['is_paynow_enabled'] ?? false),
            'paynow_mode' => $settings['paynow_mode'] ?? 'test',
            'paynow_test_email' => $settings['paynow_test_email'] ?? null,
        ];
    }

    /**
     * Get superadmin language if user lang is not set
     */
    private function getSuperAdminLang(): string
    {
        $superAdmin = \App\Models\User::whereHas('roles', function($query) {
            $query->whereIn('name', ['superadmin', 'super admin']);
        })->first();
        
        return $superAdmin ? $superAdmin->lang ?? 'en' : 'en';
    }
}