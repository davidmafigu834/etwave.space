<?php

namespace App\Http\Controllers;

use App\Http\Requests\OrderStatusRequest;
use App\Models\Business;
use App\Models\Order;
use Inertia\Inertia;

class OrderController extends Controller
{
    /**
     * Display a listing of the orders.
     *
     * @param  \App\Models\Business  $business
     * @return \Illuminate\Http\Response
     */
    public function index(Business $business)
    {
        $this->authorizeBusinessAccess($business);
        
        $orders = $business->orders()
            ->with(['items'])
            ->recent()
            ->paginate(20);
            
        return Inertia::render('ecommerce/orders/Index', [
            'business' => $business,
            'orders' => $orders,
        ]);
    }
    
    /**
     * Display the specified order.
     *
     * @param  \App\Models\Business  $business
     * @param  \App\Models\Order  $order
     * @return \Illuminate\Http\Response
     */
    public function show(Business $business, Order $order)
    {
        $this->authorizeBusinessAccess($business);
        
        // Ensure order belongs to this business
        if ($order->business_id !== $business->id) {
            abort(404);
        }
        
        $order->load(['items.product']);
            
        return Inertia::render('ecommerce/orders/Show', [
            'business' => $business,
            'order' => $order,
        ]);
    }
    
    /**
     * Update the status of the specified order.
     *
     * @param  \App\Http\Requests\OrderStatusRequest  $request
     * @param  \App\Models\Business  $business
     * @param  \App\Models\Order  $order
     * @return \Illuminate\Http\Response
     */
    public function updateStatus(OrderStatusRequest $request, Business $business, Order $order)
    {
        $this->authorizeBusinessAccess($business);
        
        // Ensure order belongs to this business
        if ($order->business_id !== $business->id) {
            abort(404);
        }
        
        $validated = $request->validated();
        
        $order->update([
            'status' => $validated['status'],
        ]);
        
        return redirect()->back()
            ->with('success', 'Order status updated successfully!');
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
