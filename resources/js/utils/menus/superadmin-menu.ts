import { type NavItem } from '@/types';
import { LayoutGrid, BarChart3, Globe, Briefcase, Image, Nfc, BarChart, CreditCard, Percent, Globe2, DollarSign, Gift, Palette, Mail, Package, Settings, Shield, Users } from 'lucide-react';
import { hasPermission } from '@/utils/authorization';

declare global {
    interface Window {
        enabledAddons?: any[];
    }
}

export const getSuperAdminMenuItems = (t: any, permissions: any[] = []): NavItem[] => {
    let items: NavItem[] = [
    {
        title: t('Dashboard'),
        href: route('dashboard'),
        icon: LayoutGrid,
        order: 10,
    },
    {
        title: t('Analytics'),
        href: route('analytics'),
        icon: BarChart3,
        order: 20,
    },
    {
        title: t('Business Directory'),
        icon: Globe,
        children: [
            {
                title: t('View Directory'),
                href: route('directory.index'),
                target: '_blank'
            },
            {
                title: t('Directory Settings'),
                href: route('directory.settings')
            },
            {
                title: t('Custom Pages'),
                href: route('directory.custom-pages.index')
            }
        ],
        order: 30,
    },
    {
        title: t('Companies'),
        href: route('companies.index'),
        icon: Briefcase,
        order: 40,
    },
    {
        title: t('Media Library'),
        href: route('media-library'),
        icon: Image,
        order: 50,
    },
    {
        title: t('NFC Cards'),
        icon: Nfc,
        children: [
            {
                title: t('NFC Cards'),
                href: route('nfc-cards.index')
            },
            {
                title: t('NFC Card Requests'),
                href: route('nfc-cards.order-requests')
            }
        ],
        order: 60,
    },
    {
        title: t('Campaigns'),
        icon: BarChart,
        children: [
            {
                title: t('Campaigns'),
                href: route('campaigns.index')
            },
            {
                title: t('Settings'),
                href: route('campaigns.settings')
            }
        ],
        order: 70,
    },
    {
        title: t('Plans'),
        icon: CreditCard,
        children: [
            {
                title: t('Plan'),
                href: route('plans.index')
            },
            {
                title: t('Plan Request'),
                href: route('plan-requests.index')
            },
            {
                title: t('Plan Orders'),
                href: route('plan-orders.index')
            }
        ],
        order: 80,
    },
    {
        title: t('Coupons'),
        href: route('coupons.index'),
        icon: Percent,
        order: 90,
    },
    {
        title: t('Domain Request'),
        href: route('domain-requests.index'),
        icon: Globe2,
        order: 100, 
    },
    {
        title: t('Currencies'),
        href: route('currencies.index'),
        icon: DollarSign,
        order: 110,
    },
    {
        title: t('Referral Program'),
        href: route('referral.index'),
        icon: Gift,
        order: 120,
    },
    {
        title: t('Landing Page'),
        icon: Palette,
        children: [
            {
                title: t('Landing Page'),
                href: route('landing-page')
            },
            {
                title: t('Custom Pages'),
                href: route('landing-page.custom-pages.index')
            }
        ],
        order: 130,
    },
    {
        title: t('Email Templates'),
        href: route('email-templates.index'),
        icon: Mail,
        order: 140,
    },
    {
        title: t('Newsletter Subscriptions'),
        href: route('landing-page.newsletters.index'),
        icon: Users,
        order: 141,
    },
    {
        title: t('Addons'),
        href: route('addons.index'),
        icon: Package,
        order: 25,
        badge: (window as any).isDemo ? { label: 'Premium', variant: 'default' } : undefined,
    },
    {
        title: t('Settings'),
        icon: Settings,
        children: [
            {
                title: t('General Settings'),
                href: route('settings')
            },
            {
                title: t('System Upgrade'),
                href: route('upgrade.index')
            }
        ],
        order: 150,
    },
    ];

    // Sort items by order
    return items.sort((a, b) => (a.order || 999) - (b.order || 999));
};
