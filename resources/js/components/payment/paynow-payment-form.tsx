import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { AlertCircle, CreditCard, ExternalLink, Loader2 } from 'lucide-react';

interface PaynowPaymentFormProps {
  planId: number;
  planPrice: number;
  billingCycle: 'monthly' | 'yearly';
  couponCode?: string;
  onSuccess: () => void;
  onCancel: () => void;
}

export function PaynowPaymentForm({
  planId,
  planPrice,
  billingCycle,
  couponCode,
  onSuccess,
  onCancel,
}: PaynowPaymentFormProps) {
  const { t } = useTranslation();
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [mobilePhone, setMobilePhone] = useState('');
  const [mobileMethod, setMobileMethod] = useState<'ecocash' | 'onemoney'>('ecocash');
  const [paymentData, setPaymentData] = useState<{
    mode?: 'mobile';
    redirectUrl?: string | null;
    pollUrl?: string | null;
    reference?: string | null;
    instructions?: string[];
    mobileMethod?: string | null;
    mobilePhone?: string | null;
  }>({});

  const formattedAmount =
    window.appSettings?.formatCurrency?.(planPrice, { showSymbol: true }) ?? planPrice.toFixed(2);

  const paynowSettings = window?.appSettings?.paymentSettings || {};
  const isTestMode = paynowSettings?.paynow_mode === 'test';

  const initiatePayment = async () => {
    setError(null);
    setPaymentData({});
    setIsProcessing(true);

    try {
      const response = await fetch(route('paynow.create-payment'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'X-CSRF-TOKEN':
            document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
        },
        body: JSON.stringify({
          plan_id: planId,
          billing_cycle: billingCycle,
          coupon_code: couponCode || null,
          paynow_channel: 'mobile',
          mobile_phone: mobilePhone.trim(),
          mobile_method: mobileMethod,
        }),
      });

      const contentType = response.headers.get('content-type') || '';
      if (!contentType.includes('application/json')) {
        const raw = await response.text();
        throw new Error(raw || t('Unexpected response from server.'));
      }

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data?.error || t('Failed to initiate Paynow transaction'));
      }

      const instructions = Array.isArray(data.instructions)
        ? data.instructions
        : data.instructions
        ? [String(data.instructions)]
        : [];

      setPaymentData({
        mode: 'mobile',
        redirectUrl: data.redirect_url,
        pollUrl: data.poll_url,
        reference: data.reference,
        instructions,
        mobileMethod,
        mobilePhone: mobilePhone.trim(),
      });

    } catch (err: any) {
      setError(err?.message || t('An unexpected error occurred while contacting Paynow.'));
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CreditCard className="h-5 w-5" />
          {t('Paynow Payment')}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {isTestMode && (
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              <div className="space-y-2 text-sm">
                <p className="font-medium">{t('Test mode enabled')}</p>
                <p>
                  {t(
                    'Only the merchant email configured in Paynow can complete these test transactions. When redirected select “TESTING: Faked Success” to simulate card payments.'
                  )}
                </p>
                <div className="space-y-1">
                  <p className="font-medium">{t('Mobile express test numbers')}</p>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>0771111111 – {t('Immediate success (5 seconds)')}</li>
                    <li>0772222222 – {t('Delayed success (30 seconds)')}</li>
                    <li>0773333333 – {t('User cancelled (fails after 30 seconds)')}</li>
                    <li>0774444444 – {t('Insufficient balance (fails immediately)')}</li>
                  </ul>
                </div>
                <div className="space-y-1">
                  <p className="font-medium">{t('Card / token tests')}</p>
                  <p>
                    {t(
                      'When using remote tokenised payments provide the token value to simulate a result: 1111…=Success, 2222…=Pending, 3333…=Cancelled, 4444…=Insufficient balance.'
                    )}
                  </p>
                </div>
              </div>
            </AlertDescription>
          </Alert>
        )}

        <p className="text-sm text-muted-foreground">
          {t('You will be redirected to Paynow (Zimbabwe) to complete your secure payment using local options such as EcoCash, ZIPIT, or card.')}
        </p>

        <div className="bg-muted p-4 rounded-lg">
          <div className="flex justify-between">
            <span className="text-sm font-medium">{t('Amount')}</span>
            <span className="text-sm font-semibold">
              {formattedAmount}
            </span>
          </div>
          <div className="text-xs text-muted-foreground mt-1">
            {t('Billing cycle')}: {t(billingCycle)}
          </div>
          {couponCode && (
            <div className="text-xs text-green-600 mt-1">
              {t('Coupon applied')}: {couponCode}
            </div>
          )}
        </div>
        <div className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="paynow-mobile-phone">{t('Mobile number')}</Label>
              <Input
                id="paynow-mobile-phone"
                value={mobilePhone}
                onChange={(e) => setMobilePhone(e.target.value)}
                placeholder={t('e.g. 0771234567')}
                maxLength={20}
              />
              <p className="text-xs text-muted-foreground">
                {t('Use the phone number linked to the selected wallet.')}
              </p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="paynow-mobile-method">{t('Wallet')}</Label>
              <select
                id="paynow-mobile-method"
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                value={mobileMethod}
                onChange={(e) => setMobileMethod(e.target.value as 'ecocash' | 'onemoney')}
              >
                <option value="ecocash">{t('EcoCash')}</option>
                <option value="onemoney">{t('OneMoney')}</option>
              </select>
              <p className="text-xs text-muted-foreground">
                {t('A payment prompt will be sent to this wallet.')}
              </p>
            </div>
          </div>

          <p className="text-sm text-muted-foreground">
            {t(
              'Click the button below to initiate your Paynow mobile express payment. Approve the prompt on your handset to complete the transaction.'
            )}
          </p>

          <div className="flex gap-3">
            <Button variant="outline" onClick={onCancel} className="flex-1" disabled={isProcessing}>
              {t('Cancel')}
            </Button>
            <Button
              onClick={initiatePayment}
              className="flex-1"
              type="button"
              disabled={
                isProcessing ||
                (!mobilePhone.trim() || mobilePhone.trim().length < 5)
              }
            >
              {isProcessing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {t('Contacting Paynow...')}
                </>
              ) : (
                <>
                  <ExternalLink className="mr-2 h-4 w-4" />
                  {t('Open Paynow Checkout')}
                </>
              )}
            </Button>
          </div>

          {paymentData.mode === 'mobile' && (
            <div className="space-y-3 rounded-lg border border-primary/40 bg-primary/5 p-3">
              <div>
                <p className="text-sm font-medium text-primary">
                  {t('Mobile express payment initiated. Follow the instructions below on your phone.')}
                </p>
                {paymentData.mobilePhone && (
                  <p className="text-xs text-muted-foreground mt-1">
                    {t('Wallet')}: {paymentData.mobileMethod?.toUpperCase()} • {paymentData.mobilePhone}
                  </p>
                )}
              </div>
              {paymentData.instructions && paymentData.instructions.length > 0 ? (
                <ul className="list-disc space-y-1 pl-5 text-sm text-muted-foreground">
                  {paymentData.instructions.map((item, idx) => (
                    <li key={idx}>{item}</li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-muted-foreground">
                  {t('Check your handset for a Paynow prompt. Complete the approval to finish your payment.')}
                </p>
              )}
              {paymentData.pollUrl && (
                <div className="text-xs text-muted-foreground break-all">
                  <span className="font-medium">{t('Poll URL')}:</span> {paymentData.pollUrl}
                </div>
              )}
              <Button variant="outline" onClick={onSuccess} className="w-full">
                {t('I have approved the payment')}
              </Button>
            </div>
          )}
        </div>

        <p className="text-xs text-muted-foreground text-center">
          {t('After confirming payment, return to this window. Your subscription will update automatically once Paynow notifies us.')}
        </p>
      </CardContent>
    </Card>
  );
}
