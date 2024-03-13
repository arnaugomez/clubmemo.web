import { cookies } from "next/headers";
import { cache } from "react";

import { locator } from "./core/app/locator";
import { CheckSessionModel } from "./core/auth/domain/models/check-session-model";

export const checkSession = cache(async (): Promise<CheckSessionModel> => {
  const authService = locator.AuthService();
  const sessionId =
    cookies().get(authService.getSessionCookieName())?.value ?? null;
  if (!sessionId) {
    return {
      user: null,
      session: null,
    };
  }

  const result = await locator.AuthService().validateSession(sessionId);

  // next.js throws when you attempt to set cookie when rendering page
  try {
    if (result.session && result.session.fresh) {
      const sessionCookie = authService.createSessionCookie(result.session.id);
      cookies().set(
        sessionCookie.name,
        sessionCookie.value,
        sessionCookie.attributes,
      );
    }
    if (!result.session) {
      const sessionCookie = authService.createBlankSessionCookie();
      cookies().set(
        sessionCookie.name,
        sessionCookie.value,
        sessionCookie.attributes,
      );
    }
  } catch {}
  return result;
});
