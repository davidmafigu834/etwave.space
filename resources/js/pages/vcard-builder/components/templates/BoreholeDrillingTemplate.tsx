import React from 'react';
import { useTranslation } from 'react-i18next';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Waves,
  Droplet,
  PhoneCall,
  Mail,
  MapPin,
  Clock,
  ArrowRight,
  Quote,
  MessageCircle,
  ChevronRight,
  ShieldCheck,
  CheckCircle2
} from 'lucide-react';

interface BoreholeDrillingTemplateProps {
  data: any;
  template: any;
}

const createAnchorHandler = (target?: string) => {
  if (!target) return undefined;
  if (target.startsWith('#')) {
    return () => {
      const element = document.querySelector(target);
      if (element && typeof element.scrollIntoView === 'function') {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    };
  }
  return () => window.open(target, '_blank', 'noopener,noreferrer');
};

const ensureHttpUrl = (url?: string) => {
  if (!url) return '';
  if (/^https?:\/\//i.test(url)) return url;
  if (url.startsWith('mailto:') || url.startsWith('tel:')) return url;
  return `https://${url}`;
};

const pickFirstString = (...values: Array<string | null | undefined>) => {
  for (const value of values) {
    if (typeof value === 'string' && value.trim().length > 0) {
      return value;
    }
  }
  return '';
};

const normalizePhone = (phone?: string) => phone?.replace(/\s+/g, '') ?? '';

const BoreholeDrillingTemplate: React.FC<BoreholeDrillingTemplateProps> = ({ data, template }) => {
  const { t } = useTranslation();
  const configSections = data?.config_sections || {};

  const colors: Record<string, string> = {
    ...(template?.defaultColors || {}),
    ...(configSections.colors || {})
  };

  const font = configSections.font || template?.defaultFont || 'Poppins, sans-serif';

  const header = configSections.header && Object.keys(configSections.header).length > 0
    ? configSections.header
    : template?.defaultData?.header || {};

  const about = configSections.about && Object.keys(configSections.about).length > 0
    ? configSections.about
    : template?.defaultData?.about || {};

  const services = Array.isArray(configSections.services?.service_list)
    ? configSections.services.service_list
    : template?.defaultData?.services?.service_list || [];

  const packages = Array.isArray(configSections.packages?.package_list)
    ? configSections.packages.package_list
    : template?.defaultData?.packages?.package_list || [];

  const whyChooseUs = Array.isArray(configSections.why_choose_us?.reasons)
    ? configSections.why_choose_us.reasons
    : template?.defaultData?.why_choose_us?.reasons || [];

  const testimonials = Array.isArray(configSections.testimonials?.reviews)
    ? configSections.testimonials.reviews
    : template?.defaultData?.testimonials?.reviews || [];

  const gallery = Array.isArray(configSections.gallery?.images)
    ? configSections.gallery.images
    : template?.defaultData?.gallery?.images || [];

  const contact = configSections.contact && Object.keys(configSections.contact).length > 0
    ? configSections.contact
    : template?.defaultData?.contact || {};

  const contactForm = configSections.contact_form && Object.keys(configSections.contact_form).length > 0
    ? configSections.contact_form
    : template?.defaultData?.contact_form || {};

  const faqItems = Array.isArray(configSections.faq?.items)
    ? configSections.faq.items
    : template?.defaultData?.faq?.items || [];

  const socialLinks = Array.isArray(configSections.social?.social_links)
    ? configSections.social.social_links
    : template?.defaultData?.social?.social_links || [];

  const featuredContacts = Array.isArray(configSections.social?.featured_contacts)
    ? configSections.social.featured_contacts
    : template?.defaultData?.social?.featured_contacts || [];

  const footer = configSections.footer && Object.keys(configSections.footer).length > 0
    ? configSections.footer
    : template?.defaultData?.footer || {};

  const copyright = configSections.copyright?.text
    || template?.defaultData?.copyright?.text
    || '© ' + new Date().getFullYear() + ' Mvura Borehole Drilling Services | All Rights Reserved';

  const rawHeaderWhatsApp = header.whatsapp && typeof header.whatsapp === 'object' ? header.whatsapp : {};
  const contactWhatsApp = pickFirstString(
    typeof contact?.whatsapp === 'string' ? contact.whatsapp : undefined,
    contact?.whatsapp?.phone_number
  );

  const whatsappConfig = {
    ...(template?.defaultData?.whatsapp || {}),
    ...(configSections.whatsapp || {}),
    ...rawHeaderWhatsApp,
    phone_number: normalizePhone(
      pickFirstString(
        header.whatsapp_phone_number,
        rawHeaderWhatsApp.phone_number,
        configSections.whatsapp_phone_number,
        (configSections.whatsapp || {}).phone_number,
        contactWhatsApp,
        (template?.defaultData?.whatsapp || {}).phone_number
      )
    ),
    button_label: pickFirstString(
      header.whatsapp_button_label,
      configSections.whatsapp_button_label,
      rawHeaderWhatsApp.button_label,
      (configSections.whatsapp || {}).button_label,
      (template?.defaultData?.whatsapp || {}).button_label,
      contact?.call_to_action
    ),
    prefilled_message: pickFirstString(
      header.whatsapp_prefilled_message,
      configSections.whatsapp_prefilled_message,
      rawHeaderWhatsApp.prefilled_message,
      (configSections.whatsapp || {}).prefilled_message,
      (template?.defaultData?.whatsapp || {}).prefilled_message
    )
  };

  const backgroundStyle = {
    fontFamily: font,
    backgroundColor: colors.background || '#F1FAFF',
    color: colors.text || '#082F49'
  };

  const heroBackground = header.background_image
    ? {
        backgroundImage: `linear-gradient(rgba(8, 47, 73, ${header.overlay_opacity ?? 0.55}), rgba(8, 47, 73, ${header.overlay_opacity ?? 0.55})), url(${header.background_image})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      }
    : {
        background: `linear-gradient(120deg, ${colors.primary || '#0B4F6C'}, ${colors.secondary || '#145DA0'})`
      };

  const badgeLogoUrl = header.badge_logo ? ensureHttpUrl(header.badge_logo) : '';

  const handleCall = (phone?: string) => {
    if (!phone) return;
    window.open(`tel:${normalizePhone(phone)}`, '_self');
  };

  const handleWhatsApp = (phone?: string, message?: string) => {
    if (!phone) return;
    const digits = normalizePhone(phone);
    const base = `https://wa.me/${digits.replace(/^\+/, '')}`;
    const encodedMessage = message ? `?text=${encodeURIComponent(message)}` : '';
    window.open(`${base}${encodedMessage}`, '_blank', 'noopener,noreferrer');
  };

  const renderSectionHeading = (title: string, kicker?: string) => (
    <div className="mb-6 text-center">
      {kicker && (
        <p
          className="text-sm font-semibold uppercase tracking-[0.4em] mb-2"
          style={{ color: colors.secondary || '#39A0CA' }}
        >
          {kicker}
        </p>
      )}
      <h2 className="text-3xl font-semibold" style={{ color: colors.primary || '#0B4F6C' }}>
        {title}
      </h2>
      <div className="mt-3 flex justify-center">
        <span className="inline-flex h-1 w-16 rounded-full" style={{ backgroundColor: colors.accent || '#2EC4B6' }} />
      </div>
    </div>
  );

  return (
    <div className="w-full" style={backgroundStyle}>
      {/* Hero Section */}
      <section className="relative overflow-hidden" style={heroBackground}>
        <div className="absolute inset-0 opacity-10">
          <svg width="100%" height="100%" viewBox="0 0 400 400" className="fill-current" style={{ color: colors.accent || '#2EC4B6' }}>
            <defs>
              <pattern id="waterRipples" x="0" y="0" width="200" height="200" patternUnits="userSpaceOnUse">
                <path
                  d="M100 50c-27.6 0-50 22.4-50 50s22.4 50 50 50 50-22.4 50-50S127.6 50 100 50zm0-50C44.8 0 0 44.8 0 100s44.8 100 100 100 100-44.8 100-100S155.2 0 100 0z"
                  opacity="0.3"
                />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#waterRipples)" />
          </svg>
        </div>

        <div className="relative px-6 py-16 sm:px-10 md:px-16 lg:px-24">
          <div className="mx-auto w-full text-white">
            <div className="flex flex-col gap-6">
              <div className="inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-1 text-xs uppercase tracking-[0.3em]">
                {badgeLogoUrl ? (
                  <span className="flex h-6 w-6 items-center justify-center overflow-hidden rounded-full bg-white/90 p-1">
                    <img src={badgeLogoUrl} alt={header.company_name || t('Company logo')} className="h-full w-full object-contain" />
                  </span>
                ) : (
                  <Waves className="h-4 w-4" />
                )}
                {t('Water Confidence')}
              </div>

              <div className="space-y-5">
                {header.company_name && (
                  <p className="text-sm font-semibold uppercase tracking-[0.4em] text-white/80">
                    {header.company_name}
                  </p>
                )}
                <h1
                  className="text-4xl font-semibold leading-tight tracking-tight"
                  style={{ textShadow: '0 20px 40px rgba(0,0,0,0.25)' }}
                >
                  {header.headline || t('Get Reliable Borehole Drilling Services in Zimbabwe — Guaranteed Water Access!')}
                </h1>
                <p className="text-base leading-relaxed text-white/85">
                  {header.subheadline || t('Professional, affordable, and fast borehole drilling for homes, farms, and businesses.')}
                </p>
                {header.trust_tag && (
                  <div className="inline-flex items-center gap-2 rounded-full bg-white/20 px-4 py-2 text-sm font-medium">
                    <ShieldCheck className="h-4 w-4" />
                    {header.trust_tag}
                  </div>
                )}
              </div>

              <div className="flex flex-col gap-4">
                {header.cta_button?.label && header.cta_button?.url && (
                  <Button
                    size="lg"
                    className="w-full"
                    style={{
                      backgroundColor: colors.accent || '#2EC4B6',
                      color: colors.buttonText || '#FFFFFF',
                      boxShadow: '0 18px 40px -12px rgba(46,196,182,0.65)'
                    }}
                    onClick={createAnchorHandler(header.cta_button.url)}
                  >
                    {header.cta_button.label}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                )}
                {header.secondary_cta?.label && header.secondary_cta?.url && (
                  <Button
                    size="lg"
                    variant="outline"
                    className="w-full border-white/40 bg-white/10 text-white hover:bg-white/20"
                    style={{ borderRadius: '999px' }}
                    onClick={createAnchorHandler(header.secondary_cta.url)}
                  >
                    {header.secondary_cta.label}
                  </Button>
                )}
                {whatsappConfig?.phone_number && (
                  <Button
                    size="lg"
                    className="w-full bg-[#25D366] text-white hover:bg-[#1EBE5C]"
                    style={{ borderRadius: '999px' }}
                    onClick={() => handleWhatsApp(whatsappConfig.phone_number, whatsappConfig.prefilled_message)}
                  >
                    <MessageCircle className="mr-2 h-4 w-4" />
                    {whatsappConfig.button_label || t('Chat on WhatsApp')}
                  </Button>
                )}
              </div>

              {header.highlight_stats && Array.isArray(header.highlight_stats) && header.highlight_stats.length > 0 && (
                <div className="flex flex-col gap-3">
                  {header.highlight_stats.map((stat: any, idx: number) => (
                    <div
                      key={idx}
                      className="rounded-2xl border bg-white/15 p-4 text-sm backdrop-blur"
                      style={{ borderColor: 'rgba(255,255,255,0.35)' }}
                    >
                      <p className="text-2xl font-semibold text-white">{stat.value}</p>
                      <p className="text-white/80 tracking-wide">{stat.label}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="px-6 py-14 sm:px-10 md:px-16 lg:px-24" style={{ background: '#F5FBFF' }}>
        <div
          className="mx-auto flex w-full flex-col gap-10 rounded-3xl border p-8"
          style={{
            borderColor: colors.borderColor || '#B3E5FC',
            backgroundColor: '#FFFFFF',
            boxShadow: '0 28px 55px -35px rgba(8, 47, 73, 0.55)'
          }}
        >
          <div className="space-y-4">
            {renderSectionHeading(about.heading || t('About Mvura Borehole Drilling Services'))}
            <p
              className="text-base"
              style={{ color: colors.text || '#082F49', lineHeight: '1.75' }}
            >
              {about.description}
            </p>
          </div>

          {Array.isArray(about.highlights) && about.highlights.length > 0 && (
            <div className="flex flex-col gap-4">
              {about.highlights.map((highlight: any, idx: number) => (
                <div
                  key={idx}
                  className="flex gap-4 rounded-2xl border p-5"
                  style={{
                    borderColor: colors.borderColor || '#D3ECFF',
                    backgroundColor: '#F9FCFF'
                  }}
                >
                  <div className="mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-full" style={{ backgroundColor: (colors.accent || '#2EC4B6') + '1A' }}>
                    <CheckCircle2 className="h-5 w-5" style={{ color: colors.accent || '#2EC4B6' }} />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold" style={{ color: colors.primary || '#0B4F6C' }}>
                      {highlight.title}
                    </h3>
                    <p className="text-sm" style={{ color: colors.text || '#082F49', lineHeight: '1.7' }}>
                      {highlight.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Services Section */}
      {services.length > 0 && (
        <section id="services" className="px-6 py-14 sm:px-10 md:px-16 lg:px-24" style={{ background: '#F6FCFF' }}>
          <div className="mx-auto w-full">
            {renderSectionHeading(configSections.services?.heading || t('Our Borehole Drilling Services Include:'), configSections.services?.kicker)}
            <div className="flex flex-col gap-6">
              {services.map((service: any, idx: number) => (
                <div
                  key={idx}
                  className="flex h-full flex-col rounded-3xl border bg-white p-6 shadow-[0_18px_32px_-24px_rgba(11,79,108,0.55)]"
                  style={{ borderColor: colors.borderColor || '#D7EBFF' }}
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full" style={{ backgroundColor: (colors.accent || '#2EC4B6') + '20' }}>
                      <Droplet className="h-6 w-6" style={{ color: colors.accent || '#2EC4B6' }} />
                    </div>
                    <h3 className="text-xl font-semibold" style={{ color: colors.primary || '#0B4F6C' }}>{service.title}</h3>
                  </div>
                  {service.description && (
                    <p className="mt-3 text-sm" style={{ color: colors.text || '#082F49', lineHeight: '1.7' }}>
                      {service.description}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Packages Section */}
      {packages.length > 0 && (
        <section id="packages" className="px-6 py-16 sm:px-10 md:px-16 lg:px-24" style={{ background: '#EEF6FF' }}>
          <div className="mx-auto w-full">
            {renderSectionHeading(configSections.packages?.heading || t('Choose the Package That Fits You Best'))}
            <div className="flex flex-col gap-6">
              {packages.map((pkg: any, idx: number) => (
                <div
                  key={idx}
                  className="relative flex h-full flex-col rounded-3xl border bg-white p-6 shadow-[0_22px_40px_-30px_rgba(8,47,73,0.6)]"
                  style={{ borderColor: colors.borderColor || '#B3E5FC' }}
                >
                  <div className="flex items-center justify-between">
                    <h3 className="text-xl font-semibold" style={{ color: colors.primary || '#0B4F6C' }}>
                      {pkg.name}
                    </h3>
                    <Badge className="bg-[rgba(57,160,202,0.12)] text-[rgba(57,160,202,1)]">
                      {pkg.audience}
                    </Badge>
                  </div>
                  {pkg.includes && (
                    <ul className="mt-4 space-y-2 text-sm" style={{ color: colors.text || '#082F49', lineHeight: '1.65' }}>
                      {pkg.includes
                        .split('\n')
                        .filter(Boolean)
                        .map((item: string, lineIdx: number) => (
                          <li key={lineIdx} className="flex items-start gap-2">
                            <span className="mt-1">
                              <Droplet className="h-4 w-4" style={{ color: colors.secondary || '#145DA0' }} />
                            </span>
                            <span>{item}</span>
                          </li>
                        ))}
                    </ul>
                  )}
                  {pkg.price && (
                    <p className="mt-6 text-lg font-semibold" style={{ color: colors.primary || '#0B4F6C' }}>
                      {pkg.price}
                    </p>
                  )}
                  {pkg.cta_label && (
                    <Button
                      className="mt-6"
                      style={{ backgroundColor: colors.primary || '#0B4F6C', color: colors.buttonText || '#FFFFFF', borderRadius: '999px' }}
                      onClick={createAnchorHandler(pkg.cta_anchor || pkg.cta_url || '#quote-request')}
                    >
                      {pkg.cta_label}
                      <ChevronRight className="ml-2 h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Why Choose Us */}
      {whyChooseUs.length > 0 && (
        <section className="px-6 py-14 sm:px-10 md:px-16 lg:px-24" style={{ background: '#0B4F6C', color: '#FFFFFF' }}>
          <div className="mx-auto w-full">
            {renderSectionHeading(configSections.why_choose_us?.heading || t('Why Zimbabweans Choose Mvura Borehole Drilling Services'), t('Trusted nationwide'))}
            <div className="flex flex-col gap-5">
              {whyChooseUs.map((reason: any, idx: number) => (
                <div key={idx} className="rounded-3xl border border-white/20 bg-white/10 p-6 backdrop-blur">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full border border-white/30">
                      <span className="text-lg">{reason.icon || '✅'}</span>
                    </div>
                    <h3 className="text-lg font-semibold">{reason.title}</h3>
                  </div>
                  <p className="mt-3 text-sm text-white/80">{reason.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Testimonials */}
      {testimonials.length > 0 && (
        <section className="px-6 py-16 sm:px-10 md:px-16 lg:px-24" style={{ background: '#F0FBFF' }}>
          <div className="mx-auto max-w-5xl">
            {renderSectionHeading(configSections.testimonials?.heading || t('What Our Clients Say'))}
            <div className="flex flex-col gap-6">
              {testimonials.map((testimonial: any, idx: number) => (
                <div key={idx} className="rounded-3xl border bg-white p-6 shadow-md" style={{ borderColor: colors.borderColor || '#D7EBFF' }}>
                  <Quote className="mb-3 h-6 w-6" style={{ color: colors.accent || '#2EC4B6' }} />
                  <p className="text-sm" style={{ color: colors.text || '#082F49' }}>
                    {testimonial.quote}
                  </p>
                  <div className="mt-4">
                    <p className="text-sm font-semibold" style={{ color: colors.primary || '#0B4F6C' }}>
                      {testimonial.name}
                    </p>
                    {testimonial.location && (
                      <p className="text-xs" style={{ color: colors.text || '#082F49' }}>
                        {testimonial.location}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Gallery */}
      {gallery.length > 0 && (
        <section className="px-6 py-16 sm:px-10 md:px-16 lg:px-24">
          <div className="mx-auto max-w-5xl">
            {renderSectionHeading(configSections.gallery?.heading || t('Our Recent Projects'))}
            <div className="flex flex-col gap-5">
              {gallery.map((item: any, idx: number) => (
                <div key={idx} className="group relative overflow-hidden rounded-3xl">
                  {item.image ? (
                    <img src={item.image} alt={item.caption || t('Borehole project')} className="h-64 w-full object-cover transition-transform duration-500 group-hover:scale-105" />
                  ) : (
                    <div className="flex h-64 items-center justify-center bg-white/40 text-sm font-medium text-white">
                      {t('Project photo coming soon')}
                    </div>
                  )}
                  {(item.caption || item.description) && (
                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-4 text-white">
                      {item.caption && <p className="text-sm font-semibold">{item.caption}</p>}
                      {item.description && <p className="text-xs text-white/80">{item.description}</p>}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Contact / Quote Request */}
      <section id="quote-request" className="px-6 py-16 sm:px-10 md:px-16 lg:px-24" style={{ background: '#062B57', color: '#FFFFFF' }}>
        <div className="mx-auto flex w-full flex-col gap-10">
          <div className="space-y-6">
            {renderSectionHeading(contact.heading || t('Request a Free Borehole Quote Today'), t('We respond within minutes'))}
            {contact.description && <p className="text-base text-white/80">{contact.description}</p>}
            <div className="space-y-4">
              {contact.phone && (
                <div className="flex items-center gap-3 rounded-2xl border border-white/20 bg-white/10 p-4">
                  <PhoneCall className="h-5 w-5" />
                  <div>
                    <p className="text-xs uppercase tracking-wide text-white/70">{t('Call us')}</p>
                    <button className="text-lg font-semibold text-white hover:underline" onClick={() => handleCall(contact.phone)}>
                      {contact.phone}
                    </button>
                  </div>
                </div>
              )}
              {contact.whatsapp && (
                <div className="flex items-center gap-3 rounded-2xl border border-white/20 bg-white/10 p-4">
                  <MessageCircle className="h-5 w-5" />
                  <div>
                    <p className="text-xs uppercase tracking-wide text-white/70">{t('WhatsApp')}</p>
                    <button className="text-lg font-semibold text-white hover:underline" onClick={() => handleWhatsApp(contact.whatsapp)}>
                      {contact.whatsapp}
                    </button>
                  </div>
                </div>
              )}
              {contact.email && (
                <div className="flex items-center gap-3 rounded-2xl border border-white/20 bg-white/10 p-4">
                  <Mail className="h-5 w-5" />
                  <div>
                    <p className="text-xs uppercase tracking-wide text-white/70">{t('Email')}</p>
                    <a className="text-lg font-semibold text-white hover:underline" href={`mailto:${contact.email}`}>
                      {contact.email}
                    </a>
                  </div>
                </div>
              )}
              {contact.location && (
                <div className="flex items-center gap-3 rounded-2xl border border-white/20 bg-white/10 p-4">
                  <MapPin className="h-5 w-5" />
                  <div>
                    <p className="text-xs uppercase tracking-wide text-white/70">{t('Service Areas')}</p>
                    <p className="text-base text-white">{contact.location}</p>
                  </div>
                </div>
              )}
              {contact.service_hours && (
                <div className="flex items-center gap-3 rounded-2xl border border-white/20 bg-white/10 p-4">
                  <Clock className="h-5 w-5" />
                  <div>
                    <p className="text-xs uppercase tracking-wide text-white/70">{t('Hours')}</p>
                    <p className="text-base text-white">{contact.service_hours}</p>
                  </div>
                </div>
              )}
              {contact.call_to_action && (
                <p className="text-sm text-white/80">{contact.call_to_action}</p>
              )}
              {contact.hotline_label && contact.hotline_value && (
                <div className="rounded-2xl border border-white/30 bg-white/10 p-4 text-sm text-white/80">
                  <p className="font-semibold text-white">{contact.hotline_label}</p>
                  <p>{contact.hotline_value}</p>
                </div>
              )}
            </div>

            {featuredContacts.length > 0 && (
              <div className="flex flex-col gap-3">
                {featuredContacts.map((chip: any, idx: number) => (
                  <div key={idx} className="flex items-center gap-3 rounded-full border border-white/20 bg-white/10 px-4 py-3 text-sm text-white/80">
                    <span>{chip.icon || '💧'}</span>
                    <div>
                      <p className="text-xs uppercase tracking-wide text-white/70">{chip.label}</p>
                      <p className="text-sm text-white">{chip.value}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="rounded-3xl border border-white/20 bg-white/95 p-8 text-[#082F49] shadow-2xl">
            <h3 className="text-2xl font-semibold" style={{ color: colors.primary || '#0B4F6C' }}>
              {contactForm.form_title || t('Get My Free Quote')}
            </h3>
            {contactForm.form_description && (
              <p className="mt-2 text-sm" style={{ color: colors.text || '#082F49' }}>
                {contactForm.form_description}
              </p>
            )}
            <form className="mt-6 space-y-4">
              {Array.isArray(contactForm.form_fields) && contactForm.form_fields.map((field: any, idx: number) => (
                <div key={idx} className="flex flex-col gap-1">
                  <label className="text-sm font-medium" htmlFor={field.field_name}>
                    {field.field_label}
                    {field.required && <span className="ml-1 text-[#E63946]">*</span>}
                  </label>
                  {field.type === 'select' ? (
                    <select
                      id={field.field_name}
                      name={field.field_name}
                      className="rounded-xl border px-3 py-2 text-sm outline-none transition focus:border-[#2EC4B6] focus:ring-2 focus:ring-[#2EC4B6]/40"
                      defaultValue=""
                    >
                      <option value="" disabled>
                        {field.placeholder || t('Select an option')}
                      </option>
                      {(field.options || '').split(',').filter(Boolean).map((option: string, optionIdx: number) => (
                        <option key={optionIdx} value={option.trim()}>
                          {option.trim()}
                        </option>
                      ))}
                    </select>
                  ) : field.type === 'textarea' ? (
                    <textarea
                      id={field.field_name}
                      name={field.field_name}
                      rows={3}
                      placeholder={field.placeholder}
                      className="rounded-xl border px-3 py-2 text-sm outline-none transition focus:border-[#2EC4B6] focus:ring-2 focus:ring-[#2EC4B6]/40"
                    />
                  ) : (
                    <input
                      id={field.field_name}
                      name={field.field_name}
                      type={field.type || 'text'}
                      placeholder={field.placeholder}
                      required={field.required}
                      className="rounded-xl border px-3 py-2 text-sm outline-none transition focus:border-[#2EC4B6] focus:ring-2 focus:ring-[#2EC4B6]/40"
                    />
                  )}
                </div>
              ))}
              <Button
                type="button"
                className="w-full"
                style={{ backgroundColor: colors.accent || '#2EC4B6', color: colors.buttonText || '#FFFFFF', borderRadius: '999px' }}
              >
                {contactForm.submit_label || t('Get My Free Quote')}
              </Button>
              {contactForm.disclaimer && (
                <p className="text-xs text-[#082F49]/70">{contactForm.disclaimer}</p>
              )}
              {contactForm.alternate_contact_label && contactForm.alternate_contact_value && (
                <p className="text-xs font-semibold text-[#082F49]">
                  {contactForm.alternate_contact_label}{' '}
                  <span className="font-normal">{contactForm.alternate_contact_value}</span>
                </p>
              )}
            </form>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      {faqItems.length > 0 && (
        <section className="px-6 py-16 sm:px-10 md:px-16 lg:px-24" style={{ background: '#F6FCFF' }}>
          <div className="mx-auto w-full">
            {renderSectionHeading(configSections.faq?.heading || t('Frequently Asked Questions'))}
            <div className="space-y-4">
              {faqItems.map((item: any, idx: number) => (
                <details key={idx} className="group rounded-2xl border bg-white p-6" style={{ borderColor: colors.borderColor || '#D7EBFF' }}>
                  <summary className="flex cursor-pointer items-center justify-between text-lg font-semibold" style={{ color: colors.primary || '#0B4F6C' }}>
                    {item.question}
                    <span className="ml-3 flex h-8 w-8 items-center justify-center rounded-full border transition group-open:rotate-90" style={{ borderColor: colors.borderColor || '#D7EBFF' }}>
                      <ChevronRight className="h-5 w-5" />
                    </span>
                  </summary>
                  <p className="mt-3 text-sm" style={{ color: colors.text || '#082F49' }}>{item.answer}</p>
                </details>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Social Section */}
      {(socialLinks.length > 0 || featuredContacts.length > 0) && (
        <section className="px-6 py-14 sm:px-10 md:px-16 lg:px-24">
          <div className="mx-auto w-full flex-col gap-8 rounded-3xl border bg-white p-8 shadow-xl" style={{ borderColor: colors.borderColor || '#C2E8FD' }}>
            <div className="space-y-4">
              {renderSectionHeading(t('Connect With Us'))}
              <div className="flex flex-col gap-4">
                {socialLinks.map((link: any, idx: number) => (
                  <a
                    key={idx}
                    href={ensureHttpUrl(link.url)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-center justify-between rounded-2xl border px-4 py-3 text-sm transition hover:shadow-md"
                    style={{ borderColor: colors.borderColor || '#C2E8FD', color: colors.primary || '#0B4F6C' }}
                  >
                    <span className="font-medium">{link.platform?.toUpperCase() || t('Social')}</span>
                    <ChevronRight className="h-4 w-4 transition group-hover:translate-x-1" />
                  </a>
                ))}
              </div>
            </div>
            {featuredContacts.length > 0 && (
              <div className="flex flex-col gap-3">
                {featuredContacts.map((chip: any, idx: number) => (
                  <div key={idx} className="flex items-center gap-3 rounded-2xl border px-4 py-3 text-sm" style={{ borderColor: colors.borderColor || '#C2E8FD' }}>
                    <span className="text-lg">{chip.icon || '💧'}</span>
                    <div>
                      <p className="text-xs uppercase tracking-wide" style={{ color: colors.secondary || '#145DA0' }}>{chip.label}</p>
                      <p className="text-sm" style={{ color: colors.text || '#082F49' }}>{chip.value}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      )}

      {/* Footer */}
      <footer className="px-6 pb-10 pt-14 sm:px-10 md:px-16 lg:px-24" style={{ background: '#04182F', color: '#FFFFFF' }}>
        <div className="mx-auto w-full space-y-8">
          <div className="flex flex-col gap-6">
            <div className="max-w-lg space-y-3">
              <h3 className="text-2xl font-semibold">{footer.company_name || t('Mvura Borehole Drilling Services')}</h3>
              {footer.tagline && <p className="text-sm text-white/80">{footer.tagline}</p>}
            </div>
            {Array.isArray(footer.quick_links) && footer.quick_links.length > 0 && (
              <div className="flex flex-col gap-3 text-sm text-white/80">
                {footer.quick_links.map((link: any, idx: number) => (
                  <button
                    key={idx}
                    className="text-left hover:text-white"
                    onClick={createAnchorHandler(link.url)}
                  >
                    {link.label}
                  </button>
                ))}
              </div>
            )}
          </div>
          <div className="flex flex-col gap-3 border-t border-white/10 pt-6 text-xs text-white/60">
            <p>{footer.legal_line || copyright}</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default BoreholeDrillingTemplate;
