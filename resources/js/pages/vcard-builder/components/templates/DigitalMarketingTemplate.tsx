import { handleAppointmentBooking } from '../VCardPreview';
import React from 'react';
import StableHtmlContent from '@/components/StableHtmlContent';
import { VideoEmbed, extractVideoUrl } from '@/components/VideoEmbed';
import { createYouTubeEmbedRef } from '@/utils/youtubeEmbedUtils';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Mail, Phone, Globe, MapPin, Calendar, Download, UserPlus, TrendingUp, Target, BarChart3, Zap, Play, Youtube, Video, QrCode, Star } from 'lucide-react';
import SocialIcon from '../../../link-bio-builder/components/SocialIcon';
import { QRShareModal } from '@/components/QRShareModal';
import { getSectionOrder } from '@/utils/sectionHelpers';
import { getBusinessTemplate } from '@/pages/vcard-builder/business-templates';
import { useTranslation } from 'react-i18next';
import languageData from '@/../../resources/lang/language.json';
import { sanitizeVideoData } from '@/utils/secureVideoUtils';

interface DigitalMarketingTemplateProps {
  data: any;
  template: any;
}

type LanguageOption = {
  code: string;
  name: string;
  countryCode: string;
};

const getFlagEmoji = (countryCode?: string): string => {
  if (!countryCode) {
    return '';
  }

  const codePoints = countryCode
    .toUpperCase()
    .split('')
    .map((char) => 127397 + char.charCodeAt(0));

  return codePoints.length > 0 ? String.fromCodePoint(...codePoints) : '';
};

