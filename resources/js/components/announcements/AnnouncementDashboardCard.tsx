import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Bell, Check, AlertCircle, Info, RefreshCw } from 'lucide-react';

import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAnnouncements } from '@/contexts/AnnouncementContext';
import { cn } from '@/lib/utils';

interface AnnouncementDashboardCardProps {
  className?: string;
}

const AnnouncementDashboardCard: React.FC<AnnouncementDashboardCardProps> = ({ className }) => {
  const { t } = useTranslation();
  const {
    announcements,
    unreadCount,
    isLoading,
    error,
    markAsRead,
    markAllAsRead,
    refresh,
    isEnabled,
  } = useAnnouncements();

  const topAnnouncements = useMemo(() => announcements.slice(0, 3), [announcements]);

  if (!isEnabled) {
    return null;
  }

  const handleMarkAsRead = async (id: number) => {
    const success = await markAsRead(id);
    if (!success) {
      console.error('Failed to mark announcement as read');
    }
  };

  const handleMarkAll = async () => {
    await markAllAsRead();
  };

  return (
    <Card className={cn('border border-dashed border-primary/20 bg-white/70 dark:bg-slate-900/70', className)}>
      <CardHeader className="flex flex-row items-start justify-between gap-3 pb-4">
        <div className="flex items-start gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
            <Bell className="h-5 w-5" />
          </span>
          <div>
            <CardTitle className="text-base font-semibold">
              {t('Announcements')}
            </CardTitle>
            <CardDescription>
              {unreadCount > 0
                ? t('You have {{count}} unread updates', { count: unreadCount })
                : t('All caught up with the latest updates')}
            </CardDescription>
          </div>
        </div>
        <Badge variant={unreadCount > 0 ? 'default' : 'secondary'}>
          {t('{{count}} unread', { count: unreadCount })}
        </Badge>
      </CardHeader>

      <CardContent className="space-y-4 pt-0">
        {isLoading && (
          <div className="space-y-2 text-sm text-muted-foreground">
            <div className="h-3 w-3/4 animate-pulse rounded bg-muted" />
            <div className="h-3 w-1/2 animate-pulse rounded bg-muted" />
            <div className="h-3 w-2/3 animate-pulse rounded bg-muted" />
          </div>
        )}

        {error && !isLoading && (
          <div className="flex items-start gap-3 rounded-lg border border-destructive/40 bg-destructive/10 p-3 text-sm text-destructive">
            <AlertCircle className="mt-0.5 h-4 w-4" />
            <div>
              <p className="font-medium">{t('Unable to load announcements')}</p>
              <p className="text-xs text-destructive/80">{error}</p>
            </div>
          </div>
        )}

        {!isLoading && !error && topAnnouncements.length === 0 && (
          <div className="flex items-start gap-3 rounded-lg border border-muted/40 bg-muted/20 p-3 text-sm text-muted-foreground">
            <Info className="mt-0.5 h-4 w-4" />
            <div>
              <p className="font-medium text-foreground">{t('No announcements yet')}</p>
              <p className="text-xs">{t('Stay tuned for product updates and important notices.')}</p>
            </div>
          </div>
        )}

        {!isLoading && !error && topAnnouncements.length > 0 && (
          <div className="space-y-3">
            {topAnnouncements.map((announcement) => (
              <div
                key={announcement.id}
                className={cn(
                  'group rounded-xl border border-transparent bg-gradient-to-r from-primary/0 to-primary/5 p-3 transition hover:border-primary/30 hover:from-primary/5',
                  !announcement.is_read && 'border-primary/40 bg-primary/5'
                )}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center gap-2">
                      <p className="font-medium text-sm text-foreground">{announcement.title}</p>
                      <Badge variant="outline" className="text-xs capitalize">
                        {t(announcement.type)}
                      </Badge>
                    </div>
                    <p className="line-clamp-2 text-xs text-muted-foreground">
                      {announcement.message}
                    </p>
                    <p className="text-[11px] text-muted-foreground">
                      {new Date(announcement.created_at).toLocaleString()}
                    </p>
                  </div>
                  {!announcement.is_read && (
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-7 gap-1 text-xs text-primary hover:text-primary"
                      onClick={() => handleMarkAsRead(announcement.id)}
                    >
                      <Check className="h-3.5 w-3.5" />
                      {t('Mark read')}
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>

      <CardFooter className="flex flex-col gap-2 border-t border-border/60 pt-4 sm:flex-row sm:items-center sm:justify-between">
        <Button
          size="sm"
          variant="outline"
          className="gap-2"
          onClick={() => {
            handleMarkAll();
          }}
          disabled={unreadCount === 0 || isLoading}
        >
          <Check className="h-4 w-4" />
          {t('Mark all as read')}
        </Button>
        <Button
          size="sm"
          variant="ghost"
          className="gap-2 text-muted-foreground hover:text-primary"
          onClick={() => refresh?.()}
          disabled={isLoading}
        >
          <RefreshCw className={cn('h-4 w-4', isLoading && 'animate-spin')} />
          {t('Refresh')}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default AnnouncementDashboardCard;
