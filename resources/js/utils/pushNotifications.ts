import axios from 'axios';

type OneSignal = any;

declare global {
  interface Window {
    OneSignalDeferred?: Array<(oneSignal: OneSignal) => void>;
  }
}

const ensureDeferredQueue = () => {
  if (!window.OneSignalDeferred) {
    window.OneSignalDeferred = [];
  }

  return window.OneSignalDeferred;
};

export const registerOneSignalSubscription = () => {
  if (typeof window === 'undefined') return;

  const queue = ensureDeferredQueue();

  queue.push(async (OneSignal: OneSignal) => {
    try {
      const subscription = await OneSignal.User.PushSubscription.getSubscriptionId();
      if (!subscription) {
        return;
      }

      const deviceType = OneSignal.User.Device?.getType?.();

      await axios.post(
        route('notifications.push-subscriptions.store'),
        {
          player_id: subscription,
          device_type: deviceType || 'web',
          browser: navigator.userAgent,
        },
        {
          headers: {
            'X-Requested-With': 'XMLHttpRequest',
          },
        }
      );
    } catch (error) {
      if (import.meta.env.DEV) {
        console.warn('Failed to register OneSignal subscription', error);
      }
    }
  });
};

export const updateNotificationPreferences = async (
  preferences: Partial<{ web_push_subscribed: boolean; frequency: 'daily' | 'weekly' | 'monthly'; send_time: string }>
) => {
  await axios.patch(route('notifications.preferences.update'), preferences, {
    headers: {
      'X-Requested-With': 'XMLHttpRequest',
    },
  });
};
