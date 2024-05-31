import type { CookieService } from "@/src/common/domain/interfaces/cookie-service";
import type { AuthService } from "../interfaces/auth-service";
import type { CheckSessionModel } from "../models/check-session-model";
import { emptyCheckSession } from "../models/check-session-model";

/**
 * Gets the current session of the user from the session cookie. If the
 * session cookie does not exist or if it expired, it returns an empty
 * object.
 */
export class GetSessionUseCase {
  constructor(
    private readonly authService: AuthService,
    private readonly cookieService: CookieService,
  ) {}

  /**
   * Gets the current session of the user from the session cookie. If the
   * session cookie does not exist or if it expired, it returns an empty object.
   */
  async execute(): Promise<CheckSessionModel> {
    const sessionCookieName = this.authService.getSessionCookieName();
    const sessionId = this.cookieService.get(sessionCookieName);
    if (!sessionId) return emptyCheckSession;

    const result = await this.authService.validateSession(sessionId);

    // next.js throws when you attempt to set cookie in Server Components
    try {
      if (result.session && result.session.fresh) {
        const sessionCookie = this.authService.createSessionCookie(
          result.session.id,
        );
        this.cookieService.set(sessionCookie);
      }
      if (!result.session) {
        const sessionCookie = this.authService.createBlankSessionCookie();
        this.cookieService.set(sessionCookie);
      }
    } catch {}
    return result;
  }
}
