import { Head, Link } from '@inertiajs/react';
import {
  ArrowLeft,
  Star,
  Eye,
  Phone,
  Mail,
  Globe,
  MapPin,
  Clock,
  Calendar,
  User,
  CheckCircle,
  Briefcase,
  SunMedium,
  Droplet
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useTranslation } from 'react-i18next';
import { useFavicon } from '@/hooks/use-favicon';

interface Business {
  id: number;
  name: string;
  business_type: string;
  slug: string;
  url_prefix: string;
  is_featured: boolean;
  is_verified: boolean;
  rating: number;
  rating_count: number;
  view_count: number;
  directory_description?: string;
  config_sections: any;
  created_at: string;
}

interface Props {
  business: Business;
}

export default function BusinessDirectoryShow({ business }: Props) {
  const { t } = useTranslation();
  
  // Apply favicon from brand settings
  useFavicon();
  
  const getBusinessUrl = () => {
    if (business.url_prefix && business.url_prefix !== 'v') {
      return route('public.vcard.show', { prefix: business.url_prefix, slug: business.slug });
    }
    return route('public.vcard.show.direct', { slug: business.slug });
  };

  const getContactInfo = () => {
    const contact = business.config_sections?.contact || {};
    return {
      phone: contact.phone,
      email: contact.email,
      website: contact.website,
      address: contact.address || contact.clinic_address,
    };
  };

  const getBusinessHours = () => {
    return business.config_sections?.business_hours?.hours || [];
  };

  const getServices = () => {
    const normalized: Array<Record<string, any>> = [];

    const pushService = (item: any, overrides: Record<string, any> = {}) => {
      if (!item) return;
      const title = overrides.title || item.title || item.name;
      if (!title) return;
      normalized.push({
        title,
        name: item.name || title,
        description: overrides.description ?? item.description ?? item.summary ?? '',
        price: overrides.price ?? item.price,
        duration: overrides.duration ?? item.duration,
        meta: overrides.meta || [],
        audience: overrides.audience || item.audience
      });
    };

    const serviceList = business.config_sections?.services?.service_list;
    if (Array.isArray(serviceList)) {
      serviceList.forEach((service) => pushService(service));
    }

    const specialtyList = business.config_sections?.specialties?.specialty_list;
    if (Array.isArray(specialtyList)) {
      specialtyList.forEach((service) => pushService(service));
    }

    const menuItems = business.config_sections?.menu_highlights?.menu_items;
    if (Array.isArray(menuItems)) {
      menuItems.forEach((item) => pushService(item));
    }

    const packageList = business.config_sections?.packages?.package_list;
    if (Array.isArray(packageList)) {
      packageList.forEach((pkg) => {
        const includes = typeof pkg.includes === 'string' ? pkg.includes.split('\n').filter(Boolean) : [];
        pushService(pkg, {
          title: pkg.name,
          description: includes.length > 0 ? includes.join('\n') : pkg.description,
          price: pkg.price,
          duration: pkg.duration,
          meta: [pkg.audience].filter(Boolean)
        });
      });
    }

    const residentialSolutions = business.config_sections?.residential_services?.solutions;
    if (Array.isArray(residentialSolutions)) {
      residentialSolutions.forEach((solution) => {
        pushService(solution, {
          title: solution.title,
          description: solution.description,
          meta: [
            solution.system_size ? `${t('System Size')}: ${solution.system_size}` : null,
            solution.estimated_payback ? `${t('Payback')}: ${solution.estimated_payback}` : null
          ].filter(Boolean)
        });
      });
    }

    const commercialSolutions = business.config_sections?.commercial_services?.solutions;
    if (Array.isArray(commercialSolutions)) {
      commercialSolutions.forEach((solution) => {
        pushService(solution, {
          title: solution.title,
          description: solution.description,
          meta: [
            solution.system_size ? `${t('System Size')}: ${solution.system_size}` : null,
            solution.industry_focus ? `${t('Industry')}: ${solution.industry_focus}` : null
          ].filter(Boolean)
        });
      });
    }

    return normalized.slice(0, 6);
  };

  const getAboutInfo = () => {
    const aboutSection = business.config_sections?.about || {};
    const description = aboutSection.description || aboutSection.mission_statement || '';
    const highlights = Array.isArray(aboutSection.highlights)
      ? aboutSection.highlights
      : Array.isArray(aboutSection.value_props)
        ? aboutSection.value_props
        : [];

    return {
      ...aboutSection,
      description,
      highlights
    };
  };

  const hasSolarHighlights = () => {
    if (business.business_type !== 'solar-installation') return false;
    const header = business.config_sections?.header || {};
    return Boolean(header.badges?.length || header.highlight_stats?.length);
  };

  const getSolarHighlights = () => {
    const header = business.config_sections?.header || {};
    const badges = Array.isArray(header.badges) ? header.badges.slice(0, 4) : [];
    const stats = Array.isArray(header.highlight_stats) ? header.highlight_stats.slice(0, 4) : [];
    return { badges, stats };
  };

  const hasBoreholeHighlights = () => {
    if (business.business_type !== 'borehole-drilling') return false;
    const services = business.config_sections?.services?.service_list || [];
    const whyChoose = business.config_sections?.why_choose_us?.reasons || [];
    return services.length > 0 || whyChoose.length > 0;
  };

  const getBoreholeHighlights = () => {
    const services = Array.isArray(business.config_sections?.services?.service_list)
      ? business.config_sections.services.service_list.slice(0, 4)
      : [];
    const reasons = Array.isArray(business.config_sections?.why_choose_us?.reasons)
      ? business.config_sections.why_choose_us.reasons.slice(0, 6)
      : [];
    return { services, reasons };
  };

  const solarHighlights = hasSolarHighlights() ? getSolarHighlights() : null;
  const boreholeHighlights = hasBoreholeHighlights() ? getBoreholeHighlights() : null;

  const contact = getContactInfo();
  const hours = getBusinessHours();
  const services = getServices();
  const about = getAboutInfo();

  return (
    <>
      <Head title={`${business.name} - Business Directory`} />
      
      <div className="min-h-screen bg-gray-50">
        {/* Hero Header */}
        <div className="bg-white border-b shadow-sm">
          
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="mb-4">
              <Button variant="outline" size="sm" asChild>
                <Link href={route('directory.index')}>
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  {t("Back to Directory")}
                </Link>
              </Button>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-4">
                <div className="flex flex-wrap items-start gap-3 mb-3">
                  <h1 className="text-3xl lg:text-4xl font-bold text-gray-900">{business.name}</h1>
                  <div className="flex gap-2">
                    {business.is_verified && (
                      <Badge className="bg-green-100 text-green-800 border-green-200">
                        ✓ {t("Verified")}
                      </Badge>
                    )}
                    {business.is_featured && (
                      <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">
                        ⭐ {t("Featured")}
                      </Badge>
                    )}
                  </div>
                </div>
                
                <p className="text-lg text-gray-600 capitalize mb-4">
                  {business.business_type.replace('-', ' ')}
                </p>
                
                <div className="flex flex-wrap items-center gap-4 mb-4">
                  {business.rating > 0 && (
                    <div className="flex items-center gap-2 bg-gray-100 rounded-lg px-3 py-1.5">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span className="font-semibold text-gray-900">{business.rating}</span>
                      <span className="text-gray-600 text-sm">({business.rating_count})</span>
                    </div>
                  )}
                  
                  <div className="flex items-center gap-2 bg-gray-100 rounded-lg px-3 py-1.5">
                    <Eye className="h-4 w-4 text-gray-600" />
                    <span className="text-gray-900 text-sm">{business.view_count} views</span>
                  </div>
                </div>
                
                {(business.directory_description || about.description) && (
                  <p className="text-gray-700 leading-relaxed">
                    {business.directory_description || about.description}
                  </p>
                )}
                {(solarHighlights || boreholeHighlights) && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {solarHighlights && (
                    <Card className="shadow-sm border">
                      <CardHeader className="pb-3">
                        <CardTitle className="flex items-center gap-2 text-base">
                          <SunMedium className="h-4 w-4 text-amber-500" />
                          {t('Solar Highlights')}
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3 pt-0">
                        {solarHighlights.badges.length > 0 && (
                          <div className="flex flex-wrap gap-2">
                            {solarHighlights.badges.map((badge: any, index: number) => (
                              <Badge key={index} className="bg-amber-100 text-amber-800 border-amber-200">
                                {badge.icon && <span className="mr-1">{badge.icon}</span>}
                                {badge.label}
                              </Badge>
                            ))}
                          </div>
                        )}
                        {solarHighlights.stats.length > 0 && (
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            {solarHighlights.stats.map((stat: any, index: number) => (
                              <div key={index} className="p-3 bg-blue-50 rounded-lg border border-blue-100">
                                <p className="text-xl font-semibold text-blue-900">{stat.value}</p>
                                <p className="text-sm text-blue-700">{stat.label}</p>
                              </div>
                            ))}
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  )}

                  {boreholeHighlights && (
                    <Card className="shadow-sm border">
                      <CardHeader className="pb-3">
                        <CardTitle className="flex items-center gap-2 text-base">
                          <Droplet className="h-4 w-4 text-sky-600" />
                          {t('Water Solution Highlights')}
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3 pt-0">
                        {boreholeHighlights.services.length > 0 && (
                          <div className="space-y-2">
                            {boreholeHighlights.services.map((service: any, index: number) => (
                              <div key={index} className="p-3 border border-sky-100 rounded-lg">
                                <p className="font-medium text-sky-900">
                                  {service.icon && <span className="mr-2">{service.icon}</span>}
                                  {service.title}
                                </p>
                                {service.description && (
                                  <p className="text-sm text-sky-700 mt-1">{service.description}</p>
                                )}
                              </div>
                            ))}
                          </div>
                        )}
                        {boreholeHighlights.reasons.length > 0 && (
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                            {boreholeHighlights.reasons.map((reason: any, index: number) => (
                              <div key={index} className="flex items-start gap-2 text-sm text-gray-700">
                                <span className="text-green-600">{reason.icon || '•'}</span>
                                <div>
                                  <p className="font-medium text-gray-900">{reason.title}</p>
                                  {reason.description && <p className="text-gray-600 text-xs mt-0.5">{reason.description}</p>}
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  )}
                  </div>
                )}
              </div>

              <div>
                <Card className="shadow-sm border">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base flex items-center gap-2">
                      <Phone className="h-4 w-4 text-blue-600" />
                      {t("Contact")}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3 pt-0">
                    {contact.phone && (
                      <div className="flex items-center gap-3">
                        <Phone className="h-4 w-4 text-blue-600" />
                        <a href={`tel:${contact.phone}`} className="text-blue-700 hover:text-blue-800 text-sm">
                          {contact.phone}
                        </a>
                      </div>
                    )}
                    
                    {contact.email && (
                      <div className="flex items-center gap-3">
                        <Mail className="h-4 w-4 text-green-600" />
                        <a href={`mailto:${contact.email}`} className="text-green-700 hover:text-green-800 text-sm truncate">
                          {contact.email}
                        </a>
                      </div>
                    )}
                    
                    {contact.website && (
                      <div className="flex items-center gap-3">
                        <Globe className="h-4 w-4 text-purple-600" />
                        <a href={contact.website} target="_blank" rel="noopener noreferrer" className="text-purple-700 hover:text-purple-800 text-sm">
                          {t("Visit Website")}
                        </a>
                      </div>
                    )}
                    
                    {contact.address && (
                      <div className="flex items-start gap-3">
                        <MapPin className="h-4 w-4 text-orange-600 mt-0.5" />
                        <span className="text-orange-700 text-sm leading-relaxed">{contact.address}</span>
                      </div>
                    )}
                    
                    <div className="pt-3">
                      <Button className="w-full" size="sm" onClick={() => window.open(getBusinessUrl(), '_blank')}>
                        <Globe className="h-4 w-4 mr-2" />
                        {t("View Digital Card")}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            <div className="lg:col-span-3 space-y-6">
              {/* About */}
              {about.description && (
                <Card className="shadow-sm border">
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <User className="h-5 w-5 text-blue-600" />
                      {t("About")}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <p className="text-gray-700 whitespace-pre-line leading-relaxed mb-4">{about.description}</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {about.qualifications && (
                        <div className="p-3 bg-green-50 rounded-lg">
                          <h4 className="font-medium mb-1 text-green-800 flex items-center gap-2 text-sm">
                            <CheckCircle className="h-4 w-4" />
                            {t("Qualifications")}
                          </h4>
                          <p className="text-green-700 text-sm">{about.qualifications}</p>
                        </div>
                      )}
                      {about.experience_years && (
                        <div className="p-3 bg-blue-50 rounded-lg">
                          <h4 className="font-medium mb-1 text-blue-800 flex items-center gap-2 text-sm">
                            <Clock className="h-4 w-4" />
                            {t("Experience")}
                          </h4>
                          <p className="text-blue-700 font-medium text-sm">{about.experience_years} {t("years")}</p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Services */}
              {services.length > 0 && (
                <Card className="shadow-sm border">
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <Briefcase className="h-5 w-5 text-purple-600" />
                      {business.business_type === 'doctor' ? 'Services' : 
                       business.business_type === 'restaurant' ? 'Menu' : 'Services'}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {services.map((service: any, index: number) => (
                        <div key={index} className="p-4 border border-gray-200 rounded-lg hover:border-purple-300 transition-colors">
                          <h4 className="font-medium mb-2 text-gray-800">{service.name || service.title}</h4>
                          {service.description && (
                            <p className="text-gray-600 mb-3 text-sm leading-relaxed">{service.description}</p>
                          )}
                          <div className="flex justify-between items-center">
                            {service.price && (
                              <span className="text-sm font-semibold text-green-600">{service.price}</span>
                            )}
                            {service.duration && (
                              <span className="text-xs text-gray-500">{service.duration}</span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>

            <div className="space-y-6">
              {/* Business Hours */}
              {hours.length > 0 && (
                <Card className="shadow-sm border">
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center gap-2 text-base">
                      <Clock className="h-4 w-4 text-orange-600" />
                      {t("Hours")}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="space-y-2">
                      {hours.map((hour: any, index: number) => (
                        <div key={index} className="flex justify-between items-center py-1">
                          <span className="capitalize text-sm text-gray-700">{hour.day}</span>
                          <span className={`text-sm font-medium ${hour.is_closed ? 'text-red-600' : 'text-green-600'}`}>
                            {hour.is_closed ? 'Closed' : `${hour.open_time} - ${hour.close_time}`}
                          </span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Quick Actions */}
              <Card className="shadow-sm border">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-base">
                    <Calendar className="h-4 w-4 text-primary" />
                    {t("Actions")}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 pt-0">
                  <Button className="w-full" size="sm" onClick={() => window.open(getBusinessUrl(), '_blank')}>
                    <Globe className="h-4 w-4 mr-2" />
                    {t("View Profile")}
                  </Button>
                  
                  {contact.phone && (
                    <Button variant="outline" className="w-full" size="sm" onClick={() => window.location.href = `tel:${contact.phone}`}>
                      <Phone className="h-4 w-4 mr-2" />
                      {t("Call")}
                    </Button>
                  )}
                  
                  {contact.email && (
                    <Button variant="outline" className="w-full" size="sm" onClick={() => window.location.href = `mailto:${contact.email}`}>
                      <Mail className="h-4 w-4 mr-2" />
                      {t("Email")}
                    </Button>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}