import { PageTemplate } from '@/components/page-template';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { type NavItem } from '@/types';
import { useEffect, useRef, useState } from 'react';
import { Settings as SettingsIcon, Building, DollarSign, Users, RefreshCw, Palette, BookOpen, Award, FileText, Mail, Bell, Link2, CreditCard, Calendar, HardDrive, Shield, Bot, Cookie, Search, Webhook, Wallet, Zap, AlertCircle, Upload } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import SystemSettings from './components/system-settings';
import { usePage } from '@inertiajs/react';

import CurrencySettings from './components/currency-settings';

import BrandSettings from './components/brand-settings';
import EmailSettings from './components/email-settings';
import PushNotificationSettings from './components/push-notification-settings';
import PaymentSettings from './components/payment-settings';
import StorageSettings from './components/storage-settings';
import RecaptchaSettings from './components/recaptcha-settings';
import ChatGptSettings from './components/chatgpt-settings';
import CookieSettings from './components/cookie-settings';
import SeoSettings from './components/seo-settings';
import CacheSettings from './components/cache-settings';
import WebhookSettings from './components/webhook-settings';
import GoogleCalendarSettings from './components/google-calendar-settings';
import GoogleWalletSettings from './components/google-wallet-settings';
import { Toaster } from '@/components/ui/toaster';
import { useTranslation } from 'react-i18next';
import { hasPermission } from '@/utils/permissions';
import { useLayout } from '@/contexts/LayoutContext';

