import React from 'react';
import { Head, useForm } from '@inertiajs/react';
import { PageWrapper } from '@/components/PageWrapper';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ErrorBoundary } from 'react-error-boundary';
import type { FallbackProps } from 'react-error-boundary';

// Add error boundary fallback component
function PreviewErrorFallback({ error, resetErrorBoundary }: FallbackProps) {
  return (
    <div className="p-4 bg-red-50 text-red-800 rounded-lg m-4">
      <h3 className="font-bold">Preview Error</h3>
      <p className="text-sm mb-2">{error.message}</p>
      <button 
        onClick={resetErrorBoundary}
        className="text-sm px-3 py-1 bg-red-100 hover:bg-red-200 rounded"
      >
        Try Again
      </button>
    </div>
  );
}
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import VCardSectionManager from '@/components/VCardSectionManager';
import VCardPreview from '@/pages/vcard-builder/components/VCardPreview';
import DomainConfig from '@/components/DomainConfig';
import MediaPicker from '@/components/MediaPicker';
import ContactFormModal from '@/components/ContactFormModal';
import AppointmentFormModal from '@/components/AppointmentFormModal';
import { getBusinessTemplate, businessTypeOptions, BUSINESS_TYPE_ALIASES, resolveBusinessType } from '@/pages/vcard-builder/business-templates';
import VCardAIInstructionBox from './components/VCardAIInstructionBox';
import { OnboardingProfileData } from '@/types/onboarding';
import axios from 'axios';
import { useTranslation } from 'react-i18next';
import { toast } from '@/components/custom-toast';
import { normalizeAllowedSections } from '@/utils/planSections';
import { normalizeGallerySection } from '@/utils/gallery';

type ConfigSectionMap = Record<string, any>;

type TemplateOption = (typeof businessTypeOptions)[number];

interface CatalogMedia {
  id: number;
  kind: string;
  url: string | null;
  title?: string | null;
  alt_text?: string | null;
  pivot?: {
    order_index?: number;
    caption?: string | null;
  } | null;
}

interface CatalogService {
  id: number;
  name: string;
  slug: string;
  summary?: string | null;
  description?: string | null;
  category?: string | null;
  price_type?: string | null;
  price_amount?: string | null;
  price_currency?: string | null;
  duration_label?: string | null;
  is_featured?: boolean;
  order_index?: number;
  meta?: Record<string, any> | null;
  media?: CatalogMedia[];
}

interface CatalogPackageFeature {
  id: number;
  feature: string;
  order_index?: number;
}

interface CatalogPackage {
  id: number;
  name: string;
  slug: string;
  headline?: string | null;
  description?: string | null;
  price_display?: string | null;
  price_amount?: string | null;
  price_currency?: string | null;
  duration_label?: string | null;
  cta_label?: string | null;
  cta_link?: string | null;
  is_featured?: boolean;
  order_index?: number;
  meta?: Record<string, any> | null;
  features?: CatalogPackageFeature[];
  media?: CatalogMedia[];
}

interface CatalogProject {
  id: number;
  title: string;
  slug?: string | null;
  category?: string | null;
  location?: string | null;
  summary?: string | null;
  description?: string | null;
  cta_label?: string | null;
  cta_link?: string | null;
  is_featured?: boolean;
  order_index?: number | null;
  meta?: Record<string, any> | null;
  media?: CatalogMedia[];
}

interface CatalogGalleryItem {
  id: number;
  media_id?: string | null;
  media_type?: string | null;
  media_url?: string | null;
  thumbnail_url?: string | null;
  title?: string | null;
  description?: string | null;
  order_index?: number | null;
  meta?: Record<string, any> | null;
}

interface CatalogGallery {
  id: number;
  title?: string | null;
  description?: string | null;
  items?: CatalogGalleryItem[];
}

interface BusinessCatalogResponse {
  services: CatalogService[];
  packages: CatalogPackage[];
  projects: CatalogProject[];
  project_gallery?: CatalogGallery | null;
}

interface FormState extends Record<string, any> {
  name: string;
  slug: string;
  business_type: string;
  custom_domain: string;
  url_prefix: string;
  password: string;
  password_enabled: boolean;
  domain_type: 'slug' | 'subdomain' | 'domain';
  favicon: string;
  template_config: Record<string, any>;
  config_sections: ConfigSectionMap;
  [key: string]: any;
}

interface Business {
  id: number;
  name: string;
  slug: string;
  business_type: string;
  config_sections: ConfigSectionMap;
  custom_domain?: string;
  url_prefix?: string;
  password?: string;
  password_enabled?: boolean;
  favicon?: string;
  domain_type?: 'slug' | 'subdomain' | 'domain';
  template_config?: Record<string, any>;
}

const CATALOG_MANAGED_KEYS = new Set(['service_highlights', 'packages', 'projects', 'gallery', 'contact']);

const hasSectionContent = (value: any): boolean => {
  if (value === null || typeof value === 'undefined') {
    return false;
  }

  if (typeof value === 'string') {
    return value.trim().length > 0;
  }

  if (typeof value === 'number' || typeof value === 'boolean') {
    return true;
  }

  if (Array.isArray(value)) {
    return value.some((entry) => hasSectionContent(entry));
  }

  if (typeof value === 'object') {
    return Object.values(value).some((entry) => hasSectionContent(entry));
  }

  return false;
};

const buildOnboardingContext = (profile?: OnboardingProfileData | null): Record<string, any> | null => {
  if (!profile) {
    return null;
  }

  const context: Record<string, any> = {};
  const keys: Array<keyof OnboardingProfileData> = [
    'business_name',
    'business_description',
    'business_category',
    'business_subcategory',
    'contact_name',
    'contact_email',
    'contact_phone',
    'whatsapp',
    'website',
    'country',
    'city',
    'address_line1',
    'address_line2'
  ];

  keys.forEach((key) => {
    const value = profile[key];
    if (value === undefined || value === null) {
      return;
    }

    if (typeof value === 'string') {
      const trimmed = value.trim();
      if (!trimmed) {
        return;
      }
      context[key] = trimmed;
      return;
    }

    context[key] = value;
  });

  if (Array.isArray(profile.social_links) && profile.social_links.length > 0) {
    context.social_links = profile.social_links
      .filter((link) => link && typeof link.platform === 'string' && typeof link.url === 'string')
      .map((link) => {
        const entry: Record<string, any> = {
          platform: link.platform,
          url: link.url
        };

        if (link.username && typeof link.username === 'string' && link.username.trim()) {
          entry.username = link.username.trim();
        }

        return entry;
      });
  }

  return Object.keys(context).length > 0 ? context : null;
};

const filterExternallyManagedSections = (sections: Record<string, any> | null | undefined): Record<string, any> => {
  if (!sections || typeof sections !== 'object') {
    return {} as Record<string, any>;
  }

  const filteredEntries = Object.entries(sections).filter(([key]) => !CATALOG_MANAGED_KEYS.has(String(key)));

  return filteredEntries.reduce<Record<string, any>>((accumulator, [key, value]) => {
    accumulator[key] = value;
    return accumulator;
  }, {});
};

const filterNarrativeSections = (sections: Record<string, any> | null | undefined): Record<string, any> => {
  if (!sections || typeof sections !== 'object') {
    return {};
  }

  const filtered: Record<string, any> = {};

  Object.entries(sections).forEach(([key, value]) => {
    if (CATALOG_MANAGED_KEYS.has(String(key))) {
      return;
    }

    if (hasSectionContent(value)) {
      filtered[key] = value;
    }
  });

  return filtered;
};

const buildAiBootstrapPayload = (options: {
  businessName: string;
  businessType: string;
  tone: string;
  language: string;
  sections: Record<string, any>;
  templateSections: string[];
  onboardingContext?: Record<string, any> | null;
}) => {
  const narrativeSections = filterNarrativeSections(options.sections);

  return {
    business_name: options.businessName || undefined,
    business_type: options.businessType || undefined,
    tone: options.tone,
    language: options.language,
    sections: narrativeSections,
    template_sections: options.templateSections,
    force_full: true,
    onboarding_context: options.onboardingContext,
  };
};

const mergeSectionValues = (existing: any, incoming: any): any => {
  if (incoming === null || typeof incoming === 'undefined') {
    return existing;
  }

  if (Array.isArray(incoming)) {
    return incoming;
  }

  if (typeof incoming === 'object') {
    const base = typeof existing === 'object' && existing !== null && !Array.isArray(existing) ? existing : {};
    const result: Record<string, any> = { ...base };
    Object.entries(incoming).forEach(([key, value]) => {
      result[key] = mergeSectionValues(result[key], value);
    });
    return result;
  }

  return incoming;
};

const applyAiPrefillToSections = (
  currentSections: ConfigSectionMap,
  aiSections: Record<string, any>
): ConfigSectionMap => {
  if (!aiSections || Object.keys(aiSections).length === 0) {
    return currentSections;
  }

  const merged: ConfigSectionMap = {
    ...currentSections
  };

  if (currentSections._allowed_sections) {
    merged._allowed_sections = currentSections._allowed_sections;
  }

  Object.entries(aiSections).forEach(([sectionKey, sectionValue]) => {
    if (sectionKey === '_meta') {
      return;
    }

    const existingSection = merged[sectionKey] ?? {};
    merged[sectionKey] = mergeSectionValues(existingSection, sectionValue);
  });

  return merged;
};

interface NormalizeSectionsOptions {
  onboardingProfile?: OnboardingProfileData | null;
  fallbackName?: string;
  businessType?: string;
}

const ensureHttps = (value: unknown): unknown => {
  if (typeof value !== 'string') {
    return value;
  }

  const trimmed = value.trim();
  if (!trimmed) {
    return trimmed;
  }

  if (/^https?:\/\//i.test(trimmed) || /^mailto:/i.test(trimmed)) {
    return trimmed;
  }

  return `https://${trimmed.replace(/^\/+/, '')}`;
};

const coerceList = (value: unknown): string[] => {
  if (!value) return [];
  if (Array.isArray(value)) {
    return value
      .map((item) => {
        if (typeof item === 'string') return item;
        if (item && typeof item === 'object' && 'label' in item && typeof item.label === 'string') {
          return item.label;
        }
        return typeof item === 'object' && item !== null ? Object.values(item)[0] as string : '';
      })
      .filter((entry): entry is string => typeof entry === 'string' && entry.trim().length > 0);
  }
  if (typeof value === 'string') {
    return value
      .split(/[\n,|]/)
      .map((entry) => entry.trim())
      .filter((entry) => entry.length > 0);
  }
  return [];
};

