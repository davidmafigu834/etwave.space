import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from '@/components/custom-toast';
import axios from 'axios';
import { useTranslation } from 'react-i18next';
import { Switch } from '@/components/ui/switch';
import MediaPicker from '@/components/MediaPicker';
import { cn } from '@/lib/utils';

interface WizardStep {
  id: string;
  title: string;
  description: string;
}

const steps: WizardStep[] = [
  { id: 'company', title: 'About your business', description: 'Tell us about your business so we can introduce you properly.' },
  { id: 'packages', title: 'Services & offerings', description: 'List your services, packages, and key value propositions.' },
  { id: 'projects', title: 'Projects & case studies', description: 'Highlight your recent work or success stories.' },
  { id: 'media', title: 'Media & visuals', description: 'Upload images and videos for your vCard.' },
  { id: 'extras', title: 'Contact & extras', description: 'Add contact info, social links, and calls to action.' },
];

interface Props {
  userPlan?: Record<string, any>;
  planFeatures?: Record<string, any>;
  userRole?: string;
  onResult?: (data: Record<string, any>) => void;
}

interface WizardState {
  companyName: string;
  tagline: string;
  overview: string;
  targetAudience: string;
  tone: string;
  language: string;
  packages: Array<{ name: string; price: string; description: string; media?: string }>;
  projects: Array<{ name: string; outcome: string; media?: string; testimonial?: string }>;
  heroImage?: string;
  gallery: string[];
  callToAction: string;
  contactEmail: string;
  contactPhone: string;
  socials: Array<{ platform: string; url: string }>;
  allowAiMediaSuggestions: boolean;
}

const defaultState: WizardState = {
  companyName: '',
  tagline: '',
  overview: '',
  targetAudience: '',
  tone: 'professional',
  language: 'en',
  packages: [{ name: '', price: '', description: '' }],
  projects: [{ name: '', outcome: '', testimonial: '' }],
  gallery: [],
  callToAction: '',
  contactEmail: '',
  contactPhone: '',
  socials: [{ platform: '', url: '' }],
  allowAiMediaSuggestions: false,
};

const MAX_PACKAGES = 5;
const MAX_PROJECTS = 5;
const MAX_GALLERY = 6;

const SUPPORTED_LANGUAGES = [
  { value: 'en', label: 'English' },
  { value: 'es', label: 'Spanish' },
  { value: 'fr', label: 'French' },
  { value: 'de', label: 'German' },
  { value: 'pt', label: 'Portuguese' },
  { value: 'it', label: 'Italian' },
  { value: 'nl', label: 'Dutch' },
  { value: 'pl', label: 'Polish' },
  { value: 'ar', label: 'Arabic' },
  { value: 'tr', label: 'Turkish' },
  { value: 'zh', label: 'Chinese' },
  { value: 'ja', label: 'Japanese' },
];

const TONES = [
  { value: 'professional', label: 'Professional' },
  { value: 'friendly', label: 'Friendly' },
  { value: 'technical', label: 'Technical' },
  { value: 'inspirational', label: 'Inspirational' },
  { value: 'conversational', label: 'Conversational' },
];

const SOCIAL_PLATFORMS = [
  'Facebook',
  'Instagram',
  'LinkedIn',
  'Twitter',
  'TikTok',
  'YouTube',
  'WhatsApp',
  'Pinterest',
];

