import React, { useState } from 'react';
import { PageTemplate } from '@/components/page-template';
import { RefreshCw, BarChart3, Download, Nfc, Building2, CreditCard, Ticket, DollarSign, TrendingUp, Activity, UserPlus, AlertCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useTranslation } from 'react-i18next';
import { Badge } from '@/components/ui/badge';
import { DashboardOverview } from '@/components/dashboard/dashboard-overview';
import { router } from '@inertiajs/react';

interface SuperAdminDashboardData {
  stats: {
    totalCompanies: number;
    totalNfcCards: number;
    totalRevenue: number;
    activePlans: number;
    pendingRequests: number;
    monthlyGrowth: number;
  };
  recentActivity: Array<{
    id: number;
    type: string;
    message: string;
    time: string;
    status: 'success' | 'warning' | 'error';
  }>;
  topPlans: Array<{
    name: string;
    subscribers: number;
    revenue: number;
  }>;
}

interface PageAction {
  label: string;
  icon: React.ReactNode;
  variant: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
  onClick: () => void;
}

export default function SuperAdminDashboard({ dashboardData }: { dashboardData: SuperAdminDashboardData }) {
  const { t } = useTranslation();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  const handleRefresh = () => {
    setIsRefreshing(true);
    router.reload({ only: ['dashboardData'] });
    setTimeout(() => setIsRefreshing(false), 1000);
  };

  const handleAnalytics = () => {
    router.visit(route('analytics'));
  };

  const handleExport = async () => {
    setIsExporting(true);
    try {
      const response = await fetch(route('dashboard.export-report'), {
        method: 'GET',
        headers: {
          'Accept': 'application/pdf',
        },
      });
      
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `dashboard-report-${new Date().toISOString().split('T')[0]}.pdf`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      } else {
        console.error('Export failed:', response.statusText);
      }
    } catch (error) {
      console.error('Export failed:', error);
    } finally {
      setIsExporting(false);
    }
  };

  const pageActions: PageAction[] = [
    {
      label: t('Refresh'),
      icon: <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />,
      variant: 'outline',
      onClick: handleRefresh
    },
    {
      label: t('Analytics'),
      icon: <BarChart3 className="h-4 w-4" />,
      variant: 'outline',
      onClick: handleAnalytics
    },
    {
      label: isExporting ? t('Exporting...') : t('Export Report'),
      icon: <Download className="h-4 w-4" />,
      variant: 'default',
      onClick: handleExport
    }
  ];

  const stats = dashboardData?.stats || {
    totalCompanies: 156,
    totalNfcCards: 89,
    totalRevenue: 45678,
    activePlans: 89,
    pendingRequests: 12,
    monthlyGrowth: 15.2
  };

  const recentActivity = dashboardData?.recentActivity || [
    { id: 1, type: 'company', message: 'New company registered: TechCorp Inc.', time: '2 hours ago', status: 'success' },
    { id: 2, type: 'plan', message: 'Plan upgrade request from ABC Ltd.', time: '4 hours ago', status: 'warning' },
    { id: 3, type: 'payment', message: 'Payment received: $299 from XYZ Corp', time: '6 hours ago', status: 'success' },
    { id: 4, type: 'domain', message: 'Domain request pending approval', time: '8 hours ago', status: 'warning' },
  ];

  const topPlans = dashboardData?.topPlans || [
    { name: 'Professional', subscribers: 45, revenue: 13500 },
    { name: 'Business', subscribers: 32, revenue: 9600 },
    { name: 'Enterprise', subscribers: 12, revenue: 7200 },
  ];

  const formatCurrency = (amount: number) => {
    const numericAmount = Number(amount) || 0;
    if (window?.appSettings?.formatCurrency) {
      return window.appSettings.formatCurrency(numericAmount, { showSymbol: true });
    }
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(numericAmount);
  };

  const metrics = [
    {
      title: t('Active Plans'),
      value: stats.activePlans.toLocaleString(),
      icon: <CreditCard className="h-5 w-5 text-violet-600 dark:text-violet-400" />,
      iconBg: 'bg-violet-100 dark:bg-violet-900/40'
    },
    {
      title: t('Pending Requests'),
      value: stats.pendingRequests.toLocaleString(),
      icon: <AlertCircle className="h-5 w-5 text-amber-600 dark:text-amber-400" />,
      iconBg: 'bg-amber-100 dark:bg-amber-900/40'
    },
    {
      title: t('Monthly Growth'),
      value: `+${(Number(stats.monthlyGrowth) || 0).toFixed(1)}%`,
      icon: <TrendingUp className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />,
      iconBg: 'bg-emerald-100 dark:bg-emerald-900/40'
    },
    {
      title: t('Total Companies'),
      value: stats.totalCompanies.toLocaleString(),
      icon: <Building2 className="h-5 w-5 text-sky-600 dark:text-sky-400" />,
      iconBg: 'bg-sky-100 dark:bg-sky-900/40'
    },
    {
      title: t('NFC Cards'),
      value: stats.totalNfcCards?.toLocaleString() || '0',
      icon: <Nfc className="h-5 w-5 text-green-600 dark:text-green-400" />,
      iconBg: 'bg-green-100 dark:bg-green-900/40'
    },
    {
      title: t('Total Revenue'),
      value: formatCurrency(stats.totalRevenue),
      icon: <DollarSign className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />,
      iconBg: 'bg-yellow-100 dark:bg-yellow-900/40'
    }
  ];

  const activityStyles = {
    success: {
      background: 'from-emerald-50 via-white to-emerald-100 dark:from-emerald-900/10 dark:via-transparent dark:to-emerald-900/20',
      dot: 'bg-emerald-500',
      badge: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300'
    },
    warning: {
      background: 'from-amber-50 via-white to-amber-100 dark:from-amber-900/10 dark:via-transparent dark:to-amber-900/20',
      dot: 'bg-amber-500',
      badge: 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300'
    },
    error: {
      background: 'from-rose-50 via-white to-rose-100 dark:from-rose-900/10 dark:via-transparent dark:to-rose-900/20',
      dot: 'bg-rose-500',
      badge: 'bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-300'
    }
  } as const;

  const totalSubscribers = topPlans.reduce((sum, plan) => sum + (plan.subscribers || 0), 0);

  return (
    <PageTemplate 
      title={t('Dashboard')}
      url="/dashboard"
      actions={pageActions}
    >
      <div className="space-y-6">
        {/* Key Metrics */}
        <div className="grid gap-3 sm:gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
          {metrics.map((metric) => (
            <Card key={metric.title} className="group overflow-hidden border border-transparent bg-gradient-to-br from-white/60 to-white/40 shadow-sm transition hover:border-primary/30 hover:shadow-lg dark:from-slate-900/70 dark:to-slate-900/40">
              <CardContent className="p-4 sm:p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-medium uppercase tracking-[0.12em] text-muted-foreground">{metric.title}</p>
                    <h3 className="mt-2 text-2xl font-semibold text-slate-900 dark:text-slate-50">{metric.value}</h3>
                  </div>
                  <div className={`rounded-full ${metric.iconBg} p-3 transition group-hover:scale-105`}>{metric.icon}</div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Recent Activity */}
          <Card className="border border-transparent bg-white/60 backdrop-blur dark:bg-slate-900/70">
            <CardHeader className="border-b border-slate-100/80 dark:border-slate-800/60">
              <CardTitle className="flex items-center justify-between text-base font-semibold text-slate-900 dark:text-slate-100">
                <span className="flex items-center gap-2">
                  <Activity className="h-4 w-4" />
                  {t('Recent Activity')}
                </span>
                <Badge variant="secondary" className="text-xs bg-muted/60">
                  {recentActivity.length}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="space-y-3">
                {recentActivity.map((activity) => {
                  const styles = activityStyles[activity.status];
                  return (
                    <div
                      key={activity.id}
                      className={`flex items-start gap-3 rounded-xl border border-transparent bg-gradient-to-r p-4 transition hover:border-primary/20 hover:shadow-sm ${styles.background}`}
                    >
                      <div className={`mt-1 h-2 w-2 rounded-full ${styles.dot}`} />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-slate-900 dark:text-slate-100">{activity.message}</p>
                        <p className="text-xs text-muted-foreground mt-1">{activity.time}</p>
                      </div>
                      <Badge className={`text-xs capitalize ${styles.badge}`}>
                        {activity.type}
                      </Badge>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Top Plans */}
          <Card className="border border-transparent bg-white/60 backdrop-blur dark:bg-slate-900/70">
            <CardHeader className="border-b border-slate-100/80 dark:border-slate-800/60">
              <CardTitle className="flex items-center justify-between text-base font-semibold text-slate-900 dark:text-slate-100">
                <span className="flex items-center gap-2">
                  <Ticket className="h-4 w-4" />
                  {t('Top Performing Plans')}
                </span>
                <span className="text-xs text-muted-foreground">
                  {t('{{count}} subscribers total', { count: totalSubscribers.toLocaleString() })}
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="space-y-3">
                {topPlans.map((plan, index) => (
                  <div
                    key={plan.name}
                    className="flex items-center justify-between rounded-xl border border-muted/40 bg-muted/40 p-3 transition hover:border-primary/30 hover:bg-muted/60"
                  >
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold">
                          #{index + 1}
                        </div>
                      </div>
                      <div>
                        <p className="font-medium text-slate-900 dark:text-slate-100">{plan.name}</p>
                        <p className="text-xs text-muted-foreground">{plan.subscribers.toLocaleString()} {t('subscribers')}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-slate-900 dark:text-slate-100">{formatCurrency(plan.revenue)}</p>
                      <p className="text-xs text-muted-foreground">{t('revenue')}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Feature Overview */}
        <DashboardOverview userType="superadmin" stats={stats} />
      </div>
    </PageTemplate>
  );
}