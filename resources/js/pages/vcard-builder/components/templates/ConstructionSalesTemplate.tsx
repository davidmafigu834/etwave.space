import React from 'react';
import { handleAppointmentBooking } from '../VCardPreview';
import StableHtmlContent from '@/components/StableHtmlContent';
import { ensureRequiredSections } from '@/utils/ensureRequiredSections';
import { getBusinessTemplate } from '@/pages/vcard-builder/business-templates';
import { getFilteredSectionOrder } from '@/utils/sectionHelpers';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, Check, ChevronRight, Download, Mail, MapPin, Phone, Star } from 'lucide-react';
import DOMPurify from 'dompurify';
import SocialIcon from '@/pages/link-bio-builder/components/SocialIcon';
const sanitizePhone = (value: any) => {
  if (!value) return '';
  const raw = String(value);
  const cleaned = raw.replace(/[^+\d]/g, '');
  return cleaned.startsWith('+') ? cleaned : cleaned.replace(/^0+/, '') || cleaned;
};

const sanitizeEmail = (value: any) => {
  if (!value) return '';
  return String(value).trim();
};

const sanitizeSocialUrl = (value: any) => {
  if (!value) return '';
  const raw = String(value).trim();
  const cleaned = DOMPurify.sanitize(raw, { ALLOWED_TAGS: [], ALLOWED_ATTR: [] });
  return cleaned;
};

interface ConstructionSalesTemplateProps {
  data: any;
  template: any;
}