export default function VCardAIWizard({ userPlan, planFeatures, userRole, onResult }: Props) {
  const { t } = useTranslation();
  const [stepIndex, setStepIndex] = React.useState(0);
  const [state, setState] = React.useState<WizardState>(defaultState);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [aiResult, setAiResult] = React.useState<Record<string, any> | null>(null);

  const canUseAI = React.useMemo(() => {
    if (userRole === 'superadmin') return true;
    return planFeatures?.ai_integration === true;
  }, [planFeatures?.ai_integration, userRole]);

  const currentStep = steps[stepIndex];

  const handlePrev = () => setStepIndex((index) => Math.max(index - 1, 0));
  const handleNext = () => setStepIndex((index) => Math.min(index + 1, steps.length - 1));

  const updateState = <K extends keyof WizardState>(key: K, value: WizardState[K]) => {
    setState((prev) => ({ ...prev, [key]: value }));
  };

  const updateArrayItem = <K extends ArrayKeys>(key: K, index: number, field: string, value: any) => {
    setState((prev) => {
      const updated = [...(prev[key] as any[])];
      updated[index] = { ...updated[index], [field]: value };
      return { ...prev, [key]: updated };
    });
  };

  type ArrayKeys = Extract<{ [K in keyof WizardState]: WizardState[K] extends Array<any> ? K : never }[keyof WizardState], keyof WizardState>;

  const addArrayItem = (key: ArrayKeys, defaults: Record<string, any>) => {
    setState((prev) => ({
      ...prev,
      [key]: [...(prev[key] as any[]), defaults],
    }));
  };

  const removeArrayItem = (key: ArrayKeys, index: number) => {
    setState((prev) => ({
      ...prev,
      [key]: (prev[key] as any[]).filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async () => {
    if (!canUseAI) {
      toast.error(t('Your current plan does not include AI content generation.'));
      return;
    }

    setIsSubmitting(true);

    try {
      const payload = buildPayloadFromState(state);
      const response = await axios.post(route('vcard-builder.ai.generate'), payload);

      if (response.data?.success) {
        setAiResult(response.data.data);
        localStorage.setItem('vcard_ai_result', JSON.stringify(response.data.data));
        onResult?.(response.data.data);
        toast.success(t('AI content generated. Scroll to review and apply.'));
      } else {
        toast.error(response.data?.message ?? t('Unable to generate content. Please try again.'));
      }
    } catch (error: any) {
      const message = error?.response?.data?.message ?? t('Unable to generate content. Please try again.');
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStep = () => {
    switch (currentStep.id) {
      case 'company':
        return (
          <div className="space-y-4">
            <div>
              <Label>{t('Company name')}</Label>
              <Input
                value={state.companyName}
                onChange={(event) => updateState('companyName', event.target.value)}
                placeholder={t('Your Business Name')}
              />
            </div>

            <div>
              <Label>{t('Tagline')}</Label>
              <Input
                value={state.tagline}
                onChange={(event) => updateState('tagline', event.target.value)}
                placeholder={t('Your business tagline')}
              />
            </div>

            <div>
              <Label>{t('Overview')}</Label>
              <Textarea
                value={state.overview}
                onChange={(event) => updateState('overview', event.target.value)}
                placeholder={t('Explain what makes your business unique, where you operate, certifications, etc.')}
                rows={5}
              />
            </div>

            <div>
              <Label>{t('Target audience')}</Label>
              <Textarea
                value={state.targetAudience}
                onChange={(event) => updateState('targetAudience', event.target.value)}
                placeholder={t('e.g. Individuals, businesses, specific industries, etc.')}
                rows={3}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>{t('Preferred tone')}</Label>
                <Select value={state.tone} onValueChange={(value) => updateState('tone', value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {TONES.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {t(option.label)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>{t('Language')}</Label>
                <Select value={state.language} onValueChange={(value) => updateState('language', value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {SUPPORTED_LANGUAGES.map((lang) => (
                      <SelectItem key={lang.value} value={lang.value}>
                        {t(lang.label)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        );

      case 'packages':
        return (
          <div className="space-y-4">
            {state.packages.map((pkg, index) => (
              <Card key={index} className="p-4 space-y-3 border-dashed">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label>{t('Service or package name')}</Label>
                    <Input
                      value={pkg.name}
                      onChange={(event) => updateArrayItem('packages', index, 'name', event.target.value)}
                      placeholder={t('Service or package name')}
                    />
                  </div>
                  <div>
                    <Label>{t('Price or starting price')}</Label>
                    <Input
                      value={pkg.price}
                      onChange={(event) => updateArrayItem('packages', index, 'price', event.target.value)}
                      placeholder={t('Price or starting price')}
                    />
                  </div>
                </div>

                <div>
                  <Label>{t('Description')}</Label>
                  <Textarea
                    value={pkg.description}
                    onChange={(event) => updateArrayItem('packages', index, 'description', event.target.value)}
                    placeholder={t('Description of what this service or package includes')}
                    rows={4}
                  />
                </div>

                <div>
                  <Label>{t('Package image')}</Label>
                  <MediaPicker
                    value={pkg.media}
                    onChange={(value) => updateArrayItem('packages', index, 'media', value)}
                    placeholder={t('Image for this service or package (optional)')}
                  />
                </div>

                {state.packages.length > 1 && (
                  <Button variant="outline" size="sm" onClick={() => removeArrayItem('packages', index)}>
                    {t('Remove package')}
                  </Button>
                )}
              </Card>
            ))}

            {state.packages.length < MAX_PACKAGES && (
              <Button
                type="button"
                variant="outline"
                onClick={() => addArrayItem('packages', { name: '', price: '', description: '' })}
              >
                {t('Add package')}
              </Button>
            )}
          </div>
        );

      case 'projects':
        return (
          <div className="space-y-4">
            {state.projects.map((project, index) => (
              <Card key={index} className="p-4 space-y-3 border-dashed">
                <div>
                  <Label>{t('Project name')}</Label>
                  <Input
                    value={project.name}
                    onChange={(event) => updateArrayItem('projects', index, 'name', event.target.value)}
                    placeholder={t('Project or case study name')}
                  />
                </div>

                <div>
                  <Label>{t('Outcome / impact')}</Label>
                  <Textarea
                    value={project.outcome}
                    onChange={(event) => updateArrayItem('projects', index, 'outcome', event.target.value)}
                    placeholder={t('Describe the results and impact of this project')}
                    rows={4}
                  />
                </div>

                <div>
                  <Label>{t('Project image')}</Label>
                  <MediaPicker
                    value={project.media}
                    onChange={(value) => updateArrayItem('projects', index, 'media', value)}
                    placeholder={t('Image for this project (optional)')}
                  />
                </div>

                <div>
                  <Label>{t('Client quote or testimonial')}</Label>
                  <Textarea
                    value={project.testimonial || ''}
                    onChange={(event) => updateArrayItem('projects', index, 'testimonial', event.target.value)}
                    placeholder={t('Client testimonial or quote')}
                    rows={3}
                  />
                </div>

                {state.projects.length > 1 && (
                  <Button variant="outline" size="sm" onClick={() => removeArrayItem('projects', index)}>
                    {t('Remove project')}
                  </Button>
                )}
              </Card>
            ))}

            {state.projects.length < MAX_PROJECTS && (
              <Button
                type="button"
                variant="outline"
                onClick={() => addArrayItem('projects', { name: '', outcome: '', testimonial: '' })}
              >
                {t('Add project')}
              </Button>
            )}
          </div>
        );

      case 'media':
        return (
          <div className="space-y-4">
            <div>
              <Label>{t('Hero image')}</Label>
              <MediaPicker
                value={state.heroImage}
                onChange={(value) => updateState('heroImage', value)}
                placeholder={t('Add a cover image (optional)')}
              />
              <p className="text-xs text-muted-foreground mt-1">{t('Recommended size: 1200 x 800px')}</p>
            </div>

            <div className="space-y-3">
              <Label>{t('Gallery images')}</Label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {state.gallery.map((item, index) => (
                  <div key={index} className="space-y-2">
                    <MediaPicker
                      value={item}
                      onChange={(value) => {
                        const updated = [...state.gallery];
                        updated[index] = value;
                        updateState('gallery', updated);
                      }}
                      placeholder={t('Select image')}
                    />
                    <Button variant="outline" size="xs" onClick={() => removeArrayItem('gallery', index)}>
                      {t('Remove')}
                    </Button>
                  </div>
                ))}

                {state.gallery.length < MAX_GALLERY && (
                  <button
                    type="button"
                    onClick={() => addArrayItem('gallery', '')}
                    className="flex h-24 w-full items-center justify-center rounded-md border border-dashed text-sm text-muted-foreground hover:bg-muted/40"
                  >
                    {t('Add image slot')}
                  </button>
                )}
              </div>
            </div>

            <div className="flex items-center justify-between rounded-md border p-3">
              <div>
                <Label>{t('Need AI image suggestions?')}</Label>
                <p className="text-xs text-muted-foreground">
                  {t('We can recommend images based on your description.')}
                </p>
              </div>
              <Switch
                checked={state.allowAiMediaSuggestions}
                onCheckedChange={(value) => updateState('allowAiMediaSuggestions', value)}
              />
            </div>
          </div>
        );

      case 'extras':
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>{t('Primary call to action')}</Label>
                <Textarea
                  value={state.callToAction}
                  onChange={(event) => updateState('callToAction', event.target.value)}
                  placeholder={t('Primary call to action for visitors')}
                  rows={3}
                />
              </div>

              <div>
                <Label>{t('Contact email')}</Label>
                <Input
                  value={state.contactEmail}
                  type="email"
                  onChange={(event) => updateState('contactEmail', event.target.value)}
                  placeholder="hello@yourbusiness.com"
                />
              </div>

              <div>
                <Label>{t('Contact phone')}</Label>
                <Input
                  value={state.contactPhone}
                  onChange={(event) => updateState('contactPhone', event.target.value)}
                  placeholder="+1 555 123 4567"
                />
              </div>
            </div>

            <div className="space-y-3">
              <Label>{t('Social links')}</Label>
              {state.socials.map((item, index) => (
                <div key={index} className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <Select
                    value={item.platform}
                    onValueChange={(value) => updateArrayItem('socials', index, 'platform', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder={t('Platform')} />
                    </SelectTrigger>
                    <SelectContent>
                      {SOCIAL_PLATFORMS.map((platform) => (
                        <SelectItem key={platform} value={platform}>
                          {platform}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <div className="md:col-span-2">
                    <Input
                      value={item.url}
                      onChange={(event) => updateArrayItem('socials', index, 'url', event.target.value)}
                      placeholder={t('https://facebook.com/yourbusiness')}
                    />
                  </div>
                  {state.socials.length > 1 && (
                    <Button variant="outline" size="sm" onClick={() => removeArrayItem('socials', index)}>
                      {t('Remove')}
                    </Button>
                  )}
                </div>
              ))}

              {state.socials.length < 8 && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => addArrayItem('socials', { platform: '', url: '' })}
                >
                  {t('Add social link')}
                </Button>
              )}
            </div>

            <div className="rounded-md border p-3 bg-muted/30">
              <Label>{t('Need more info?')}</Label>
              <p className="text-xs text-muted-foreground">
                {t('Include testimonials, FAQ snippets, or other information to enrich AI prompts.')}
              </p>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  const summaryCards = (
    <div className="grid gap-3">
      {Object.entries(aiResult || {}).map(([key, value]) => (
        <Card key={key} className="p-3 space-y-1">
          <p className="text-xs uppercase text-muted-foreground">{key}</p>
          <pre className=" whitespace-pre-wrap text-sm">{typeof value === 'string' ? value : JSON.stringify(value, null, 2)}</pre>
        </Card>
      ))}
    </div>
  );

  return (
    <Card className="border border-dashed">
      <div className="p-4 border-b">
        <h2 className="text-lg font-semibold flex items-center justify-between">
          <span>{t('AI Business Setup')}</span>
          {canUseAI ? (
            <span className="text-xs bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full">
              {t('Included in your plan')}
            </span>
          ) : (
            <span className="text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full">
              {t('Upgrade for AI features')}
            </span>
          )}
        </h2>
        <p className="text-sm text-muted-foreground mt-1">
          {t('Provide information about your business and let AI create content for your vCard.')}
        </p>
      </div>

      <div className="p-4 space-y-6">
        <div>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">{t(currentStep.title)}</p>
              <p className="text-sm text-muted-foreground">{t(currentStep.description)}</p>
            </div>
            <div className="text-right text-xs text-muted-foreground">
              {t('Step {{current}} of {{total}}', { current: stepIndex + 1, total: steps.length })}
            </div>
          </div>
          <div className="mt-4 space-y-4">
            <div className="grid grid-cols-5 gap-2">
              {steps.map((step, index) => (
                <button
                  key={step.id}
                  type="button"
                  onClick={() => setStepIndex(index)}
                  className={cn(
                    'rounded-md border px-2 py-2 text-xs text-left transition',
                    index === stepIndex ? 'bg-primary text-primary-foreground border-primary' : 'bg-muted/40 hover:bg-muted'
                  )}
                >
                  <p className="font-medium">{t(step.title)}</p>
                  <p className="text-[10px] text-muted-foreground">{t(step.description)}</p>
                </button>
              ))}
            </div>
            <div className="border rounded-md p-4 bg-muted/10">
              {renderStep()}
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <Button variant="outline" onClick={handlePrev} disabled={stepIndex === 0}>
            {t('Back')}
          </Button>
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={handleNext} disabled={stepIndex === steps.length - 1}>
              {t('Next')}
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={!canUseAI || isSubmitting}
              className="relative overflow-hidden border-0 bg-gradient-to-r from-purple-500 via-purple-400 to-pink-500 text-white shadow-[0_0_12px_rgba(168,85,247,0.7)] transition hover:scale-[1.01]"
            >
              {isSubmitting ? t('Generating...') : t('Generate AI content')}
            </Button>
          </div>
        </div>

        {aiResult && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold">{t('AI Output')}</h3>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  localStorage.setItem('vcard_ai_result', JSON.stringify(aiResult));
                  toast.success(t('Saved to browser storage. You can paste sections into the editor below.'));
                }}
              >
                {t('Save to local storage')}
              </Button>
            </div>
            {summaryCards}
          </div>
        )}
      </div>
    </Card>
  );
}

function buildPayloadFromState(state: WizardState) {
  return {
    business_name: state.companyName,
    tone: state.tone,
    language: state.language,
    sections: {
      header: {
        name: state.companyName,
        tagline: state.tagline,
        target_audience: state.targetAudience,
      },
      about: {
        overview: state.overview,
        differentiators: state.targetAudience,
      },
      services: state.packages.map(({ name, price, description }) => ({ name, price, description })),
      portfolio: state.projects.map(({ name, outcome, testimonial }) => ({ name, outcome, testimonial })),
      gallery: state.gallery.filter(Boolean),
      testimonials: state.projects
        .filter((project) => project.testimonial)
        .map((project) => ({ quote: project.testimonial, project: project.name })),
      contact: {
        email: state.contactEmail,
        phone: state.contactPhone,
        call_to_action: state.callToAction,
      },
      socials: state.socials.filter((item) => item.platform && item.url),
      media_preferences: {
        allow_ai_suggestions: state.allowAiMediaSuggestions,
        hero_image: state.heroImage,
        gallery: state.gallery.filter(Boolean),
      },
    },
    scope: 'Generate structured copy for each section. Use provided media notes to suggest image prompts if applicable.',
  };
}
