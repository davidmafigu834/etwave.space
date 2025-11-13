import React from 'react';
import axios from 'axios';
import { useTranslation } from 'react-i18next';
import { Card } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { toast } from '@/components/custom-toast';

interface VCardAIInstructionBoxProps {
  userPlan?: Record<string, any>;
  planFeatures?: Record<string, any>;
  userRole?: string;
  onboardingProfile?: {
    business_name?: string | null;
    business_category?: string | null;
  } | null;
  sections?: Record<string, any>;
  businessName?: string | null;
  businessType?: string | null;
  templateSections?: string[];
  onResult?: (sections: Record<string, any>, meta?: any) => void;
}

const MAX_CHARS = 1900;

const VCardAIInstructionBox: React.FC<VCardAIInstructionBoxProps> = ({
  userPlan,
  planFeatures,
  userRole,
  onboardingProfile,
  sections: existingSections,
  businessName,
  businessType,
  templateSections,
  onResult
}) => {
  const { t } = useTranslation();
  const [instructions, setInstructions] = React.useState('');
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const canUseAI = React.useMemo(() => {
    if (userRole === 'superadmin') {
      return true;
    }
    return planFeatures?.ai_integration === true;
  }, [planFeatures?.ai_integration, userRole]);

  const disabledReason = React.useMemo(() => {
    if (canUseAI) {
      return null;
    }

    if (userPlan?.name) {
      return t('AI content generation is not included in your current plan ({{plan}}).', {
        plan: userPlan.name
      });
    }

    return t('AI content generation is not available for your account.');
  }, [canUseAI, t, userPlan?.name]);

  const handleGenerate = async () => {
    const trimmed = instructions.trim();
    if (!trimmed || !canUseAI || isSubmitting) {
      if (!trimmed) {
        toast.error(t('Please provide some details about your business before generating.'));
      }
      return;
    }

    setIsSubmitting(true);

    try {
      const payload: Record<string, any> = {
        business_name: businessName ?? onboardingProfile?.business_name ?? undefined,
        business_type: businessType ?? onboardingProfile?.business_category ?? undefined,
        tone: 'professional',
        language: 'en',
        sections: existingSections ?? {},
        template_sections: templateSections && templateSections.length > 0 ? templateSections : undefined,
        chat: [
          {
            role: 'user',
            content: trimmed
          }
        ]
      };

      const response = await axios.post(route('vcard-builder.ai.chat'), payload);

      if (!response.data?.success) {
        throw new Error(response.data?.message || 'Unable to generate content.');
      }

      const data: Record<string, any> = response.data.data ?? {};
      const fetchedSections: Record<string, any> = data.sections ?? {};

      if (process.env.NODE_ENV !== 'production') {
        // eslint-disable-next-line no-console
        console.log('[VCardAIInstructionBox] AI response sections', fetchedSections);
      }

      onResult?.(fetchedSections, data);
      toast.success(t('Draft content created. Review and adjust any sections you need.'));
      setInstructions('');
    } catch (error: any) {
      const message =
        error?.response?.data?.message ||
        error?.message ||
        t('Unable to generate AI content. Please try again.');
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="border-dashed bg-muted/30">
      <div className="flex flex-col gap-4 p-6">
        <div className="space-y-1">
          <h2 className="text-lg font-semibold">{t('AI Content Assistant')}</h2>
          <p className="text-sm text-muted-foreground">
            {t('Share the key details about your business, services, projects, and offers. The assistant will use this to fill every section automatically.')}
          </p>
        </div>

        <div className="grid gap-2">
          <Label htmlFor="ai-brief">{t('Tell us about your business')}</Label>
          <Textarea
            id="ai-brief"
            value={instructions}
            onChange={(event) => setInstructions(event.target.value)}
            placeholder={t('For example: We are a construction company specialising in painting services, renovations, and home maintenance packages. Our hero call-to-action should invite visitors to request a quote. Include 3 core services, 2 featured projects, customer testimonials, package tiers, and contact details including phone, email, and address.') as string}
            rows={6}
            maxLength={MAX_CHARS}
            disabled={!canUseAI || isSubmitting}
          />
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>{t('{{count}} characters remaining', { count: MAX_CHARS - instructions.length })}</span>
            {!canUseAI && disabledReason ? <span className="text-amber-600">{disabledReason}</span> : null}
          </div>
        </div>

        <div className="flex items-center justify-end gap-3">
          <Button
            type="button"
            onClick={handleGenerate}
            disabled={!canUseAI || isSubmitting || !instructions.trim()}
          >
            {isSubmitting ? t('Working...') : t('Generate all sections')}
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default VCardAIInstructionBox;
