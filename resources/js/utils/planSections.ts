export const normalizeAllowedSections = (sections: unknown): string[] | null => {
  if (!sections) {
    return null;
  }

  if (Array.isArray(sections)) {
    const sanitized = sections
      .filter((value): value is string => typeof value === 'string')
      .map(value => value.trim())
      .filter(Boolean);

    return sanitized.length ? Array.from(new Set(sanitized)) : null;
  }

  if (typeof sections === 'string') {
    const trimmed = sections.trim();

    if (!trimmed || trimmed.toLowerCase() === 'all' || trimmed === '*') {
      return null;
    }

    if ((trimmed.startsWith('[') && trimmed.endsWith(']')) || (trimmed.startsWith('{') && trimmed.endsWith('}'))) {
      try {
        const parsed = JSON.parse(trimmed);
        return normalizeAllowedSections(parsed);
      } catch (error) {
        // Ignore JSON parse errors and fall back to comma separated parsing
      }
    }

    const parts = trimmed.split(',').map(part => part.trim()).filter(Boolean);
    if (parts.length <= 1) {
      return parts.length === 1 ? parts : null;
    }

    return Array.from(new Set(parts));
  }

  if (typeof sections === 'object' && sections !== null) {
    const values = Object.values(sections)
      .filter((value): value is string => typeof value === 'string')
      .map(value => value.trim())
      .filter(Boolean);

    return values.length ? Array.from(new Set(values)) : null;
  }

  return null;
};
