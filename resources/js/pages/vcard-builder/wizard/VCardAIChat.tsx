import React from 'react';
import axios from 'axios';
import { useTranslation } from 'react-i18next';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import { toast } from '@/components/custom-toast';
import { getBusinessTemplate, resolveBusinessType } from '../business-templates';

interface ChatMessage {
  id: string;
  role: 'assistant' | 'user';
  content: string;
}

interface VCardAIChatProps {
  userPlan?: Record<string, any>;
  planFeatures?: Record<string, any>;
  userRole?: string;
  businessName?: string | null;
  businessType?: string | null;
  defaultTone?: string;
  defaultLanguage?: string;
  onboardingSections?: Record<string, any> | null;
  onResult?: (sections: Record<string, any>, meta?: { reply?: string; done?: boolean; followUps?: string[] }) => void;
}

interface ChatResponse {
  reply?: string;
  sections?: Record<string, any>;
  follow_up_questions?: string[];
  suggested_fields?: Record<string, string>;
  done?: boolean;
}

const createMessageId = () => {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }
  return Math.random().toString(36).slice(2);
};

const SECTION_ORDER_OVERRIDES: Record<string, string[]> = {
  construction: [
    'hero',
    'service_highlights',
    'contact',
    'why_choose_us',
    'about',
    'projects',
    'process',
    'packages',
    'social',
    'cta_banner',
    'business_hours',
    'appointments',
    'testimonials',
    'contact_form',
    'footer',
    'copyright'
  ],
  'construction-sales': [
    'hero',
    'service_highlights',
    'contact',
    'why_choose_us',
    'about',
    'projects',
    'process',
    'packages',
    'social',
    'cta_banner',
    'business_hours',
    'appointments',
    'testimonials',
    'contact_form',
    'footer',
    'copyright'
  ]
};

const mergeValues = (target: any, source: any): any => {
  if (source === null || typeof source === 'undefined') {
    return target;
  }

  if (Array.isArray(source)) {
    return source;
  }

  if (typeof source === 'object' && source !== null) {
    const base = typeof target === 'object' && target !== null && !Array.isArray(target) ? target : {};
    const result: Record<string, any> = { ...base };
    Object.entries(source).forEach(([key, value]) => {
      result[key] = mergeValues(result[key], value);
    });
    return result;
  }

  return source;
};

const mergeSectionMap = (current: Record<string, any>, incoming: Record<string, any>): Record<string, any> => {
  const result: Record<string, any> = { ...current };

  Object.entries(incoming || {}).forEach(([sectionKey, sectionValue]) => {
    if (sectionKey === '_meta' || typeof sectionValue === 'undefined') {
      return;
    }
    result[sectionKey] = mergeValues(result[sectionKey], sectionValue);
  });

  return result;
};

const DEFAULT_ASSISTANT_GREETING = `Hi there! I'm your AI assistant. I'll guide you section by section and fill in your digital card automatically. We'll start with the basics about your business.`;

const QUICK_TONES = [
  { value: 'professional', label: 'Professional' },
  { value: 'friendly', label: 'Friendly' },
  { value: 'inspirational', label: 'Inspirational' },
  { value: 'conversational', label: 'Conversational' }
];

const QUICK_LANGUAGES = [
  { value: 'en', label: 'English' },
  { value: 'es', label: 'Spanish' },
  { value: 'fr', label: 'French' },
  { value: 'de', label: 'German' }
];

const MAX_INPUT_CHARS = 800;

const SECTION_PROMPTS: Record<string, string> = {
  hero:
    "Tell me your company name, what you do best, and the main call-to-action you'd like visitors to take (for example: request a quote, book a call).",
  service_highlights:
    'List your core services. For each, share a title and one sentence describing what makes it valuable.',
  why_choose_us:
    'Give me 2-3 reasons customers choose you. Mention differentiators like experience, certifications, guarantees, or success stories.',
  about:
    'Share your story, mission, experience, and any proof points that introduce your company.',
  projects:
    'Describe your standout projects. For each, include the project name, location, scope, and a key result or testimonial.',
  testimonials:
    'Provide customer testimonials. Include the client name, a short quote, and the project type if you have it.',
  process:
    'Outline the steps you follow from first contact to project completion. Share 3-5 steps with short descriptions.',
  packages:
    'List your packages or service tiers. Include the package name, what is included, and any pricing or timelines.',
  cta_banner:
    'What urgent offer or message should appear in the call-to-action banner? Include headline, supporting line, and desired button texts.',
  appointments:
    'How can customers book you? Share booking links, preferred contact method, and any key instructions.',
  contact_form:
    'What fields should the contact form collect, and what message encourages people to reach out?',
  contact:
    'Share your contact details: phone numbers, emails, physical address, and any map or directions.',
  business_hours:
    'Provide your business hours or availability for each day of the week.',
  social:
    'List the social media profiles or platforms you would like to feature, with full URLs.',
  language:
    'Do you need specific language preferences or translations noted?',
  seo:
    'List important keywords, page titles, and meta descriptions you want included for search engines.',
  pixels:
    'Provide any tracking pixels, analytics codes, or marketing tags to embed.',
  footer:
    'Share what should appear in the footer—navigation links, disclaimers, or additional notes.',
  copyright:
    'Provide the legal business name and current year for the copyright notice.'
};

