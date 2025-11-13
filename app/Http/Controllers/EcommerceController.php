<?php

namespace App\Http\Controllers;

use App\Http\Requests\ProductCategoryRequest;
use App\Models\Business;
use App\Models\Product;
use App\Models\ProductCategory;
use App\Models\Order;
use App\Services\EcommerceService;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class EcommerceController extends Controller
{
    protected $ecommerceService;
    
    public function __construct(EcommerceService $ecommerceService)
    {
        $this->ecommerceService = $ecommerceService;
    }
    
    /**
     * Display the ecommerce dashboard for a business.
     *
     * @param  \App\Models\Business  $business
     * @return \Illuminate\Http\Response
     */
    public function dashboard(Business $business)
    {
        $this->authorizeBusinessAccess($business);
        
        // Get dashboard statistics
        $stats = $this->ecommerceService->getDashboardStats($business);
        
        return Inertia::render('ecommerce/Dashboard', [
            'business' => $business,
            'stats' => $stats,
        ]);
    }
    
    /**
     * Display the product categories index page.
     *
     * @param  \App\Models\Business  $business
     * @return \Illuminate\Http\Response
     */
    public function categoriesIndex(Business $business)
    {
        $this->authorizeBusinessAccess($business);
        
        $categoriesCollection = $business->categories()
            ->with(['parent', 'children'])
            ->ordered()
            ->get();

        $categories = ($categoriesCollection->first() ?? new ProductCategory)->toTree($categoriesCollection);

        return Inertia::render('ecommerce/categories/Index', [
            'business' => $business,
            'categories' => $categories,
        ]);
    }
    
    /**
     * Show the form for creating a new product category.
     *
     * @param  \App\Models\Business  $business
     * @return \Illuminate\Http\Response
     */
    public function categoriesCreate(Business $business)
    {
        $this->authorizeBusinessAccess($business);
        
        $parentCategories = $business->categories()
            ->root()
            ->ordered()
            ->get();
            
        return Inertia::render('ecommerce/categories/Create', [
            'business' => $business,
            'parentCategories' => $parentCategories,
        ]);
    }
    
    /**
     * Store a newly created product category in storage.
     *
     * @param  \App\Http\Requests\ProductCategoryRequest  $request
     * @param  \App\Models\Business  $business
     * @return \Illuminate\Http\Response
     */
    public function categoriesStore(ProductCategoryRequest $request, Business $business)
    {
        $this->authorizeBusinessAccess($business);
        
        $validated = $request->validated();
        
        $category = $business->categories()->create([
            'name' => $validated['name'],
            'slug' => \Illuminate\Support\Str::slug($validated['name']),
            'description' => $validated['description'] ?? null,
            'parent_id' => $validated['parent_id'] ?? null,
            'is_active' => $validated['is_active'] ?? true,
        ]);
        
        return redirect()->route('ecommerce.categories.index', $business)
            ->with('success', 'Category created successfully!');
    }
    
    /**
     * Show the form for editing the specified product category.
     *
     * @param  \App\Models\Business  $business
     * @param  \App\Models\ProductCategory  $category
     * @return \Illuminate\Http\Response
     */
    public function categoriesEdit(Business $business, ProductCategory $category)
    {
        $this->authorizeBusinessAccess($business);
        
        // Ensure category belongs to this business
        if ($category->business_id !== $business->id) {
            abort(404);
        }
        
        $parentCategories = $business->categories()
            ->where('id', '!=', $category->id)
            ->root()
            ->ordered()
            ->get();
            
        return Inertia::render('ecommerce/categories/Edit', [
            'business' => $business,
            'category' => $category,
            'parentCategories' => $parentCategories,
        ]);
    }
    
    /**
     * Update the specified product category in storage.
     *
     * @param  \App\Http\Requests\ProductCategoryRequest  $request
     * @param  \App\Models\Business  $business
     * @param  \App\Models\ProductCategory  $category
     * @return \Illuminate\Http\Response
     */
    public function categoriesUpdate(ProductCategoryRequest $request, Business $business, ProductCategory $category)
    {
        $this->authorizeBusinessAccess($business);
        
        // Ensure category belongs to this business
        if ($category->business_id !== $business->id) {
            abort(404);
        }
        
        $validated = $request->validated();
        
        $category->update([
            'name' => $validated['name'],
            'slug' => \Illuminate\Support\Str::slug($validated['name']),
            'description' => $validated['description'] ?? null,
            'parent_id' => $validated['parent_id'] ?? null,
            'is_active' => $validated['is_active'] ?? true,
        ]);
        
        return redirect()->route('ecommerce.categories.index', $business)
            ->with('success', 'Category updated successfully!');
    }
    
    /**
     * Remove the specified product category from storage.
     *
     * @param  \App\Models\Business  $business
     * @param  \App\Models\ProductCategory  $category
     * @return \Illuminate\Http\Response
     */
    public function categoriesDestroy(Business $business, ProductCategory $category)
    {
        $this->authorizeBusinessAccess($business);
        
        // Ensure category belongs to this business
        if ($category->business_id !== $business->id) {
            abort(404);
        }
        
        // Don't delete categories with products
        if ($category->products()->count() > 0) {
            return redirect()->back()
                ->with('error', 'Cannot delete category with products. Please move or delete products first.');
        }
        
        $category->delete();
        
        return redirect()->route('ecommerce.categories.index', $business)
            ->with('success', 'Category deleted successfully!');
    }
    
    /**
     * Authorize business access for the authenticated user.
     *
     * @param  \App\Models\Business  $business
     * @return void
     */
    private function authorizeBusinessAccess(Business $business)
    {
        $user = auth()->user();
        
        if ($user->type === 'company') {
            if ($business->created_by !== $user->id) {
                abort(403, 'You do not have permission to access this business.');
            }
        } else {
            if ($business->created_by !== $user->created_by) {
                abort(403, 'You do not have permission to access this business.');
            }
        }
    }
}
