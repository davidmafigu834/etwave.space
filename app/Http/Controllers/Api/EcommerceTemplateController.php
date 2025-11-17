<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Business;
use App\Models\Product;
use App\Models\ProductCategory;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class EcommerceTemplateController extends Controller
{
    /**
     * Get products data for ecommerce template
     *
     * @param Request $request
     * @param Business $business
     * @return JsonResponse
     */
    public function getProducts(Request $request, Business $business): JsonResponse
    {
        $this->authorizeBusinessAccess($request->user(), $business);

        $query = $business->products()
            ->with(['category', 'media'])
            ->orderBy('order_index');

        // Apply filters based on template configuration
        $displayMode = $request->get('display_mode', 'featured');
        $categoryId = $request->get('category_id');
        $limit = $request->get('limit', 12);

        switch ($displayMode) {
            case 'featured':
                $query->featured();
                break;
            case 'category':
                if ($categoryId) {
                    $query->where('category_id', $categoryId);
                }
                break;
            case 'all':
            default:
                // No additional filters for 'all'
                break;
        }

        $products = $query->take($limit)->get();

        $formattedProducts = $products->map(function ($product) {
            return [
                'id' => $product->id,
                'name' => $product->name,
                'slug' => $product->slug,
                'price' => $product->price,
                'sale_price' => $product->sale_price,
                'has_discount' => $product->has_discount,
                'display_price' => $product->display_price,
                'sku' => $product->sku,
                'stock_quantity' => $product->stock_quantity,
                'is_featured' => $product->is_featured,
                'short_description' => $product->short_description,
                'description' => $product->description,
                'category' => $product->category ? [
                    'id' => $product->category->id,
                    'name' => $product->category->name,
                    'slug' => $product->category->slug,
                ] : null,
                'images' => $product->media->map(function ($media) {
                    return [
                        'id' => $media->id,
                        'url' => $this->resolveMediaUrl($media->url),
                        'alt_text' => $media->alt_text,
                        'is_primary' => $media->pivot->order_index === 0,
                    ];
                })->values(),
            ];
        });

        return response()->json([
            'success' => true,
            'data' => [
                'products' => $formattedProducts,
                'total' => $products->count(),
                'has_more' => $query->count() > $limit,
            ],
        ]);
    }

    /**
     * Get categories data for ecommerce template
     *
     * @param Request $request
     * @param Business $business
     * @return JsonResponse
     */
    public function getCategories(Request $request, Business $business): JsonResponse
    {
        $this->authorizeBusinessAccess($request->user(), $business);

        $query = $business->categories()
            ->active()
            ->with(['media', 'products' => function ($query) {
                $query->active();
            }])
            ->orderBy('order_index');

        $limit = $request->get('limit', 8);
        $categories = $query->take($limit)->get();

        $formattedCategories = $categories->map(function ($category) {
            return [
                'id' => $category->id,
                'name' => $category->name,
                'slug' => $category->slug,
                'description' => $category->description,
                'product_count' => $category->products->count(),
                'image' => $category->media->first() ? [
                    'id' => $category->media->first()->id,
                    'url' => $this->resolveMediaUrl($category->media->first()->url),
                    'alt_text' => $category->media->first()->alt_text,
                ] : null,
            ];
        });

        return response()->json([
            'success' => true,
            'data' => [
                'categories' => $formattedCategories,
                'total' => $categories->count(),
            ],
        ]);
    }

    /**
     * Get testimonials/reviews data for ecommerce template
     *
     * @param Request $request
     * @param Business $business
     * @return JsonResponse
     */
    public function getTestimonials(Request $request, Business $business): JsonResponse
    {
        $this->authorizeBusinessAccess($request->user(), $business);

        // For now, return empty array as testimonials system might be separate
        // This could be extended to pull from orders, reviews, or a dedicated testimonials table
        return response()->json([
            'success' => true,
            'data' => [
                'testimonials' => [],
                'total' => 0,
            ],
        ]);
    }

    /**
     * Get business stats for template dynamic behavior
     *
     * @param Request $request
     * @param Business $business
     * @return JsonResponse
     */
    public function getStats(Request $request, Business $business): JsonResponse
    {
        $this->authorizeBusinessAccess($request->user(), $business);

        $stats = [
            'has_products' => $business->products()->active()->count() > 0,
            'has_categories' => $business->categories()->active()->count() > 0,
            'has_featured_products' => $business->products()->active()->featured()->count() > 0,
            'product_count' => $business->products()->active()->count(),
            'category_count' => $business->categories()->active()->count(),
        ];

        return response()->json([
            'success' => true,
            'data' => $stats,
        ]);
    }

    /**
     * Authorize business access for the authenticated user.
     *
     * @param $user
     * @param Business $business
     * @return void
     */
    private function authorizeBusinessAccess($user, Business $business): void
    {
        // Public template views should be able to load CRM data without an authenticated user.
        if (!$user) {
            return;
        }

        if ($user->type === 'superadmin') {
            return;
        }

        if ($user->type === 'company') {
            if ($business->created_by === $user->id) {
                return;
            }
            abort(403, 'You do not have permission to access this business.');
        }

        if ($user->created_by && $business->created_by === $user->created_by) {
            return;
        }

        abort(403, 'You do not have permission to access this business.');
    }

    /**
     * Resolve media URL to full path
     *
     * @param string|null $path
     * @return string|null
     */
    private function resolveMediaUrl(?string $path): ?string
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
