<?php

namespace App\Http\Controllers;

use App\Models\Business;
use App\Models\ProjectGallery;
use App\Models\ProjectGalleryItem;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class ProjectGalleryController extends Controller
{
    public function index(Request $request, Business $business): Response
    {
        $this->authorizeAccess($request->user(), $business);

        $gallery = $business->projectGallery;

        if (! $gallery) {
            $gallery = $business->projectGalleries()->create([
                'title' => __('Project Gallery'),
                'description' => null,
                'order_index' => 0,
            ]);
        }

        $gallery->load(['items' => function ($query) {
            $query->orderBy('order_index')->orderBy('id');
        }]);

        return Inertia::render('vcard-builder/project-gallery-manager', [
            'business' => [
                'id' => $business->id,
                'name' => $business->name,
            ],
            'gallery' => [
                'id' => $gallery->id,
                'title' => $gallery->title,
                'description' => $gallery->description,
            ],
            'items' => $this->transformGalleryItems($gallery),
        ]);
    }

    public function storeItem(Request $request, Business $business, ProjectGallery $gallery): RedirectResponse
    {
        $this->authorizeGallery($request->user(), $business, $gallery);

        $data = $this->validateItem($request);

        $orderIndex = $data['order_index'];
        if ($orderIndex === null) {
            $currentMax = $gallery->items()->max('order_index');
            $orderIndex = is_null($currentMax) ? 0 : $currentMax + 1;
        }

        $item = $gallery->items()->create([
            'media_id' => $data['media_id'] ?? null,
            'media_type' => $data['media_type'],
            'media_url' => $data['media_url'],
            'thumbnail_url' => $data['thumbnail_url'] ?? null,
            'title' => $data['title'] ?? null,
            'description' => $data['description'] ?? null,
            'order_index' => $orderIndex,
            'meta' => $data['meta'] ?? null,
        ]);

        if ($request->expectsJson()) {
            $gallery->refresh()->load(['items' => fn ($query) => $query->orderBy('order_index')->orderBy('id')]);

            return response()->json([
                'message' => __('Gallery item added successfully.'),
                'items' => $this->transformGalleryItems($gallery),
                'item' => $this->transformGalleryItem($item),
            ], 201);
        }

        return back()->with('success', __('Gallery item added successfully.'));
    }

    public function updateItem(Request $request, Business $business, ProjectGallery $gallery, ProjectGalleryItem $item): RedirectResponse
    {
        $this->authorizeGallery($request->user(), $business, $gallery);
        abort_unless($item->gallery_id === $gallery->id, 404);

        $data = $this->validateItem($request, $item->id);

        $item->update([
            'media_id' => $data['media_id'] ?? null,
            'media_type' => $data['media_type'],
            'media_url' => $data['media_url'],
            'thumbnail_url' => $data['thumbnail_url'] ?? null,
            'title' => $data['title'] ?? null,
            'description' => $data['description'] ?? null,
            'order_index' => $data['order_index'] ?? $item->order_index,
            'meta' => $data['meta'] ?? null,
        ]);

        if ($request->expectsJson()) {
            $gallery->load(['items' => fn ($query) => $query->orderBy('order_index')->orderBy('id')]);

            return response()->json([
                'message' => __('Gallery item updated successfully.'),
                'items' => $this->transformGalleryItems($gallery),
                'item' => $this->transformGalleryItem($item->fresh()),
            ]);
        }

        return back()->with('success', __('Gallery item updated successfully.'));
    }

    public function destroyItem(Request $request, Business $business, ProjectGallery $gallery, ProjectGalleryItem $item): RedirectResponse
    {
        $this->authorizeGallery($request->user(), $business, $gallery);
        abort_unless($item->gallery_id === $gallery->id, 404);

        $item->delete();

        if ($request->expectsJson()) {
            $gallery->load(['items' => fn ($query) => $query->orderBy('order_index')->orderBy('id')]);

            return response()->json([
                'message' => __('Gallery item removed successfully.'),
                'items' => $this->transformGalleryItems($gallery),
            ]);
        }

        return back()->with('success', __('Gallery item removed successfully.'));
    }

    public function reorder(Request $request, Business $business, ProjectGallery $gallery): RedirectResponse
    {
        $this->authorizeGallery($request->user(), $business, $gallery);

        $data = $request->validate([
            'order' => 'required|array',
            'order.*' => 'integer',
        ]);

        DB::transaction(function () use ($gallery, $data) {
            foreach ($data['order'] as $index => $itemId) {
                $gallery->items()
                    ->where('id', $itemId)
                    ->update(['order_index' => $index]);
            }
        });

        if ($request->expectsJson()) {
            $gallery->load(['items' => fn ($query) => $query->orderBy('order_index')->orderBy('id')]);

            return response()->json([
                'message' => __('Gallery order updated.'),
                'items' => $this->transformGalleryItems($gallery),
            ]);
        }

        return back()->with('success', __('Gallery order updated.'));
    }

    protected function validateItem(Request $request, ?int $ignoreId = null): array
    {
        $rules = [
            'media_type' => 'required|string|in:image,video',
            'media_url' => 'required|string|max:2048',
            'thumbnail_url' => 'nullable|string|max:2048',
            'title' => 'nullable|string|max:255',
            'description' => 'nullable|string|max:500',
            'order_index' => 'nullable|integer',
            'media_id' => 'nullable|string|max:191',
            'meta' => 'nullable|array',
        ];

        if ($request->input('media_type') === 'video') {
            $rules['media_url'] = 'required|url|max:2048';
        }

        return $request->validate($rules);
    }

    protected function authorizeGallery($user, Business $business, ProjectGallery $gallery): void
    {
        $this->authorizeAccess($user, $business);

        abort_unless($gallery->business_id === $business->id, 404);
    }

    protected function authorizeAccess($user, Business $business): void
    {
        if (! $user) {
            abort(401);
        }

        if ($user->type === 'superadmin') {
            return;
        }

        if ($user->type === 'company' && $business->created_by === $user->id) {
            return;
        }

        if ($user->created_by && $business->created_by === $user->created_by) {
            return;
        }

        abort(403);
    }

    protected function transformGalleryItems(ProjectGallery $gallery)
    {
        return $gallery->items
            ->sortBy(function (ProjectGalleryItem $item) {
                $order = is_null($item->order_index) ? PHP_INT_MAX : $item->order_index;
                return sprintf('%010d-%010d', $order, $item->id);
            })
            ->values()
            ->map(fn (ProjectGalleryItem $item) => $this->transformGalleryItem($item));
    }

    protected function transformGalleryItem(ProjectGalleryItem $item): array
    {
        return [
            'id' => $item->id,
            'media_id' => $item->media_id,
            'media_type' => $item->media_type,
            'media_url' => $item->media_url,
            'thumbnail_url' => $item->thumbnail_url,
            'title' => $item->title,
            'description' => $item->description,
            'order_index' => $item->order_index,
            'meta' => $item->meta,
        ];
    }
}
