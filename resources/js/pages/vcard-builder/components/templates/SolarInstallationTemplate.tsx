import React from 'react';
import { handleAppointmentBooking } from '../VCardPreview';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { getFilteredSectionOrder } from '@/utils/sectionHelpers';
import { getBusinessTemplate } from '@/pages/vcard-builder/business-templates';
import {
  SunMedium,
  Leaf,
  Home,
  Building2,
  Zap,
  CalendarCheck,
  Phone,
  Mail,
  Globe,
  MapPin,
  Clock,
  Video as VideoIcon
} from 'lucide-react';

interface SolarInstallationTemplateProps {
  data: any;
  template: any;
}

const getWhatsAppUrl = (phone?: string, message?: string) => {
  if (!phone) return '';
  const digits = phone.replace(/\D/g, '');
  const encoded = message ? `?text=${encodeURIComponent(message)}` : '';
  return `https://wa.me/${digits}${encoded}`;
};

const formatPhone = (phone?: string) => {
  if (!phone) return '';
  return phone.replace(/\s+/g, '');
};

const pickFirstString = (...values: Array<string | null | undefined>) => {
  for (const value of values) {
    if (typeof value === 'string' && value.trim().length > 0) {
      return value;
    }
  }
  return '';
};

const StatCard = ({
  value,
  label,
  icon,
  font,
  colors
}: {
  value?: string;
  label: string;
  icon: React.ReactNode;
  font: string;
  colors: Record<string, string>;
}) => {
  if (!value) return null;
  return (
    <div
      className="border p-4"
      style={{ borderColor: colors.borderColor || '#E2E8F0', backgroundColor: colors.cardBg || '#FFFFFF' }}
    >
      <div className="flex items-center gap-3 mb-2" style={{ color: colors.accent || colors.primary }}>
        {icon}
        <span className="text-xs uppercase tracking-widest font-semibold" style={{ fontFamily: font }}>
          {label}
        </span>
      </div>
      <p className="text-xl font-semibold" style={{ color: colors.text, fontFamily: font }}>
        {value}
      </p>
    </div>
  );
};

