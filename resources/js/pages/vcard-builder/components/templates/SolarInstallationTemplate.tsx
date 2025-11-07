import React from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
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
  Clock
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
  const configSections = data?.config_sections || {};
  const templateConfig = data?.template_config || {};

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

  const about = isSectionActive('about')
    ? (configSections.about !== undefined
        ? (configSections.about ?? {})
        : template?.defaultData?.about || {})
    : {};

  const residential = isSectionActive('residential_services')
    ? (configSections.residential_services && 'solutions' in (configSections.residential_services ?? {})
        ? (Array.isArray(configSections.residential_services?.solutions) ? configSections.residential_services.solutions : [])
        : template?.defaultData?.residential_services?.solutions || [])
    : [];

  const commercial = isSectionActive('commercial_services')
    ? (configSections.commercial_services && 'solutions' in (configSections.commercial_services ?? {})
        ? (Array.isArray(configSections.commercial_services?.solutions) ? configSections.commercial_services.solutions : [])
        : template?.defaultData?.commercial_services?.solutions || [])
    : [];

  const financing = isSectionActive('financing')
    ? (configSections.financing !== undefined
        ? (configSections.financing ?? {})
        : template?.defaultData?.financing || {})
    : {};

  const portfolio = isSectionActive('portfolio')
    ? (configSections.portfolio && 'projects' in (configSections.portfolio ?? {})
        ? (Array.isArray(configSections.portfolio?.projects) ? configSections.portfolio.projects : [])
        : template?.defaultData?.portfolio?.projects || [])
    : [];

  const galleryActive = isSectionActive('gallery');

  const galleryImages = galleryActive
    ? (configSections.gallery && 'images' in (configSections.gallery ?? {})
        ? (Array.isArray(configSections.gallery?.images) ? configSections.gallery.images : [])
        : template?.defaultData?.gallery?.images || [])
    : [];

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

  const calculator = isSectionActive('calculator')
    ? (configSections.calculator !== undefined
        ? (configSections.calculator ?? {})
        : template?.defaultData?.calculator || {})
    : {};

  const appointments = isSectionActive('appointments')
    ? (configSections.appointments !== undefined
        ? (configSections.appointments ?? {})
        : template?.defaultData?.appointments || {})
    : {};

  const contactSection = contact;

  const appointmentHighlights = Array.isArray(appointments.highlights)
    ? appointments.highlights
    : Array.isArray(appointments.benefits)
      ? appointments.benefits
      : [];

  const bookingBackground = colors.cardBg && colors.cardBg !== '#FFFFFF'
    ? colors.cardBg
    : `linear-gradient(135deg, ${colors.primary || '#0EA5E9'} 0%, ${colors.accent || colors.secondary || '#22D3EE'} 100%)`;

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
                {header.cta_button?.url && header.cta_button?.label && (
                  <Button
                    size="lg"
                    className="shadow-lg w-full sm:w-auto"
                    style={{ backgroundColor: colors.accent || '#22D3EE', color: colors.buttonText || '#0F172A', fontFamily: font }}
                    onClick={() => window.open(header.cta_button.url, '_blank', 'noopener,noreferrer')}
                  >
                    {header.cta_button.label}
                  </Button>
                )}
                {header.secondary_cta?.url && header.secondary_cta?.label && (
                  <Button
                    variant="outline"
                    className="bg-white/10 text-white border-white/30 hover:bg-white/20 w-full sm:w-auto"
                    style={{ fontFamily: font }}
                    onClick={() => window.open(header.secondary_cta.url, '_blank', 'noopener,noreferrer')}
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
        {(about.mission_statement || Array.isArray(about.value_props)) && (
          <section className="border p-6 sm:p-8" style={{ borderColor: colors.borderColor || '#E2E8F0', backgroundColor: colors.cardBg || '#FFFFFF' }}>
            <div className="space-y-6">
              <div className="space-y-4">
                <h2 className="text-2xl font-semibold" style={{ color: colors.primary }}>{t('Why Choose Us')}</h2>
                {about.mission_statement && (
                  <p className="text-base" style={{ color: colors.text }}>{about.mission_statement}</p>
                )}
                <div className="flex flex-wrap gap-4 text-sm" style={{ color: colors.text }}>
                  {about.experience_years && (
                    <Badge variant="secondary" className="bg-[rgba(0,0,0,0.05)]">
                      {about.experience_years}+ {t('years experience')}
                    </Badge>
                  )}
                  {about.license_numbers && <Badge variant="outline">{about.license_numbers}</Badge>}
                  {about.service_regions && (
                    <span className="flex items-center gap-2">
                      <MapPin className="w-4 h-4" />
                      {about.service_regions}
                    </span>
                  )}
                </div>
              </div>
              {Array.isArray(about.value_props) && about.value_props.length > 0 && (
                <div className="space-y-4">
                  {about.value_props.map((prop: any, idx: number) => (
                    <div
                      key={idx}
                      className="border p-4"
                      style={{ borderColor: colors.borderColor || '#E2E8F0', backgroundColor: '#FFFFFF' }}
                    >
                      <h3 className="font-semibold text-sm uppercase tracking-wide" style={{ color: colors.primary }}>
                        {prop.title}
                      </h3>
                      <p className="text-sm mt-2" style={{ color: colors.text }}>{prop.description}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </section>
        )}

        {Array.isArray(residential) && residential.length > 0 && (
          <section>
            <div className="flex flex-col items-center text-center gap-2 mb-6">
              <h2 className="text-2xl font-semibold" style={{ color: colors.primary }}>{t('Residential Solar Solutions')}</h2>
              <Badge className="bg-[rgba(255,153,0,0.1)] text-[rgba(255,153,0,1)] flex items-center gap-1">
                <Home className="w-4 h-4" />
                {t('Homeowners')}
              </Badge>
            </div>
            <div className="space-y-6">
              {residential.map((solution: any, idx: number) => (
                <div
                  key={idx}
                  className="border h-full flex flex-col"
                  style={{ borderColor: colors.borderColor || '#E2E8F0', backgroundColor: colors.cardBg || '#FFFFFF' }}
                >
                  {solution.image && (
                    <img src={solution.image} alt={solution.title} className="w-full h-40 object-cover" />
                  )}
                  <div className="p-6 space-y-3">
                    <h3 className="text-xl font-semibold" style={{ color: colors.text }}>{solution.title}</h3>
                    <p className="text-sm" style={{ color: colors.text }}>{solution.description}</p>
                    <div className="flex flex-wrap gap-3 text-sm">
                      {solution.system_size && (
                        <Badge variant="outline" className="bg-white" style={{ borderColor: colors.primary, color: colors.primary }}>
                          {t('Size')}: {solution.system_size}
                        </Badge>
                      )}
                      {solution.estimated_payback && (
                        <Badge variant="outline" className="bg-white" style={{ borderColor: colors.secondary, color: colors.secondary }}>
                          {t('Payback')}: {solution.estimated_payback}
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {Array.isArray(commercial) && commercial.length > 0 && (
          <section>
            <div className="flex flex-col items-center text-center gap-2 mb-6">
              <h2 className="text-2xl font-semibold" style={{ color: colors.primary }}>{t('Commercial & Industrial Solutions')}</h2>
              <Badge className="bg-[rgba(14,165,233,0.12)] text-[rgba(14,165,233,1)] flex items-center gap-1">
                <Building2 className="w-4 h-4" />
                {t('Businesses')}
              </Badge>
            </div>
            <div className="space-y-6">
              {commercial.map((solution: any, idx: number) => (
                <div
                  key={idx}
                  className="rounded-2xl border h-full flex flex-col"
                  style={{ borderColor: colors.borderColor || '#E2E8F0', backgroundColor: colors.cardBg || '#FFFFFF' }}
                >
                  {solution.image && (
                    <img src={solution.image} alt={solution.title} className="w-full h-40 object-cover rounded-t-2xl" />
                  )}
                  <div className="p-6 space-y-3">
                    <h3 className="text-xl font-semibold" style={{ color: colors.text }}>{solution.title}</h3>
                    <p className="text-sm" style={{ color: colors.text }}>{solution.description}</p>
                    <div className="flex flex-wrap gap-3 text-sm">
                      {solution.system_size && (
                        <Badge variant="outline" className="bg-white" style={{ borderColor: colors.primary, color: colors.primary }}>
                          {t('System Size')}: {solution.system_size}
                        </Badge>
                      )}
                      {solution.industry_focus && (
                        <Badge variant="outline" className="bg-white" style={{ borderColor: colors.secondary, color: colors.secondary }}>
                          {solution.industry_focus}
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {(Array.isArray(financing.options) && financing.options.length > 0) || (Array.isArray(financing.incentives) && financing.incentives.length > 0) ? (
          <section className="space-y-6 sm:space-y-8">
            {Array.isArray(financing.options) && financing.options.length > 0 && (
              <div
                className="border p-5 sm:p-6 h-full"
                style={{ borderColor: colors.borderColor || '#E2E8F0', backgroundColor: colors.cardBg || '#FFFFFF' }}
              >
                <h2 className="text-xl font-semibold mb-4" style={{ color: colors.primary }}>{t('Flexible Financing')}</h2>
                <div className="space-y-4">
                  {financing.options.map((option: any, idx: number) => (
                    <div
                      key={idx}
                      className="border p-4 space-y-2"
                      style={{ borderColor: colors.borderColor || '#E2E8F0', backgroundColor: '#FFFFFF' }}
                    >
                      <div className="flex items-center justify-between">
                        <h3 className="font-semibold" style={{ color: colors.text }}>{option.name}</h3>
                        {option.type && <Badge variant="outline">{option.type.toUpperCase()}</Badge>}
                      </div>
                      <p className="text-sm" style={{ color: colors.text }}>{option.interest_rate}</p>
                      <p className="text-sm" style={{ color: colors.text }}>{option.down_payment}</p>
                      {option.cta_url && option.cta_label && (
                        <Button
                          size="sm"
                          style={{ fontFamily: font, backgroundColor: colors.primary, color: colors.buttonText || '#FFFFFF' }}
                          onClick={() => window.open(option.cta_url, '_blank', 'noopener,noreferrer')}
                        >
                          {option.cta_label}
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {Array.isArray(financing.incentives) && financing.incentives.length > 0 && (
              <div
                className="border p-6 h-full"
                style={{ borderColor: colors.borderColor || '#E2E8F0', backgroundColor: colors.cardBg || '#FFFFFF' }}
              >
                <h2 className="text-xl font-semibold mb-4" style={{ color: colors.primary }}>{t('Incentives & Rebates')}</h2>
                <div className="space-y-4">
                  {financing.incentives.map((incentive: any, idx: number) => (
                    <div
                      key={idx}
                      className="rounded-xl border p-4 space-y-2"
                      style={{ borderColor: colors.borderColor || '#E2E8F0', backgroundColor: '#FFFFFF' }}
                    >
                      <div className="flex items-center justify-between">
                        <h3 className="font-semibold" style={{ color: colors.text }}>{incentive.title}</h3>
                        {incentive.type && <Badge variant="outline">{incentive.type.toUpperCase()}</Badge>}
                      </div>
                      <p className="text-sm" style={{ color: colors.text }}>{incentive.amount}</p>
                      {incentive.requirements && <p className="text-sm text-muted-foreground" style={{ color: colors.text }}>{incentive.requirements}</p>}
                      {incentive.expires_on && (
                        <p className="text-xs uppercase tracking-wide" style={{ color: colors.secondary }}>{t('Deadline')}: {incentive.expires_on}</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </section>
        ) : null}

        {Array.isArray(portfolio) && portfolio.length > 0 && (
          <section>
            <div className="flex flex-col items-center gap-3 text-center mb-6">
              <h2 className="text-2xl font-semibold" style={{ color: colors.primary }}>{t('Featured Installations')}</h2>
              <Badge variant="outline" className="bg-white" style={{ borderColor: colors.primary, color: colors.primary }}>
                {t('Case Studies')}
              </Badge>
            </div>
            <div className="space-y-6">
              {portfolio.map((project: any, idx: number) => (
                <div
                  key={idx}
                  className="border overflow-hidden"
                  style={{ borderColor: colors.borderColor || '#E2E8F0', backgroundColor: colors.cardBg || '#FFFFFF' }}
                >
                  {project.image && <img src={project.image} alt={project.title} className="w-full h-44 object-cover" />}
                  <div className="p-6 space-y-2">
                    <h3 className="text-xl font-semibold" style={{ color: colors.text }}>{project.title}</h3>
                    <p className="text-sm text-muted-foreground" style={{ color: colors.text }}>{project.summary}</p>
                    <div className="grid grid-cols-2 gap-3 text-xs uppercase tracking-wide">
                      {project.location && (
                        <span style={{ color: colors.secondary }}>{t('Location')}:<br /><strong className="text-sm" style={{ color: colors.text }}>{project.location}</strong></span>
                      )}
                      {project.system_size && (
                        <span style={{ color: colors.secondary }}>{t('Size')}:<br /><strong className="text-sm" style={{ color: colors.text }}>{project.system_size}</strong></span>
                      )}
                      {project.production && (
                        <span style={{ color: colors.secondary }}>{t('Production')}:<br /><strong className="text-sm" style={{ color: colors.text }}>{project.production}</strong></span>
                      )}
                      {project.year_completed && (
                        <span style={{ color: colors.secondary }}>{t('Completed')}:<br /><strong className="text-sm" style={{ color: colors.text }}>{project.year_completed}</strong></span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {galleryActive && (
          <section className="border p-6" style={{ borderColor: colors.borderColor || '#E2E8F0', backgroundColor: colors.cardBg || '#FFFFFF' }}>
            <div className="mb-6 space-y-2 text-center">
              <h2 className="text-2xl font-semibold" style={{ color: colors.primary }}>{t('Project Gallery')}</h2>
              <p className="text-sm text-muted-foreground" style={{ color: colors.text }}>
                {t('Showcase recent solar installations and system upgrades to build trust with new clients.')}
              </p>
            </div>
            {Array.isArray(galleryImages) && galleryImages.length > 0 ? (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {galleryImages.map((item: any, idx: number) => (
                  <div key={idx} className="border" style={{ borderColor: colors.borderColor || '#E2E8F0', backgroundColor: '#FFFFFF' }}>
                    {item.image && (
                      <div className="relative w-full" style={{ paddingBottom: '66%' }}>
                        <img
                          src={item.image}
                          alt={item.caption || t('Gallery image')}
                          className="absolute inset-0 h-full w-full object-cover"
                        />
                      </div>
                    )}
                    <div className="p-4 space-y-2">
                      {item.caption && (
                        <h3 className="text-lg font-semibold" style={{ color: colors.primary }}>
                          {item.caption}
                        </h3>
                      )}
                      {item.description && (
                        <p className="text-sm text-muted-foreground" style={{ color: colors.text }}>
                          {item.description}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-border/60 bg-muted/20 p-8 text-center">
                <SunMedium className="h-8 w-8 text-amber-400" />
                <p className="text-sm" style={{ color: colors.text }}>
                  {t('Add gallery images in the editor to showcase your solar installations here.')}
                </p>
              </div>
            )}
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

        {(calculator.cta_title || calculator.cta_description) && (
          <section className="border p-6 sm:p-8" style={{ borderColor: colors.borderColor || '#E2E8F0', backgroundColor: colors.cardBg || '#FFFFFF' }}>
            <div className="space-y-6">
              <div className="space-y-4">
                <h2 className="text-2xl font-semibold" style={{ color: colors.primary }}>
                  {calculator.cta_title || t('Estimate Your Solar Savings')}
                </h2>
                <p className="text-sm" style={{ color: colors.text }}>
                  {calculator.cta_description || t('Enter a few quick details to preview potential savings with solar and storage.')}
                </p>
                <ul className="space-y-2 text-sm" style={{ color: colors.text }}>
                  {calculator.monthly_bill_label && <li>• {calculator.monthly_bill_label}</li>}
                  {calculator.zip_label && <li>• {calculator.zip_label}</li>}
                  {calculator.sun_hours_label && <li>• {calculator.sun_hours_label}</li>}
                </ul>
              </div>
              <div className="bg-white border p-6 space-y-4" style={{ borderColor: colors.borderColor || '#E2E8F0' }}>
                <div className="grid gap-3">
                  <input
                    className="rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-2"
                    placeholder={calculator.monthly_bill_label || t('Average Monthly Bill ($)')}
                    style={{ borderColor: colors.borderColor || '#E2E8F0' }}
                  />
                  <input
                    className="rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-2"
                    placeholder={calculator.zip_label || t('ZIP / Postal Code')}
                    style={{ borderColor: colors.borderColor || '#E2E8F0' }}
                  />
                  <input
                    className="rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-2"
                    placeholder={calculator.sun_hours_label || t('Average Sun Hours per Day')}
                    style={{ borderColor: colors.borderColor || '#E2E8F0' }}
                  />
                </div>
                <Button
                  className="w-full"
                  style={{ fontFamily: font, backgroundColor: colors.primary, color: colors.buttonText || '#FFFFFF' }}
                >
                  {calculator.submit_label || t('Calculate Savings')}
                </Button>
                <p className="text-xs text-muted-foreground" style={{ color: colors.text }}>
                  {t('Estimates are illustrative. A solar consultant will confirm numbers during your assessment.')}
                </p>
              </div>
            </div>
          </section>
        )}

        {(appointments.booking_url || contact.phone || contact.email || contact.website || contact.office_address || contact.service_hours || (Array.isArray(socialLinks) && socialLinks.length > 0)) && (
          <section className="space-y-6">
            {appointments.booking_url && (
              <div
                className="border p-6 space-y-6"
                style={{
                  borderColor: colors.borderColor || '#E2E8F0',
                  background: bookingBackground,
                  color: '#FFFFFF'
                }}
              >
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <span className="flex h-12 w-12 items-center justify-center bg-white/20">
                      <CalendarCheck className="h-6 w-6" />
                    </span>
                    <div>
                      <p className="text-xs uppercase tracking-[0.3em] text-white/70">
                        {appointments.kicker || t('Plan Ahead')}
                      </p>
                      <h2 className="text-2xl font-semibold text-white">
                        {appointments.cta_title || t('Schedule Your Solar Consultation')}
                      </h2>
                    </div>
                  </div>
                  <p className="text-sm text-white/85">
                    {appointments.cta_text || t('Reserve a time to review your energy goals, incentives, and custom installation roadmap with our solar specialists.')}
                  </p>
                  <div className="grid gap-2 text-sm text-white/90">
                    {(appointmentHighlights.length > 0 ? appointmentHighlights : [
                      t('Personalized savings projection'),
                      t('Roof + usage assessment'),
                      t('Tax credit & rebate guidance'),
                      t('Live Q&A with consultant')
                    ]).map((item: any, idx: number) => {
                      const label = typeof item === 'string'
                        ? item
                        : item?.label || item?.title || item?.text || '';
                      if (!label) return null;
                      return (
                        <div key={idx} className="flex items-start gap-2">
                          <span className="mt-1 inline-flex h-5 w-5 items-center justify-center bg-white/25 text-[11px] font-semibold text-white">✓</span>
                          <span className="leading-tight text-white">{label}</span>
                        </div>
                      );
                    })}
                  </div>
                  {appointments.note && (
                    <p className="text-xs text-white/70 leading-snug">
                      {appointments.note}
                    </p>
                  )}
                </div>
                <div className="space-y-3">
                  <Button
                    size="lg"
                    className="h-12 w-full bg-white text-slate-900 transition hover:bg-slate-100"
                    style={{ fontFamily: font }}
                    onClick={() => window.open(appointments.booking_url, '_blank', 'noopener,noreferrer')}
                  >
                    {appointments.button_label || t('Book Consultation')}
                  </Button>
                  {(contact.phone || contact.email) && (
                    <div className="border border-white/30 p-3 text-xs text-white/85">
                      <p className="flex items-center gap-2">
                        <span className="h-2 w-2 bg-white/70" />
                        {t('Prefer to talk now?')}
                      </p>
                      {contact.phone && (
                        <p className="mt-2 text-sm font-medium">
                          {t('Call')}: <a href={`tel:${formatPhone(contact.phone)}`} className="underline-offset-2 hover:underline text-white">{contact.phone}</a>
                        </p>
                      )}
                      {contact.email && (
                        <p className="text-sm font-medium">
                          {t('Email')}: <a href={`mailto:${contact.email}`} className="underline-offset-2 hover:underline text-white">{contact.email}</a>
                        </p>
                      )}
                    </div>
                  )}
                </div>
              </div>
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
          </section>
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
