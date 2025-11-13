export interface OnboardingProfileDetailData {
  company_overview?: string;
  mission_statement?: string;
  vision_statement?: string;
  unique_value_proposition?: string;
  target_audience?: string;
  service_highlights?: string;
  notable_projects?: string;
  testimonials?: string;
  brand_voice?: string;
  call_to_action?: string;
  keywords?: string[];
  metadata?: Record<string, unknown> | null;
  created_at?: string;
  updated_at?: string;
}

export interface OnboardingProfileData {
  id?: number;
  business_name?: string;
  business_description?: string;
  business_category?: string;
  business_subcategory?: string;
  contact_name?: string;
  contact_email?: string;
  contact_phone?: string;
  whatsapp?: string;
  website?: string;
  country?: string;
  city?: string;
  address_line1?: string;
  address_line2?: string;
  social_links?: Array<{ platform: string; url: string; username?: string }>;
  completed_at?: string | null;
  detail?: OnboardingProfileDetailData | null;
  [key: string]: unknown;
}
