<?php

namespace App\Http\Controllers;

use App\Models\Payment;
use App\Models\Plan;
use App\Models\PlanOrder;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Auth;

class SimplePaynowController extends Controller
{
    /**
     * Create a simple Paynow payment for plan subscription
     */
    public function createPayment(Request $request)
    {
        // Debug: Log detailed authentication information
        \Log::info('=== PAYMENT AUTH DEBUG ===');
        \Log::info('Auth check: ' . (Auth::check() ? 'true' : 'false'));
        \Log::info('User ID: ' . (Auth::check() ? Auth::id() : 'null'));
        \Log::info('Request method: ' . $request->method());
        \Log::info('Request headers: ' . json_encode($request->headers->all()));
        \Log::info('Session ID: ' . ($request->session()->getId() ?? 'null'));
        \Log::info('Session data: ' . json_encode($request->session()->all()));
        \Log::info('Request URL: ' . $request->fullUrl());
        
        // Check if user is authenticated
        if (!Auth::check()) {
            \Log::error('User not authenticated - returning 401');
            return response()->json(['error' => 'User not authenticated'], 401);
        }
        
        // Get the authenticated user
        $user = Auth::user();
        \Log::info('Authenticated user: ' . $user->id . ' - ' . $user->email);
        
        // Validate the request
        $validated = $request->validate([
            'plan_id' => 'required|exists:plans,id',
            'amount' => 'required|numeric|min:0.01',
            'billing_cycle' => 'required|in:monthly,yearly',
            'coupon_code' => 'nullable|string',
            'email' => 'required|email',
            'description' => 'required|string|max:255',
        ]);

        // Get the plan
        $plan = Plan::findOrFail($validated['plan_id']);
        
        // Generate a unique reference
        $reference = 'PN-' . strtoupper(Str::random(8));
        
        // Create a payment record
        $payment = Payment::create([
            'reference' => $reference,
            'amount' => $validated['amount'],
            'description' => $validated['description'],
            'email' => $validated['email'],
            'status' => 'pending',
        ]);

        // Create a pending plan order
        $planOrder = PlanOrder::create([
            'user_id' => $user->id,
            'plan_id' => $plan->id,
            'billing_cycle' => $validated['billing_cycle'],
            'coupon_code' => $validated['coupon_code'] ?? null,
            'payment_method' => 'paynow',
            'payment_id' => $reference,
            'original_price' => $validated['amount'],
            'discount_amount' => 0,
            'final_price' => $validated['amount'],
            'status' => 'pending',
        ]);

        // Generate the Paynow payment link
        $paynowLink = $this->generatePaynowLink($payment);

        return response()->json([
            'success' => true,
            'reference' => $reference,
            'payment_link' => $paynowLink,
            'payment_id' => $payment->id,
        ]);
    }

    /**
     * Generate a Paynow payment link
     */
    private function generatePaynowLink($payment)
    {
        // Base URL for Paynow payment links
        $baseUrl = 'https://www.paynow.co.zw/Payment/Link/?q=';
        
        // Parameters for the payment
        $params = [
            'search' => $payment->email,
            'amount' => $payment->amount,
            'reference' => $payment->reference,
            'l' => 1
        ];
        
        // Build the query string
        $queryString = http_build_query($params);
        
        // Encode the query string (this is what Paynow does)
        $encodedQuery = base64_encode($queryString);
        
        return $baseUrl . urlencode($encodedQuery);
    }

    /**
     * Handle payment callback from Paynow
     */
    public function handleCallback(Request $request)
    {
        // In a real implementation, Paynow would send a callback with status updates
        // For this simple implementation, we'll create a manual verification endpoint
        
        $reference = $request->query('reference');
        
        if (!$reference) {
            return response()->json(['error' => 'Reference is required'], 400);
        }
        
        $payment = Payment::where('reference', $reference)->first();
        
        if (!$payment) {
            return response()->json(['error' => 'Payment not found'], 404);
        }
        
        // In a real implementation, you would verify the payment with Paynow's API
        // For now, we'll just return the current status
        
        return response()->json([
            'reference' => $payment->reference,
            'status' => $payment->status,
            'amount' => $payment->amount,
            'description' => $payment->description,
        ]);
    }

    /**
     * Manually verify payment status
     */
    public function verifyPayment(Request $request)
    {
        $reference = $request->query('reference');
        
        if (!$reference) {
            return response()->json(['error' => 'Reference is required'], 400);
        }
        
        $payment = Payment::where('reference', $reference)->first();
        
        if (!$payment) {
            return response()->json(['error' => 'Payment not found'], 404);
        }
        
        // In a real implementation, you would:
        // 1. Call Paynow's API to check the payment status
        // 2. Update the payment record in your database
        // 3. Return the updated status
        
        // For demonstration, we'll simulate a successful payment
        if ($payment->status === 'pending') {
            $payment->update(['status' => 'paid']);
        }
        
        return response()->json([
            'reference' => $payment->reference,
            'status' => $payment->status,
            'amount' => $payment->amount,
            'description' => $payment->description,
            'message' => 'Payment status updated',
        ]);
    }

    /**
     * Get payment status
     */
    public function getPaymentStatus(Request $request)
    {
        $reference = $request->query('reference');
        
        if (!$reference) {
            return response()->json(['error' => 'Reference is required'], 400);
        }
        
        $payment = Payment::where('reference', $reference)->first();
        
        if (!$payment) {
            return response()->json(['error' => 'Payment not found'], 404);
        }
        
        return response()->json([
            'reference' => $payment->reference,
            'status' => $payment->status,
            'amount' => $payment->amount,
            'description' => $payment->description,
        ]);
    }

    /**
     * Complete payment and activate subscription
     */
    public function completePayment(Request $request)
    {
        $reference = $request->query('reference');
        
        if (!$reference) {
            return response()->json(['error' => 'Reference is required'], 400);
        }
        
        $payment = Payment::where('reference', $reference)->first();
        
        if (!$payment) {
            return response()->json(['error' => 'Payment not found'], 404);
        }
        
        // Update payment status
        $payment->update(['status' => 'paid']);
        
        // Find the associated plan order
        $planOrder = PlanOrder::where('payment_id', $reference)->first();
        
        if ($planOrder) {
            // Approve the plan order
            $planOrder->update([
                'status' => 'approved',
                'processed_at' => now(),
            ]);
            
            // Activate the subscription
            $planOrder->activateSubscription();
        }
        
        return response()->json([
            'success' => true,
            'message' => 'Payment completed and subscription activated',
            'reference' => $payment->reference,
            'status' => $payment->status,
        ]);
    }

    /**
     * Show the payment demo page
     */
    public function showPaymentDemo()
    {
        return view('paynow-payment-demo');
    }
}