const normalizeAiSections = (
  aiSections: Record<string, any>,
  template: any,
  options?: NormalizeSectionsOptions
): Record<string, any> => {
  if (!aiSections || typeof aiSections !== 'object') {
    return {};
  }

  const templateDefaults = (template?.defaultData || {}) as ConfigSectionMap;
  const cloned = JSON.parse(JSON.stringify(aiSections)) as Record<string, any>;
  const canonicalizeKey = (key: string): string => key.replace(/[^a-z0-9]/gi, '').toLowerCase();
  const aliasMap: Record<string, string> = {
    aboutcompany: 'about',
    aboutsection: 'about',
    aboutus: 'about',
    companyoverview: 'about',
    businessoverview: 'about',
    missionstatement: 'about',
    herosection: 'hero',
    heroarea: 'hero',
    herobanner: 'hero',
    ourprocess: 'process',
    processoverview: 'process',
    workflow: 'process',
    projectworkflow: 'process',
    processsteps: 'process',
    packagespricing: 'packages',
    pricingpackages: 'packages',
    pricingtiers: 'packages',
    pricingplans: 'packages',
    pricing: 'packages',
    calltoactionbanner: 'cta_banner',
    calltoaction: 'cta_banner',
    ctabanner: 'cta_banner',
    ctasection: 'cta_banner',
    socials: 'social',
    socialmedia: 'social',
    sociallinks: 'social',
    socialchannels: 'social',
    customertestimonials: 'testimonials',
    testimonialssection: 'testimonials',
    testimonialshighlights: 'testimonials',
    successstories: 'testimonials',
    reviewsection: 'testimonials',
    projectsportfolio: 'projects',
    casestudies: 'projects'
  };

  const allowedKeys = new Set<string>();
  Object.keys(templateDefaults || {}).forEach((key) => allowedKeys.add(key));
  if (Array.isArray(template?.sections)) {
    template.sections.forEach((section: any) => {
      if (section?.key) {
        allowedKeys.add(String(section.key));
      }
    });
  }
  // Always allow header/meta utility keys to flow through normalization
  allowedKeys.add('header');
  allowedKeys.add('colors');
  allowedKeys.add('font');
  allowedKeys.add('language');
  allowedKeys.add('template_config');
  const passthroughKeys = new Set<string>(['_meta', '_allowed_sections']);

  const canonicalAllowedKeyMap = new Map<string, string>();
  allowedKeys.forEach((key) => {
    canonicalAllowedKeyMap.set(canonicalizeKey(key), key);
  });

  const normalized: Record<string, any> = {};
  Object.entries(cloned).forEach(([originalKey, value]) => {
    if (passthroughKeys.has(originalKey)) {
      normalized[originalKey] = value;
      return;
    }

    const canonicalKey = canonicalizeKey(originalKey);
    let targetKey = aliasMap[canonicalKey] ?? canonicalAllowedKeyMap.get(canonicalKey);
    if (!targetKey && allowedKeys.has(originalKey)) {
      targetKey = originalKey;
    }

    if (!targetKey) {
      for (const [canonicalAllowedKey, actualKey] of canonicalAllowedKeyMap.entries()) {
        if (canonicalKey.includes(canonicalAllowedKey) || canonicalAllowedKey.includes(canonicalKey)) {
          targetKey = actualKey;
          break;
        }
      }
    }

    if (!targetKey) {
      return;
    }

    if (normalized[targetKey] !== undefined) {
      normalized[targetKey] = mergeSectionValues(normalized[targetKey], value);
    } else {
      normalized[targetKey] = value;
    }
  });

  const defaultCompanyName =
    normalized.header?.company_name ||
    normalized.header?.name ||
    normalized.hero?.headline ||
    options?.fallbackName ||
    options?.onboardingProfile?.business_name ||
    templateDefaults?.header?.company_name ||
    templateDefaults?.hero?.headline ||
    '';

  if (!cloned.service_highlights && cloned.sectors_served) {
    const sectors = Array.isArray(cloned.sectors_served?.service_list)
      ? cloned.sectors_served?.service_list
      : coerceList(cloned.sectors_served?.services ?? cloned.sectors_served);

    cloned.service_highlights = {
      heading: cloned.sectors_served?.heading ?? cloned.sectors_served?.title ?? 'Services Overview',
      subheading:
        cloned.sectors_served?.subheading ??
        cloned.sectors_served?.description ??
        cloned.sectors_served?.summary ??
        '',
      services: sectors.map((entry: any) => {
        if (typeof entry === 'string') {
          return { icon: '•', title: entry, description: '' };
        }
        if (entry && typeof entry === 'object') {
          return {
            icon: entry.icon ?? '•',
            title: entry.title ?? entry.name ?? entry.label ?? '',
            description: entry.description ?? entry.summary ?? ''
          };
        }
        return { icon: '•', title: String(entry ?? ''), description: '' };
      }),
      cta_label: cloned.sectors_served?.cta_label ?? '',
      cta_link: cloned.sectors_served?.cta_link ?? ''
    };
  }

  const defaultHero = templateDefaults.hero ?? {};
  const headerSource = normalized.header ? { ...normalized.header } : {};

  if (Object.keys(headerSource).length > 0) {
    headerSource.name = headerSource.name ?? headerSource.company_name ?? defaultCompanyName;
    headerSource.company_name = headerSource.company_name ?? headerSource.name ?? defaultCompanyName;
    headerSource.tagline = headerSource.tagline ?? headerSource.subheadline ?? headerSource.headline ?? defaultHero.subheadline ?? '';
    headerSource.profile_image = headerSource.profile_image ?? defaultHero.profile_image ?? null;
    normalized.header = headerSource;
  }

  if (normalized.hero && typeof normalized.hero === 'object') {
    const heroSource = normalized.hero;

    heroSource.headline = heroSource.headline ?? heroSource.title ?? heroSource.heading ?? heroSource.business_name ?? heroSource.name ?? heroSource.company_name ?? defaultCompanyName;
    heroSource.subheadline = heroSource.subheadline ?? heroSource.subheading ?? heroSource.tagline ?? heroSource.caption ?? heroSource.description ?? '';
    heroSource.primary_cta_label = heroSource.primary_cta_label ?? heroSource.primaryLabel ?? heroSource.cta_label ?? heroSource.call_to_action ?? defaultHero.primary_cta_label;
    heroSource.primary_cta_link = heroSource.primary_cta_link ?? heroSource.primaryLink ?? heroSource.cta_link ?? defaultHero.primary_cta_link;
    heroSource.secondary_cta_label = heroSource.secondary_cta_label ?? heroSource.secondaryLabel ?? heroSource.secondary_cta ?? defaultHero.secondary_cta_label;
    heroSource.secondary_cta_link = heroSource.secondary_cta_link ?? heroSource.secondaryLink ?? heroSource.secondary_cta_link ?? defaultHero.secondary_cta_link;
  }

  if (normalized.why_choose_us && typeof normalized.why_choose_us === 'object') {
    const whySource = normalized.why_choose_us;
    const rawPoints = Array.isArray(whySource.points) ? whySource.points : coerceList(whySource.points ?? whySource.reasons);

    if (Array.isArray(rawPoints) && rawPoints.length > 0) {
      whySource.points = rawPoints
        .map((entry: any) => {
          if (typeof entry === 'string') {
            const trimmed = entry.trim();
            if (!trimmed) {
              return null;
            }
            return {
              icon: '•',
              title: trimmed,
              description: ''
            };
          }

          if (entry && typeof entry === 'object') {
            const title = entry.title ?? entry.heading ?? entry.reason ?? entry.benefit ?? entry.point ?? entry.label ?? '';
            const description = entry.description ?? entry.details ?? entry.summary ?? '';
            const icon = entry.icon ?? entry.badge ?? '•';
            if (!title && !description) {
              return null;
            }
            return {
              icon,
              title: title || description,
              description
            };
          }

          return null;
        })
        .filter((item): item is { icon: string; title: string; description: string } => Boolean(item));
    }
  }

  if (normalized.testimonials && typeof normalized.testimonials === 'object') {
    const testimonialsSource = normalized.testimonials;
    const reviews = Array.isArray(testimonialsSource.reviews) ? testimonialsSource.reviews : coerceList(testimonialsSource.reviews).map((entry) => ({ review: entry }));

    if (Array.isArray(reviews) && reviews.length > 0) {
      testimonialsSource.reviews = reviews
        .map((entry: any) => {
          if (typeof entry === 'string') {
            const trimmed = entry.trim();
            if (!trimmed) {
              return null;
            }
            return {
              client_name: '',
              quote: trimmed,
              rating: '',
              project_type: ''
            };
          }

          if (entry && typeof entry === 'object') {
            const quote = entry.quote ?? entry.review ?? entry.testimonial ?? entry.feedback ?? '';
            const client = entry.client_name ?? entry.client ?? entry.customer ?? entry.author ?? entry.by ?? '';
            const rating = entry.rating ?? entry.score ?? entry.stars ?? '';
            const projectType = entry.project_type ?? entry.project ?? entry.category ?? '';

            if (!quote && !client && !projectType) {
              return null;
            }

            return {
              client_name: client,
              quote: quote || projectType || client,
              rating: typeof rating === 'number' ? String(rating) : rating,
              project_type: projectType
            };
          }

          return null;
        })
        .filter((item): item is { client_name: string; quote: string; rating: string | number; project_type: string } => Boolean(item));
    }
  }

  const existingHero = normalized.hero ? { ...normalized.hero } : {};
  normalized.hero = {
    ...defaultHero,
    ...existingHero,
    headline: existingHero.headline ?? headerSource.headline ?? headerSource.company_name ?? defaultHero.headline ?? defaultCompanyName,
    subheadline: existingHero.subheading ?? headerSource.subheading ?? headerSource.tagline ?? defaultHero.subheading ?? '',
    primary_cta_label:
      existingHero.primary_cta_label ??
      headerSource.primary_cta_label ??
      headerSource.primary_label ??
      defaultHero.primary_cta_label ??
      'Contact Us',
    primary_cta_link:
      existingHero.primary_cta_link ??
      headerSource.primary_cta_link ??
      headerSource.primary_link ??
      defaultHero.primary_cta_link ??
      '#contact',
    secondary_cta_label:
      existingHero.secondary_cta_label ??
      headerSource.secondary_cta_label ??
      headerSource.secondary_label ??
      defaultHero.secondary_cta_label ??
      '',
    secondary_cta_link:
      existingHero.secondary_cta_link ??
      headerSource.secondary_cta_link ??
      headerSource.secondary_link ??
      defaultHero.secondary_cta_link ??
      '',
    trust_badges: existingHero.trust_badges ?? headerSource.trust_badges ?? defaultHero.trust_badges ?? [],
    metrics: existingHero.metrics ?? headerSource.metrics ?? defaultHero.metrics ?? []
  };

  const incomingServices = normalized.service_highlights || normalized.services;
  if (incomingServices) {
    const defaultServiceHighlights = templateDefaults.service_highlights ?? {};
    const serviceItems = Array.isArray(incomingServices.services)
      ? incomingServices.services
      : Array.isArray(incomingServices.service_list)
        ? incomingServices.service_list
        : Array.isArray(incomingServices.items)
          ? incomingServices.items
          : Array.isArray(incomingServices)
            ? incomingServices
          : [];

    normalized.service_highlights = {
      ...defaultServiceHighlights,
      ...(normalized.service_highlights || {}),
      heading:
        incomingServices.heading ??
        incomingServices.title ??
        defaultServiceHighlights.heading ??
        `Our Services`,
      subheading:
        incomingServices.subheading ??
        incomingServices.description ??
        defaultServiceHighlights.subheading ??
        '',
      services: serviceItems.map((item: Record<string, any>) => ({
        icon: item.icon ?? item.badge ?? item.symbol ?? '•',
        title: item.title ?? item.name ?? item.service ?? '',
        description: item.description ?? item.summary ?? item.details ?? ''
      })),
      cta_label:
        incomingServices.cta_label ??
        incomingServices.primary_label ??
        defaultServiceHighlights.cta_label ??
        '',
      cta_link:
        ensureHttps(
          incomingServices.cta_link ??
            incomingServices.primary_link ??
            defaultServiceHighlights.cta_link ??
            ''
        ) || ''
    };

    delete normalized.services;
  }

  if (normalized.contact) {
    const defaultContact = templateDefaults.contact ?? {};
    const contactSource = { ...normalized.contact };

    const extractPrimary = (value: unknown): string => {
      if (typeof value !== 'string') {
        return typeof value === 'number' ? String(value) : '';
      }

      const parts = value
        .split(/[\n,|]/)
        .map((part) => part.trim())
        .filter((part) => part.length > 0);

      if (parts.length === 0) {
        return value.trim();
      }

      return parts[0];
    };

    const website = contactSource.website ?? contactSource.site ?? contactSource.url ?? defaultContact.website ?? '';
    normalized.contact = {
      ...defaultContact,
      ...contactSource,
      phone: extractPrimary(contactSource.phone ?? contactSource.phone_number ?? contactSource.primary_phone ?? defaultContact.phone ?? ''),
      whatsapp: extractPrimary(contactSource.whatsapp ?? contactSource.phone ?? contactSource.whatsapp_number ?? defaultContact.whatsapp ?? ''),
      email: extractPrimary(contactSource.email ?? contactSource.contact_email ?? defaultContact.email ?? ''),
      address: contactSource.address ?? contactSource.location ?? contactSource.office_address ?? defaultContact.address ?? '',
      map_url: contactSource.map_url ?? contactSource.directions_url ?? defaultContact.map_url ?? '',
      website: ensureHttps(website) || ''
    };
  }

  if (normalized.business_hours) {
    const hours = normalized.business_hours.hours ?? normalized.business_hours.schedule ?? [];
    normalized.business_hours = {
      hours: Array.isArray(hours)
        ? hours.map((entry: Record<string, any>) => ({
            day: entry.day ?? entry.label ?? entry.name ?? '',
            open_time: entry.open_time ?? entry.open ?? null,
            close_time: entry.close_time ?? entry.close ?? null,
            is_closed: Boolean(entry.is_closed ?? entry.closed)
          }))
        : []
    };
  }

  if (normalized.social) {
    const defaultSocial = templateDefaults.social ?? {};
    const links = normalized.social.social_links ?? normalized.social.links ?? [];
    normalized.social = {
      ...defaultSocial,
      social_links: Array.isArray(links)
        ? links.map((item: Record<string, any>) => ({
            platform: item.platform ?? item.type ?? '',
            url: ensureHttps(item.url ?? item.link ?? '') || '',
            username: item.username ?? item.handle ?? ''
          }))
        : []
    };
  }

  if (normalized.cta_banner) {
    const defaultBanner = templateDefaults.cta_banner ?? {};
    const bannerSource = { ...normalized.cta_banner };
    normalized.cta_banner = {
      ...defaultBanner,
      ...bannerSource,
      primary_link: ensureHttps(bannerSource.primary_link ?? defaultBanner.primary_link ?? '') || '',
      secondary_link: ensureHttps(bannerSource.secondary_link ?? defaultBanner.secondary_link ?? '') || ''
    };
  }

  if (normalized.packages) {
    const defaultPackages = templateDefaults.packages ?? {};
    const packageSource = normalized.packages;
    const packageList = packageSource.package_list ?? packageSource.packages ?? packageSource.tiers ?? [];
    normalized.packages = {
      ...defaultPackages,
      ...packageSource,
      package_list: Array.isArray(packageList)
        ? packageList.map((item: Record<string, any> | string) => {
            if (typeof item === 'string') {
              return {
                name: item,
                description: '',
                price: '',
                timeline: '',
                features: '',
                cta_label: defaultPackages.package_list?.[0]?.cta_label ?? '',
                cta_link: ''
              };
            }
            return {
              name: item.name ?? item.title ?? '',
              description: item.description ?? item.summary ?? '',
              price: item.price ?? item.cost ?? '',
              timeline: item.timeline ?? item.duration ?? '',
              features: item.features ?? item.benefits ?? '',
              cta_label: item.cta_label ?? item.primary_label ?? defaultPackages.package_list?.[0]?.cta_label ?? '',
              cta_link: ensureHttps(item.cta_link ?? item.primary_link ?? '') || ''
            };
          })
        : []
    };
  }

  if (normalized.projects) {
    const defaultProjects = templateDefaults.projects ?? {};
    const projectList = normalized.projects.project_list ?? normalized.projects.projects ?? [];
    normalized.projects = {
      ...defaultProjects,
      ...normalized.projects,
      project_list: Array.isArray(projectList)
        ? projectList.map((item: Record<string, any> | string) => {
            if (typeof item === 'string') {
              return {
                title: item,
                description: '',
                location: '',
                image: '',
                category: '',
                link_label: '',
                link: ''
              };
            }
            return {
              title: item.title ?? item.name ?? '',
              description: item.description ?? item.summary ?? '',
              location: item.location ?? '',
              image: item.image ?? item.thumbnail ?? '',
              category: item.category ?? item.type ?? '',
              link_label: item.link_label ?? item.cta_label ?? '',
              link: ensureHttps(item.link ?? item.cta_link ?? '') || ''
            };
          })
        : []
    };
  }

  if (normalized.testimonials) {
    const defaultTestimonials = templateDefaults.testimonials ?? {};
    const testimonialSource = normalized.testimonials;
    const reviews = testimonialSource.reviews ?? testimonialSource.items ?? testimonialSource.testimonials ?? testimonialSource.list ?? [];
    normalized.testimonials = {
      ...defaultTestimonials,
      ...testimonialSource,
      reviews: Array.isArray(reviews)
        ? reviews.map((item: Record<string, any> | string) => {
            if (typeof item === 'string') {
              return {
                client_name: '',
                quote: item,
                rating: defaultTestimonials.reviews?.[0]?.rating ?? 5,
                project_type: ''
              };
            }
            return {
              client_name: item.client_name ?? item.name ?? item.author ?? '',
              quote: item.quote ?? item.testimonial ?? item.feedback ?? '',
              rating: item.rating ?? item.stars ?? defaultTestimonials.reviews?.[0]?.rating ?? 5,
              project_type: item.project_type ?? item.role ?? ''
            };
          })
        : []
    };
  }

  if (normalized.process) {
    const defaultProcess = templateDefaults.process ?? {};
    const processSource = normalized.process;
    const steps = processSource.steps ?? processSource.items ?? processSource.phases ?? processSource.stages ?? processSource.timeline ?? processSource;
    normalized.process = {
      ...defaultProcess,
      ...processSource,
      steps: Array.isArray(steps)
        ? steps.map((item: Record<string, any> | string, index: number) => {
            if (typeof item === 'string') {
              return {
                title: item,
                description: '',
                icon: index + 1
              };
            }
            return {
              title: item.title ?? item.name ?? '',
              description: item.description ?? item.summary ?? '',
              icon: item.icon ?? index + 1
            };
          })
        : []
    };
  }

  const coreValuesList = coerceList(normalized.core_values?.values ?? normalized.core_values);
  const whyChooseSource = normalized.why_choose_us ? { ...normalized.why_choose_us } : {};
  if (coreValuesList.length > 0) {
    const defaultWhyChoose = templateDefaults.why_choose_us ?? {};
    normalized.why_choose_us = {
      ...defaultWhyChoose,
      ...whyChooseSource,
      heading: whyChooseSource.heading ?? defaultWhyChoose.heading ?? 'Why Choose Us',
      subheading: whyChooseSource.subheading ?? defaultWhyChoose.subheading ?? '',
      points: coreValuesList.map((value) => ({
        icon: '✔️',
        title: value,
        description: ''
      }))
    };
  }

  const aboutSource = normalized.about;
  const missionSource = normalized.mission;
  const visionSource = normalized.vision;
  const extractText = (value: any): string | null => {
    if (!value) return null;
    if (typeof value === 'string') return value;
    if (Array.isArray(value)) {
      return value.map((entry) => (typeof entry === 'string' ? entry : '')).filter(Boolean).join(' ');
    }
    if (typeof value === 'object') {
      return (
        value.text ||
        value.description ||
        value.summary ||
        value.content ||
        value.mission ||
        value.vision ||
        null
      );
    }
    return null;
  };

  if (aboutSource || missionSource || visionSource) {
    const defaultAbout = templateDefaults.about ?? {};
    const resolvedAbout: Record<string, any> =
      aboutSource && typeof aboutSource === 'object' && !Array.isArray(aboutSource)
        ? { ...defaultAbout, ...aboutSource }
        : { ...defaultAbout };

    if (typeof aboutSource === 'string') {
      resolvedAbout.story = resolvedAbout.story ?? aboutSource;
    }

    const missionText = extractText(missionSource);
    if (missionText && !resolvedAbout.mission) {
      resolvedAbout.mission = missionText;
    }

    const visionText = extractText(visionSource);
    if (visionText && !resolvedAbout.vision) {
      resolvedAbout.vision = visionText;
    }

    if (!resolvedAbout.heading) {
      resolvedAbout.heading = defaultAbout.heading ?? 'About the Company';
    }

    normalized.about = resolvedAbout;
  }

  if (Array.isArray(template?.sections)) {
    template.sections.forEach((section: any, index: number) => {
      const key = String(section.key);
      const sectionData = normalized[key];
      if (sectionData && typeof sectionData === 'object') {
        if (sectionData.enabled === undefined) {
          sectionData.enabled = true;
        }
        if (sectionData.order === undefined) {
          sectionData.order = section.order ?? index;
        }
      }
    });
  }

  Object.keys(normalized).forEach((key) => {
    if (!allowedKeys.has(key) && !passthroughKeys.has(key)) {
      delete normalized[key];
    }
  });

  delete normalized.sectors_served;
  delete normalized.mission;
  delete normalized.vision;
  delete normalized.core_values;

  if (process.env.NODE_ENV !== 'production') {
    // eslint-disable-next-line no-console
    console.log('[VCardBuilderForm] normalizeAiSections result', normalized);
  }

  return normalized;
};

