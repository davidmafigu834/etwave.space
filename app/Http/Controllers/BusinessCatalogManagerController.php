<?php

namespace App\Http\Controllers;

use App\Models\Business;
use App\Models\BusinessPackage;
use App\Models\BusinessPackageFeature;
use App\Models\BusinessService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class BusinessCatalogManagerController extends Controller
{
    public function index(Request $request, Business $business): Response
    {
        $this->authorizeAccess($request->user(), $business);

        $business->load([
            'services' => fn ($query) => $query->orderBy('order_index')->orderBy('id'),
            'packages.features' => fn ($query) => $query->orderBy('order_index')->orderBy('id'),
        ]);

        return Inertia::render('vcard-builder/catalog-manager', [
            'business' => [
                'id' => $business->id,
                'name' => $business->name,
                'business_type' => $business->business_type,
            ],
            'services' => $business->services->map(function (BusinessService $service) {
                return [
                    'id' => $service->id,
                    'name' => $service->name,
                    'slug' => $service->slug,
                    'summary' => $service->summary,
                    'description' => $service->description,
                    'category' => $service->category,
                    'price_type' => $service->price_type,
                    'price_amount' => $service->price_amount,
                    'price_currency' => $service->price_currency,
                    'duration_label' => $service->duration_label,
                    'is_featured' => $service->is_featured,
                    'order_index' => $service->order_index,
                    'meta' => $service->meta,
                    'meta_image' => $service->meta['image'] ?? null,
                ];
            })->values(),
            'packages' => $business->packages->map(function (BusinessPackage $package) {
                return [
                    'id' => $package->id,
                    'name' => $package->name,
                    'slug' => $package->slug,
                    'headline' => $package->headline,
                    'description' => $package->description,
                    'price_display' => $package->price_display,
                    'price_amount' => $package->price_amount,
                    'price_currency' => $package->price_currency,
                    'duration_label' => $package->duration_label,
                    'cta_label' => $package->cta_label,
                    'cta_link' => $package->cta_link,
                    'is_featured' => $package->is_featured,
                    'order_index' => $package->order_index,
                    'meta' => $package->meta,
                    'meta_image' => $package->meta['image'] ?? null,
                    'features' => $package->features->map(fn (BusinessPackageFeature $feature) => $feature->feature)->values(),
                ];
            })->values(),
        ]);
    }

    public function storeService(Request $request, Business $business): RedirectResponse
    {
        $this->authorizeAccess($request->user(), $business);

        $data = $request->validate([
            'name' => 'required|string|max:255',
            'slug' => 'nullable|string|max:255',
            'summary' => 'nullable|string',
            'description' => 'nullable|string',
            'category' => 'nullable|string|max:255',
            'price_type' => 'nullable|string|max:100',
            'price_amount' => 'nullable|numeric',
            'price_currency' => 'nullable|string|max:10',
            'duration_label' => 'nullable|string|max:255',
            'is_featured' => 'sometimes|boolean',
            'order_index' => 'nullable|integer',
            'meta_image' => 'nullable|string|max:2048',
        ]);

        $metaImage = $data['meta_image'] ?? null;
        unset($data['meta_image']);

        $slug = $data['slug'] ?? Str::slug($data['name']);
        $slug = $this->ensureUniqueServiceSlug($business, $slug);

        $orderIndex = $data['order_index'] ?? ($business->services()->max('order_index') + 1);

        $business->services()->create([
            'name' => $data['name'],
            'slug' => $slug,
            'summary' => $data['summary'] ?? null,
            'description' => $data['description'] ?? null,
            'category' => $data['category'] ?? null,
            'price_type' => $data['price_type'] ?? null,
            'price_amount' => $data['price_amount'] ?? null,
            'price_currency' => $data['price_currency'] ?? null,
            'duration_label' => $data['duration_label'] ?? null,
            'is_featured' => (bool) ($data['is_featured'] ?? false),
            'order_index' => $orderIndex,
            'meta' => $this->applyImageToMeta(null, $metaImage),
        ]);

        return back()->with('success', __('Service saved successfully.'));
    }

    public function updateService(Request $request, Business $business, BusinessService $service): RedirectResponse
    {
        $this->authorizeAccess($request->user(), $business);
        abort_unless($service->business_id === $business->id, 404);

        $data = $request->validate([
            'name' => 'required|string|max:255',
            'slug' => 'nullable|string|max:255',
            'summary' => 'nullable|string',
            'description' => 'nullable|string',
            'category' => 'nullable|string|max:255',
            'price_type' => 'nullable|string|max:100',
            'price_amount' => 'nullable|numeric',
            'price_currency' => 'nullable|string|max:10',
            'duration_label' => 'nullable|string|max:255',
            'is_featured' => 'sometimes|boolean',
            'order_index' => 'nullable|integer',
            'meta_image' => 'nullable|string|max:2048',
        ]);

        $metaImage = $data['meta_image'] ?? null;
        unset($data['meta_image']);

        $slug = $data['slug'] ?? Str::slug($data['name']);
        $slug = $this->ensureUniqueServiceSlug($business, $slug, $service->id);

        $service->update([
            'name' => $data['name'],
            'slug' => $slug,
            'summary' => $data['summary'] ?? null,
            'description' => $data['description'] ?? null,
            'category' => $data['category'] ?? null,
            'price_type' => $data['price_type'] ?? null,
            'price_amount' => $data['price_amount'] ?? null,
            'price_currency' => $data['price_currency'] ?? null,
            'duration_label' => $data['duration_label'] ?? null,
            'is_featured' => (bool) ($data['is_featured'] ?? false),
            'order_index' => $data['order_index'] ?? $service->order_index,
            'meta' => $this->applyImageToMeta($service->meta ?? [], $metaImage),
        ]);

        return back()->with('success', __('Service updated successfully.'));
    }

    public function destroyService(Request $request, Business $business, BusinessService $service): RedirectResponse
    {
        $this->authorizeAccess($request->user(), $business);
        abort_unless($service->business_id === $business->id, 404);

        $service->delete();

        return back()->with('success', __('Service removed successfully.'));
    }

    public function storePackage(Request $request, Business $business): RedirectResponse
    {
        $this->authorizeAccess($request->user(), $business);

        $data = $request->validate([
            'name' => 'required|string|max:255',
            'slug' => 'nullable|string|max:255',
            'headline' => 'nullable|string',
            'description' => 'nullable|string',
            'price_display' => 'nullable|string|max:255',
            'price_amount' => 'nullable|numeric',
            'price_currency' => 'nullable|string|max:10',
            'duration_label' => 'nullable|string|max:255',
            'cta_label' => 'nullable|string|max:255',
            'cta_link' => 'nullable|url|max:500',
            'is_featured' => 'sometimes|boolean',
            'order_index' => 'nullable|integer',
            'features' => 'nullable|array',
            'features.*' => 'nullable|string',
            'meta_image' => 'nullable|string|max:2048',
        ]);

        $features = $this->normalizeFeatures($data['features'] ?? []);
        $metaImage = $data['meta_image'] ?? null;
        unset($data['meta_image']);

        $slug = $data['slug'] ?? Str::slug($data['name']);
        $slug = $this->ensureUniquePackageSlug($business, $slug);

        $orderIndex = $data['order_index'] ?? ($business->packages()->max('order_index') + 1);

        DB::transaction(function () use ($business, $data, $features, $slug, $orderIndex, $metaImage) {
            $package = $business->packages()->create([
                'name' => $data['name'],
                'slug' => $slug,
                'headline' => $data['headline'] ?? null,
                'description' => $data['description'] ?? null,
                'price_display' => $data['price_display'] ?? null,
                'price_amount' => $data['price_amount'] ?? null,
                'price_currency' => $data['price_currency'] ?? null,
                'duration_label' => $data['duration_label'] ?? null,
                'cta_label' => $data['cta_label'] ?? null,
                'cta_link' => $data['cta_link'] ?? null,
                'is_featured' => (bool) ($data['is_featured'] ?? false),
                'order_index' => $orderIndex,
                'meta' => $this->applyImageToMeta(null, $metaImage),
            ]);

            foreach ($features as $index => $feature) {
                $package->features()->create([
                    'feature' => $feature,
                    'order_index' => $index,
                ]);
            }
        });

        return back()->with('success', __('Package saved successfully.'));
    }

    public function updatePackage(Request $request, Business $business, BusinessPackage $package): RedirectResponse
    {
        $this->authorizeAccess($request->user(), $business);
        abort_unless($package->business_id === $business->id, 404);

        $data = $request->validate([
            'name' => 'required|string|max:255',
            'slug' => 'nullable|string|max:255',
            'headline' => 'nullable|string',
            'description' => 'nullable|string',
            'price_display' => 'nullable|string|max:255',
            'price_amount' => 'nullable|numeric',
            'price_currency' => 'nullable|string|max:10',
            'duration_label' => 'nullable|string|max:255',
            'cta_label' => 'nullable|string|max:255',
            'cta_link' => 'nullable|url|max:500',
            'is_featured' => 'sometimes|boolean',
            'order_index' => 'nullable|integer',
            'features' => 'nullable|array',
            'features.*' => 'nullable|string',
            'meta_image' => 'nullable|string|max:2048',
        ]);

        $features = $this->normalizeFeatures($data['features'] ?? []);
        $metaImage = $data['meta_image'] ?? null;
        unset($data['meta_image']);

        $slug = $data['slug'] ?? Str::slug($data['name']);
        $slug = $this->ensureUniquePackageSlug($business, $slug, $package->id);

        DB::transaction(function () use ($package, $data, $features, $slug, $metaImage) {
            $package->update([
                'name' => $data['name'],
                'slug' => $slug,
                'headline' => $data['headline'] ?? null,
                'description' => $data['description'] ?? null,
                'price_display' => $data['price_display'] ?? null,
                'price_amount' => $data['price_amount'] ?? null,
                'price_currency' => $data['price_currency'] ?? null,
                'duration_label' => $data['duration_label'] ?? null,
                'cta_label' => $data['cta_label'] ?? null,
                'cta_link' => $data['cta_link'] ?? null,
                'is_featured' => (bool) ($data['is_featured'] ?? false),
                'order_index' => $data['order_index'] ?? $package->order_index,
                'meta' => $this->applyImageToMeta($package->meta ?? [], $metaImage),
            ]);

            $package->features()->delete();
            foreach ($features as $index => $feature) {
                $package->features()->create([
                    'feature' => $feature,
                    'order_index' => $index,
                ]);
            }
        });

        return back()->with('success', __('Package updated successfully.'));
    }

    public function destroyPackage(Request $request, Business $business, BusinessPackage $package): RedirectResponse
    {
        $this->authorizeAccess($request->user(), $business);
        abort_unless($package->business_id === $business->id, 404);

        DB::transaction(function () use ($package) {
            $package->features()->delete();
            $package->delete();
        });

        return back()->with('success', __('Package removed successfully.'));
    }

    protected function authorizeAccess($user, Business $business): void
    {
        if (!$user) {
            abort(401);
        }

        if ($user->type === 'superadmin') {
            return;
        }

        if ($user->type === 'company') {
            if ($business->created_by === $user->id) {
                return;
            }

            abort(403);
        }

        if ($user->created_by && $business->created_by === $user->created_by) {
            return;
        }

        abort(403);
    }

    protected function ensureUniqueServiceSlug(Business $business, string $slug, ?int $ignoreId = null): string
    {
        $baseSlug = Str::slug($slug) ?: Str::random(8);
        $candidate = $baseSlug;
        $suffix = 1;

        while (
            $business->services()
                ->when($ignoreId, fn ($query) => $query->where('id', '!=', $ignoreId))
                ->where('slug', $candidate)
                ->exists()
        ) {
            $candidate = $baseSlug.'-'.$suffix;
            $suffix++;
        }

        return $candidate;
    }

    protected function ensureUniquePackageSlug(Business $business, string $slug, ?int $ignoreId = null): string
    {
        $baseSlug = Str::slug($slug) ?: Str::random(8);
        $candidate = $baseSlug;
        $suffix = 1;

        while (
            $business->packages()
                ->when($ignoreId, fn ($query) => $query->where('id', '!=', $ignoreId))
                ->where('slug', $candidate)
                ->exists()
        ) {
            $candidate = $baseSlug.'-'.$suffix;
            $suffix++;
        }

        return $candidate;
    }

    /**
     * @param array<int, string|null>|null $features
     * @return array<int, string>
     */
    protected function normalizeFeatures(?array $features): array
    {
        if (!$features) {
            return [];
        }

        return collect($features)
            ->map(fn ($feature) => is_string($feature) ? trim($feature) : '')
            ->filter()
            ->values()
            ->toArray();
    }

    protected function applyImageToMeta(?array $current, ?string $image): ?array
    {
        $meta = $current ?? [];

        if ($image && trim($image) !== '') {
            $meta['image'] = $image;
        } else {
            unset($meta['image']);
        }

        return empty($meta) ? null : $meta;
    }
}
