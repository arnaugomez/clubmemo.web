const adminTranslations: Record<string, string> = {};

export const translateAdminKey = (key: string): string =>
  adminTranslations[key] || key;
