import React from 'react';
import axios from 'axios';
import { router } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { businessTypeOptions } from '@/pages/vcard-builder/business-templates';
import { OnboardingProfileData, OnboardingProfileDetailData } from '@/types/onboarding';

export interface DashboardOnboardingWizardProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  profile: OnboardingProfileData | null | undefined;
  onProfileUpdate?: (profile: OnboardingProfileData) => void;
}

const initialSocialLinks = [{ platform: '', url: '', username: '' }];

const buildInitialDetailState = (profile?: OnboardingProfileDetailData | null): OnboardingProfileDetailData => ({
  company_overview: profile?.company_overview ?? '',
  mission_statement: profile?.mission_statement ?? '',
  vision_statement: profile?.vision_statement ?? '',
  unique_value_proposition: profile?.unique_value_proposition ?? '',
  target_audience: profile?.target_audience ?? '',
  service_highlights: profile?.service_highlights ?? '',
  notable_projects: profile?.notable_projects ?? '',
  testimonials: profile?.testimonials ?? '',
  brand_voice: profile?.brand_voice ?? '',
  call_to_action: profile?.call_to_action ?? '',
  keywords: profile?.keywords ?? [],
  metadata: profile?.metadata ?? null,
});

export const DashboardOnboardingWizard: React.FC<DashboardOnboardingWizardProps> = ({
  open,
  onOpenChange,
  profile,
  onProfileUpdate
}) => {
  const { t } = useTranslation();
  const hasCompleted = Boolean(profile?.completed_at);
  const canDismiss = hasCompleted;

  const buildInitialFormState = React.useCallback((): OnboardingProfileData => ({
    business_name: profile?.business_name ?? '',
    business_description: profile?.business_description ?? '',
    business_category: profile?.business_category ?? '',
    business_subcategory: profile?.business_subcategory ?? '',
    contact_name: profile?.contact_name ?? '',
    contact_email: profile?.contact_email ?? '',
    contact_phone: profile?.contact_phone ?? '',
    whatsapp: profile?.whatsapp ?? '',
    website: profile?.website ?? '',
    country: profile?.country ?? '',
    city: profile?.city ?? '',
    address_line1: profile?.address_line1 ?? '',
    address_line2: profile?.address_line2 ?? '',
    social_links: (profile?.social_links && profile.social_links.length > 0)
      ? profile.social_links
      : initialSocialLinks
  }), [profile]);

  const [formData, setFormData] = React.useState<OnboardingProfileData>(buildInitialFormState);
  const [detailData, setDetailData] = React.useState<OnboardingProfileDetailData>(buildInitialDetailState(profile?.detail ?? null));
  const [keywordInput, setKeywordInput] = React.useState<string>(() => (profile?.detail?.keywords ?? []).join(', '));
  const [currentStep, setCurrentStep] = React.useState(open ? 0 : -1);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [fieldErrors, setFieldErrors] = React.useState<Record<string, string[]>>({});
  const [generalError, setGeneralError] = React.useState<string | null>(null);
  const [categoryFilter, setCategoryFilter] = React.useState('');

  const steps = [
    {
      key: 'business',
      title: t('Business Details'),
      description: t('Tell us about your business so we can personalise your experience.')
    },
    {
      key: 'story',
      title: t('Business Story'),
      description: t('Share your mission, voice, and proof points so our AI gets it right.')
    },
    {
      key: 'contact',
      title: t('Contact Information'),
      description: t('How should potential customers reach you?')
    },
    {
      key: 'category',
      title: t('Business Category'),
      description: t('Choose the industry that best represents your business.')
    },
    {
      key: 'review',
      title: t('Review & Finish'),
      description: t('Confirm your information before we tailor your dashboard.')
    }
  ];

  const currentStepKey = steps[currentStep]?.key || '';

  React.useEffect(() => {
    if (open) {
      setFormData(buildInitialFormState());
      setDetailData(buildInitialDetailState(profile?.detail ?? null));
      setKeywordInput((profile?.detail?.keywords ?? []).join(', '));
      setCurrentStep(0);
      setFieldErrors({});
      setGeneralError(null);
      setCategoryFilter('');
    }
  }, [open, buildInitialFormState]);

  const displayFieldError = (field: string) => {
    if (!fieldErrors[field]) return null;
    return (
      <p className="mt-1 text-sm text-destructive">
        {fieldErrors[field][0]}
      </p>
    );
  };

  const updateField = (field: keyof OnboardingProfileData, value: unknown) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value
    }));
    if (fieldErrors[field as string]) {
      setFieldErrors((prev) => {
        const clone = { ...prev };
        delete clone[field as string];
        return clone;
      });
    }
  };

  const filteredCategories = React.useMemo(() => {
    if (!categoryFilter.trim()) {
      return businessTypeOptions;
    }
    const term = categoryFilter.trim().toLowerCase();
    return businessTypeOptions.filter((option) =>
      option.label.toLowerCase().includes(term) || option.value.toLowerCase().includes(term)
    );
  }, [categoryFilter]);

  const canProceed = React.useMemo(() => {
    const currentStepKey = steps[currentStep]?.key;

    if (currentStepKey === 'business') {
      return Boolean(formData.business_name && formData.business_name.trim().length >= 2);
    }
    if (currentStepKey === 'contact') {
      return Boolean(
        (formData.contact_email && formData.contact_email.trim().length > 0) ||
        (formData.contact_phone && formData.contact_phone.trim().length > 0) ||
        (formData.whatsapp && formData.whatsapp.trim().length > 0)
      );
    }
    if (currentStepKey === 'category') {
      return Boolean(formData.business_category && formData.business_category.trim().length > 0);
    }
    return true;
  }, [currentStep, formData]);

  const goNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const goBack = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const updateDetailField = (field: keyof OnboardingProfileDetailData, value: unknown) => {
    setDetailData((prev) => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setGeneralError(null);
    setFieldErrors({});

    const sanitizedDetail: OnboardingProfileDetailData = {
      ...detailData,
      keywords: keywordInput
        .split(',')
        .map((keyword) => keyword.trim())
        .filter((keyword) => keyword.length > 0),
    };

    if (sanitizedDetail.keywords && sanitizedDetail.keywords.length === 0) {
      sanitizedDetail.keywords = undefined;
    }

    const normalizedDetail = Object.fromEntries(
      Object.entries(sanitizedDetail).filter(([_, value]) => {
        if (value === null || typeof value === 'undefined') {
          return false;
        }

        if (typeof value === 'string') {
          return value.trim().length > 0;
        }

        if (Array.isArray(value)) {
          return value.length > 0;
        }

        if (typeof value === 'object') {
          return Object.keys(value).length > 0;
        }

        return true;
      })
    ) as OnboardingProfileDetailData;

    const payload = {
      ...formData,
      social_links: (formData.social_links || []).filter((item) => item.platform || item.url),
      details: normalizedDetail,
    };

    try {
      const routeName = profile?.id ? 'onboarding.profile.update' : 'onboarding.profile.store';
      const method = profile?.id ? axios.put : axios.post;
      const response = await method(route(routeName), payload);
      const savedProfile: OnboardingProfileData = response.data?.data ?? response.data ?? payload;

      toast.success(t('Your business profile has been saved.'));
      onProfileUpdate?.(savedProfile);
      onOpenChange(false);
      router.reload({ only: ['auth'] });
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 422) {
          const errors = error.response.data?.errors ?? {};
          setFieldErrors(errors);
          setGeneralError(
            error.response.data?.message ??
            t('Please review the highlighted fields and try again.')
          );
          // Navigate to the first step that has an error
          const errorOrder = [
            'business_name',
            'business_description',
            'details.company_overview',
            'details.mission_statement',
            'details.unique_value_proposition',
            'contact_email',
            'contact_phone',
            'business_category'
          ];
          for (const field of errorOrder) {
            if (errors[field]) {
              if (['business_name', 'business_description'].includes(field)) {
                setCurrentStep(0);
              } else if (field.startsWith('details.')) {
                const storyStepIndex = steps.findIndex((step) => step.key === 'story');
                if (storyStepIndex !== -1) {
                  setCurrentStep(storyStepIndex);
                }
              } else if (['contact_email', 'contact_phone', 'whatsapp'].includes(field)) {
                setCurrentStep(1);
              } else if (field === 'business_category') {
                setCurrentStep(2);
              }
              break;
            }
          }
        } else {
          setGeneralError(
            error.response?.data?.message ?? t('Something went wrong. Please try again later.')
          );
        }
      } else {
        setGeneralError(t('Something went wrong. Please try again later.'));
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // Add/remove class to body when modal is open/closed
  React.useEffect(() => {
    if (open) {
      document.body.classList.add('onboarding-wizard-open');
    } else {
      document.body.classList.remove('onboarding-wizard-open');
    }
    
    return () => {
      document.body.classList.remove('onboarding-wizard-open');
    };
  }, [open]);

  if (!open) return null;

  return (
    <div className="onboarding-wizard-container">
      <div className="onboarding-wizard-content">
        {!hasCompleted && (
          <div className="absolute right-4 top-4 flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
            <span className="inline-flex h-2 w-2 rounded-full bg-primary animate-pulse" />
            {t('Setup required')}
          </div>
        )}
        {canDismiss && (
          <button
            type="button"
            className="absolute right-4 top-4 rounded-full p-2 text-muted-foreground transition hover:bg-muted z-10"
            onClick={() => onOpenChange(false)}
            aria-label={t('Close onboarding wizard')}
          >
            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        )}

        <div className="grid gap-6 p-4 md:p-6">
          <div className="grid gap-1">
            <h2 className="text-2xl font-semibold md:text-3xl">
              {hasCompleted ? t('Update your business profile') : t('Let’s set up your business profile')}
            </h2>
            <p className="text-muted-foreground">
              {t('This information helps us personalize your experience. You can always update it later.')}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {steps.map((step, index) => {
              const isActive = index === currentStep;
              const isCompleted = index < currentStep;
              return (
                <div key={step.key} className="flex items-center gap-2 text-sm">
                  <div className={`flex h-8 w-8 items-center justify-center rounded-full border text-sm font-semibold transition ${isActive ? 'border-primary bg-primary text-primary-foreground' : isCompleted ? 'border-primary/60 bg-primary/10 text-primary' : 'border-border text-muted-foreground' }`}>
                    {index + 1}
                  </div>
                  <div className="hidden flex-col md:flex">
                    <span className={`text-xs uppercase tracking-wide ${isActive ? 'text-primary' : 'text-muted-foreground'}`}>
                      {step.title}
                    </span>
                    <span className="text-[11px] text-muted-foreground">
                      {step.description}
                    </span>
                  </div>
                  {index < steps.length - 1 && (
                    <div className="hidden h-px w-8 bg-border md:block" />
                  )}
                </div>
              );
            })}
          </div>

          {generalError && (
            <div className="rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
              {generalError}
            </div>
          )}

          <div className="min-h-[300px] max-h-[calc(100vh-300px)] overflow-y-auto rounded-2xl border bg-background p-4 md:p-6">
            {currentStepKey === 'business' && (
              <div className="grid gap-5">
                <div>
                  <label className="text-sm font-medium" htmlFor="business_name">
                    {t('Business name')} <span className="text-destructive">*</span>
                  </label>
                  <Input
                    id="business_name"
                    value={formData.business_name as string}
                    onChange={(event) => updateField('business_name', event.target.value)}
                    placeholder={t('Your Business Name')}
                  />
                  {displayFieldError('business_name')}
                </div>
                <div>
                  <label className="text-sm font-medium" htmlFor="business_description">
                    {t('What does your business do?')}
                  </label>
                  <Textarea
                    id="business_description"
                    rows={4}
                    value={formData.business_description as string}
                    onChange={(event) => updateField('business_description', event.target.value)}
                    placeholder={t('Briefly describe what your business does and who you serve.')}
                  />
                  {displayFieldError('business_description')}
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <label className="text-sm font-medium" htmlFor="business_subcategory">
                      {t('Speciality or niche')}
                    </label>
                    <Input
                      id="business_subcategory"
                      value={formData.business_subcategory as string}
                      onChange={(event) => updateField('business_subcategory', event.target.value)}
                      placeholder={t('e.g. Specialized services, product types, or market focus')}
                    />
                    {displayFieldError('business_subcategory')}
                  </div>
                  <div>
                    <label className="text-sm font-medium" htmlFor="website">
                      {t('Website')}
                    </label>
                    <Input
                      id="website"
                      value={formData.website as string}
                      onChange={(event) => updateField('website', event.target.value)}
                      placeholder="https://"
                    />
                    {displayFieldError('website')}
                  </div>
                </div>
              </div>
            )}

            {currentStepKey === 'story' && (
              <div className="grid gap-5">
                <div>
                  <label className="text-sm font-medium" htmlFor="company_overview">
                    {t('Company overview')}
                  </label>
                  <Textarea
                    id="company_overview"
                    rows={4}
                    value={detailData.company_overview ?? ''}
                    onChange={(event) => updateDetailField('company_overview', event.target.value)}
                    placeholder={t('Describe your business history, services, and what makes you unique.')}
                  />
                  {displayFieldError('details.company_overview')}
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <label className="text-sm font-medium" htmlFor="mission_statement">
                      {t('Mission statement')}
                    </label>
                    <Textarea
                      id="mission_statement"
                      rows={3}
                      value={detailData.mission_statement ?? ''}
                      onChange={(event) => updateDetailField('mission_statement', event.target.value)}
                      placeholder={t('What core purpose drives your work?')}
                    />
                    {displayFieldError('details.mission_statement')}
                  </div>
                  <div>
                    <label className="text-sm font-medium" htmlFor="vision_statement">
                      {t('Vision statement')}
                    </label>
                    <Textarea
                      id="vision_statement"
                      rows={3}
                      value={detailData.vision_statement ?? ''}
                      onChange={(event) => updateDetailField('vision_statement', event.target.value)}
                      placeholder={t('Paint a picture of the future you are building.')}
                    />
                    {displayFieldError('details.vision_statement')}
                  </div>
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <label className="text-sm font-medium" htmlFor="unique_value_proposition">
                      {t('Unique value proposition')}
                    </label>
                    <Textarea
                      id="unique_value_proposition"
                      rows={3}
                      value={detailData.unique_value_proposition ?? ''}
                      onChange={(event) => updateDetailField('unique_value_proposition', event.target.value)}
                      placeholder={t('What makes you stand out? Highlight differentiators or signature services.')}
                    />
                    {displayFieldError('details.unique_value_proposition')}
                  </div>
                  <div>
                    <label className="text-sm font-medium" htmlFor="target_audience">
                      {t('Target audience')}
                    </label>
                    <Textarea
                      id="target_audience"
                      rows={3}
                      value={detailData.target_audience ?? ''}
                      onChange={(event) => updateDetailField('target_audience', event.target.value)}
                      placeholder={t('Who do you serve? Mention industries, customer profiles, or regions.')}
                    />
                    {displayFieldError('details.target_audience')}
                  </div>
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <label className="text-sm font-medium" htmlFor="service_highlights">
                      {t('Signature services or highlights')}
                    </label>
                    <Textarea
                      id="service_highlights"
                      rows={3}
                      value={detailData.service_highlights ?? ''}
                      onChange={(event) => updateDetailField('service_highlights', event.target.value)}
                      placeholder={t('List standout offerings, packages, or specialties.')}
                    />
                    {displayFieldError('details.service_highlights')}
                  </div>
                  <div>
                    <label className="text-sm font-medium" htmlFor="notable_projects">
                      {t('Notable projects or wins')}
                    </label>
                    <Textarea
                      id="notable_projects"
                      rows={3}
                      value={detailData.notable_projects ?? ''}
                      onChange={(event) => updateDetailField('notable_projects', event.target.value)}
                      placeholder={t('Share names, outcomes, or client praise you are proud of.')}
                    />
                    {displayFieldError('details.notable_projects')}
                  </div>
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <label className="text-sm font-medium" htmlFor="testimonials">
                      {t('Testimonials or social proof')}
                    </label>
                    <Textarea
                      id="testimonials"
                      rows={3}
                      value={detailData.testimonials ?? ''}
                      onChange={(event) => updateDetailField('testimonials', event.target.value)}
                      placeholder={t('Add quotes or snippets that showcase trust.')}
                    />
                    {displayFieldError('details.testimonials')}
                  </div>
                  <div>
                    <label className="text-sm font-medium" htmlFor="brand_voice">
                      {t('Brand voice & tone')}
                    </label>
                    <Textarea
                      id="brand_voice"
                      rows={3}
                      value={detailData.brand_voice ?? ''}
                      onChange={(event) => updateDetailField('brand_voice', event.target.value)}
                      placeholder={t('How should content sound? e.g. bold, warm, authoritative.')}
                    />
                    {displayFieldError('details.brand_voice')}
                  </div>
                </div>
                <div className="grid gap-4 md:grid-cols-[2fr_1fr]">
                  <div>
                    <label className="text-sm font-medium" htmlFor="call_to_action">
                      {t('Primary call-to-action')}
                    </label>
                    <Textarea
                      id="call_to_action"
                      rows={3}
                      value={detailData.call_to_action ?? ''}
                      onChange={(event) => updateDetailField('call_to_action', event.target.value)}
                      placeholder={t('What action should readers take? e.g. book a consultation, request a quote.')}
                    />
                    {displayFieldError('details.call_to_action')}
                  </div>
                  <div>
                    <label className="text-sm font-medium" htmlFor="keywords">
                      {t('Keywords (comma separated)')}
                    </label>
                    <Input
                      id="keywords"
                      value={keywordInput}
                      onChange={(event) => setKeywordInput(event.target.value)}
                      placeholder={t('e.g. solar installation, certified electricians, energy audits')}
                    />
                    {displayFieldError('details.keywords')}
                  </div>
                </div>
              </div>
            )}

            {currentStepKey === 'contact' && (
              <div className="grid gap-5">
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <label className="text-sm font-medium" htmlFor="contact_name">
                      {t('Primary contact name')}
                    </label>
                    <Input
                      id="contact_name"
                      value={formData.contact_name as string}
                      onChange={(event) => updateField('contact_name', event.target.value)}
                      placeholder={t('Primary contact name')}
                    />
                    {displayFieldError('contact_name')}
                  </div>
                  <div>
                    <label className="text-sm font-medium" htmlFor="contact_email">
                      {t('Contact email')}
                    </label>
                    <Input
                      id="contact_email"
                      type="email"
                      value={formData.contact_email as string}
                      onChange={(event) => updateField('contact_email', event.target.value)}
                      placeholder="name@company.com"
                    />
                    {displayFieldError('contact_email')}
                  </div>
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <label className="text-sm font-medium" htmlFor="contact_phone">
                      {t('Phone number')}
                    </label>
                    <Input
                      id="contact_phone"
                      value={formData.contact_phone as string}
                      onChange={(event) => updateField('contact_phone', event.target.value)}
                      placeholder="(+27) 82 123 4567"
                    />
                    {displayFieldError('contact_phone')}
                  </div>
                  <div>
                    <label className="text-sm font-medium" htmlFor="whatsapp">
                      {t('WhatsApp number')}
                    </label>
                    <Input
                      id="whatsapp"
                      value={formData.whatsapp as string}
                      onChange={(event) => updateField('whatsapp', event.target.value)}
                      placeholder="(+27) 82 123 4567"
                    />
                    {displayFieldError('whatsapp')}
                  </div>
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <label className="text-sm font-medium" htmlFor="country">
                      {t('Country')}
                    </label>
                    <Input
                      id="country"
                      value={formData.country as string}
                      onChange={(event) => updateField('country', event.target.value)}
                      placeholder={t('Country')}
                    />
                    {displayFieldError('country')}
                  </div>
                  <div>
                    <label className="text-sm font-medium" htmlFor="city">
                      {t('City / Region')}
                    </label>
                    <Input
                      id="city"
                      value={formData.city as string}
                      onChange={(event) => updateField('city', event.target.value)}
                      placeholder={t('City')}
                    />
                    {displayFieldError('city')}
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium" htmlFor="address_line1">
                    {t('Business address')}
                  </label>
                  <Input
                    id="address_line1"
                    value={formData.address_line1 as string}
                    onChange={(event) => updateField('address_line1', event.target.value)}
                    placeholder={t('Street address')}
                  />
                  {displayFieldError('address_line1')}
                </div>
                <div>
                  <label className="text-sm font-medium" htmlFor="address_line2">
                    {t('Address line 2 (optional)')}
                  </label>
                  <Input
                    id="address_line2"
                    value={formData.address_line2 as string}
                    onChange={(event) => updateField('address_line2', event.target.value)}
                    placeholder={t('Suite, floor, landmark, etc. (optional)')}
                  />
                  {displayFieldError('address_line2')}
                </div>
              </div>
            )}

            {currentStepKey === 'category' && (
              <div className="grid gap-4">
                <div>
                  <label className="text-sm font-medium" htmlFor="category_search">
                    {t('Search categories')}
                  </label>
                  <Input
                    id="category_search"
                    value={categoryFilter}
                    onChange={(event) => setCategoryFilter(event.target.value)}
                    placeholder={t('Start typing to filter categories...')}
                  />
                </div>
                <div className="grid gap-3 max-h-[320px] overflow-y-auto pr-1 md:grid-cols-2">
                  {filteredCategories.map((option) => {
                    const isSelected = formData.business_category === option.value;
                    return (
                      <button
                        key={option.value}
                        type="button"
                        onClick={() => updateField('business_category', option.value)}
                        className={`flex items-start gap-3 rounded-2xl border p-4 text-left transition ${isSelected ? 'border-primary bg-primary/10 shadow-sm' : 'border-border hover:border-primary/50 hover:bg-primary/5'}`}
                      >
                        <div className={`mt-1 h-4 w-4 flex-shrink-0 rounded-full border ${isSelected ? 'border-primary bg-primary' : 'border-muted-foreground/40'}`} />
                        <div className="space-y-1">
                          <div className="text-sm font-semibold">
                            {option.icon ? `${option.icon} ` : ''}{option.label}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {option.value.replace('-', ' ')}
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
                {displayFieldError('business_category')}
              </div>
            )}

            {currentStepKey === 'review' && (
              <div className="grid gap-4">
                <div className="rounded-xl border bg-muted/10 p-4">
                  <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                    {t('Summary')}
                  </h3>
                  <div className="mt-3 grid gap-3 text-sm md:grid-cols-2">
                    <div>
                      <p className="text-muted-foreground">{t('Business name')}</p>
                      <p className="font-medium">{formData.business_name || '—'}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">{t('Category')}</p>
                      <p className="font-medium">
                        {businessTypeOptions.find((opt) => opt.value === formData.business_category)?.label || '—'}
                      </p>
                    </div>
                    <div className="md:col-span-2">
                      <p className="text-muted-foreground">{t('Description')}</p>
                      <p className="font-medium whitespace-pre-line">
                        {formData.business_description || '—'}
                      </p>
                    </div>
                    <div className="md:col-span-2">
                      <p className="text-muted-foreground">{t('Company overview')}</p>
                      <p className="font-medium whitespace-pre-line">
                        {detailData.company_overview || '—'}
                      </p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">{t('Contact email')}</p>
                      <p className="font-medium">{formData.contact_email || '—'}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">{t('Phone / WhatsApp')}</p>
                      <p className="font-medium">
                        {[formData.contact_phone, formData.whatsapp].filter(Boolean).join(' / ') || '—'}
                      </p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">{t('Location')}</p>
                      <p className="font-medium">
                        {[formData.address_line1, formData.address_line2, formData.city, formData.country]
                          .filter(Boolean)
                          .join(', ') || '—'}
                      </p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">{t('Website')}</p>
                      <p className="font-medium">{formData.website || '—'}</p>
                    </div>
                    <div className="md:col-span-2">
                      <p className="text-muted-foreground">{t('Mission & vision')}</p>
                      <p className="font-medium whitespace-pre-line">
                        {[detailData.mission_statement, detailData.vision_statement].filter(Boolean).join('\n\n') || '—'}
                      </p>
                    </div>
                    <div className="md:col-span-2">
                      <p className="text-muted-foreground">{t('Standout proof')}</p>
                      <p className="font-medium whitespace-pre-line">
                        {[detailData.unique_value_proposition, detailData.notable_projects, detailData.testimonials]
                          .filter(Boolean)
                          .join('\n\n') || '—'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="flex flex-col gap-3 pt-4 border-t md:flex-row md:items-center md:justify-between">
            <div className="text-xs text-muted-foreground">
              {currentStep < steps.length - 1
                ? t('Step {{current}} of {{total}}', { current: currentStep + 1, total: steps.length })
                : t('You are ready to finish!')}
            </div>
            <div className="flex items-center gap-2">
              {(currentStep > 0 || canDismiss) && (
                <Button
                  variant="outline"
                  type="button"
                  onClick={() => {
                    if (currentStep > 0) {
                      goBack();
                    } else if (canDismiss) {
                      onOpenChange(false);
                    }
                  }}
                  disabled={isSubmitting}
                >
                  {currentStep > 0 ? t('Back') : t('Close')}
                </Button>
              )}
              {currentStep < steps.length - 1 && (
                <Button
                  type="button"
                  onClick={goNext}
                  disabled={!canProceed || isSubmitting}
                >
                  {t('Continue')}
                </Button>
              )}
              {currentStep === steps.length - 1 && (
                <Button
                  type="button"
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? t('Saving...') : t('Save profile')}
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Create a wrapped version with error boundary
const DashboardOnboardingWizardWithBoundary = (props: DashboardOnboardingWizardProps) => (
  <ErrorBoundary>
    <DashboardOnboardingWizard {...props} />
  </ErrorBoundary>
);

export default DashboardOnboardingWizardWithBoundary;
