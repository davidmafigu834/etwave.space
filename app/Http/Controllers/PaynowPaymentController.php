<?php

namespace App\Http\Controllers;

use App\Models\Coupon;
use App\Models\PaymentSetting;
use App\Models\Plan;
use App\Models\PlanOrder;
use App\Models\Setting;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Paynow\Payments\Paynow;

class PaynowPaymentController extends Controller
{
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

            $order = $this->createPlanOrder([
                'user_id' => $user->id,
                'plan_id' => $plan->id,
                'billing_cycle' => $validated['billing_cycle'],
                'payment_method' => 'paynow',
                'coupon_code' => $validated['coupon_code'] ?? null,
                'payment_id' => $reference,
                'status' => 'pending',
            ]);

            $paynow = new Paynow(
                $paymentSettings['paynow_merchant_id'],
                $paymentSettings['paynow_integration_key'],
                route('paynow.callback'),
                route('paynow.success')
            );

            if (!empty($user->email)) {
                $paynow->setAuthEmail($user->email);
            }

            $authPhone = $user->phone ?? null;
            if (!empty($authPhone)) {
                $paynow->setAuthPhone($authPhone);
            }

            $paynowMode = $paymentSettings['paynow_mode'] ?? 'test';
            $testEmail = $paymentSettings['paynow_test_email'] ?? null;

            if ($paynowMode === 'test' && empty($testEmail)) {
                $testEmail = 'ddstarbelieveit@gmail.com';
            }

            $channel = $validated['paynow_channel'] ?? 'redirect';
            $mobilePhone = $validated['mobile_phone'] ?? null;
            $mobileMethod = $validated['mobile_method'] ?? null;

            if ($paynowMode === 'test' && !empty($testEmail)) {
                $paynow->setAuthEmail($testEmail);
                if (empty($mobilePhone)) {
                    $mobilePhone = '0771111111';
                }
                $paynow->setAuthPhone($mobilePhone);
            }

            $paymentAuthEmail = $user->email ?? null;
            if ($paynowMode === 'test' && !empty($testEmail)) {
                $paymentAuthEmail = $testEmail;
            }

            $payment = $paynow->createPayment($reference, $paymentAuthEmail);
            $payment->add($plan->name . ' - ' . ucfirst($validated['billing_cycle']), $pricing['final_price']);

            if ($channel === 'mobile') {
                if (!$mobilePhone || !$mobileMethod) {
                    throw new \InvalidArgumentException('Mobile payment requires phone number and method.');
                }
                $response = $paynow->sendMobile($payment, $mobilePhone, $mobileMethod);
            } else {
                $response = $paynow->send($payment);
            }

            if (!$response->success()) {
                $responseData = $response->data();
                $errorMessage = $responseData['error'] ?? implode(', ', $response->errors()) ?? __('Paynow returned an error');
                
                \Log::warning('Paynow initiation returned non-ok status', [
                    'messages' => $response->errors(),
                    'data' => $responseData,
                ]);

                return response()->json([
                    'error' => $errorMessage,
                    'details' => $responseData,
                ], 422);
            }

            $redirectUrl = $response->redirectUrl();
            $pollUrl = $response->pollUrl();
            $instructions = method_exists($response, 'instructions') ? $response->instructions() : null;

            if (!empty($pollUrl) && isset($order)) {
                $this->appendOrderNote($order, sprintf('Paynow poll URL (%s): %s', $reference, $pollUrl));
            }

            if ($channel === 'mobile' && isset($order)) {
                $this->appendOrderNote($order, sprintf('Paynow mobile express via %s to %s', strtoupper((string) $mobileMethod), $mobilePhone));
                if (!empty($instructions)) {
                    $instructionNote = is_array($instructions) ? implode(' | ', $instructions) : (string) $instructions;
                    $this->appendOrderNote($order, 'Paynow instructions: ' . $instructionNote);
                }
            }

            return response()->json([
                'success' => true,
                'mode' => $channel,
                'redirect_url' => $channel === 'mobile' ? null : $redirectUrl,
                'poll_url' => $pollUrl,
                'reference' => $reference,
                'instructions' => $channel === 'mobile' ? $instructions : null,
                'test_mode' => $paynowMode === 'test',
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
            'paynow_channel' => 'nullable|in:redirect,mobile',
            'mobile_phone' => ['required_if:paynow_channel,mobile', 'string', 'max:20'],
            'mobile_method' => 'required_if:paynow_channel,mobile|in:ecocash,onemoney',
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

    protected function appendOrderNote(PlanOrder $order, string $message): void
    {
        $timestampedMessage = sprintf('[%s] %s', now()->toDateTimeString(), $message);
        $notes = $order->notes ? $order->notes . PHP_EOL . $timestampedMessage : $timestampedMessage;
        $order->update(['notes' => $notes]);
    }
}
