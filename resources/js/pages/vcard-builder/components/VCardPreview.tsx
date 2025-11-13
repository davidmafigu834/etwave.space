import React from 'react';
import { getSectionOrder } from '@/utils/sectionHelpers';
import { businessTypeOptions } from '../business-templates';

// Import all template components
import FreelancerTemplate from './templates/FreelancerTemplate';
import DoctorTemplate from './templates/DoctorTemplate';
import RestaurantTemplate from './templates/RestaurantTemplate';
import RealEstateTemplate from './templates/RealEstateTemplate';
import FitnessTemplate from './templates/FitnessTemplate';
import PhotographyTemplate from './templates/PhotographyTemplate';
import LawFirmTemplate from './templates/LawFirmTemplate';
import CafeTemplate from './templates/CafeTemplate';
import SalonTemplate from './templates/SalonTemplate';
import ConstructionTemplate from './templates/ConstructionSalesTemplate';
import EventPlannerTemplate from './templates/EventPlannerTemplate';
import EcommerceTemplate from './templates/EcommerceTemplate';
import TravelTemplate from './templates/TravelTemplate';
import GymTemplate from './templates/GymTemplate';
import BakeryTemplate from './templates/BakeryTemplate';
import FitnessStudioTemplate from './templates/FitnessStudioTemplate';
import TechStartupTemplate from './templates/TechStartupTemplate';
import MusicArtistTemplate from './templates/MusicArtistTemplate';
import WeddingPlannerTemplate from './templates/WeddingPlannerTemplate';
import PetCareTemplate from './templates/PetCareTemplate';
import DigitalMarketingTemplate from './templates/DigitalMarketingTemplate';
import AutomotiveTemplate from './templates/AutomotiveTemplate';
import BeautyCosmeticsTemplate from './templates/BeautyCosmeticsTemplate';
import FoodDeliveryTemplate from './templates/FoodDeliveryTemplate';
import HomeServicesTemplate from './templates/HomeServicesTemplate';
import PersonalTrainerTemplate from './templates/PersonalTrainerTemplate';
import ConsultingTemplate from './templates/ConsultingTemplate';
import GraphicDesignTemplate from './templates/GraphicDesignTemplate';
import YogaWellnessTemplate from './templates/YogaWellnessTemplate';
import PodcastCreatorTemplate from './templates/PodcastCreatorTemplate';
import GamingStreamerTemplate from './templates/GamingStreamerTemplate';
import LifeCoachTemplate from './templates/LifeCoachTemplate';
import VeterinarianTemplate from './templates/VeterinarianTemplate';
import ArchitectDesignerTemplate from './templates/ArchitectDesignerTemplate';
import SolarInstallationTemplate from './templates/SolarInstallationTemplate';
import RetailShopTemplate from './templates/RetailShopTemplate';
import BoreholeDrillingTemplate from './templates/BoreholeDrillingTemplate';

interface VCardPreviewProps {
  businessType: string;
  data: any;
  template: any;
}

// Map of business types to their template components
const templateComponents: Record<string, React.ComponentType<any>> = {
  'freelancer': FreelancerTemplate,
  'doctor': DoctorTemplate,
  'restaurant': RestaurantTemplate,
  'realestate': RealEstateTemplate,
  'fitness': FitnessTemplate,
  'photography': PhotographyTemplate,
  'lawfirm': LawFirmTemplate,
  'cafe': CafeTemplate,
  'salon': SalonTemplate,
  'construction': ConstructionTemplate,
  'eventplanner': EventPlannerTemplate,
  'ecommerce': EcommerceTemplate,
  'travel': TravelTemplate,
  'gym': GymTemplate,
  'bakery': BakeryTemplate,
  'fitness-studio': FitnessStudioTemplate,
  'tech-startup': TechStartupTemplate,
  'music-artist': MusicArtistTemplate,
  'wedding-planner': WeddingPlannerTemplate,
  'pet-care': PetCareTemplate,
  'digital-marketing': DigitalMarketingTemplate,
  'automotive': AutomotiveTemplate,
  'beauty-cosmetics': BeautyCosmeticsTemplate,
  'food-delivery': FoodDeliveryTemplate,
  'home-services': HomeServicesTemplate,
  'personal-trainer': PersonalTrainerTemplate,
  'consulting': ConsultingTemplate,
  'graphic-design': GraphicDesignTemplate,
  'yoga-wellness': YogaWellnessTemplate,
  'podcast-creator': PodcastCreatorTemplate,
  'gaming-streamer': GamingStreamerTemplate,
  'life-coach': LifeCoachTemplate,
  'veterinarian': VeterinarianTemplate,
  'architect-designer': ArchitectDesignerTemplate,
  'solar-installation': SolarInstallationTemplate,
  'retail-shop': RetailShopTemplate,
  'borehole-drilling': BoreholeDrillingTemplate
};

