<?php

namespace App\Http\Controllers;

use App\Models\Coupon;
use App\Models\PaymentSetting;
use App\Models\Plan;
use App\Models\PlanOrder;
use App\Models\Setting;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Str;

class PaynowPaymentController extends Controller
{
    protected string $initiateEndpoint = 'https://www.paynow.co.zw/interface/initiatetransaction';

    public function createPayment(Request $request)
    {
        $validated = $this->validatePaymentRequest($request);

        try {
            $plan = Plan::findOrFail($validated['plan_id']);
            $pricing = $this->calculatePlanPricing($plan, $validated['coupon_code'] ?? null, $validated['billing_cycle']);
            $paymentSettings = $this->getPaymentSettings();

            if (empty($paymentSettings['paynow_merchant_id']) || empty($paymentSettings['paynow_integration_key'])) {
                return response()->json(['error' => __('Paynow gateway is not configured')], 400);
            }

            if ($pricing['final_price'] <= 0) {
                return response()->json(['error' => __('Amount must be greater than zero for Paynow payments')], 422);
            }

            $reference = 'PN-' . Str::upper(Str::random(10));
            $user = $request->user();

            $this->createPlanOrder([
                'user_id' => $user->id,
                'plan_id' => $plan->id,
                'billing_cycle' => $validated['billing_cycle'],
                'payment_method' => 'paynow',
                'coupon_code' => $validated['coupon_code'] ?? null,
                'payment_id' => $reference,
                'status' => 'pending',
            ]);

            $payload = [
                'id' => $paymentSettings['paynow_merchant_id'],
                'reference' => $reference,
                'amount' => number_format($pricing['final_price'], 2, '.', ''),
                'additionalinfo' => $plan->name . ' - ' . ucfirst($validated['billing_cycle']),
                'returnurl' => route('paynow.success'),
                'resulturl' => route('paynow.callback'),
            ];

            if (!empty($user->email)) {
                $payload['authemail'] = $user->email;
            }

            if (!empty($user->phone)) {
                $payload['authphone'] = $user->phone;
            }

            $payload['hash'] = $this->createHash($payload, $paymentSettings['paynow_integration_key']);

            $response = Http::asForm()->post($this->initiateEndpoint, $payload);

            if (!$response->ok()) {
                \Log::error('Paynow initiation HTTP error', [
                    'status' => $response->status(),
                    'body' => $response->body(),
                ]);

                return response()->json([
                    'error' => __('Failed to initiate Paynow transaction (HTTP :status)', ['status' => $response->status()]),
                ], 500);
            }

            parse_str($response->body(), $responseData);

            if (!isset($responseData['status']) || strtolower($responseData['status']) !== 'ok') {
                \Log::warning('Paynow initiation returned non-ok status', [
                    'response' => $responseData,
                    'raw' => $response->body(),
                ]);

                return response()->json([
                    'error' => $responseData['error'] ?? __('Paynow returned an error'),
                    'details' => $responseData,
                ], 422);
            }

            return response()->json([
                'success' => true,
                'redirect_url' => $responseData['browserurl'] ?? null,
                'poll_url' => $responseData['pollurl'] ?? null,
                'reference' => $reference,
            ]);
        } catch (\Exception $exception) {
            \Log::error('Paynow create payment error', [
                'message' => $exception->getMessage(),
            ]);
            return response()->json(['error' => __('Payment creation failed')], 500);
        }
    }

    public function success(Request $request)
    {
        $reference = $request->input('reference');

        if ($reference) {
            $order = PlanOrder::where('payment_id', $reference)->first();
            if ($order && $order->status === 'approved') {
                return redirect()->route('plans.index')->with('success', __('Payment successful and plan activated'));
            }
        }

        return redirect()->route('plans.index')->with('info', __('Your Paynow transaction is being verified. You will receive an update shortly.'));
    }

