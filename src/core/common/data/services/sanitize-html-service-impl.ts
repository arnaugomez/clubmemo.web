import DOMPurify, { DOMPurifyI } from "dompurify";
import { JSDOM } from "jsdom";
import { SanitizeHtmlService } from "../../domain/interfaces/sanitize-html-service";

export class SanitizeHtmlServiceImpl implements SanitizeHtmlService {
  private readonly domPurify: DOMPurifyI;
  constructor() {
    const window = new JSDOM().window;
    this.domPurify = DOMPurify(window);
  }
  sanitize(html: string): string {
    return this.domPurify.sanitize(html);
  }
  getText(html: string): string {
    return this.domPurify.sanitize(html, { ALLOWED_TAGS: ["#text"] });
  }
}
