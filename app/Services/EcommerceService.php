<?php

namespace App\Services;

use App\Models\Business;
use App\Models\Product;
use App\Models\ProductCategory;
use App\Models\Order;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class EcommerceService
{
    /**
     * Get dashboard statistics for a business
     *
     * @param Business $business
     * @return array
     */
    public function getDashboardStats(Business $business)
    {
        return [
            'total_products' => $business->products()->count(),
            'total_categories' => $business->categories()->count(),
            'total_orders' => $business->orders()->count(),
            'pending_orders' => $business->orders()->byStatus(Order::STATUS_PENDING)->count(),
            'total_revenue' => $business->orders()->where('status', '!=', Order::STATUS_CANCELLED)->sum('total_amount'),
            'recent_orders' => $business->orders()->recent()->limit(5)->get(),
        ];
    }
    
    /**
     * Get product statistics for a business
     *
     * @param Business $business
     * @return array
     */
    public function getProductStats(Business $business)
    {
        return [
            'total_products' => $business->products()->count(),
            'active_products' => $business->products()->active()->count(),
            'featured_products' => $business->products()->featured()->count(),
            'out_of_stock' => $business->products()->where('stock_quantity', 0)->count(),
            'low_stock' => $business->products()->where('stock_quantity', '>', 0)->where('stock_quantity', '<=', 5)->count(),
        ];
    }
    
    /**
     * Get order statistics for a business
     *
     * @param Business $business
     * @return array
     */
    public function getOrderStats(Business $business)
    {
        $orders = $business->orders();
        
        return [
            'total_orders' => $orders->count(),
            'pending_orders' => $orders->byStatus(Order::STATUS_PENDING)->count(),
            'processing_orders' => $orders->byStatus(Order::STATUS_PROCESSING)->count(),
            'shipped_orders' => $orders->byStatus(Order::STATUS_SHIPPED)->count(),
            'delivered_orders' => $orders->byStatus(Order::STATUS_DELIVERED)->count(),
            'cancelled_orders' => $orders->byStatus(Order::STATUS_CANCELLED)->count(),
            'refunded_orders' => $orders->byStatus(Order::STATUS_REFUNDED)->count(),
        ];
    }
    
    /**
     * Get revenue statistics for a business
     *
     * @param Business $business
     * @param string $period
     * @return array
     */
    public function getRevenueStats(Business $business, $period = 'month')
    {
        $query = $business->orders()
            ->selectRaw('DATE(created_at) as date, SUM(total_amount) as revenue')
            ->where('status', '!=', Order::STATUS_CANCELLED)
            ->groupBy('date')
            ->orderBy('date');
            
        switch ($period) {
            case 'week':
                $query->where('created_at', '>=', now()->subWeek());
                break;
            case 'month':
                $query->where('created_at', '>=', now()->subMonth());
                break;
            case 'year':
                $query->where('created_at', '>=', now()->subYear());
                break;
        }
        
        return $query->get();
    }
    
    /**
     * Get top selling products for a business
     *
     * @param Business $business
     * @param int $limit
     * @return \Illuminate\Database\Eloquent\Collection
     */
    public function getTopSellingProducts(Business $business, $limit = 10)
    {
        return Product::select('products.*', DB::raw('SUM(order_items.quantity) as total_sold'))
            ->join('order_items', 'products.id', '=', 'order_items.product_id')
            ->join('orders', 'order_items.order_id', '=', 'orders.id')
            ->where('products.business_id', $business->id)
            ->where('orders.status', '!=', Order::STATUS_CANCELLED)
            ->groupBy('products.id')
            ->orderBy('total_sold', 'desc')
            ->limit($limit)
            ->get();
    }
    
    /**
     * Get category performance statistics
     *
     * @param Business $business
     * @return \Illuminate\Database\Eloquent\Collection
     */
    public function getCategoryPerformance(Business $business)
    {
        return ProductCategory::select('product_categories.*', DB::raw('COUNT(products.id) as product_count'))
            ->leftJoin('products', 'product_categories.id', '=', 'products.category_id')
            ->where('product_categories.business_id', $business->id)
            ->groupBy('product_categories.id')
            ->orderBy('product_count', 'desc')
            ->get();
    }
    
    /**
     * Update product stock quantity
     *
     * @param Product $product
     * @param int $quantity
     * @param string $operation
     * @return bool
     */
    public function updateProductStock(Product $product, $quantity, $operation = 'decrease')
    {
        try {
            if ($operation === 'decrease') {
                if ($product->stock_quantity < $quantity) {
                    return false; // Not enough stock
                }
                $product->decrement('stock_quantity', $quantity);
            } else {
                $product->increment('stock_quantity', $quantity);
            }
            
            return true;
        } catch (\Exception $e) {
            Log::error('Error updating product stock: ' . $e->getMessage());
            return false;
        }
    }
    
    /**
     * Calculate order totals
     *
     * @param array $items
     * @param float $taxRate
     * @param float $shippingCost
     * @param float $discount
     * @return array
     */
    public function calculateOrderTotals($items, $taxRate = 0.0, $shippingCost = 0.0, $discount = 0.0)
    {
        $subtotal = 0;
        
        foreach ($items as $item) {
            $subtotal += $item['unit_price'] * $item['quantity'];
        }
        
        $taxAmount = $subtotal * $taxRate;
        $total = $subtotal + $taxAmount + $shippingCost - $discount;
        
        return [
            'subtotal' => round($subtotal, 2),
            'tax_amount' => round($taxAmount, 2),
            'shipping_amount' => round($shippingCost, 2),
            'discount_amount' => round($discount, 2),
            'total_amount' => round($total, 2),
        ];
    }
}