// Add debug logging function
const debugLog = (message: string, data?: any) => {
  if (process.env.NODE_ENV !== 'production') {
    console.log(`[VCardPreview] ${message}`, data || '');
  }
};

export default function VCardPreview({ businessType, data, template }: VCardPreviewProps) {
  debugLog('Rendering with props', { businessType, data: { ...data, config_sections: '...' }, template: template ? 'Template loaded' : 'No template' });
  
  // Ensure we have a valid business type
  const normalizedBusinessType = React.useMemo(() => {
    // Handle any business type aliases or fallbacks
    const type = (businessType || '').toLowerCase().trim();
    return type in templateComponents ? type : 'freelancer';
  }, [businessType]);
  
  // Debug log template selection
  React.useEffect(() => {
    debugLog('Template Selection', {
      businessType,
      normalizedBusinessType,
      isValidType: normalizedBusinessType in templateComponents,
      availableTemplates: Object.keys(templateComponents)
    });
  }, [businessType, normalizedBusinessType]);
  const resolveAssetUrl = (value: unknown): string => {
    if (!value || typeof value !== 'string') return '';

    const path = value.trim();
    if (!path) return '';

    if (/^https?:\/\//i.test(path) || /^data:/i.test(path)) {
      return path;
    }

    if (path.startsWith('//')) {
      return `${window.location.protocol}${path}`;
    }

    const isEmailLike = /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(path);
    if (isEmailLike) {
      return path;
    }

    const looksLikePath = path.startsWith('/') || path.startsWith('storage/') || path.startsWith('public/') || path.startsWith('media/') || /\.[a-zA-Z0-9]{2,4}$/.test(path);

    if (!looksLikePath) {
      return value as string;
    }

    const appSettings = (window as any).appSettings || {};
    const baseCandidates = [
      appSettings.imageUrl,
      appSettings.baseUrl,
      (window as any).baseUrl,
      (window as any).APP_URL,
      `${window.location.origin}${document.querySelector('base')?.getAttribute('href') || ''}`,
      window.location.origin
    ].filter(Boolean) as string[];

    for (const candidate of baseCandidates) {
      try {
        const formattedBase = candidate.endsWith('/') ? candidate : `${candidate}/`;
        return new URL(path.replace(/^\/+/, ''), formattedBase).toString();
      } catch (error) {
        continue;
      }
    }

    try {
      return new URL(path, window.location.origin).toString();
    } catch (error) {
      return value as string;
    }
  };

  // Convert relative path to full URL for display
  const getDisplayUrl = (path: any): string => resolveAssetUrl(path);

  // Process all URLs in config_sections recursively
  const processUrls = (obj: any): any => {
    if (!obj) return obj;
    if (typeof obj === 'string') {
      // Convert relative storage paths to full URLs
      return getDisplayUrl(obj);
    }
    if (Array.isArray(obj)) {
      return obj.map(processUrls);
    }
    if (typeof obj === 'object') {
      const processed: any = {};
      for (const [key, value] of Object.entries(obj)) {
        const isImageLikeKey =
          key === 'profile_image' ||
          key === 'og_image' ||
          key.toLowerCase().includes('image') ||
          key.toLowerCase().includes('logo') ||
          key.toLowerCase().includes('icon');

        if (isImageLikeKey) {
          if (typeof value === 'string') {
            processed[key] = getDisplayUrl(value);
          } else if (Array.isArray(value)) {
            processed[key] = value.map((item) => processUrls(item));
          } else if (value && typeof value === 'object') {
            processed[key] = processUrls(value);
          } else {
            processed[key] = value;
          }
        } else {
          processed[key] = processUrls(value);
        }
      }
      return processed;
    }
    return obj;
  };

  // Process URLs in config_sections and template defaults
  const processedConfigSections = processUrls(data.config_sections);
  const processedTemplateDefaults = React.useMemo(() => processUrls(template?.defaultData || {}), [template]);
  const templateSectionKeys = React.useMemo<Set<string>>(
    () => new Set<string>((template?.sections || []).map((section: any) => String(section.key))),
    [template]
  );

  const defaultKeys = React.useMemo(() => {
    if (!processedTemplateDefaults || typeof processedTemplateDefaults !== 'object') {
      return new Set<string>();
    }
    return new Set(Object.keys(processedTemplateDefaults as Record<string, unknown>));
  }, [processedTemplateDefaults]);

  const mergeWithDefaults = React.useCallback((defaults: any, user: any): any => {
    if (user == null) {
      return defaults;
    }

    if (Array.isArray(user)) {
      // If user explicitly set an empty array, respect it (remove section)
      if (user.length === 0) {
        return [];
      }
      return user;
    }

    if (typeof user !== 'object') {
      if (user === null || typeof user === 'undefined') {
        return defaults;
      }
      return user;
    }

    const result: Record<string, any> = { ...(defaults && typeof defaults === 'object' ? defaults : {}) };
    const userEntries = Object.entries(user as Record<string, any>);
    userEntries.forEach(([key, value]) => {
      const defaultValue = defaults ? (defaults as Record<string, any>)[key] : undefined;
      if (Array.isArray(value)) {
        result[key] = value.length > 0 ? value : (Array.isArray(defaultValue) ? defaultValue : value);
        return;
      }

      if (value && typeof value === 'object') {
        result[key] = mergeWithDefaults(defaultValue, value);
        return;
      }

      if (value === '' || value === null || typeof value === 'undefined') {
        if (defaultValue !== undefined) {
          result[key] = defaultValue;
        }
        return;
      }

      result[key] = value;
    });

    return result;
  }, []);

  const mergedConfigSections = React.useMemo(() => {
    const defaults = processedTemplateDefaults && typeof processedTemplateDefaults === 'object'
      ? (processedTemplateDefaults as Record<string, any>)
      : {};

    if (!processedConfigSections || typeof processedConfigSections !== 'object') {
      return { ...defaults };
    }

    const result: Record<string, any> = {};
    const essentialKeys = new Set(['colors', 'font', 'language', 'pwa']);
    const hasTemplateDefinitions = templateSectionKeys.size > 0 || defaultKeys.size > 0;

    const keys = new Set([
      ...Object.keys(defaults),
      ...Object.keys(processedConfigSections as Record<string, any>)
    ]);

    keys.forEach((key) => {
      const isTemplateSection = templateSectionKeys.has(key);
      const isDefaultKey = defaultKeys.has(key);
      const isEssential = essentialKeys.has(key);

      const shouldInclude = hasTemplateDefinitions
        ? (isTemplateSection || isDefaultKey || isEssential)
        : true;

      if (!shouldInclude) {
        return;
      }

      const defaultValue = defaults[key];
      const userValue = (processedConfigSections as Record<string, any>)[key];
      result[key] = mergeWithDefaults(defaultValue, userValue);
    });

    return result;
  }, [processedConfigSections, processedTemplateDefaults, templateSectionKeys, defaultKeys, mergeWithDefaults]);
  
  const resolvedAllowedSections = React.useMemo(() => {
    const configured = data.template_config?.allowedSections;
    if (!configured || (Array.isArray(configured) && configured.length === 0)) {
      return undefined;
    }

    const list = (Array.isArray(configured) ? configured : [configured]).filter(
      (value): value is string => typeof value === 'string' && value.trim().length > 0
    );

    const union = new Set<string>(list);

    // Always include template-defined sections, defaults, and current config keys
    templateSectionKeys.forEach((key) => union.add(key));
    if (processedTemplateDefaults && typeof processedTemplateDefaults === 'object') {
      Object.keys(processedTemplateDefaults as Record<string, any>).forEach((key) => union.add(key));
    }
    if (mergedConfigSections && typeof mergedConfigSections === 'object') {
      Object.keys(mergedConfigSections as Record<string, any>).forEach((key) => union.add(key));
    }

    // Ensure essential settings are never filtered out
    ['colors', 'font', 'language', 'pwa', 'seo', 'pixels', '_allowed_sections'].forEach((key) => union.add(key));

    return Array.from(union);
  }, [data.template_config?.allowedSections, templateSectionKeys, processedTemplateDefaults, mergedConfigSections]);

  // Filter config_sections based on allowed sections
  const allowedSections = resolvedAllowedSections;
  const filteredConfigSections = React.useMemo(() => {
    const sourceSections = mergedConfigSections as Record<string, any>;
    if (!sourceSections) {
      return mergedConfigSections;
    }

    if (!allowedSections || allowedSections.length === 0) {
      return sourceSections;
    }

    const filtered: any = {};
    // Always include essential sections
    const essentialSections = ['colors', 'font', 'language', 'pwa'];

    const hasContent = (value: any): boolean => {
      if (value === null || typeof value === 'undefined') {
        return false;
      }
      if (Array.isArray(value)) {
        return value.length > 0;
      }
      if (typeof value === 'object') {
        return Object.keys(value).length > 0;
      }
      return true;
    };

    Object.keys(sourceSections).forEach(key => {
      if (
        allowedSections.includes(key) ||
        essentialSections.includes(key) ||
        hasContent(sourceSections[key])
      ) {
        filtered[key] = sourceSections[key];
      }
    });

    return filtered;
  }, [mergedConfigSections, allowedSections]);

  const mergedVisualSettings = React.useMemo(() => {
    const sourceSections = filteredConfigSections as Record<string, any>;
    const baseColors = template?.defaultColors || {};
    const currentColors = (sourceSections && sourceSections.colors) || (mergedConfigSections as Record<string, any>)?.colors || {};

    const mergedColors = {
      ...baseColors,
      ...currentColors
    };

    const mergedFont = sourceSections?.font || (mergedConfigSections as Record<string, any>)?.font || template?.defaultFont || 'Inter, sans-serif';

    const nextSections = {
      ...sourceSections,
      colors: mergedColors,
      font: mergedFont
    };

    return nextSections;
  }, [filteredConfigSections, mergedConfigSections, template?.defaultColors, template?.defaultFont]);

  // Filter template sections as well
  const filteredTemplate = React.useMemo(() => {
    if (!template || !allowedSections || allowedSections.length === 0) {
      return template;
    }
    
    return {
      ...template,
      sections: template.sections?.filter((section: any) =>
        allowedSections.includes(section.key) || ['colors', 'font', 'language', 'pwa'].includes(section.key)
      ) || []
    };
  }, [template, allowedSections]);

  // Ensure template_config has sectionSettings
  const enhancedData = {
    ...data,
    config_sections: mergedVisualSettings,
    template_config: {
      ...data.template_config,
      sections: mergedVisualSettings,
      sectionSettings: data.template_config?.sectionSettings || {},
      allowedSections: resolvedAllowedSections
    }
  };

  const appliedFont = mergedVisualSettings?.font || template?.defaultFont || 'Inter, sans-serif';

  // Get the template component
  const TemplateComponent = React.useMemo(() => {
    const component = templateComponents[normalizedBusinessType];
    if (!component) {
      debugLog(`Template not found for type: ${normalizedBusinessType}, falling back to freelancer`);
      return FreelancerTemplate;
    }
    return component;
  }, [normalizedBusinessType]);
  
  // Debug log template data
  React.useEffect(() => {
    if (data?.config_sections?.header) {
      debugLog('Template Header Data', {
        headerName: data.config_sections.header.name,
        businessType: normalizedBusinessType
      });
    }
  }, [data?.config_sections?.header, normalizedBusinessType]);

  if (typeof window !== 'undefined') {
    // eslint-disable-next-line no-console
    console.log('[VCardPreview] sample header', {
      businessType,
      templateType: normalizedBusinessType,
      headerName: enhancedData.config_sections?.header?.name,
      sourceHeader: data.config_sections?.header?.name,
      defaultHeader: processedTemplateDefaults && (processedTemplateDefaults as Record<string, any>)?.header?.name,
    });
  }

  try {
    return (
      <div className="w-full overflow-x-hidden" style={{ fontFamily: appliedFont }}>
        <TemplateComponent 
          data={enhancedData} 
          template={filteredTemplate} 
        />
      </div>
    );
  } catch (error) {
    console.error('Error rendering template:', error);
    return (
      <div className="p-4 bg-red-50 text-red-800 rounded-lg m-4">
        <h3 className="font-bold">Template Rendering Error</h3>
        <p className="text-sm mb-2">Failed to render the template. Please try again or contact support.</p>
        <p className="text-xs opacity-75">Error: {error.message}</p>
      </div>
    );
  }
  
}

// Common utility function for handling appointment bookings
export const handleAppointmentBooking = (appointmentsData: any) => {
  if (appointmentsData?.booking_url) {
    // If there's a booking URL (like Calendly), open it in a new tab
    typeof window !== "undefined" && window.open(appointmentsData.booking_url, '_blank', 'noopener,noreferrer');
  } else {
    // Otherwise, open the appointment modal
    typeof window !== "undefined" && window.dispatchEvent(new CustomEvent('openAppointmentModal'));
  }
};