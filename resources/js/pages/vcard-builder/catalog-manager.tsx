import React from 'react';
import { Head, useForm, router } from '@inertiajs/react';
import { PageTemplate } from '@/components/page-template';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/components/custom-toast';
import { useTranslation } from 'react-i18next';
import { cn } from '@/lib/utils';
import MediaPicker from '@/components/MediaPicker';
import {
  ClipboardList,
  Hammer,
  Layers,
  Package as PackageIcon,
  PencilLine,
  PlusCircle,
  Sparkles,
  Trash2,
} from 'lucide-react';

interface ServiceResource {
  id: number;
  name: string;
  slug: string | null;
  summary: string | null;
  description: string | null;
  category: string | null;
  price_type: string | null;
  price_amount: string | number | null;
  price_currency: string | null;
  duration_label: string | null;
  is_featured: boolean;
  order_index: number | null;
  meta?: Record<string, any> | null;
  meta_image?: string | null;
}

interface PackageResource {
  id: number;
  name: string;
  slug: string | null;
  headline: string | null;
  description: string | null;
  price_display: string | null;
  price_amount: string | number | null;
  price_currency: string | null;
  duration_label: string | null;
  cta_label: string | null;
  cta_link: string | null;
  is_featured: boolean;
  order_index: number | null;
  features: string[];
  meta?: Record<string, any> | null;
  meta_image?: string | null;
}

interface CatalogManagerProps {
  business: {
    id: number;
    name: string;
    business_type?: string | null;
  };
  services: ServiceResource[];
  packages: PackageResource[];
}

interface ServiceFormData {
  name: string;
  slug: string;
  summary: string;
  description: string;
  category: string;
  price_type: string;
  price_amount: string | number | null;
  price_currency: string;
  duration_label: string;
  is_featured: boolean;
  order_index: number | '' | null;
  meta_image: string;
  [key: string]: any;
}

interface PackageFormData {
  name: string;
  slug: string;
  headline: string;
  description: string;
  price_display: string;
  price_amount: string | number | null;
  price_currency: string;
  duration_label: string;
  cta_label: string;
  cta_link: string;
  is_featured: boolean;
  order_index: number | '' | null;
  features: string[];
  meta_image: string;
  [key: string]: any;
}

const defaultServiceFormData = (orderIndex: number): ServiceFormData => ({
  name: '',
  slug: '',
  summary: '',
  description: '',
  category: '',
  price_type: '',
  price_amount: '',
  price_currency: '',
  duration_label: '',
  is_featured: false,
  order_index: orderIndex,
  meta_image: '',
});

const defaultPackageFormData = (orderIndex: number): PackageFormData => ({
  name: '',
  slug: '',
  headline: '',
  description: '',
  price_display: '',
  price_amount: '',
  price_currency: '',
  duration_label: '',
  cta_label: '',
  cta_link: '',
  is_featured: false,
  order_index: orderIndex,
  features: [],
  meta_image: '',
});

const normalizeNumber = (value: string | number | null | undefined): number | null => {
  if (value === null || value === undefined || value === '') {
    return null;
  }

  const parsed = typeof value === 'number' ? value : Number(value);
  return Number.isNaN(parsed) ? null : parsed;
};

const normalizeCurrencyValue = (value: string | number | null | undefined): number | null => {
  if (value === null || value === undefined || value === '') {
    return null;
  }

  const cleaned = typeof value === 'number' ? value : Number(value);
  return Number.isNaN(cleaned) ? null : cleaned;
};

