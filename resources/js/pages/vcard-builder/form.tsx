import React from 'react';
import { Head, useForm } from '@inertiajs/react';
import { PageWrapper } from '@/components/PageWrapper';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
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
import axios from 'axios';
import { useTranslation } from 'react-i18next';
import { toast } from '@/components/custom-toast';
import { normalizeAllowedSections } from '@/utils/planSections';

type ConfigSectionMap = Record<string, any>;

type TemplateOption = (typeof businessTypeOptions)[number];

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
}

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
}

const normalizeBusinessType = (value?: string | null): string => resolveBusinessType(value);

const normalizeThemeKey = (value: string): string =>
  value
    .toString()
    .trim()
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/_+/g, '-');

export default function VCardBuilderForm({ business, userPlan, planFeatures, userRole }: Props) {
  const { t } = useTranslation();
  const isEdit = !!business;
  const initialBusinessType = React.useMemo(() => normalizeBusinessType(business?.business_type), [business?.business_type]);
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

  const resolvedBusinessType = React.useMemo(() => resolveBusinessType(businessType), [businessType]);

  const templateSectionKeys = React.useMemo(
    () => template?.sections?.map((section: any) => section.key) || [],
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
  const allowedBusinessTypes = React.useMemo<TemplateOption[]>(() => businessTypeOptions, []);

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
    
    return result;
  }, [business?.config_sections, filteredTemplate, template]);
  
  const { data, setData, post, put, processing, errors } = useForm({
    name: business?.name || template?.defaultData?.header?.name || t('My Business'),
    slug: business?.slug || '',
    business_type: businessType,
    custom_domain: business?.custom_domain || '',
    url_prefix: business?.url_prefix || 'v',
    password: '',
    password_enabled: business?.password_enabled || false,
    domain_type: (business?.domain_type as 'slug' | 'domain' | 'subdomain') ?? (business?.custom_domain ? 'domain' : 'slug'),
    favicon: business?.favicon || '',
    config_sections: isEdit ? normalizedConfigSections : (() => {
      const sections: ConfigSectionMap = { ...((template?.defaultData || {}) as ConfigSectionMap) };
      if (template?.sections) {
        template.sections.forEach((section: any, index: number) => {
          const sectionConfig = sections[section.key];
          if (sectionConfig) {
            sectionConfig.order = section.order ?? index;
          }
        });
      }
      if (firstColorPreset) {
        sections.colors = {
          primary: firstColorPreset.primary,
          secondary: firstColorPreset.secondary,
          accent: firstColorPreset.accent,
          text: firstColorPreset.text
        };
      }
      // Store allowed sections for public view filtering
      if (!isSuperAdmin && (resolvedAllowedSections || templateSectionKeys.length > 0)) {
        sections._allowed_sections = resolvedAllowedSections || templateSectionKeys;
      }
      return sections;
    })()
  });
  
  // Display validation errors as toast messages
  React.useEffect(() => {
    if (Object.keys(errors).length > 0) {
      Object.entries(errors).forEach(([field, message]) => {
        toast.error(`${field}: ${message}`);
      });
    }
  }, [errors]);
  
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
    if (!isSuperAdmin && resolvedAllowedSections && !currentConfigSections._allowed_sections) {
      setData('config_sections', {
        ...currentConfigSections,
        _allowed_sections: resolvedAllowedSections
      });
    }
  }, [resolvedAllowedSections, isSuperAdmin, data.config_sections]);

  const handleBusinessTypeChange = (newType: string) => {
    const resolvedType = resolveBusinessType(newType);
    setBusinessType(resolvedType);
    const newTemplate = getBusinessTemplate(resolvedType);
    const newName = isEdit ? data.name : newTemplate?.defaultData?.header?.name || t('My Business');
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

      if (!isSuperAdmin && (resolvedAllowedSections || templateSectionKeys.length > 0)) {
        updatedSections._allowed_sections = resolvedAllowedSections || templateSectionKeys;
      }

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
        allowedSections: existingTemplateConfig.allowedSections ?? (!isSuperAdmin ? (resolvedAllowedSections || undefined) : undefined)
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
    if (!isSuperAdmin && (resolvedAllowedSections || templateSectionKeys.length > 0)) {
      updatedData.config_sections = {
        ...(data.config_sections as ConfigSectionMap),
        _allowed_sections: resolvedAllowedSections || templateSectionKeys
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
                    allowedSections: isSuperAdmin ? undefined : (resolvedAllowedSections || undefined)
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
          <Card className="sticky top-4 h-[calc(100vh-2rem)]">
            <div className="p-3 border-b bg-muted/30">
              <h3 className="text-base font-medium">{t("Live Preview")}</h3>
            </div>
            <div className="h-[calc(100%-3.5rem)] overflow-hidden">
              <div className="h-full overflow-y-auto rounded-xl border border-border/40 bg-white dark:bg-gray-900 shadow-sm">
                <VCardPreview
                  businessType={resolvedBusinessType}
                  data={{ 
                    ...data, 
                    template_config: { 
                      sections: data.config_sections, 
                      sectionSettings: data.config_sections,
                      allowedSections: isSuperAdmin ? undefined : (resolvedAllowedSections || undefined)
                    } 
                  }}
                  template={filteredTemplate || template}
                />
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