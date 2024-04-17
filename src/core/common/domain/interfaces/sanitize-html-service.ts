export interface SanitizeHtmlService {
  sanitize(html: string): string;
  getText(html: string): string;
}