const EXTERNALLY_MANAGED_SECTIONS = new Set(['service_highlights', 'packages', 'projects', 'gallery', 'contact']);

const filterExternallyManagedSections = (sections: Record<string, any> | null | undefined) => {
  if (!sections || typeof sections !== 'object') {
    return {} as Record<string, any>;
  }

  const result: Record<string, any> = {};

  Object.entries(sections).forEach(([key, value]) => {
    if (key.startsWith('_') || !EXTERNALLY_MANAGED_SECTIONS.has(key)) {
      result[key] = value;
    }
  });

  return result;
};

const formatSectionName = (key: string, label?: string) => {
  if (label && label.trim().length > 0) {
    return label;
  }

  return key
    .replace(/[-_]/g, ' ')
    .replace(/\b\w/g, (match) => match.toUpperCase());
};

const buildSectionQuestion = (sectionKey: string, sectionLabel?: string) => {
  const readableName = formatSectionName(sectionKey, sectionLabel);
  const prompt = SECTION_PROMPTS[sectionKey] ?? `Share the key details you want in the ${readableName} section.`;

  return `Let's work on the ${readableName} section. ${prompt} I will turn your notes into polished content.`;
};

interface SectionMeta {
  key: string;
  name?: string;
}

const hasSectionContent = (value: any): boolean => {
  if (value === null || typeof value === 'undefined') {
    return false;
  }

  if (typeof value === 'string') {
    return value.trim().length > 0;
  }

  if (typeof value === 'number' || typeof value === 'boolean') {
    return true;
  }

  if (Array.isArray(value)) {
    return value.some((item) => hasSectionContent(item));
  }

  if (typeof value === 'object') {
    return Object.values(value).some((item) => hasSectionContent(item));
  }

  return false;
};

const isSectionComplete = (sectionKey: string, sections: Record<string, any>, clarifying: string[] = []): boolean => {
  if (!sections || typeof sections !== 'object') {
    return false;
  }

  if (clarifying.includes(sectionKey)) {
    return false;
  }

  return hasSectionContent(sections[sectionKey]);
};