const SolarInstallationTemplate: React.FC<SolarInstallationTemplateProps> = ({ data, template }) => {
  const { t } = useTranslation();
  const templateDefaults = template?.defaultData || {};
  const catalogSections = data.catalog_sections || {};
  const configSections = data?.config_sections || {};
  const templateConfig = data?.template_config || {};
  const sections = React.useMemo(() => getBusinessTemplate('solar-installation')?.sections || [], []);
  const previewData = React.useMemo(() => ({ ...data, template_config: data.template_config || {}, config_sections: configSections }), [data, configSections]);
  const orderedSectionKeys = React.useMemo(() => getFilteredSectionOrder(previewData, sections), [previewData, sections]);

  const isSectionActive = (key: string) => {
    const sectionConfig = (configSections as Record<string, any>)[key];
    const sectionSettings = templateConfig.sectionSettings?.[key];
    const visibility = templateConfig.section_visibility?.[key];
    if (sectionSettings?.enabled === false || visibility === false) {
      return false;
    }
    if (sectionConfig && typeof sectionConfig.enabled === 'boolean') {
      return sectionConfig.enabled;
    }
    return true;
  };

  const colors: Record<string, string> = {
    ...(template?.defaultColors || {}),
    ...(configSections.colors || {})
  };

  const font = configSections.font || template?.defaultFont || 'Montserrat, sans-serif';

  const header = Object.keys(configSections.header || {}).length > 0
    ? configSections.header
    : template?.defaultData?.header || {};

  const headerWhatsApp = typeof header.whatsapp === 'object' ? header.whatsapp : {};

  const contact = isSectionActive('contact')
    ? (configSections.contact !== undefined
        ? (configSections.contact ?? {})
        : template?.defaultData?.contact || {})
    : {};

  const contactWhatsApp = pickFirstString(
    typeof contact?.whatsapp === 'string' ? contact.whatsapp : undefined,
    contact?.whatsapp?.phone_number,
    contact?.whatsapp_phone_number
  );

  const whatsappConfig = {
    phone_number: pickFirstString(
      header.whatsapp_phone_number,
      headerWhatsApp.phone_number,
      configSections.whatsapp_phone_number,
      configSections.header?.whatsapp?.phone_number,
      contactWhatsApp,
      template?.defaultData?.header?.whatsapp_phone_number,
      template?.defaultData?.whatsapp?.phone_number
    ),
    cta_text: pickFirstString(
      header.whatsapp_cta_text,
      headerWhatsApp.cta_text,
      configSections.whatsapp_cta_text,
      configSections.header?.whatsapp?.cta_text,
      template?.defaultData?.header?.whatsapp_cta_text,
      template?.defaultData?.whatsapp?.cta_text
    ),
    prefilled_message: pickFirstString(
      header.whatsapp_prefilled_message,
      headerWhatsApp.prefilled_message,
      configSections.whatsapp_prefilled_message,
      configSections.header?.whatsapp?.prefilled_message,
      template?.defaultData?.header?.whatsapp_prefilled_message,
      template?.defaultData?.whatsapp?.prefilled_message
    ),
    button_label: pickFirstString(
      header.whatsapp_button_label,
      headerWhatsApp.button_label,
      configSections.whatsapp_button_label,
      configSections.header?.whatsapp?.button_label,
      template?.defaultData?.header?.whatsapp_button_label,
      template?.defaultData?.whatsapp?.button_label
    ),
    show_icon: (typeof header.whatsapp_show_icon === 'boolean' ? header.whatsapp_show_icon : undefined) ??
      (typeof configSections.whatsapp_show_icon === 'boolean' ? configSections.whatsapp_show_icon : undefined) ??
      (typeof headerWhatsApp.show_icon === 'boolean' ? headerWhatsApp.show_icon : undefined) ??
      (typeof configSections.header?.whatsapp?.show_icon === 'boolean' ? configSections.header.whatsapp.show_icon : undefined)
  };

  const metrics = isSectionActive('metrics')
    ? (configSections.metrics !== undefined
        ? (configSections.metrics ?? {})
        : template?.defaultData?.metrics || {})
    : {};

  const getMetricValue = (...keys: string[]) => pickFirstString(...keys.map((key) => metrics?.[key]));
  const metricsHeading = pickFirstString(metrics.section_heading, t('Impact at a Glance'));
  const metricsDescription = pickFirstString(metrics.section_description);
  const metricCards = [
    {
      value: getMetricValue('total_kw_installed', 'total_systems_installed'),
      label: pickFirstString(
        metrics?.total_kw_installed_label,
        metrics?.total_systems_installed_label,
        metrics?.total_systems_installed ? t('Solar Systems Installed') : t('Total kW Installed')
      ),
      icon: <Zap className="w-4 h-4" />
    },
    {
      value: getMetricValue('homes_powered', 'households_supported'),
      label: pickFirstString(
        metrics?.homes_powered_label,
        metrics?.households_supported_label,
        metrics?.households_supported ? t('Households Powered Daily') : t('Homes Powered')
      ),
      icon: <Home className="w-4 h-4" />
    },
    {
      value: getMetricValue('co2_offset', 'load_shedding_hours_saved'),
      label: pickFirstString(
        metrics?.co2_offset_label,
        metrics?.load_shedding_hours_saved_label,
        metrics?.load_shedding_hours_saved ? t('Hours Of Backup During Outages') : t('CO₂ Offset')
      ),
      icon: <Leaf className="w-4 h-4" />
    },
    {
      value: getMetricValue('trees_saved', 'local_farm_installs'),
      label: pickFirstString(
        metrics?.trees_saved_label,
        metrics?.local_farm_installs_label,
        metrics?.local_farm_installs ? t('Community & Farm Installs') : t('Trees Equivalent')
      ),
      icon: <SunMedium className="w-4 h-4" />
    }
  ].filter((card) => card.value);

  const howItWorks = isSectionActive('how_it_works')
    ? (configSections.how_it_works !== undefined
        ? (configSections.how_it_works ?? {})
        : template?.defaultData?.how_it_works || {})
    : {};

  const whyUs = isSectionActive('why_us')
    ? (configSections.why_us !== undefined
        ? (configSections.why_us ?? {})
        : template?.defaultData?.why_us || {})
    : {};

  const packagesSection = (catalogSections.packages ?? configSections.packages) || {};

  const packages = isSectionActive('packages')
    ? packagesSection
    : {};

  const featuredProjectsSection = (catalogSections.featured_projects ?? configSections.featured_projects) || {};
  const featuredProjects = isSectionActive('featured_projects')
    ? featuredProjectsSection
    : {};

  const testimonials = isSectionActive('testimonials')
    ? (configSections.testimonials && 'reviews' in (configSections.testimonials ?? {})
        ? (Array.isArray(configSections.testimonials?.reviews) ? configSections.testimonials.reviews : [])
        : template?.defaultData?.testimonials?.reviews || [])
    : [];

  const faqItems = isSectionActive('faq')
    ? (configSections.faq && 'items' in (configSections.faq ?? {})
        ? (Array.isArray(configSections.faq?.items) ? configSections.faq.items : [])
        : template?.defaultData?.faq?.items || [])
    : [];

  const contactForm = isSectionActive('contact_form')
    ? (configSections.contact_form !== undefined
        ? (configSections.contact_form ?? {})
        : template?.defaultData?.contact_form || {})
    : {};

  const contactSection = contact;

  const savingsCalculator = isSectionActive('savings_calculator')
    ? (configSections.savings_calculator !== undefined
        ? (configSections.savings_calculator ?? {})
        : template?.defaultData?.savings_calculator || {})
    : {};

  const finalCta = isSectionActive('final_cta')
    ? (configSections.final_cta !== undefined
        ? (configSections.final_cta ?? {})
        : template?.defaultData?.final_cta || {})
    : {};

  const socialLinks = isSectionActive('social')
    ? (configSections.social && 'social_links' in (configSections.social ?? {})
        ? (Array.isArray(configSections.social?.social_links) ? configSections.social.social_links : [])
        : template?.defaultData?.social?.social_links || [])
    : [];

  const businessHours = isSectionActive('business_hours')
    ? (configSections.business_hours && 'hours' in (configSections.business_hours ?? {})
        ? (Array.isArray(configSections.business_hours?.hours) ? configSections.business_hours.hours : [])
        : template?.defaultData?.business_hours?.hours || [])
    : [];
  const fallbackCompanyName = data.company_name || header.company_name || 'Solar Installation Company';

  const resolveOverlayOpacity = (value: unknown) => {
    if (value === undefined || value === null) return undefined;
    const numeric = typeof value === 'string' ? parseFloat(value) : value;
    if (typeof numeric !== 'number' || Number.isNaN(numeric)) {
      return undefined;
    }
    return Math.min(Math.max(numeric, 0), 0.9);
  };

  const overlayOpacity = resolveOverlayOpacity(header.hero_overlay_opacity ?? configSections.hero_overlay_opacity)
    ?? resolveOverlayOpacity(template?.defaultData?.header?.hero_overlay_opacity)
    ?? 0.45;

  const heroStyle = header.hero_background
    ? {
        backgroundImage: `linear-gradient(rgba(15, 23, 42, ${overlayOpacity}), rgba(15, 23, 42, ${overlayOpacity})), url(${header.hero_background})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      }
    : { backgroundImage: `linear-gradient(120deg, ${colors.primary}, ${colors.secondary})` };

  const headerLogo = header.profile_image || template?.defaultData?.header?.profile_image || '';

  return (
    <div className="w-full" style={{ fontFamily: font, backgroundColor: colors.background || '#FFFFFF', color: colors.text || '#0F172A' }}>
      <section className="relative overflow-hidden shadow-xl mb-10" style={{ ...heroStyle, color: '#FFFFFF' }}>
        <div className="px-4 py-10 sm:px-6 sm:py-12 md:px-12 md:py-16">
          <div className="max-w-5xl mx-auto flex flex-col gap-10">
            <div className="space-y-5">
              <div className="inline-flex items-center gap-2 bg-white/15 px-3 py-1 text-xs uppercase tracking-wider font-semibold">
                <SunMedium className="w-4 h-4" />
                {t('Solar Professionals')}
              </div>
              <div className="space-y-4">
                {headerLogo && (
                  <div className="flex items-center justify-start gap-3">
                    <div className="h-14 w-14 overflow-hidden rounded-full bg-white/20 p-2">
                      <img src={headerLogo} alt={header.company_name || t('Company logo')} className="h-full w-full object-contain" />
                    </div>
                    {header.company_name && (
                      <p className="text-sm font-semibold uppercase tracking-[0.3em] text-white/80">
                        {header.company_name}
                      </p>
                    )}
                  </div>
                )}
                {!headerLogo && header.company_name && (
                  <p className="text-sm font-semibold uppercase tracking-[0.3em] text-white/80">
                    {header.company_name}
                  </p>
                )}
                <h1 className="text-3xl md:text-4xl font-bold leading-tight text-white">
                  {header.headline || t('Power Your Future with Clean Energy')}
                </h1>
                <p className="mt-3 text-base md:text-lg text-white/80">
                  {header.subheadline || t('Custom residential and commercial solar solutions that lower bills and carbon emissions.')}
                </p>
              </div>
              {Array.isArray(header.badges) && header.badges.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {header.badges.map((badge: any, idx: number) => (
                    <Badge key={idx} className="bg-white/20 hover:bg-white/30 text-white">
                      {badge.icon && <span className="mr-1 text-sm">{badge.icon}</span>}
                      {badge.label}
                    </Badge>
                  ))}
                </div>
              )}
              <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
                {header.cta_button?.label && (
                  <Button
                    size="lg"
                    className="shadow-lg w-full sm:w-auto"
                    style={{ backgroundColor: colors.accent || '#22D3EE', color: colors.buttonText || '#0F172A', fontFamily: font }}
                    onClick={() => handleAppointmentBooking(configSections.appointments)}
                  >
                    {header.cta_button.label}
                  </Button>
                )}
                {header.secondary_cta?.label && (
                  <Button
                    variant="outline"
                    className="bg-white/10 text-white border-white/30 hover:bg-white/20 w-full sm:w-auto"
                    style={{ fontFamily: font }}
                    onClick={() => handleAppointmentBooking(configSections.appointments)}
                  >
                    {header.secondary_cta.label}
                  </Button>
                )}
                {whatsappConfig.phone_number && (
                  <Button
                    className="w-full sm:w-auto bg-[#25D366] text-white hover:bg-[#1EBE5C]"
                    style={{ fontFamily: font }}
                    onClick={() => {
                      const url = getWhatsAppUrl(whatsappConfig.phone_number, whatsappConfig.prefilled_message || headerWhatsApp.prefilled_message);
                      if (url) window.open(url, '_blank', 'noopener,noreferrer');
                    }}
                  >
                    {whatsappConfig.button_label || t('Chat on WhatsApp')}
                  </Button>
                )}
              </div>
              {whatsappConfig.cta_text && (
                <p className="text-sm text-white/80">{whatsappConfig.cta_text}</p>
              )}
            </div>
            {isSectionActive('metrics') && (
              <div className="bg-white/10 backdrop-blur-lg p-6 space-y-4">
                <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                  <SunMedium className="w-5 h-5" />
                  {metricsHeading}
                </h2>
                {metricsDescription && (
                  <p className="text-sm text-white/80">
                    {metricsDescription}
                  </p>
                )}
                <div className="grid grid-cols-1 gap-3 text-white">
                  {metricCards.map((card, idx) => (
                    <StatCard key={`${card.label}-${idx}`} value={card.value} label={card.label} icon={card.icon} font={font} colors={colors} />
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      <div className="space-y-12 px-4 sm:px-0">
        {isSectionActive('how_it_works') && (howItWorks.heading || Array.isArray(howItWorks.steps)) && (
          <section className="border p-6 sm:p-8" style={{ borderColor: colors.borderColor || '#E2E8F0', backgroundColor: colors.cardBg || '#FFFFFF' }}>
            <div className="space-y-6">
              <div className="space-y-2 text-center">
                <h2 className="text-2xl font-semibold" style={{ color: colors.primary }}>{howItWorks.heading || t('How It Works')}</h2>
                {howItWorks.subheading && (
                  <p className="text-sm" style={{ color: colors.text }}>{howItWorks.subheading}</p>
                )}
              </div>
              {Array.isArray(howItWorks.steps) && howItWorks.steps.length > 0 && (
                <div className="space-y-4">
                  {howItWorks.steps.map((step: any, idx: number) => (
                    <div
                      key={idx}
                      className="border p-4 h-full"
                      style={{ borderColor: colors.borderColor || '#E2E8F0', backgroundColor: '#FFFFFF' }}
                    >
                      <div className="flex items-center gap-3 mb-2">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold" style={{ backgroundColor: colors.accent, color: colors.primary }}>
                          {idx + 1}
                        </div>
                        <h3 className="font-semibold" style={{ color: colors.text }}>{step.title}</h3>
                      </div>
                      {step.description && (
                        <p className="text-sm" style={{ color: colors.text }}>{step.description}</p>
                      )}
                    </div>
                  ))}
                </div>
              )}
              {howItWorks.cta_label && (
                <div className="text-center">
                  <Button
                    style={{ backgroundColor: colors.primary, color: colors.buttonText || '#FFFFFF', fontFamily: font }}
                    onClick={() => handleAppointmentBooking(configSections.appointments)}
                  >
                    {howItWorks.cta_label}
                  </Button>
                </div>
              )}
            </div>
          </section>
        )}

        {isSectionActive('why_us') && (whyUs.heading || Array.isArray(whyUs.reasons)) && (
          <section className="border p-6 sm:p-8" style={{ borderColor: colors.borderColor || '#E2E8F0', backgroundColor: colors.cardBg || '#FFFFFF' }}>
            <div className="space-y-4">
              <div className="space-y-2 text-center">
                <h2 className="text-2xl font-semibold" style={{ color: colors.primary }}>{whyUs.heading || t('Why Choose Us')}</h2>
                {whyUs.subheading && (
                  <p className="text-sm" style={{ color: colors.text }}>{whyUs.subheading}</p>
                )}
              </div>
              {Array.isArray(whyUs.reasons) && whyUs.reasons.length > 0 && (
                <div className="space-y-4">
                  {whyUs.reasons.map((reason: any, idx: number) => (
                    <div
                      key={idx}
                      className="border p-4 h-full flex flex-col"
                      style={{ borderColor: colors.borderColor || '#E2E8F0', backgroundColor: '#FFFFFF' }}
                    >
                      <h3 className="font-semibold text-base mb-2" style={{ color: colors.text }}>{reason.title}</h3>
                      {reason.description && (
                        <p className="text-sm" style={{ color: colors.text }}>{reason.description}</p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </section>
        )}

        <section>
          <div className="space-y-2 mb-6 text-center">
            <h2 className="text-2xl font-semibold" style={{ color: colors.primary }}>{packages.heading || t('Solar Packages')}</h2>
            {packages.subheading && (
              <p className="text-sm" style={{ color: colors.text }}>{packages.subheading}</p>
            )}
          </div>
          {packages && Array.isArray(packages.package_list) && packages.package_list.length > 0 ? (
            <div className="grid grid-cols-1 gap-6">
              {packages.package_list.map((pkg: any, idx: number) => (
                <div
                  key={idx}
                  className="rounded-2xl border p-6 text-left"
                  style={{ borderColor: colors.borderColor || '#E2E8F0', backgroundColor: colors.cardBg || '#FFFFFF' }}
                >
                  <Badge className="mb-4" style={{ backgroundColor: colors.accent, color: colors.primary }}>
                    {pkg.name}
                  </Badge>
                  <h3 className="text-lg font-semibold mb-2" style={{ color: colors.text }}>{pkg.description}</h3>
                  <p className="text-base font-medium mb-3" style={{ color: colors.primary }}>{pkg.price}</p>
                  {pkg.timeline && (
                    <p className="text-xs uppercase tracking-wide mb-3" style={{ color: colors.text + '99' }}>Timeline: {pkg.timeline}</p>
                  )}
                  {pkg.features && (
                    <ul className="space-y-2 text-sm mb-4" style={{ color: colors.text + 'CC' }}>
                      {pkg.features.split('\n').map((feature: string, featureIndex: number) => (
                        <li key={featureIndex} className="flex items-start gap-2">
                          <span className="mt-0.5 inline-flex h-4 w-4 items-center justify-center bg-emerald-100 text-[8px] font-bold text-emerald-600 rounded-full">✓</span>
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                  {pkg.cta_label && (
                    <Button
                      className="w-full mt-2"
                      style={{ backgroundColor: colors.primary, color: colors.buttonText || '#FFFFFF', fontFamily: font }}
                      onClick={() => pkg.cta_link && window.open(pkg.cta_link, '_blank', 'noopener,noreferrer')}
                    >
                      {pkg.cta_label}
                    </Button>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-border/60 bg-muted/20 p-8 text-center">
              <Zap className="h-8 w-8 text-amber-400" />
              <h3 className="text-lg font-semibold" style={{ color: colors.text }}>
                {t('Packages Section')}
              </h3>
              <p className="text-sm" style={{ color: colors.text }}>
                {t('This section pulls data from your Packages page. Add packages there to display them here.')}
              </p>
            </div>
          )}
        </section>

        {isSectionActive('featured_projects') && (
          <section>
            <div className="space-y-2 mb-6 text-center">
              <h2 className="text-2xl font-semibold" style={{ color: colors.primary }}>{featuredProjects.heading || t('Our Featured Projects')}</h2>
              {featuredProjects.subheading && (
                <p className="text-sm" style={{ color: colors.text }}>{featuredProjects.subheading}</p>
              )}
            </div>
            {featuredProjects && Array.isArray(featuredProjects.projects) && featuredProjects.projects.length > 0 ? (
              <div className="space-y-6">
                {featuredProjects.projects.map((project: any, idx: number) => (
                  <div
                    key={idx}
                    className="border overflow-hidden"
                    style={{ borderColor: colors.borderColor || '#E2E8F0', backgroundColor: colors.cardBg || '#FFFFFF' }}
                  >
                    {project.media && project.media.length > 0 && (
                      <img 
                        src={project.media[0].url} 
                        alt={project.title} 
                        className="w-full h-44 object-cover" 
                      />
                    )}
                    <div className="p-6 space-y-2">
                      <h3 className="text-xl font-semibold" style={{ color: colors.text }}>{project.title}</h3>
                      <p className="text-sm text-muted-foreground" style={{ color: colors.text }}>{project.summary}</p>
                      <div className="grid grid-cols-2 gap-3 text-xs uppercase tracking-wide">
                        {project.location && (
                          <span style={{ color: colors.secondary }}>{t('Location')}:<br /><strong className="text-sm" style={{ color: colors.text }}>{project.location}</strong></span>
                        )}
                        {project.category && (
                          <span style={{ color: colors.secondary }}>{t('Category')}:<br /><strong className="text-sm" style={{ color: colors.text }}>{project.category}</strong></span>
                        )}
                        {project.description && (
                          <span style={{ color: colors.secondary }}>{t('Description')}:<br /><strong className="text-sm" style={{ color: colors.text }}>{project.description}</strong></span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-border/60 bg-muted/20 p-8 text-center">
                <Building2 className="h-8 w-8 text-amber-400" />
                <h3 className="text-lg font-semibold" style={{ color: colors.text }}>
                  {t('Featured Projects Section')}
                </h3>
                <p className="text-sm" style={{ color: colors.text }}>
                  {t('This section pulls data from your Featured Projects page. Add projects there to display them here.')}
                </p>
              </div>
            )}
          </section>
        )}

        {isSectionActive('savings_calculator') && (savingsCalculator.heading || savingsCalculator.description) && (
          <section className="border p-6 sm:p-8" style={{ borderColor: colors.borderColor || '#E2E8F0', backgroundColor: colors.cardBg || '#FFFFFF' }}>
            <div className="space-y-4 max-w-xl mx-auto text-center">
              <h2 className="text-2xl font-semibold" style={{ color: colors.primary }}>{savingsCalculator.heading || t('See How Much You Can Save')}</h2>
              {savingsCalculator.description && (
                <p className="text-sm" style={{ color: colors.text }}>{savingsCalculator.description}</p>
              )}
            </div>
            <div className="space-y-3 mt-6 max-w-xl mx-auto">
              <div>
                <label className="text-xs font-semibold block mb-1" style={{ color: colors.text }}>
                  {savingsCalculator.bill_label || t('Your Current Monthly Bill')}
                </label>
                <div className="border rounded px-3 py-2 text-sm bg-white" />
              </div>
              <div>
                <label className="text-xs font-semibold block mb-1" style={{ color: colors.text }}>
                  {savingsCalculator.savings_label || t('Estimated Monthly Savings')}
                </label>
                <div className="border rounded px-3 py-2 text-sm bg-white" />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-2">
                <div>
                  <label className="text-xs font-semibold block mb-1" style={{ color: colors.text }}>
                    {savingsCalculator.name_label || t('Full Name')}
                  </label>
                  <div className="border rounded px-3 py-2 text-sm bg-white" />
                </div>
                <div>
                  <label className="text-xs font-semibold block mb-1" style={{ color: colors.text }}>
                    {savingsCalculator.phone_label || t('Phone Number')}
                  </label>
                  <div className="border rounded px-3 py-2 text-sm bg-white" />
                </div>
                <div>
                  <label className="text-xs font-semibold block mb-1" style={{ color: colors.text }}>
                    {savingsCalculator.location_label || t('Location / Area')}
                  </label>
                  <div className="border rounded px-3 py-2 text-sm bg-white" />
                </div>
              </div>
              <div className="pt-3 text-center">
                <Button
                  style={{ backgroundColor: colors.primary, color: colors.buttonText || '#FFFFFF', fontFamily: font }}
                >
                  {savingsCalculator.cta_label || t('Calculate My Savings')}
                </Button>
              </div>
            </div>
          </section>
        )}

        {Array.isArray(testimonials) && testimonials.length > 0 && (
          <section className="border p-6 sm:p-8" style={{ borderColor: colors.borderColor || '#E2E8F0', backgroundColor: colors.cardBg || '#FFFFFF' }}>
            <h2 className="text-2xl font-semibold mb-6" style={{ color: colors.primary }}>{t('Client Testimonials')}</h2>
            <div className="space-y-6">
              {testimonials.map((review: any, idx: number) => (
                <div
                  key={idx}
                  className="border p-6 h-full flex flex-col"
                  style={{ borderColor: colors.borderColor || '#E2E8F0', backgroundColor: '#FFFFFF' }}
                >
                  <p className="text-sm italic" style={{ color: colors.text }}>&ldquo;{review.quote}&rdquo;</p>
                  <div className="mt-auto pt-4">
                    <h3 className="font-semibold" style={{ color: colors.text }}>{review.client_name}</h3>
                    <p className="text-xs text-muted-foreground" style={{ color: colors.text }}>{review.location}</p>
                    {review.system_type && (
                      <p className="text-xs text-muted-foreground" style={{ color: colors.secondary }}>{review.system_type}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {Array.isArray(faqItems) && faqItems.length > 0 && (
          <section>
            <h2 className="text-2xl font-semibold mb-6" style={{ color: colors.primary }}>{t('Frequently Asked Questions')}</h2>
            <div className="space-y-4">
              {faqItems.map((item: any, idx: number) => (
                <details key={idx} className="border" style={{ borderColor: colors.borderColor || '#E2E8F0' }}>
                  <summary className="cursor-pointer px-5 py-4 font-medium" style={{ color: colors.text }}>
                    {item.question}
                  </summary>
                  <div className="px-5 pb-4 text-sm text-muted-foreground" style={{ color: colors.text }}>
                    {item.answer}
                  </div>
                </details>
              ))}
            </div>
          </section>
        )}

        {contactForm.form_title && (
          <section className="border p-6 sm:p-8" style={{ borderColor: colors.borderColor || '#E2E8F0', backgroundColor: colors.cardBg || '#FFFFFF' }}>
            <div className="space-y-6">
              <div className="space-y-4 text-center">
                <h2 className="text-2xl font-semibold" style={{ color: colors.primary }}>
                  {contactForm.form_title || t('Get a Free Solar Quote')}
                </h2>
                {contactForm.form_description && (
                  <p className="text-sm" style={{ color: colors.text }}>
                    {contactForm.form_description}
                  </p>
                )}
              </div>
              <div className="bg-white border p-6 space-y-4" style={{ borderColor: colors.borderColor || '#E2E8F0' }}>
                <form className="space-y-4">
                  <div>
                    <input
                      className="w-full rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-2"
                      placeholder={t('Full Name')}
                      style={{ borderColor: colors.borderColor || '#E2E8F0' }}
                      required
                    />
                  </div>
                  <div>
                    <input
                      type="email"
                      className="w-full rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-2"
                      placeholder={t('Email Address')}
                      style={{ borderColor: colors.borderColor || '#E2E8F0' }}
                      required
                    />
                  </div>
                  <div>
                    <input
                      type="tel"
                      className="w-full rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-2"
                      placeholder={t('Phone Number')}
                      style={{ borderColor: colors.borderColor || '#E2E8F0' }}
                    />
                  </div>
                  <div>
                    <textarea
                      className="w-full rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-2"
                      placeholder={t('Tell us about your project...')}
                      rows={3}
                      style={{ borderColor: colors.borderColor || '#E2E8F0' }}
                    />
                  </div>
                  <Button
                    type="button"
                    className="w-full"
                    style={{ fontFamily: font, backgroundColor: colors.primary, color: colors.buttonText || '#FFFFFF' }}
                    onClick={() => typeof window !== "undefined" && window.dispatchEvent(new CustomEvent('openContactModal'))}
                  >
                    {t('Send Inquiry')}
                  </Button>
                </form>
                {contactForm.success_message && (
                  <p className="text-xs text-muted-foreground text-center" style={{ color: colors.text }}>
                    {contactForm.success_message}
                  </p>
                )}
              </div>
            </div>
          </section>
        )}


        {(contact.phone || contact.email || contact.website || contact.office_address || contact.service_hours || (Array.isArray(socialLinks) && socialLinks.length > 0)) && (
          <div className="border p-5 space-y-4" style={{ borderColor: colors.borderColor || '#E2E8F0', backgroundColor: colors.cardBg || '#FFFFFF' }}>
            <h2 className="text-xl font-semibold" style={{ color: colors.primary }}>{t('Get in Touch')}</h2>
            <div className="space-y-4 text-sm" style={{ color: colors.text }}>
              {contact.phone && (
                <div className="flex gap-3">
                  <span className="mt-1 inline-flex h-8 w-8 items-center justify-center border" style={{ borderColor: colors.borderColor || '#E2E8F0', color: colors.primary }}>
                    <Phone className="h-4 w-4" />
                  </span>
                  <div className="space-y-1">
                    <p className="text-xs uppercase tracking-wide" style={{ color: colors.primary }}>{t('Call')}</p>
                    <a href={`tel:${formatPhone(contact.phone)}`} className="font-medium hover:underline">
                      {contact.phone}
                    </a>
                  </div>
                </div>
              )}
              {contact.email && (
                <div className="flex gap-3">
                  <span className="mt-1 inline-flex h-8 w-8 items-center justify-center border" style={{ borderColor: colors.borderColor || '#E2E8F0', color: colors.primary }}>
                    <Mail className="h-4 w-4" />
                  </span>
                  <div className="space-y-1">
                    <p className="text-xs uppercase tracking-wide" style={{ color: colors.primary }}>{t('Email')}</p>
                    <a href={`mailto:${contact.email}`} className="font-medium hover:underline">
                      {contact.email}
                    </a>
                  </div>
                </div>
              )}
              {contact.website && (
                <div className="flex gap-3">
                  <span className="mt-1 inline-flex h-8 w-8 items-center justify-center border" style={{ borderColor: colors.borderColor || '#E2E8F0', color: colors.primary }}>
                    <Globe className="h-4 w-4" />
                  </span>
                  <div className="space-y-1">
                    <p className="text-xs uppercase tracking-wide" style={{ color: colors.primary }}>{t('Website')}</p>
                    <a href={contact.website} target="_blank" rel="noopener noreferrer" className="font-medium hover:underline">
                      {contact.website}
                    </a>
                  </div>
                </div>
              )}
              {contact.office_address && (
                <div className="flex gap-3">
                  <span className="mt-1 inline-flex h-8 w-8 items-center justify-center border" style={{ borderColor: colors.borderColor || '#E2E8F0', color: colors.primary }}>
                    <MapPin className="h-4 w-4" />
                  </span>
                  <div className="space-y-1">
                    <p className="text-xs uppercase tracking-wide" style={{ color: colors.primary }}>{t('Office')}</p>
                    <span className="font-medium leading-snug">{contact.office_address}</span>
                  </div>
                </div>
              )}
              {contact.service_hours && (
                <div className="flex gap-3">
                  <span className="mt-1 inline-flex h-8 w-8 items-center justify-center border" style={{ borderColor: colors.borderColor || '#E2E8F0', color: colors.primary }}>
                    <Clock className="h-4 w-4" />
                  </span>
                  <div className="space-y-1">
                    <p className="text-xs uppercase tracking-wide" style={{ color: colors.primary }}>{t('Hours')}</p>
                    <span className="font-medium leading-snug">{contact.service_hours}</span>
                  </div>
                </div>
              )}
            </div>

            {Array.isArray(socialLinks) && socialLinks.length > 0 && (
              <div className="pt-4 border-t" style={{ borderColor: colors.borderColor || '#E2E8F0' }}>
                <h3 className="text-sm font-semibold mb-3" style={{ color: colors.primary }}>{t('Connect Online')}</h3>
                <div className="flex flex-wrap gap-2 text-xs">
                  {socialLinks.map((link: any, idx: number) => (
                    <a
                      key={`${link.platform || 'link'}-${idx}`}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-1 border hover:bg-[rgba(0,0,0,0.05)]"
                      style={{ borderColor: colors.borderColor || '#E2E8F0', color: colors.text }}
                    >
                      {link.platform ? link.platform.toUpperCase() : t('Link')}
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {Array.isArray(businessHours) && businessHours.length > 0 && (
          <section className="border p-5 sm:p-6" style={{ borderColor: colors.borderColor || '#E2E8F0', backgroundColor: colors.cardBg || '#FFFFFF' }}>
            <h2 className="text-xl font-semibold mb-4" style={{ color: colors.primary }}>{t('Business Hours')}</h2>
            <div className="grid gap-2 text-sm" style={{ color: colors.text }}>
              {businessHours.map((slot: any, idx: number) => (
                <div key={idx} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
                  <span className="capitalize">{slot.day}</span>
                  <span>{slot.is_closed ? t('Closed') : `${slot.open_time || '--'} - ${slot.close_time || '--'}`}</span>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>

      {(configSections.copyright?.text || fallbackCompanyName) && (
        <footer
          className="mt-12 border-t px-4 py-6"
          style={{ borderColor: colors.borderColor || '#E2E8F0', backgroundColor: colors.cardBg || '#FFFFFF' }}
        >
          <div className="mx-auto max-w-5xl text-center text-xs sm:text-sm" style={{ color: colors.text, fontFamily: font }}>
            <p>
              {configSections.copyright?.text || `${fallbackCompanyName} © ${new Date().getFullYear()}`}
            </p>
          </div>
        </footer>
      )}
    </div>
  );
};


export default SolarInstallationTemplate;
