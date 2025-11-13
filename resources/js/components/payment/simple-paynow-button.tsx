import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { AlertCircle, CreditCard, ExternalLink, Loader2 } from 'lucide-react';

interface SimplePaynowButtonProps {
  planId: number;
  planPrice: number;
  billingCycle: 'monthly' | 'yearly';
  couponCode?: string;
  onSuccess: () => void;
  onCancel: () => void;
}

export function SimplePaynowButton({
  planId,
  planPrice,
  billingCycle,
  couponCode,
  onSuccess,
  onCancel,
}: SimplePaynowButtonProps) {
  const { t } = useTranslation();
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [email, setEmail] = useState('');
  const [paymentLink, setPaymentLink] = useState<string | null>(null);
  const [reference, setReference] = useState<string | null>(null);

  const formattedAmount =
    window.appSettings?.formatCurrency?.(planPrice, { showSymbol: true }) ?? planPrice.toFixed(2);

  const createPayment = async () => {
    setError(null);
    setIsProcessing(true);

    try {
      const response = await fetch('/api/paynow/create-payment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'X-CSRF-TOKEN':
            document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
        },
        credentials: 'include',
        body: JSON.stringify({
          plan_id: planId,
          amount: planPrice,
          billing_cycle: billingCycle,
          coupon_code: couponCode || null,
          email: email || window.appSettings?.user?.email || '',
          description: `${window.appSettings?.plans?.find((p: any) => p.id === planId)?.name || 'Plan'} - ${billingCycle}`
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data?.error || t('Failed to create Paynow payment'));
      }

      setPaymentLink(data.payment_link);
      setReference(data.reference);

    } catch (err: any) {
      setError(err?.message || t('An unexpected error occurred while creating payment.'));
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

        <p className="text-sm text-muted-foreground">
          {t('Click the button below to complete your payment using Paynow. You will be redirected to the Paynow website to complete your payment.')}
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

        {!paymentLink ? (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="paynow-email">{t('Email')}</Label>
              <Input
                id="paynow-email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={t('Enter your email address')}
                type="email"
              />
              <p className="text-xs text-muted-foreground">
                {t('This email will be used for payment notifications.')}
              </p>
            </div>

            <div className="flex gap-3">
              <Button variant="outline" onClick={onCancel} className="flex-1" disabled={isProcessing}>
                {t('Cancel')}
              </Button>
              <Button
                onClick={createPayment}
                className="flex-1"
                type="button"
                disabled={isProcessing || !email.trim()}
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {t('Creating Payment...')}
                  </> 
                ) : (
                  <>
                    <ExternalLink className="mr-2 h-4 w-4" />
                    {t('Create Paynow Payment')}
                  </>
                )}
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="text-center">
              <p className="text-sm text-muted-foreground mb-4">
                {t('Click the button below to complete your payment. After payment, please return to this page to confirm your subscription.')}
              </p>
              
              <a 
                href={paymentLink} 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-block"
              >
                <img 
                  src="https://www.paynow.co.zw/Content/Buttons/Medium_buttons/button_pay-now_medium.png" 
                  alt="Paynow" 
                  className="border-0"
                />
              </a>
              
              <p className="text-xs text-muted-foreground mt-2">
                {t('Reference')}: {reference}
              </p>
            </div>
            
            <div className="flex gap-3">
              <Button variant="outline" onClick={onCancel} className="flex-1">
                {t('Cancel')}
              </Button>
              <Button 
                onClick={async () => {
                  try {
                    const response = await fetch(`/api/paynow/complete-payment?reference=${reference}`, {
                      method: 'GET',
                      headers: {
                        'Accept': 'application/json',
                        'X-CSRF-TOKEN':
                          document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
                      },
                    });

                    const data = await response.json();

                    if (!response.ok || !data.success) {
                      throw new Error(data?.error || t('Failed to complete payment'));
                    }

                    // Call the onSuccess callback
                    onSuccess();
                  } catch (err: any) {
                    setError(err?.message || t('Failed to complete payment'));
                  }
                }} 
                className="flex-1"
              >
                {t('I have completed the payment')}
              </Button>
            </div>
          </div>
        )}

        <p className="text-xs text-muted-foreground text-center">
          {t('After confirming payment, return to this window. Your subscription will update automatically once you confirm payment completion.')}
        </p>
      </CardContent>
    </Card>
  );
}