const VCardAIChat: React.FC<VCardAIChatProps> = ({
  userPlan,
  planFeatures,
  userRole,
  businessName,
  businessType,
  defaultTone = 'professional',
  defaultLanguage = 'en',
  onboardingSections,
  onResult
}) => {
  const { t } = useTranslation();

  const [messages, setMessages] = React.useState<ChatMessage[]>([
    {
      id: createMessageId(),
      role: 'assistant',
      content: t(DEFAULT_ASSISTANT_GREETING)
    }
  ]);
  const [inputValue, setInputValue] = React.useState('');
  const [isLoading, setIsLoading] = React.useState(false);
  const [tone, setTone] = React.useState(defaultTone);
  const [language, setLanguage] = React.useState(defaultLanguage);
  const [contextName, setContextName] = React.useState(businessName ?? '');
  const [contextType, setContextType] = React.useState(businessType ?? '');
  const [aggregatedSections, setAggregatedSections] = React.useState<Record<string, any>>(
    () => filterExternallyManagedSections(onboardingSections ?? {})
  );
  const [sectionFlow, setSectionFlow] = React.useState<SectionMeta[]>([]);
  const [currentSection, setCurrentSection] = React.useState<SectionMeta | null>(null);
  const [isConversationComplete, setConversationComplete] = React.useState(false);
  const [clarifyingSections, setClarifyingSections] = React.useState<string[]>([]);
  const viewportRef = React.useRef<HTMLDivElement>(null);
  const lastPromptedSectionRef = React.useRef<string | null>(null);
  const resolvedTypeRef = React.useRef<string>('');
  const completionAnnouncedRef = React.useRef(false);

  const templateSectionKeys = React.useMemo(() => sectionFlow.map((meta) => meta.key), [sectionFlow]);
  const completedSectionKeys = React.useMemo(
    () => sectionFlow.filter((meta) => isSectionComplete(meta.key, aggregatedSections, clarifyingSections)).map((meta) => meta.key),
    [sectionFlow, aggregatedSections, clarifyingSections]
  );
  const pendingSectionKeys = React.useMemo(
    () => sectionFlow.filter((meta) => !isSectionComplete(meta.key, aggregatedSections, clarifyingSections)).map((meta) => meta.key),
    [sectionFlow, aggregatedSections, clarifyingSections]
  );
  const requestedSectionKeys = React.useMemo(() => {
    const targets = new Set<string>();

    if (currentSection?.key) {
      targets.add(currentSection.key);
    }

    clarifyingSections.forEach((key) => {
      if (templateSectionKeys.includes(key)) {
        targets.add(key);
      }
    });

    pendingSectionKeys.slice(0, 3).forEach((key) => {
      if (templateSectionKeys.includes(key)) {
        targets.add(key);
      }
    });

    if (targets.size === 0 && templateSectionKeys.length > 0) {
      templateSectionKeys.slice(0, Math.min(2, templateSectionKeys.length)).forEach((key) => targets.add(key));
    }

    return Array.from(targets);
  }, [clarifyingSections, currentSection, pendingSectionKeys, templateSectionKeys]);
  const totalSections = sectionFlow.length;
  const completedCount = completedSectionKeys.length;
  const currentSectionLabel = currentSection ? formatSectionName(currentSection.key, currentSection.name) : null;

  const canUseAI = React.useMemo(() => {
    if (userRole === 'superadmin') return true;
    return planFeatures?.ai_integration === true;
  }, [planFeatures?.ai_integration, userRole]);

  React.useEffect(() => {
    if (viewportRef.current) {
      viewportRef.current.scrollTop = viewportRef.current.scrollHeight;
    }
  }, [messages]);

  const appendMessage = React.useCallback((message: ChatMessage) => {
    setMessages((prev) => [...prev, message]);
  }, []);

  React.useEffect(() => {
    const resolved = resolveBusinessType(contextType || businessType || resolvedTypeRef.current || '');
    resolvedTypeRef.current = resolved;

    const template = getBusinessTemplate(resolved);
    let templateSections: SectionMeta[] = Array.isArray(template?.sections)
      ? template.sections
          .filter((section: any) => section?.key)
          .map((section: any) => ({ key: section.key as string, name: section.name as string | undefined }))
      : [];

    templateSections = templateSections.filter((section) => !EXTERNALLY_MANAGED_SECTIONS.has(section.key));

    if (templateSections.length === 0) {
      const fallbackKeys = Object.keys(aggregatedSections || {}).filter(
        (key) => key !== '_allowed_sections' && key !== '_meta' && !EXTERNALLY_MANAGED_SECTIONS.has(key)
      );

      templateSections = fallbackKeys.map((key) => ({ key, name: formatSectionName(key) }));
    }

    const overrideOrder = SECTION_ORDER_OVERRIDES[resolved];
    if (overrideOrder && overrideOrder.length > 0 && templateSections.length > 0) {
      const sectionMap = new Map<string, SectionMeta>();
      templateSections.forEach((meta) => {
        sectionMap.set(meta.key, meta);
      });

      const ordered: SectionMeta[] = [];
      overrideOrder.forEach((key) => {
        const meta = sectionMap.get(key);
        if (meta) {
          ordered.push(meta);
          sectionMap.delete(key);
        }
      });

      sectionMap.forEach((meta) => {
        ordered.push(meta);
      });

      templateSections = ordered;
    }

    setSectionFlow((prev) => {
      const sameLength = prev.length === templateSections.length;
      const sameOrder =
        sameLength &&
        prev.every((item, index) => {
          const nextItem = templateSections[index];
          return item.key === nextItem.key && item.name === nextItem.name;
        });

      if (sameOrder) {
        return prev;
      }

      lastPromptedSectionRef.current = null;
      return templateSections;
    });
  }, [aggregatedSections, businessType, contextType]);

  React.useEffect(() => {
    if (sectionFlow.length === 0) {
      setCurrentSection(null);
      setConversationComplete(false);
      return;
    }

    const nextIncomplete = sectionFlow.find((meta) => !isSectionComplete(meta.key, aggregatedSections, clarifyingSections));

    setCurrentSection((previous) => {
      if (!nextIncomplete && !previous) {
        return previous;
      }

      if (nextIncomplete && previous && nextIncomplete.key === previous.key) {
        return previous;
      }

      return nextIncomplete ?? null;
    });

    setConversationComplete(!nextIncomplete);
  }, [sectionFlow, aggregatedSections, clarifyingSections]);

  React.useEffect(() => {
    if (!isConversationComplete) {
      completionAnnouncedRef.current = false;
    }
  }, [isConversationComplete]);

  React.useEffect(() => {
    if (!currentSection || isConversationComplete) {
      return;
    }

    const sectionKey = currentSection.key;
    if (!sectionKey || lastPromptedSectionRef.current === sectionKey) {
      return;
    }

    const question = buildSectionQuestion(sectionKey, currentSection.name);

    lastPromptedSectionRef.current = sectionKey;
    completionAnnouncedRef.current = false;
    appendMessage({
      id: createMessageId(),
      role: 'assistant',
      content: question
    });
  }, [appendMessage, currentSection, isConversationComplete]);

  React.useEffect(() => {
    if (!isConversationComplete || completionAnnouncedRef.current) {
      return;
    }

    completionAnnouncedRef.current = true;
    appendMessage({
      id: createMessageId(),
      role: 'assistant',
      content: t('Great! I have filled in every section. You can review and make adjustments anytime or tell me what to tweak.')
    });
  }, [appendMessage, isConversationComplete, t]);

  const handleAssistantReply = React.useCallback(
    (response: ChatResponse) => {
      const assistantMessage: ChatMessage = {
        id: createMessageId(),
        role: 'assistant',
        content: response.reply || t('I have updated your sections. Let me know if you want to adjust anything else!')
      };

      appendMessage(assistantMessage);

      const sanitizedIncoming = filterExternallyManagedSections(response.sections || {});
      const nextSections = mergeSectionMap(aggregatedSections, sanitizedIncoming);
      const filteredNextSections = filterExternallyManagedSections(nextSections);
      setAggregatedSections(filteredNextSections);
      completionAnnouncedRef.current = false;
      onResult?.(filteredNextSections, {
        reply: response.reply,
        done: response.done,
        followUps: response.follow_up_questions
      });
    },
    [aggregatedSections, appendMessage, currentSection, onResult, sectionFlow, t]
  );

  const handleSend = async (value?: string) => {
    const text = (value ?? inputValue).trim();
    if (!text || !canUseAI || isLoading) {
      return;
    }

    const userMessage: ChatMessage = {
      id: createMessageId(),
      role: 'user',
      content: text
    };

    setInputValue('');
    appendMessage(userMessage);
    setIsLoading(true);

    try {
      const payload = {
        business_name: contextName || undefined,
        business_type: contextType || undefined,
        tone,
        language,
        sections: aggregatedSections,
        active_section: currentSection?.key,
        section_label: currentSection?.name,
        template_sections: templateSectionKeys,
        requested_sections: requestedSectionKeys,
        pending_sections: pendingSectionKeys,
        completed_sections: completedSectionKeys,
        chat: [...messages, userMessage].map((message) => ({
          role: message.role,
          content: message.content
        }))
      };

      const response = await axios.post(route('vcard-builder.ai.chat'), payload);

      if (response.data?.success) {
        handleAssistantReply(response.data.data as ChatResponse);
      } else {
        const error = response.data?.message ?? t('Unable to generate AI response. Please try again.');
        toast.error(error);
      }
    } catch (error: any) {
      const message = error?.response?.data?.message ?? t('Unable to generate AI response. Please try again later.');
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFollowUpClick = (question: string) => {
    handleSend(question);
  };

  const disabledReason = React.useMemo(() => {
    if (canUseAI) return null;
    if (userPlan?.name) {
      return t('AI chat is not included in your current plan ({{plan}}). Upgrade to unlock this feature.', {
        plan: userPlan.name
      });
    }
    return t('AI chat is not available for your account.');
  }, [canUseAI, t, userPlan?.name]);

  return (
    <Card className="border border-dashed">
      <div className="border-b bg-muted/30 px-6 py-4">
        <div className="flex flex-col gap-1">
          <h2 className="text-lg font-semibold">{t('AI Conversation')}</h2>
          <p className="text-sm text-muted-foreground">
            {t('Chat with the assistant to fill in your business card automatically. We will save each section as we go.')}
          </p>
        </div>
      </div>

      <div className="grid gap-6 p-6">
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg border bg-muted/10 px-4 py-3 text-sm text-muted-foreground">
          <div className="flex flex-col">
            <span className="font-medium text-foreground">
              {t('Progress: {{completed}} of {{total}} sections complete', { completed: completedCount, total: totalSections })}
            </span>
            {currentSectionLabel && !isConversationComplete && (
              <span>
                {t('Currently collecting: {{section}}', {
                  section: currentSectionLabel
                })}
              </span>
            )}
            {isConversationComplete && (
              <span>{t('All sections are filled. Ask me for tweaks or more ideas!')}</span>
            )}
          </div>
        </div>

        <div className="grid gap-4 rounded-lg border bg-muted/20 p-4">
          <div className="grid gap-2 sm:grid-cols-2">
            <div className="grid gap-1.5">
              <Label htmlFor="business_name">{t('Business name')}</Label>
              <Input
                id="business_name"
                value={contextName}
                placeholder={t('e.g. Horizon Builders') as string}
                onChange={(event) => setContextName(event.target.value)}
              />
            </div>
            <div className="grid gap-1.5">
              <Label htmlFor="business_type">{t('Business category')}</Label>
              <Input
                id="business_type"
                value={contextType}
                placeholder={t('e.g. construction, agency, salon') as string}
                onChange={(event) => setContextType(event.target.value)}
              />
            </div>
          </div>

          <div className="flex flex-wrap gap-4">
            <div className="flex flex-col gap-1">
              <Label>{t('Tone')}</Label>
              <div className="flex flex-wrap gap-2">
                {QUICK_TONES.map((option) => (
                  <Button
                    key={option.value}
                    type="button"
                    size="sm"
                    variant={tone === option.value ? 'default' : 'outline'}
                    onClick={() => setTone(option.value)}
                  >
                    {t(option.label)}
                  </Button>
                ))}
              </div>
            </div>
            <div className="flex flex-col gap-1">
              <Label>{t('Language')}</Label>
              <div className="flex flex-wrap gap-2">
                {QUICK_LANGUAGES.map((option) => (
                  <Button
                    key={option.value}
                    type="button"
                    size="sm"
                    variant={language === option.value ? 'default' : 'outline'}
                    onClick={() => setLanguage(option.value)}
                  >
                    {t(option.label)}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <div className="relative rounded-lg border bg-background">
            <ScrollArea className="h-[22rem]">
              <div ref={viewportRef} className="flex flex-col gap-3 p-4">
                {messages.map((message) => (
                  <div key={message.id} className="rounded-xl border bg-muted/30 px-4 py-3 text-sm">
                    <div className="mb-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                      {message.role === 'assistant' ? t('Assistant') : t('You')}
                    </div>
                    <div className="whitespace-pre-wrap text-foreground">{message.content}</div>
                  </div>
                ))}
                {isLoading && (
                  <div className="flex justify-start">
                    <div className="flex items-center gap-2 rounded-2xl bg-muted px-4 py-2 text-sm text-muted-foreground">
                      <span className="inline-flex h-2 w-2 animate-ping rounded-full bg-primary" />
                      {t('Assistant is thinking...')}
                    </div>
                  </div>
                )}
              </div>
            </ScrollArea>
          </div>
        </div>

        <div className="grid gap-2">
          <Label htmlFor="chat_message">{t('Your message')}</Label>
          <Textarea
            id="chat_message"
            placeholder={t('Share details about your services, clients, experience, or anything else you want on the card.') as string}
            rows={3}
            maxLength={MAX_INPUT_CHARS}
            value={inputValue}
            onChange={(event) => setInputValue(event.target.value)}
            disabled={!canUseAI || isLoading}
          />
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>{t('{{count}} characters remaining', { count: MAX_INPUT_CHARS - inputValue.length })}</span>
            {!canUseAI && disabledReason && <span className="text-amber-600">{disabledReason}</span>}
          </div>
          <div className="flex justify-end">
            <Button onClick={() => handleSend()} disabled={!canUseAI || isLoading || !inputValue.trim()}>
              {isLoading ? t('Sending...') : t('Send message')}
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default VCardAIChat;
