<?php

namespace App\Http\Controllers;

use App\Models\Business;
use App\Models\BusinessProject;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class BusinessProjectManagerController extends Controller
{
    public function index(Request $request, Business $business): Response
    {
        $this->authorizeAccess($request->user(), $business);

        $business->load([
            'projects' => fn ($query) => $query->orderBy('order_index')->orderBy('id'),
        ]);

        return Inertia::render('vcard-builder/projects-manager', [
            'business' => [
                'id' => $business->id,
                'name' => $business->name,
                'business_type' => $business->business_type,
            ],
            'projects' => $business->projects->map(function (BusinessProject $project) {
                return [
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
                ];
            })->values(),
        ]);
    }

    public function store(Request $request, Business $business): RedirectResponse
    {
        $this->authorizeAccess($request->user(), $business);

        $data = $this->validateProject($request);

        $slug = $data['slug'] ?? Str::slug($data['title']);
        $slug = $this->ensureUniqueProjectSlug($business, $slug);

        $nextOrder = $data['order_index'];
        if ($nextOrder === null) {
            $currentMax = $business->projects()->max('order_index');
            $nextOrder = is_null($currentMax) ? 0 : $currentMax + 1;
        }

        $business->projects()->create([
            'title' => $data['title'],
            'slug' => $slug,
            'category' => $data['category'] ?? null,
            'location' => $data['location'] ?? null,
            'summary' => $data['summary'] ?? null,
            'description' => $data['description'] ?? null,
            'cta_label' => $data['cta_label'] ?? null,
            'cta_link' => $data['cta_link'] ?? null,
            'is_featured' => (bool) ($data['is_featured'] ?? false),
            'order_index' => $nextOrder,
            'meta' => $data['meta'] ?? null,
        ]);

        return back()->with('success', __('Project saved successfully.'));
    }

    public function update(Request $request, Business $business, BusinessProject $project): RedirectResponse
    {
        $this->authorizeAccess($request->user(), $business);
        abort_unless($project->business_id === $business->id, 404);

        $data = $this->validateProject($request, $project->id);

        $slug = $data['slug'] ?? Str::slug($data['title']);
        $slug = $this->ensureUniqueProjectSlug($business, $slug, $project->id);

        $project->update([
            'title' => $data['title'],
            'slug' => $slug,
            'category' => $data['category'] ?? null,
            'location' => $data['location'] ?? null,
            'summary' => $data['summary'] ?? null,
            'description' => $data['description'] ?? null,
            'cta_label' => $data['cta_label'] ?? null,
            'cta_link' => $data['cta_link'] ?? null,
            'is_featured' => (bool) ($data['is_featured'] ?? false),
            'order_index' => $data['order_index'],
            'meta' => $data['meta'] ?? null,
        ]);

        return back()->with('success', __('Project updated successfully.'));
    }

    public function destroy(Request $request, Business $business, BusinessProject $project): RedirectResponse
    {
        $this->authorizeAccess($request->user(), $business);
        abort_unless($project->business_id === $business->id, 404);

        $project->delete();

        return back()->with('success', __('Project removed successfully.'));
    }

    protected function validateProject(Request $request, ?int $projectId = null): array
    {
        return $request->validate([
            'title' => 'required|string|max:255',
            'slug' => 'nullable|string|max:255',
            'category' => 'nullable|string|max:255',
            'location' => 'nullable|string|max:255',
            'summary' => 'nullable|string|max:500',
            'description' => 'nullable|string',
            'cta_label' => 'nullable|string|max:255',
            'cta_link' => 'nullable|url|max:500',
            'is_featured' => 'sometimes|boolean',
            'order_index' => 'nullable|integer',
            'meta' => 'nullable|array',
        ]);
    }

    protected function ensureUniqueProjectSlug(Business $business, string $slug, ?int $ignoreId = null): string
    {
        $baseSlug = Str::slug($slug) ?: Str::random(8);
        $candidate = $baseSlug;
        $suffix = 1;

        while (
            $business->projects()
                ->when($ignoreId, fn ($query) => $query->where('id', '!=', $ignoreId))
                ->where('slug', $candidate)
                ->exists()
        ) {
            $candidate = $baseSlug . '-' . $suffix;
            $suffix++;
        }

        return $candidate;
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
}
