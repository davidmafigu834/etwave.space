import React from 'react';
import { useTranslation } from 'react-i18next';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  ShieldCheck,
  PhoneCall,
  ShoppingBag,
  Star,
  MapPin,
  Clock,
  Camera,
  ExternalLink,
  MessageSquare
} from 'lucide-react';

interface RetailShopTemplateProps {
  data: any;
  template: any;
}

const resolveAssetUrl = (value?: string): string => {
  if (!value) return '';

  if (/^https?:\/\//i.test(value)) {
    return value;
  }

  if (value.startsWith('//')) {
    if (typeof window !== 'undefined') {
      return `${window.location.protocol}${value}`;
    }
    return `https:${value}`;
  }

  if (typeof window === 'undefined') {
    return value;
  }

  const appSettings = (window as any).appSettings || {};
  const candidates = [
    appSettings.imageUrl,
    appSettings.baseUrl,
    (window as any).baseUrl,
    (window as any).APP_URL,
    window.location.origin
  ].filter(Boolean) as string[];

  const sanitizedValue = value.replace(/^\/+/, '');

  for (const baseCandidate of candidates) {
    try {
      const formattedBase = baseCandidate.endsWith('/') ? baseCandidate : `${baseCandidate}/`;
      return new URL(sanitizedValue, formattedBase).toString();
    } catch (error) {
      // Ignore and try next candidate
    }
  }

  try {
    return new URL(value, window.location.origin).toString();
  } catch (error) {
    return value;
  }
};

