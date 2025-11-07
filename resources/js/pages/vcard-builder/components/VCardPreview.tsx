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
import ConstructionTemplate from './templates/ConstructionTemplate';
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

export default function VCardPreview({ businessType, data, template }: VCardPreviewProps) {
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
  const templateSectionKeys = React.useMemo(() => new Set((template?.sections || []).map((section: any) => section.key)), [template]);

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
  
  // Filter config_sections based on allowed sections
  const allowedSections = data.template_config?.allowedSections;
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
      sectionSettings: data.template_config?.sectionSettings || {}
    }
  };

  const appliedFont = mergedVisualSettings?.font || template?.defaultFont || 'Inter, sans-serif';

  // Check if the business type exists in our template components
  const isValidType = businessType in templateComponents;
  const type = isValidType ? businessType : 'freelancer'; // Default to freelancer if invalid
  
  // Debug logging
  console.log('VCardPreview Template Selection:', {
    businessType,
    type,
    isValidType,
    availableTemplates: Object.keys(templateComponents)
  });
  
  // Get the template component
  const TemplateComponent = templateComponents[type] || FreelancerTemplate;

  if (typeof window !== 'undefined') {
    // eslint-disable-next-line no-console
    console.log('[VCardPreview] sample header', {
      businessType,
      templateType: type,
      headerName: enhancedData.config_sections?.header?.name,
      sourceHeader: data.config_sections?.header?.name,
      defaultHeader: processedTemplateDefaults && (processedTemplateDefaults as Record<string, any>)?.header?.name,
    });
  }

  return (
    <div className="w-full overflow-x-hidden" style={{ fontFamily: appliedFont }}>
      <TemplateComponent data={enhancedData} template={filteredTemplate} />
    </div>
  );
  
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