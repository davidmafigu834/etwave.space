import { freelancerTemplate } from './freelancer';
import { doctorTemplate } from './doctor';
import { restaurantTemplate } from './restaurant';
import { realEstateTemplate } from './realestate';
import { fitnessTemplate } from './fitness';
import { photographyTemplate } from './photography';
import { lawfirmTemplate } from './lawfirm';
import { cafeTemplate } from './cafe';
import { salonTemplate } from './salon';
import { constructionSalesTemplate } from './construction-sales';
import { eventplannerTemplate } from './eventplanner';
import { ecommerceTemplate } from './ecommerce';
import { travelTemplate } from './travel';
import { gymTemplate } from './gym';
import { bakeryTemplate } from './bakery';
import { fitnessStudioTemplate } from './fitness-studio';
import { techStartupTemplate } from './tech-startup';
import { musicArtistTemplate } from './music-artist';
import { weddingPlannerTemplate } from './wedding-planner';
import { petCareTemplate } from './pet-care';
import { digitalMarketingTemplate } from './digital-marketing';
import { automotiveTemplate } from './automotive';
import { beautyCosmeticsTemplate } from './beauty-cosmetics';
import { foodDeliveryTemplate } from './food-delivery';
import { homeServicesTemplate } from './home-services';
import { personalTrainerTemplate } from './personal-trainer';
import { consultingTemplate } from './consulting';
import { graphicDesignTemplate } from './graphic-design';
import { yogaWellnessTemplate } from './yoga-wellness';
import { podcastCreatorTemplate } from './podcast-creator';
import { gamingStreamerTemplate } from './gaming-streamer';
import { lifeCoachTemplate } from './life-coach';
import { veterinarianTemplate } from './veterinarian';
import { architectDesignerTemplate } from './architect-designer';
import { solarInstallationTemplate } from './solar-installation';
import { retailShopTemplate } from './retail-shop';
import { boreholeDrillingTemplate } from './borehole-drilling';

export const BUSINESS_TYPE_ALIASES: Record<string, string> = {
  technology: 'tech-startup',
  tech: 'tech-startup',
  software: 'tech-startup',
  developer: 'tech-startup',
  marketing: 'digital-marketing',
  ecommerce: 'ecommerce',
  'e-commerce': 'ecommerce',
  personaltrainer: 'personal-trainer',
  personaltrainercoach: 'personal-trainer',
  'personal-trainer-coach': 'personal-trainer',
  salonspa: 'salon',
  barbershop: 'salon',
  barber: 'salon',
  lawyer: 'lawfirm',
  attorney: 'lawfirm',
  'construction-sales': 'construction',
  'construction sales': 'construction',
  solar: 'solar-installation',
  photovoltaics: 'solar-installation',
  'solar-energy': 'solar-installation',
  borehole: 'borehole-drilling',
  drilling: 'borehole-drilling',
  water: 'borehole-drilling',
  'water-drilling': 'borehole-drilling'
};

export interface BusinessTemplateOption {
  value: string;
  label: string;
  themeNumber?: number;
  icon?: string;
}

export const businessTemplates = {
  'freelancer': freelancerTemplate,
  'doctor': doctorTemplate,
  'restaurant': restaurantTemplate,
  'realestate': realEstateTemplate,
  'fitness': fitnessTemplate,
  'photography': photographyTemplate,
  'lawfirm': lawfirmTemplate,
  'cafe': cafeTemplate,
  'salon': salonTemplate,
  'construction': constructionSalesTemplate,
  'eventplanner': eventplannerTemplate,
  'ecommerce': ecommerceTemplate,
  'travel': travelTemplate,
  'gym': gymTemplate,
  'bakery': bakeryTemplate,
  'fitness-studio': fitnessStudioTemplate,
  'tech-startup': techStartupTemplate,
  'music-artist': musicArtistTemplate,
  'wedding-planner': weddingPlannerTemplate,
  'pet-care': petCareTemplate,
  'digital-marketing': digitalMarketingTemplate,
  'automotive': automotiveTemplate,
  'beauty-cosmetics': beautyCosmeticsTemplate,
  'food-delivery': foodDeliveryTemplate,
  'home-services': homeServicesTemplate,
  'personal-trainer': personalTrainerTemplate,
  'consulting': consultingTemplate,
  'graphic-design': graphicDesignTemplate,
  'yoga-wellness': yogaWellnessTemplate,
  'podcast-creator': podcastCreatorTemplate,
  'gaming-streamer': gamingStreamerTemplate,
  'life-coach': lifeCoachTemplate,
  'veterinarian': veterinarianTemplate,
  'architect-designer': architectDesignerTemplate,
  'solar-installation': solarInstallationTemplate,
  'retail-shop': retailShopTemplate,
  'borehole-drilling': boreholeDrillingTemplate
};

export const resolveBusinessType = (value?: string | null): string => {
  if (!value) {
    return 'freelancer';
  }

  const raw = value.toString().trim();
  if (!raw) {
    return 'freelancer';
  }

  const normalized = raw
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/_+/g, '-');

  const aliasTarget = BUSINESS_TYPE_ALIASES[normalized];
  if (aliasTarget && businessTemplates[aliasTarget as keyof typeof businessTemplates]) {
    return aliasTarget;
  }

  if (businessTemplates[normalized as keyof typeof businessTemplates]) {
    return normalized;
  }

  if (businessTemplates[raw as keyof typeof businessTemplates]) {
    return raw;
  }

  return 'freelancer';
};