const ConstructionSalesTemplate: React.FC<ConstructionSalesTemplateProps> = ({ data, template }) => {
  const templateDefaults = template?.defaultData || {};
  const catalogSections = data.catalog_sections || {};
  const configSections = ensureRequiredSections(data.config_sections || {}, templateDefaults);
  const serviceHighlightsSection = (catalogSections.service_highlights ?? configSections.service_highlights) || {};
  const packagesSection = (catalogSections.packages ?? configSections.packages) || {};
  const colors = configSections.colors || template?.defaultColors || {
    primary: '#1E3A8A',
    secondary: '#2563EB',
    accent: '#EFF6FF',
    background: '#F8FAFC',
    text: '#0F172A',
    cardBg: '#FFFFFF',
    borderColor: '#E2E8F0',
    buttonText: '#FFFFFF'
  };
  const font = configSections.font || template?.defaultFont || 'Poppins, sans-serif';
  const sections = React.useMemo(() => getBusinessTemplate('construction-sales')?.sections || [], []);
  const previewData = React.useMemo(() => ({ ...data, template_config: data.template_config || {}, config_sections: configSections }), [data, configSections]);
  const orderedSectionKeys = React.useMemo(() => getFilteredSectionOrder(previewData, sections), [previewData, sections]);

  if (process.env.NODE_ENV !== 'production') {
    // eslint-disable-next-line no-console
    console.log('[ConstructionSalesTemplate] packages', packagesSection);
    // eslint-disable-next-line no-console
    console.log('[ConstructionSalesTemplate] services', serviceHighlightsSection);
  }

  const renderHero = (heroData: any) => {
    if (!heroData) return null;
    return (
      <section
        id="hero"
        className="relative flex flex-col justify-center text-white"
        style={{
          backgroundColor: colors.primary,
          fontFamily: font
        }}
      >
        <div className="absolute inset-0 opacity-40">
          {heroData.background_media && (
            <img
              src={heroData.background_media}
              alt={heroData.headline || data.name}
              className="h-full w-full object-cover"
            />
          )}
        </div>
        <div className="relative z-10 px-6 py-12 space-y-6">
          <div className="space-y-3">
            {heroData.metrics?.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {heroData.metrics.map((metric: any, index: number) => (
                  <Badge
                    key={index}
                    className="flex items-center gap-2 bg-white/10 text-white border-white/30"
                  >
                    <span className="font-semibold">{metric.value}</span>
                    <span className="text-xs uppercase tracking-wide">{metric.label}</span>
                  </Badge>
                ))}
              </div>
            )}
            <h1 className="text-3xl font-bold md:text-4xl">
              {heroData.headline || data.name}
            </h1>
            {heroData.subheadline && (
              <p className="text-base md:text-lg text-white/90 max-w-2xl">
                {heroData.subheadline}
              </p>
            )}
          </div>
          <div className="flex flex-wrap gap-3">
            {heroData.primary_cta_label && (
              <Button
                onClick={() => heroData.primary_cta_link && window.open(heroData.primary_cta_link, '_blank')}
                className="rounded-full px-6"
                style={{ backgroundColor: colors.secondary, color: colors.buttonText, borderColor: colors.secondary }}
              >
                {heroData.primary_cta_label}
                <ChevronRight className="ml-1 h-4 w-4" />
              </Button>
            )}
            {heroData.secondary_cta_label && (
              <Button
                variant="outline"
                onClick={() => heroData.secondary_cta_link && window.open(heroData.secondary_cta_link, '_blank')}
                className="rounded-full px-6"
                style={{
                  color: colors.primary,
                  borderColor: colors.primary,
                  backgroundColor: 'transparent',
                  '--tw-ring-color': colors.primary,
                  '--tw-ring-offset-color': colors.background
                }}
              >
                {heroData.secondary_cta_label}
              </Button>
            )}
          </div>
          {heroData.trust_badges?.length > 0 && (
            <div className="flex flex-wrap gap-4 pt-2">
              {heroData.trust_badges.map((badge: any, index: number) => (
                <div key={index} className="flex items-center gap-2 text-sm text-white/90">
                  <span className="text-lg" aria-hidden>{badge.icon}</span>
                  <span>{badge.label}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    );
  };

  const renderCatalogInstruction = (title: string, description: string) => (
    <section className="px-6 py-12" style={{ backgroundColor: colors.background }}>
      <div className="mx-auto max-w-3xl rounded-3xl border border-dashed border-gray-300 bg-white/70 p-6 text-center shadow-sm" style={{ fontFamily: font }}>
        <h2 className="text-xl font-semibold" style={{ color: colors.text }}>{title}</h2>
        <p className="mt-2 text-sm" style={{ color: colors.text + 'B3' }}>{description}</p>
        <p className="mt-4 text-xs uppercase tracking-wide" style={{ color: colors.text + '66' }}>
          Manage this section from Services &amp; Packages in the vCard Builder.
        </p>
      </div>
    </section>
  );

  const renderServiceHighlights = (serviceData: any) => {
    const services = serviceData?.services ?? [];
    const hasCatalogContent = Boolean(serviceData?.managed_by_catalog && services.length > 0 && services.some((item: any) => !item?.meta?.placeholder));

    if (!hasCatalogContent) {
      return renderCatalogInstruction(
        serviceData?.heading || 'Services managed in catalog',
        'Add services in the Services & Packages manager to see them here.'
      );
    }

    return (
      <section id="services" className="px-6 py-12" style={{ backgroundColor: colors.background }}>
        <div className="max-w-5xl mx-auto space-y-8" style={{ fontFamily: font }}>
          <div className="space-y-2">
            <h2 className="text-2xl font-bold" style={{ color: colors.text }}>{serviceData.heading}</h2>
            {serviceData.subheading && (
              <p className="text-base text-gray-600" style={{ color: colors.text + 'B3' }}>
                {serviceData.subheading}
              </p>
            )}
          </div>
          <div className="grid grid-cols-1 gap-4">
            {services.filter((service: any) => service && !service.meta?.placeholder).map((service: any, index: number) => (
              <div
                key={index}
                className="rounded-2xl p-5 shadow-sm"
                style={{ backgroundColor: colors.cardBg, border: `1px solid ${colors.borderColor}` }}
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full text-xl" style={{ backgroundColor: colors.accent }}>
                    {service.icon}
                  </div>
                  <div>
                    <h3 className="font-semibold" style={{ color: colors.text }}>{service.title}</h3>
                    <p className="text-sm" style={{ color: colors.text + 'B3' }}>{service.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          {serviceData.cta_label && (
            <Button
              className="rounded-full px-6"
              style={{ backgroundColor: colors.primary, color: colors.buttonText, borderColor: colors.primary }}
              onClick={() => serviceData.cta_link && window.open(serviceData.cta_link, '_blank')}
            >
              {serviceData.cta_label}
            </Button>
          )}
        </div>
      </section>
    );
  };

  const renderWhyChooseUs = (whyData: any) => {
    if (!whyData?.points?.length) return null;
    return (
      <section className="px-6 py-12" style={{ backgroundColor: colors.cardBg }}>
        <div className="max-w-5xl mx-auto space-y-8" style={{ fontFamily: font }}>
          <div className="grid gap-10">
            <div className="space-y-4">
              <h2 className="text-2xl font-bold" style={{ color: colors.text }}>{whyData.heading}</h2>
              {whyData.subheading && (
                <p className="text-base" style={{ color: colors.text + 'B3' }}>{whyData.subheading}</p>
              )}
              <div className="space-y-4">
                {whyData.points.map((point: any, index: number) => (
                  <div key={index} className="flex gap-3">
                    <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full text-lg" style={{ backgroundColor: colors.accent, color: colors.primary }}>
                      {point.icon || <Check className="h-5 w-5" />}
                    </div>
                    <div>
                      <h3 className="font-semibold" style={{ color: colors.text }}>{point.title}</h3>
                      <p className="text-sm" style={{ color: colors.text + 'B3' }}>{point.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            {whyData.testimonial_quote && (
              <div
                className="rounded-2xl p-6 shadow-lg"
                style={{ backgroundColor: colors.primary, color: colors.buttonText }}
              >
                <Star className="h-6 w-6" />
                <p className="mt-4 text-lg italic">{whyData.testimonial_quote}</p>
                <div className="mt-4 text-sm opacity-90">
                  <p className="font-semibold">{whyData.testimonial_author}</p>
                  {whyData.testimonial_role && <p>{whyData.testimonial_role}</p>}
                </div>
              </div>
            )}
          </div>
        </div>
      </section>
    );
  };

  const renderAbout = (aboutData: any) => {
    if (!aboutData?.story && !aboutData?.mission) return null;
    return (
      <section id="about" className="px-6 py-12" style={{ backgroundColor: colors.background }}>
        <div className="max-w-5xl mx-auto grid gap-10" style={{ fontFamily: font }}>
          <div className="space-y-4">
            <Badge className="w-fit bg-transparent" style={{ color: colors.primary, border: `1px solid ${colors.primary}` }}>
              {aboutData.experience_years || 'Experienced Team'}
            </Badge>
            <h2 className="text-2xl font-bold" style={{ color: colors.text }}>{aboutData.heading}</h2>
            {aboutData.story && (
              <p className="text-base leading-relaxed" style={{ color: colors.text + 'B3' }}>
                {aboutData.story}
              </p>
            )}
            {aboutData.mission && (
              <div className="rounded-xl p-5" style={{ backgroundColor: colors.cardBg, border: `1px solid ${colors.borderColor}` }}>
                <h3 className="font-semibold" style={{ color: colors.text }}>Our Mission</h3>
                <p className="text-sm" style={{ color: colors.text + 'B3' }}>{aboutData.mission}</p>
              </div>
            )}
          </div>
          <div className="space-y-4">
            {aboutData.team_image && (
              <img
                src={aboutData.team_image}
                alt="Team"
                className="h-64 w-full rounded-2xl object-cover"
              />
            )}
            <div className="rounded-xl border p-6"
              style={{ backgroundColor: colors.accent, borderColor: colors.primary }}
            >
              <h3 className="text-lg font-semibold" style={{ color: colors.primary }}>Schedule a Walkthrough</h3>
              <p className="text-sm mt-1" style={{ color: colors.text + 'B3' }}>
                Book a consultation to review blueprints, budgets, and timelines with our project strategists.
              </p>
              <Button
                onClick={() => handleAppointmentBooking(configSections.appointments)}
                className="mt-3 rounded-full"
                style={{ backgroundColor: colors.primary, color: colors.buttonText, borderColor: colors.primary }}
              >
                Schedule Consultation
              </Button>
            </div>
          </div>
        </div>
      </section>
    );
  };

  const renderProjects = (projectsData: any) => {
    if (!projectsData?.project_list?.length) return null;
    return (
      <section id="featured-projects" className="px-6 py-12" style={{ backgroundColor: colors.cardBg }}>
        <div className="max-w-5xl mx-auto space-y-8" style={{ fontFamily: font }}>
          <div className="space-y-1">
            <h2 className="text-2xl font-bold" style={{ color: colors.text }}>Featured Projects</h2>
            <p className="text-sm" style={{ color: colors.text + 'B3' }}>
              Proof of what happens when craftsmanship, accountability, and technical know-how meet.
            </p>
          </div>
          <div className="grid gap-5">
            {projectsData.project_list.map((project: any, index: number) => (
              <div key={index} className="overflow-hidden rounded-3xl border shadow-sm" style={{ borderColor: colors.borderColor }}>
                {project.image && (
                  <img src={project.image} alt={project.title} className="h-56 w-full object-cover" />
                )}
                <div className="space-y-3 p-6" style={{ backgroundColor: colors.background }}>
                  <div className="flex items-center justify-between">
                    <Badge className="bg-transparent" style={{ color: colors.primary, border: `1px solid ${colors.primary}` }}>
                      {project.category || 'Project'}
                    </Badge>
                    {project.location && (
                      <div className="flex items-center gap-2 text-xs" style={{ color: colors.text + '99' }}>
                        <MapPin className="h-4 w-4" />
                        {project.location}
                      </div>
                    )}
                  </div>
                  <h3 className="text-xl font-semibold" style={{ color: colors.text }}>{project.title}</h3>
                  <p className="text-sm" style={{ color: colors.text + 'B3' }}>{project.description}</p>
                  {project.link_label && (
                    <Button
                      className="rounded-full"
                      variant="outline"
                      onClick={() => project.link && window.open(project.link, '_blank')}
                    >
                      {project.link_label}
                      <ChevronRight className="ml-2 h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  };

  const renderTestimonials = (testimonialsData: any) => {
    if (!testimonialsData?.reviews?.length) return null;
    return (
      <section className="px-6 py-12" style={{ backgroundColor: colors.background }}>
        <div className="max-w-5xl mx-auto space-y-6" style={{ fontFamily: font }}>
          <h2 className="text-2xl font-bold" style={{ color: colors.text }}>{testimonialsData.heading}</h2>
          <div className="grid grid-cols-1 gap-5">
            {testimonialsData.reviews.map((review: any, index: number) => (
              <div key={index} className="rounded-2xl border p-6 shadow-sm" style={{ borderColor: colors.borderColor }}>
                <div className="flex gap-2 text-amber-500">
                  {Array.from({ length: Number(review.rating) || 5 }).map((_, starIndex) => (
                    <Star key={starIndex} className="h-4 w-4 fill-current" />
                  ))}
                </div>
                <p className="mt-3 text-sm italic" style={{ color: colors.text + 'CC' }}>
                  “{review.quote}”
                </p>
                <div className="mt-4">
                  <p className="font-semibold" style={{ color: colors.text }}>{review.client_name}</p>
                  {review.project_type && (
                    <p className="text-xs" style={{ color: colors.text + '99' }}>{review.project_type}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  };

  const renderProcess = (processData: any) => {
    if (!processData?.steps?.length) return null;
    return (
      <section className="px-6 py-12" style={{ backgroundColor: colors.cardBg }}>
        <div className="max-w-5xl mx-auto space-y-8" style={{ fontFamily: font }}>
          <div className="space-y-1">
            <h2 className="text-2xl font-bold" style={{ color: colors.text }}>{processData.heading}</h2>
            {processData.subheading && (
              <p className="text-sm" style={{ color: colors.text + 'B3' }}>{processData.subheading}</p>
            )}
          </div>
          <div className="grid grid-cols-1 gap-4">
            {processData.steps.map((step: any, index: number) => (
              <div
                key={index}
                className="rounded-2xl p-5 text-center"
                style={{ backgroundColor: colors.background, border: `1px solid ${colors.borderColor}` }}
              >
                <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full text-lg font-bold" style={{ backgroundColor: colors.accent, color: colors.primary }}>
                  {step.icon || index + 1}
                </div>
                <h3 className="font-semibold" style={{ color: colors.text }}>{step.title}</h3>
                <p className="mt-2 text-sm" style={{ color: colors.text + 'B3' }}>{step.description}</p>
              </div>
            ))}
          </div>
          {processData.cta_label && (
            <Button
              className="rounded-full px-6"
              style={{ backgroundColor: colors.primary, color: colors.buttonText, borderColor: colors.primary }}
              onClick={() => processData.cta_link && window.open(processData.cta_link, '_blank')}
            >
              {processData.cta_label}
            </Button>
          )}
        </div>
      </section>
    );
  };

  const renderPackages = (packagesData: any) => {
    const packageList = packagesData?.package_list ?? [];
    const hasCatalogContent = Boolean(
      packagesData?.managed_by_catalog &&
        packageList.length > 0 &&
        packageList.some((pkg: any) => !pkg?.meta?.placeholder)
    );

    if (!hasCatalogContent) {
      return renderCatalogInstruction(
        packagesData?.heading || 'Packages managed in catalog',
        'Add packages in the Services & Packages manager to see them here.'
      );
    }

    return (
      <section className="px-6 py-12" style={{ backgroundColor: colors.background }}>
        <div className="max-w-5xl mx-auto space-y-8" style={{ fontFamily: font }}>
          <div className="space-y-2 text-center">
            <h2 className="text-2xl font-bold" style={{ color: colors.text }}>{packagesData.heading}</h2>
            {packagesData.subheading && (
              <p className="text-sm" style={{ color: colors.text + 'B3' }}>{packagesData.subheading}</p>
            )}
          </div>
          <div className="grid grid-cols-1 gap-6">
            {packageList.filter((pkg: any) => pkg && !pkg.meta?.placeholder).map((pkg: any, index: number) => (
              <div key={index} className="rounded-3xl border p-6 text-left shadow-sm" style={{ borderColor: colors.borderColor }}>
                <Badge className="mb-4" style={{ backgroundColor: colors.accent, color: colors.primary }}>
                  {pkg.name}
                </Badge>
                <h3 className="text-lg font-semibold" style={{ color: colors.text }}>{pkg.description}</h3>
                <p className="mt-2 text-sm font-medium" style={{ color: colors.primary }}>{pkg.price}</p>
                {pkg.timeline && (
                  <p className="text-xs uppercase tracking-wide" style={{ color: colors.text + '99' }}>Timeline: {pkg.timeline}</p>
                )}
                {pkg.features && (
                  <ul className="mt-3 space-y-2 text-sm" style={{ color: colors.text + 'CC' }}>
                    {pkg.features.split('\n').map((feature: string, featureIndex: number) => (
                      <li key={featureIndex} className="flex items-start gap-2">
                        <Check className="mt-0.5 h-4 w-4 text-emerald-500" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                )}
                {pkg.cta_label && (
                  <Button
                    className="mt-5 w-full rounded-full"
                    style={{ backgroundColor: colors.primary, color: colors.buttonText, borderColor: colors.primary }}
                    onClick={() => pkg.cta_link && window.open(pkg.cta_link, '_blank')}
                  >
                    {pkg.cta_label}
                  </Button>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  };

  const renderCtaBanner = (ctaData: any) => {
    if (!ctaData?.heading) return null;
    return (
      <section className="px-6 py-12" style={{ backgroundColor: colors.primary }}>
        <div className="max-w-4xl mx-auto text-center space-y-4" style={{ fontFamily: font }}>
          <h2 className="text-3xl font-bold" style={{ color: colors.buttonText }}>{ctaData.heading}</h2>
          {ctaData.subheading && (
            <p className="text-base text-white/80">{ctaData.subheading}</p>
          )}
          <div className="flex flex-wrap justify-center gap-3">
            {ctaData.primary_label && (
              <Button
                className="rounded-full px-6"
                style={{ backgroundColor: colors.secondary, color: colors.buttonText, borderColor: colors.secondary }}
                onClick={() => ctaData.primary_link && window.open(ctaData.primary_link, '_blank')}
              >
                {ctaData.primary_label}
              </Button>
            )}
            {ctaData.secondary_label && (
              <Button
                variant="outline"
                className="rounded-full px-6"
                onClick={() => ctaData.secondary_link && window.open(ctaData.secondary_link, '_blank')}
                style={{
                  color: colors.primary,
                  borderColor: colors.primary,
                  backgroundColor: 'transparent',
                  '--tw-ring-color': colors.primary,
                  '--tw-ring-offset-color': colors.background
                }}
              >
                {ctaData.secondary_label}
                <Download className="ml-2 h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      </section>
    );
  };

  const renderAppointments = (appointmentsData: any) => {
    if (!appointmentsData?.booking_url && !appointmentsData?.section_title) return null;
    return (
      <section className="px-6 py-12" style={{ backgroundColor: colors.cardBg }}>
        <div className="max-w-4xl mx-auto rounded-2xl p-8" style={{ backgroundColor: colors.background, border: `1px solid ${colors.borderColor}`, fontFamily: font }}>
          <div className="flex flex-col gap-4">
            <div className="space-y-2">
              <h2 className="text-xl font-semibold" style={{ color: colors.text }}>{appointmentsData.section_title}</h2>
              {appointmentsData.section_description && (
                <p className="text-sm" style={{ color: colors.text + '99' }}>{appointmentsData.section_description}</p>
              )}
            </div>
            <div className="flex flex-wrap gap-3">
              {appointmentsData.booking_text && (
                <Button
                  className="rounded-full"
                  style={{ backgroundColor: colors.primary, color: colors.buttonText }}
                  onClick={() => handleAppointmentBooking(appointmentsData)}
                >
                  <Calendar className="mr-2 h-4 w-4" />
                  {appointmentsData.booking_text}
                </Button>
              )}
              {appointmentsData.estimate_text && (
                <Button
                  variant="outline"
                  className="rounded-full"
                  onClick={() => appointmentsData.booking_url && window.open(appointmentsData.booking_url, '_blank')}
                  style={{
                    color: colors.primary,
                    borderColor: colors.primary,
                    backgroundColor: 'transparent'
                  }}
                >
                  {appointmentsData.estimate_text}
                </Button>
              )}
            </div>
          </div>
        </div>
      </section>
    );
  };

  const renderContactForm = (formData: any) => {
    if (!formData?.form_title) return null;
    return (
      <section id="contact" className="px-6 py-12" style={{ backgroundColor: colors.background }}>
        <div className="max-w-4xl mx-auto rounded-3xl border p-8 shadow-sm"
          style={{ borderColor: colors.borderColor, fontFamily: font }}
        >
          <div className="mb-6 text-center space-y-3">
            <h2 className="text-2xl font-semibold" style={{ color: colors.text }}>{formData.form_title}</h2>
            {formData.form_description && (
              <p className="text-sm" style={{ color: colors.text + 'B3' }}>{formData.form_description}</p>
            )}
          </div>
          <form className="grid grid-cols-1 gap-4">
            <input className="rounded-full border px-4 py-3" style={{ borderColor: colors.borderColor }} placeholder="Name" />
            <input className="rounded-full border px-4 py-3" style={{ borderColor: colors.borderColor }} placeholder="Phone / WhatsApp" />
            <input className="rounded-full border px-4 py-3" style={{ borderColor: colors.borderColor }} placeholder="Project Type" />
            <textarea className="rounded-3xl border px-4 py-3" style={{ borderColor: colors.borderColor }} rows={4} placeholder="Tell us about your project" />
            <Button type="submit" className="rounded-full font-semibold"
              style={{ backgroundColor: colors.primary, color: colors.buttonText, boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)' }}
            >
              Send Inquiry
            </Button>
          </form>
          {formData.success_message && (
            <p className="mt-4 text-center text-xs" style={{ color: colors.text + '99' }}>{formData.success_message}</p>
          )}
        </div>
      </section>
    );
  };

  const renderContactSection = (contactData: any) => {
    if (!contactData) return null;
    return (
      <section className="px-6 py-12" style={{ backgroundColor: colors.cardBg }}>
        <div className="max-w-4xl mx-auto rounded-3xl border p-8"
          style={{ borderColor: colors.borderColor, backgroundColor: colors.background, fontFamily: font }}
        >
          <h2 className="text-2xl font-semibold mb-4" style={{ color: colors.text }}>Talk to Our Experts</h2>
          <div className="grid grid-cols-1 gap-4">
            {contactData.phone && (
              <div className="flex items-center gap-3 text-sm" style={{ color: colors.text }}>
                <Phone className="h-5 w-5" style={{ color: colors.primary }} />
                <a href={`tel:${sanitizePhone(contactData.phone)}`} className="font-medium" style={{ color: colors.text }}>
                  {contactData.phone}
                </a>
              </div>
            )}
            {contactData.whatsapp && (
              <div className="flex items-center gap-3 text-sm" style={{ color: colors.text }}>
                <Phone className="h-5 w-5" style={{ color: colors.primary }} />
                <a href={`https://wa.me/${sanitizePhone(contactData.whatsapp)}`} className="font-medium" style={{ color: colors.primary }}>
                  WhatsApp
                </a>
              </div>
            )}
            {contactData.email && (
              <div className="flex items-center gap-3 text-sm" style={{ color: colors.text }}>
                <Mail className="h-5 w-5" style={{ color: colors.primary }} />
                <a href={`mailto:${sanitizeEmail(contactData.email)}`} className="font-medium" style={{ color: colors.text }}>
                  {contactData.email}
                </a>
              </div>
            )}
            {contactData.address && (
              <div className="flex items-start gap-3 text-sm" style={{ color: colors.text }}>
                <MapPin className="h-5 w-5 mt-1" style={{ color: colors.primary }} />
                <span>{contactData.address}</span>
              </div>
            )}
          </div>
          {contactData.map_url && (
            <Button
              className="mt-6 rounded-full font-medium"
              variant="outline"
              onClick={() => window.open(contactData.map_url, '_blank')}
              style={{
                color: colors.primary,
                borderColor: colors.primary,
                backgroundColor: 'transparent'
              }}
            >
              View on Map
            </Button>
          )}
        </div>
      </section>
    );
  };

  const renderBusinessHours = (hoursData: any) => {
    if (!hoursData?.hours?.length) return null;
    return (
      <section className="px-6 py-12" style={{ backgroundColor: colors.background }}>
        <div className="max-w-4xl mx-auto rounded-3xl border p-8"
          style={{ borderColor: colors.borderColor, fontFamily: font }}
        >
          <h2 className="text-2xl font-semibold mb-4" style={{ color: colors.text }}>Business Hours</h2>
          <div className="space-y-2 text-sm" style={{ color: colors.text + 'CC' }}>
            {hoursData.hours.map((hour: any, index: number) => (
              <div key={index} className="flex items-center justify-between border-b pb-2" style={{ borderColor: colors.borderColor }}>
                <span className="font-medium" style={{ color: colors.text }}>{hour.day?.[0]?.toUpperCase() + hour.day?.slice(1)}</span>
                <span>
                  {hour.is_closed
                    ? 'Closed'
                    : `${hour.open_time || '--:--'}${hour.close_time ? ` - ${hour.close_time}` : ''}`}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  };

  const renderFooter = (footerData: any, copyrightData: any) => {
    if (!footerData && !copyrightData) return null;
    return (
      <footer className="px-6 py-12" style={{ backgroundColor: colors.primary, color: colors.buttonText, fontFamily: font }}>
        <div className="max-w-5xl mx-auto space-y-4">
          {footerData?.footer_text && <p className="text-sm">{footerData.footer_text}</p>}
          {footerData?.footer_links?.length > 0 && (
            <div className="flex flex-wrap gap-4 text-sm">
              {footerData.footer_links.map((link: any, index: number) => (
                <a key={index} href={link.url} className="underline">
                  {link.title}
                </a>
              ))}
            </div>
          )}
          {configSections.social?.social_links?.length > 0 && (
            <div className="flex flex-wrap gap-3 pt-2">
              {configSections.social.social_links.map((social: any, index: number) => {
                const sanitizedUrl = sanitizeSocialUrl(social.url);
                if (!sanitizedUrl) return null;
                return (
                  <a
                    key={index}
                    href={sanitizedUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex h-10 w-10 items-center justify-center rounded-full border"
                    style={{ borderColor: colors.buttonText, color: colors.buttonText }}
                  >
                    <SocialIcon platform={social.platform || ''} color={colors.buttonText} />
                  </a>
                );
              })}
            </div>
          )}
          <div className="pt-4 text-xs opacity-80">
            {copyrightData?.text || '© 2025 Construction Company'}
          </div>
        </div>
      </footer>
    );
  };

  return (
    <div className="mx-auto max-w-6xl overflow-hidden rounded-3xl shadow-xl"
      style={{ fontFamily: font, backgroundColor: colors.background }}
    >
      {orderedSectionKeys.map((sectionKey) => {
        const sectionDataOverride = sectionKey === 'service_highlights'
          ? serviceHighlightsSection
          : sectionKey === 'packages'
            ? packagesSection
            : configSections[sectionKey];
        const sectionData = sectionDataOverride;
        switch (sectionKey) {
          case 'hero':
            return <React.Fragment key={sectionKey}>{renderHero(sectionData)}</React.Fragment>;
          case 'service_highlights':
            return <React.Fragment key={sectionKey}>{renderServiceHighlights(sectionData)}</React.Fragment>;
          case 'why_choose_us':
            return <React.Fragment key={sectionKey}>{renderWhyChooseUs(sectionData)}</React.Fragment>;
          case 'about':
            return <React.Fragment key={sectionKey}>{renderAbout(sectionData)}</React.Fragment>;
          case 'projects':
            return <React.Fragment key={sectionKey}>{renderProjects(sectionData)}</React.Fragment>;
          case 'testimonials':
            return <React.Fragment key={sectionKey}>{renderTestimonials(sectionData)}</React.Fragment>;
          case 'process':
            return <React.Fragment key={sectionKey}>{renderProcess(sectionData)}</React.Fragment>;
          case 'packages':
            return <React.Fragment key={sectionKey}>{renderPackages(sectionData)}</React.Fragment>;
          case 'cta_banner':
            return <React.Fragment key={sectionKey}>{renderCtaBanner(sectionData)}</React.Fragment>;
          case 'appointments':
            return <React.Fragment key={sectionKey}>{renderAppointments(sectionData)}</React.Fragment>;
          case 'contact_form':
            return <React.Fragment key={sectionKey}>{renderContactForm(sectionData)}</React.Fragment>;
          case 'contact':
            return <React.Fragment key={sectionKey}>{renderContactSection(sectionData)}</React.Fragment>;
          case 'business_hours':
            return <React.Fragment key={sectionKey}>{renderBusinessHours(sectionData)}</React.Fragment>;
          case 'footer':
          case 'copyright':
            return null; // rendered together below
          default:
            return sectionData ? (
              <section key={sectionKey} className="px-6 py-12">
                <StableHtmlContent htmlContent={sectionData?.html_content || ''} />
              </section>
            ) : null;
        }
      })}
      {renderFooter(configSections.footer, configSections.copyright)}
    </div>
  );
};

export default ConstructionSalesTemplate;