export default function DigitalMarketingTemplate({ data, template }: DigitalMarketingTemplateProps) {
  const { t, i18n } = useTranslation();
  const configSections = data.config_sections || {};

  // Testimonials state
  const [currentReview, setCurrentReview] = React.useState(0);
  
  // Effect for testimonials rotation
  React.useEffect(() => {
    const testimonialsData = configSections.testimonials;
    const reviews = testimonialsData?.reviews || [];
    if (!Array.isArray(reviews) || reviews.length <= 1) return;
    
    const interval = setInterval(() => {
      setCurrentReview(prev => (prev + 1) % reviews.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [configSections.testimonials?.reviews]);
  
  // Language selector state
  const [showLanguageSelector, setShowLanguageSelector] = React.useState(false);
  const [currentLanguage, setCurrentLanguage] = React.useState(configSections.language?.template_language || 'en');

  // QR Modal state
  const [showQrModal, setShowQrModal] = React.useState(false);
  
  // RTL languages
  const rtlLanguages = ['ar', 'he'];
  const isRTL = rtlLanguages.includes(currentLanguage);
  
  // Change language function
  const changeLanguage = (langCode: string) => {
    setCurrentLanguage(langCode);
    setShowLanguageSelector(false);
    i18n.changeLanguage(langCode);
  };
  
  // Process video content at component level
  const videoContent = React.useMemo(() => {
    const videos = configSections.videos?.video_list || [];
    if (!Array.isArray(videos)) return [];
    return videos.map((video: any, index: number) => {
      // If it's an iframe, skip processing and use raw content
      if (video?.embed_url && video.embed_url.includes('<iframe')) {
        return {
          ...video,
          key: `video-${index}-${video?.title || ''}-${video?.embed_url?.substring(0, 20) || ''}`
        };
      }
      
      const sanitizedVideo = sanitizeVideoData(video);
      const videoData = sanitizedVideo?.embed_url ? extractVideoUrl(sanitizedVideo.embed_url) : null;
      return {
        ...sanitizedVideo,
        videoData,
        key: `video-${index}-${sanitizedVideo?.title || ''}-${sanitizedVideo?.embed_url || ''}`
      };
    });
  }, [configSections.videos?.video_list]);
  
  const colors = configSections.colors || template?.defaultColors || { primary: '#1E40AF', secondary: '#3B82F6', accent: '#DBEAFE', text: '#1E293B' };
  const font = configSections.font || template?.defaultFont || 'Poppins, sans-serif';

  // Get all sections for this business type
  const allSections = getBusinessTemplate('digital-marketing')?.sections || [];

  const renderSection = (sectionKey: string) => {
    const sectionData = configSections[sectionKey] || {};
    if (!sectionData || Object.keys(sectionData).length === 0 || sectionData.enabled === false) return null;
    
    switch (sectionKey) {
      case 'header':
        return renderHeaderSection(sectionData);
      case 'contact':
        return renderContactSection(sectionData);
      case 'about':
        return renderAboutSection(sectionData);
      case 'services':
        return renderServicesSection(sectionData);
      case 'portfolio':
        return renderPortfolioSection(sectionData);
      case 'videos':
        return renderVideosSection(sectionData);
      case 'youtube':
        return renderYouTubeSection(sectionData);
      case 'social':
        return renderSocialSection(sectionData);
      case 'business_hours':
        return renderBusinessHoursSection(sectionData);
      case 'testimonials':
        return renderTestimonialsSection(sectionData);
      case 'appointments':
        return renderAppointmentsSection(sectionData);
      case 'google_map':
        return renderLocationSection(sectionData);
      case 'app_download':
        return renderAppDownloadSection(sectionData);
      case 'contact_form':
        return renderContactFormSection(sectionData);
      case 'custom_html':
        return renderCustomHtmlSection(sectionData);
      case 'qr_share':
        return renderQrShareSection(sectionData);
      case 'thank_you':
        return renderThankYouSection(sectionData);
      default:
        return null;
    }
  };

  const renderHeaderSection = (headerData: any) => (
    <div
      className="relative overflow-hidden shadow-xl"
      style={{ background: `linear-gradient(135deg, ${colors.primary}, ${colors.secondary})` }}
    >
      <div className="absolute inset-0">
        <div className="absolute inset-0 opacity-20">
          <svg width="100%" height="100%" viewBox="0 0 100 100" className="fill-current text-white/70">
            <defs>
              <pattern id="marketing-grid" x="0" y="0" width="14" height="14" patternUnits="userSpaceOnUse">
                <path d="M 14 0 L 0 0 0 14" fill="none" stroke="currentColor" strokeWidth="0.4" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#marketing-grid)" />
          </svg>
        </div>
        <div className="absolute -top-24 -left-20 w-72 h-72 bg-white/25 rounded-full blur-3xl" />
        <div className="absolute -bottom-32 -right-16 w-80 h-80 bg-black/20 rounded-full blur-3xl" />
      </div>

      <div className="relative px-6 py-10 sm:px-10 sm:py-12">
        {configSections.language && (
          <div className={`absolute top-5 ${isRTL ? 'left-6' : 'right-6'}`}>
            <div className="relative">
              <button
                onClick={() => setShowLanguageSelector(!showLanguageSelector)}
                className="flex items-center gap-2 rounded-full border border-white/30 bg-white/20 px-3 py-1.5 text-xs font-medium text-white transition-colors hover:bg-white/30"
                style={{ fontFamily: font }}
              >
                <Globe className="h-3.5 w-3.5" />
                <span>{languageData.find((lang) => lang.code === currentLanguage)?.name || 'EN'}</span>
              </button>

              {showLanguageSelector && (
                <div className="absolute top-full right-0 z-50 mt-2 max-h-52 min-w-[160px] overflow-y-auto rounded-xl border border-white/30 bg-white/95 p-1 shadow-2xl backdrop-blur">
                  {languageData.map((lang: LanguageOption) => (
                    <button
                      key={lang.code}
                      onClick={() => changeLanguage(lang.code)}
                      className={`flex w-full items-center gap-2 rounded-lg px-3 py-2 text-xs transition-colors ${
                        currentLanguage === lang.code
                          ? 'bg-blue-100 text-blue-700'
                          : 'text-slate-700 hover:bg-slate-100'
                      }`}
                      style={{ fontFamily: font }}
                    >
                      <span className="text-sm">{getFlagEmoji(lang.countryCode)}</span>
                      <span>{lang.name}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        <div className="flex flex-col gap-10">
          <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-5">
              <div className="flex h-20 w-20 flex-shrink-0 items-center justify-center border border-white/30 bg-white/15 backdrop-blur">
                {headerData.profile_image ? (
                  <img src={headerData.profile_image} alt="Logo" className="h-full w-full rounded-2xl object-cover" />
                ) : (
                  <TrendingUp className="h-9 w-9 text-white" />
                )}
              </div>

              <div className="flex flex-col">
                <h1 className="text-2xl font-bold text-white sm:text-3xl" style={{ fontFamily: font }}>
                  {headerData.name || data.name || 'Digital Marketing Agency'}
                </h1>
                <p className="mt-2 text-sm font-semibold uppercase tracking-[0.3em] text-white/70" style={{ fontFamily: font }}>
                  {headerData.title || 'Growing Your Digital Presence'}
                </p>
                {headerData.tagline && (
                  <p className="mt-3 max-w-xl text-sm leading-relaxed text-white/80" style={{ fontFamily: font }}>
                    {headerData.tagline}
                  </p>
                )}
              </div>
            </div>

            {(headerData.badge_1 || headerData.badge_2 || headerData.badge_3) && (
              <div className="flex flex-col gap-3">
                {[headerData.badge_1, headerData.badge_2, headerData.badge_3]
                  .filter(Boolean)
                  .map((badge, index) => (
                    <div
                      key={`badge-${index}`}
                      className="flex items-center gap-2 border border-white/20 bg-white/15 px-4 py-3 text-xs font-medium text-white/90 backdrop-blur"
                      style={{ fontFamily: font }}
                    >
                      <BarChart3 className="h-4 w-4" />
                      <span>{badge}</span>
                    </div>
                  ))}
              </div>
            )}

            {(headerData.cta_text && headerData.cta_button) || headerData.whatsapp?.phone_number || headerData.cta_button ? (
              <div className="flex flex-col gap-4">
                {headerData.cta_text && (
                  <p className="text-sm text-white/85" style={{ fontFamily: font }}>
                    {headerData.cta_text}
                  </p>
                )}
                <div className="flex flex-col gap-3">
                  {headerData.cta_button && (
                    <Button
                      size="lg"
                      className="w-full bg-white text-slate-900 shadow-lg transition hover:-translate-y-0.5 hover:bg-white"
                      style={{ fontFamily: font }}
                      onClick={() => {
                        if (!headerData.cta_button?.url) return;
                        window.open(headerData.cta_button.url, '_blank', 'noopener,noreferrer');
                      }}
                    >
                      {headerData.cta_button.label || t('Start a project')}
                    </Button>
                  )}
                  {headerData.whatsapp?.phone_number && (
                    <Button
                      size="lg"
                      className="w-full bg-[#25D366] text-white shadow-lg transition hover:-translate-y-0.5 hover:bg-[#1EBE5C]"
                      style={{ fontFamily: font }}
                      onClick={() => {
                        const whatsappUrl = `https://wa.me/${headerData.whatsapp?.phone_number.replace(/\D/g, '')}?text=${encodeURIComponent(
                          headerData.whatsapp?.prefilled_message || ''
                        )}`;
                        window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
                      }}
                    >
                      {headerData.whatsapp?.button_label || t('Chat on WhatsApp')}
                    </Button>
                  )}
                  <Button
                    size="lg"
                    variant="outline"
                    className="w-full border-white/40 bg-white/15 text-white hover:bg-white/25"
                    style={{ fontFamily: font }}
                    onClick={() => setShowQrModal(true)}
                  >
                    <QrCode className="mr-2 h-4 w-4" />
                    {t('Share Profile')}
                  </Button>
                </div>
              </div>
            ) : null}
          </div>

          {headerData.highlight_cards && Array.isArray(headerData.highlight_cards) && headerData.highlight_cards.length > 0 && (
            <div className="flex flex-col gap-4">
              {headerData.highlight_cards.slice(0, 3).map((card: any, index: number) => (
                <div
                  key={`highlight-${index}`}
                  className="border border-white/20 bg-white/15 p-5 text-sm text-white/90 backdrop-blur"
                  style={{ fontFamily: font }}
                >
                  <p className="text-xs uppercase tracking-widest text-white/60">{card.label}</p>
                  <p className="mt-1 text-lg font-semibold text-white">{card.value}</p>
                  {card.caption && <p className="mt-2 text-xs text-white/70">{card.caption}</p>}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <QRShareModal
        isOpen={showQrModal}
        onClose={() => setShowQrModal(false)}
        url={typeof window !== 'undefined' ? window.location.href : ''}
        colors={colors}
        font={font}
        socialLinks={configSections.social?.social_links || []}
      />
    </div>
  );

  const renderContactSection = (contactData: any) => (
    <section className="border border-slate-100 bg-white px-6 py-6 shadow-sm">
      <div className="flex flex-col gap-4">
        {(contactData.email || data.email) && (
          <div className="flex items-center gap-3 border border-slate-100 bg-slate-50/60 p-4">
            <div className="flex h-10 w-10 items-center justify-center" style={{ backgroundColor: colors.primary + '20' }}>
              <Mail className="h-5 w-5" style={{ color: colors.primary }} />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500" style={{ fontFamily: font }}>
                {t('Email')}
              </p>
              <a
                href={`mailto:${contactData.email || data.email}`}
                className="text-sm font-medium text-slate-900 hover:underline"
                style={{ fontFamily: font }}
              >
                {contactData.email || data.email}
              </a>
            </div>
          </div>
        )}

        {(contactData.phone || data.phone) && (
          <div className="flex items-center gap-3 border border-slate-100 bg-slate-50/60 p-4">
            <div className="flex h-10 w-10 items-center justify-center" style={{ backgroundColor: colors.primary + '20' }}>
              <Phone className="h-5 w-5" style={{ color: colors.primary }} />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500" style={{ fontFamily: font }}>
                {t('Phone')}
              </p>
              <a
                href={`tel:${contactData.phone || data.phone}`}
                className="text-sm font-medium text-slate-900 hover:underline"
                style={{ fontFamily: font }}
              >
                {contactData.phone || data.phone}
              </a>
            </div>
          </div>
        )}

        {(contactData.website || data.website) && (
          <div className="flex items-center gap-3 border border-slate-100 bg-slate-50/60 p-4">
            <div className="flex h-10 w-10 items-center justify-center" style={{ backgroundColor: colors.primary + '20' }}>
              <Globe className="h-5 w-5" style={{ color: colors.primary }} />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500" style={{ fontFamily: font }}>
                {t('Website')}
              </p>
              <a
                href={contactData.website || data.website}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm font-medium text-slate-900 hover:underline"
                style={{ fontFamily: font }}
              >
                {contactData.website || data.website}
              </a>
            </div>
          </div>
        )}

        {contactData.location && (
          <div className="flex items-center gap-3 border border-slate-100 bg-slate-50/60 p-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-full" style={{ backgroundColor: colors.primary + '20' }}>
              <MapPin className="h-5 w-5" style={{ color: colors.primary }} />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500" style={{ fontFamily: font }}>
                {t('Location')}
              </p>
              <span className="text-sm font-medium text-slate-900" style={{ fontFamily: font }}>
                {contactData.location}
              </span>
            </div>
          </div>
        )}
      </div>
    </section>
  );

  const renderAboutSection = (aboutData: any) => {
    if (!aboutData.description && !data.description) return null;  
    return (
      <section className="overflow-hidden border border-slate-100 bg-gradient-to-br from-white via-white to-slate-50 p-6 shadow-sm">
        <div className="flex flex-col gap-6">
          <div className="flex-1 space-y-4">
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center" style={{ backgroundColor: `${colors.primary}15` }}>
                <Target className="h-5 w-5" style={{ color: colors.primary }} />
              </span>
              <h3 className="text-lg font-semibold text-slate-900" style={{ fontFamily: font }}>
                {t('About Us')}
              </h3>
            </div>
            <p className="text-sm leading-relaxed text-slate-600" style={{ fontFamily: font }}>
              {aboutData.description || data.description}
            </p>

            {aboutData.specialties && (
              <div className="space-y-3">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500" style={{ fontFamily: font }}>
                  {t('Specialties')}
                </p>
                <div className="flex flex-wrap gap-2">
                  {aboutData.specialties.split(',').map((specialty: string, index: number) => (
                    <span
                      key={index}
                      className="border border-slate-200 bg-white px-3 py-1 text-xs font-medium text-slate-700 shadow-sm"
                      style={{ fontFamily: font }}
                    >
                      {specialty.trim()}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {(aboutData.experience || Array.isArray(aboutData.key_metrics)) && (
            <div className="flex w-full flex-col gap-4">
              {aboutData.experience && (
                <div className="border border-slate-200 bg-white p-5 text-center shadow-sm">
                  <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-400" style={{ fontFamily: font }}>
                    {t('Experience')}
                  </p>
                  <p className="mt-2 text-3xl font-semibold text-slate-900" style={{ fontFamily: font }}>
                    {aboutData.experience}
                  </p>
                  <p className="mt-1 text-xs text-slate-500" style={{ fontFamily: font }}>
                    {t('Years delivering growth')}
                  </p>
                </div>
              )}
              {Array.isArray(aboutData.key_metrics) &&
                aboutData.key_metrics.slice(0, 2).map((metric: any, index: number) => (
                  <div
                    key={`about-metric-${index}`}
                    className="border border-slate-200 bg-white p-5 shadow-sm"
                    style={{ fontFamily: font }}
                  >
                    <p className="text-xs font-semibold uppercase tracking-widest text-slate-400">{metric.label}</p>
                    <p className="mt-2 text-2xl font-semibold text-slate-900">{metric.value}</p>
                    {metric.caption && <p className="mt-1 text-xs text-slate-500">{metric.caption}</p>}
                  </div>
                ))}
            </div>
          )}
        </div>
      </section>
    );
  };

  const renderServicesSection = (servicesData: any) => {
    const services = servicesData.service_list || [];
    if (!Array.isArray(services) || services.length === 0) return null;
    return (
      <section className="space-y-5 border border-slate-100 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center" style={{ backgroundColor: `${colors.primary}15` }}>
              <Zap className="h-5 w-5" style={{ color: colors.primary }} />
            </span>
            <h3 className="text-lg font-semibold text-slate-900" style={{ fontFamily: font }}>
              {t('Our Services')}
            </h3>
          </div>
          {servicesData.highlight && (
            <Badge className="w-full bg-slate-900/5 text-center text-xs font-semibold text-slate-600" variant="secondary">
              {servicesData.highlight}
            </Badge>
          )}
        </div>

        <div className="flex flex-col gap-4">
          {services.map((service: any, index: number) => (
            <div
              key={index}
              className="group relative overflow-hidden border border-slate-100 bg-slate-50/40 p-5 transition hover:-translate-y-1 hover:border-slate-200 hover:bg-white hover:shadow-lg"
              style={{ fontFamily: font }}
            >
              <div className="absolute -top-10 right-0 h-24 w-24 bg-gradient-to-br from-white/40 to-white/10 blur-2xl transition group-hover:scale-110" />
              <div className="relative space-y-3">
                <div className="space-y-1">
                  <h4 className="text-base font-semibold text-slate-900">{service.title}</h4>
                  {service.price && (
                    <span className="text-xs font-semibold text-slate-500">{service.price}</span>
                  )}
                </div>
                {service.description && (
                  <p className="text-sm leading-relaxed text-slate-600">{service.description}</p>
                )}
                {Array.isArray(service.tags) && service.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {service.tags.slice(0, 3).map((tag: string, tagIndex: number) => (
                      <span key={tagIndex} className="bg-slate-900/5 px-3 py-1 text-xs text-slate-600">
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
                {service.cta_label && service.cta_url && (
                  <Button
                    variant="ghost"
                    className="w-full justify-start px-0 text-xs font-semibold text-slate-700 hover:text-slate-900"
                    onClick={() => window.open(service.cta_url, '_blank', 'noopener,noreferrer')}
                  >
                    {service.cta_label}
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>
    );
  };

  const renderPortfolioSection = (portfolioData: any) => {
    const projects = portfolioData.projects || [];
    if (!Array.isArray(projects) || projects.length === 0) return null;
    return (
      <section className="space-y-5 border border-slate-100 bg-white p-6 shadow-sm">
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-full" style={{ backgroundColor: `${colors.primary}15` }}>
            <BarChart3 className="h-5 w-5" style={{ color: colors.primary }} />
          </span>
          <h3 className="text-lg font-semibold text-slate-900" style={{ fontFamily: font }}>
            {t('Success Stories')}
          </h3>
        </div>

        <div className="space-y-4">
          {projects.map((project: any, index: number) => (
            <article
              key={index}
              className="overflow-hidden border border-slate-100 bg-slate-50/50 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
              style={{ fontFamily: font }}
            >
              {project.image && (
                <div className="relative h-44 w-full overflow-hidden">
                  <img src={project.image} alt={project.title || 'Case Study'} className="h-full w-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
                  <div className="absolute bottom-4 left-4 flex items-center gap-2 text-xs font-semibold text-white">
                    <TrendingUp className="h-4 w-4" />
                    <span>{project.industry || t('Growth Campaign')}</span>
                  </div>
                </div>
              )}
              <div className="space-y-3 p-5">
                <div className="space-y-2">
                  <h4 className="text-base font-semibold text-slate-900">{project.title}</h4>
                  {project.results && (
                    <span className="inline-block bg-green-500/10 px-3 py-1 text-xs font-semibold text-green-600">
                      {project.results}
                    </span>
                  )}
                </div>
                {project.description && <p className="text-sm leading-relaxed text-slate-600">{project.description}</p>}
                {project.metrics && <p className="text-xs text-slate-500">{project.metrics}</p>}
                {project.url && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full justify-start px-0 text-xs font-semibold text-slate-700 hover:text-slate-900"
                    onClick={() => window.open(project.url, '_blank', 'noopener,noreferrer')}
                  >
                    {t('View Case Study')}
                  </Button>
                )}
              </div>
            </article>
          ))}
        </div>
      </section>
    );
  };

  const renderVideosSection = (videosData: any) => {
    if (!videoContent || videoContent.length === 0) return null;

    return (
      <section className="space-y-5 border border-slate-100 bg-white p-6 shadow-sm">
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-full" style={{ backgroundColor: `${colors.primary}15` }}>
            <Video className="h-5 w-5" style={{ color: colors.primary }} />
          </span>
          <h3 className="text-lg font-semibold text-slate-900" style={{ fontFamily: font }}>
            {t('Marketing Videos')}
          </h3>
        </div>

        <div className="space-y-5">
          {videoContent.map((video: any) => (
            <article
              key={video.key}
              className="overflow-hidden border border-slate-100 bg-slate-50/50 shadow-sm"
              style={{ fontFamily: font }}
            >
              <div className="relative">
                {video.embed_url && video.embed_url.includes('<iframe') ? (
                  <div className="relative w-full overflow-hidden" style={{ paddingBottom: '56.25%', height: 0 }}>
                    <div
                      className="absolute inset-0 h-full w-full"
                      ref={(el) => {
                        if (el && !el.hasChildNodes()) {
                          el.innerHTML = video.embed_url.replace(
                            /<iframe([^>]*)>/i,
                            '<iframe$1 style="position:absolute;top:0;left:0;width:100%;height:100%;border:0;">'
                          );
                        }
                      }}
                    />
                  </div>
                ) : video.videoData ? (
                  <VideoEmbed
                    url={video.videoData.url}
                    title={video.title || 'Video'}
                    platform={video.videoData.platform}
                    colors={colors}
                  />
                ) : video.thumbnail ? (
                  <div className="relative h-40 w-full">
                    <img src={video.thumbnail} alt={video.title || 'Video thumbnail'} className="h-full w-full object-cover" />
                    <div className="absolute inset-0 flex items-center justify_center bg-black/45">
                      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white/90">
                        <Play className="ml-1 h-6 w-6" style={{ color: colors.primary }} />
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="flex h-40 w-full items-center justify-center" style={{ backgroundColor: `${colors.primary}10` }}>
                    <div className="text-center">
                      <Video className="mx-auto mb-2 h-10 w-10" style={{ color: colors.primary }} />
                      <span className="text-xs text-slate-500">{t('Video Content')}</span>
                    </div>
                  </div>
                )}
              </div>
              <div className="space-y-3 p-5">
                <div className="space-y-1">
                  <h4 className="text-base font-semibold text-slate-900">{video.title}</h4>
                  {video.duration && <span className="text-xs font-semibold text-slate-500">⏱️ {video.duration}</span>}
                </div>
                {video.description && <p className="text-sm leading-relaxed text-slate-600">{video.description}</p>}
                <div className="flex flex-col gap-2 text-xs">
                  {video.marketing_channel && (
                    <Badge variant="secondary" className="w-fit bg-slate-900/5 text-slate-600">
                      {video.marketing_channel.replace('_', ' ').toUpperCase()}
                    </Badge>
                  )}
                  {video.cta_label && video.cta_url && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="w-full justify-start px-0 text-xs font-semibold text-slate-700 hover:text-slate-900"
                      onClick={() => window.open(video.cta_url, '_blank', 'noopener,noreferrer')}
                    >
                      {video.cta_label}
                    </Button>
                  )}
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>
    );
  };

  const renderYouTubeSection = (youtubeData: any) => {
    if (!youtubeData.channel_url && !youtubeData.channel_name && !youtubeData.latest_video_embed) return null;
    return (
      <section className="space-y-5 border border-slate-100 bg-white p-6 shadow-sm" style={{ fontFamily: font }}>
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center bg-red-500/10">
            <Youtube className="h-5 w-5 text-red-500" />
          </span>
          <h3 className="text-lg font-semibold text-slate-900">{t('YouTube Channel')}</h3>
        </div>

        <div className="flex flex-col gap-4">
          {youtubeData.latest_video_embed && (
            <div className="overflow-hidden border border-slate-100 bg-slate-50/40">
              <div className="flex items_center gap-2 border-b border-slate-100 px-5 py-4">
                <Play className="h-4 w-4 text-red-500" />
                <p className="text-sm font-semibold text-slate-900">{t('Latest Video')}</p>
              </div>
              <div className="relative w-full overflow-hidden" style={{ paddingBottom: '56.25%', height: 0 }}>
                <div
                  className="absolute inset-0 h-full w-full"
                  ref={createYouTubeEmbedRef(youtubeData.latest_video_embed, { colors, font }, 'Latest Video')}
                />
              </div>
            </div>
          )}

          <div className="border border-slate-100 bg-slate-50/40 p-5">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-500">
                <Youtube className="h-6 w-6 text-white" />
              </div>
              <div className="flex-1">
                <h4 className="text-base font-semibold text-slate-900">
                  {youtubeData.channel_name || 'YouTube Channel'}
                </h4>
                {youtubeData.subscriber_count && (
                  <p className="text-xs font-medium text-slate-500">
                    📊 {youtubeData.subscriber_count} {t('subscribers')}
                  </p>
                )}
              </div>
            </div>

            {youtubeData.channel_description && (
              <p className="mt-4 text-sm leading-relaxed text-slate-600">{youtubeData.channel_description}</p>
            )}

            <div className="mt-4 space-y-2">
              {youtubeData.channel_url && (
                <Button
                  className="w-full bg-red-500 text-white hover:bg-red-600"
                  onClick={() => typeof window !== 'undefined' && window.open(youtubeData.channel_url, '_blank', 'noopener,noreferrer')}
                >
                  <Youtube className="mr-2 h-4 w-4" />
                  {t('Visit Channel')}
                </Button>
              )}
              {youtubeData.featured_playlist && (
                <Button
                  variant="outline"
                  className="w-full border-slate-200 text-slate-700 hover:border-slate-300"
                  onClick={() => typeof window !== 'undefined' && window.open(youtubeData.featured_playlist, '_blank', 'noopener,noreferrer')}
                >
                  📋 {t('Featured Playlist')}
                </Button>
              )}
            </div>
          </div>
        </div>
      </section>
    );
  };

  const renderSocialSection = (socialData: any) => {
    const socialLinks = socialData.social_links || [];
    if (!Array.isArray(socialLinks) || socialLinks.length === 0) return null;
    return (
      <section className="space-y-5 border border-slate-100 bg-white p-6 shadow-sm">
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-full" style={{ backgroundColor: `${colors.primary}15` }}>
            <UserPlus className="h-5 w-5" style={{ color: colors.primary }} />
          </span>
          <h3 className="text-lg font-semibold text-slate-900" style={{ fontFamily: font }}>
            {t('Follow Us')}
          </h3>
        </div>

        <div className="mt-4 flex flex-col gap-3">
          {socialLinks.map((link: any, index: number) => (
            <button
              key={index}
              type="button"
              className="flex items-center gap-3 border border-slate-100 bg-slate-50/60 p-4 text-left transition hover:-translate-y-1 hover:border-slate-200 hover:bg-white hover:shadow"
              onClick={() => link.url && typeof window !== 'undefined' && window.open(link.url, '_blank', 'noopener,noreferrer')}
              style={{ fontFamily: font }}
            >
              <span className="flex h-10 w-10 items-center justify-center bg-white shadow-sm">
                <SocialIcon platform={link.platform} color={colors.primary || '#1E293B'} />
              </span>
              <div>
                <p className="text-sm font-semibold text-slate-900 capitalize">{link.platform.replace('-', ' ')}</p>
                {link.username && <p className="text-xs text-slate-500">@{link.username}</p>}
              </div>
            </button>
          ))}
        </div>
      </section>
    );
  };

  const renderBusinessHoursSection = (hoursData: any) => {
    const hours = hoursData.hours || [];
    if (!Array.isArray(hours) || hours.length === 0) return null;
    return (
      <section className="space-y-5 border border-slate-100 bg-white p-6 shadow-sm" style={{ fontFamily: font }}>
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-full" style={{ backgroundColor: `${colors.primary}15` }}>
            <Calendar className="h-5 w-5" style={{ color: colors.primary }} />
          </span>
          <h3 className="text-lg font-semibold text-slate-900">{t('Office Hours')}</h3>
        </div>

        <div className="mt-4 flex flex-col gap-3">
          {hours.slice(0, 7).map((hour: any, index: number) => (
            <div
              key={index}
              className="flex flex-col gap-2 border border-slate-100 bg-slate-50/60 px-4 py-3"
            >
              <div className="flex items-center gap-3">
                <span className="h-2 w-2" style={{ backgroundColor: hour.is_closed ? '#CBD5F5' : colors.primary }} />
                <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  {hour.day}
                </span>
              </div>
              <span className="text-sm font-medium text-slate-700">
                {hour.is_closed ? t('Closed') : `${hour.open_time} - ${hour.close_time}`}
              </span>
            </div>
          ))}
        </div>
      </section>
    );
  };

  const renderTestimonialsSection = (testimonialsData: any) => {
    const reviews = testimonialsData.reviews || [];

    
    if (!Array.isArray(reviews) || reviews.length === 0) return null;

    return (
      <section className="space-y-5 border border-slate-100 bg-white p-6 shadow-sm" style={{ fontFamily: font }}>
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-full" style={{ backgroundColor: `${colors.primary}15` }}>
            <Star className="h-5 w-5" style={{ color: colors.primary }} />
          </span>
          <h3 className="text-lg font-semibold text-slate-900">{t('Client Success')}</h3>
        </div>

        <div className="mt-6 space-y-6">
          <div className="relative overflow-hidden">
            <div
              className="flex transition-transform duration-500 ease-in-out"
              style={{ transform: `translateX(-${currentReview * 100}%)` }}
            >
              {reviews.map((review: any, index: number) => (
                <div key={index} className="w-full flex-shrink-0 px-1">
                  <div className="border border-slate-100 bg-slate-50/50 p-6 shadow-sm">
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_: unknown, i: number) => (
                        <span key={i} className={`h-3 w-3 rounded-full ${i < parseInt(review.rating || 5) ? 'bg-yellow-400' : 'bg-slate-200'}`} />
                      ))}
                    </div>
                    <p className="mt-4 text-sm leading-relaxed text-slate-600">“{review.review}”</p>
                    <div className="mt-4 flex items-center justify-between text-xs text-slate-500">
                      <p className="font-semibold text-slate-700">{review.client_name}</p>
                      {review.company && <p>{review.company}</p>}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {reviews.length > 1 && (
            <div className="flex justify-center gap-2">
              {testimonialsData.reviews.map((_: unknown, dotIndex: number) => (
                <span
                  key={dotIndex}
                  className="h-2 w-2 rounded-full"
                  style={{ backgroundColor: dotIndex === currentReview % Math.max(1, testimonialsData.reviews.length) ? colors.primary : colors.primary + '40' }}
                />
              ))}
            </div>
          )}
        </div>
      </section>
    );
  };

  const renderAppointmentsSection = (appointmentsData: any) => (
    <section
      className="border border-slate-100 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6 shadow-lg"
      style={{ fontFamily: font }}
    >
      <div className="flex flex-col gap-4 text-white">
        <div className="space-y-1">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-white/60">{t('Book a Free Consultation')}</p>
          <h3 className="text-xl font-semibold">{appointmentsData.heading || t('Let’s craft your next breakthrough campaign')}</h3>
          {appointmentsData.subheading && <p className="text-sm text-white/70">{appointmentsData.subheading}</p>}
        </div>
        <Button
          size="lg"
          className="w-full bg-white text-slate-900 shadow-lg transition hover:-translate-y-0.5 hover:bg-white"
          onClick={() => handleAppointmentBooking(configSections.appointments)}
        >
          <Calendar className="mr-2 h-4 w-4" />
          {appointmentsData.button_label || t('Book Strategy Call')}
        </Button>
      </div>
    </section>
  );

  const renderLocationSection = (locationData: any) => {
    if (!locationData.map_embed_url && !locationData.directions_url) return null;

    return (
      <section className="border border-slate-100 bg-white p-6 shadow-sm" style={{ fontFamily: font }}>
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-full" style={{ backgroundColor: `${colors.primary}15` }}>
            <MapPin className="h-5 w-5" style={{ color: colors.primary }} />
          </span>
          <h3 className="text-lg font-semibold text-slate-900">{t('Visit Our Office')}</h3>
        </div>

        <div className="mt-4 space-y-4">
          {locationData.map_embed_url && (
            <div className="overflow-hidden border border-slate-100">
              <div
                className="h-56 w-full"
                dangerouslySetInnerHTML={{ __html: locationData.map_embed_url }}
              />
            </div>
          )}
          {locationData.address && (
            <div className="rounded-2xl border border-slate-100 bg-slate-50/60 p-4">
              <p className="text-sm font-semibold text-slate-900">{locationData.address}</p>
              {locationData.area && <p className="text-xs text-slate-500">{locationData.area}</p>}
            </div>
          )}
          {locationData.directions_url && (
            <Button
              size="lg"
              className="w-full bg-slate-900 text-white hover:bg-slate-800"
              onClick={() => window.open(locationData.directions_url, '_blank', 'noopener,noreferrer')}
            >
              <MapPin className="mr-2 h-4 w-4" />
              {t('Get Directions')}
            </Button>
          )}
        </div>
      </section>
    );
  };

  const renderAppDownloadSection = (appData: any) => {
    if (!appData.app_store_url && !appData.play_store_url) return null;
    return (
      <div className="px-6 py-4 bg-white" style={{ borderBottom: `1px solid ${colors.accent}` }}>
        <h3 className="font-semibold text-sm mb-3" style={{ color: colors.primary, fontFamily: font }}>
          {t('Download Our App')}
        </h3>
        <div className="flex flex-col gap-2">
          {appData.app_store_url && (
            <Button 
              size="sm" 
              variant="outline" 
              className="w-full"
              style={{ borderColor: colors.primary, color: colors.primary, fontFamily: font }}
              onClick={() => typeof window !== "undefined" && window.open(appData.app_store_url, '_blank', 'noopener,noreferrer')}
            >
              {t("App Store")}
            </Button>
          )}
          {appData.play_store_url && (
            <Button 
              size="sm" 
              variant="outline" 
              className="w-full"
              style={{ borderColor: colors.primary, color: colors.primary, fontFamily: font }}
              onClick={() => typeof window !== "undefined" && window.open(appData.play_store_url, '_blank', 'noopener,noreferrer')}
            >
              {t("Play Store")}
            </Button>
          )}
        </div>
      </div>
    );
  };

  const renderContactFormSection = (formData: any) => {
    if (!formData.form_title) return null;
    return (
      <div className="px-6 py-4 bg-white" style={{ borderBottom: `1px solid ${colors.accent}` }}>
        <h3 className="font-semibold text-sm mb-2" style={{ color: colors.primary, fontFamily: font }}>
          {formData.form_title}
        </h3>
        {formData.form_description && (
          <p className="text-xs mb-3" style={{ color: colors.text, fontFamily: font }}>
            {formData.form_description}
          </p>
        )}
        <Button 
          size="sm" 
          className="w-full" 
          style={{ 
            backgroundColor: colors.secondary, 
            color: 'white',
            fontFamily: font 
          }}
          onClick={() => typeof window !== "undefined" && window.dispatchEvent(new CustomEvent('openContactModal'))}
        >
          <Mail className="w-4 h-4 mr-2" />
          {t('Get Free Quote')}
        </Button>
      </div>
    );
  };

  const renderCustomHtmlSection = (customHtmlData: any) => {
    if (!customHtmlData.html_content) return null;
    
    return (
      <div className="px-6 py-4 bg-white" style={{ borderBottom: `1px solid ${colors.accent}` }}>
        {customHtmlData.show_title && customHtmlData.section_title && (
          <h3 className="font-semibold text-sm mb-3 flex items-center" style={{ color: colors.primary, fontFamily: font }}>
            <Target className="w-4 h-4 mr-2" />
            {customHtmlData.section_title}
          </h3>
        )}
        <div 
          className="custom-html-content p-3 rounded-lg" 
          style={{ 
            backgroundColor: colors.accent,
            fontFamily: font,
            color: colors.text
          }}
        >
          <style>
            {`
              .custom-html-content h1, .custom-html-content h2, .custom-html-content h3, .custom-html-content h4, .custom-html-content h5, .custom-html-content h6 {
                color: ${colors.primary};
                margin-bottom: 0.5rem;
                font-family: ${font};
              }
              .custom-html-content p {
                color: ${colors.text};
                margin-bottom: 0.5rem;
                font-family: ${font};
              }
              .custom-html-content a {
                color: ${colors.secondary};
                text-decoration: underline;
              }
              .custom-html-content ul, .custom-html-content ol {
                color: ${colors.text};
                padding-left: 1rem;
                font-family: ${font};
              }
              .custom-html-content code {
                background-color: ${colors.primary}20;
                color: ${colors.primary};
                padding: 0.125rem 0.25rem;
                border-radius: 0.25rem;
                font-family: monospace;
              }
            `}
          </style>
          <StableHtmlContent htmlContent={customHtmlData.html_content} />
        </div>
      </div>
    );
  };

  const renderQrShareSection = (qrData: any) => {
    if (!qrData.enable_qr) return null;
    
    return (
      <div className="px-6 py-4 bg-white" style={{ borderBottom: `1px solid ${colors.accent}` }}>
        <h3 className="font-semibold text-sm mb-3 flex items-center" style={{ color: colors.primary, fontFamily: font }}>
          <QrCode className="w-4 h-4 mr-2" />
          {qrData.qr_title || t('Share QR Code')}
        </h3>
        <div className="text-center p-4 rounded-lg" style={{ backgroundColor: colors.accent }}>
          {qrData.qr_description && (
            <p className="text-xs mb-3" style={{ color: colors.text, fontFamily: font }}>
              {qrData.qr_description}
            </p>
          )}
          <Button 
            size="sm" 
            className="w-full" 
            style={{ 
              backgroundColor: colors.primary, 
              color: 'white',
              fontFamily: font 
            }}
            onClick={() => setShowQrModal(true)}
          >
            <QrCode className="w-4 h-4 mr-2" />
            {t('Share QR Code')}
          </Button>
        </div>
      </div>
    );
  };

  const renderThankYouSection = (thankYouData: any) => {
    if (!thankYouData.message) return null;
    return (
      <div className="px-6 pb-2">
        <p className="text-xs text-center" style={{ color: colors.text + '80', fontFamily: font }}>
          {thankYouData.message}
        </p>
      </div>
    );
  };

  const copyrightSection = configSections.copyright;

  // Get ordered sections using the utility function
  const orderedSectionKeys = getSectionOrder(data.template_config || { sections: configSections, sectionSettings: configSections }, allSections);  
  
  return (
    <div className="w-full max-w-md mx-auto rounded-2xl overflow-hidden shadow-xl" style={{ 
      fontFamily: font,
      backgroundColor: colors.background || '#F8FAFC',
      border: `1px solid ${colors.accent}`,
      direction: isRTL ? 'rtl' : 'ltr'
    }}>
      {orderedSectionKeys
        .filter(key => key !== 'colors' && key !== 'font' && key !== 'copyright')
        .map((sectionKey) => (
          <React.Fragment key={sectionKey}>
            {renderSection(sectionKey)}
          </React.Fragment>
        ))}
      
      <div className="p-6 space-y-3" style={{ background: `linear-gradient(135deg, ${colors.primary}, ${colors.secondary})` }}>
        <Button 
          className="w-full h-12 font-semibold rounded-lg shadow-lg" 
          style={{ 
            backgroundColor: 'white',
            color: colors.primary,
            fontFamily: font
          }}
          onClick={() => typeof window !== "undefined" && window.dispatchEvent(new CustomEvent('openContactModal'))}
        >
          🚀 {t('Start Your Growth Journey')}
        </Button>
        <Button 
          className="w-full h-10 font-medium rounded-lg border-2" 
          style={{ 
            borderColor: 'white', 
            color: 'white',
            backgroundColor: 'transparent',
            fontFamily: font
          }}
          onClick={() => handleAppointmentBooking(configSections.appointments)}
        >
          📞 {t('Free Strategy Call')}
        </Button>
        
        <Button 
          size="sm" 
          variant="outline" 
          className="w-full flex items-center justify-center mt-4" 
          style={{ 
            borderColor: 'white', 
            color: 'white',
            backgroundColor: 'rgba(255,255,255,0.1)',
            fontFamily: font 
          }}
          onClick={() => {
            const contactData = {
              name: data.name || '',
              title: data.title || '',
              email: data.email || configSections.contact?.email || '',
              phone: data.phone || configSections.contact?.phone || '',
              website: data.website || configSections.contact?.website || '',
              location: configSections.contact?.location || ''
            };
            import('@/utils/vcfGenerator').then(module => {
                  module.downloadVCF(contactData);
                });
          }}
        >
          <UserPlus className="w-4 h-4 mr-2" />
          {t('Save Contact')}
        </Button>
      </div>
      
      {copyrightSection && (
        <div className="px-6 pb-4 pt-2 bg-white">
          {copyrightSection.text && (
            <p className="text-xs text-center" style={{ color: colors.text + '60', fontFamily: font }}>
              {copyrightSection.text}
            </p>
          )}
        </div>
      )}
      
      {/* QR Share Modal */}
      <QRShareModal
        isOpen={showQrModal}
        onClose={() => setShowQrModal(false)}
        url={typeof window !== 'undefined' ? window.location.href : ''}
        colors={colors}
        font={font}
        socialLinks={configSections.social?.social_links || []}
      />
    </div>
  );
}