import { ArrowLeft } from 'lucide-react';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { LanguageSwitcher } from '@/components/language-switcher';
import { ProfileMenu } from '@/components/profile-menu';
import { router } from '@inertiajs/react';
import type { BreadcrumbItem } from '@/types';

interface MobileHeaderProps {
  breadcrumbs: BreadcrumbItem[];
}

export default function MobileHeader({ breadcrumbs }: MobileHeaderProps) {
  const { t } = useTranslation();

  // Build breadcrumb string
  const breadcrumbText = breadcrumbs.map((b) => b.title).join(' / ');

  // Determine back target (second-last breadcrumb or dashboard)
  const backHref =
    breadcrumbs.length > 1 ? breadcrumbs[breadcrumbs.length - 2]?.href : route('dashboard');

  return (
    <header className="sticky top-0 z-40 flex h-12 items-center justify-between border-b bg-background px-3">
      {/* Left section: menu + back arrow + breadcrumb */}
      <div className="flex min-w-0 items-center gap-2">
        <SidebarTrigger className="h-9 w-9 shrink-0" />
        <Button
          variant="ghost"
          size="icon"
          className="h-9 w-9 shrink-0"
          onClick={() => backHref && router.visit(backHref)}
        >
          <ArrowLeft className="h-4 w-4" />
          <span className="sr-only">{t('Back')}</span>
        </Button>
        <span className="truncate text-sm font-medium text-foreground max-w-[60vw]">
          {breadcrumbText}
        </span>
      </div>

      {/* Right section: actions */}
      <div className="flex items-center gap-2 shrink-0">
        <LanguageSwitcher />
        <ProfileMenu />
      </div>
    </header>
  );
}