const ServiceFormCard: React.FC<{
  businessId: number;
  service?: ServiceResource;
  defaultOrder: number;
  onFinish?: () => void;
}> = ({ businessId, service, defaultOrder, onFinish }) => {
  const { t } = useTranslation();
  const isEdit = Boolean(service);

  const emitCatalogUpdate = React.useCallback(
    (action: 'create' | 'update' | 'delete') => {
      if (typeof window === 'undefined') {
        return;
      }

      window.dispatchEvent(
        new CustomEvent('catalog:updated', {
          detail: {
            businessId,
            entity: 'service' as const,
            action,
          },
        })
      );
    },
    [businessId]
  );

  const form = useForm<ServiceFormData>(
    service
      ? {
          name: service.name ?? '',
          slug: service.slug ?? '',
          summary: service.summary ?? '',
          description: service.description ?? '',
          category: service.category ?? '',
          price_type: service.price_type ?? '',
          price_amount: service.price_amount ?? '',
          price_currency: service.price_currency ?? '',
          duration_label: service.duration_label ?? '',
          is_featured: service.is_featured ?? false,
          order_index: service.order_index ?? null,
          meta_image: service.meta_image ?? (service.meta as Record<string, any> | undefined)?.image ?? '',
        }
      : defaultServiceFormData(defaultOrder)
  );

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    form.transform((data) => ({
      ...data,
      price_amount: normalizeCurrencyValue(data.price_amount),
      order_index: normalizeNumber(data.order_index),
      meta_image: typeof data.meta_image === 'string' ? data.meta_image.trim() : '',
    }));

    const options = {
      preserveScroll: true,
      onSuccess: () => {
        toast.success(
          isEdit ? t('Service updated successfully.') : t('Service created successfully.')
        );

        if (!isEdit) {
          form.reset();
          emitCatalogUpdate('create');
        } else {
          emitCatalogUpdate('update');
          onFinish?.();
        }
      },
    };

    if (isEdit) {
      form.put(
        route('vcard-builder.catalog.services.update', {
          business: businessId,
          service: service!.id,
        }),
        options
      );
    } else {
      form.post(route('vcard-builder.catalog.services.store', businessId), options);
    }
  };

  const handleDelete = () => {
    if (!service) return;
    if (!confirm(t('Are you sure you want to remove this service?'))) {
      return;
    }

    router.delete(
      route('vcard-builder.catalog.services.destroy', {
        business: businessId,
        service: service.id,
      }),
      {
        preserveScroll: true,
        onSuccess: () => {
          toast.success(t('Service removed successfully.'));
          emitCatalogUpdate('delete');
          onFinish?.();
        },
      }
    );
  };

  const helperText = isEdit
    ? t('Refine the details so prospects know exactly how this service delivers value.')
    : t('Spotlight the services that define your craft—perfect for construction, consulting, and more.');

  return (
    <Card className={cn('border border-slate-200 shadow-lg shadow-orange-100/40')}>
      <form onSubmit={handleSubmit} className="space-y-6">
        <CardHeader className="space-y-2 border-b bg-slate-900/5">
          <CardTitle className="flex items-center gap-2 text-lg font-semibold">
            {isEdit ? <PencilLine className="h-5 w-5 text-orange-500" /> : <PlusCircle className="h-5 w-5 text-orange-500" />}
            {isEdit ? t('Update service offering') : t('Add a new service')}
          </CardTitle>
          <p className="text-sm text-muted-foreground">{helperText}</p>
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor={isEdit ? `service-name-${service!.id}` : 'service-name-new'}>{t('Service name')}</Label>
              <Input
                id={isEdit ? `service-name-${service!.id}` : 'service-name-new'}
                placeholder={t('Service Name')}
                value={form.data.name}
                onChange={(event) => form.setData('name', event.target.value)}
                required
              />
              {form.errors.name && <p className="text-xs text-red-500">{form.errors.name}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor={isEdit ? `service-slug-${service!.id}` : 'service-slug-new'}>{t('Slug (optional)')}</Label>
              <Input
                id={isEdit ? `service-slug-${service!.id}` : 'service-slug-new'}
                placeholder={t('electrical-installation')}
                value={form.data.slug}
                onChange={(event) => form.setData('slug', event.target.value)}
              />
              {form.errors.slug && <p className="text-xs text-red-500">{form.errors.slug}</p>}
            </div>
          </div>

          <div className="space-y-2">
            <Label>{t('Summary highlight')}</Label>
            <Input
              placeholder={t('Brief description of this service.')}
              value={form.data.summary}
              onChange={(event) => form.setData('summary', event.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label>{t('Detailed description')}</Label>
            <Textarea
              placeholder={t('Detailed description of what this service includes and how it benefits customers.')}
              rows={4}
              value={form.data.description}
              onChange={(event) => form.setData('description', event.target.value)}
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>{t('Category')}</Label>
              <Input
                placeholder={t('Service category or type')}
                value={form.data.category}
                onChange={(event) => form.setData('category', event.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>{t('Duration label')}</Label>
              <Input
                placeholder={t('Estimated time to complete')}
                value={form.data.duration_label}
                onChange={(event) => form.setData('duration_label', event.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>{t('Cover image')}</Label>
            <MediaPicker
              value={form.data.meta_image}
              onChange={(value) => form.setData('meta_image', value)}
              placeholder={t('Select an image to represent this service')}
            />
            <p className="text-xs text-muted-foreground">
              {t('Add an image that represents this service.')}
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <div className="space-y-2">
              <Label>{t('Price type')}</Label>
              <Input
                placeholder={t('Fixed, hourly, project-based...')}
                value={form.data.price_type}
                onChange={(event) => form.setData('price_type', event.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>{t('Price amount')}</Label>
              <Input
                type="number"
                min="0"
                step="0.01"
                value={form.data.price_amount ?? ''}
                onChange={(event) =>
                  form.setData(
                    'price_amount',
                    event.target.value === '' ? '' : Number(event.target.value)
                  )
                }
              />
            </div>
            <div className="space-y-2">
              <Label>{t('Currency')}</Label>
              <Input
                placeholder="USD"
                maxLength={10}
                value={form.data.price_currency}
                onChange={(event) => form.setData('price_currency', event.target.value)}
              />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="flex items-center justify-between rounded-lg border border-dashed border-orange-200/70 bg-orange-50/70 px-3 py-3">
              <div>
                <p className="text-sm font-medium text-slate-900">{t('Feature this service')}</p>
                <p className="text-xs text-muted-foreground">
                  {t('Pinned services are prioritised in the Services section of your preview.')}
                </p>
              </div>
              <Switch
                checked={form.data.is_featured}
                onCheckedChange={(value) => form.setData('is_featured', value)}
              />
            </div>
            <div className="space-y-2">
              <Label>{t('Display order')}</Label>
              <Input
                type="number"
                min="0"
                value={form.data.order_index ?? ''}
                onChange={(event) =>
                  form.setData(
                    'order_index',
                    event.target.value === '' ? '' : Number(event.target.value)
                  )
                }
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 border-t bg-slate-50 px-6 py-4">
            {isEdit && (
              <Button type="button" variant="ghost" onClick={onFinish} disabled={form.processing}>
                {t('Cancel')}
              </Button>
            )}
            {isEdit && (
              <Button type="button" variant="destructive" onClick={handleDelete} disabled={form.processing}>
                <Trash2 className="mr-1 h-4 w-4" />
                {t('Remove service')}
              </Button>
            )}
            <Button type="submit" disabled={form.processing}>
              {isEdit ? t('Save service') : t('Publish service')}
            </Button>
          </div>
        </CardContent>
      </form>
    </Card>
  );
};

const ServiceListItem: React.FC<{
  service: ServiceResource;
  onEdit: () => void;
  onDelete: () => void;
}> = ({ service, onEdit, onDelete }) => {
  const { t } = useTranslation();

  const priceLabel = React.useMemo(() => {
    if (service.price_amount !== null && service.price_amount !== undefined && service.price_amount !== '') {
      return `${service.price_amount}${service.price_currency ? ` ${service.price_currency}` : ''}`;
    }

    if (service.price_currency) {
      return service.price_currency;
    }

    return null;
  }, [service.price_amount, service.price_currency]);

  const details = React.useMemo(() => {
    return [service.category, service.duration_label, service.price_type, priceLabel]
      .filter(Boolean)
      .join(' • ');
  }, [priceLabel, service.category, service.duration_label, service.price_type]);

  return (
    <Card className="border border-border/60">
      <CardContent className="flex flex-col gap-3 py-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1">
          <p className="text-sm font-semibold">{service.name}</p>
          {service.summary && (
            <p className="text-xs text-muted-foreground">{service.summary}</p>
          )}
          {details && <p className="text-xs text-muted-foreground">{details}</p>}
        </div>
        <div className="flex gap-2 self-end sm:self-auto">
          <Button variant="outline" size="sm" onClick={onEdit}>
            {t('Edit')}
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="text-destructive hover:text-destructive"
            onClick={onDelete}
          >
            {t('Delete')}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

const PackageFormCard: React.FC<{
  businessId: number;
  package?: PackageResource;
  defaultOrder: number;
  onFinish?: () => void;
}> = ({ businessId, package: packageResource, defaultOrder, onFinish }) => {
  const { t } = useTranslation();
  const isEdit = Boolean(packageResource);

  const emitCatalogUpdate = React.useCallback(
    (action: 'create' | 'update' | 'delete') => {
      if (typeof window === 'undefined') {
        return;
      }

      window.dispatchEvent(
        new CustomEvent('catalog:updated', {
          detail: {
            businessId,
            entity: 'package' as const,
            action,
          },
        })
      );
    },
    [businessId]
  );

  const initialData = packageResource
    ? {
        name: packageResource.name ?? '',
        slug: packageResource.slug ?? '',
        headline: packageResource.headline ?? '',
        description: packageResource.description ?? '',
        price_display: packageResource.price_display ?? '',
        price_amount: packageResource.price_amount ?? '',
        price_currency: packageResource.price_currency ?? '',
        duration_label: packageResource.duration_label ?? '',
        cta_label: packageResource.cta_label ?? '',
        cta_link: packageResource.cta_link ?? '',
        is_featured: packageResource.is_featured ?? false,
        order_index: packageResource.order_index ?? null,
        features: packageResource.features ?? [],
        meta_image:
          packageResource.meta_image ?? (packageResource.meta as Record<string, any> | undefined)?.image ?? '',
      }
    : defaultPackageFormData(defaultOrder);

  const form = useForm<PackageFormData>(initialData);

  const [featuresText, setFeaturesText] = React.useState<string>(
    (packageResource?.features ?? []).join('\n')
  );

  React.useEffect(() => {
    if (packageResource && !form.isDirty) {
      const joined = (packageResource.features ?? []).join('\n');
      setFeaturesText(joined);
      form.setData('features', packageResource.features ?? []);
    }
  }, [packageResource]);

  const handleFeaturesChange = (value: string) => {
    setFeaturesText(value);
    const lines = value
      .split('\n')
      .map((line) => line.trim())
      .filter(Boolean);
    form.setData('features', lines);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    form.transform((data) => ({
      ...data,
      price_amount: normalizeCurrencyValue(data.price_amount),
      order_index: normalizeNumber(data.order_index),
      cta_link: data.cta_link?.trim() ? data.cta_link.trim() : null,
      features: data.features ?? [],
      meta_image: typeof data.meta_image === 'string' ? data.meta_image.trim() : '',
    }));

    const options = {
      preserveScroll: true,
      onSuccess: () => {
        toast.success(
          isEdit ? t('Package updated successfully.') : t('Package created successfully.')
        );

        if (!isEdit) {
          form.reset();
          setFeaturesText('');
          emitCatalogUpdate('create');
        } else {
          emitCatalogUpdate('update');
          onFinish?.();
        }
      },
    };

    if (isEdit && packageResource) {
      form.put(
        route('vcard-builder.catalog.packages.update', {
          business: businessId,
          package: packageResource.id,
        }),
        options
      );
    } else {
      form.post(route('vcard-builder.catalog.packages.store', businessId), options);
    }
  };

  const handleDelete = () => {
    if (!packageResource) return;
    if (!confirm(t('Are you sure you want to remove this package?'))) {
      return;
    }

    router.delete(
      route('vcard-builder.catalog.packages.destroy', {
        business: businessId,
        package: packageResource.id,
      }),
      {
        preserveScroll: true,
        onSuccess: () => {
          toast.success(t('Package removed successfully.'));
          emitCatalogUpdate('delete');
          onFinish?.();
        },
      }
    );
  };

  const helperText = isEdit
    ? t('Fine-tune pricing, timelines, and features to close projects faster.')
    : t('Create compelling packages with clear deliverables, ideal for construction, design, or consulting.');

  return (
    <Card className={cn('border border-slate-200 shadow-lg shadow-blue-100/40')}>
      <form onSubmit={handleSubmit} className="space-y-6">
        <CardHeader className="space-y-2 border-b bg-slate-900/5">
          <CardTitle className="flex items-center gap-2 text-lg font-semibold">
            {isEdit ? <PencilLine className="h-5 w-5 text-sky-500" /> : <PlusCircle className="h-5 w-5 text-sky-500" />}
            {isEdit ? t('Update package offer') : t('Add a new package')}
          </CardTitle>
          <p className="text-sm text-muted-foreground">{helperText}</p>
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor={isEdit ? `package-name-${packageResource?.id ?? 'edit'}` : 'package-name-new'}>{t('Package name')}</Label>
              <Input
                id={isEdit ? `package-name-${packageResource?.id ?? 'edit'}` : 'package-name-new'}
                placeholder={t('Package Name')}
                value={form.data.name}
                onChange={(event) => form.setData('name', event.target.value)}
                required
              />
              {form.errors.name && <p className="text-xs text-red-500">{form.errors.name}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor={isEdit ? `package-slug-${packageResource?.id ?? 'edit'}` : 'package-slug-new'}>{t('Slug (optional)')}</Label>
              <Input
                id={isEdit ? `package-slug-${packageResource?.id ?? 'edit'}` : 'package-slug-new'}
                placeholder={t('premium-construction')}
                value={form.data.slug}
                onChange={(event) => form.setData('slug', event.target.value)}
              />
              {form.errors.slug && <p className="text-xs text-red-500">{form.errors.slug}</p>}
            </div>
          </div>

          <div className="space-y-2">
            <Label>{t('Headline')}</Label>
            <Input
              placeholder={t('Brief overview of what this package offers.')}
              value={form.data.headline}
              onChange={(event) => form.setData('headline', event.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label>{t('Description')}</Label>
            <Textarea
              placeholder={t('Detailed description of what this package includes and its benefits.')}
              rows={4}
              value={form.data.description}
              onChange={(event) => form.setData('description', event.target.value)}
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>{t('Price display')}</Label>
              <Input
                placeholder={t('Price range or starting price')}
                value={form.data.price_display}
                onChange={(event) => form.setData('price_display', event.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>{t('Numeric price amount')}</Label>
              <Input
                type="number"
                min="0"
                step="0.01"
                value={form.data.price_amount ?? ''}
                onChange={(event) =>
                  form.setData(
                    'price_amount',
                    event.target.value === '' ? '' : Number(event.target.value)
                  )
                }
              />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <div className="space-y-2">
              <Label>{t('Currency')}</Label>
              <Input
                placeholder="USD"
                maxLength={10}
                value={form.data.price_currency}
                onChange={(event) => form.setData('price_currency', event.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>{t('Duration label')}</Label>
              <Input
                placeholder={t('Estimated time to deliver')}
                value={form.data.duration_label}
                onChange={(event) => form.setData('duration_label', event.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>{t('CTA label')}</Label>
              <Input
                placeholder={t('Call to action text')}
                value={form.data.cta_label}
                onChange={(event) => form.setData('cta_label', event.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>{t('CTA link')}</Label>
            <Input
              placeholder="https://"
              value={form.data.cta_link ?? ''}
              onChange={(event) => form.setData('cta_link', event.target.value)}
            />
            {form.errors.cta_link && <p className="text-xs text-red-500">{form.errors.cta_link}</p>}
          </div>

          <div className="space-y-2">
            <Label>{t('Included features')}</Label>
            <Textarea
              placeholder={t('List key features or deliverables, one per line.')}
              rows={5}
              value={featuresText}
              onChange={(event) => handleFeaturesChange(event.target.value)}
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="flex items-center justify-between rounded-lg border border-dashed border-sky-200/70 bg-sky-50/70 px-3 py-3">
              <div>
                <p className="text-sm font-medium text-slate-900">{t('Feature this package')}</p>
                <p className="text-xs text-muted-foreground">
                  {t('Keep flagship offers front-and-centre in your Packages section.')}
                </p>
              </div>
              <Switch
                checked={form.data.is_featured}
                onCheckedChange={(value) => form.setData('is_featured', value)}
              />
            </div>
            <div className="space-y-2">
              <Label>{t('Display order')}</Label>
              <Input
                type="number"
                min="0"
                value={form.data.order_index ?? ''}
                onChange={(event) =>
                  form.setData(
                    'order_index',
                    event.target.value === '' ? '' : Number(event.target.value)
                  )
                }
              />
            </div>
          </div>
        </CardContent>

        <div className="flex items-center justify-end gap-3 border-t bg-slate-50 px-6 py-4">
          {isEdit && (
            <Button type="button" variant="ghost" onClick={onFinish} disabled={form.processing}>
              {t('Cancel')}
            </Button>
          )}
          {isEdit && (
            <Button type="button" variant="destructive" onClick={handleDelete} disabled={form.processing}>
              <Trash2 className="mr-1 h-4 w-4" />
              {t('Remove package')}
            </Button>
          )}
          <Button type="submit" disabled={form.processing}>
            {isEdit ? t('Save package') : t('Publish package')}
          </Button>
        </div>
      </form>
    </Card>
  );
};

const PackageListItem: React.FC<{
  package: PackageResource;
  onEdit: () => void;
  onDelete: () => void;
}> = ({ package: pkg, onEdit, onDelete }) => {
  const { t } = useTranslation();

  const priceLabel = React.useMemo(() => {
    if (pkg.price_display) {
      return pkg.price_display;
    }

    if (pkg.price_amount !== null && pkg.price_amount !== undefined && pkg.price_amount !== '') {
      return `${pkg.price_amount}${pkg.price_currency ? ` ${pkg.price_currency}` : ''}`;
    }

    if (pkg.price_currency) {
      return pkg.price_currency;
    }

    return null;
  }, [pkg.price_amount, pkg.price_currency, pkg.price_display]);

  const details = React.useMemo(() => {
    return [priceLabel, pkg.duration_label].filter(Boolean).join(' • ');
  }, [pkg.duration_label, priceLabel]);

  const featureSummary = React.useMemo(() => {
    if (!pkg.features || pkg.features.length === 0) {
      return null;
    }

    return t('{{count}} feature', {
      count: pkg.features.length,
      defaultValue:
        pkg.features.length === 1 ? t('1 feature') : t('{{count}} features', { count: pkg.features.length }),
    });
  }, [pkg.features, t]);

  return (
    <Card className="relative overflow-hidden border border-slate-200/80 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-lg">
      <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-sky-500 via-indigo-400 to-purple-400" />
      <CardContent className="space-y-4 pt-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <Badge variant="outline" className="flex items-center gap-1 border-sky-200 bg-sky-50 text-sky-800">
              <PackageIcon className="h-3.5 w-3.5" />
              {priceLabel || t('Custom pricing')}
            </Badge>
            {pkg.is_featured && (
              <Badge className="bg-gradient-to-r from-violet-500 to-sky-500 text-white">
                <Sparkles className="mr-1 h-3.5 w-3.5" />
                {t('Featured')}
              </Badge>
            )}
          </div>

          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Layers className="h-4 w-4" />
            {t('Order')}: {pkg.order_index ?? '—'}
          </div>
        </div>

        <div className="space-y-2">
          <h3 className="text-xl font-semibold text-slate-900">{pkg.name}</h3>
          {pkg.headline && <p className="text-sm font-medium text-slate-700">{pkg.headline}</p>}
          {details && <p className="text-sm text-slate-500">{details}</p>}
          {pkg.description && (
            <p className="text-sm leading-relaxed text-slate-600 whitespace-pre-line">{pkg.description}</p>
          )}
          {featureSummary && (
            <p className="text-xs uppercase tracking-wide text-slate-400">{featureSummary}</p>
          )}
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 pt-4">
          <div className="text-sm text-muted-foreground">
            {pkg.cta_label && pkg.cta_link ? (
              <span>
                {pkg.cta_label} ·{' '}
                <a
                  href={pkg.cta_link}
                  target="_blank"
                  rel="noreferrer"
                  className="text-sky-600 underline-offset-4 hover:underline"
                >
                  {pkg.cta_link}
                </a>
              </span>
            ) : (
              <span>{t('No CTA configured yet.')}</span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={onEdit}>
              <PencilLine className="mr-1 h-4 w-4" />
              {t('Edit')}
            </Button>
            <Button variant="destructive" size="sm" onClick={onDelete}>
              <Trash2 className="mr-1 h-4 w-4" />
              {t('Remove')}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const CatalogManagerPage: React.FC<CatalogManagerProps> = ({ business, services, packages }) => {
  const { t } = useTranslation();
  const [editingServiceId, setEditingServiceId] = React.useState<number | null>(null);
  const [editingPackageId, setEditingPackageId] = React.useState<number | null>(null);

  const breadcrumbs = React.useMemo(
    () => [
      { title: t('Dashboard'), href: route('dashboard') },
      { title: t('vCard Builder'), href: route('vcard-builder.index') },
      { title: business.name, href: route('vcard-builder.edit', business.id) },
      { title: t('Services & Packages') },
    ],
    [business.id, business.name, t]
  );

  const handleDeleteService = React.useCallback(
    (service: ServiceResource) => {
      if (!confirm(t('Are you sure you want to remove this service?'))) {
        return;
      }

      router.delete(
        route('vcard-builder.catalog.services.destroy', {
          business: business.id,
          service: service.id,
        }),
        {
          preserveScroll: true,
          onSuccess: () => {
            toast.success(t('Service removed successfully.'));
            setEditingServiceId((current) => (current === service.id ? null : current));
          },
        }
      );
    },
    [business.id, t]
  );

  const handleDeletePackage = React.useCallback(
    (packageResource: PackageResource) => {
      if (!confirm(t('Are you sure you want to remove this package?'))) {
        return;
      }

      router.delete(
        route('vcard-builder.catalog.packages.destroy', {
          business: business.id,
          package: packageResource.id,
        }),
        {
          preserveScroll: true,
          onSuccess: () => {
            toast.success(t('Package removed successfully.'));
            setEditingPackageId((current) => (current === packageResource.id ? null : current));
          },
        }
      );
    },
    [business.id, t]
  );

  return (
    <PageTemplate
      title={t('Services & Packages')}
      description={t('Manage the catalog content that powers your vCard template. Changes sync automatically to the builder and live preview.')}
      url={route('vcard-builder.catalog.manage', business.id)}
      breadcrumbs={breadcrumbs}
    >
      <Head title={`${business.name} • ${t('Services & Packages')}`} />

      <div className="space-y-10">
        <section className="space-y-4">
          <header>
            <h2 className="text-lg font-semibold">{t('Services')}</h2>
            <p className="text-sm text-muted-foreground">
              {t('Add or arrange the services that should appear on this vCard.')}
            </p>
          </header>

          <ServiceFormCard businessId={business.id} defaultOrder={services.length} />

          <div className="grid gap-4">
            {services.length === 0 && (
              <Card className="border border-dashed">
                <CardContent className="py-8 text-center text-sm text-muted-foreground">
                  {t('No services captured yet. Use the form above to create your first service.')}
                </CardContent>
              </Card>
            )}

            {services.map((service) => (
              editingServiceId === service.id ? (
                <ServiceFormCard
                  key={service.id}
                  businessId={business.id}
                  service={service}
                  defaultOrder={services.length}
                  onFinish={() => setEditingServiceId(null)}
                />
              ) : (
                <ServiceListItem
                  key={service.id}
                  service={service}
                  onEdit={() => setEditingServiceId(service.id)}
                  onDelete={() => handleDeleteService(service)}
                />
              )
            ))}
          </div>
        </section>

        <section className="space-y-4">
          <header>
            <h2 className="text-lg font-semibold">{t('Packages')}</h2>
            <p className="text-sm text-muted-foreground">
              {t('Create pricing packages or bundles for your offerings.')}
            </p>
          </header>

          <PackageFormCard businessId={business.id} defaultOrder={packages.length} />

          <div className="grid gap-4">
            {packages.length === 0 && (
              <Card className="border border-dashed">
                <CardContent className="py-8 text-center text-sm text-muted-foreground">
                  {t('No packages captured yet. Use the form above to add your first package.')}
                </CardContent>
              </Card>
            )}

            {packages.map((packageResource) => (
              editingPackageId === packageResource.id ? (
                <PackageFormCard
                  key={packageResource.id}
                  businessId={business.id}
                  package={packageResource}
                  defaultOrder={packages.length}
                  onFinish={() => setEditingPackageId(null)}
                />
              ) : (
                <PackageListItem
                  key={packageResource.id}
                  package={packageResource}
                  onEdit={() => setEditingPackageId(packageResource.id)}
                  onDelete={() => handleDeletePackage(packageResource)}
                />
              )
            ))}
          </div>
        </section>
      </div>
    </PageTemplate>
  );
};

export default CatalogManagerPage;