const RetailShopTemplate: React.FC<RetailShopTemplateProps> = ({ data, template }) => {
  const { t } = useTranslation();
  const configSections = data?.config_sections || {};

  const colors: Record<string, string> = {
    ...(template?.defaultColors || {}),
    ...(configSections.colors || {})
  };

  const font = configSections.font || template?.defaultFont || 'Manrope, sans-serif';

  const header = configSections.header || {};
  const about = configSections.about || {};
  const storeGallery = (Array.isArray(configSections.store_gallery?.items) && configSections.store_gallery.items.length > 0
    ? configSections.store_gallery.items
    : template?.defaultData?.store_gallery?.items || []).filter((item: any) => Boolean(item?.image));
  const staff = configSections.staff_spotlight || {};
  const inventory = Array.isArray(configSections.inventory?.products) && configSections.inventory.products.length > 0
    ? configSections.inventory.products
    : template?.defaultData?.inventory?.products || [];

  const promotions = Array.isArray(configSections.promotions?.items) && configSections.promotions.items.length > 0
    ? configSections.promotions.items
    : template?.defaultData?.promotions?.items || [];

  const promises = Array.isArray(configSections.customer_promises?.promises) && configSections.customer_promises.promises.length > 0
    ? configSections.customer_promises.promises
    : template?.defaultData?.customer_promises?.promises || [];

  const reviews = Array.isArray(configSections.reviews?.testimonials) && configSections.reviews.testimonials.length > 0
    ? configSections.reviews.testimonials
    : template?.defaultData?.reviews?.testimonials || [];
  const contact = configSections.contact || {};
  const businessHours = configSections.business_hours?.hours || [];
  const socialLinks = configSections.social?.social_links || [];

  const fallbackStoreName = header.store_name || data.company_name || t('Local Retail Shop');
  const quickCaptureInput = React.useRef<HTMLInputElement | null>(null);

  const handleQuickAdd = () => {
    if (quickCaptureInput.current) {
      quickCaptureInput.current.click();
    }
  };

  const handleCaptureChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    const detail = {
      files,
      templateKey: 'retail-shop',
      context: 'quick-product-capture'
    };

    window.dispatchEvent(new CustomEvent('retailShop:newProductCapture', { detail }));
    event.target.value = '';
  };

  return (
    <div
      className="w-full"
      style={{ fontFamily: font, backgroundColor: colors.background || '#F9FBFF', color: colors.text || '#1F2937' }}
    >
      <section
        className="px-4 py-8 sm:py-10"
        style={{ backgroundColor: colors.cardBg || '#FFFFFF', borderBottom: `1px solid ${colors.borderColor || '#E5E7EB'}` }}
      >
        <div className="mx-auto flex max-w-5xl flex-col gap-6">
          <header className="flex flex-col items-start gap-4">
            <div className="flex w-full items-center gap-4">
              {header.store_logo && (
                <img
                  src={resolveAssetUrl(header.store_logo)}
                  alt={fallbackStoreName}
                  className="h-14 w-14 object-contain"
                />
              )}
              <div>
                {header.store_name && (
                  <h1 className="text-2xl font-semibold" style={{ color: colors.primary }}>
                    {header.store_name}
                  </h1>
                )}
                {(header.tagline || template?.defaultData?.header?.tagline) && (
                  <p className="text-sm" style={{ color: colors.text }}>
                    {header.tagline || template?.defaultData?.header?.tagline}
                  </p>
                )}
              </div>
            </div>
            {header.sales_rep_cta_url && header.sales_rep_cta_label && (
              <Button
                className="w-full"
                style={{ backgroundColor: colors.primary, color: colors.buttonText || '#FFFFFF' }}
                onClick={() => window.open(header.sales_rep_cta_url, '_blank', 'noopener,noreferrer')}
              >
                <PhoneCall className="mr-2 h-4 w-4" />
                {header.sales_rep_cta_label}
              </Button>
            )}
          </header>

          {Array.isArray(header.trust_badges) && header.trust_badges.length > 0 && (
            <div className="flex flex-wrap gap-3">
              {header.trust_badges.map((badge: any, idx: number) => (
                <Badge
                  key={idx}
                  className="border px-3 py-2 text-xs font-medium"
                  style={{ borderColor: colors.borderColor || '#E5E7EB', backgroundColor: colors.accent || '#F1F5F9', color: colors.text }}
                >
                  <ShieldCheck className="mr-2 h-4 w-4" />
                  {badge.icon && <span className="mr-1">{badge.icon}</span>}
                  {badge.label}
                </Badge>
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="px-4 py-10">
        <div className="mx-auto flex max-w-5xl flex-col gap-8">
          <div className="border p-6" style={{ borderColor: colors.borderColor || '#E5E7EB', backgroundColor: colors.cardBg || '#FFFFFF' }}>
            <h2 className="text-xl font-semibold" style={{ color: colors.primary }}>
              {about.headline || t('About Our Shop')}
            </h2>
            {about.intro && (
              <p className="mt-4 text-sm" style={{ color: colors.text }}>
                {about.intro}
              </p>
            )}
            {about.story && (
              <p className="mt-4 text-sm" style={{ color: colors.text }}>
                {about.story}
              </p>
            )}
          </div>
        </div>
      </section>

      {Array.isArray(storeGallery) && storeGallery.length > 0 && (
        <section className="px-4 py-10">
          <div className="mx-auto flex max-w-5xl flex-col gap-6">
            <div className="flex flex-col items-start gap-2">
              <h2 className="text-xl font-semibold" style={{ color: colors.primary }}>
                {t('Inside the Store')}
              </h2>
              <p className="text-sm" style={{ color: colors.text }}>
                {t('Explore highlighted spots around our shop to get a feel before you visit.')}
              </p>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              {storeGallery.map((item: any, idx: number) => (
                <div key={idx} className="flex flex-col border" style={{ borderColor: colors.borderColor || '#E5E7EB', backgroundColor: colors.cardBg || '#FFFFFF' }}>
                  <img src={resolveAssetUrl(item.image)} alt={item.caption || `${t('Store view')} ${idx + 1}`} className="h-44 w-full object-cover" />
                  <div className="flex flex-1 flex-col gap-2 p-4">
                    {item.caption && (
                      <h3 className="text-base font-semibold" style={{ color: colors.primary }}>
                        {item.caption}
                      </h3>
                    )}
                    {item.description && (
                      <p className="text-sm" style={{ color: colors.text }}>
                        {item.description}
                      </p>
                    )}
                    {(item.cta_label || item?.cta?.label) && (item.cta_url || item?.cta?.url) && (
                      <div className="mt-auto pt-2">
                        <Button
                          size="sm"
                          variant="outline"
                          className="border"
                          style={{ borderColor: colors.primary, color: colors.primary }}
                          onClick={() => window.open(item.cta_url || item?.cta?.url, '_blank', 'noopener,noreferrer')}
                        >
                          {item.cta_label || item?.cta?.label}
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {(staff.name || staff.photo) && (
        <section className="px-4 py-10">
          <div className="mx-auto flex max-w-5xl flex-col gap-6 border p-6" style={{ borderColor: colors.borderColor || '#E5E7EB', backgroundColor: colors.cardBg || '#FFFFFF' }}>
            <div className="flex flex-col gap-4">
              {staff.photo && (
                <img src={resolveAssetUrl(staff.photo)} alt={staff.name} className="h-32 w-32 object-cover" />
              )}
              <div>
                <p className="text-xs uppercase tracking-wide" style={{ color: colors.secondary }}>{t('Who is serving you today')}</p>
                <h3 className="mt-2 text-xl font-semibold" style={{ color: colors.primary }}>
                  {staff.name}
                </h3>
                {staff.role && (
                  <p className="text-sm" style={{ color: colors.text }}>
                    {staff.role}
                  </p>
                )}
                {staff.bio && (
                  <p className="mt-3 text-sm" style={{ color: colors.text }}>
                    {staff.bio}
                  </p>
                )}
              </div>
            </div>
            {staff.contact?.label && staff.contact?.url && (
              <Button
                className="w-full"
                style={{ backgroundColor: colors.secondary, color: colors.buttonText || '#FFFFFF' }}
                onClick={() => window.open(staff.contact.url, '_blank', 'noopener,noreferrer')}
              >
                <MessageSquare className="mr-2 h-4 w-4" />
                {staff.contact.label}
              </Button>
            )}
          </div>
        </section>
      )}

      <section className="px-4 py-10">
        <div className="mx-auto max-w-5xl">
          <div className="flex flex-col gap-3 border p-6" style={{ borderColor: colors.borderColor || '#E5E7EB', backgroundColor: colors.cardBg || '#FFFFFF' }}>
            <div className="flex flex-col gap-3">
              <div>
                <h2 className="text-xl font-semibold" style={{ color: colors.primary }}>
                  {t("What's in our shop today")}
                </h2>
                <p className="text-sm" style={{ color: colors.text }}>
                  {t('Browse items that are available right now.')}
                </p>
              </div>
              <div className="flex flex-col gap-3 sm:flex-col">
                <Button
                  variant="outline"
                  className="border px-4 py-2 text-xs"
                  style={{ borderColor: colors.borderColor || '#E5E7EB', color: colors.primary }}
                  onClick={handleQuickAdd}
                >
                  <Camera className="mr-2 h-4 w-4" />
                  {t('Add new product')}
                </Button>
                <input
                  ref={quickCaptureInput}
                  type="file"
                  accept="image/*"
                  capture="environment"
                  className="hidden"
                  onChange={handleCaptureChange}
                />
              </div>
            </div>

            <div className="flex flex-col gap-4">
              {inventory.map((product: any, idx: number) => (
                <article
                  key={idx}
                  className="flex h-full flex-col border"
                  style={{ borderColor: colors.borderColor || '#E5E7EB', backgroundColor: '#FFFFFF' }}
                >
                  {product.image ? (
                    <img src={resolveAssetUrl(product.image)} alt={product.name} className="h-48 w-full object-cover" />
                  ) : (
                    <div
                      className="flex h-48 w-full items-center justify-center text-xs uppercase tracking-wide"
                      style={{ backgroundColor: colors.accent || '#E5E7EB', color: colors.text }}
                    >
                      {t('No image available')}
                    </div>
                  )}
                  <div className="flex flex-1 flex-col gap-3 p-5">
                    <div>
                      <h3 className="text-lg font-semibold" style={{ color: colors.primary }}>
                        {product.name}
                      </h3>
                      {product.status && (
                        <p className="text-xs uppercase tracking-wide" style={{ color: colors.secondary }}>
                          {product.status}
                        </p>
                      )}
                    </div>
                    {product.description && (
                      <p className="text-sm" style={{ color: colors.text }}>
                        {product.description}
                      </p>
                    )}
                    <div className="mt-auto flex flex-wrap items-center justify-between gap-3">
                      {product.price && (
                        <span className="text-base font-semibold" style={{ color: colors.text }}>
                          {product.price}
                        </span>
                      )}
                      {(product.cta_label || product?.cta?.label) && (product.cta_url || product?.cta?.url) && (
                        <Button
                          size="sm"
                          style={{ backgroundColor: colors.primary, color: colors.buttonText || '#FFFFFF' }}
                          onClick={() => window.open(product.cta_url || product?.cta?.url, '_blank', 'noopener,noreferrer')}
                        >
                          <ShoppingBag className="mr-2 h-4 w-4" />
                          {product.cta_label || product?.cta?.label}
                        </Button>
                      )}
                    </div>
                    {Array.isArray(product.tags) && product.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2 text-[11px]" style={{ color: colors.secondary }}>
                        {product.tags.map((tag: string, tagIdx: number) => (
                          <span key={tagIdx} className="border px-2 py-1" style={{ borderColor: colors.borderColor || '#E5E7EB' }}>
                            #{tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      {Array.isArray(promotions) && promotions.length > 0 && (
        <section className="px-4 py-10">
          <div className="mx-auto max-w-5xl border p-6" style={{ borderColor: colors.borderColor || '#E5E7EB', backgroundColor: colors.cardBg || '#FFFFFF' }}>
            <div className="mb-6 flex flex-col gap-2">
              <div>
                <h2 className="text-xl font-semibold" style={{ color: colors.primary }}>{t('On Promotion')}</h2>
                <p className="text-sm" style={{ color: colors.text }}>
                  {t('Special offers curated for loyal customers.')}
                </p>
              </div>
            </div>
            <div className="flex flex-col gap-4">
              {promotions.map((promo: any, idx: number) => (
                <article key={idx} className="border" style={{ borderColor: colors.borderColor || '#E5E7EB', backgroundColor: '#FFFFFF' }}>
                  {promo.image && <img src={resolveAssetUrl(promo.image)} alt={promo.title} className="h-40 w-full object-cover" />}
                  <div className="space-y-3 p-5">
                    <div>
                      <h3 className="text-lg font-semibold" style={{ color: colors.primary }}>{promo.title}</h3>
                      {promo.tagline && (
                        <p className="text-xs uppercase tracking-wide" style={{ color: colors.secondary }}>{promo.tagline}</p>
                      )}
                    </div>
                    {promo.description && (
                      <p className="text-sm" style={{ color: colors.text }}>{promo.description}</p>
                    )}
                    {promo.discount && (
                      <Badge
                        className="border px-3 py-1 text-xs font-semibold"
                        style={{ borderColor: colors.secondary, color: colors.secondary, backgroundColor: colors.accent || '#E0ECFF' }}
                      >
                        {promo.discount}
                      </Badge>
                    )}
                    {promo.cta_label && promo.cta_url && (
                      <Button
                        size="sm"
                        style={{ backgroundColor: colors.secondary, color: colors.buttonText || '#FFFFFF' }}
                        onClick={() => window.open(promo.cta_url, '_blank', 'noopener,noreferrer')}
                      >
                        <ExternalLink className="mr-2 h-4 w-4" />
                        {promo.cta_label}
                      </Button>
                    )}
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
      )}

      {Array.isArray(promises) && promises.length > 0 && (
        <section className="px-4 py-10">
          <div className="mx-auto max-w-5xl border p-6" style={{ borderColor: colors.borderColor || '#E5E7EB', backgroundColor: colors.cardBg || '#FFFFFF' }}>
            <h2 className="text-xl font-semibold" style={{ color: colors.primary }}>{t('Customer Promises')}</h2>
            <div className="mt-6 flex flex-col gap-4">
              {promises.map((promise: any, idx: number) => (
                <div key={idx} className="border p-4" style={{ borderColor: colors.borderColor || '#E5E7EB', backgroundColor: '#FFFFFF' }}>
                  <h3 className="text-sm font-semibold" style={{ color: colors.text }}>{promise.title}</h3>
                  <p className="mt-2 text-xs" style={{ color: colors.text }}>{promise.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {Array.isArray(reviews) && reviews.length > 0 && (
        <section className="px-4 py-10">
          <div className="mx-auto max-w-5xl border p-6" style={{ borderColor: colors.borderColor || '#E5E7EB', backgroundColor: colors.cardBg || '#FFFFFF' }}>
            <h2 className="text-xl font-semibold" style={{ color: colors.primary }}>{t('Happy Customers')}</h2>
            <div className="mt-6 flex flex-col gap-4">
              {reviews.map((review: any, idx: number) => (
                <blockquote key={idx} className="border p-5" style={{ borderColor: colors.borderColor || '#E5E7EB', backgroundColor: '#FFFFFF' }}>
                  <div className="mb-2 flex items-center gap-1">
                    {Array.from({ length: 5 }).map((_, starIdx) => (
                      <Star
                        key={starIdx}
                        className="h-4 w-4"
                        style={{ color: starIdx < (Number(review.rating) || 0) ? colors.secondary : '#CBD5F5' }}
                      />
                    ))}
                  </div>
                  <p className="text-sm" style={{ color: colors.text }}>
                    “{review.quote}”
                  </p>
                  <footer className="mt-4 text-xs font-semibold" style={{ color: colors.primary }}>
                    {review.customer_name}
                  </footer>
                </blockquote>
              ))}
            </div>
          </div>
        </section>
      )}

      {(contact.phone || contact.email || contact.address) && (
        <section className="px-4 py-10">
          <div className="mx-auto flex max-w-5xl flex-col gap-6 border p-6" style={{ borderColor: colors.borderColor || '#E5E7EB', backgroundColor: colors.cardBg || '#FFFFFF' }}>
            <h2 className="text-xl font-semibold" style={{ color: colors.primary }}>{t('Contact & Hours')}</h2>
            <div className="flex flex-col gap-4">
              <div className="space-y-3 text-sm" style={{ color: colors.text }}>
                {contact.address && (
                  <div className="flex items-start gap-3">
                    <MapPin className="h-4 w-4" />
                    <span>{contact.address}</span>
                  </div>
                )}
                {contact.phone && (
                  <div className="flex items-center gap-3">
                    <PhoneCall className="h-4 w-4" />
                    <a href={`tel:${contact.phone}`} className="underline">
                      {contact.phone}
                    </a>
                  </div>
                )}
                {contact.email && (
                  <div className="flex items-center gap-3">
                    <MessageSquare className="h-4 w-4" />
                    <a href={`mailto:${contact.email}`} className="underline">
                      {contact.email}
                    </a>
                  </div>
                )}
              </div>

              {Array.isArray(businessHours) && businessHours.length > 0 && (
                <div>
                  <div className="mb-3 flex items-center gap-2 text-sm font-semibold" style={{ color: colors.secondary }}>
                    <Clock className="h-4 w-4" />
                    {t('Business Hours')}
                  </div>
                  <div className="grid gap-2 text-xs" style={{ color: colors.text }}>
                    {businessHours.map((slot: any, idx: number) => (
                      <div key={idx} className="flex items-center justify-between border px-3 py-2" style={{ borderColor: colors.borderColor || '#E5E7EB' }}>
                        <span className="capitalize">{slot.day}</span>
                        <span>{slot.is_closed ? t('Closed') : `${slot.open_time || '--'} – ${slot.close_time || '--'}`}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {Array.isArray(socialLinks) && socialLinks.length > 0 && (
              <div className="border-t pt-4" style={{ borderColor: colors.borderColor || '#E5E7EB' }}>
                <h3 className="text-sm font-semibold" style={{ color: colors.primary }}>{t('Connect With Us')}</h3>
                <div className="mt-3 flex flex-wrap gap-2 text-xs" style={{ color: colors.text }}>
                  {socialLinks.map((link: any, idx: number) => (
                    <a
                      key={idx}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="border px-3 py-2"
                      style={{ borderColor: colors.borderColor || '#E5E7EB' }}
                    >
                      {link.platform ? link.platform.toUpperCase() : t('Social')}
                    </a>
                  ))}
                </div>
              </div>
            )}

            {contact.map_url && (
              <div className="border-t pt-4" style={{ borderColor: colors.borderColor || '#E5E7EB' }}>
                <Button
                  variant="outline"
                  className="border px-4 py-2 text-xs"
                  style={{ borderColor: colors.primary, color: colors.primary }}
                  onClick={() => window.open(contact.map_url, '_blank', 'noopener,noreferrer')}
                >
                  <MapPin className="mr-2 h-4 w-4" />
                  {t('View on Maps')}
                </Button>
              </div>
            )}
          </div>
        </section>
      )}
    </div>
  );
};

export default RetailShopTemplate;
