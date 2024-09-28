const adminTranslations: Record<string, string> = {};

export function translateAdminKey(...keys: string[]): string {
  const key = keys.join(".");
  return adminTranslations[key] || key;
}