export const businessTypeOptions: BusinessTemplateOption[] = [
  { value: 'freelancer', label: 'Freelancer', themeNumber: 1, icon: '💼' },
  { value: 'doctor', label: 'Doctor/Medical', themeNumber: 2, icon: '👨⚕️' },
  { value: 'restaurant', label: 'Restaurant', themeNumber: 3, icon: '🍽️' },
  { value: 'realestate', label: 'Real Estate Agent', themeNumber: 4, icon: '🏠' },
  { value: 'fitness', label: 'Fitness Trainer', themeNumber: 5, icon: '💪' },
  { value: 'photography', label: 'Photography', themeNumber: 6, icon: '📸' },
  { value: 'lawfirm', label: 'Law Firm', themeNumber: 7, icon: '⚖️' },
  { value: 'cafe', label: 'Cafe & Coffee Shop', themeNumber: 8, icon: '☕' },
  { value: 'salon', label: 'Salon & Spa', themeNumber: 9, icon: '💇♀️' },
  { value: 'construction', label: 'Construction Company', themeNumber: 10, icon: '🏗️' },
  { value: 'eventplanner', label: 'Event Planner', themeNumber: 11, icon: '🎉' },
  { value: 'ecommerce', label: 'E-commerce Store', themeNumber: 12, icon: '🛍️' },
  { value: 'travel', label: 'Travel Agency', themeNumber: 13, icon: '✈️' },
  { value: 'gym', label: 'Fitness Studio/Gym', themeNumber: 14, icon: '🏋️♀️' },
  { value: 'bakery', label: 'Bakery & Pastry Shop', themeNumber: 15, icon: '🍰' },
  { value: 'fitness-studio', label: 'Modern Fitness Studio', themeNumber: 16, icon: '🤸♀️' },
  { value: 'tech-startup', label: 'Tech Startup/SaaS', themeNumber: 17, icon: '💻' },
  { value: 'music-artist', label: 'Music Artist/Band', themeNumber: 18, icon: '🎵' },
  { value: 'wedding-planner', label: 'Wedding Planner', themeNumber: 19, icon: '💒' },
  { value: 'pet-care', label: 'Pet Care Services', themeNumber: 20, icon: '🐶' },
  { value: 'digital-marketing', label: 'Digital Marketing Agency', themeNumber: 21, icon: '📈' },
  { value: 'automotive', label: 'Automotive Services', themeNumber: 22, icon: '🚗' },
  { value: 'beauty-cosmetics', label: 'Beauty & Cosmetics', themeNumber: 23, icon: '💄' },
  { value: 'food-delivery', label: 'Food Delivery & Catering', themeNumber: 24, icon: '🍕' },
  { value: 'home-services', label: 'Home Services & Maintenance', themeNumber: 25, icon: '🔧' },
  { value: 'personal-trainer', label: 'Personal Trainer & Fitness Coach', themeNumber: 26, icon: '🏋️' },
  { value: 'consulting', label: 'Consulting & Professional Services', themeNumber: 27, icon: '📉' },
  { value: 'graphic-design', label: 'Graphic Design Studio', themeNumber: 28, icon: '🎨' },
  { value: 'yoga-wellness', label: 'Yoga & Wellness Studio', themeNumber: 29, icon: '🧘♀️' },
  { value: 'podcast-creator', label: 'Podcast Host & Content Creator', themeNumber: 30, icon: '🎧' },
  { value: 'gaming-streamer', label: 'Gaming Streamer & Esports', themeNumber: 31, icon: '🎮' },
  { value: 'life-coach', label: 'Life Coach & Motivational Speaker', themeNumber: 32, icon: '🌟' },
  { value: 'veterinarian', label: 'Veterinarian & Animal Care', themeNumber: 33, icon: '🐈' },
  { value: 'architect-designer', label: 'Architect & Interior Designer', themeNumber: 34, icon: '🏢' },
  { value: 'solar-installation', label: 'Solar Installation Company', themeNumber: 35, icon: '☀️' },
  { value: 'retail-shop', label: 'Trusted Retail Shop', themeNumber: 36, icon: '🛒' },
  { value: 'borehole-drilling', label: 'Borehole Drilling Services', themeNumber: 37, icon: '💧' }
];

export const mergeTemplateConfigWithDefaults = (templateKey: string, config?: Record<string, any>) => {
  const template = businessTemplates[templateKey as keyof typeof businessTemplates];
  if (!template) return config || {};

  const defaults = (template.defaultData || {}) as Record<string, any>;
  const merged = { ...defaults, ...(config || {}) };

  // Ensure WhatsApp CTA always present with defaults when template supports it
  if (!merged.whatsapp) {
    merged.whatsapp = {
      phone_number: '',
      cta_text: '',
      prefilled_message: '',
      button_label: '',
      show_icon: true
    };
  }

  return merged;
};

export const getBusinessTemplate = (type: string) => {
  const resolvedType = resolveBusinessType(type);
  return businessTemplates[resolvedType as keyof typeof businessTemplates] || null;
};

export const getDefaultSections = (type: string) => {
  const template = getBusinessTemplate(type);
  return mergeTemplateConfigWithDefaults(type, template?.defaultData) || {};
};