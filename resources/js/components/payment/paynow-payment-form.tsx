import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CreditCard, ExternalLink } from 'lucide-react';

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
  const formattedAmount =
    window.appSettings?.formatCurrency?.(planPrice, { showSymbol: true }) ?? planPrice.toFixed(2);

  const handleLinkClick = () => {
    onSuccess();
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
          <p className="text-sm text-muted-foreground">
            {t(
              'Click the Paynow button below to complete your payment in a new tab. Once payment is complete, return here to continue.'
            )}
          </p>

          <a
            href="https://www.paynow.co.zw/Payment/Link/?q=c2VhcmNoPWRkc3RhcmJlbGlldmVpdCU0MGdtYWlsLmNvbSZhbW91bnQ9My45OSZyZWZlcmVuY2U9MDAxJmw9MQ%3d%3d"
            target="_blank"
            rel="noopener noreferrer"
            onClick={handleLinkClick}
            className="flex justify-center"
          >
            <img
              src="https://www.paynow.co.zw/Content/Buttons/Medium_buttons/button_pay-now_medium.png"
              alt={t('Paynow payment button')}
              style={{ border: 0 }}
            />
          </a>

          <div className="flex gap-3">
            <Button variant="outline" onClick={onCancel} className="flex-1">
            {t('Cancel')}
            </Button>
            <Button asChild className="flex-1" type="button">
              <a
                href="https://www.paynow.co.zw/Payment/Link/?q=c2VhcmNoPWRkc3RhcmJlbGlldmVpdCU0MGdtYWlsLmNvbSZhbW91bnQ9My45OSZyZWZlcmVuY2U9MDAxJmw9MQ%3d%3d"
                target="_blank"
                rel="noopener noreferrer"
                onClick={handleLinkClick}
              >
                <ExternalLink className="mr-2 h-4 w-4" />
                {t('Pay with Paynow')}
              </a>
            </Button>
          </div>
        </div>

        <p className="text-xs text-muted-foreground text-center">
          {t('After confirming payment, return to this window. Your subscription will update automatically once Paynow notifies us.')}
        </p>
      </CardContent>
    </Card>
  );
}
