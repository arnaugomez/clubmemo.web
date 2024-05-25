import { cookies } from "next/headers";
import type { AuthService } from "../interfaces/auth-service";
import type { CheckSessionModel } from "../models/check-session-model";
import { emptyCheckSession } from "../models/check-session-model";

export class GetSessionUseCase {
  constructor(private readonly authService: AuthService) {}

  async execute(): Promise<CheckSessionModel> {
    const sessionCookieName = this.authService.getSessionCookieName();
    const sessionId = cookies().get(sessionCookieName)?.value ?? null;
    if (!sessionId) return emptyCheckSession;

    const result = await this.authService.validateSession(sessionId);

    // next.js throws when you attempt to set cookie when rendering page
    try {
      if (result.session && result.session.fresh) {
        const sessionCookie = this.authService.createSessionCookie(
          result.session.id,
        );
        cookies().set(
          sessionCookie.name,
          sessionCookie.value,
          sessionCookie.attributes,
        );
      }
      if (!result.session) {
        const sessionCookie = this.authService.createBlankSessionCookie();
        cookies().set(
          sessionCookie.name,
          sessionCookie.value,
          sessionCookie.attributes,
        );
      }
    } catch {}
    return result;
  }
}