interface Props {
  business?: Business;
  userPlan?: {
    themes?: string[];
    enable_custdomain?: string;
    enable_custsubdomain?: string;
    pwa_business?: string;
  };
  planFeatures?: {
    business_template_sections?: string[];
    [key: string]: any;
  };
  userRole?: string;
  aiPrefill?: Record<string, any> | null;
  onboardingProfile?: OnboardingProfileData | null;
  onAiPrefill?: (sections: Record<string, any>, meta?: any) => void;
}

const normalizeBusinessType = (value?: string | null): string => resolveBusinessType(value);

const normalizeThemeKey = (value: string): string =>
  value
    .toString()
    .trim()
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/_+/g, '-');

export default function VCardBuilderForm({ business, userPlan, planFeatures, userRole, aiPrefill, onboardingProfile, onAiPrefill }: Props) {
  const { t } = useTranslation();
  const isEdit = !!business;
  const initialBusinessType = React.useMemo(() => {
    const businessTypeFromRecord = typeof business?.business_type === 'string' ? business.business_type : null;
    const onboardingType = typeof onboardingProfile?.business_type === 'string' ? onboardingProfile.business_type : null;
    const onboardingCategory = typeof onboardingProfile?.business_category === 'string' ? onboardingProfile.business_category : null;

    if (businessTypeFromRecord) {
      return normalizeBusinessType(businessTypeFromRecord);
    }
    if (onboardingType) {
      return normalizeBusinessType(onboardingType);
    }
    if (onboardingCategory) {
      return normalizeBusinessType(onboardingCategory);
    }
    return normalizeBusinessType(null);
  }, [business?.business_type, onboardingProfile?.business_type, onboardingProfile?.business_category]);
  const [businessType, setBusinessType] = React.useState(initialBusinessType);
  React.useEffect(() => {
    setBusinessType(initialBusinessType);
  }, [initialBusinessType]);
  const [slugStatus, setSlugStatus] = React.useState({ available: true, checking: false });
  const [contactModalOpen, setContactModalOpen] = React.useState(false);
  const [appointmentModalOpen, setAppointmentModalOpen] = React.useState(false);

  const fallbackTemplate = React.useMemo(() => getBusinessTemplate('freelancer'), []);
  const template = React.useMemo(() => {
    const resolvedType = resolveBusinessType(businessType);
    const resolved = getBusinessTemplate(resolvedType);
    if (resolved) {
      return resolved;
    }
    return fallbackTemplate ?? null;
  }, [businessType, fallbackTemplate]);

  const templateDefaultData = React.useMemo<ConfigSectionMap>(() => {
    return template?.defaultData ? (template.defaultData as ConfigSectionMap) : {};
  }, [template]);

  const [contextType, setContextType] = React.useState(businessType ?? '');
  const [defaultTone, setDefaultTone] = React.useState('professional');
  const [defaultLanguage, setDefaultLanguage] = React.useState('en');

  const onboardingSections = React.useMemo(() => {
    if (!onboardingProfile || typeof onboardingProfile !== 'object') {
      return {};
    }

    const sections: Record<string, any> = {};

    if (onboardingProfile.business_description) {
      sections.about = {
        description: onboardingProfile.business_description
      };
    }

    if (onboardingProfile.detail) {
      const detail = onboardingProfile.detail;

      if (detail.company_overview) {
        sections.about = {
          ...(sections.about || {}),
          description: detail.company_overview
        };
      }

      if (detail.mission_statement || detail.vision_statement || detail.unique_value_proposition) {
        sections.hero = {
          ...(sections.hero || {}),
          headline: detail.unique_value_proposition || onboardingProfile.business_name || '',
          subheadline: detail.mission_statement || '',
          tagline: detail.vision_statement || ''
        };
      }

      if (detail.service_highlights) {
        sections.why_choose_us = {
          ...(sections.why_choose_us || {}),
          points: detail.service_highlights.split('\n').map((entry) => entry.trim()).filter(Boolean)
        };
      }

      if (detail.notable_projects) {
        sections.process = {
          ...(sections.process || {}),
          steps: detail.notable_projects.split('\n').map((entry) => ({ title: entry.trim(), description: '' })).filter((step) => step.title)
        };
      }

      if (detail.testimonials) {
        sections.testimonials = {
          ...(sections.testimonials || {}),
          reviews: detail.testimonials.split('\n').map((entry, index) => ({
            author: `Client ${index + 1}`,
            quote: entry.trim()
          })).filter((review) => review.quote)
        };
      }
    }

    return sections;
  }, [onboardingProfile]);

  const [aggregatedSections, setAggregatedSections] = React.useState<Record<string, any>>(
    () => filterExternallyManagedSections(onboardingSections)
  );
  const [catalogData, setCatalogData] = React.useState<BusinessCatalogResponse | null>(null);
  const [catalogSections, setCatalogSections] = React.useState<Partial<ConfigSectionMap>>({});
  const catalogProtectedKeys = React.useRef<Set<string>>(new Set(['service_highlights', 'packages', 'projects', 'gallery', 'contact']));

  const resolvedBusinessType = React.useMemo(() => resolveBusinessType(businessType), [businessType]);

  const templateSectionKeys = React.useMemo(
    () => template?.sections?.map((section: any) => String(section.key)) || [],
    [template]
  );

  const rawAllowedPlanSections = React.useMemo(
    () => normalizeAllowedSections(planFeatures?.business_template_sections),
    [planFeatures?.business_template_sections]
  );

  // Check if user is superadmin (no restrictions)
  const isSuperAdmin = userRole === 'superadmin';
  
  const planThemeValues = React.useMemo<string[] | null>(() => {
    const themesRaw = userPlan?.themes;
    if (themesRaw == null) {
      return null;
    }

    const values: string[] = [];

    if (Array.isArray(themesRaw)) {
      for (const theme of themesRaw as unknown[]) {
        if (theme == null) {
          continue;
        }
        values.push(String(theme));
      }
    } else if (typeof themesRaw === 'string') {
      for (const item of (themesRaw as string).split(',')) {
        const trimmed = item.trim();
        if (!trimmed) {
          continue;
        }
        values.push(trimmed);
      }
    } else if (typeof themesRaw === 'number') {
      values.push(String(themesRaw));
    } else if (typeof themesRaw === 'object') {
      const objectValues = Object.values(themesRaw as Record<string, unknown>);
      for (const value of objectValues) {
        if (value == null) {
          continue;
        }
        values.push(String(value));
      }
    }

    return values.length > 0 ? values : null;
  }, [userPlan]);

  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      // eslint-disable-next-line no-console
      console.log('[VCardBuilderForm] planThemeValues', planThemeValues);
    }
  }, [planThemeValues]);

  const lastAppliedAiRef = React.useRef<string | null>(null);

  const resolvedAllowedSections = React.useMemo<string[] | null>(() => {
    if (!rawAllowedPlanSections || rawAllowedPlanSections.length === 0) {
      return null;
    }

    if (templateSectionKeys.length === 0) {
      return rawAllowedPlanSections;
    }

    const templateKeySet = new Set(templateSectionKeys);
    const aliasMap: Record<string, string> = {
      location: 'google_map',
      gallery: 'portfolio',
      portfolio: 'portfolio',
      map: 'google_map',
      analytics: 'pixels'
    };

    const matched = rawAllowedPlanSections.flatMap((key) => {
      if (templateKeySet.has(key)) {
        return [key];
      }
      const alias = aliasMap[key];
      if (alias && templateKeySet.has(alias)) {
        return [alias];
      }
      return [];
    });

  const uniqueMatched = Array.from(new Set(matched));

  if (uniqueMatched.length === 0) {
    return templateSectionKeys;
  }

  return uniqueMatched;
  }, [rawAllowedPlanSections, templateSectionKeys]);

  const combinedAllowedSections = React.useMemo(() => {
    const union = new Set<string>();
    templateSectionKeys.forEach((key: string | undefined) => {
      if (key) union.add(String(key));
    });
    if (resolvedAllowedSections) {
      resolvedAllowedSections.forEach((key: string) => {
        if (key) union.add(key);
      });
    }
    return Array.from(union);
  }, [templateSectionKeys, resolvedAllowedSections]);

  // Filter template sections based on plan features
  const filteredTemplate = React.useMemo(() => {
    if (!template) return template;
        
    // If user is superadmin, return all sections
    if (isSuperAdmin) {
      return template;
    }
    
    // If no plan restrictions, return all sections
    if (!resolvedAllowedSections) {
      return template;
    }
    
    // Filter sections based on plan restrictions
    // Always include essential sections for bakery and cafe templates
    const essentialSections = ['header', 'contact', 'footer'];
    const businessSpecificSections: Partial<Record<string, string[]>> = {
      bakery: ['featured_products', 'daily_specials'],
      cafe: ['menu_highlights', 'specials']
    };
    const businessExtras = businessSpecificSections[businessType] ?? [];
    
    const effectiveAllowedSections = new Set<string>([
      ...resolvedAllowedSections,
      ...essentialSections,
      ...businessExtras
    ]);
    
    const filteredSections = template.sections.filter(section => 
      effectiveAllowedSections.has(section.key)
    );
    
    if (filteredSections.length === 0) {
      return template;
    }
        
    return {
      ...template,
      sections: filteredSections
    };
  }, [template, resolvedAllowedSections, isSuperAdmin, businessType]);
  
  // Get allowed business types (currently allow all)
  const persistedBusinessType = React.useMemo(() => {
    const businessTypeFromRecord = typeof business?.business_type === 'string' ? business.business_type : null;
    if (businessTypeFromRecord) {
      return normalizeBusinessType(businessTypeFromRecord);
    }
    return initialBusinessType;
  }, [business?.business_type, initialBusinessType]);

  const allowedBusinessTypes = React.useMemo<TemplateOption[]>(() => {
    if (isSuperAdmin) {
      return businessTypeOptions;
    }

    const normalizedFromProfile = typeof onboardingProfile?.business_category === 'string'
      ? resolveBusinessType(onboardingProfile.business_category)
      : null;

    const normalized = persistedBusinessType || normalizedFromProfile;
    if (!normalized) {
      return businessTypeOptions;
    }

    const matched = businessTypeOptions.find((option) => option.value === normalized);
    if (matched) {
      return [matched];
    }

    return businessTypeOptions;
  }, [isSuperAdmin, persistedBusinessType, onboardingProfile?.business_category]);

  const currentBusinessType = React.useMemo(() => {
    if (allowedBusinessTypes.length === 0) {
      return businessType;
    }

    const normalizedCurrent = normalizeBusinessType(businessType);
    const allowedValues = new Set(allowedBusinessTypes.map(option => option.value));

    if (allowedValues.has(normalizedCurrent)) {
      return normalizedCurrent;
    }

    return allowedBusinessTypes[0].value;
  }, [allowedBusinessTypes, businessType]);

  React.useEffect(() => {
    if (currentBusinessType !== businessType) {
      setBusinessType(currentBusinessType);
    }
  }, [currentBusinessType, businessType]);

  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      // eslint-disable-next-line no-console
      console.log('[VCardBuilderForm] allowedBusinessTypes', allowedBusinessTypes.map(option => option.value));
    }
  }, [allowedBusinessTypes]);
    
  // Check feature permissions using new planFeatures structure only
  const canUseCustomDomain = isSuperAdmin || (planFeatures?.custom_domain === true);
  const canUseSubdomain = isSuperAdmin || (planFeatures?.custom_subdomain === true);
  const canUsePWA = isSuperAdmin || (planFeatures?.pwa_support === true);
  const canUsePasswordProtection = isSuperAdmin || (planFeatures?.password_protection === true);
  const firstColorPreset = template?.colorPresets?.[0];
  
  const normalizedConfigSections = React.useMemo(() => {
    if (!business) return {} as ConfigSectionMap;

    const result: ConfigSectionMap = { ...(business.config_sections || {}) };

    const currentTemplate = filteredTemplate || template;
    const templateDefaults = ((currentTemplate?.defaultData) || {}) as ConfigSectionMap;
    
    if (currentTemplate?.sections) {
      currentTemplate.sections.forEach((section: any, index: number) => {
        const existingSection = result[section.key];
        if (existingSection) {
          // Merge existing data with template defaults
          result[section.key] = {
            ...templateDefaults[section.key],
            ...existingSection,
            order: existingSection.order ?? (section.order ?? index)
          };
        } else if (templateDefaults[section.key]) {
          // Add missing sections from template defaults
          result[section.key] = {
            ...templateDefaults[section.key],
            order: section.order ?? index
          };
        }
      });
    }

    if (templateDefaults.contact) {
      const existingContact = result.contact || {};
      const resolvedAddress =
        typeof onboardingProfile?.address_line1 === 'string' && onboardingProfile.address_line1.trim()
          ? [
              onboardingProfile.address_line1,
              onboardingProfile.address_line2,
              onboardingProfile.city,
              onboardingProfile.country,
            ]
              .filter((value): value is string => Boolean(value && value.trim().length > 0))
              .join(', ')
          : existingContact.address ||
            existingContact.location ||
            templateDefaults.contact.address ||
            templateDefaults.contact.location ||
            '';
      const contactDetails = {
        phone:
          typeof onboardingProfile?.contact_phone === 'string' && onboardingProfile.contact_phone.trim()
            ? onboardingProfile.contact_phone
            : existingContact.phone || templateDefaults.contact.phone || '',
        whatsapp:
          typeof onboardingProfile?.whatsapp === 'string' && onboardingProfile.whatsapp.trim()
            ? onboardingProfile.whatsapp
            : existingContact.whatsapp || templateDefaults.contact.whatsapp || '',
        email:
          typeof onboardingProfile?.contact_email === 'string' && onboardingProfile.contact_email.trim()
            ? onboardingProfile.contact_email
            : existingContact.email || templateDefaults.contact.email || '',
        website:
          typeof onboardingProfile?.website === 'string' && onboardingProfile.website.trim()
            ? onboardingProfile.website
            : existingContact.website || templateDefaults.contact.website || '',
        address: resolvedAddress,
        location: resolvedAddress,
      };

      result.contact = {
        ...templateDefaults.contact,
        ...existingContact,
        ...contactDetails,
      };
    }

    return result;
  }, [business?.config_sections, filteredTemplate, template, onboardingProfile]);

  const initialTemplateConfig = React.useMemo<Record<string, any>>(() => {
    const existingTemplateConfig = (business as { template_config?: Record<string, any> } | undefined)?.template_config;
    if (existingTemplateConfig) {
      return existingTemplateConfig;
    }

    const baseConfig: Record<string, any> = {
      sections: {},
      sectionSettings: {},
      allowedSections: undefined
    };

    if (template?.sections) {
      template.sections.forEach((section: any) => {
        const key = String(section.key);
        baseConfig.sections[key] = templateDefaultData[key] || {};
        baseConfig.sectionSettings[key] = {
          enabled: templateDefaultData[key]?.enabled ?? true
        };
      });
    }

    return baseConfig;
  }, [business, template?.sections, templateDefaultData]);

  const defaultHeaderData = React.useMemo(() => templateDefaultData?.header ?? {}, [templateDefaultData]);

  const { data, setData, post, put, processing, errors } = useForm<FormState>(
    {
      name:
        business?.name ||
        onboardingProfile?.business_name ||
        (typeof defaultHeaderData?.name === 'string' ? defaultHeaderData.name : undefined) ||
        t('My Business'),
      slug: business?.slug || '',
      business_type: persistedBusinessType,
      custom_domain: business?.custom_domain || '',
      url_prefix: business?.url_prefix || '',
      password: business?.password || '',
      password_enabled: business?.password_enabled || false,
      domain_type: business?.domain_type || 'slug',
      favicon: business?.favicon || '',
      template_config: business?.template_config || initialTemplateConfig,
      config_sections: isEdit
        ? { ...normalizedConfigSections }
        : (() => {
            const sections: ConfigSectionMap = { ...templateDefaultData };

            if (templateDefaultData.service_highlights) {
              sections.service_highlights = { ...templateDefaultData.service_highlights };
            }

            if (templateDefaultData.packages) {
              sections.packages = { ...templateDefaultData.packages };
            }

            // Prefill contact details from onboarding profile
            const contactDetails = {
              phone:
                typeof onboardingProfile?.contact_phone === 'string' && onboardingProfile.contact_phone.trim()
                  ? onboardingProfile.contact_phone
                  : templateDefaultData.contact?.phone || '',
              whatsapp:
                typeof onboardingProfile?.whatsapp === 'string' && onboardingProfile.whatsapp.trim()
                  ? onboardingProfile.whatsapp
                  : templateDefaultData.contact?.whatsapp || '',
              email:
                typeof onboardingProfile?.contact_email === 'string' && onboardingProfile.contact_email.trim()
                  ? onboardingProfile.contact_email
                  : templateDefaultData.contact?.email || '',
              website:
                typeof onboardingProfile?.website === 'string' && onboardingProfile.website.trim()
                  ? onboardingProfile.website
                  : templateDefaultData.contact?.website || '',
              location:
                typeof onboardingProfile?.address_line1 === 'string'
                  ? [
                      onboardingProfile.address_line1,
                      typeof onboardingProfile.address_line2 === 'string' ? onboardingProfile.address_line2 : null,
                      typeof onboardingProfile.city === 'string' ? onboardingProfile.city : null,
                      typeof onboardingProfile.country === 'string' ? onboardingProfile.country : null,
                    ]
                      .filter((value): value is string => Boolean(value && value.trim().length > 0))
                      .join(', ')
                  : templateDefaultData.contact?.location || '',
            };

            sections.contact = {
              ...(templateDefaultData.contact || {}),
              ...contactDetails,
            };

            if (!isSuperAdmin && combinedAllowedSections.length > 0) {
              sections._allowed_sections = combinedAllowedSections;
            }

            return sections;
          })()
    }
  );

  const previewConfigSections = React.useMemo(() => {
    const sourceSections = (data.config_sections || {}) as ConfigSectionMap;
    const baseSections: ConfigSectionMap = { ...sourceSections };

    Object.entries(catalogSections || {}).forEach(([key, value]) => {
      const keyString = String(key);
      const existingSection = baseSections[keyString];

      if (value && typeof value === 'object' && !Array.isArray(value)) {
        baseSections[keyString] = mergeSectionValues(existingSection, value);
      } else if (value !== undefined) {
        baseSections[keyString] = value as any;
      }
    });

    return baseSections;
  }, [catalogSections, data.config_sections]);

  const buildCatalogSections = React.useCallback(
    (catalog: BusinessCatalogResponse | null): Partial<ConfigSectionMap> => {
      if (!catalog) {
        return {
          service_highlights: { services: [], enabled: false },
          packages: { package_list: [], enabled: false },
          projects: { project_list: [], enabled: false },
        };
      }

      const sections: Partial<ConfigSectionMap> = {};

      const defaultServices = templateDefaultData.service_highlights ?? {};
      const services = catalog.services?.slice()?.sort((a, b) => (a.order_index ?? 0) - (b.order_index ?? 0));
      if (services && services.length > 0) {
        sections.service_highlights = {
          managed_by_catalog: true,
          ...defaultServices,
          heading: defaultServices.heading ?? t('Service Highlights'),
          subheading: defaultServices.subheading ?? '',
          services: services.map((service) => ({
            icon:
              service.meta?.icon ??
              service.meta?.emoji ??
              (Array.isArray(defaultServices.services) ? defaultServices.services[0]?.icon : null) ??
              '•',
            title: service.name ?? '',
            description: service.summary ?? service.description ?? '',
            badge: service.category ?? service.meta?.badge ?? '',
          })),
          cta_label: defaultServices.cta_label ?? '',
          cta_link: defaultServices.cta_link ?? '',
        };
      } else {
        sections.service_highlights = {
          managed_by_catalog: true,
          heading: t('Add your services'),
          subheading: t('Create services in the Services & Packages manager to display them here.'),
          services: [
            {
              icon: '➕',
              title: t('No services yet'),
              description: t('Use the Services & Packages page to add your offerings.'),
              badge: '',
              meta: { placeholder: true },
            },
          ],
          enabled: true,
        };
      }

      const defaultPackages = templateDefaultData.packages ?? {};
      const packages = catalog.packages?.slice()?.sort((a, b) => (a.order_index ?? 0) - (b.order_index ?? 0));
      if (packages && packages.length > 0) {
        sections.packages = {
          managed_by_catalog: true,
          ...defaultPackages,
          heading: defaultPackages.heading ?? t('Packages & Pricing'),
          subheading: defaultPackages.subheading ?? '',
          package_list: packages.map((pkg) => {
            const orderedFeatures = (pkg.features || [])
              .slice()
              .sort((a, b) => (a.order_index ?? 0) - (b.order_index ?? 0))
              .map((feature) => feature.feature)
              .filter(Boolean);

            const fallbackDefaultFeatures = Array.isArray(defaultPackages.package_list)
              ? defaultPackages.package_list[0]?.features
              : '';

            const priceAmount = (() => {
              if (pkg.price_display) {
                return pkg.price_display;
              }

              if (pkg.price_amount === null || pkg.price_amount === undefined || pkg.price_amount === '') {
                return '';
              }

              const numericAmount = Number(pkg.price_amount);
              if (Number.isNaN(numericAmount)) {
                return '';
              }

              const currency = pkg.price_currency ? String(pkg.price_currency).trim() : '';
              return currency ? `${currency} ${numericAmount}` : String(numericAmount);
            })();

            return {
              name: pkg.name,
              description: pkg.description ?? '',
              price: priceAmount,
              timeline: pkg.duration_label ?? '',
              features: orderedFeatures.length > 0 ? orderedFeatures.join('\n') : fallbackDefaultFeatures ?? '',
              cta_label: pkg.cta_label ?? defaultPackages.package_list?.[0]?.cta_label ?? '',
              cta_link: pkg.cta_link ?? defaultPackages.package_list?.[0]?.cta_link ?? '',
            };
          }),
        };
      } else {
        sections.packages = {
          managed_by_catalog: true,
          heading: t('Add your packages'),
          subheading: t('Build packages in the Services & Packages manager to showcase them here.'),
          package_list: [
            {
              name: t('No packages yet'),
              description: t('Create packages from the Services & Packages page to populate this section.'),
              price: '',
              timeline: '',
              features: '',
              cta_label: '',
              cta_link: '',
              meta: { placeholder: true },
            },
          ],
          enabled: true,
        };
      }

      const defaultProjects = templateDefaultData.projects ?? {};
      const projects = catalog.projects?.slice()?.sort((a, b) => (a.order_index ?? 0) - (b.order_index ?? 0));
      if (projects && projects.length > 0) {
        sections.projects = {
          managed_by_catalog: true,
          ...defaultProjects,
          heading: defaultProjects.heading ?? t('Featured Projects'),
          subheading: defaultProjects.subheading ?? t('Showcase your proudest builds to build trust fast.'),
          project_list: projects.map((project) => {
            const defaultProject = Array.isArray(defaultProjects.project_list)
              ? defaultProjects.project_list?.[0] ?? {}
              : {};

            const mediaItem = Array.isArray(project.media) && project.media.length > 0 ? project.media[0] : null;

            return {
              title: project.title ?? '',
              description: project.summary ?? project.description ?? '',
              location: project.location ?? '',
              category: project.category ?? project.meta?.category ?? '',
              link_label: project.cta_label ?? defaultProject.link_label ?? t('View Project'),
              link: project.cta_link ?? defaultProject.link ?? '',
              image: mediaItem?.url ?? defaultProject.image ?? '',
              meta: {
                ...defaultProject.meta,
                ...project.meta,
                id: project.id,
                slug: project.slug,
              },
            };
          }),
        };
      } else {
        sections.projects = {
          managed_by_catalog: true,
          heading: t('Add your featured projects'),
          subheading: t('Create standout projects in the Featured Projects manager to highlight your best work.'),
          project_list: [
            {
              title: t('No projects yet'),
              description: t('Use the Featured Projects page to add your latest success stories.'),
              location: '',
              category: '',
              link_label: t('Add project'),
              link: '',
              meta: { placeholder: true },
            },
          ],
          enabled: true,
        };
      }

      const projectGallery = catalog.project_gallery;
      const galleryItems = Array.isArray(projectGallery?.items) ? projectGallery.items : [];

      const normalizedGallery = normalizeGallerySection(
        {
          ...projectGallery,
          items: galleryItems,
          managed_by_gallery: true,
        },
        templateDefaultData?.gallery
      );

      sections.gallery = {
        managed_by_gallery: true,
        heading: normalizedGallery.heading || t('Project Gallery'),
        subheading:
          normalizedGallery.subheading ||
          t('Add images and videos from the Project Gallery page to showcase your work.'),
        items: normalizedGallery.items,
        images: normalizedGallery.images,
        photos: normalizedGallery.photos,
        video_list: normalizedGallery.video_list,
        enabled: true,
      };

      return sections;
    },
    [templateDefaultData, t]
  );

  React.useEffect(() => {
    if (!isEdit || !business?.id) {
      setCatalogData(null);
      setCatalogSections({});
      return;
    }

    let isMounted = true;

    const fetchCatalog = async () => {
      try {
        const response = await axios.get(route('vcard-builder.catalog', business.id));
        if (!isMounted) {
          return;
        }

        const payload: BusinessCatalogResponse = response.data?.data ?? { services: [], packages: [], projects: [] };
        // eslint-disable-next-line no-console
        console.log('[VCardBuilderForm] catalog payload', payload);
        setCatalogData(payload);
        const sectionsFromCatalog = buildCatalogSections(payload);
        // eslint-disable-next-line no-console
        console.log('[VCardBuilderForm] sectionsFromCatalog', sectionsFromCatalog);
        setCatalogSections(sectionsFromCatalog);

        if (Object.keys(sectionsFromCatalog).length > 0) {
          setData((current) => {
            const currentSections = { ...(current.config_sections || {}) } as ConfigSectionMap;
            const nextSections: ConfigSectionMap = {
              ...currentSections,
              ...sectionsFromCatalog,
            };

            if (!isSuperAdmin && combinedAllowedSections.length > 0) {
              nextSections._allowed_sections = combinedAllowedSections;
            }

            return {
              ...current,
              config_sections: nextSections,
            };
          });
        }
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error('[VCardBuilderForm] Failed to load catalog data', error);
      }
    };

    fetchCatalog();

    const handleCatalogUpdated = (event: Event) => {
      const detail = (event as CustomEvent<{ businessId?: number }>).detail;
      if (!detail || (detail.businessId && detail.businessId !== business.id)) {
        return;
      }

      fetchCatalog();
    };

    if (typeof window !== 'undefined') {
      window.addEventListener('catalog:updated', handleCatalogUpdated as EventListener);
    }

    return () => {
      isMounted = false;
      if (typeof window !== 'undefined') {
        window.removeEventListener('catalog:updated', handleCatalogUpdated as EventListener);
      }
    };
  }, [buildCatalogSections, business?.id, combinedAllowedSections, isEdit, isSuperAdmin, setData]);
  
  // Listen for custom events from template buttons
  React.useEffect(() => {
    const handleOpenContactModal = (e: Event) => {
      setContactModalOpen(true);
    };
    const handleOpenAppointmentModal = (e: Event) => {
      setAppointmentModalOpen(true);
    };
    
    // Listen on multiple targets
    const targets = [window, document, document.body];
    targets.forEach(target => {
      target.addEventListener('openContactModal', handleOpenContactModal, true);
      target.addEventListener('openAppointmentModal', handleOpenAppointmentModal, true);
    });
    
    return () => {
      targets.forEach(target => {
        target.removeEventListener('openContactModal', handleOpenContactModal, true);
        target.removeEventListener('openAppointmentModal', handleOpenAppointmentModal, true);
      });
    };
  }, []);
  
  // Ensure _allowed_sections is always present
  React.useEffect(() => {
    const currentConfigSections = data.config_sections as ConfigSectionMap;
    if (!isSuperAdmin && combinedAllowedSections.length > 0 && !currentConfigSections._allowed_sections) {
      setData('config_sections', {
        ...currentConfigSections,
        _allowed_sections: combinedAllowedSections
      });
    }
  }, [combinedAllowedSections, isSuperAdmin, data.config_sections]);

  const applyAiSections = React.useCallback(
    (incomingSections?: Record<string, any> | null, meta?: any, options?: { notifyParent?: boolean }) => {
      if (!incomingSections || typeof incomingSections !== 'object' || Object.keys(incomingSections).length === 0) {
        if (process.env.NODE_ENV !== 'production') {
          // eslint-disable-next-line no-console
          console.log('[VCardBuilderForm] applyAiSections skipped: empty payload', incomingSections);
        }
        return;
      }

      const normalizedSections = normalizeAiSections(incomingSections, template, {
        onboardingProfile,
        businessType,
        fallbackName:
          incomingSections?.header?.company_name ||
          incomingSections?.header?.name ||
          incomingSections?.hero?.headline ||
          onboardingProfile?.business_name
      });

      const protectedNormalizedSections: Record<string, any> = { ...normalizedSections };

      catalogProtectedKeys.current.forEach((key) => {
        if (!Object.prototype.hasOwnProperty.call(protectedNormalizedSections, key)) {
          return;
        }

        if (catalogSections[key] !== undefined) {
          protectedNormalizedSections[key] = catalogSections[key];
          return;
        }

        const existingValue = (data.config_sections as ConfigSectionMap | undefined)?.[key];
        if (typeof existingValue !== 'undefined') {
          protectedNormalizedSections[key] = existingValue;
          return;
        }

        delete protectedNormalizedSections[key];
      });

      const serialized = JSON.stringify(protectedNormalizedSections);
      lastAppliedAiRef.current = serialized;

      if (process.env.NODE_ENV !== 'production') {
        // eslint-disable-next-line no-console
        console.log('[VCardBuilderForm] applying AI sections', normalizedSections);
      }

      const templateDefaults = templateDefaultData;

      setData((current) => {
        const currentSections = (current.config_sections || {}) as ConfigSectionMap;
        const mergedSections = applyAiPrefillToSections(currentSections, protectedNormalizedSections);

        const derivedName =
          current.name ||
          protectedNormalizedSections?.hero?.headline ||
          protectedNormalizedSections?.hero?.title ||
          (protectedNormalizedSections?.header as Record<string, any> | undefined)?.company_name ||
          (protectedNormalizedSections?.header as Record<string, any> | undefined)?.name ||
          current.name;

        return {
          ...current,
          name: derivedName,
          config_sections: mergedSections
        };
      });

      if (options?.notifyParent !== false) {
        onAiPrefill?.(protectedNormalizedSections, meta);
      }
    },
    [businessType, catalogSections, onboardingProfile, onAiPrefill, setData, template, templateDefaultData]
  );

  React.useEffect(() => {
    if (!aiPrefill || typeof aiPrefill !== 'object') {
      return;
    }

    const serialized = JSON.stringify(aiPrefill);
    if (lastAppliedAiRef.current === serialized) {
      return;
    }

    applyAiSections(aiPrefill, undefined, { notifyParent: false });
  }, [aiPrefill, applyAiSections]);

  const handleBusinessTypeChange = (newType: string) => {
    const resolvedType = resolveBusinessType(newType);
    setBusinessType(resolvedType);
    const newTemplate = getBusinessTemplate(resolvedType);
    const newTemplateDefaults = (newTemplate?.defaultData as ConfigSectionMap | undefined) || undefined;
    const newHeaderDefaults = newTemplateDefaults ? (newTemplateDefaults['header'] as Record<string, any> | undefined) : undefined;
    const newName = isEdit ? data.name : newHeaderDefaults?.name || t('My Business');
    const newFirstColorPreset = newTemplate?.colorPresets?.[0];

    setData((current) => {
      const templateDefaults = (newTemplate?.defaultData || {}) as ConfigSectionMap;
      const currentConfigSections = (current.config_sections || {}) as ConfigSectionMap;

      const templateDefaultColors = templateDefaults?.colors || newTemplate?.defaultColors || {};
      const presetColors = newFirstColorPreset || {};
      const existingColors = currentConfigSections.colors || {};

      const mergedColors = {
        ...templateDefaultColors,
        ...presetColors,
        ...existingColors
      };

      const nextConfigSections: ConfigSectionMap = {
        ...templateDefaults,
        colors: mergedColors
      };

      if (currentConfigSections.font) {
        nextConfigSections.font = currentConfigSections.font;
      }

      if (currentConfigSections.language) {
        nextConfigSections.language = currentConfigSections.language;
      }

      return {
        ...current,
        name: isEdit ? current.name : newName,
        slug: isEdit ? current.slug : '',
        business_type: resolvedType,
        config_sections: nextConfigSections
      };
    });

    if (!isEdit) {
      generateSlugFromName(newName);
    }
  };

  const generateSlugFromName = async (name: string) => {
    if (!name) return;
    try {
      const response = await axios.post(route('vcard-builder.generate-slug'), { 
        name,
        business_id: business?.id,
        url_prefix: data.url_prefix || 'v'
      });
      setData('slug', response.data.slug);
      checkSlugAvailability(response.data.slug);
    } catch (error) {
      console.error('Error generating slug:', error);
    }
  };

  const checkSlugAvailability = async (slug: string, urlPrefix?: string) => {
    if (!slug) {
      setSlugStatus({ available: true, checking: false });
      return;
    }
    
    setSlugStatus({ available: true, checking: true });
    try {
      const response = await axios.post(route('vcard-builder.check-slug'), { 
        slug, 
        business_id: business?.id,
        url_prefix: urlPrefix || data.url_prefix 
      });
      setSlugStatus({ available: response.data.available, checking: false });
    } catch (error) {
      setSlugStatus({ available: false, checking: false });
    }
  };

  const handleNameChange = (name: string) => {
    setData('name', name);
    if (!isEdit && !data.slug) {
      generateSlugFromName(name);
    }
  };

  const handleSlugChange = (slug: string) => {
    setData('slug', slug);
    checkSlugAvailability(slug);
  };

  const handlePrefixChange = (prefix: string) => {
    setData('url_prefix', prefix);
    if (data.slug) {
      checkSlugAvailability(data.slug, prefix);
    }
  };

  const updateTemplateConfig = (section: string, field: string, value: any) => {
    setData((current) => {
      const currentSections = (current.config_sections || {}) as ConfigSectionMap;
      const existingSection = currentSections[section] || {};

      const updatedSection = {
        ...existingSection,
        [field]: value
      };

      const updatedSections: ConfigSectionMap = {
        ...currentSections,
        [section]: updatedSection
      };

      const existingTemplateConfig = (current.template_config || {}) as Record<string, any>;
      const updatedTemplateConfig = {
        ...existingTemplateConfig,
        sections: {
          ...(existingTemplateConfig.sections || {}),
          [section]: updatedSection
        },
        sectionSettings: {
          ...(existingTemplateConfig.sectionSettings || {}),
          [section]: {
            ...(existingTemplateConfig.sectionSettings?.[section] || {}),
            [field]: value
          }
        },
        allowedSections:
          existingTemplateConfig.allowedSections ??
          (!isSuperAdmin
            ? combinedAllowedSections.length > 0
              ? combinedAllowedSections
              : undefined
            : undefined)
      };

      return {
        ...current,
        config_sections: updatedSections,
        template_config: updatedTemplateConfig
      };
    });
  };

  const handleToggleSection = (sectionKey: string, enabled: boolean) => {
    setData((current) => {
      const currentSections = (current.config_sections || {}) as ConfigSectionMap;
      const existingSection = currentSections[sectionKey] || {};

      const updatedSection = {
        ...existingSection,
        enabled,
        order: existingSection.order || 0
      };

      const updatedSections: ConfigSectionMap = {
        ...currentSections,
        [sectionKey]: updatedSection
      };

      if (!isSuperAdmin && (resolvedAllowedSections || templateSectionKeys.length > 0)) {
        updatedSections._allowed_sections = resolvedAllowedSections || templateSectionKeys;
      }

      const existingTemplateConfig = (current.template_config || {}) as Record<string, any>;
      const updatedTemplateConfig = {
        ...existingTemplateConfig,
        sections: {
          ...(existingTemplateConfig.sections || {}),
          [sectionKey]: updatedSection
        },
        sectionSettings: {
          ...(existingTemplateConfig.sectionSettings || {}),
          [sectionKey]: {
            ...(existingTemplateConfig.sectionSettings?.[sectionKey] || {}),
            enabled
          }
        },
        allowedSections: existingTemplateConfig.allowedSections ?? (!isSuperAdmin ? (resolvedAllowedSections || undefined) : undefined)
      };

      return {
        ...current,
        config_sections: updatedSections,
        template_config: updatedTemplateConfig
      };
    });
  };

  const handleReorderSections = (sections: any[]) => {
    setData((current) => {
      const currentSections = (current.config_sections || {}) as ConfigSectionMap;
      const updatedSections: ConfigSectionMap = { ...currentSections };

      sections.forEach((section, index) => {
        if (updatedSections[section.key]) {
          updatedSections[section.key] = {
            ...updatedSections[section.key],
            order: index
          };
        }
      });

      const existingTemplateConfig = (current.template_config || {}) as Record<string, any>;
      const updatedTemplateConfig = {
        ...existingTemplateConfig,
        sections: {
          ...(existingTemplateConfig.sections || {}),
          ...sections.reduce((acc: Record<string, any>, section, index) => {
            acc[section.key] = {
              ...(updatedSections[section.key] || {}),
              order: index
            };
            return acc;
          }, {})
        },
        sectionSettings: existingTemplateConfig.sectionSettings || {},
        allowedSections: existingTemplateConfig.allowedSections ?? (!isSuperAdmin ? (resolvedAllowedSections || undefined) : undefined)
      };

      return {
        ...current,
        config_sections: updatedSections,
        template_config: updatedTemplateConfig
      };
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate required fields
    if (!data.slug) {
      toast.error(t('Slug is required'));
      return;
    }
    
    // Store allowed sections in config for public view filtering
    const updatedData = { ...data };
    if (!isSuperAdmin && combinedAllowedSections.length > 0) {
      updatedData.config_sections = {
        ...(data.config_sections as ConfigSectionMap),
        _allowed_sections: combinedAllowedSections
      };
    }
    
    // Update form data with allowed sections
    setData(updatedData);
    
    if (isEdit) {
      put(route('vcard-builder.update', business.id));
    } else {
      post(route('vcard-builder.store'));
    }
  };

  const breadcrumbs = [
    { title: t('Dashboard'), href: route('dashboard') },
    { title: t('vCard Builder'), href: route('vcard-builder.index') },
    { title: isEdit ? business.name : t('Create Business') }
  ];

  const pageTitle = isEdit ? `Edit ${business.name}` : 'Create Business';
  const pageUrl = isEdit ? route('vcard-builder.edit', business.id) : route('vcard-builder.create');

  return (
    <PageWrapper title={pageTitle} url={pageUrl} breadcrumbs={breadcrumbs}>
      <Head title={pageTitle} />
      
      {/* Sticky Save Bar */}
      <div className="sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b mb-6">
        <div className="flex items-center justify-between py-3 px-1">
          <div className="flex items-center space-x-2">
            {!slugStatus.available && data.slug && (
              <span className="text-xs text-red-500 bg-red-50 dark:bg-red-900/20 px-2 py-1 rounded">{t('Slug not available')}</span>
            )}
            {processing && (
              <span className="text-xs text-blue-600 bg-blue-50 dark:bg-blue-900/20 px-2 py-1 rounded">
                {isEdit ? t('Updating...') : t('Creating...')}
              </span>
            )}
          </div>
          <div className="flex items-center space-x-2">
            <Button 
              variant="outline"
              className="px-4 h-9 flex items-center gap-1"
              onClick={() => {
                // Store the filtered form data in localStorage for the preview page to use
                localStorage.setItem('vcard_preview_data', JSON.stringify({
                  business_type: businessType,
                  name: data.name,
                  slug: data.slug || 'preview',
                  config_sections: data.config_sections,
                  template_config: {
                    allowedSections: isSuperAdmin ? undefined : (combinedAllowedSections.length > 0 ? combinedAllowedSections : undefined)
                  }
                }));
                
                // Open the preview in a new tab
                window.open(route('vcard.preview'), '_blank');
              }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 mr-1"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>
              {t("Preview Template")}
            </Button>
            <Button 
              onClick={handleSubmit} 
              disabled={processing || (!slugStatus.available && Boolean(data.slug))} 
              className="px-6 h-9"
            >
              {processing ? (isEdit ? t('Updating...') : t('Creating...')) : (isEdit ? t('Update Business') : t('Create Business'))}
            </Button>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <Card>
            <div className="p-3 border-b bg-muted/30">
              <h3 className="text-base font-medium"><span className="bg-gray-100 dark:bg-gray-700 text-xs rounded-full h-5 w-5 inline-flex items-center justify-center mr-1.5">1</span>{t("Business Setup")}</h3>
            </div>
            <div className="p-3 space-y-3">
              <VCardAIInstructionBox
                userPlan={userPlan ?? undefined}
                planFeatures={planFeatures ?? undefined}
                userRole={userRole}
                onboardingProfile={onboardingProfile ?? undefined}
                sections={data.config_sections as Record<string, any>}
                businessName={data.name}
                businessType={businessType}
                templateSections={templateSectionKeys}
                onResult={(sections, meta) => {
                  applyAiSections(sections, meta);
                }}
              />

              {/* Business Identity */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <Label className="text-sm mb-1 block flex items-center justify-between">
                    <div className="flex items-center">
                      {t("Business Type")}
                      {(window as any).isDemo && (
                        <span className="ml-2 px-1.5 py-0.5 text-[10px] font-medium rounded-full bg-primary text-white">
                          New
                        </span>
                      )}
                    </div>
                    <span className="text-xs bg-blue-100 text-blue-600 px-2 py-0.5 rounded-full">
                      {allowedBusinessTypes.length} layouts
                    </span>
                  </Label>
                  <Select value={businessType} onValueChange={handleBusinessTypeChange}>
                    <SelectTrigger className="h-9 text-sm">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {allowedBusinessTypes.map((option, index) => (
                        <SelectItem key={option.value} value={option.value}>Theme {index + 1}: {option.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {!isSuperAdmin && allowedBusinessTypes.length < businessTypeOptions.length && (
                    <p className="text-xs text-amber-600 mt-1">
                      {t('Some templates are restricted by your plan. Upgrade to access all templates.')}
                    </p>
                  )}
                </div>
                <div>
                  <Label className="text-sm mb-1 block">{t("Business Name")}</Label>
                  <Input
                    value={data.name}
                    onChange={(e) => isEdit ? setData('name', e.target.value) : handleNameChange(e.target.value)}
                    className="h-9 text-sm"
                    placeholder={t("Enter business name")}
                    required
                  />
                </div>
              </div>

              {/* Business Favicon */}
              <div>
                <MediaPicker
                  label={t("Business Favicon")}
                  value={data.favicon}
                  onChange={(value) => setData('favicon', value)}
                  placeholder={t("Select favicon from media library")}
                  showPreview={true}
                />
                <p className="text-xs text-muted-foreground mt-1">
                  {t('Upload a small icon (16x16 or 32x32 pixels) to represent your business in browser tabs')}
                </p>
              </div>

              {/* Color Theme */}
              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <Label className="text-sm">{t("Color Theme")}</Label>
                  <div className="flex space-x-1">
                    {(template?.colorPresets || []).slice(0, 5).map((preset: any, index: number) => (
                      <div 
                        key={index}
                        className="w-5 h-5 rounded-full cursor-pointer border hover:scale-110 transition-transform flex items-center justify-center"
                        style={{ backgroundColor: preset.primary }}
                        onClick={() => {
                          setData('config_sections', {
                            ...data.config_sections,
                            colors: preset
                          });
                        }}
                      >
                        {data.config_sections?.colors?.primary === preset.primary && (
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-white" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* Custom Color Pickers */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2">
                  <div>
                    <Label className="text-sm mb-1 block">{t("Primary")}</Label>
                    <div className="flex">
                      <Input
                        type="color"
                        value={data.config_sections?.colors?.primary || '#3B82F6'}
                        onChange={(e) => {
                          setData('config_sections', {
                            ...data.config_sections,
                            colors: { ...data.config_sections?.colors, primary: e.target.value }
                          });
                        }}
                        className="h-6 p-0 w-full rounded-r-none"
                      />
                      <div className="bg-gray-100 dark:bg-gray-700 px-1 flex items-center rounded-r-md border border-l-0 border-input text-xs">
                        {data.config_sections?.colors?.primary?.substring(0, 7) || '#3B82F6'}
                      </div>
                    </div>
                  </div>
                  <div>
                    <Label className="text-sm mb-1 block">{t("Secondary")}</Label>
                    <div className="flex">
                      <Input
                        type="color"
                        value={data.config_sections?.colors?.secondary || '#1E40AF'}
                        onChange={(e) => {
                          setData('config_sections', {
                            ...data.config_sections,
                            colors: { ...data.config_sections?.colors, secondary: e.target.value }
                          });
                        }}
                        className="h-6 p-0 w-full rounded-r-none"
                      />
                      <div className="bg-gray-100 dark:bg-gray-700 px-1 flex items-center rounded-r-md border border-l-0 border-input text-xs">
                        {data.config_sections?.colors?.secondary?.substring(0, 7) || '#1E40AF'}
                      </div>
                    </div>
                  </div>
                  <div>
                    <Label className="text-sm mb-1 block">{t("Accent")}</Label>
                    <div className="flex">
                      <Input
                        type="color"
                        value={data.config_sections?.colors?.accent || '#F59E0B'}
                        onChange={(e) => {
                          setData('config_sections', {
                            ...data.config_sections,
                            colors: { ...data.config_sections?.colors, accent: e.target.value }
                          });
                        }}
                        className="h-6 p-0 w-full rounded-r-none"
                      />
                      <div className="bg-gray-100 dark:bg-gray-700 px-1 flex items-center rounded-r-md border border-l-0 border-input text-xs">
                        {data.config_sections?.colors?.accent?.substring(0, 7) || '#F59E0B'}
                      </div>
                    </div>
                  </div>
                  <div>
                    <Label className="text-sm mb-1 block">{t("Text")}</Label>
                    <div className="flex">
                      <Input
                        type="color"
                        value={data.config_sections?.colors?.text || (businessType === 'freelancer' ? '#E2E8F0' : '#1E293B')}
                        onChange={(e) => {
                          setData('config_sections', {
                            ...data.config_sections,
                            colors: { ...data.config_sections?.colors, text: e.target.value }
                          });
                        }}
                        className="h-6 p-0 w-full rounded-r-none"
                      />
                      <div className="bg-gray-100 dark:bg-gray-700 px-1 flex items-center rounded-r-md border border-l-0 border-input text-xs">
                        {data.config_sections?.colors?.text?.substring(0, 7) || (businessType === 'freelancer' ? '#E2E8F0' : '#1E293B')}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Font Family */}
              <div>
                <Label className="text-sm mb-1 block">{t("Font Family")}</Label>
                <Select 
                  value={data.config_sections?.font || template?.defaultFont || 'Inter, sans-serif'} 
                  onValueChange={(value) => {
                    setData('config_sections', {
                      ...data.config_sections,
                      font: value
                    });
                  }}
                >
                  <SelectTrigger className="h-9 text-sm">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {(template?.fontOptions || [
                      { name: 'Inter', value: 'Inter, sans-serif' },
                      { name: 'Arial', value: 'Arial, sans-serif' },
                      { name: 'Georgia', value: 'Georgia, serif' }
                    ]).map((font: any) => (
                      <SelectItem key={font.value} value={font.value}>
                        <span style={{ fontFamily: font.value }}>{font.name}</span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </Card>

          <DomainConfig
            data={{
              slug: data.slug,
              custom_domain: data.custom_domain,
              url_prefix: data.url_prefix,
              password: data.password,
              password_enabled: data.password_enabled,
              domain_type: (data.domain_type as 'slug' | 'domain' | 'subdomain' | undefined)
            }}
            onUpdate={(field, value) => setData(field as any, value)}
            slugStatus={slugStatus}
            onSlugChange={handleSlugChange}
            onPrefixChange={handlePrefixChange}
            businessId={business?.id}
            canUseCustomDomain={canUseCustomDomain}
            canUseSubdomain={canUseSubdomain}
            canUsePasswordProtection={canUsePasswordProtection}
            type="business"
          />

          <Card>
            <div className="p-3 border-b bg-muted/30">
              <h3 className="text-base font-medium"><span className="bg-gray-100 dark:bg-gray-700 text-xs rounded-full h-5 w-5 inline-flex items-center justify-center mr-1.5">3</span>{t("Card Sections")}</h3>
            </div>
            <div className="p-3">
              {!isSuperAdmin && resolvedAllowedSections && resolvedAllowedSections.length > 0 && (
                <div className="mb-3 p-2 bg-amber-50 border border-amber-200 rounded-md space-y-1">
                  <p className="text-xs text-amber-700 font-medium">
                    {t('Some sections are restricted by your plan. The following sections remain available:')}
                  </p>
                  <p className="text-xs text-amber-700">
                    {resolvedAllowedSections.join(', ')}
                  </p>
                </div>
              )}
              <VCardSectionManager
                sections={template?.sections || []}
                templateConfig={{ sections: data.config_sections, sectionSettings: data.config_sections }}
                onUpdateSection={updateTemplateConfig}
                onToggleSection={handleToggleSection}
                onReorderSections={handleReorderSections}
                allowedSections={resolvedAllowedSections}
                isSuperAdmin={isSuperAdmin}
                catalogManagerUrl={business ? route('vcard-builder.catalog.manage', business.id) : undefined}
              />
            </div>
          </Card>

          <Card>
            <div className="p-3 border-b bg-muted/30">
              <h3 className="text-base font-medium"><span className="bg-gray-100 dark:bg-gray-700 text-xs rounded-full h-5 w-5 inline-flex items-center justify-center mr-1.5">4</span>{t("PWA Settings")}</h3>
            </div>
            <div className="p-3 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-sm">{t("Enable PWA")}</Label>
                  {!canUsePWA && (
                    <p className="text-xs text-amber-600">{t('PWA feature requires plan upgrade')}</p>
                  )}
                </div>
                <Switch
                  checked={data.config_sections?.pwa?.enabled || false}
                  onCheckedChange={(checked) => updateTemplateConfig('pwa', 'enabled', checked)}
                  disabled={!canUsePWA}
                  className="scale-75"
                />
              </div>

              {data.config_sections?.pwa?.enabled && canUsePWA && (
                <div className="space-y-3">
                  <div>
                    <Label className="text-sm mb-1 block">{t("App Name")}</Label>
                    <Input
                      value={data.config_sections?.pwa?.name || data.name || ''}
                      onChange={(e) => updateTemplateConfig('pwa', 'name', e.target.value)}
                      placeholder={t("My Business Card")}
                      className="h-9 text-sm"
                    />
                  </div>

                  <div>
                    <Label className="text-sm mb-1 block">{t("Short Name")}</Label>
                    <Input
                      value={data.config_sections?.pwa?.short_name || ''}
                      onChange={(e) => updateTemplateConfig('pwa', 'short_name', e.target.value)}
                      placeholder={t("MyCard")}
                      className="h-9 text-sm"
                      maxLength={12}
                    />
                  </div>

                  <div>
                    <Label className="text-sm mb-1 block">{t("Description")}</Label>
                    <Input
                      value={data.config_sections?.pwa?.description || ''}
                      onChange={(e) => updateTemplateConfig('pwa', 'description', e.target.value)}
                      placeholder={t("Digital business card")}
                      className="h-9 text-sm"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <Label className="text-sm mb-1 block">{t("Theme Color")}</Label>
                      <div className="flex">
                        <Input
                          type="color"
                          value={data.config_sections?.pwa?.theme_color || '#000000'}
                          onChange={(e) => updateTemplateConfig('pwa', 'theme_color', e.target.value)}
                          className="h-6 p-0 w-full rounded-r-none"
                        />
                        <div className="bg-gray-100 dark:bg-gray-700 px-1 flex items-center rounded-r-md border border-l-0 border-input text-xs">
                          {data.config_sections?.pwa?.theme_color?.substring(0, 7) || '#000000'}
                        </div>
                      </div>
                    </div>
                    <div>
                      <Label className="text-sm mb-1 block">{t("Background")}</Label>
                      <div className="flex">
                        <Input
                          type="color"
                          value={data.config_sections?.pwa?.background_color || '#ffffff'}
                          onChange={(e) => updateTemplateConfig('pwa', 'background_color', e.target.value)}
                          className="h-6 p-0 w-full rounded-r-none"
                        />
                        <div className="bg-gray-100 dark:bg-gray-700 px-1 flex items-center rounded-r-md border border-l-0 border-input text-xs">
                          {data.config_sections?.pwa?.background_color?.substring(0, 7) || '#ffffff'}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </Card>
        </div>
        
        <div className="lg:col-span-1">
          <Card className="sticky top-4 h-[calc(100vh-2rem)] flex flex-col">
            <div className="p-3 border-b bg-muted/30 flex-shrink-0">
              <div className="flex justify-between items-center">
                <h3 className="text-base font-medium">{t("Live Preview")}</h3>
                <div className="text-xs text-muted-foreground">
                  {resolvedBusinessType} template
                </div>
              </div>
            </div>
            <div className="flex-1 overflow-hidden flex flex-col">
              <div className="vcard-preview-container">
                <ErrorBoundary 
                  FallbackComponent={PreviewErrorFallback}
                  onError={(error, info) => {
                    console.error('VCard Preview Error:', { error, info });
                  }}
                >
                  <div className="vcard-preview-inner">
                    <VCardPreview
                      businessType={resolvedBusinessType}
                      data={{ 
                        ...data, 
                        config_sections: previewConfigSections,
                        catalog_sections: catalogSections,
                        template_config: { 
                          ...(data.template_config || {}),
                          sections: previewConfigSections, 
                          sectionSettings: data.template_config?.sectionSettings || {},
                          allowedSections: isSuperAdmin ? undefined : (resolvedAllowedSections || undefined)
                        } 
                      }}
                      template={filteredTemplate || template}
                    />
                  </div>
                </ErrorBoundary>
              </div>
            </div>
          </Card>
        </div>
      </div>
      
      {/* Modals for Preview */}
      <ContactFormModal 
        isOpen={contactModalOpen} 
        onClose={() => setContactModalOpen(false)} 
        businessId={business?.id || 0}
        businessName={data.name || 'Preview Business'}
        themeColors={data.config_sections?.colors || template?.defaultColors}
        themeFont={data.config_sections?.font || template?.defaultFont}
      />
      
      <AppointmentFormModal 
        isOpen={appointmentModalOpen} 
        onClose={() => setAppointmentModalOpen(false)} 
        businessId={business?.id || 0}
        businessName={data.name || 'Preview Business'}
        themeColors={data.config_sections?.colors || template?.defaultColors}
        themeFont={data.config_sections?.font || template?.defaultFont}
      />

    </PageWrapper>
  );
}