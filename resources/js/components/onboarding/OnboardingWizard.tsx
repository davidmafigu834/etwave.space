import React from 'react';
import { usePage } from '@inertiajs/react';
import DashboardOnboardingWizard, { OnboardingProfileData } from '@/pages/components/onboarding/DashboardOnboardingWizard';

const OnboardingWizard: React.FC = () => {
  const page = usePage();
  const auth = (page.props as any)?.auth;
  const profile = auth?.user?.onboardingProfile || auth?.user?.onboarding_profile;

  const shouldShow = React.useMemo(() => {
    if (!auth?.user) return false;

    // Only show for company users for now
    if (auth.user.type && !['company'].includes(auth.user.type)) {
      return false;
    }

    return !profile?.completed_at;
  }, [auth?.user, profile?.completed_at]);

  const [open, setOpen] = React.useState(shouldShow);
  const [latestProfile, setLatestProfile] = React.useState<OnboardingProfileData | null | undefined>(profile);

  React.useEffect(() => {
    if (shouldShow) {
      setOpen(true);
      setLatestProfile(profile);
    } else if (!shouldShow && profile?.completed_at) {
      setOpen(false);
      setLatestProfile(profile);
    }
  }, [shouldShow, profile]);

  React.useEffect(() => {
    const handler = () => {
      setOpen(true);
    };

    window.addEventListener('open-onboarding-wizard', handler);
    return () => window.removeEventListener('open-onboarding-wizard', handler);
  }, []);

  if (!auth?.user) {
    return null;
  }

  return (
    <DashboardOnboardingWizard
      open={open}
      onOpenChange={setOpen}
      profile={latestProfile}
      onProfileUpdate={setLatestProfile}
    />
  );
};

export default OnboardingWizard;
