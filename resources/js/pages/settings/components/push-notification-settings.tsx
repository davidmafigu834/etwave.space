import { FormEvent, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { usePage } from '@inertiajs/react';
import { BellRing, Info, Save } from 'lucide-react';

import { SettingsSection } from '@/components/settings-section';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { toast } from '@/components/custom-toast';
import { registerOneSignalSubscription, updateNotificationPreferences } from '@/utils/pushNotifications';

interface NotificationPreferences {
  web_push_subscribed: boolean;
  frequency: 'daily' | 'weekly' | 'monthly';
  send_time: string;
}

const DEFAULT_PREFERENCES: NotificationPreferences = {
  web_push_subscribed: true,
  frequency: 'daily',
  send_time: '08:00',
};

export default function PushNotificationSettings() {
  const { t } = useTranslation();
  const { auth = {} } = usePage().props as any;

  const initialPreferences: NotificationPreferences = useMemo(() => {
    const rawPreferences = (auth?.user?.notification_preferences as Partial<NotificationPreferences>) ?? {};

    return {
      ...DEFAULT_PREFERENCES,
      ...rawPreferences,
      web_push_subscribed: rawPreferences?.web_push_subscribed ?? DEFAULT_PREFERENCES.web_push_subscribed,
      frequency: rawPreferences?.frequency ?? DEFAULT_PREFERENCES.frequency,
      send_time: rawPreferences?.send_time ?? DEFAULT_PREFERENCES.send_time,
    } as NotificationPreferences;
  }, [auth?.user?.notification_preferences]);

  const [preferences, setPreferences] = useState<NotificationPreferences>(initialPreferences);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    setPreferences(initialPreferences);
  }, [initialPreferences]);

  const handleToggle = (checked: boolean) => {
    setPreferences((prev) => ({
      ...prev,
      web_push_subscribed: checked,
    }));
  };

  const handleFrequencyChange = (value: NotificationPreferences['frequency']) => {
    setPreferences((prev) => ({
      ...prev,
      frequency: value,
    }));
  };

  const handleTimeChange = (value: string) => {
    setPreferences((prev) => ({
      ...prev,
      send_time: value || DEFAULT_PREFERENCES.send_time,
    }));
  };

  const handleSave = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSaving(true);

    try {
      await updateNotificationPreferences(preferences);

      toast.success(t('Notification preferences updated'));

      if (preferences.web_push_subscribed) {
        registerOneSignalSubscription();
      }
    } catch (error) {
      toast.error(t('Failed to update notification preferences'));

      if (import.meta.env.DEV) {
        console.error('Failed to update notification preferences', error);
      }
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <SettingsSection
      title={t('Web Push Notifications')}
      description={t('Manage OneSignal web push subscription and digest schedule.')}
      action={
        <Button type="submit" form="push-notification-settings-form" size="sm" disabled={isSaving}>
          <Save className="mr-2 h-4 w-4" />
          {isSaving ? t('Saving...') : t('Save Changes')}
        </Button>
      }
    >
      <form id="push-notification-settings-form" onSubmit={handleSave} className="space-y-6">
        <div className="flex items-center justify-between rounded-md border bg-muted/20 p-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <BellRing className="h-4 w-4 text-primary" />
              <p className="font-medium">{t('Enable web push alerts')}</p>
            </div>
            <p className="text-sm text-muted-foreground">
              {t('Stay informed about visitor activity with instant web push notifications.')}
            </p>
          </div>
          <Switch
            id="web-push-enabled"
            checked={preferences.web_push_subscribed}
            onCheckedChange={handleToggle}
          />
        </div>

        <div className="rounded-md border border-dashed bg-muted/10 p-4 text-sm text-muted-foreground">
          <div className="flex items-start gap-2">
            <Info className="mt-0.5 h-4 w-4" />
            <p>
              {t('Make sure the OneSignal prompt is accepted in your browser so we can deliver notifications. You can always re-enable the prompt from your browser settings if dismissed.')}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="grid gap-2">
            <Label htmlFor="push-frequency">{t('Digest Frequency')}</Label>
            <Select
              value={preferences.frequency}
              onValueChange={(value) => handleFrequencyChange(value as NotificationPreferences['frequency'])}
              disabled={!preferences.web_push_subscribed}
            >
              <SelectTrigger id="push-frequency">
                <SelectValue placeholder={t('Select frequency')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="daily">{t('Daily')}</SelectItem>
                <SelectItem value="weekly">{t('Weekly')}</SelectItem>
                <SelectItem value="monthly">{t('Monthly')}</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground">
              {t('Choose how often we should send you a digest of your visitor metrics.')}
            </p>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="push-send-time">{t('Digest Send Time')}</Label>
            <Input
              id="push-send-time"
              type="time"
              value={preferences.send_time}
              onChange={(event) => handleTimeChange(event.target.value)}
              disabled={!preferences.web_push_subscribed}
            />
            <p className="text-xs text-muted-foreground">
              {t('We will queue your digest around this time in your selected timezone.')}
            </p>
          </div>
        </div>
      </form>
    </SettingsSection>
  );
}
