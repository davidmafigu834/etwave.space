import React from 'react';
import VCardBuilderForm from './form';
import { OnboardingProfileData } from '@/types/onboarding';

interface Props {
  userPlan?: any;
  userRole?: string;
  planFeatures?: any;
  onboardingProfile?: OnboardingProfileData | null;
}

export default function VCardBuilderCreate({ userPlan, userRole, planFeatures, onboardingProfile }: Props) {
  const [aiResult, setAiResult] = React.useState<Record<string, any> | null>(null);

  return (
    <VCardBuilderForm
      userPlan={userPlan}
      userRole={userRole}
      planFeatures={planFeatures}
      aiPrefill={aiResult}
      onboardingProfile={onboardingProfile}
      onAiPrefill={(sections) => setAiResult({ ...(sections || {}) })}
    />
  );
}