<?php

namespace App\Http\Controllers;

use App\Models\Business;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class BusinessCatalogController extends Controller
{
    public function show(Request $request, Business $business): JsonResponse
    {
        $this->authorizeAccess($request->user(), $business);

        $business->load([
            'services.media',
            'packages.features',
            'packages.media',
            'projects.media',
            'projectGallery.items',
        ]);

        return response()->json([
            'success' => true,
            'data' => [
                'services' => $business->services->map(fn ($service) => [
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
                    'media' => $service->media->map(fn ($media) => [
                        'id' => $media->id,
                        'kind' => $media->kind,
                        'url' => $this->resolveMediaUrl($media->url),
                        'title' => $media->title,
                        'alt_text' => $media->alt_text,
                        'pivot' => [
                            'order_index' => $media->pivot->order_index,
                            'caption' => $media->pivot->caption,
                        ],
                    ])->values(),
                ])->values(),
                'packages' => $business->packages->map(fn ($package) => [
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
                    'features' => $package->features->map(fn ($feature) => [
                        'id' => $feature->id,
                        'feature' => $feature->feature,
                        'order_index' => $feature->order_index,
                    ])->values(),
                    'media' => $package->media->map(fn ($media) => [
                        'id' => $media->id,
                        'kind' => $media->kind,
                        'url' => $this->resolveMediaUrl($media->url),
                        'title' => $media->title,
                        'alt_text' => $media->alt_text,
                        'pivot' => [
                            'order_index' => $media->pivot->order_index,
                            'caption' => $media->pivot->caption,
                        ],
                    ])->values(),
                ])->values(),
                'projects' => $business->projects->map(fn ($project) => [
                    'id' => $project->id,
                    'title' => $project->title,
                    'slug' => $project->slug,
                    'category' => $project->category,
                    'location' => $project->location,
                    'summary' => $project->summary,
                    'description' => $project->description,
                    'cta_label' => $project->cta_label,
                    'cta_link' => $project->cta_link,
                    'is_featured' => $project->is_featured,
                    'order_index' => $project->order_index,
                    'meta' => $project->meta,
                    'media' => $project->media->map(fn ($media) => [
                        'id' => $media->id,
                        'kind' => $media->kind,
                        'url' => $this->resolveMediaUrl($media->url),
                        'title' => $media->title,
                        'alt_text' => $media->alt_text,
                        'pivot' => [
                            'order_index' => $media->pivot->order_index,
                            'caption' => $media->pivot->caption,
                        ],
                    ])->values(),
                ])->values(),
                'project_gallery' => $business->projectGallery ? [
                    'id' => $business->projectGallery->id,
                    'title' => $business->projectGallery->title,
                    'description' => $business->projectGallery->description,
                    'items' => $business->projectGallery->items
                        ->sortBy(['order_index', 'id'])
                        ->values()
                        ->map(fn ($item) => [
                            'id' => $item->id,
                            'media_id' => $item->media_id,
                            'media_type' => $item->media_type,
                            'media_url' => $item->media_url,
                            'thumbnail_url' => $item->thumbnail_url,
                            'title' => $item->title,
                            'description' => $item->description,
                            'order_index' => $item->order_index,
                            'meta' => $item->meta,
                        ])->values(),
                ] : null,
            ],
        ]);
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

    protected function resolveMediaUrl(?string $path): ?string
    {
        if (!$path) {
            return null;
        }

        if (preg_match('/^https?:\/\//i', $path)) {
            return $path;
        }

        $normalized = ltrim($path, '/');

        if (!str_starts_with($normalized, 'storage/')) {
            $normalized = 'storage/' . $normalized;
        }

        return url($normalized);
    }
}
