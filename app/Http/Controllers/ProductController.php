<?php

namespace App\Http\Controllers;

use App\Http\Requests\ProductRequest;
use App\Models\Business;
use App\Models\Product;
use App\Models\ProductCategory;
use Inertia\Inertia;

class ProductController extends Controller
{
    /**
     * Display a listing of the products.
     *
     * @param  \App\Models\Business  $business
     * @return \Illuminate\Http\Response
     */
    public function index(Business $business)
    {
        $this->authorizeBusinessAccess($business);
        
        $products = $business->products()
            ->with(['category'])
            ->ordered()
            ->paginate(20);
            
        return Inertia::render('ecommerce/products/Index', [
            'business' => $business,
            'products' => $products,
        ]);
    }
    
    /**
     * Show the form for creating a new product.
     *
     * @param  \App\Models\Business  $business
     * @return \Illuminate\Http\Response
     */
    public function create(Business $business)
    {
        $this->authorizeBusinessAccess($business);
        
        $categories = $business->categories()
            ->active()
            ->ordered()
            ->get();
            
        return Inertia::render('ecommerce/products/Create', [
            'business' => $business,
            'categories' => $categories,
        ]);
    }
    
    /**
     * Store a newly created product in storage.
     *
     * @param  \App\Http\Requests\ProductRequest  $request
     * @param  \App\Models\Business  $business
     * @return \Illuminate\Http\Response
     */
    public function store(ProductRequest $request, Business $business)
    {
        $this->authorizeBusinessAccess($business);
        
        $validated = $request->validated();
        
        $product = $business->products()->create([
            'name' => $validated['name'],
            'slug' => \Illuminate\Support\Str::slug($validated['name']),
            'description' => $validated['description'] ?? null,
            'short_description' => $validated['short_description'] ?? null,
            'category_id' => $validated['category_id'] ?? null,
            'price' => $validated['price'],
            'sale_price' => $validated['sale_price'] ?? null,
            'sku' => $validated['sku'],
            'stock_quantity' => $validated['stock_quantity'],
            'is_featured' => $validated['is_featured'] ?? false,
            'is_active' => $validated['is_active'] ?? true,
        ]);
        
        return redirect()->route('ecommerce.products.index', $business)
            ->with('success', 'Product created successfully!');
    }
    
    /**
     * Show the form for editing the specified product.
     *
     * @param  \App\Models\Business  $business
     * @param  \App\Models\Product  $product
     * @return \Illuminate\Http\Response
     */
    public function edit(Business $business, Product $product)
    {
        $this->authorizeBusinessAccess($business);
        
        // Ensure product belongs to this business
        if ($product->business_id !== $business->id) {
            abort(404);
        }
        
        $categories = $business->categories()
            ->active()
            ->ordered()
            ->get();
            
        return Inertia::render('ecommerce/products/Edit', [
            'business' => $business,
            'product' => $product,
            'categories' => $categories,
        ]);
    }
    
    /**
     * Update the specified product in storage.
     *
     * @param  \App\Http\Requests\ProductRequest  $request
     * @param  \App\Models\Business  $business
     * @param  \App\Models\Product  $product
     * @return \Illuminate\Http\Response
     */
    public function update(ProductRequest $request, Business $business, Product $product)
    {
        $this->authorizeBusinessAccess($business);
        
        // Ensure product belongs to this business
        if ($product->business_id !== $business->id) {
            abort(404);
        }
        
        $validated = $request->validated();
        
        $product->update([
            'name' => $validated['name'],
            'slug' => \Illuminate\Support\Str::slug($validated['name']),
            'description' => $validated['description'] ?? null,
            'short_description' => $validated['short_description'] ?? null,
            'category_id' => $validated['category_id'] ?? null,
            'price' => $validated['price'],
            'sale_price' => $validated['sale_price'] ?? null,
            'sku' => $validated['sku'],
            'stock_quantity' => $validated['stock_quantity'],
            'is_featured' => $validated['is_featured'] ?? false,
            'is_active' => $validated['is_active'] ?? true,
        ]);
        
        return redirect()->route('ecommerce.products.index', $business)
            ->with('success', 'Product updated successfully!');
    }
    
    /**
     * Remove the specified product from storage.
     *
     * @param  \App\Models\Business  $business
     * @param  \App\Models\Product  $product
     * @return \Illuminate\Http\Response
     */
    public function destroy(Business $business, Product $product)
    {
        $this->authorizeBusinessAccess($business);
        
        // Ensure product belongs to this business
        if ($product->business_id !== $business->id) {
            abort(404);
        }
        
        $product->delete();
        
        return redirect()->route('ecommerce.products.index', $business)
            ->with('success', 'Product deleted successfully!');
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