    public function callback(Request $request)
    {
        $settings = getPaymentGatewaySettings();
        $paymentSettings = $settings['payment_settings'] ?? [];
        $integrationKey = $paymentSettings['paynow_integration_key'] ?? null;

        if (!$integrationKey) {
            return response('Gateway not configured', 500);
        }

        $payload = $request->all();
        $receivedHash = $payload['hash'] ?? '';
        unset($payload['hash']);

        $expectedHash = $this->createHash($payload, $integrationKey);
        if (!hash_equals($expectedHash, $receivedHash)) {
            return response('Invalid hash', 400);
        }

        $reference = $payload['reference'] ?? null;
        if (!$reference) {
            return response('Missing reference', 400);
        }

        $order = PlanOrder::where('payment_id', $reference)->first();
        if (!$order) {
            return response('Order not found', 404);
        }

        $status = strtolower($payload['status'] ?? '');
        if ($status === 'paid') {
            if ($order->status !== 'approved') {
                $order->update([
                    'status' => 'approved',
                    'processed_at' => now(),
                ]);
                assignPlanToUser($order->user, $order->plan, $order->billing_cycle);
            }
        } elseif ($status === 'cancelled' || $status === 'failed') {
            $order->update([
                'status' => 'rejected',
                'processed_at' => now(),
            ]);
        }

        return response('OK', 200);
    }

    protected function createHash(array $data, string $integrationKey): string
    {
        ksort($data);
        $query = http_build_query($data);
        return hash('sha512', $query . $integrationKey);
    }

    protected function validatePaymentRequest(Request $request, array $additionalRules = []): array
    {
        $baseRules = [
            'plan_id' => 'required|exists:plans,id',
            'billing_cycle' => 'required|in:monthly,yearly',
            'coupon_code' => 'nullable|string',
        ];

        return $request->validate(array_merge($baseRules, $additionalRules));
    }

    protected function calculatePlanPricing(Plan $plan, ?string $couponCode, string $billingCycle): array
    {
        $originalPrice = $plan->getPriceForCycle($billingCycle);
        $discountAmount = 0;
        $couponId = null;

        if ($couponCode) {
            $coupon = Coupon::where('code', $couponCode)
                ->where('status', 1)
                ->first();

            if ($coupon) {
                if ($coupon->type === 'percentage') {
                    $discountAmount = ($originalPrice * $coupon->discount_amount) / 100;
                } else {
                    $discountAmount = min($coupon->discount_amount, $originalPrice);
                }
                $couponId = $coupon->id;
            }
        }

        $finalPrice = max(0, $originalPrice - $discountAmount);

        return [
            'original_price' => $originalPrice,
            'discount_amount' => $discountAmount,
            'final_price' => $finalPrice,
            'coupon_id' => $couponId,
            'is_free' => $finalPrice <= 0,
        ];
    }

    protected function getPaymentSettings(): array
    {
        $superAdmin = User::where('type', 'superadmin')->first();

        if (!$superAdmin) {
            return [];
        }

        return PaymentSetting::getUserSettings($superAdmin->id);
    }

    protected function createPlanOrder(array $data): PlanOrder
    {
        $plan = Plan::findOrFail($data['plan_id']);
        $pricing = $this->calculatePlanPricing($plan, $data['coupon_code'] ?? null, $data['billing_cycle']);

        return PlanOrder::create([
            'user_id' => $data['user_id'],
            'plan_id' => $plan->id,
            'coupon_id' => $pricing['coupon_id'],
            'billing_cycle' => $data['billing_cycle'],
            'payment_method' => $data['payment_method'],
            'coupon_code' => $data['coupon_code'] ?? null,
            'original_price' => $pricing['original_price'],
            'discount_amount' => $pricing['discount_amount'],
            'final_price' => $pricing['final_price'],
            'payment_id' => $data['payment_id'],
            'status' => $data['status'] ?? 'pending',
            'ordered_at' => now(),
        ]);
    }
}
