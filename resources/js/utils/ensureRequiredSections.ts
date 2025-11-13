/**
 * Helper function to ensure all required sections are displayed in templates
 */
const ESSENTIAL_SECTIONS = ['colors', 'font', 'language', 'pwa', 'seo', 'pixels', '_allowed_sections'];

const isManagedSection = (value: any): boolean => {
  if (!value || typeof value !== 'object') {
    return false;
  }

  if ('managed_by_catalog' in value && value.managed_by_catalog) {
    return true;
  }

  if ('managed_by_gallery' in value && value.managed_by_gallery) {
    return true;
  }

  return false;
};

const mergeSection = (defaultValue: any, configValue: any) => {
  if (isManagedSection(configValue)) {
    return configValue;
  }

  if (Array.isArray(configValue)) {
    if (configValue.length > 0) {
      return configValue;
    }
    return Array.isArray(defaultValue) ? defaultValue : configValue;
  }

  if (configValue && typeof configValue === 'object') {
    const base = defaultValue && typeof defaultValue === 'object' ? defaultValue : {};
    return { ...base, ...configValue };
  }

  if (configValue === null || configValue === undefined || configValue === '') {
    if (defaultValue && typeof defaultValue === 'object') {
      return defaultValue;
    }
  }

  return configValue !== undefined ? configValue : (defaultValue ?? {});
};

export function ensureRequiredSections(configSections: any = {}, defaultSections: any = {}) {
  const allowedSections = configSections._allowed_sections;
  const candidateKeys = new Set<string>([
    ...Object.keys(defaultSections || {}),
    ...Object.keys(configSections || {})
  ]);

  const enhancedSections: any = {};

  candidateKeys.forEach((key) => {
    const configValue = configSections[key];
    const defaultValue = defaultSections[key];

    if (key === '_allowed_sections') {
      enhancedSections[key] = Array.isArray(configValue) ? configValue : configValue ?? defaultValue ?? [];
      return;
    }

    if (allowedSections && Array.isArray(allowedSections)) {
      if (!allowedSections.includes(key) && !ESSENTIAL_SECTIONS.includes(key)) {
        return;
      }
    }

    const merged = mergeSection(defaultValue, configValue);
    enhancedSections[key] = merged && typeof merged === 'object' ? merged : mergeSection(defaultValue, {});
  });

  return enhancedSections;
}