export default function Settings() {
  const { t } = useTranslation();
  const { position } = useLayout();
  const { systemSettings = {}, cacheSize = '0.00', timezones = {}, dateFormats = {}, timeFormats = {}, paymentSettings = {}, webhooks = [], auth = {} } = usePage().props as any;
  const [activeSection, setActiveSection] = useState('system-settings');
  const [isManualNavigation, setIsManualNavigation] = useState(false);
  
  // Define all possible sidebar navigation items
  const allSidebarNavItems: (NavItem & { permission?: string })[] = [
    {
      title: t('System Settings'),
      href: '#system-settings',
      icon: <SettingsIcon className="h-4 w-4 mr-2" />,
      permission: 'manage-system-settings'
    },
    {
      title: t('Brand Settings'),
      href: '#brand-settings',
      icon: <Palette className="h-4 w-4 mr-2" />,
      permission: 'manage-brand-settings'
    },
    {
      title: t('Currency Settings'),
      href: '#currency-settings',
      icon: <DollarSign className="h-4 w-4 mr-2" />,
      permission: 'manage-currency-settings'
    },
    {
      title: t('Email Settings'),
      href: '#email-settings',
      icon: <Mail className="h-4 w-4 mr-2" />,
      permission: 'manage-email-settings'
    },
    {
      title: t('Web Push Notifications'),
      href: '#push-notification-settings',
      icon: <Bell className="h-4 w-4 mr-2" />,
      permission: 'settings'
    },
    {
      title: t('Payment Settings'),
      href: '#payment-settings',
      icon: <CreditCard className="h-4 w-4 mr-2" />,
      permission: 'manage-payment-settings'
    },
    {
      title: t('Storage Settings'),
      href: '#storage-settings',
      icon: <HardDrive className="h-4 w-4 mr-2" />,
      permission: 'manage-storage-settings'
    },
    {
      title: t('ReCaptcha Settings'),
      href: '#recaptcha-settings',
      icon: <Shield className="h-4 w-4 mr-2" />,
      permission: 'manage-recaptcha-settings'
    },
    {
      title: t('Chat GPT Settings'),
      href: '#chatgpt-settings',
      icon: <Bot className="h-4 w-4 mr-2" />,
      permission: 'manage-chatgpt-settings'
    },
    {
      title: t('Cookie Settings'),
      href: '#cookie-settings',
      icon: <Cookie className="h-4 w-4 mr-2" />,
      permission: 'manage-cookie-settings'
    },
    {
      title: t('SEO Settings'),
      href: '#seo-settings',
      icon: <Search className="h-4 w-4 mr-2" />,
      permission: 'manage-seo-settings'
    },
    {
      title: t('Cache Settings'),
      href: '#cache-settings',
      icon: <HardDrive className="h-4 w-4 mr-2" />,
      permission: 'manage-cache-settings'
    },
    {
      title: t('Google Calendar Settings'),
      href: '#google-calendar-settings',
      icon: <Calendar className="h-4 w-4 mr-2" />,
      permission: 'settings'
    },
    {
      title: t('Google Wallet Settings'),
      href: '#google-wallet-settings',
      icon: <Wallet className="h-4 w-4 mr-2" />,
      permission: 'settings'
    },
    {
      title: t('System Upgrade'),
      href: '#system-upgrade',
      icon: <Zap className="h-4 w-4 mr-2" />,
      permission: 'superadmin' // Only for superadmin
    }
  ];
  
  if (auth.user?.type !== 'superadmin') {
      allSidebarNavItems.push({
          title: t('Webhook Settings'),
          href: '#webhook-settings',
          icon: <Webhook className="h-4 w-4 mr-2" />,
          permission: 'manage-webhook-settings'
      });
  }
  // Filter sidebar items based on user permissions
  const sidebarNavItems = allSidebarNavItems.filter(item => {
    // If no permission is required or user has the permission
    if (!item.permission || (auth.permissions && auth.permissions.includes(item.permission))) {
      return true;
    }
    // Special case for superadmin only items
    if (item.permission === 'superadmin' && auth.user?.type === 'superadmin') {
      return true;
    }
    // For company users, only show specific settings
    if (auth.user && auth.user.type === 'company') {
      // Only allow system settings, email settings, brand settings, webhook settings, and settings
      return ['manage-system-settings', 'manage-email-settings', 'manage-brand-settings', 'manage-webhook-settings', 'settings'].includes(item.permission);
    }
    return false;
  });
  
  // Refs for each section
  const systemSettingsRef = useRef<HTMLDivElement>(null);
  const brandSettingsRef = useRef<HTMLDivElement>(null);

  const currencySettingsRef = useRef<HTMLDivElement>(null);
  const emailSettingsRef = useRef<HTMLDivElement>(null);
  const pushNotificationSettingsRef = useRef<HTMLDivElement>(null);
  const paymentSettingsRef = useRef<HTMLDivElement>(null);
  const storageSettingsRef = useRef<HTMLDivElement>(null);
  const recaptchaSettingsRef = useRef<HTMLDivElement>(null);
  const chatgptSettingsRef = useRef<HTMLDivElement>(null);
  const cookieSettingsRef = useRef<HTMLDivElement>(null);
  const seoSettingsRef = useRef<HTMLDivElement>(null);
  const cacheSettingsRef = useRef<HTMLDivElement>(null);
  const webhookSettingsRef = useRef<HTMLDivElement>(null);
  const googleCalendarSettingsRef = useRef<HTMLDivElement>(null);
  const googleWalletSettingsRef = useRef<HTMLDivElement>(null);
  const systemUpgradeRef = useRef<HTMLDivElement>(null);

  
  // Smart scroll functionality
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 100; // Increased offset for better detection
      
      // Get all section elements that are currently rendered
      const sections = [
        { id: 'system-settings', ref: systemSettingsRef },
        { id: 'brand-settings', ref: brandSettingsRef },
        { id: 'currency-settings', ref: currencySettingsRef },
        { id: 'email-settings', ref: emailSettingsRef },
        { id: 'push-notification-settings', ref: pushNotificationSettingsRef },
        { id: 'payment-settings', ref: paymentSettingsRef },
        { id: 'storage-settings', ref: storageSettingsRef },
        { id: 'recaptcha-settings', ref: recaptchaSettingsRef },
        { id: 'chatgpt-settings', ref: chatgptSettingsRef },
        { id: 'cookie-settings', ref: cookieSettingsRef },
        { id: 'seo-settings', ref: seoSettingsRef },
        { id: 'cache-settings', ref: cacheSettingsRef },
        { id: 'google-calendar-settings', ref: googleCalendarSettingsRef },
        { id: 'google-wallet-settings', ref: googleWalletSettingsRef },
        { id: 'system-upgrade', ref: systemUpgradeRef },
        { id: 'webhook-settings', ref: webhookSettingsRef }
      ].filter(section => section.ref.current); // Only include rendered sections
      
      // Find the active section
      let activeId = sections[0]?.id || 'system-settings';
      
      for (const section of sections) {
        const element = section.ref.current;
        if (element) {
          const rect = element.getBoundingClientRect();
          const elementTop = window.scrollY + rect.top;
          
          if (scrollPosition >= elementTop) {
            activeId = section.id;
          }
        }
      }
      
      // Special handling for last section
      const lastSection = sections[sections.length - 1];
      if (lastSection?.ref.current) {
        const rect = lastSection.ref.current.getBoundingClientRect();
        const elementBottom = window.scrollY + rect.bottom;
        if (scrollPosition >= elementBottom - 300) {
          activeId = lastSection.id;
        }
      }
      
      // Only update if not manually navigating
      if (!isManualNavigation) {
        setActiveSection(activeId);
      }
    };
    
    // Add scroll event listener with throttling
    let ticking = false;
    let scrollTimeout;
    const throttledScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          handleScroll();
          ticking = false;
        });
        ticking = true;
      }
      
      // Reset manual navigation flag when scrolling stops
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => {
        setIsManualNavigation(false);
      }, 150);
    };
    
    window.addEventListener('scroll', throttledScroll);
    
    // Initial check
    handleScroll();
    
    // Check for hash in URL
    const hash = window.location.hash.replace('#', '');
    if (hash) {
      setTimeout(() => {
        const element = document.getElementById(hash);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
          setActiveSection(hash);
        }
      }, 100);
    }
    
    return () => {
      window.removeEventListener('scroll', throttledScroll);
    };
  }, []);

  // Handle navigation click
  const handleNavClick = (href: string) => {
    const id = href.replace('#', '');
    setIsManualNavigation(true);
    setActiveSection(id); // Set immediately
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <PageTemplate 
      title={t('Settings')} 
      url="/settings"
      breadcrumbs={[
        { title: t('Dashboard'), href: route('dashboard') },
        { title: t('Settings') }
      ]}
    >
      <div className={`flex flex-col md:flex-row gap-8 ${position === 'right' ? 'md:flex-row-reverse' : ''}`}>
        {/* Sidebar Navigation */}
        <div className="md:w-64 flex-shrink-0">
          <div className="sticky top-20">
            <ScrollArea className="h-[calc(100vh-5rem)]">
              <div className={`space-y-1 ${position === 'right' ? 'pl-4' : 'pr-4'}`}>
                {sidebarNavItems.map((item) => (
                  <Button
                    key={item.href}
                    variant="ghost"
                    className={cn('w-full justify-start', {
                      'bg-muted font-medium': activeSection === item.href.replace('#', ''),
                    })}
                    onClick={() => handleNavClick(item.href)}
                  >
                    {item.icon}
                    {item.title}
                  </Button>
                ))}
              </div>
            </ScrollArea>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1">
          {/* System Settings Section */}
          {(auth.permissions?.includes('manage-system-settings') || auth.user?.type === 'superadmin' || auth.user?.type === 'company') && (
            <section id="system-settings" ref={systemSettingsRef} className="mb-8">
              <SystemSettings 
                settings={systemSettings} 
                timezones={timezones}
                dateFormats={dateFormats}
                timeFormats={timeFormats}
              />
            </section>
          )}

          {/* Brand Settings Section */}
          {(auth.permissions?.includes('manage-brand-settings') || auth.user?.type === 'superadmin') && (
            <section id="brand-settings" ref={brandSettingsRef} className="mb-8">
              <BrandSettings />
            </section>
          )}



          {/* Currency Settings Section */}
          {(auth.permissions?.includes('manage-currency-settings') || auth.user?.type === 'superadmin') && (
            <section id="currency-settings" ref={currencySettingsRef} className="mb-8">
              <CurrencySettings />
            </section>
          )}

          {/* Email Settings Section */}
          {(auth.permissions?.includes('manage-email-settings') || auth.user?.type === 'superadmin') && (
            <section id="email-settings" ref={emailSettingsRef} className="mb-8">
              <EmailSettings />
            </section>
          )}

          <section id="push-notification-settings" ref={pushNotificationSettingsRef} className="mb-8">
            <PushNotificationSettings />
          </section>

          {/* Payment Settings Section */}
          {(auth.permissions?.includes('manage-payment-settings') || auth.user?.type === 'superadmin') && (
            <section id="payment-settings" ref={paymentSettingsRef} className="mb-8">
              <PaymentSettings settings={paymentSettings} />
            </section>
          )}

          {/* Storage Settings Section */}
          {(auth.permissions?.includes('manage-storage-settings') || auth.user?.type === 'superadmin') && (
            <section id="storage-settings" ref={storageSettingsRef} className="mb-8">
              <StorageSettings settings={systemSettings} />
            </section>
          )}

          {/* ReCaptcha Settings Section */}
          {(auth.permissions?.includes('manage-recaptcha-settings') || auth.user?.type === 'superadmin') && (
            <section id="recaptcha-settings" ref={recaptchaSettingsRef} className="mb-8">
              <RecaptchaSettings settings={systemSettings} />
            </section>
          )}

          {/* Chat GPT Settings Section */}
          {(auth.permissions?.includes('manage-chatgpt-settings') || auth.user?.type === 'superadmin') && (
            <section id="chatgpt-settings" ref={chatgptSettingsRef} className="mb-8">
              <ChatGptSettings settings={systemSettings} />
            </section>
          )}

          {/* Cookie Settings Section */}
          {(auth.permissions?.includes('manage-cookie-settings') || auth.user?.type === 'superadmin') && (
            <section id="cookie-settings" ref={cookieSettingsRef} className="mb-8">
              <CookieSettings settings={systemSettings} />
            </section>
          )}

          {/* SEO Settings Section */}
          {(auth.permissions?.includes('manage-seo-settings') || auth.user?.type === 'superadmin') && (
            <section id="seo-settings" ref={seoSettingsRef} className="mb-8">
              <SeoSettings settings={systemSettings} />
            </section>
          )}

          {/* Cache Settings Section */}
          {(auth.permissions?.includes('manage-cache-settings') || auth.user?.type === 'superadmin') && (
            <section id="cache-settings" ref={cacheSettingsRef} className="mb-8">
              <CacheSettings cacheSize={cacheSize} />
            </section>
          )}

          {/* Google Calendar Settings Section */}
          {(auth.permissions?.includes('settings') || auth.user?.type === 'company') && (
            <section id="google-calendar-settings" ref={googleCalendarSettingsRef} className="mb-8">
              <GoogleCalendarSettings settings={systemSettings} />
            </section>
          )}

          {/* Google Wallet Settings Section */}
          {(auth.permissions?.includes('settings') || auth.user?.type === 'company') && (
            <section id="google-wallet-settings" ref={googleWalletSettingsRef} className="mb-8">
              <GoogleWalletSettings settings={systemSettings} />
            </section>
          )}

          {/* Webhook Settings Section */}
          {(auth.permissions?.includes('manage-webhook-settings') && auth.user?.type !== 'superadmin') && (
            <section id="webhook-settings" ref={webhookSettingsRef} className="mb-8">
              <WebhookSettings webhooks={webhooks} />
            </section>
          )}

          {/* System Upgrade Section */}
          {auth.user?.type === 'superadmin' && (
            <section id="system-upgrade" ref={systemUpgradeRef} className="mb-8">
              <div className="bg-white rounded-lg shadow-sm border p-6">
                <div className="flex items-center gap-3 mb-6">
                  <Zap className="h-6 w-6 text-blue-600" />
                  <h2 className="text-xl font-semibold text-gray-900">{t('System Upgrade')}</h2>
                </div>
                
                <div className="prose max-w-none">
                  <p className="text-gray-600 mb-4">
                    {t('Upload and apply system upgrades to update your application. Create a ZIP file containing the updated files and upload it here.')}
                  </p>
                  
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                    <h3 className="font-medium text-blue-900 mb-2">{t('How to Create Upgrade Packages')}</h3>
                    <ol className="list-decimal list-inside text-blue-800 space-y-1 text-sm">
                      <li>{t('Make your updates to the local codebase')}</li>
                      <li>{t('Test the changes thoroughly')}</li>
                      <li>{t('Create a ZIP file containing the updated files (maintain the same directory structure as your Laravel app)')}</li>
                      <li>{t('Upload the ZIP file using the button below')}</li>
                      <li>{t('Apply the upgrade to update your system')}</li>
                    </ol>
                  </div>
                  
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                    <div className="flex items-start gap-2">
                      <AlertCircle className="h-5 w-5 text-red-600 mt-0.5 flex-shrink-0" />
                      <div>
                        <h3 className="font-medium text-red-900 mb-1">{t('Warning')}</h3>
                        <p className="text-red-800 text-sm">
                          {t('Applying this upgrade will overwrite existing files. Make sure you have a backup before proceeding. Only upload trusted upgrade packages.')}
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex gap-3">
                    <Button asChild>
                      <a href={route('upgrade.index')} className="inline-flex items-center gap-2">
                        <Upload className="h-4 w-4" />
                        {t('Go to Upgrade Page')}
                      </a>
                    </Button>
                  </div>
                </div>
              </div>
            </section>
          )}

        </div>
      </div>
      <Toaster />
    </PageTemplate>
  );
}